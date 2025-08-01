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
import { useEffect, useState } from "react";
import { RiCircleFill, RiPieChart2Fill } from "react-icons/ri";
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
      icon: <UserOutlined />,
      color: "#52c41a",
      trend: 12,
      loading,
      description: t.currentlyActive
    },
    {
      title: t.departments,
      value: metrics.departments,
      icon: <ApartmentOutlined />,
      color: "#1890ff",
      trend: 0,
      loading,
      description: t.organizationalUnits
    },
    {
      title: t.groups,
      value: metrics.groups,
      icon: <TeamOutlined />,
      color: "#722ed1",
      trend: 5,
      loading,
      description: t.permissionGroups
    },
    {
      title: t.inactiveUsers,
      value: metrics.inactiveUsers,
      icon: <CloseCircleOutlined />,
      color: "#f5222d",
      trend: -8,
      loading,
      description: t.requiringReview
    }
  ];

  const renderTrendIndicator = (trend: number) => {
    if (trend > 0) {
      return <span style={{ color: '#52c41a' }}>↑ {trend}%</span>;
    } else if (trend < 0) {
      return <span style={{ color: '#f5222d' }}>↓ {Math.abs(trend)}%</span>;
    }
    return <span>→</span>;
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
          <Tag color="green">
            <CheckCircleOutlined className="float-left mt-1 mr-1" /> {t.active}
          </Tag>
        </>
      )
    },
  ];

  const salesData = [
    { category: "Jan", value: dataUser },
    { category: "Feb", value: 200 },
    { category: "Mar", value: 150 },
    { category: "Apr", value: 80 },
    { category: "May", value: 270 },
    { category: "Jun", value: 270 },
    { category: "Jul", value: 270 },
    { category: "Aug", value: 270 },
    { category: "Sept", value: 270 },
    { category: "Oct", value: 270 },
    { category: "Nov", value: 270 },
    { category: "Dec", value: 270 },
  ];

  return (
    <ProtectedRoute>
      <div>
        <div className="flex justify-between items-center mb-4">
          <Title level={3}>{t.dashboardTitle}</Title>
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
                  // styles.body={{ padding: '16px' }}
                  className="p-[-16px] rounded-md shadow-sm overflow-hidden transition-transform duration-300 hover:scale-105"
                >
                  <Space direction="vertical" size="small" style={{ width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Text strong style={{ color: metric.color }}>
                        {metric.icon} {metric.title}
                      </Text>
                      {metric.trend !== undefined && (
                        <Tag
                          color={metric.trend > 0 ? 'green' : 'red'}
                          className="!m-0"
                        >
                          {renderTrendIndicator(metric.trend)}
                        </Tag>
                      )}
                    </div>
                    <Title level={3} style={{ margin: 0, color: metric.color }}>
                      {metric.loading ? '--' : metric.value}
                    </Title>
                    <Text type="secondary" className="text-xs">{metric.description}</Text>
                    {metric.trend !== undefined && (
                      <Progress
                        percent={Math.abs(metric.trend)}
                        showInfo={false}
                        strokeColor={metric.trend > 0 ? '#52c41a' : '#f5222d'}
                        size="small"
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
                    <PieChart
                      data={[
                        { type: t.users, value: dataUser },
                        { type: t.departments, value: dataDepartment },
                        { type: t.groups, value: dataGroup },
                        { type: t.inactiveUsersLabel, value: dataInactiveUsers },
                      ]}
                      title=""
                    />}
                </div>
              </Card>
              <Card className="rounded-md shadow-sm overflow-hidden transition-transform duration-300">
                <div>
                  <h2 className="flex flex-wrap text-sm font-semibold mb-2">
                    <RiCircleFill className="text-[5px] text-green-500 mt-2 mr-2" /> {t.monthlyDataTrend}
                  </h2>
                  <p className="flex flex-wrap text-xs">{t.lastMonths}</p>
                  <BarChart
                    data={salesData}
                    title=""
                    color="#16a34a"
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
                <Card title={
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