import { CheckCircleOutlined, HomeOutlined, SettingOutlined } from "@ant-design/icons";
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
import { AiOutlineCloseCircle, AiOutlineEdit, AiOutlineUserAdd } from "react-icons/ai";
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
    <div>
      <div className="flex pb-5 justify-between">
        <Breadcrumb
          items={[
            {
              href: "/inventory",
              title: <HomeOutlined />,
            },
            {
              title: "Reports",
            },
            {
              title: "Activity Report",
            },
          ]}
        />
      </div>
      <div className="flex justify-between">
        <Alert
          message="Note: This is the list of all activity report. Please check closely."
          type="info"
          showIcon
        />
        <Space direction="horizontal">
          <Space.Compact style={{ width: "100%" }}>
            <Input.Search onChange={(e) => setSearchText(e.target.value)} placeholder="Search" />
          </Space.Compact>
          <Space wrap>
            <Dropdown
              menu={{ items: columnMenuItems }}
              placement="bottomRight"
              trigger={['click']}
            >
              <Button icon={<SettingOutlined />}>Columns</Button>
            </Dropdown>
            <PrintDropdownComponent stateData={data}></PrintDropdownComponent>
          </Space>
        </Space>
      </div>
      {loading && <Spin></Spin>}
      {!loading && (
        <Table<ActivityReport>
          size="small"
          columns={filteredColumns}
          dataSource={searchText ? filteredData : data}
          onChange={onChange}
          className="pt-5"
          bordered
          scroll={{ x: "max-content" }}
        />
      )}
    </div>
  );
}
