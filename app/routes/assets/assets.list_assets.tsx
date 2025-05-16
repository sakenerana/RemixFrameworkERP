import { HomeOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "@remix-run/react";
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
  AiOutlineExport,
  AiOutlineFileDone,
  AiOutlineFileExclamation,
  AiOutlineImport,
  AiOutlinePlus,
} from "react-icons/ai";
import { FcRefresh, FcSearch } from "react-icons/fc";
import PrintDropdownComponent from "~/components/print_dropdown";
import { Asset } from "~/types/asset.type";

export default function AssetsRoute() {
  const navigate = useNavigate();

  const data: Asset[] = [
    {
      key: "1",
      asset_name: "John Brown",
      device_image: "test",
      asset_tag: "test",
      serial_no: "test",
      model: "test",
      category: "test",
      checked_out_to: "test",
      location: "test",
      purchase_cost: 123,
      current_value: 123,
      accounting_code: "test",
      installed: "test",
      size: "test",
      action: "test",
      check_status: "checkout",
    },
  ];

  const handleAuditButton = () => { };

  const handleUpdateButton = () => {
    navigate("update-assets")
  };

  const handleDeleteButton = () => { };

  const handleCheckinButton = () => { };

  const handleCheckoutButton = () => { };

  const columns: TableColumnsType<Asset> = [
    {
      title: "Asset Name",
      dataIndex: "asset_name",
      width: 120,
    },
    {
      title: "Device Image",
      dataIndex: "device_image",
      width: 120,
    },
    {
      title: "Asset Tag",
      dataIndex: "asset_tag",
      width: 120,
    },
    {
      title: "Serial",
      dataIndex: "serial_no",
      width: 120,
    },
    {
      title: "Model",
      dataIndex: "model",
      width: 120,
    },
    {
      title: "Category",
      dataIndex: "category",
      width: 120,
    },
    {
      title: "Checked Out To",
      dataIndex: "checked_out_to",
      width: 120,
    },
    {
      title: "Location",
      dataIndex: "location",
      width: 120,
    },
    {
      title: "Purchase Cost",
      dataIndex: "purchase_cost",
      width: 120,
    },
    {
      title: "Current Value",
      dataIndex: "current_value",
      width: 120,
    },
    {
      title: "Accounting Code",
      dataIndex: "accounting_code",
      width: 120,
    },
    {
      title: "Installed",
      dataIndex: "installed",
      width: 120,
    },
    {
      title: "Size",
      dataIndex: "size",
      width: 120,
    },
    {
      title: "Actions",
      dataIndex: "actions",
      width: 250,
      fixed: "right",
      render: () => (
        <div className="flex">
          <Popconfirm
            title="Do you want to audit?"
            description="Are you sure to audit this asset?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleAuditButton()}
          >
            <Tag
              className="cursor-pointer"
              icon={<AiOutlineFileDone className="float-left mt-1 mr-1" />}
              color="#1778ff"
            >
              Audit
            </Tag>
          </Popconfirm>
          <Popconfirm
            title="Do you want to update?"
            description="Are you sure to update this asset?"
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
            description="Are you sure to delete this asset?"
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
    {
      title: "Checkout",
      dataIndex: "checkout",
      width: 120,
      fixed: "right",
      render: (_, data) => (
        <div>
          {data.check_status == "checkin" ? (
            <Popconfirm
              title="Do you want to checkin?"
              description="Are you sure to checkin this asset?"
              okText="Yes"
              cancelText="No"
              onConfirm={() => handleCheckinButton()}
            >
              <Tag
                className="cursor-pointer"
                icon={<AiOutlineImport className="float-left mt-1 mr-1" />}
                color="#108ee9"
              >
                {data.check_status}
              </Tag>
            </Popconfirm>
          ) : (
            <Popconfirm
              title="Do you want to checkout?"
              description="Are you sure to checkout this asset?"
              okText="Yes"
              cancelText="No"
              onConfirm={() => handleCheckoutButton()}
            >
              <Tag
                className="cursor-pointer"
                icon={<AiOutlineExport className="float-left mt-1 mr-1" />}
                color="#f50"
              >
                {data.check_status}
              </Tag>
            </Popconfirm>
          )}
        </div>
      ),
    },
  ];

  const onChange: TableProps<Asset>["onChange"] = (
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
              title: "Assets",
            },
            {
              title: "Create New",
            },
          ]}
        />
        <Space wrap>
          <Link to={"/inventory/assets/list-assets/deleted-assets"}>
            <Button icon={<AiOutlineFileExclamation />} type="primary" danger>
              Show Deleted Assets
            </Button>
          </Link>
          <Link to={"/inventory/assets/list-assets/create-assets"}>
            <Button icon={<AiOutlinePlus />} type="primary">
              Create New
            </Button>
          </Link>
        </Space>
      </div>
      <div className="flex justify-between">
        <Alert
          message="Note: This is the list of all licensed item. Please check closely."
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
      <Table<Asset>
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
