import { useMemo } from "react";
import { Button, Card, Space, Typography } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import {
  FcApprove,
  FcConferenceCall,
  FcCustomerSupport,
  FcDecision,
  FcRightUp2,
} from "react-icons/fc";

import DeptChart from "~/components/DeptChart";
import DiversityChart from "~/components/DiversityChart";
import EmpTypeChart from "~/components/EmpTypeChart";
import HcGrowthChart from "~/components/HcGrowthChart";
import HcReportingChart from "~/components/HcReportingChart";
import HRKpiCard from "~/components/HRKpiCard";
import JobLevelChart from "~/components/JobLevelChart";
import StabilityChart from "~/components/StabilityChart";

const { Title, Text } = Typography;

export default function HRDashboard() {
  // Keep KPIs memoized so icons/objects aren’t recreated every render
  const kpis = useMemo(
    () => [
      {
        title: "Overall HC",
        value: 171,
        icon: <FcConferenceCall />,
        color: "primary" as const,
        trend: { value: 8.2, label: "vs last year" },
        delay: 0,
      },
      {
        title: "Active HC",
        value: 118,
        icon: <FcApprove />,
        color: "success" as const,
        trend: { value: 5.4, label: "vs last year" },
        delay: 50,
      },
      {
        title: "Attrition",
        value: 47,
        icon: <FcCustomerSupport />,
        color: "danger" as const,
        trend: { value: -12.3, label: "vs last year" },
        delay: 100,
      },
      {
        title: "Attrition %",
        value: "27%",
        icon: <FcDecision />,
        color: "warning" as const,
        trend: { value: -3.1, label: "vs last year" },
        delay: 150,
      },
      {
        title: "Transfers",
        value: 6,
        icon: <FcRightUp2 />,
        color: "info" as const,
        trend: { value: 2.0, label: "this quarter" },
        delay: 200,
      },
    ],
    []
  );

  const handleRefresh = () => {
    // hook this to your loader/refetch if you have one
    // e.g. revalidator.revalidate() in Remix
    console.log("refresh dashboard");
  };

  return (
    // ✅ removed ml-64 — let your Layout control left spacing
    <div className="flex-1 p-6 space-y-6 overflow-auto">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Title level={3} style={{ margin: 0 }}>
            HR Analytics Dashboard
          </Title>
          <Text type="secondary">Team performance overview · Feb 2026</Text>
        </div>

        <Space>
          <Text type="secondary" className="hidden sm:block">
            Last updated: Feb 26, 2026
          </Text>
          <Button icon={<ReloadOutlined />} onClick={handleRefresh}>
            Refresh
          </Button>
        </Space>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {kpis.map((kpi) => (
          <HRKpiCard key={kpi.title} {...kpi} />
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card bordered={false} className="rounded-xl" styles={{ body: { padding: 16 } }}>
          <HcGrowthChart />
        </Card>

        <Card bordered={false} className="rounded-xl" styles={{ body: { padding: 16 } }}>
          <DiversityChart />
        </Card>

        <Card bordered={false} className="rounded-xl" styles={{ body: { padding: 16 } }}>
          <JobLevelChart />
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card bordered={false} className="rounded-xl" styles={{ body: { padding: 16 } }}>
          <DeptChart />
        </Card>

        <Card bordered={false} className="rounded-xl" styles={{ body: { padding: 16 } }}>
          <HcReportingChart />
        </Card>

        <Card bordered={false} className="rounded-xl" styles={{ body: { padding: 16 } }}>
          <EmpTypeChart />
        </Card>

        <Card bordered={false} className="rounded-xl" styles={{ body: { padding: 16 } }}>
          <StabilityChart />
        </Card>
      </div>
    </div>
  );
}