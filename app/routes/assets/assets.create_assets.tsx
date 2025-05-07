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
  AiOutlineExport,
  AiOutlineFileDone,
  AiOutlineFileExclamation,
  AiOutlineImport,
  AiOutlinePlus,
} from "react-icons/ai";
import { FcRefresh, FcSearch } from "react-icons/fc";
import PrintDropdownComponent from "~/components/print_dropdown";

interface DataType {
  key: React.Key;
  asset_name: string;
  device_image: string;
  asset_tag: string;
  serial_no: string;
  model: string;
  category: string;
  checked_out_to: string;
  location: string;
  purchase_cost: string;
  current_value: string;
  accounting_code: string;
  installed: string;
  size: string;
  action: string;
  check_status: string;
}

export default function AssetsRoute() {
  const data: DataType[] = [
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
      purchase_cost: "test",
      current_value: "test",
      accounting_code: "test",
      installed: "test",
      size: "test",
      action: "test",
      check_status: "checkout",
    },
    {
      key: "2",
      asset_name: "John Brown",
      device_image: "test",
      asset_tag: "test",
      serial_no: "test",
      model: "test",
      category: "test",
      checked_out_to: "test",
      location: "test",
      purchase_cost: "test",
      current_value: "test",
      accounting_code: "test",
      installed: "test",
      size: "test",
      action: "test",
      check_status: "checkout",
    },
    {
      key: "3",
      asset_name: "John Brown",
      device_image: "test",
      asset_tag: "test",
      serial_no: "test",
      model: "test",
      category: "test",
      checked_out_to: "test",
      location: "test",
      purchase_cost: "test",
      current_value: "test",
      accounting_code: "test",
      installed: "test",
      size: "test",
      action: "test",
      check_status: "checkout",
    },
    {
      key: "4",
      asset_name: "John Brown",
      device_image: "test",
      asset_tag: "test",
      serial_no: "test",
      model: "test",
      category: "test",
      checked_out_to: "test",
      location: "test",
      purchase_cost: "test",
      current_value: "test",
      accounting_code: "test",
      installed: "test",
      size: "test",
      action: "test",
      check_status: "checkout",
    },
    {
      key: "5",
      asset_name: "John Brown",
      device_image: "test",
      asset_tag: "test",
      serial_no: "test",
      model: "test",
      category: "test",
      checked_out_to: "test",
      location: "test",
      purchase_cost: "test",
      current_value: "test",
      accounting_code: "test",
      installed: "test",
      size: "test",
      action: "test",
      check_status: "checkout",
    },
    {
      key: "6",
      asset_name: "John Brown",
      device_image: "test",
      asset_tag: "test",
      serial_no: "test",
      model: "test",
      category: "test",
      checked_out_to: "test",
      location: "test",
      purchase_cost: "test",
      current_value: "test",
      accounting_code: "test",
      installed: "test",
      size: "test",
      action: "test",
      check_status: "checkout",
    },
    {
      key: "7",
      asset_name: "John Brown",
      device_image: "test",
      asset_tag: "test",
      serial_no: "test",
      model: "test",
      category: "test",
      checked_out_to: "test",
      location: "test",
      purchase_cost: "test",
      current_value: "test",
      accounting_code: "test",
      installed: "test",
      size: "test",
      action: "test",
      check_status: "checkout",
    },
    {
      key: "8",
      asset_name: "John Brown",
      device_image: "test",
      asset_tag: "test",
      serial_no: "test",
      model: "test",
      category: "test",
      checked_out_to: "test",
      location: "test",
      purchase_cost: "test",
      current_value: "test",
      accounting_code: "test",
      installed: "test",
      size: "test",
      action: "test",
      check_status: "checkout",
    },
    {
      key: "9",
      asset_name: "John Brown",
      device_image: "test",
      asset_tag: "test",
      serial_no: "test",
      model: "test",
      category: "test",
      checked_out_to: "test",
      location: "test",
      purchase_cost: "test",
      current_value: "test",
      accounting_code: "test",
      installed: "test",
      size: "test",
      action: "test",
      check_status: "checkout",
    },
    {
      key: "10",
      asset_name: "John Brown",
      device_image: "test",
      asset_tag: "test",
      serial_no: "test",
      model: "test",
      category: "test",
      checked_out_to: "test",
      location: "test",
      purchase_cost: "test",
      current_value: "test",
      accounting_code: "test",
      installed: "test",
      size: "test",
      action: "test",
      check_status: "checkout",
    },
  ];

  const handleAuditButton = () => {};

  const handleUpdateButton = () => {};

  const handleDeleteButton = () => {};

  const handleCheckinButton = () => {};

  const handleCheckoutButton = () => {};

  const columns: TableColumnsType<DataType> = [
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
              title: "Assets",
            },
            {
              title: "Create New",
            },
          ]}
        />
        <Space wrap>
          <Button icon={<AiOutlineFileExclamation />} type="primary" danger>
            Show Deleted Assets
          </Button>
          <Button icon={<AiOutlinePlus />} type="primary">
            Create New
          </Button>
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
      <Table<DataType>
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
