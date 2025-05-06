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
import {
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlineExport,
  AiOutlineImport,
  AiOutlinePlus,
  AiOutlineUserDelete,
} from "react-icons/ai";
import { FcRefresh, FcSearch } from "react-icons/fc";
import PrintDropdownComponent from "~/components/print_dropdown";

interface DataType {
  key: React.Key;
  item_image: string;
  name: string;
  asset_category: string;
  model_no: string;
  location: string;
  min_qty: string;
  total: string;
  checked_out: string;
  purchase_cost: string;
  check_status: string;
  action: string;
}

export default function AccesoriessRoute() {
  const data: DataType[] = [
    {
      key: "1",
      item_image: "John Brown",
      name: "test",
      asset_category: "test",
      model_no: "test",
      location: "test",
      min_qty: "test",
      total: "test",
      checked_out: "test",
      purchase_cost: "test",
      check_status: "checkout",
      action: "test",
    },
    {
      key: "2",
      item_image: "John Brown",
      name: "test",
      asset_category: "test",
      model_no: "test",
      location: "test",
      min_qty: "test",
      total: "test",
      checked_out: "test",
      purchase_cost: "test",
      check_status: "checkout",
      action: "test",
    },
    {
      key: "3",
      item_image: "John Brown",
      name: "test",
      asset_category: "test",
      model_no: "test",
      location: "test",
      min_qty: "test",
      total: "test",
      checked_out: "test",
      purchase_cost: "test",
      check_status: "checkout",
      action: "test",
    },
    {
      key: "4",
      item_image: "John Brown",
      name: "test",
      asset_category: "test",
      model_no: "test",
      location: "test",
      min_qty: "test",
      total: "test",
      checked_out: "test",
      purchase_cost: "test",
      check_status: "checkout",
      action: "test",
    },
    {
      key: "5",
      item_image: "John Brown",
      name: "test",
      asset_category: "test",
      model_no: "test",
      location: "test",
      min_qty: "test",
      total: "test",
      checked_out: "test",
      purchase_cost: "test",
      check_status: "checkout",
      action: "test",
    },
    {
      key: "6",
      item_image: "John Brown",
      name: "test",
      asset_category: "test",
      model_no: "test",
      location: "test",
      min_qty: "test",
      total: "test",
      checked_out: "test",
      purchase_cost: "test",
      check_status: "checkout",
      action: "test",
    },
    {
      key: "7",
      item_image: "John Brown",
      name: "test",
      asset_category: "test",
      model_no: "test",
      location: "test",
      min_qty: "test",
      total: "test",
      checked_out: "test",
      purchase_cost: "test",
      check_status: "checkout",
      action: "test",
    },
    {
      key: "8",
      item_image: "John Brown",
      name: "test",
      asset_category: "test",
      model_no: "test",
      location: "test",
      min_qty: "test",
      total: "test",
      checked_out: "test",
      purchase_cost: "test",
      check_status: "checkout",
      action: "test",
    },
    {
      key: "9",
      item_image: "John Brown",
      name: "test",
      asset_category: "test",
      model_no: "test",
      location: "test",
      min_qty: "test",
      total: "test",
      checked_out: "test",
      purchase_cost: "test",
      check_status: "checkin",
      action: "test",
    },
    {
      key: "10",
      item_image: "John Brown",
      name: "test",
      asset_category: "test",
      model_no: "test",
      location: "test",
      min_qty: "test",
      total: "test",
      checked_out: "test",
      purchase_cost: "test",
      check_status: "checkout",
      action: "test",
    },
  ];

  const columns: TableColumnsType<DataType> = [
    {
      title: "Item Image",
      dataIndex: "item_image",
      width: 120
    },
    {
      title: "Name",
      dataIndex: "name",
      width: 120
    },
    {
      title: "Asset Category",
      dataIndex: "asset_category",
      width: 120
    },
    {
      title: "Model No.",
      dataIndex: "model_no",
      width: 120
    },
    {
      title: "Location",
      dataIndex: "location",
      width: 120
    },
    {
      title: "Min. QTY",
      dataIndex: "min_qty",
      width: 120
    },
    {
      title: "Total",
      dataIndex: "total",
      width: 120
    },
    {
      title: "Checked Out",
      dataIndex: "checked_out",
      width: 120
    },
    {
      title: "Purchase Cost",
      dataIndex: "purchase_cost",
      width: 120
    },
    {
      title: "Actions",
      dataIndex: "actions",
      width: 150,
      fixed: 'right',
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
    {
      title: "Checkout",
      dataIndex: "checkout",
      width: 120,
      fixed: 'right',
      render: (_, data) => (
        <div>
          {data.check_status == "checkin" ? (
            <Tag
              icon={<AiOutlineImport className="float-left mt-1 mr-1" />}
              color="#108ee9"
            >
              {data.check_status}
            </Tag>
          ) : (
            <Tag
              icon={<AiOutlineExport className="float-left mt-1 mr-1" />}
              color="#f50"
            >
              {data.check_status}
            </Tag>
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
              title: "Accessories",
            },
          ]}
        />
        <Space wrap>
          <Button icon={<AiOutlineUserDelete />} type="primary" danger>
            Show Deleted Accessories
          </Button>
          <Button icon={<AiOutlinePlus />} type="primary">
            Create New
          </Button>
        </Space>
      </div>
      <div className="flex justify-between">
        <Alert
          message="Note: This is the list of all accessories. Please check closely."
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
        scroll={{ x: 'max-content' }}
      />
    </div>
  );
}
