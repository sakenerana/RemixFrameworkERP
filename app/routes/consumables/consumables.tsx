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
  AiOutlineFileExclamation,
  AiOutlineImport,
  AiOutlinePlus,
} from "react-icons/ai";
import { FcRefresh, FcSearch } from "react-icons/fc";
import PrintDropdownComponent from "~/components/print_dropdown";

interface DataType {
  key: React.Key;
  name: string;
  category: string;
  model_no: string;
  item_no: string;
  min_qty: string;
  total: string;
  remaining: string;
  location: string;
  order_no: string;
  purchase_date: string;
  purchase_cost: string;
  action: string;
  check_status: string;
}

export default function ConsumablesRoute() {
  const data: DataType[] = [
    {
      key: "1",
      name: "John Brown",
      category: "test",
      model_no: "test",
      item_no: "test",
      min_qty: "test",
      total: "test",
      remaining: "test",
      location: "test",
      order_no: "test",
      purchase_date: "test",
      purchase_cost: "test",
      action: "test",
      check_status: "checkout",
    },
    {
      key: "2",
      name: "John Brown",
      category: "test",
      model_no: "test",
      item_no: "test",
      min_qty: "test",
      total: "test",
      remaining: "test",
      location: "test",
      order_no: "test",
      purchase_date: "test",
      purchase_cost: "test",
      action: "test",
      check_status: "checkout",
    },
    {
      key: "3",
      name: "John Brown",
      category: "test",
      model_no: "test",
      item_no: "test",
      min_qty: "test",
      total: "test",
      remaining: "test",
      location: "test",
      order_no: "test",
      purchase_date: "test",
      purchase_cost: "test",
      action: "test",
      check_status: "checkout",
    },
    {
      key: "4",
      name: "John Brown",
      category: "test",
      model_no: "test",
      item_no: "test",
      min_qty: "test",
      total: "test",
      remaining: "test",
      location: "test",
      order_no: "test",
      purchase_date: "test",
      purchase_cost: "test",
      action: "test",
      check_status: "checkout",
    },
    {
      key: "5",
      name: "John Brown",
      category: "test",
      model_no: "test",
      item_no: "test",
      min_qty: "test",
      total: "test",
      remaining: "test",
      location: "test",
      order_no: "test",
      purchase_date: "test",
      purchase_cost: "test",
      action: "test",
      check_status: "checkout",
    },
    {
      key: "6",
      name: "John Brown",
      category: "test",
      model_no: "test",
      item_no: "test",
      min_qty: "test",
      total: "test",
      remaining: "test",
      location: "test",
      order_no: "test",
      purchase_date: "test",
      purchase_cost: "test",
      action: "test",
      check_status: "checkout",
    },
    {
      key: "7",
      name: "John Brown",
      category: "test",
      model_no: "test",
      item_no: "test",
      min_qty: "test",
      total: "test",
      remaining: "test",
      location: "test",
      order_no: "test",
      purchase_date: "test",
      purchase_cost: "test",
      action: "test",
      check_status: "checkout",
    },
    {
      key: "8",
      name: "John Brown",
      category: "test",
      model_no: "test",
      item_no: "test",
      min_qty: "test",
      total: "test",
      remaining: "test",
      location: "test",
      order_no: "test",
      purchase_date: "test",
      purchase_cost: "test",
      action: "test",
      check_status: "checkin",
    },
    {
      key: "9",
      name: "John Brown",
      category: "test",
      model_no: "test",
      item_no: "test",
      min_qty: "test",
      total: "test",
      remaining: "test",
      location: "test",
      order_no: "test",
      purchase_date: "test",
      purchase_cost: "test",
      action: "test",
      check_status: "checkout",
    },
    {
      key: "10",
      name: "John Brown",
      category: "test",
      model_no: "test",
      item_no: "test",
      min_qty: "test",
      total: "test",
      remaining: "test",
      location: "test",
      order_no: "test",
      purchase_date: "test",
      purchase_cost: "test",
      action: "test",
      check_status: "checkout",
    },
  ];

  const handleUpdateButton = () => {};

  const handleDeleteButton = () => {};

  const handleCheckinButton = () => {};

  const handleCheckoutButton = () => {};

  const columns: TableColumnsType<DataType> = [
    {
      title: "Name",
      dataIndex: "name",
      width: 120,
    },
    {
      title: "Category",
      dataIndex: "category",
      width: 120,
    },
    {
      title: "Model No.",
      dataIndex: "model_no",
      width: 120,
    },
    {
      title: "Item No.",
      dataIndex: "item_no",
      width: 120,
    },
    {
      title: "Min. QTY",
      dataIndex: "min_qty",
      width: 120,
    },
    {
      title: "Total",
      dataIndex: "total",
      width: 120,
    },
    {
      title: "Min QTY",
      dataIndex: "min_qty",
      width: 120,
    },
    {
      title: "Total",
      dataIndex: "total",
      width: 120,
    },
    {
      title: "Remaining",
      dataIndex: "remaining",
      width: 120,
    },
    {
      title: "Location",
      dataIndex: "location",
      width: 120,
    },
    {
      title: "Order No.",
      dataIndex: "order_no",
      width: 120,
    },
    {
      title: "Purchase Date",
      dataIndex: "purchase_date",
      width: 120,
    },
    {
      title: "Purchase Cost",
      dataIndex: "purchase_cost",
      width: 120,
    },
    {
      title: "Actions",
      dataIndex: "actions",
      width: 180,
      fixed: "right",
      render: () => (
        <div className="flex">
          <Popconfirm
            title="Do you want to update?"
            description="Are you sure to update this consumable?"
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
            description="Are you sure to delete this consumable?"
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
              description="Are you sure to checkin this request?"
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
              description="Are you sure to checkout this request?"
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
              title: "Consumables",
            },
          ]}
        />
        <Space wrap>
          <Button icon={<AiOutlineFileExclamation />} type="primary" danger>
            Show Deleted Consumables
          </Button>
          <Button icon={<AiOutlinePlus />} type="primary">
            Create New
          </Button>
        </Space>
      </div>
      <div className="flex justify-between">
        <Alert
          message="Note: This is the list of all consumables item. Please check closely."
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
