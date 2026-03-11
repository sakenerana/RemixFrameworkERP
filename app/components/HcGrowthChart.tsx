import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

const data = [
  { year: "2020", attrition: 12, onBoard: 23, transfer: 10, hcGrowth: 23 },
  { year: "2021", attrition: 15, onBoard: 35, transfer: 19, hcGrowth: 54 },
  { year: "2022", attrition: 18, onBoard: 30, transfer: 14, hcGrowth: 84 },
  { year: "2023", attrition: 25, onBoard: 22, transfer: 9, hcGrowth: 109 },
  { year: "2024", attrition: 9, onBoard: 15, transfer: 5, hcGrowth: 118 },
  { year: "2025", attrition: 5, onBoard: 10, transfer: 3, hcGrowth: 131 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload) return null;
  return (
    <div className="glass-card p-3 !bg-card border border-border text-xs space-y-1">
      <p className="font-semibold text-foreground">{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-muted-foreground capitalize">{p.dataKey}:</span>
          <span className="text-foreground font-medium">{p.value}</span>
        </div>
      ))}
    </div>
  );
};

const HcGrowthChart = () => (
  <div className="chart-card opacity-0 animate-fade-in" style={{ animationDelay: "200ms" }}>
    <h3 className="text-sm font-semibold text-foreground mb-4">HC Growth</h3>
    <ResponsiveContainer width="100%" height={260}>
      <ComposedChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 14% 90%)" vertical={false} />
        <XAxis dataKey="year" tick={{ fill: "hsl(220 10% 46%)", fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: "hsl(220 10% 46%)", fontSize: 12 }} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, color: "hsl(220 10% 46%)" }} />
        <Bar dataKey="attrition" fill="hsl(0 72% 51%)" radius={[3, 3, 0, 0]} barSize={14} />
        <Bar dataKey="onBoard" fill="hsl(152 60% 40%)" radius={[3, 3, 0, 0]} barSize={14} />
        <Bar dataKey="transfer" fill="hsl(38 92% 50%)" radius={[3, 3, 0, 0]} barSize={14} />
        <Line type="monotone" dataKey="hcGrowth" stroke="hsl(220 72% 50%)" strokeWidth={2.5} dot={{ fill: "hsl(220 72% 50%)", r: 4 }} />
      </ComposedChart>
    </ResponsiveContainer>
  </div>
);

export default HcGrowthChart;
