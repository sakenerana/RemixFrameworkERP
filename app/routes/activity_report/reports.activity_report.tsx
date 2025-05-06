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
} from "antd";
import { FcSearch } from "react-icons/fc";
import PrintDropdownComponent from "~/components/print_dropdown";

interface DataType {
  key: React.Key;
  name: string;
  product_key: string;
  expiration_date: string;
  licensed_to_email: string;
  licensed_to_name: string;
  manufacturer: string;
  min_qty: string;
  total: string;
  avail: string;
}

export default function ActivityReportRoutes() {
  const data: DataType[] = [
    {
      key: "1",
      name: "John Brown",
      product_key: "test",
      expiration_date: "test",
      licensed_to_email: "test",
      licensed_to_name: "test",
      manufacturer: "test",
      min_qty: "test",
      total: "test",
      avail: "test",
    },
    {
      key: "2",
      name: "John Brown",
      product_key: "test",
      expiration_date: "test",
      licensed_to_email: "test",
      licensed_to_name: "test",
      manufacturer: "test",
      min_qty: "test",
      total: "test",
      avail: "test",
    },
    {
      key: "3",
      name: "John Brown",
      product_key: "test",
      expiration_date: "test",
      licensed_to_email: "test",
      licensed_to_name: "test",
      manufacturer: "test",
      min_qty: "test",
      total: "test",
      avail: "test",
    },
    {
      key: "4",
      name: "John Brown",
      product_key: "test",
      expiration_date: "test",
      licensed_to_email: "test",
      licensed_to_name: "test",
      manufacturer: "test",
      min_qty: "test",
      total: "test",
      avail: "test",
    },
    {
      key: "5",
      name: "John Brown",
      product_key: "test",
      expiration_date: "test",
      licensed_to_email: "test",
      licensed_to_name: "test",
      manufacturer: "test",
      min_qty: "test",
      total: "test",
      avail: "test",
    },
    {
      key: "6",
      name: "John Brown",
      product_key: "test",
      expiration_date: "test",
      licensed_to_email: "test",
      licensed_to_name: "test",
      manufacturer: "test",
      min_qty: "test",
      total: "test",
      avail: "test",
    },
    {
      key: "7",
      name: "John Brown",
      product_key: "test",
      expiration_date: "test",
      licensed_to_email: "test",
      licensed_to_name: "test",
      manufacturer: "test",
      min_qty: "test",
      total: "test",
      avail: "test",
    },
    {
      key: "8",
      name: "John Brown",
      product_key: "test",
      expiration_date: "test",
      licensed_to_email: "test",
      licensed_to_name: "test",
      manufacturer: "test",
      min_qty: "test",
      total: "test",
      avail: "test",
    },
    {
      key: "9",
      name: "John Brown",
      product_key: "test",
      expiration_date: "test",
      licensed_to_email: "test",
      licensed_to_name: "test",
      manufacturer: "test",
      min_qty: "test",
      total: "test",
      avail: "test",
    },
    {
      key: "10",
      name: "John Brown",
      product_key: "test",
      expiration_date: "test",
      licensed_to_email: "test",
      licensed_to_name: "test",
      manufacturer: "test",
      min_qty: "test",
      total: "test",
      avail: "test",
    },
  ];

  const columns: TableColumnsType<DataType> = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Product Key",
      dataIndex: "product_key",
    },
    {
      title: "Expiration Date",
      dataIndex: "expiration_date",
    },
    {
      title: "Licensed to Email",
      dataIndex: "licensed_to_email",
    },
    {
      title: "Licensed to Name",
      dataIndex: "licensed_to_name",
    },
    {
      title: "Manufacturer",
      dataIndex: "manufacturer",
    },
    {
      title: "Min QTY",
      dataIndex: "min_qty",
    },
    {
      title: "Total",
      dataIndex: "total",
    },
    {
      title: "Avail",
      dataIndex: "avail",
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
              title: "Reports",
            },
            {
              title: "Activity Report",
            },
          ]}
        />
      </div>
      <div className="flex justify-between">
        <Alert
          message="Note: This is the list of all activity report. Please check closely."
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
