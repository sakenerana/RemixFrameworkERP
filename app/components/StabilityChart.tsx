import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Tooltip } from "recharts";

const data = [
  { name: "<1 Year", value: 9 },
  { name: "1+ Years", value: 35 },
  { name: "2+ Years", value: 20 },
  { name: "3+ Years", value: 22 },
  { name: "4+ Years", value: 12 },
  { name: "5+ Years", value: 20 },
];

const StabilityChart = () => (
  <div className="chart-card opacity-0 animate-fade-in" style={{ animationDelay: "700ms" }}>
    <h3 className="text-sm font-semibold text-foreground mb-4">Stability %</h3>
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 14% 90%)" horizontal={false} />
        <XAxis type="number" tick={{ fill: "hsl(220 10% 46%)", fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis dataKey="name" type="category" width={70} tick={{ fill: "hsl(220 10% 46%)", fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ background: "hsl(0 0% 100%)", border: "1px solid hsl(220 14% 90%)", borderRadius: 8, fontSize: 12 }}
          itemStyle={{ color: "hsl(220 20% 12%)" }}
        />
        <Bar dataKey="value" fill="hsl(210 80% 52%)" radius={[0, 4, 4, 0]} barSize={16} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default StabilityChart;
