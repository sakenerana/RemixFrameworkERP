import { CheckCircleOutlined, FileSearchOutlined, HistoryOutlined, HomeOutlined, LoadingOutlined, SettingOutlined, SmileOutlined } from "@ant-design/icons";
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
import { useEffect, useState } from "react";
import { AiFillProfile } from "react-icons/ai";
import { FcRefresh, FcSearch } from "react-icons/fc";
import PrintDropdownComponent from "~/components/print_dropdown";

interface DataType {
  id: number;
  title: string;
  body: string;
  userId?: number; // Optional property
}

export default function WorkflowTracker() {
  const [data, setData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRefetch = async () => {
    setLoading(true);
    await fetchData();
    setLoading(false);
  };

  const fetchData = async () => {
    try {
      const response = await axios
        .get<DataType[]>("https://jsonplaceholder.typicode.com/posts") // Specify response type
        .then((response) => {
          setData(response.data);
          setLoading(false);
        })
        .catch((error) => {
          setError(error.message);
          setLoading(false);
        });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // Empty dependency array means this runs once on mount

  const handleTrack = () => {
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
    "Name": true,
    "Product Key": true,
    "Actions": true,
  });

  const columns: TableColumnsType<DataType> = [
    {
      title: "Name",
      dataIndex: "name",
      width: 120,
    },
    {
      title: "Product Key",
      dataIndex: "product_key",
      width: 120,
    },
    {
      title: "Actions",
      dataIndex: "actions",
      width: 160,
      fixed: "right",
      render: () => (
        <div className="flex">
          <Popconfirm
            title="Do you want to view?"
            description="Are you sure to view this workflows?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleTrack()}
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
    <div className="w-full px-6 py-4 bg-white rounded-lg shadow-sm">
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
          <h1 className="text-xl font-semibold text-gray-800 mt-1">Requested Workflows</h1>
          <p className="text-sm text-gray-500 mt-1">Track and manage all workflow requests</p>
        </div>
      </div>

      {/* Toolbar Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <Alert
          message="Review all requested workflows. Monitor status and take action as needed."
          type="info"
          showIcon
          className="w-full lg:w-auto border border-blue-50 bg-blue-50 rounded-lg"
        />

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto">
          <Input.Search
            allowClear
            placeholder="Search workflows..."
            className="w-full sm:w-64"
            size="middle"
            onChange={(e) => setSearchText(e.target.value)}
            onSearch={handleSearch}
            suffix={<FcSearch className="text-gray-400" />}
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
          className="shadow-sm rounded-lg overflow-hidden border border-gray-100"
          bordered
          scroll={{ x: "max-content" }}
          rowKey="id"
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            defaultPageSize: 20,
            className: "px-4 py-2 bg-gray-50 rounded-b-lg",
            showTotal: (total) => (
              <span className="text-sm text-gray-600">
                Showing {data.length} of {total} requests
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
          onRow={(record) => ({
            onClick: () => handleRowClick(record),
            className: "cursor-pointer hover:bg-gray-50",
          })}
        />
      )}

      {/* Workflow Tracking Modal */}
      <Modal
        width={680}
        title={
          <div className="flex items-center gap-3">
            <HistoryOutlined className="text-blue-500 text-xl" />
            <span className="text-xl font-semibold">Workflow Timeline</span>
          </div>
        }
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        centered
        styles={{
          header: {
            borderBottom: '1px solid #f0f0f0',
            padding: '20px 24px'
          },
          body: {
            padding: '24px',
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
            mode="alternate"
            items={[
              {
                color: "green",
                label: "2023-11-01 09:30",
                children: (
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="font-medium">Workflow Initiated</p>
                    <p className="text-sm text-gray-600">Request created by John Doe</p>
                  </div>
                ),
              },
              {
                color: "green",
                label: "2023-11-01 10:15",
                children: (
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="font-medium">First Approval</p>
                    <p className="text-sm text-gray-600">Approved by Jane Smith</p>
                  </div>
                ),
              },
              {
                color: "red",
                label: "2023-11-02 14:20",
                children: (
                  <div className="bg-red-50 p-3 rounded-lg">
                    <p className="font-medium">Revision Requested</p>
                    <p className="text-sm text-gray-600">Needs additional documentation</p>
                    <p className="text-sm text-gray-600 mt-1">Assigned to: Technical Team</p>
                  </div>
                ),
              },
              {
                label: "2023-11-03 11:45",
                children: (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="font-medium">Documentation Updated</p>
                    <p className="text-sm text-gray-600">Submitted by Alex Johnson</p>
                  </div>
                ),
              },
              {
                color: "gray",
                label: "2023-11-04 16:30",
                children: (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="font-medium">Pending Final Review</p>
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
                    <p className="font-medium">Workflow Completed</p>
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
