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
import { Depreciation } from "~/types/depreciation.type";

export default function DepreciationRoutes() {
  const navigate = useNavigate();

  const data: Depreciation[] = [
    {
      key: "1",
      name: "John Brown",
      term: "test",
      floor_value: 2,
      assets: "test",
      assets_models: "test",
      licenses: "test",
      action: "test",
    },
  ];

  const handleUpdateButton = () => {
    navigate("update-depreciation");
  };

  const handleDeleteButton = () => { };

  const columns: TableColumnsType<Depreciation> = [
    {
      title: "Name",
      dataIndex: "name",
      width: 120,
    },
    {
      title: "Term",
      dataIndex: "term",
      width: 120,
    },
    {
      title: "Floor Value",
      dataIndex: "floor_value",
      width: 120,
    },
    {
      title: "Assets",
      dataIndex: "assets",
      width: 120,
    },
    {
      title: "Assets Models",
      dataIndex: "assets_models",
      width: 120,
    },
    {
      title: "Licenses",
      dataIndex: "licenses",
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
            description="Are you sure to update this depreciation?"
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
            description="Are you sure to delete this depreciation?"
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

  const onChange: TableProps<Depreciation>["onChange"] = (
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
              title: "Settings",
            },
            {
              title: "Depreciation",
            },
          ]}
        />
        <Space wrap>
          <Link to={"deleted-depreciation"}>
            <Button icon={<AiOutlineFileExclamation />} type="primary" danger>
              Show Deleted Depreciation
            </Button>
          </Link>
          <Link to={"create-depreciation"}>
            <Button icon={<AiOutlinePlus />} type="primary">
              Create New
            </Button>
          </Link>
        </Space>
      </div>
      <div className="flex justify-between">
        <Alert
          message="Note: This is the list of all depreciated items. Please check closely."
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
      <Table<Depreciation>
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
