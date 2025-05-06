import { HomeOutlined } from "@ant-design/icons";
import {
  Alert,
  Breadcrumb,
  Button,
  Input,
  Space,
  Table,
  TableColumnsType,
  TableProps,
  Tag,
} from "antd";
import { AiOutlineDelete, AiOutlineEdit, AiOutlineFileExclamation, AiOutlinePlus } from "react-icons/ai";
import { FcRefresh, FcSearch } from "react-icons/fc";
import PrintDropdownComponent from "~/components/print_dropdown";

interface DataType {
  key: React.Key;
  company_name: string;
  email: string;
  image: string;
  action: string;
}

export default function CompaniesRoutes() {
  const data: DataType[] = [
    {
      key: "1",
      company_name: "John Brown",
      email: "test",
      image: "test",
      action: "test",
    },
    {
      key: "2",
      company_name: "John Brown",
      email: "test",
      image: "test",
      action: "test",
    },
    {
      key: "3",
      company_name: "John Brown",
      email: "test",
      image: "test",
      action: "test",
    },
    {
      key: "4",
      company_name: "John Brown",
      email: "test",
      image: "test",
      action: "test",
    },
    {
      key: "5",
      company_name: "John Brown",
      email: "test",
      image: "test",
      action: "test",
    },
    {
      key: "6",
      company_name: "John Brown",
      email: "test",
      image: "test",
      action: "test",
    },
    {
      key: "7",
      company_name: "John Brown",
      email: "test",
      image: "test",
      action: "test",
    },
    {
      key: "8",
      company_name: "John Brown",
      email: "test",
      image: "test",
      action: "test",
    },
    {
      key: "9",
      company_name: "John Brown",
      email: "test",
      image: "test",
      action: "test",
    },
    {
      key: "10",
      company_name: "John Brown",
      email: "test",
      image: "test",
      action: "test",
    },
  ];

  const columns: TableColumnsType<DataType> = [
    {
      title: "Company Name",
      dataIndex: "company_name",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Image",
      dataIndex: "image",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: () => (
        <div className="flex">
          <Tag
            icon={<AiOutlineEdit className="float-left mt-1 mr-1" />}
            color="#f7b63e"
          >
            Update
          </Tag>
          <Tag
            icon={<AiOutlineDelete className="float-left mt-1 mr-1" />}
            color="#f50"
          >
            Delete
          </Tag>
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
              title: "Settings",
            },
            {
              title: "Companies",
            },
          ]}
        />
        <Space wrap>
          <Button icon={<AiOutlineFileExclamation />} type="primary" danger>
            Show Deleted Companies
          </Button>
          <Button icon={<AiOutlinePlus />} type="primary">
            Create New
          </Button>
        </Space>
      </div>
      <div className="flex justify-between">
        <Alert
          message="Note: This is the list of all companies. Please check closely."
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
