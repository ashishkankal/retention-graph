import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export function MonthlyActiveUsers({ data }: any) {
  return (
    <Card className="lg:col-span-3">
      <CardHeader>
        <CardTitle>Monthly Active Users</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <XAxis
              dataKey="name"
              stroke="#888888"
              fontSize={8}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />

            <Bar
              dataKey="value"
              fill="#adfa1d"
              radius={[4, 4, 0, 0]}
              label={{ position: "top", className: "hidden md:block text-xs" }}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
