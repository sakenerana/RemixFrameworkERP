import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Tooltip, Cell } from "recharts";

const data = [
  { name: "Management", value: 21, color: "hsl(0 72% 51%)" },
  { name: "Professional", value: 43, color: "hsl(38 92% 50%)" },
  { name: "Trainees", value: 41, color: "hsl(152 60% 40%)" },
  { name: "Contract", value: 13, color: "hsl(210 80% 52%)" },
];

const JobLevelChart = () => (
  <div className="chart-card opacity-0 animate-fade-in" style={{ animationDelay: "350ms" }}>
    <h3 className="text-sm font-semibold text-foreground mb-4">Job Level %</h3>
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 14% 90%)" horizontal={false} />
        <XAxis type="number" tick={{ fill: "hsl(220 10% 46%)", fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis dataKey="name" type="category" width={85} tick={{ fill: "hsl(220 10% 46%)", fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ background: "hsl(0 0% 100%)", border: "1px solid hsl(220 14% 90%)", borderRadius: 8, fontSize: 12 }}
          itemStyle={{ color: "hsl(220 20% 12%)" }}
        />
        <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
          {data.map((d, i) => (
            <Cell key={i} fill={d.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default JobLevelChart;
