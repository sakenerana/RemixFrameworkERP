import { HomeOutlined, UserOutlined } from "@ant-design/icons";
import {
  Alert,
  Breadcrumb,
  Button,
  Input,
  Space,
  Table,
  TableColumnsType,
  TableProps,
} from "antd";
import { FcSearch } from "react-icons/fc";
import PrintDropdownComponent from "~/components/print_dropdown";

interface DataType {
  key: React.Key;
  image: string;
  name: string;
  location: string;
  exp_checkin_date: string;
  user_requesting: string;
  date_requested: string;
  action: string;
  check_status: string;
}

export default function RequestedRoute() {
  const data: DataType[] = [
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

  const columns: TableColumnsType<DataType> = [
    {
      title: "Image",
      dataIndex: "image",
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Location",
      dataIndex: "location",
    },
    {
      title: "Expected Checkin Date",
      dataIndex: "exp_checkin_date",
    },
    {
      title: "Requesting User",
      dataIndex: "user_requesting",
    },
    {
      title: "Requested Date",
      dataIndex: "date_requested",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: () => (
        <div>
          <Button color="pink" variant="solid">
            Cancel
          </Button>
        </div>
      ),
    },
    {
      title: "Checkout",
      dataIndex: "checkout",
      render: (_, data) => (
        <div>
          {data.check_status == "checkin" ? (
            <Button color="primary" variant="solid">
              {data.check_status}
            </Button>
          ) : (
            <Button color="danger" variant="solid">
              Checkout
            </Button>
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
      <div className="pb-5">
        <Breadcrumb
          items={[
            {
              href: "/main/dashboard",
              title: <HomeOutlined />,
            },
            {
              title: "Assets"
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
