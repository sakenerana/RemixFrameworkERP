import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const data = [
  { name: "Permanent", value: 105 },
  { name: "Contract", value: 13 },
];

const COLORS = ["hsl(220 72% 50%)", "hsl(38 92% 50%)"];

const EmpTypeChart = () => (
  <div className="chart-card opacity-0 animate-fade-in" style={{ animationDelay: "600ms" }}>
    <h3 className="text-sm font-semibold text-foreground mb-4">Emp Type %</h3>
    <div className="flex items-center justify-center gap-6">
      <div className="relative">
        <ResponsiveContainer width={140} height={140}>
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={42} outerRadius={62} dataKey="value" strokeWidth={0}>
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold text-foreground">118</span>
          <span className="text-[10px] text-muted-foreground">Total</span>
        </div>
      </div>
      <div className="space-y-3">
        {data.map((d, i) => (
          <div key={d.name} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ background: COLORS[i] }} />
            <div>
              <p className="text-lg font-bold text-foreground">{d.value}</p>
              <p className="text-xs text-muted-foreground">{d.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default EmpTypeChart;
