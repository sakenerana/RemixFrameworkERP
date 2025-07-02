import { ApartmentOutlined, CheckCircleOutlined, CloseCircleOutlined, TeamOutlined, UserOutlined } from "@ant-design/icons";
import {
  Alert,
  Card,
  Col,
  Row,
  TableColumnsType,
  TableProps,
  Table,
  message,
  Tag,
  Spin,
  Space,
  Progress,
  Typography,
} from "antd";
import { useEffect, useMemo, useState } from "react";
import { AiOutlineSolution, AiOutlineUserAdd, AiOutlineUserDelete, AiOutlineUsergroupAdd } from "react-icons/ai";
import {
} from "react-icons/fc";
import { RiCircleFill, RiPieChart2Fill } from "react-icons/ri";
import BarChart from "~/components/bar_chart";
import PieChart from "~/components/pie_chart";
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

export default function BudgetRoutes() {
  const [dataUser, setDataUser] = useState<any>();
  const [dataUserTable, setDataUserTable] = useState<User[]>([]);
  const [dataDepartment, setDataDepartment] = useState<any>();
  const [dataGroup, setDataGroup] = useState<any>();
  const [dataInactiveUsers, setDataInactiveUsers] = useState<any>();
  const [loading, setLoading] = useState(true);

  const [metrics, setMetrics] = useState<any>({
    users: 0,
    departments: 0,
    groups: 0,
    inactiveUsers: 0,
  });
  const [userData, setUserData] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const dashboardMetrics: DashboardMetric[] = [
    {
      title: "Active Users",
      value: metrics.users,
      icon: <UserOutlined />,
      color: "#52c41a",
      trend: 12,
      loading,
      description: "Currently active in system"
    },
    {
      title: "Departments",
      value: metrics.departments,
      icon: <ApartmentOutlined />,
      color: "#1890ff",
      trend: 0,
      loading,
      description: "Organizational units"
    },
    {
      title: "Groups",
      value: metrics.groups,
      icon: <TeamOutlined />,
      color: "#722ed1",
      trend: 5,
      loading,
      description: "Permission groups"
    },
    {
      title: "Inactive Users",
      value: metrics.inactiveUsers,
      icon: <CloseCircleOutlined />,
      color: "#f5222d",
      trend: -8,
      loading,
      description: "Requiring review"
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "PHP",
    }).format(amount);
  };

  const columns: TableColumnsType<DataType> = [
    {
      title: "Date",
      dataIndex: "date",
    },
    {
      title: "Created By",
      dataIndex: "created_by",
    },
    {
      title: "Action",
      dataIndex: "action",
    },
    {
      title: "Item",
      dataIndex: "item",
    },
  ];

  const onChange: TableProps<DataType>["onChange"] = (
    pagination,
    filters,
    sorter,
    extra
  ) => {
    console.log("params", pagination, filters, sorter, extra);
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
            <CheckCircleOutlined className="float-left mt-1 mr-1" /> Active
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
    <div>
      {/* THIS IS THE FIRST ROWN OF DASHBOARD */}
      {/* Dashboard Header */}
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Alert
          message="System Administration Dashboard: Overview of all system metrics and user activity"
          type="info"
          showIcon
          closable
        />

        {/* Metrics Section */}
        <Title level={4}>Key Metrics</Title>
        <Row gutter={[16, 16]}>
          {dashboardMetrics.map((metric, index) => (
            <Col key={index} xs={24} sm={12} md={12} lg={6}>
              <Card
                hoverable
                loading={metric.loading}
                bodyStyle={{ padding: '16px' }}
                className="rounded-md shadow-md overflow-hidden transition-transform duration-300 hover:scale-105"
              >
                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text strong style={{ color: metric.color }}>
                      {metric.icon} {metric.title}
                    </Text>
                    {metric.trend !== undefined && (
                      <Text type="secondary">
                        {renderTrendIndicator(metric.trend)}
                      </Text>
                    )}
                  </div>
                  <Title level={3} style={{ margin: 0, color: metric.color }}>
                    {metric.loading ? '--' : metric.value}
                  </Title>
                  <Text type="secondary">{metric.description}</Text>
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

        <Row gutter={[16, 16]}>
          <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-2 gap-6 w-full">
            <Card
              className="rounded-md shadow-md overflow-hidden transition-transform duration-300"
            >
              <div>
                <h2 className="flex flex-wrap text-sm font-semibold mb-2">
                  <RiCircleFill className="text-[5px] text-green-500 mt-2 mr-2" /> Added By Category
                </h2>
                <p className="flex flex-wrap">Current month breakdown</p>
                {loading && <Spin></Spin>}
                {!loading &&
                  <PieChart
                    data={[
                      { type: "Users", value: dataUser },
                      { type: "Departments", value: dataDepartment },
                      { type: "Groups", value: dataGroup },
                      { type: "Inactive Users", value: dataInactiveUsers },
                    ]}
                    title=""
                  />}

              </div>
            </Card>
            <Card
              className="rounded-md shadow-md overflow-hidden transition-transform duration-300"
            >
              <div>
                <h2 className="flex flex-wrap text-sm font-semibold mb-2">
                  <RiCircleFill className="text-[5px] text-green-500 mt-2 mr-2" /> Monthly Data Trend
                </h2>
                <p className="flex flex-wrap">Last current months</p>
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

        <Row gutter={16} className="pt-7">
          <Col span={24}>
            <div className="shadow-lg m-[-5px]">
              <Card title={
                <div className="flex items-center">
                  <RiPieChart2Fill className="mr-2 text-green-500" /> {/* Your icon */}
                  Accounts Overview
                </div>
              }>
                {loading && <Spin></Spin>}
                {!loading &&
                  <Table<User>
                    bordered
                    size={"small"}
                    columns={columnsUser}
                    dataSource={dataUserTable}
                  />}
              </Card>
            </div>
          </Col>
        </Row>
      </Space>
    </div>
  );
}

// const fetchDataUserTable = async () => {
//     try {
//       setLoading(true);
//       const dataFetch = await UserService.getActiveUsers();
//       setDataUserTable(dataFetch); // Works in React state
//     } catch (error) {
//       message.error("error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDataUser();
//     fetchDataUserTable();
//     fetchDataDepartment();
//     fetchDataGroup();
//     fetchDataInactiveUsers();
//   }, []); // Empty dependency array means this runs once on mount
