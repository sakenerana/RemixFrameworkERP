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
import { DepreciationReport } from "~/types/depreciation_report.type";

export default function DepreciationReportRoutes() {
  const data: DepreciationReport[] = [
    {
      key: "1",
      name: "John Brown",
      product_key: "test",
      expiration_date: "test",
      licensed_to_email: "test",
      licensed_to_name: "test",
      manufacturer: "test",
      min_qty: 123,
      total: 123,
      avail: "test",
      action: "test",
      check_status: "checkout",
    },
  ];

  const columns: TableColumnsType<DepreciationReport> = [
    {
      title: "Name",
      dataIndex: "name",
      width: 120
    },
    {
      title: "Product Key",
      dataIndex: "product_key",
      width: 120
    },
    {
      title: "Expiration Date",
      dataIndex: "expiration_date",
      width: 120
    },
    {
      title: "Licensed to Email",
      dataIndex: "licensed_to_email",
      width: 120
    },
    {
      title: "Licensed to Name",
      dataIndex: "licensed_to_name",
      width: 120
    },
    {
      title: "Manufacturer",
      dataIndex: "manufacturer",
      width: 120
    },
    {
      title: "Min QTY",
      dataIndex: "min_qty",
      width: 120
    },
    {
      title: "Total",
      dataIndex: "total",
      width: 120
    },
    {
      title: "Avail",
      dataIndex: "avail",
      width: 120
    },
  ];

  const onChange: TableProps<DepreciationReport>["onChange"] = (
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
              title: "Reports",
            },
            {
              title: "Depreciation Report",
            },
          ]}
        />
      </div>
      <div className="flex justify-between">
        <Alert
          message="Note: This is the list of all depreciation report. Please check closely."
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
      <Table<DepreciationReport>
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
