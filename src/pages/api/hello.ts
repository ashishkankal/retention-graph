// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import { promises as fs } from "fs";

export const getTotalUsers = (data = []) => {
  const users = data.map((u) => u["user_id"]);
  return new Set(users).size;
};

export const getRecipes = (data = []) => {
  const recipes = data.map((u) => u["recipe"]);
  return Array.from(new Set(recipes));
};

export const getTotalRuns = (data = []) => {
  const runs = data.map((u) => u["run_id"]);
  return new Set(runs).size;
};

function calculateMonthlyRetentionRate(monthlyRetention: any) {
  // Calculate the final retention rate
  const retentionRates: { [key: string]: any } = {};
  for (const month in monthlyRetention) {
    const { totalUsers, retainedUsers } = monthlyRetention[month];
    retentionRates[month] = retainedUsers / totalUsers || 0;
  }

  return retentionRates;
}
function calculateMonthlyUsers(_data = [], recipe = "") {
  let data = _data;
  if (recipe) {
    data = _data.filter((item: any) => item.recipe === recipe);
  }
  data.sort(
    (a: any, b: any) =>
      a.user_id.localeCompare(b.user_id) ||
      a.timestamp.localeCompare(b.timestamp)
  );

  const monthlyRetention = {};
  const userLastSeen: { [key: string]: any } = {};

  data.forEach((entry) => {
    const { user_id, timestamp } = entry;
    const month = timestamp.substring(0, 7);

    if (!userLastSeen[user_id]) {
      // If this is the first time we encounter the user, mark them as seen
      userLastSeen[user_id] = month;
    } else {
      // If the user was seen before, calculate the retention
      const lastSeenMonth = userLastSeen[user_id];
      if (!monthlyRetention[lastSeenMonth]) {
        monthlyRetention[lastSeenMonth] = { totalUsers: 0, retainedUsers: 0 };
      }

      monthlyRetention[lastSeenMonth].totalUsers++;

      if (lastSeenMonth !== month) {
        monthlyRetention[lastSeenMonth].retainedUsers++;
        userLastSeen[user_id] = month;
      }
    }
  });
  return monthlyRetention;
}

const mapChartData = (data: any, valueMaker: any = () => {}) => {
  const sortedData = Object.entries(data)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map((item) => ({
      name: item[0],
      value: valueMaker(item[1]),
    }));

  return sortedData;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const jsonDirectory = path.join(process.cwd(), "src");
  const fileContents = await fs.readFile(
    jsonDirectory + "/gooey_inferences.json",
    "utf8"
  );
  const jsonData = JSON.parse(fileContents);
  const totalUsers = getTotalUsers(jsonData);
  const recipes = getRecipes(jsonData);
  const totalRecipes = recipes.length;
  const totalRuns = getTotalRuns(jsonData);
  const monthlyUsers = calculateMonthlyUsers(jsonData);
  const retainedUsers: any = {
    all: mapChartData(
      calculateMonthlyRetentionRate(monthlyUsers),
      (v: any) => v * 100
    ),
  };

  recipes.forEach((r) => {
    retainedUsers[r] = mapChartData(
      calculateMonthlyRetentionRate(calculateMonthlyUsers(jsonData, r)),
      (v: any) => v * 100
    );
  });
  res.status(200).json({
    totalUsers,
    totalRecipes,
    user: jsonData[0],
    recipes,
    retainedUsers,
    monthlyUsers: mapChartData(monthlyUsers, (v: any) => v.totalUsers),
    totalRuns,
  });
}
