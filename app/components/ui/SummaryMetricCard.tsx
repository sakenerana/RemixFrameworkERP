import { Card, Statistic, Typography } from "antd";
import type { ReactNode } from "react";

const { Text } = Typography;

interface SummaryMetricCardProps {
  className?: string;
  description: string;
  icon?: ReactNode;
  loading?: boolean;
  title: string;
  value: number | string;
  valueColor?: string;
}

export function SummaryMetricCard({
  className = "",
  description,
  icon,
  loading = false,
  title,
  value,
  valueColor = "#0f172a",
}: SummaryMetricCardProps) {
  return (
    <Card
      className={`summary-metric-card h-full rounded-lg border border-gray-200 shadow-sm ${className}`}
      loading={loading}
      styles={{ body: { padding: 16 } }}
    >
      <Statistic
        title={title}
        value={value}
        prefix={icon}
        valueStyle={{ color: valueColor, fontWeight: 700 }}
      />
      <Text className="block text-xs text-slate-500">{description}</Text>
    </Card>
  );
}
