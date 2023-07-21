import { Inter } from "next/font/google";
import StatCard from "@/components/StatCard";
import Chart from "@/components/Chart";
import { MonthlyActiveUsers } from "@/components/MonthlyActiveUsers";
import { Flame, Play, Users2Icon } from "lucide-react";
import { GetServerSideProps } from "next";
const inter = Inter({ subsets: ["latin"] });

export default function Home({ data = {} }: any) {
  return (
    <main
      className={`flex min-h-screen flex-col p-4 lg:p-24 ${inter.className}`}
    >
      <h1 className="text-3xl font-semibold">Retention Analysis</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-4">
        <StatCard
          value={data.totalUsers}
          title="Total Users"
          icon={<Users2Icon size={16} />}
        />
        <StatCard
          value={data.totalRecipes}
          title="Total Recipes"
          icon={<Flame size={16} />}
        />
        <StatCard
          value={data.totalRuns}
          title="Total Runs"
          icon={<Play size={16} />}
        />
      </div>
      <div className="grid gap-4  lg:grid-cols-8 mt-4">
        <Chart data={data.retainedUsers} recipes={data.recipes} />
        <MonthlyActiveUsers data={data.monthlyUsers} />
      </div>
    </main>
  );
}

export const getServerSideProps = async () => {
  const BASE_URL =
    process.env.NODE_ENV !== "production" ? "http://localhost:3000" : "";
  const resp = await fetch(`${BASE_URL}/api/hello`);
  const data = await resp.json();

  return { props: { data } };
};
