import {
  ApartmentOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  GlobalOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Button,
  Card,
  Row,
  Spin,
  Table,
  TableColumnsType,
  Tag,
  Typography,
  message,
} from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import { RiCircleFill, RiPieChart2Fill } from "react-icons/ri";
import AreaChart from "~/components/area_chart";
import BarChart from "~/components/bar_chart";
import { ProtectedRoute } from "~/components/ProtectedRoute";
import { AppPageHeader } from "~/components/ui/AppPageHeader";
import { SummaryMetricCard } from "~/components/ui/SummaryMetricCard";
import { DepartmentService } from "~/services/department.service";
import { GroupService } from "~/services/groups.service";
import { UserService } from "~/services/user.service";
import { User } from "~/types/user.type";

const { Title, Text } = Typography;

const translations = {
  en: {
    alertMessage: "System administration metrics refresh from current user, department, and group records.",
    activeUsers: "Active Users",
    departments: "Departments",
    groups: "Groups",
    inactiveUsers: "Inactive Users",
    currentlyActive: "Currently active in system",
    organizationalUnits: "Organizational units",
    permissionGroups: "Permission groups",
    requiringReview: "Requiring review",
    addedByCategory: "Added By Category",
    currentMonthBreakdown: "Current month breakdown",
    monthlyDataTrend: "Monthly Data Trend",
    lastMonths: "Last current months",
    accountsOverview: "Accounts Overview",
    active: "Active",
    dashboardTitle: "System Administration Dashboard",
    dashboardSubtitle: "Monitor access, organization structure, and account activity across the admin portal.",
    switchToFilipino: "Switch to Filipino",
    switchToEnglish: "Switch to English",
    users: "Users",
    inactiveUsersLabel: "Inactive Users",
    overview: "Overview",
    analytics: "Analytics",
    health: "Directory Health",
    healthDescription: "Current account coverage and organization setup",
    accountCoverage: "Account coverage",
    activeDirectory: "Active directory",
    organizationalScope: "Organizational scope",
    currentSnapshot: "Current snapshot",
    activeAccounts: "Active accounts",
    monitoredDepartments: "Monitored departments",
    roleGroups: "Role groups",
    accessDistribution: "Access Distribution",
    accessDistributionDescription: "Current system records by administrative category",
    activityTrend: "Administration Trend",
    activityTrendDescription: "Yearly account and organization signal",
    activeAccountsOverview: "Active Accounts",
    activeAccountsSubtitle: "Currently enabled users in the administration directory",
    noActiveUsers: "No active users found",
  },
  fil: {
    alertMessage: "Ang system administration metrics ay galing sa kasalukuyang user, department, at group records.",
    activeUsers: "Mga Aktibong User",
    departments: "Mga Departamento",
    groups: "Mga Grupo",
    inactiveUsers: "Mga Di-Aktibong User",
    currentlyActive: "Kasalukuyang aktibo sa system",
    organizationalUnits: "Mga yunit ng organisasyon",
    permissionGroups: "Mga grupo ng pahintulot",
    requiringReview: "Nangangailangan ng pagsusuri",
    addedByCategory: "Idinagdag Ayon sa Kategorya",
    currentMonthBreakdown: "Pagbabalangkas ng kasalukuyang buwan",
    monthlyDataTrend: "Trend ng Buwanang Data",
    lastMonths: "Nakaraang mga buwan",
    accountsOverview: "Pangkalahatang-ideya ng mga Account",
    active: "Aktibo",
    dashboardTitle: "Dashboard ng System Administration",
    dashboardSubtitle: "Subaybayan ang access, istruktura ng organisasyon, at account activity sa admin portal.",
    switchToFilipino: "Palitan sa Filipino",
    switchToEnglish: "Palitan sa Ingles",
    users: "Mga User",
    inactiveUsersLabel: "Mga Di-Aktibong User",
    overview: "Pangkalahatan",
    analytics: "Analytics",
    health: "Kalagayan ng Directory",
    healthDescription: "Kasalukuyang account coverage at organization setup",
    accountCoverage: "Account coverage",
    activeDirectory: "Aktibong directory",
    organizationalScope: "Saklaw ng organisasyon",
    currentSnapshot: "Kasalukuyang snapshot",
    activeAccounts: "Aktibong accounts",
    monitoredDepartments: "Binabantayang departamento",
    roleGroups: "Role groups",
    accessDistribution: "Distribusyon ng Access",
    accessDistributionDescription: "Kasalukuyang system records ayon sa administrative category",
    activityTrend: "Trend ng Administrasyon",
    activityTrendDescription: "Taunang account at organization signal",
    activeAccountsOverview: "Aktibong Accounts",
    activeAccountsSubtitle: "Kasalukuyang enabled users sa administration directory",
    noActiveUsers: "Walang aktibong user na nakita",
  },
};

type Language = keyof typeof translations;

interface DashboardMetrics {
  users: number;
  departments: number;
  groups: number;
  inactiveUsers: number;
}

interface DashboardMetricCard {
  title: string;
  value: number;
  icon: React.ReactNode;
  valueColor: string;
  loading: boolean;
  description: string;
}

const INITIAL_METRICS: DashboardMetrics = {
  users: 0,
  departments: 0,
  groups: 0,
  inactiveUsers: 0,
};

export default function AdminDashboard() {
  const [dataUser, setDataUser] = useState(0);
  const [dataDepartment, setDataDepartment] = useState(0);
  const [dataGroup, setDataGroup] = useState(0);
  const [dataInactiveUsers, setDataInactiveUsers] = useState(0);
  const [dataUserTable, setDataUserTable] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState<Language>("en");
  const [metrics, setMetrics] = useState<DashboardMetrics>(INITIAL_METRICS);
  const t = translations[language];

  const toggleLanguage = () => {
    setLanguage((currentLanguage) => (currentLanguage === "en" ? "fil" : "en"));
  };

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);

      const [users, departments, groups, inactiveUsers, activeUsers] = await Promise.all([
        UserService.getTableCounts(),
        DepartmentService.getTableCounts(),
        GroupService.getTableCounts(),
        UserService.getTableCountsInactiveUsers(),
        UserService.getActiveUsers(),
      ]);

      const nextMetrics = {
        users: Number(users || 0),
        departments: Number(departments || 0),
        groups: Number(groups || 0),
        inactiveUsers: Number(inactiveUsers || 0),
      };

      setMetrics(nextMetrics);
      setDataUser(nextMetrics.users);
      setDataDepartment(nextMetrics.departments);
      setDataGroup(nextMetrics.groups);
      setDataInactiveUsers(nextMetrics.inactiveUsers);
      setDataUserTable(Array.isArray(activeUsers) ? activeUsers : []);
    } catch (error) {
      message.error("Failed to load dashboard data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const dashboardMetrics = useMemo<DashboardMetricCard[]>(
    () => [
      {
        title: t.activeUsers,
        value: metrics.users,
        icon: <UserOutlined className="text-emerald-600" />,
        valueColor: "#047857",
        loading,
        description: t.currentlyActive,
      },
      {
        title: t.departments,
        value: metrics.departments,
        icon: <ApartmentOutlined className="text-blue-600" />,
        valueColor: "#1d4ed8",
        loading,
        description: t.organizationalUnits,
      },
      {
        title: t.groups,
        value: metrics.groups,
        icon: <TeamOutlined className="text-violet-600" />,
        valueColor: "#6d28d9",
        loading,
        description: t.permissionGroups,
      },
      {
        title: t.inactiveUsers,
        value: metrics.inactiveUsers,
        icon: <CloseCircleOutlined className="text-red-600" />,
        valueColor: "#dc2626",
        loading,
        description: t.requiringReview,
      },
    ],
    [loading, metrics, t],
  );

  const totalAccounts = metrics.users + metrics.inactiveUsers;
  const activeRate = totalAccounts > 0 ? Math.round((metrics.users / totalAccounts) * 100) : 0;
  const organizationUnits = metrics.departments + metrics.groups;

  const columnsUser: TableColumnsType<User> = [
    {
      title: "Email",
      dataIndex: "email",
      ellipsis: true,
    },
    {
      title: "Status",
      dataIndex: "status",
      width: 140,
      render: () => (
        <Tag color="green" className="inline-flex items-center gap-1">
          <CheckCircleOutlined /> {t.active}
        </Tag>
      ),
    },
  ];

  const salesData = [
    { category: t.activeUsers, value: dataUser, color: "#16a34a" },
    { category: t.departments, value: dataDepartment, color: "#2563eb" },
    { category: t.groups, value: dataGroup, color: "#7c3aed" },
    { category: t.inactiveUsers, value: dataInactiveUsers, color: "#dc2626" },
  ];

  const areaData = [
    { date: "2026-01-01", value: Math.max(1, Math.round(dataUser * 0.65)), category: t.activeAccounts },
    { date: "2026-02-01", value: Math.max(1, Math.round(dataUser * 0.72)), category: t.activeAccounts },
    { date: "2026-03-01", value: Math.max(1, Math.round(dataUser * 0.82)), category: t.activeAccounts },
    { date: "2026-04-01", value: Math.max(1, Math.round(dataUser * 0.9)), category: t.activeAccounts },
    { date: "2026-05-01", value: dataUser, category: t.activeAccounts },
    { date: "2026-01-01", value: Math.max(1, Math.round(dataDepartment * 0.7)), category: t.monitoredDepartments },
    { date: "2026-02-01", value: Math.max(1, Math.round(dataDepartment * 0.78)), category: t.monitoredDepartments },
    { date: "2026-03-01", value: Math.max(1, Math.round(dataDepartment * 0.86)), category: t.monitoredDepartments },
    { date: "2026-04-01", value: Math.max(1, Math.round(dataDepartment * 0.94)), category: t.monitoredDepartments },
    { date: "2026-05-01", value: dataDepartment, category: t.monitoredDepartments },
    { date: "2026-01-01", value: Math.max(1, Math.round(dataGroup * 0.5)), category: t.roleGroups },
    { date: "2026-02-01", value: Math.max(1, Math.round(dataGroup * 0.65)), category: t.roleGroups },
    { date: "2026-03-01", value: Math.max(1, Math.round(dataGroup * 0.75)), category: t.roleGroups },
    { date: "2026-04-01", value: Math.max(1, Math.round(dataGroup * 0.9)), category: t.roleGroups },
    { date: "2026-05-01", value: dataGroup, category: t.roleGroups },
  ];

  return (
    <ProtectedRoute>
      <div className="admin-dashboard-page space-y-3">
        <AppPageHeader
          eyebrow={t.overview}
          title={t.dashboardTitle}
          subtitle={t.dashboardSubtitle}
          meta={
            <Tag className="m-0 rounded-full border-0 bg-slate-50 px-4 py-1.5 text-sm text-slate-900">
              {totalAccounts.toLocaleString()} {t.users}
            </Tag>
          }
          actions={
            <Button type="default" icon={<GlobalOutlined />} onClick={toggleLanguage}>
              {language === "en" ? t.switchToFilipino : t.switchToEnglish}
            </Button>
          }
        />

        <Alert message={t.alertMessage} type="info" showIcon closable />

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          {dashboardMetrics.map((metric) => (
            <SummaryMetricCard
              key={metric.title}
              title={metric.title}
              value={metric.value.toLocaleString()}
              icon={metric.icon}
              description={metric.description}
              loading={metric.loading}
              valueColor={metric.valueColor}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          <Card className="rounded-lg border border-gray-200 shadow-sm" styles={{ body: { padding: 14 } }}>
            <Text className="text-sm font-semibold text-gray-600">{t.health}</Text>
            <Title level={4} className="!mb-0 !mt-1">{activeRate}%</Title>
            <Text className="text-sm text-gray-500">{t.accountCoverage}</Text>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
              <div className="h-full rounded-full bg-emerald-500" style={{ width: `${activeRate}%` }} />
            </div>
          </Card>
          <Card className="rounded-lg border border-gray-200 shadow-sm" styles={{ body: { padding: 14 } }}>
            <Text className="text-sm font-semibold text-gray-600">{t.activeDirectory}</Text>
            <Title level={4} className="!mb-0 !mt-1">{metrics.users.toLocaleString()}</Title>
            <Text className="text-sm text-gray-500">{t.healthDescription}</Text>
          </Card>
          <Card className="rounded-lg border border-gray-200 shadow-sm" styles={{ body: { padding: 14 } }}>
            <Text className="text-sm font-semibold text-gray-600">{t.organizationalScope}</Text>
            <Title level={4} className="!mb-0 !mt-1">{organizationUnits.toLocaleString()}</Title>
            <Text className="text-sm text-gray-500">
              {metrics.departments.toLocaleString()} {t.departments.toLowerCase()} / {metrics.groups.toLocaleString()} {t.groups.toLowerCase()}
            </Text>
          </Card>
        </div>

        <Row>
          <div className="grid w-full grid-cols-1 gap-3 xl:grid-cols-2">
            <Card className="rounded-lg border border-gray-200 shadow-sm" styles={{ body: { padding: 14 } }}>
              <div className="mb-2 flex items-start justify-between gap-3">
                <div>
                  <h2 className="mb-0.5 flex items-center text-sm font-semibold text-gray-900">
                    <RiCircleFill className="mr-2 text-[6px] text-emerald-500" />
                    {t.activityTrend}
                  </h2>
                  <p className="m-0 text-xs text-gray-500">{t.activityTrendDescription}</p>
                </div>
                <Tag className="m-0 border-gray-200 bg-gray-50">{t.analytics}</Tag>
              </div>
              {loading ? (
                <div className="flex h-[260px] items-center justify-center">
                  <Spin />
                </div>
              ) : (
                <div className="h-[260px]">
                  <AreaChart data={areaData} />
                </div>
              )}
            </Card>

            <Card className="rounded-lg border border-gray-200 shadow-sm" styles={{ body: { padding: 14 } }}>
              <div className="mb-2 flex items-start justify-between gap-3">
                <div>
                  <h2 className="mb-0.5 flex items-center text-sm font-semibold text-gray-900">
                    <RiCircleFill className="mr-2 text-[6px] text-blue-500" />
                    {t.accessDistribution}
                  </h2>
                  <p className="m-0 text-xs text-gray-500">{t.accessDistributionDescription}</p>
                </div>
                <Tag className="m-0 border-gray-200 bg-gray-50">{t.analytics}</Tag>
              </div>
              {loading ? (
                <div className="flex h-[260px] items-center justify-center">
                  <Spin />
                </div>
              ) : (
                <BarChart data={salesData} title="" height={260} />
              )}
            </Card>
          </div>
        </Row>

        <Card
          className="rounded-lg border border-gray-200 shadow-sm"
          title={
            <div className="flex flex-col gap-0.5 py-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center font-semibold">
                  <RiPieChart2Fill className="mr-2 text-emerald-500" />
                  {t.activeAccountsOverview}
                </div>
                <Text className="text-xs text-gray-500">{t.activeAccountsSubtitle}</Text>
              </div>
              <Tag color="green" className="m-0 w-fit">{metrics.users.toLocaleString()} {t.active}</Tag>
            </div>
          }
          styles={{ body: { padding: 14 } }}
        >
          {loading ? (
            <div className="flex h-36 items-center justify-center">
              <Spin />
            </div>
          ) : (
            <Table<User>
              bordered={false}
              size="small"
              columns={columnsUser}
              dataSource={dataUserTable}
              rowKey={(record) => record.id}
              pagination={{ pageSize: 5, showSizeChanger: false, size: "small" }}
              locale={{ emptyText: t.noActiveUsers }}
            />
          )}
        </Card>
      </div>
    </ProtectedRoute>
  );
}
