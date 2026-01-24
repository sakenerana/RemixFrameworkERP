import { ApartmentOutlined, CheckCircleOutlined, CloseCircleOutlined, GlobalOutlined, TeamOutlined, UserOutlined } from "@ant-design/icons";
import {
  Alert,
  Button,
  Card,
  Col,
  Row,
  TableColumnsType,
  Table,
  message,
  Tag,
  Spin,
  Space,
  Progress,
  Typography,
} from "antd";
import { useEffect, useMemo, useState } from "react";
import { RiCircleFill, RiPieChart2Fill } from "react-icons/ri";
import AreaChart from "~/components/area_chart";
import BarChart from "~/components/bar_chart";
import PieChart from "~/components/pie_chart";
import { ProtectedRoute } from "~/components/ProtectedRoute";
import { DepartmentService } from "~/services/department.service";
import { GroupService } from "~/services/groups.service";
import { UserService } from "~/services/user.service";
import { User } from "~/types/user.type";
const { Title, Text } = Typography;

interface DataType {
  key: React.Key;
  date: string;
  name: string;
  created_by: string;
  action: string;
  item: string;
}

interface DashboardMetric {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  badgeColor: string;
  trend?: number;
  loading: boolean;
  description: string;
}

// Language content
const translations = {
  en: {
    alertMessage: "System Administration Dashboard: Overview of all system metrics and user activity",
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
    switchToFilipino: "Switch to Filipino",
    switchToEnglish: "Switch to English",
    users: "Users",
    inactiveUsersLabel: "Inactive Users"
  },
  fil: {
    alertMessage: "System Administration Dashboard: Pangkalahatang-ideya ng lahat ng system metrics at user activity",
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
    switchToFilipino: "Palitan sa Filipino",
    switchToEnglish: "Palitan sa Ingles",
    users: "Mga User",
    inactiveUsersLabel: "Mga Di-Aktibong User"
  }
};

export default function BudgetRoutes() {
  const [dataUser, setDataUser] = useState<any>();
  const [dataUserTable, setDataUserTable] = useState<User[]>([]);
  const [dataDepartment, setDataDepartment] = useState<any>();
  const [dataGroup, setDataGroup] = useState<any>();
  const [dataInactiveUsers, setDataInactiveUsers] = useState<any>();
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState<'en' | 'fil'>('en');
  const [t, setT] = useState(translations.en);

  const [metrics, setMetrics] = useState<any>({
    users: 0,
    departments: 0,
    groups: 0,
    inactiveUsers: 0,
  });
  const [userData, setUserData] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Toggle language
  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'fil' : 'en';
    setLanguage(newLanguage);
    setT(translations[newLanguage]);
  };

  // Fetch all data in parallel
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [users, departments, groups, inactiveUsers, activeUsers] = await Promise.all([
        UserService.getTableCounts(),
        DepartmentService.getTableCounts(),
        GroupService.getTableCounts(),
        UserService.getTableCountsInactiveUsers(),
        UserService.getActiveUsers()
      ]);

      setMetrics({
        users,
        departments,
        groups,
        inactiveUsers
      });
      setUserData(activeUsers);
      setDataUser(users);
      setDataDepartment(departments);
      setDataGroup(groups);
      setDataInactiveUsers(inactiveUsers);
    } catch (err) {
      setError("Failed to load dashboard data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDataUserTable = async () => {
    try {
      setLoading(true);
      const dataFetch = await UserService.getActiveUsers();
      setDataUserTable(dataFetch);
    } catch (error) {
      message.error("error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    fetchDataUserTable();
  }, []);

  const dashboardMetrics: DashboardMetric[] = [
    {
      title: t.activeUsers,
      value: metrics.users,
      icon: <UserOutlined className="text-white" />,
      color: "#ffffff",
      bgColor: "bg-gradient-to-br from-green-500 to-emerald-600",
      badgeColor: "bg-green-700/30 text-green-100",
      trend: 12,
      loading,
      description: t.currentlyActive
    },
    {
      title: t.departments,
      value: metrics.departments,
      icon: <ApartmentOutlined className="text-white" />,
      color: "#ffffff",
      bgColor: "bg-gradient-to-br from-blue-500 to-indigo-600",
      badgeColor: "bg-blue-700/30 text-blue-100",
      trend: 0,
      loading,
      description: t.organizationalUnits
    },
    {
      title: t.groups,
      value: metrics.groups,
      icon: <TeamOutlined className="text-white" />,
      color: "#ffffff",
      bgColor: "bg-gradient-to-br from-purple-500 to-violet-600",
      badgeColor: "bg-purple-700/30 text-purple-100",
      trend: 5,
      loading,
      description: t.permissionGroups
    },
    {
      title: t.inactiveUsers,
      value: metrics.inactiveUsers,
      icon: <CloseCircleOutlined className="text-white" />,
      color: "#ffffff",
      bgColor: "bg-gradient-to-br from-red-500 to-rose-600",
      badgeColor: "bg-red-700/30 text-red-100",
      trend: -8,
      loading,
      description: t.requiringReview
    }
  ];

  const renderTrendIndicator = (trend: number) => {
    if (trend > 0) {
      return <span className="text-white/90 font-medium">↑ {trend}%</span>;
    } else if (trend < 0) {
      return <span className="text-white/90 font-medium">↓ {Math.abs(trend)}%</span>;
    }
    return <span className="text-white/90">→</span>;
  };

  const columnsUser: TableColumnsType<User> = [
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: () => (
        <>
          <Tag color="green" variant="solid">
            <CheckCircleOutlined className="float-left mt-1 mr-1" /> {t.active}
          </Tag>
        </>
      )
    },
  ];

  const salesData = [
    { category: "Jan", value: dataUser || 0, color: '#16a34a' }, // Green
    { category: "Feb", value: dataDepartment || 0, color: '#3b82f6' }, // Blue
    { category: "Mar", value: dataGroup || 0, color: '#8b5cf6' }, // Purple
    { category: "Apr", value: dataInactiveUsers || 0, color: '#ef4444' }, // Red
    { category: "May", value: 270, color: '#f59e0b' }, // Amber
    { category: "Jun", value: 300, color: '#ec4899' }, // Pink
    { category: "Jul", value: 200, color: '#06b6d4' }, // Cyan
    { category: "Aug", value: 400, color: '#84cc16' }, // Lime
    { category: "Sept", value: 350, color: '#f97316' }, // Orange
    { category: "Oct", value: 280, color: '#6366f1' }, // Indigo
    { category: "Nov", value: 320, color: '#d946ef' }, // Fuchsia
    { category: "Dec", value: 380, color: '#10b981' }, // Emerald
  ];

  const data = [
    { date: '2024-01-01', value: 3000, category: 'Product A' },
    { date: '2024-01-02', value: 4000, category: 'Product A' },
    { date: '2024-01-03', value: 3500, category: 'Product A' },
    { date: '2024-01-04', value: 5000, category: 'Product A' },
    { date: '2024-01-05', value: 4500, category: 'Product A' },
    { date: '2024-01-01', value: 2000, category: 'Product B' },
    { date: '2024-01-02', value: 3000, category: 'Product B' },
    { date: '2024-01-03', value: 4500, category: 'Product B' },
    { date: '2024-01-04', value: 3500, category: 'Product B' },
    { date: '2024-01-05', value: 4000, category: 'Product B' },
    { date: '2024-01-01', value: 1500, category: 'Product C' },
    { date: '2024-01-02', value: 2500, category: 'Product C' },
    { date: '2024-01-03', value: 3000, category: 'Product C' },
    { date: '2024-01-04', value: 4000, category: 'Product C' },
    { date: '2024-01-05', value: 3500, category: 'Product C' },
  ];

  return (
    <ProtectedRoute>
      <div>
        <div className="flex justify-between items-center mb-4">
          <h1 className="font-bold">{t.dashboardTitle}</h1>
          <Button type="default" onClick={toggleLanguage}>
            <GlobalOutlined />
            {language === 'en' ? t.switchToFilipino : t.switchToEnglish}
          </Button>
        </div>

        {/* THIS IS THE FIRST ROW OF DASHBOARD */}
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Alert
            message={t.alertMessage}
            type="info"
            showIcon
            closable
          />

          {/* Metrics Section */}
          <Row gutter={[16, 16]}>
            {dashboardMetrics.map((metric, index) => (
              <Col key={index} xs={24} sm={12} md={12} lg={6}>
                <Card
                  hoverable
                  loading={metric.loading}
                  className={`
                    rounded-lg shadow-sm overflow-hidden transition-all duration-300 
                    hover:scale-105 hover:shadow-md border-0 p-0
                    ${metric.bgColor}
                  `}
                  styles={{
                    body: {
                      padding: '20px',
                      color: 'white'
                    }
                  }}
                >
                  <Space direction="vertical" size="small" style={{ width: '100%' }}>
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-white/20 backdrop-blur-sm">
                          {metric.icon}
                        </div>
                        <Text strong className="text-white text-base">
                          {metric.title}
                        </Text>
                      </div>
                      {metric.trend !== undefined && (
                        <Tag
                          className="!m-0 border-0 bg-white/20 text-white backdrop-blur-sm"
                        >
                          {renderTrendIndicator(metric.trend)}
                        </Tag>
                      )}
                    </div>
                    <Title level={2} className="!m-0 !text-white">
                      {metric.loading ? '--' : metric.value}
                    </Title>
                    <Text className="text-white/80 text-sm">{metric.description}</Text>
                    {metric.trend !== undefined && (
                      <Progress
                        percent={Math.abs(metric.trend)}
                        showInfo={false}
                        strokeColor="#ffffff"
                        trailColor="rgba(255, 255, 255, 0.3)"
                        size="small"
                        className="mt-2"
                      />
                    )}
                  </Space>
                </Card>
              </Col>
            ))}
          </Row>

          {/* THIS IS THE SECOND ROW OF DASHBOARD */}
          <Row>
            <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-2 gap-6 w-full">
              <Card className="rounded-md shadow-sm overflow-hidden transition-transform duration-300">
                <div>
                  <h2 className="flex flex-wrap text-sm font-semibold mb-2">
                    <RiCircleFill className="text-[5px] text-green-500 mt-2 mr-2" /> {t.addedByCategory}
                  </h2>
                  <p className="flex flex-wrap text-xs">{t.currentMonthBreakdown}</p>
                  {loading && <Spin></Spin>}
                  {!loading &&
                    <AreaChart data={data} />
                    // <PieChart
                    //   data={[
                    //     { type: t.users, value: dataUser },
                    //     { type: t.departments, value: dataDepartment },
                    //     { type: t.groups, value: dataGroup },
                    //     { type: t.inactiveUsersLabel, value: dataInactiveUsers },
                    //   ]}
                    //   title=""
                    // />}
                  }
                </div>
              </Card>
              <Card className="rounded-md border-gray-300 shadow-sm overflow-hidden transition-transform duration-300">
                <div>
                  <h2 className="flex flex-wrap text-sm font-semibold mb-2">
                    <RiCircleFill className="text-[5px] text-green-500 mt-2 mr-2" /> {t.monthlyDataTrend}
                  </h2>
                  <p className="flex flex-wrap text-xs">{t.lastMonths}</p>
                  <BarChart
                    data={salesData}
                    title=""
                    height={350}
                  />
                </div>
              </Card>
            </div>
          </Row>

          {/* THIS IS THE THIRD ROW OF DASHBOARD */}
          <Row>
            <Col span={24}>
              <div className="shadow-sm">
                <Card className="border-gray-300" title={
                  <div className="flex items-center">
                    <RiPieChart2Fill className="mr-2 text-green-500" />
                    {t.accountsOverview}
                  </div>
                }>
                  {loading && <Spin></Spin>}
                  {!loading &&
                    <Table<User>
                      key={''}
                      bordered
                      size={"small"}
                      columns={columnsUser}
                      dataSource={dataUserTable.map(item => ({
                        ...item,
                        key: item.id // Or any other unique identifier
                      }))}
                      // rowKey can also be used instead of modifying dataSource
                      rowKey={(record) => record.id}
                    />}
                </Card>
              </div>
            </Col>
          </Row>
        </Space>
      </div>
    </ProtectedRoute>
  );
}