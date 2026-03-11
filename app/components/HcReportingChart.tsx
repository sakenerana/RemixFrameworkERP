import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";

const data = [
  { name: "Ryan Simmons", value: 42 },
  { name: "Janelle Wiley", value: 26 },
  { name: "Roberta Moyer", value: 18 },
  { name: "Alejandra Mack", value: 12 },
  { name: "Darryl Leon", value: 9 },
  { name: "Jefferson Perry", value: 7 },
  { name: "Geneva Hardy", value: 4 },
];

const HcReportingChart = () => (
  <div className="chart-card opacity-0 animate-fade-in" style={{ animationDelay: "500ms" }}>
    <h3 className="text-sm font-semibold text-foreground mb-4">HC Reporting</h3>
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 14% 90%)" horizontal={false} />
        <XAxis type="number" tick={{ fill: "hsl(220 10% 46%)", fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis dataKey="name" type="category" width={100} tick={{ fill: "hsl(220 10% 46%)", fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ background: "hsl(0 0% 100%)", border: "1px solid hsl(220 14% 90%)", borderRadius: 8, fontSize: 12 }}
          itemStyle={{ color: "hsl(220 20% 12%)" }}
        />
        <Bar dataKey="value" fill="hsl(220 72% 50%)" radius={[0, 4, 4, 0]} barSize={16} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default HcReportingChart;
