import {
  ApartmentOutlined,
  ArrowDownOutlined,
  ArrowRightOutlined,
  ArrowUpOutlined,
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
  Space,
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
  accentColor: string;
  iconClassName: string;
  trend: number;
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
        icon: <UserOutlined className="text-white" />,
        accentColor: "#16a34a",
        iconClassName: "bg-emerald-500",
        trend: 12,
        loading,
        description: t.currentlyActive,
      },
      {
        title: t.departments,
        value: metrics.departments,
        icon: <ApartmentOutlined className="text-white" />,
        accentColor: "#2563eb",
        iconClassName: "bg-blue-500",
        trend: 0,
        loading,
        description: t.organizationalUnits,
      },
      {
        title: t.groups,
        value: metrics.groups,
        icon: <TeamOutlined className="text-white" />,
        accentColor: "#7c3aed",
        iconClassName: "bg-violet-500",
        trend: 5,
        loading,
        description: t.permissionGroups,
      },
      {
        title: t.inactiveUsers,
        value: metrics.inactiveUsers,
        icon: <CloseCircleOutlined className="text-white" />,
        accentColor: "#dc2626",
        iconClassName: "bg-red-500",
        trend: -8,
        loading,
        description: t.requiringReview,
      },
    ],
    [loading, metrics, t],
  );

  const renderTrendIndicator = (trend: number) => {
    if (trend > 0) {
      return (
        <span className="font-medium text-emerald-700">
          <ArrowUpOutlined /> {trend}%
        </span>
      );
    }

    if (trend < 0) {
      return (
        <span className="font-medium text-red-700">
          <ArrowDownOutlined /> {Math.abs(trend)}%
        </span>
      );
    }

    return (
      <span className="font-medium text-gray-600">
        <ArrowRightOutlined /> Stable
      </span>
    );
  };

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
    { category: "Jan", value: dataUser, color: "#16a34a" },
    { category: "Feb", value: dataDepartment, color: "#3b82f6" },
    { category: "Mar", value: dataGroup, color: "#8b5cf6" },
    { category: "Apr", value: dataInactiveUsers, color: "#ef4444" },
    { category: "May", value: 270, color: "#f59e0b" },
    { category: "Jun", value: 300, color: "#ec4899" },
    { category: "Jul", value: 200, color: "#06b6d4" },
    { category: "Aug", value: 400, color: "#84cc16" },
    { category: "Sept", value: 350, color: "#f97316" },
    { category: "Oct", value: 280, color: "#6366f1" },
    { category: "Nov", value: 320, color: "#d946ef" },
    { category: "Dec", value: 380, color: "#10b981" },
  ];

  const areaData = [
    { date: "2024-01-01", value: 3000, category: "Product A" },
    { date: "2024-01-02", value: 4000, category: "Product A" },
    { date: "2024-01-03", value: 3500, category: "Product A" },
    { date: "2024-01-04", value: 5000, category: "Product A" },
    { date: "2024-01-05", value: 4500, category: "Product A" },
    { date: "2024-01-01", value: 2000, category: "Product B" },
    { date: "2024-01-02", value: 3000, category: "Product B" },
    { date: "2024-01-03", value: 4500, category: "Product B" },
    { date: "2024-01-04", value: 3500, category: "Product B" },
    { date: "2024-01-05", value: 4000, category: "Product B" },
    { date: "2024-01-01", value: 1500, category: "Product C" },
    { date: "2024-01-02", value: 2500, category: "Product C" },
    { date: "2024-01-03", value: 3000, category: "Product C" },
    { date: "2024-01-04", value: 4000, category: "Product C" },
    { date: "2024-01-05", value: 3500, category: "Product C" },
  ];

  return (
    <ProtectedRoute>
      <div className="space-y-5">
        <div className="rounded-md border border-gray-200 bg-white px-5 py-4 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <Text className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                {t.overview}
              </Text>
              <Title level={3} className="!mb-1 !mt-1">
                {t.dashboardTitle}
              </Title>
              <Text className="text-sm text-gray-500">{t.dashboardSubtitle}</Text>
            </div>
            <Button type="default" icon={<GlobalOutlined />} onClick={toggleLanguage}>
              {language === "en" ? t.switchToFilipino : t.switchToEnglish}
            </Button>
          </div>
        </div>

        <Alert message={t.alertMessage} type="info" showIcon closable />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {dashboardMetrics.map((metric) => (
            <Card
              key={metric.title}
              loading={metric.loading}
              className="overflow-hidden rounded-md border border-gray-200 shadow-sm"
              styles={{ body: { padding: 0 } }}
            >
              <div className="h-1" style={{ backgroundColor: metric.accentColor }} />
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-md ${metric.iconClassName}`}>
                    {metric.icon}
                  </div>
                  <Tag className="m-0 rounded-full border-gray-200 bg-gray-50 px-2 py-0.5">
                    {renderTrendIndicator(metric.trend)}
                  </Tag>
                </div>

                <div className="mt-4">
                  <Text className="text-sm font-semibold text-gray-600">{metric.title}</Text>
                  <div className="mt-1 text-3xl font-bold text-gray-900">
                    {metric.value.toLocaleString()}
                  </div>
                  <Text className="text-sm text-gray-500">{metric.description}</Text>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Row>
          <div className="grid w-full grid-cols-1 gap-5 xl:grid-cols-2">
            <Card className="rounded-md border border-gray-200 shadow-sm">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <h2 className="mb-1 flex items-center text-sm font-semibold text-gray-900">
                    <RiCircleFill className="mr-2 text-[6px] text-emerald-500" />
                    {t.addedByCategory}
                  </h2>
                  <p className="m-0 text-xs text-gray-500">{t.currentMonthBreakdown}</p>
                </div>
                <Tag className="m-0 border-gray-200 bg-gray-50">{t.analytics}</Tag>
              </div>
              {loading ? (
                <div className="flex h-[350px] items-center justify-center">
                  <Spin />
                </div>
              ) : (
                <AreaChart data={areaData} />
              )}
            </Card>

            <Card className="rounded-md border border-gray-200 shadow-sm">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <h2 className="mb-1 flex items-center text-sm font-semibold text-gray-900">
                    <RiCircleFill className="mr-2 text-[6px] text-blue-500" />
                    {t.monthlyDataTrend}
                  </h2>
                  <p className="m-0 text-xs text-gray-500">{t.lastMonths}</p>
                </div>
                <Tag className="m-0 border-gray-200 bg-gray-50">{t.analytics}</Tag>
              </div>
              {loading ? (
                <div className="flex h-[350px] items-center justify-center">
                  <Spin />
                </div>
              ) : (
                <BarChart data={salesData} title="" height={350} />
              )}
            </Card>
          </div>
        </Row>

        <Card
          className="rounded-md border border-gray-200 shadow-sm"
          title={
            <div className="flex items-center">
              <RiPieChart2Fill className="mr-2 text-emerald-500" />
              {t.accountsOverview}
            </div>
          }
        >
          {loading ? (
            <div className="flex h-48 items-center justify-center">
              <Spin />
            </div>
          ) : (
            <Table<User>
              bordered={false}
              size="middle"
              columns={columnsUser}
              dataSource={dataUserTable}
              rowKey={(record) => record.id}
              pagination={{ pageSize: 8, showSizeChanger: false }}
            />
          )}
        </Card>
      </div>
    </ProtectedRoute>
  );
}
