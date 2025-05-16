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
  AiOutlineExport,
  AiOutlineImport,
} from "react-icons/ai";
import { FcRefresh, FcSearch } from "react-icons/fc";
import PrintDropdownComponent from "~/components/print_dropdown";
import { Requested } from "~/types/requested.type";

export default function RequestedRoute() {
  const data: Requested[] = [
    {
      key: "1",
      image: "John Brown",
      name: "test",
      location: "test",
      exp_checkin_date: "test",
      user_requesting: "test",
      date_requested: "test",
      action: "cancel",
      check_status: "checkin",
    },
    {
      key: "2",
      image: "John Brown",
      name: "test",
      location: "test",
      exp_checkin_date: "test",
      user_requesting: "test",
      date_requested: "test",
      action: "cancel",
      check_status: "checkout",
    },
    {
      key: "3",
      image: "John Brown",
      name: "test",
      location: "test",
      exp_checkin_date: "test",
      user_requesting: "test",
      date_requested: "test",
      action: "cancel",
      check_status: "checkin",
    },
    {
      key: "4",
      image: "John Brown",
      name: "test",
      location: "test",
      exp_checkin_date: "test",
      user_requesting: "test",
      date_requested: "test",
      action: "cancel",
      check_status: "checkout",
    },
    {
      key: "5",
      image: "John Brown",
      name: "test",
      location: "test",
      exp_checkin_date: "test",
      user_requesting: "test",
      date_requested: "test",
      action: "cancel",
      check_status: "checkout",
    },
    {
      key: "6",
      image: "John Brown",
      name: "test",
      location: "test",
      exp_checkin_date: "test",
      user_requesting: "test",
      date_requested: "test",
      action: "cancel",
      check_status: "checkout",
    },
    {
      key: "7",
      image: "John Brown",
      name: "test",
      location: "test",
      exp_checkin_date: "test",
      user_requesting: "test",
      date_requested: "test",
      action: "cancel",
      check_status: "checkin",
    },
    {
      key: "8",
      image: "John Brown",
      name: "test",
      location: "test",
      exp_checkin_date: "test",
      user_requesting: "test",
      date_requested: "test",
      action: "cancel",
      check_status: "checkout",
    },
    {
      key: "9",
      image: "John Brown",
      name: "test",
      location: "test",
      exp_checkin_date: "test",
      user_requesting: "test",
      date_requested: "test",
      action: "cancel",
      check_status: "checkin",
    },
    {
      key: "10",
      image: "John Brown",
      name: "test",
      location: "test",
      exp_checkin_date: "test",
      user_requesting: "test",
      date_requested: "test",
      action: "cancel",
      check_status: "checkout",
    },
  ];

  const handleCancelButton = () => { };

  const handleCheckinButton = () => { };

  const handleCheckoutButton = () => { };

  const columns: TableColumnsType<Requested> = [
    {
      title: "Image",
      dataIndex: "image",
      width: 120,
    },
    {
      title: "Name",
      dataIndex: "name",
      width: 120,
    },
    {
      title: "Location",
      dataIndex: "location",
      width: 120,
    },
    {
      title: "Expected Checkin Date",
      dataIndex: "exp_checkin_date",
      width: 120,
    },
    {
      title: "Requesting User",
      dataIndex: "user_requesting",
      width: 120,
    },
    {
      title: "Requested Date",
      dataIndex: "date_requested",
      width: 120,
    },
    {
      title: "Actions",
      dataIndex: "actions",
      fixed: "right",
      width: 120,
      render: () => (
        <div>
          <Popconfirm
            title="Do you want to cancel?"
            description="Are you sure to cancel this request?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleCancelButton()}
          >
            <Tag
              className="cursor-pointer"
              icon={<AiOutlineDelete className="float-left mt-1 mr-1" />}
              color="#d10f5c"
            >
              Cancel
            </Tag>
          </Popconfirm>
        </div>
      ),
    },
    {
      title: "Checkin/Checkout",
      dataIndex: "checkout",
      fixed: "right",
      width: 100,
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
                color="#108ee8"
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
                color="#ff5500"
              >
                {data.check_status}
              </Tag>
            </Popconfirm>
          )}
        </div>
      ),
    },
  ];

  const onChange: TableProps<Requested>["onChange"] = (
    pagination,
    filters,
    sorter,
    extra
  ) => {
    console.log("params", pagination, filters, sorter, extra);
  };

  return (
    <div>
      <div className="pb-5">
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
              title: "Requested",
            },
          ]}
        />
      </div>
      <div className="flex justify-between">
        <Alert
          message="Note: This is the list of all requested item. Please check closely."
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
      <Table<Requested>
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
