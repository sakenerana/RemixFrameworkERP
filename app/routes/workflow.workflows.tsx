import { HomeOutlined, LoadingOutlined, SettingOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "@remix-run/react";
import {
  Alert,
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
  TableProps,
  Tag,
} from "antd";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { AiFillProfile, AiOutlinePlus } from "react-icons/ai";
import { FcRefresh, FcSearch } from "react-icons/fc";
import PrintDropdownComponent from "~/components/print_dropdown";

interface DataType {
  id: number;
  title: string;
  body: string;
  userId?: number; // Optional property
}

export default function Workflows() {
  const [data, setData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUserID, setUserID] = useState<any>();
  const [isDepartmentID, setDepartmentID] = useState<any>();

  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState<any[]>([]);

  const navigate = useNavigate();

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

  useMemo(() => {
    setUserID(localStorage.getItem('userAuthID'));
    setDepartmentID(localStorage.getItem('userDept'));
  }, []);

  useEffect(() => {
    if (searchText.trim() === '') {
      fetchData();
    } else {
      const filtered = data.filter(data =>
        data.title?.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [searchText]); // Empty dependency array means this runs once on mount

  const handleShowWorkflows = (value: DataType) => {
    console.log("value", value)
    navigate("assigned/id?=" + value.id);
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
