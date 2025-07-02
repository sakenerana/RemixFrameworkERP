import { CheckCircleOutlined, FileSearchOutlined, HomeOutlined, LoadingOutlined, SettingOutlined } from "@ant-design/icons";
import {
  Alert,
  Breadcrumb,
  Button,
  Checkbox,
  Dropdown,
  Input,
  MenuProps,
  message,
  Space,
  Spin,
  Table,
  TableColumnsType,
  TableProps,
  Tag,
} from "antd";
import { useEffect, useMemo, useState } from "react";
import { AiOutlineCloseCircle, AiOutlineEdit, AiOutlinePlus, AiOutlineUserAdd } from "react-icons/ai";
import { RiCircleFill } from "react-icons/ri";
import PrintDropdownComponent from "~/components/print_dropdown";
import { ActivityReportService } from "~/services/activity_report";
import { ActivityReport } from "~/types/activity_report.type";

export default function ActivityReportRoutes() {
  const [data, setData] = useState<ActivityReport[]>([]);
  const [loading, setLoading] = useState(false);

  const [isUserID, setUserID] = useState<any>();
  const [isDepartmentID, setDepartmentID] = useState<any>();

  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState<ActivityReport[]>([]);

  // Fetch data from Supabase
  const fetchData = async () => {
    try {
      setLoading(true);
      const dataFetch = await ActivityReportService.getAllPosts(isDepartmentID);
      setData(dataFetch); // Works in React state
    } catch (error) {
      message.error("error");
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
        data.item?.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [searchText]); // Empty dependency array means this runs once on mount

  // State for column visibility
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({
    "Date": true,
    "Name": true,
    "Type": true,
    "Action": true,
    "Created By": true,
  });

  const columns: TableColumnsType<ActivityReport> = [
    {
      title: "Date",
      dataIndex: "created_at",
      width: 120,
      render: (text) => text ? new Date(text).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }) : 'N/A'
    },
    {
      title: "Name",
      dataIndex: "item",
      width: 120,
      render: (text) => text || 'N/A'
    },
    {
      title: "Type",
      dataIndex: "type",
      width: 120,
      render: (_, record) => {
        return (
          <>
            {record.type === 'Assets' && (
              <span className="flex flex-wrap"><RiCircleFill className="text-green-500 mt-1 mr-2" /> Assets</span>
            )}
            {record.type === 'Licenses' && (
              <span className="flex flex-wrap"><RiCircleFill className="text-blue-900 mt-1 mr-2" /> Licenses</span>
            )}
            {record.type === 'Accessories' && (
              <span className="flex flex-wrap"><RiCircleFill className="text-yellow-500 mt-1 mr-2" /> Accessories</span>
            )}
            {record.type === 'Consumables' && (
              <span className="flex flex-wrap"><RiCircleFill className="text-orange-500 mt-1 mr-2" /> Consumables</span>
            )}
            {record.type === 'Components' && (
              <span className="flex flex-wrap"><RiCircleFill className="text-blue-500 mt-1 mr-2" /> Components</span>
            )}
            {record.type === 'Predefined' && (
              <span className="flex flex-wrap"><RiCircleFill className="text-gray-500 mt-1 mr-2" /> Predefined Kit</span>
            )}
          </>
        );
      }
    },
    {
      title: "Action",
      dataIndex: "actions",
      width: 120,
      render: (_, record) => {
        return (
          <>
            {record.actions === 'Create' && (
              <Tag color="blue">
                <CheckCircleOutlined className="float-left mt-1 mr-1" /> Create
              </Tag>
            )}
            {record.actions === 'Update' && (
              <Tag color="orange">
                <AiOutlineEdit className="float-left mt-1 mr-1" /> Update / Deactivate
              </Tag>
            )}
            {record.actions === 'Delete' && (
              <Tag color="red">
                <AiOutlineCloseCircle className="float-left mt-1 mr-1" /> Deactivate
              </Tag>
            )}
            {record.actions === 'Deactivate' && (
              <Tag color="pink">
                <AiOutlineCloseCircle className="float-left mt-1 mr-1" /> Deactivate
              </Tag>
            )}
            {record.actions === 'Checkout' && (
              <Tag color="green">
                <CheckCircleOutlined className="float-left mt-1 mr-1" /> Checkout
              </Tag>
            )}
            {record.actions === 'Checkin' && (
              <Tag color="yellow">
                <CheckCircleOutlined className="float-left mt-1 mr-1" /> Checkin
              </Tag>
            )}
          </>
        );
      }
    },
    {
      title: "Created By",
      dataIndex: "name",
      width: 120,
      render: (_, record) => {
        return (
          <span className="flex flex-wrap"><AiOutlineUserAdd className="mt-1 mr-2" /> {record.users.first_name} {record.users.last_name}</span>
        );
      }
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

  const onChange: TableProps<ActivityReport>["onChange"] = (
    pagination,
    filters,
    sorter,
    extra
  ) => {
    console.log("params", pagination, filters, sorter, extra);
  };

  return (
    <div className="w-full px-4">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 py-2">
        <Breadcrumb
          items={[
            {
              href: "/inventory",
              title: <HomeOutlined className="text-gray-500" />,
            },
            {
              title: <span className="text-gray-500">Reports</span>,
            },
            {
              title: <span className="text-blue-600 font-medium">Activity Log</span>,
            },
          ]}
          className="text-sm"
        />
      </div>

      {/* Toolbar Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6 rounded-lg">
        <Alert
          message="Activity Log Report: View all system activities and filter results as needed."
          type="info"
          showIcon
        />

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto">
          <Input.Search
            allowClear
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search activities..."
            className="w-full sm:w-64"
            size="middle"
          />

          <Space>
            <Dropdown
              menu={{ items: columnMenuItems }}
              placement="bottomRight"
              trigger={['click']}
            >
              <Button
                icon={<SettingOutlined />}
                className="flex items-center gap-2"
              >
                Columns
              </Button>
            </Dropdown>

            <PrintDropdownComponent
              stateData={data}
              buttonProps={{
                className: "flex items-center gap-2",
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
            tip="Loading activity report data..."
            indicator={<LoadingOutlined style={{ fontSize: 36 }} spin />}
          />
        </div>
      ) : (
        <Table<ActivityReport>
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
            className: "px-4 py-2",
            showTotal: (total) => `Total ${total} activities`,
          }}
          locale={{
            emptyText: (
              <div className="py-8 flex flex-col items-center">
                <FileSearchOutlined className="text-3xl text-gray-400 mb-2" />
                <p className="text-gray-500">No activity found</p>
              </div>
            )
          }}
        />
      )}
    </div>
  );
}
