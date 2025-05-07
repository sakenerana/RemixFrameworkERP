import { HomeOutlined } from "@ant-design/icons";
import {
  Alert,
  Breadcrumb,
  Button,
  Input,
  Popconfirm,
  Space,
  Table,
  TableColumnsType,
  TableProps,
  Tag,
} from "antd";
import {
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlinePlus,
  AiOutlineUserDelete,
} from "react-icons/ai";
import { FcRefresh, FcSearch } from "react-icons/fc";
import PrintDropdownComponent from "~/components/print_dropdown";

interface DataType {
  key: React.Key;
  name: string;
  title: string;
  email: string;
  phone_no: string;
  username: string;
  department: string;
  location: string;
  manager: string;
  action: string;
}

export default function UsersRoutes() {
  const data: DataType[] = [
    {
      key: "1",
      name: "John Brown",
      title: "test",
      email: "test",
      phone_no: "test",
      username: "test",
      department: "test",
      location: "test",
      manager: "test",
      action: "test",
    },
    {
      key: "2",
      name: "John Brown",
      title: "test",
      email: "test",
      phone_no: "test",
      username: "test",
      department: "test",
      location: "test",
      manager: "test",
      action: "test",
    },
    {
      key: "3",
      name: "John Brown",
      title: "test",
      email: "test",
      phone_no: "test",
      username: "test",
      department: "test",
      location: "test",
      manager: "test",
      action: "test",
    },
    {
      key: "4",
      name: "John Brown",
      title: "test",
      email: "test",
      phone_no: "test",
      username: "test",
      department: "test",
      location: "test",
      manager: "test",
      action: "test",
    },
    {
      key: "5",
      name: "John Brown",
      title: "test",
      email: "test",
      phone_no: "test",
      username: "test",
      department: "test",
      location: "test",
      manager: "test",
      action: "test",
    },
    {
      key: "6",
      name: "John Brown",
      title: "test",
      email: "test",
      phone_no: "test",
      username: "test",
      department: "test",
      location: "test",
      manager: "test",
      action: "test",
    },
    {
      key: "7",
      name: "John Brown",
      title: "test",
      email: "test",
      phone_no: "test",
      username: "test",
      department: "test",
      location: "test",
      manager: "test",
      action: "test",
    },
    {
      key: "8",
      name: "John Brown",
      title: "test",
      email: "test",
      phone_no: "test",
      username: "test",
      department: "test",
      location: "test",
      manager: "test",
      action: "test",
    },
    {
      key: "9",
      name: "John Brown",
      title: "test",
      email: "test",
      phone_no: "test",
      username: "test",
      department: "test",
      location: "test",
      manager: "test",
      action: "test",
    },
    {
      key: "10",
      name: "John Brown",
      title: "test",
      email: "test",
      phone_no: "test",
      username: "test",
      department: "test",
      location: "test",
      manager: "test",
      action: "test",
    },
  ];

  const handleUpdateButton = () => {};

  const handleDeleteButton = () => {};

  const columns: TableColumnsType<DataType> = [
    {
      title: "Name",
      dataIndex: "name",
      width: 120,
    },
    {
      title: "Title",
      dataIndex: "title",
      width: 120,
    },
    {
      title: "Email",
      dataIndex: "email",
      width: 120,
    },
    {
      title: "Phone",
      dataIndex: "phone_no",
      width: 120,
    },
    {
      title: "Username",
      dataIndex: "username",
      width: 120,
    },
    {
      title: "Department",
      dataIndex: "department",
      width: 120,
    },
    {
      title: "Location",
      dataIndex: "location",
      width: 120,
    },
    {
      title: "Manager",
      dataIndex: "manager",
      width: 120,
    },
    {
      title: "Actions",
      dataIndex: "actions",
      width: 120,
      fixed: "right",
      render: () => (
        <div className="flex">
          <Popconfirm
            title="Do you want to update?"
            description="Are you sure to update this user?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleUpdateButton()}
          >
            <Tag
              className="cursor-pointer"
              icon={<AiOutlineEdit className="float-left mt-1 mr-1" />}
              color="#f7b63e"
            >
              Update
            </Tag>
          </Popconfirm>
          <Popconfirm
            title="Do you want to delete?"
            description="Are you sure to delete this user?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDeleteButton()}
          >
            <Tag
              className="cursor-pointer"
              icon={<AiOutlineDelete className="float-left mt-1 mr-1" />}
              color="#f50"
            >
              Delete
            </Tag>
          </Popconfirm>
        </div>
      ),
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

  return (
    <div>
      <div className="flex pb-5 justify-between">
        <Breadcrumb
          items={[
            {
              href: "/main/dashboard",
              title: <HomeOutlined />,
            },
            {
              title: "Users",
            },
          ]}
        />
        <Space wrap>
          <Button icon={<AiOutlineUserDelete />} type="primary" danger>
            Show Deleted Users
          </Button>
          <Button icon={<AiOutlinePlus />} type="primary">
            Create New
          </Button>
        </Space>
      </div>
      <div className="flex justify-between">
        <Alert
          message="Note: This is the list of all users. Please check closely."
          type="info"
          showIcon
        />
        <Space direction="horizontal">
          <Space.Compact style={{ width: "100%" }}>
            <Input placeholder="Search" />
            <Button icon={<FcSearch />} type="default">
              Search
            </Button>
          </Space.Compact>
          <Space wrap>
            <Button icon={<FcRefresh />} type="default">
              Refresh
            </Button>
          </Space>
          <Space wrap>
            <PrintDropdownComponent></PrintDropdownComponent>
          </Space>
        </Space>
      </div>
      <Table<DataType>
        size="small"
        columns={columns}
        dataSource={data}
        onChange={onChange}
        className="pt-5"
        bordered
      />
    </div>
  );
}
