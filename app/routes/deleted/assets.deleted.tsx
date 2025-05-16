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
import { AiOutlineSync } from "react-icons/ai";
import { FcRefresh, FcSearch } from "react-icons/fc";
import PrintDropdownComponent from "~/components/print_dropdown";
import { Deleted } from "~/types/deleted.type";

export default function DeletedRoute() {
  const data: Deleted[] = [
    {
      key: "1",
      asset_name: "John Brown",
      item_image: "test",
      asset_tag: "test",
      serial_no: "test",
      item_model: "test",
      item_category: "test",
      status: "test",
      checked_out_to: "test",
      location: "test",
      purchase_cost: 123,
      current_value: 123,
      cpu: "test",
      accounting_code: "test",
      check_status: "test",
      action: "test",
    },
  ];

  const handleRestoreButton = () => { }

  const columns: TableColumnsType<Deleted> = [
    {
      title: "Asset Name",
      dataIndex: "asset_name",
      width: 120,
    },
    {
      title: "Item Image",
      dataIndex: "item_image",
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
      dataIndex: "item_model",
      width: 120,
    },
    {
      title: "Category",
      dataIndex: "item_category",
      width: 120,
    },
    {
      title: "Status",
      dataIndex: "status",
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
      title: "CPU",
      dataIndex: "cpu",
      width: 120,
    },
    {
      title: "Accounting Code",
      dataIndex: "accounting_code",
      width: 120,
    },
    {
      title: "Actions",
      dataIndex: "actions",
      width: 120,
      fixed: "right",
      render: () => (
        <div>
          <Popconfirm
            title="Do you want to restore?"
            description="Are you sure to restore this request?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleRestoreButton()}
          >
            <Tag
              className="cursor-pointer"
              icon={<AiOutlineSync className="float-left mt-1 mr-1" />}
              color="#d10f5c"
            >
              Restore
            </Tag>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const onChange: TableProps<Deleted>["onChange"] = (
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
              title: "Deleted",
            },
          ]}
        />
      </div>
      <div className="flex justify-between">
        <Alert
          message="Note: This is the list of all deleted item. Please check closely."
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
      <Table<Deleted>
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
