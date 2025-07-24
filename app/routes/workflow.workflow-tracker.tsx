import { CalendarOutlined, CheckCircleOutlined, FileSearchOutlined, HistoryOutlined, HomeOutlined, LoadingOutlined, SettingOutlined, SmileOutlined } from "@ant-design/icons";
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
  TableProps,
  Tag,
  Timeline,
} from "antd";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { AiFillProfile } from "react-icons/ai";
import { FcRefresh, FcSearch } from "react-icons/fc";
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

    try {
      setLoading(true);
      setError(null);

      const response = await axios.post<any>(
        '/api/user-active-activities',
        {
          userid: Number(getABID),
          username: getUsername,
          tracked_user_id: Number(getABID)
        },
      );

      setData(response.data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
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
    console.log("VALUE", value)
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
      ellipsis: true,
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
          {workflow.name}
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

  const onChange: TableProps<DataType>["onChange"] = (
    pagination,
    filters,
    sorter,
    extra
  ) => {
    console.log("params", pagination, filters, sorter, extra);
  };

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
          onChange={onChange}
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
                    {dataModal.workflow?.name || 'No workflow'}
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
          <Timeline
            mode="right"
            items={[
              {
                color: "green",
                label: "2023-11-01 09:30",
                children: (
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="font-medium text-gray-700">Workflow Initiated</p>
                    <p className="text-sm text-gray-600">Request created by John Doe</p>
                  </div>
                ),
              },
              {
                color: "green",
                label: "2023-11-01 10:15",
                children: (
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="font-medium text-gray-700">First Approval</p>
                    <p className="text-sm text-gray-600">Approved by Jane Smith</p>
                  </div>
                ),
              },
              {
                color: "red",
                label: "2023-11-02 14:20",
                children: (
                  <div className="bg-red-50 p-3 rounded-lg">
                    <p className="font-medium text-gray-700">Revision Requested</p>
                    <p className="text-sm text-gray-600">Needs additional documentation</p>
                    <p className="text-sm text-gray-600 mt-1">Assigned to: Technical Team</p>
                  </div>
                ),
              },
              {
                label: "2023-11-03 11:45",
                children: (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="font-medium text-gray-700">Documentation Updated</p>
                    <p className="text-sm text-gray-600">Submitted by Alex Johnson</p>
                  </div>
                ),
              },
              {
                color: "gray",
                label: "2023-11-04 16:30",
                children: (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="font-medium text-gray-700">Pending Final Review</p>
                    <p className="text-sm text-gray-600">Waiting for QA approval</p>
                  </div>
                ),
              },
              {
                color: "#00CCFF",
                dot: <CheckCircleOutlined className="text-blue-400" />,
                label: "2023-11-05 10:00",
                children: (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="font-medium text-gray-700">Workflow Completed</p>
                    <p className="text-sm text-gray-600">Closed by System</p>
                  </div>
                ),
              },
              {
                color: "#00CCFF",
                dot: <CheckCircleOutlined className="text-blue-400" />,
                label: "2023-11-05 10:00",
                children: (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="font-medium text-gray-700">Workflow Completed</p>
                    <p className="text-sm text-gray-600">Closed by System</p>
                  </div>
                ),
              },
              {
                color: "#00CCFF",
                dot: <CheckCircleOutlined className="text-blue-400" />,
                label: "2023-11-05 10:00",
                children: (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="font-medium text-gray-700">Workflow Completed</p>
                    <p className="text-sm text-gray-600">Closed by System</p>
                  </div>
                ),
              },
            ]}
            className="workflow-timeline"
          />
        )}
      </Modal>
    </div>
  );
}
