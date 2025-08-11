import { CalendarOutlined, FileSearchOutlined, HomeOutlined, LoadingOutlined, SettingOutlined } from "@ant-design/icons";
import { useNavigate } from "@remix-run/react";
import {
  Alert,
  Breadcrumb,
  Button,
  Checkbox,
  Dropdown,
  Input,
  MenuProps,
  Modal,
  Popconfirm,
  Space,
  Spin,
  Table,
  TableColumnsType,
  Tag,
  Timeline,
  Tooltip,
} from "antd";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { AiFillProfile } from "react-icons/ai";
import { FcRefresh } from "react-icons/fc";
import { RiCircleFill } from "react-icons/ri";
import PrintDropdownComponent from "~/components/print_dropdown";
import dayjs from 'dayjs';

interface DataType {
  id: number;
  requested_by: string;
  refno: string;
  created_at: string;
  due_date: string;
  status: number;
  workflow_id: number;
  step_id: number;
  workflow: {
    id: number;
    name: string;
  }
  userId?: number; // Optional property
}

export default function WorkflowTracker() {
  const [data, setData] = useState<DataType[]>([]);
  const [dataModal, setDataModal] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isUserID, setUserID] = useState<any>();
  const [isDepartmentID, setDepartmentID] = useState<any>();

  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState<any[]>([]);

  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRefetch = async () => {
    setLoading(true);
    await fetchData();
    setLoading(false);
  };

  const fetchData = async () => {
    const getABID = localStorage.getItem('ab_id');
    const getUsername = localStorage.getItem('username');
    const CACHE_KEY = `userActiveActivities_${getABID}`; // Unique cache key per user
    const CACHE_EXPIRY = 15 * 60 * 1000; // 15 minutes cache

    try {
      setLoading(true);
      setError(null);

      // Check cache first
      const cachedData = localStorage.getItem(CACHE_KEY);
      const now = new Date().getTime();

      if (cachedData) {
        const { data, timestamp } = JSON.parse(cachedData);
        if (now - timestamp < CACHE_EXPIRY) {
          setData(data);
          setLoading(false);
          return;
        }
      }

      // If no cache or cache expired, make API request
      const response = await axios.post<any>(
        '/api/user-active-activities',
        {
          userid: Number(getABID),
          username: getUsername,
          tracked_user_id: Number(getABID)
        }
      );

      // Update state with fresh data
      const responseData = response.data.data;
      setData(responseData);

      // Update cache
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        data: responseData,
        timestamp: now
      }));

    } catch (err) {
      // Fallback to cached data if available
      const cachedData = localStorage.getItem(CACHE_KEY);
      if (cachedData) {
        const { data } = JSON.parse(cachedData);
        setData(data);
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
        data.requested_by?.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [searchText]); // Empty dependency array means this runs once on mount

  const handleTrack = (value: any) => {
    // console.log("VALUE", value)
    setDataModal(value);
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // State for column visibility
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({
    "Process Title": true,
    "Reference No": true,
    "Created At": true,
    "Due Date": true,
    "Workflow": true,
    "Actions": true,
  });

  const columns: TableColumnsType<DataType> = [
    {
      title: "Process Title",
      dataIndex: "requested_by",
      key: "process_title",
      width: 160,
      render: (text) => (
        <Tooltip title={text} placement="topLeft">
          <div style={{
            whiteSpace: 'normal',
            wordWrap: 'break-word',
            lineHeight: '1.2',
            maxHeight: '3.6em',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical'
          }}>
            {text}
          </div>
        </Tooltip>
      ),
      sorter: (a, b) => a.requested_by.localeCompare(b.requested_by),
    },
    {
      title: "Reference No",
      dataIndex: "refno",
      key: "refno",
      width: 140,
      render: (text) => <span className="text-monospace flex flex-wrap"><RiCircleFill className="text-[5px] text-green-500 mt-2 mr-2" /> {text}</span>,
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      width: 160, // Increased width to accommodate time
      render: (dateString) => (
        <div className="flex items-center">
          <CalendarOutlined className="mr-2 text-gray-400" />
          <div className="flex flex-col">
            <span className="text-sm">
              {dayjs(dateString).format('MMM DD YYYY')} {/* Date */}
            </span>
            <span className="text-xs text-gray-500">
              {dayjs(dateString).format('h:mm A')} {/* Time */}
            </span>
          </div>
        </div>
      )
    },
    {
      title: "Due Date",
      dataIndex: "due_date",
      width: 120,
      render: (dateString) => (
        <div className="flex items-center">
          <CalendarOutlined className="mr-2 text-gray-400" />
          <div className="flex flex-col">
            <span className="text-sm">
              {dayjs(dateString).format('MMM DD YYYY')} {/* Date */}
            </span>
            <span className="text-xs text-gray-500">
              {dayjs(dateString).format('h:mm A')} {/* Time */}
            </span>
          </div>
        </div>
      )
    },
    {
      title: "Workflow",
      dataIndex: "workflow",
      key: "workflow",
      width: 150,
      render: (workflow) => (
        <Tag color="green">
          {workflow}
        </Tag>
      )
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
            onConfirm={() => handleTrack(value)}
          >
            <Tag
              className="cursor-pointer"
              icon={<AiFillProfile className="float-left mt-1 mr-1" />}
              color="#1677ff"
            >
              Track Workflow
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

  const items = dataModal.sequences?.map((value: string, index: number) => {
    const isDuplicate = dataModal.sequences?.indexOf(value) !== index;
    const isStart = index === 0;
    const isEnd = value === "End";
    const isCurrent = value === dataModal.current_sequence;

    return {
      color: isEnd
        ? "green"
        : isCurrent
          ? "purple"
          : isDuplicate
            ? "orange"
            : "blue",
      label: isEnd ? "END" : isStart ? "START" : `STEP ${index + 1}`,
      children: (
        <div
          className={`p-3 rounded-lg border ${isCurrent
            ? "bg-indigo-100 border-indigo-400"
            : isEnd
              ? "bg-green-50 border-green-200"
              : isDuplicate
                ? "bg-yellow-50 border-yellow-200"
                : "bg-blue-50 border-blue-200"
            }`}
        >
          <p
            className={`font-medium ${isCurrent ? "text-indigo-800" : "text-gray-700"
              }`}
          >
            {value}
          </p>
          {isCurrent && (
            <p className="text-xs text-indigo-600 font-semibold mt-1">
              ⏳ Current Step
            </p>
          )}
        </div>
      ),
    };
  });

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
                title: <span className="text-blue-600 font-medium">Workflow Tracker</span>,
              },
            ]}
            className="text-sm"
          />
        </div>
      </div>

      {/* Toolbar Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <Alert
          message="Review all requested workflows. Monitor status and take action as needed."
          type="info"
          showIcon
          className="w-full lg:w-auto rounded-lg"
        />

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto">
          <Input.Search
            allowClear
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search workflows..."
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
                className: "shadow-lg rounded-md min-w-[200px] py-2"
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
            tip="Loading workflow requests..."
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
            className: "px-4 py-2 rounded-b-lg",
            showTotal: (total) => (
              <span className="text-sm">
                Total {data.length} of {total} requests
              </span>
            ),
          }}
          locale={{
            emptyText: (
              <div className="py-12 flex flex-col items-center">
                <FileSearchOutlined className="text-3xl text-gray-400 mb-3" />
                <p className="text-gray-500 mb-2 text-base">No workflow requests found</p>
                <p className="text-gray-400 text-sm mb-4">Create new requests or check your filters</p>
              </div>
            )
          }}
        // onRow={(record) => ({
        //   onClick: () => handleRowClick(record),
        //   className: "cursor-pointer hover:bg-gray-50",
        // })}
        />
      )}

      {/* Workflow Tracking Modal */}
      <Modal
        width={680}
        title={
          <>
            <div className="space-y-2">
              {/* Header Section */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-2">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {dataModal.requested_by}
                  </h2>
                  <span className="hidden sm:inline text-gray-400">—</span>
                  <span className="text-sm font-medium text-gray-600">
                    {dataModal.workflow || 'No workflow'}
                  </span>
                </div>
              </div>

              {/* Meta Info Section */}
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <span className="font-medium text-gray-700">Ref:</span>
                  <span>{dataModal.refno}</span>
                </div>
                <span className="hidden sm:inline text-gray-400">•</span>
                <div className="flex items-center gap-1">
                  <span className="font-medium text-gray-700">Created:</span>
                  <span>{dataModal.created_at}</span>
                </div>
                <span className="hidden sm:inline text-gray-400">•</span>
                <div className="flex items-center gap-1">
                  <span className="font-medium text-gray-700">Status:</span>
                  <span className="inline-flex items-center rounded-full bg-green-100 text-green-800 px-2 py-0.5 text-xs font-semibold">
                    Active
                  </span>
                </div>
              </div>
            </div>

          </>
        }
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        centered
        styles={{
          header: {
            borderBottom: '1px solid #f0f0f0',
            padding: '18px 22px'
          },
          body: {
            padding: '10px',
            maxHeight: '60vh',
            overflowY: 'auto'
          }
        }}
        className="workflow-modal"
      >
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <Spin size="large" />
          </div>
        ) : (
          <Timeline mode="right" items={items} className="workflow-timeline" />
        )}
      </Modal>
    </div>
  );
}
