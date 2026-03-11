import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const data = [
  { name: "Accounting", value: 18 },
  { name: "Finance", value: 8 },
  { name: "HR", value: 14 },
  { name: "Legal", value: 9 },
  { name: "Marketing", value: 21 },
  { name: "Operations", value: 23 },
  { name: "Sales", value: 7 },
];

const COLORS = [
  "hsl(220 72% 50%)",
  "hsl(210 80% 52%)",
  "hsl(152 60% 40%)",
  "hsl(38 92% 50%)",
  "hsl(340 65% 50%)",
  "hsl(262 60% 50%)",
  "hsl(25 85% 50%)",
];

const DeptChart = () => (
  <div className="chart-card opacity-0 animate-fade-in" style={{ animationDelay: "400ms" }}>
    <h3 className="text-sm font-semibold text-foreground mb-4">Dept by HC %</h3>
    <div className="flex items-center gap-4">
      <ResponsiveContainer width={160} height={160}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" outerRadius={72} dataKey="value" strokeWidth={0}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ background: "hsl(0 0% 100%)", border: "1px solid hsl(220 14% 90%)", borderRadius: 8, fontSize: 12 }}
            itemStyle={{ color: "hsl(220 20% 12%)" }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="space-y-1.5 text-xs">
        {data.map((d, i) => (
          <div key={d.name} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ background: COLORS[i] }} />
            <span className="text-muted-foreground">{d.name}</span>
            <span className="text-foreground font-semibold ml-auto">{d.value}%</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default DeptChart;
