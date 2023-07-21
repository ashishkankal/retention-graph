import React, { useState } from "react";

import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import RecipeSelector from "./RecipeSelector";

const Chart = ({ data, recipes }: any) => {
  const [value, setValue] = useState("all");
  return (
    <Card className="lg:col-span-5">
      <CardHeader className="flex justify-between md:flex-row items-baseline">
        <CardTitle>Retention</CardTitle>
        <RecipeSelector
          data={recipes}
          onChange={(e: string) => setValue(e)}
          value={value}
        />
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <LineChart width={300} height={100} data={data[value]}>
            <XAxis
              dataKey="name"
              stroke="#888888"
              fontSize={10}
              tickLine={false}
            />
            <YAxis
              stroke="#888888"
              dataKey="value"
              fontSize={12}
              tickLine={false}
            />
            <Tooltip wrapperClassName="text-xs" />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#8884d8"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default Chart;
