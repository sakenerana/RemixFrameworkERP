import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const data = [
  { name: "Male", value: 73 },
  { name: "Female", value: 45 },
];

const COLORS = ["hsl(220 72% 50%)", "hsl(340 65% 50%)"];

const DiversityChart = () => (
  <div className="chart-card opacity-0 animate-fade-in" style={{ animationDelay: "300ms" }}>
    <h3 className="text-sm font-semibold text-foreground mb-4">Diversity %</h3>
    <div className="flex items-center justify-center gap-6">
      <div className="relative">
        <ResponsiveContainer width={160} height={160}>
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={50} outerRadius={72} dataKey="value" strokeWidth={0}>
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-foreground">118</span>
          <span className="text-xs text-muted-foreground">Total</span>
        </div>
      </div>
      <div className="space-y-3">
        {data.map((d, i) => (
          <div key={d.name} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ background: COLORS[i] }} />
            <div>
              <p className="text-lg font-bold text-foreground">{d.value}</p>
              <p className="text-xs text-muted-foreground">{d.name} · {Math.round((d.value / 118) * 100)}%</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default DiversityChart;
