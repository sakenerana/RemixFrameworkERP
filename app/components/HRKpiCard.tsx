import { ReactNode } from "react";
import { Card, Tag, Typography, Space } from "antd";
import { TrendingUp, TrendingDown } from "lucide-react";

const { Text } = Typography;

interface KpiCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: { value: number; label: string };
  color?: "primary" | "success" | "warning" | "danger" | "info";
  delay?: number;
}

const colorMap: Record<NonNullable<KpiCardProps["color"]>, { tag: string; accent: string }> = {
  primary: { tag: "blue", accent: "rgba(59,130,246,0.18)" },
  success: { tag: "green", accent: "rgba(34,197,94,0.18)" },
  warning: { tag: "gold", accent: "rgba(234,179,8,0.18)" },
  danger: { tag: "red", accent: "rgba(239,68,68,0.18)" },
  info: { tag: "cyan", accent: "rgba(6,182,212,0.18)" },
};

export default function HRKpiCard({
  title,
  value,
  icon,
  trend,
  color = "primary",
  delay = 0,
}: KpiCardProps) {
  const isUp = (trend?.value ?? 0) >= 0;
  const palette = colorMap[color];

  return (
    <Card
      bordered={false}
      className="hr-kpi-card"
      styles={{ body: { padding: 16 } }}
      style={{
        animationDelay: `${delay}ms`,
        boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <Text type="secondary" className="text-xs">
            {title}
          </Text>
        </div>

        {/* Icon bubble */}
        <div
          className="flex items-center justify-center rounded-lg"
          style={{
            width: 36,
            height: 36,
            background: palette.accent,
          }}
        >
          {icon}
        </div>
      </div>

      {/* Value + Trend */}
      <div className="mt-3 flex items-end justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[28px] font-semibold leading-none text-foreground truncate">
            {value}
          </div>

          {trend && (
            <Space size={6} className="mt-2">
              <Tag color={isUp ? "green" : "red"} style={{ marginInlineEnd: 0, borderRadius: 999 }}>
                <span className="inline-flex items-center gap-1">
                  {isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  {Math.abs(trend.value)}%
                </span>
              </Tag>

              <Text type="secondary" className="text-xs">
                {trend.label}
              </Text>
            </Space>
          )}
        </div>
      </div>
    </Card>
  );
}