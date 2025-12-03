import { HomeOutlined, LoadingOutlined, SettingOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "@remix-run/react";
import {
  Alert,
  Avatar,
  Breadcrumb,
  Button,
  Checkbox,
  Dropdown,
  Input,
  MenuProps,
  Popconfirm,
  Space,
  Spin,
  Table,
  TableColumnsType,
  Tag,
} from "antd";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { AiFillProfile } from "react-icons/ai";
import { FcRefresh } from "react-icons/fc";
import { useAuth } from "~/auth/AuthContext";
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

export default function Workflows() {
  const [data, setData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUserID, setUserID] = useState<any>();
  const [isDepartmentID, setDepartmentID] = useState<any>();

  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { user, token } = useAuth();
  const [topThreeUserIds, setTopThreeUserIds] = useState<number[]>([]);

  const navigate = useNavigate();

  const handleRefetch = async () => {
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

  useMemo(() => {
    setUserID(localStorage.getItem('userAuthID'));
    setDepartmentID(localStorage.getItem('userDept'));
  }, []);

  useEffect(() => {
    if (searchText.trim() === '') {
      fetchData();
    } else {
      const filtered = data.filter(data =>
        data.username?.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [searchText]); // Empty dependency array means this runs once on mount

  const handleShowWorkflows = (value: DataType) => {
    // console.log("value", value)
    navigate("/workflow/assigned/id?id=" + value.id);
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
      width: 120,
      render: (text, record) => {
        const rank = topThreeUserIds.indexOf(record.id) + 1;
        const crownColors = ['#FFD700', '#C0C0C0', '#CD7F32']; // Gold, Silver, Bronze

        return (
          <div className="flex items-center">
            <Avatar
              src="/img/supplier-icon.png"
              size="small"
              className="mr-2 bg-blue-100 text-blue-600"
              icon={<UserOutlined />}
            />
            <span className="font-medium flex items-center">
              {text}
              {rank > 0 && rank <= 3 && (
                <CrownFilled
                  style={{
                    color: crownColors[rank - 1],
                    fontSize: '16px',
                    marginLeft: '6px',
                    filter: 'drop-shadow(0px 1px 1px rgba(0,0,0,0.2))'
                  }}
                  title={`Top ${rank}`}
                />
              )}
            </span>
          </div>
        );
      }
    },
    {
      title: "Activities Count",
      dataIndex: "activities_count",
      width: 120,
    },
    {
      title: "Actions",
      dataIndex: "actions",
      width: 160,
      fixed: "right",
      render: (_, value) => (
        <div className="flex">
          <Popconfirm
            title="Do you want to view?"
            description="Are you sure to view this workflows?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleShowWorkflows(value)}
          >
            <Tag
              className="cursor-pointer"
              icon={<AiFillProfile className="float-left mt-1 mr-1" />}
              color="#1677ff"
              variant="solid"
            >
              Show Workflows
            </Tag>
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
    <div className="w-full px-6 py-4 rounded-lg shadow-sm">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <Breadcrumb
            items={[
              {
                href: "/workflow",
                title: <HomeOutlined className="text-gray-400" />,
              },
              {
                title: <span className="text-blue-600 font-medium">Workflow</span>,
              },
            ]}
            className="text-sm"
          />
        </div>
      </div>

      {/* Toolbar Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <Alert
          message="This is the list of all users with existing workflows. Please review carefully."
          type="info"
          showIcon
          className="w-full lg:w-auto"
        />

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto">
          <Input.Search
            allowClear
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search users..."
            className="w-full sm:w-64"
            size="middle"
          />

          <Space>
            <Button
              onClick={handleRefetch}
              icon={<FcRefresh className="text-blue-500" />}
              className="flex items-center gap-2 hover:border-blue-500"
            >
              Refresh
            </Button>

            <Dropdown
              menu={{
                items: columnMenuItems,
                className: "shadow-lg rounded-md min-w-[200px]"
              }}
              placement="bottomRight"
              trigger={['click']}
            >
              <Button
                icon={<SettingOutlined />}
                className="flex items-center gap-2 hover:border-blue-500"
              >
                Columns
              </Button>
            </Dropdown>

            <PrintDropdownComponent
              stateData={data}
              buttonProps={{
                className: "flex items-center gap-2 hover:border-blue-500",
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
            tip="Loading user workflows..."
            indicator={<LoadingOutlined style={{ fontSize: 36 }} spin />}
          />
        </div>
      ) : (
        <Table<DataType>
          size="middle"
          columns={filteredColumns}
          dataSource={searchText ? filteredData : data}
          className="shadow-sm rounded-lg overflow-hidden"
          bordered
          scroll={{ x: "max-content" }}
          rowKey="id"
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            defaultPageSize: 20,
            className: "px-4 py-2",
            showTotal: (total) => `Total ${total} users`,
          }}
          locale={{
            emptyText: (
              <div className="py-8 flex flex-col items-center">
                <UserOutlined className="text-3xl text-gray-400 mb-2" />
                <p className="text-gray-500 mb-4">No workflow users found</p>
                {/* <Button
                  type="primary"
                  className="mt-2"
                  onClick={() => navigate('/workflow/create')}
                  icon={<AiOutlinePlus />}
                >
                  Add New User
                </Button> */}
              </div>
            )
          }}
        />
      )}
    </div>
  );
}
