import { HomeOutlined } from "@ant-design/icons";
import { useNavigate } from "@remix-run/react";
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
  AiOutlineFileExclamation,
  AiOutlinePlus,
} from "react-icons/ai";
import { FcRefresh, FcSearch } from "react-icons/fc";
import { Link } from "react-router-dom";
import PrintDropdownComponent from "~/components/print_dropdown";
import { Company } from "~/types/company.type";

export default function CompaniesRoutes() {
  const navigate = useNavigate();

  const data: Company[] = [
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

  const handleUpdateButton = () => {
    navigate("update-company");
  };

  const handleDeleteButton = () => { };

  const columns: TableColumnsType<Company> = [
    {
      title: "Company Name",
      dataIndex: "company_name",
      width: 120,
    },
    {
      title: "Email",
      dataIndex: "email",
      width: 120,
    },
    {
      title: "Image",
      dataIndex: "image",
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
            description="Are you sure to update this company?"
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
            description="Are you sure to delete this company?"
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

  const onChange: TableProps<Company>["onChange"] = (
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
          <Link to={"deleted-company"}>
            <Button icon={<AiOutlineFileExclamation />} type="primary" danger>
              Show Deleted Companies
            </Button>
          </Link>
          <Link to={"create-company"}>
            <Button icon={<AiOutlinePlus />} type="primary">
              Create New
            </Button>
          </Link>
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
      <Table<Company>
        size="small"
        columns={columns}
        dataSource={data}
        onChange={onChange}
        className="pt-5"
        bordered
        scroll={{ x: "max-content" }}
      />
    </div>
  );
}
