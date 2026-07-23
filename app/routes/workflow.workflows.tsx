import {
  BarChartOutlined,
  EyeOutlined,
  HomeOutlined,
  LoadingOutlined,
  ReloadOutlined,
  SettingOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useNavigate } from "@remix-run/react";
import {
  Alert,
  Avatar,
  Breadcrumb,
  Button,
  Card,
  Checkbox,
  Dropdown,
  Input,
  MenuProps,
  Popconfirm,
  Col,
  Row,
  Space,
  Spin,
  Statistic,
  Table,
  TableColumnsType,
  Tag,
  Typography,
} from "antd";
import axios from "axios";
import { Key, useEffect, useMemo, useState } from "react";
import PrintDropdownComponent from "~/components/print_dropdown";
import { CrownFilled } from '@ant-design/icons';

interface DataType {
  id: number;
  firstname: string;
  lastname: string;
  username: string;
  activities_count: number;
  workflows_breakdown: any[];
  body: string;
  userId?: number; // Optional property
}

const CACHE_KEY = 'userActivitiesData';
const CACHE_EXPIRY = 15 * 60 * 1000; // 15 minutes cache
const { Text, Title } = Typography;

export default function Workflows() {
  const [data, setData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [topThreeUserIds, setTopThreeUserIds] = useState<number[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [selectedRows, setSelectedRows] = useState<DataType[]>([]);

  const navigate = useNavigate();

  const handleRefetch = async () => {
    localStorage.removeItem(CACHE_KEY);
    setLoading(true);
    await fetchData();
    setLoading(false);
  };

  const fetchData = async () => {
    const getABID = localStorage.getItem('ab_id');
    const getUsername = localStorage.getItem('username');

    try {
      setLoading(true);
      setError(null);

      // Check cache first
      const cachedData = localStorage.getItem(CACHE_KEY);
      const now = new Date().getTime();

      if (cachedData) {
        const { data, topThreeUserIds, timestamp } = JSON.parse(cachedData);
        if (now - timestamp < CACHE_EXPIRY) {
          setData(data);
          setTopThreeUserIds(topThreeUserIds);
          setLoading(false);
          return;
        }
      }

      // If no cache or cache expired, make API request
      const response = await axios.post<any>(
        `${import.meta.env.VITE_API_BASE_URL}/user-activities`,
        {
          userid: Number(getABID),
          username: getUsername
        }
      );

      // Process data
      const sorted = [...response.data.data].sort((a, b) => b.activities_count - a.activities_count);
      const newTopThreeUserIds = sorted.slice(0, 3).map(user => user.id);

      // Update state
      setData(sorted);
      setTopThreeUserIds(newTopThreeUserIds);

      // Update cache
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        data: sorted,
        topThreeUserIds: newTopThreeUserIds,
        timestamp: now
      }));

    } catch (err) {
      // Fallback to cached data if available
      const cachedData = localStorage.getItem(CACHE_KEY);
      if (cachedData) {
        const { data, topThreeUserIds } = JSON.parse(cachedData);
        setData(data);
        setTopThreeUserIds(topThreeUserIds);
      } else {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      }
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const displayedData = useMemo(() => {
    const normalizedSearch = searchText.trim().toLowerCase();

    if (!normalizedSearch) {
      return data;
    }

    return data.filter((item) =>
      [
        item.username,
        item.firstname,
        item.lastname,
      ].some((value) => value?.toLowerCase().includes(normalizedSearch))
    );
  }, [data, searchText]);

  const totalActivities = data.reduce((sum, item) => sum + item.activities_count, 0);
  const usersWithWorkflows = data.filter((item) => item.activities_count > 0).length;
  const topUser = data[0];

  const handleShowWorkflows = (value: DataType) => {
    // console.log("value", value)
    navigate("/workflow/assigned/id?id=" + value.id);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: Key[], newSelectedRows: DataType[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
      setSelectedRows(newSelectedRows);
    },
    preserveSelectedRowKeys: true,
  };

  // State for column visibility
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({
    "Name": true,
    "Activities Count": true,
    "Actions": true,
  });

  const columns: TableColumnsType<DataType> = [
    {
      title: "Name",
      dataIndex: "username",
      width: 320,
      render: (text, record) => {
        const rank = topThreeUserIds.indexOf(record.id) + 1;
        const crownColors = ['#FFD700', '#C0C0C0', '#CD7F32']; // Gold, Silver, Bronze

        return (
          <div className="flex items-center">
            <Avatar
              src="/img/supplier-icon.png"
              size={34}
              className="mr-3 bg-blue-100 text-blue-600"
              icon={<UserOutlined />}
            />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="truncate font-semibold text-gray-900">{text}</span>
                {rank > 0 && rank <= 3 && (
                  <CrownFilled
                    style={{
                      color: crownColors[rank - 1],
                      fontSize: '16px',
                      filter: 'drop-shadow(0px 1px 1px rgba(0,0,0,0.2))'
                    }}
                    title={`Top ${rank}`}
                  />
                )}
              </div>
              {(record.firstname || record.lastname) && (
                <Text className="text-xs text-gray-500">
                  {[record.firstname, record.lastname].filter(Boolean).join(' ')}
                </Text>
              )}
            </div>
          </div>
        );
      }
    },
    {
      title: "Activities Count",
      dataIndex: "activities_count",
      width: 180,
      render: (count: number, record) => {
        const rank = topThreeUserIds.indexOf(record.id) + 1;

        return (
          <div className="flex items-center gap-3">
            <span className="rounded-md bg-blue-50 px-2 py-1 text-lg font-bold text-blue-700">
              {count.toLocaleString()}
            </span>
            {rank > 0 && rank <= 3 && (
              <Tag color={rank === 1 ? 'gold' : rank === 2 ? 'default' : 'cyan'} className="rounded-full">
                Rank {rank}
              </Tag>
            )}
          </div>
        );
      },
    },
    {
      title: "Actions",
      dataIndex: "actions",
      width: 160,
      fixed: "right",
      render: (_, value) => (
        <div className="flex items-center">
          <Popconfirm
            title="Do you want to view?"
            description="Are you sure to view this workflows?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleShowWorkflows(value)}
          >
            <Button
              type="primary"
              size="small"
              icon={<EyeOutlined />}
            >
              Show Workflows
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  // Toggle column visibility
  const toggleColumn = (columnTitle: string) => {
    setColumnVisibility(prev => ({
      ...prev,
      [columnTitle]: !prev[columnTitle]
    }));
  };

  // Create dropdown menu items
  const columnMenuItems: MenuProps['items'] = Object.keys(columnVisibility).map(columnTitle => ({
    key: columnTitle,
    label: (
      <Checkbox
        checked={columnVisibility[columnTitle]}
        onClick={() => toggleColumn(columnTitle)}
      >
        {columnTitle}
      </Checkbox>
    ),
  }));

  // Filter columns based on visibility
  const filteredColumns = columns.filter(column =>
    column.title ? columnVisibility[column.title.toString()] : true
  );

  return (
    <Card className="workflow-workflows-page w-full rounded-md border border-gray-200 shadow-sm" styles={{ body: { padding: 16 } }}>
      {/* Header Section */}
      <div className="mb-5 rounded-md border border-gray-200 bg-white px-5 py-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <Breadcrumb
              items={[
                {
                  href: "/workflow",
                  title: <HomeOutlined className="text-gray-400" />,
                },
                {
                  title: (
                    <span className="text-blue-600 font-medium">
                      Workflow Management
                    </span>
                  ),
                },
              ]}
              className="text-sm"
            />
            <Title level={3} className="!mb-1 !mt-3">
              Workflow Assignments
            </Title>
            <Text className="text-sm text-gray-500">
              Review users with assigned workflows and open their workflow breakdowns.
            </Text>
          </div>

          <Space wrap>
            <Tag className="rounded-full px-3 py-1">Users {data.length}</Tag>
            <Tag color="processing" className="rounded-full px-3 py-1">Assigned {usersWithWorkflows}</Tag>
            <Tag color={selectedRows.length > 0 ? "blue" : "default"} className="rounded-full px-3 py-1">
              Selected {selectedRows.length}
            </Tag>
          </Space>
        </div>
      </div>

      <Row gutter={[16, 16]} className="mb-5">
        <Col xs={24} sm={12} lg={8}>
          <Card className="h-full rounded-md border border-gray-200 shadow-sm">
            <Statistic
              title="Total Activities"
              value={totalActivities}
              prefix={<BarChartOutlined className="text-blue-600" />}
              valueStyle={{ color: '#0f172a', fontWeight: 700 }}
            />
            <Text className="text-xs text-gray-500">Combined assigned workflow activity</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card className="h-full rounded-md border border-gray-200 shadow-sm">
            <Statistic
              title="Users With Workflows"
              value={usersWithWorkflows}
              prefix={<TeamOutlined className="text-emerald-600" />}
              valueStyle={{ color: '#0f172a', fontWeight: 700 }}
            />
            <Text className="text-xs text-gray-500">Users with at least one activity</Text>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card className="h-full rounded-md border border-gray-200 shadow-sm">
            <Statistic
              title="Top User Activities"
              value={topUser?.activities_count ?? 0}
              prefix={<CrownFilled className="text-amber-500" />}
              valueStyle={{ color: '#0f172a', fontWeight: 700 }}
            />
            <Text className="text-xs text-gray-500">
              {topUser?.username ? `${topUser.username} currently leads` : 'No activity yet'}
            </Text>
          </Card>
        </Col>
      </Row>

      {/* Toolbar Section */}
      <div className="mb-5 rounded-md border border-gray-200 bg-gray-50 p-4">
        <Alert
          message="Below is a list of all users with assigned workflows. Please review the information carefully."
          type="info"
          showIcon
          className="mb-4"
        />

        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <Input.Search
            allowClear
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search by user name or details"
            className="w-full xl:max-w-md"
            size="large"
          />

          <Space wrap>
            <Button
              onClick={handleRefetch}
              icon={<ReloadOutlined />}
              className="flex items-center gap-2 border-gray-300 hover:border-blue-500"
            >
              Refresh Data
            </Button>

            <Dropdown
              menu={{
                items: columnMenuItems,
                className: "shadow-lg rounded-md min-w-[200px]",
              }}
              placement="bottomRight"
              trigger={["click"]}
            >
              <Button
                icon={<SettingOutlined />}
                className="flex items-center gap-2 border-gray-300 hover:border-blue-500"
              >
                Manage Columns
              </Button>
            </Dropdown>

            <PrintDropdownComponent
              stateData={selectedRows}
              exportVariant="workflow_assigned_like"
              buttonProps={{
                className: "flex items-center gap-2 border-gray-300 hover:border-blue-500",
                disabled: selectedRows.length === 0,
              }}
            />
          </Space>
        </div>
      </div>

      {/* Table Section */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spin
            size="large"
            tip="Loading workflow data..."
            indicator={<LoadingOutlined style={{ fontSize: 36 }} spin />}
          />
        </div>
      ) : (
        <Table<DataType>
          size="middle"
          columns={filteredColumns}
          dataSource={displayedData}
          rowSelection={rowSelection}
          className="workflow-workflows-table overflow-hidden rounded-md border border-gray-200"
          scroll={{ x: "max-content" }}
          rowKey="id"
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            pageSizeOptions: ["10", "20", "50", "100"],
            defaultPageSize: 20,
            className: "px-4 py-2",
            showTotal: (total) => `Showing ${total} users`,
          }}
          locale={{
            emptyText: (
              <div className="py-8 flex flex-col items-center">
                <UserOutlined className="text-3xl text-gray-400 mb-2" />
                <p className="text-gray-500 mb-4">
                  No users with workflows were found
                </p>
              </div>
            ),
          }}
        />
      )}
    </Card>
  );

}
