import { Card, Space, Tag, Typography } from "antd";
import type { ReactNode } from "react";

const { Text, Title } = Typography;

interface AppPageHeaderProps {
  actions?: ReactNode;
  breadcrumb?: ReactNode;
  className?: string;
  eyebrow?: string;
  meta?: ReactNode;
  subtitle: string;
  title: ReactNode;
}

export function AppPageHeader({
  actions,
  breadcrumb,
  className = "",
  eyebrow,
  meta,
  subtitle,
  title,
}: AppPageHeaderProps) {
  return (
    <Card className={`app-page-header rounded-lg border border-gray-200 shadow-sm ${className}`} styles={{ body: { padding: 18 } }}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 space-y-2">
          {breadcrumb}
          {eyebrow && (
            <Tag color="blue" className="m-0 rounded-full px-3 py-1">
              {eyebrow}
            </Tag>
          )}
          <div>
            <Title level={2} className="!mb-1 !mt-0 !text-slate-950">
              {title}
            </Title>
            <Text className="text-sm text-slate-500">{subtitle}</Text>
          </div>
        </div>

        {(actions || meta) && (
          <Space wrap className="justify-start lg:justify-end">
            {meta}
            {actions}
          </Space>
        )}
      </div>
    </Card>
  );
}
