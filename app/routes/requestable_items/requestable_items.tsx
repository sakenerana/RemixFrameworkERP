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
import { AiOutlineCheck, AiOutlineClose, AiOutlinePlus } from "react-icons/ai";
import { FcSearch } from "react-icons/fc";
import PrintDropdownComponent from "~/components/print_dropdown";

interface DataType {
  key: React.Key;
  image: string;
  asset_tag: string;
  model: string;
  model_no: string;
  asset_name: string;
  serial_no: string;
  location: string;
  status: string;
  expected_checkin_date: string;
  cpu: string;
  request_status: string;
}

export default function RequestableItemsRoutes() {
  const data: DataType[] = [
    {
      key: "1",
      image: "John Brown",
      asset_tag: "test",
      model: "test",
      model_no: "test",
      asset_name: "test",
      serial_no: "test",
      location: "test",
      status: "test",
      expected_checkin_date: "test",
      cpu: "test",
      request_status: "request",
    },
    {
      key: "2",
      image: "John Brown",
      asset_tag: "test",
      model: "test",
      model_no: "test",
      asset_name: "test",
      serial_no: "test",
      location: "test",
      status: "test",
      expected_checkin_date: "test",
      cpu: "test",
      request_status: "request",
    },
    {
      key: "3",
      image: "John Brown",
      asset_tag: "test",
      model: "test",
      model_no: "test",
      asset_name: "test",
      serial_no: "test",
      location: "test",
      status: "test",
      expected_checkin_date: "test",
      cpu: "test",
      request_status: "request",
    },
    {
      key: "4",
      image: "John Brown",
      asset_tag: "test",
      model: "test",
      model_no: "test",
      asset_name: "test",
      serial_no: "test",
      location: "test",
      status: "test",
      expected_checkin_date: "test",
      cpu: "test",
      request_status: "unrequest",
    },
    {
      key: "5",
      image: "John Brown",
      asset_tag: "test",
      model: "test",
      model_no: "test",
      asset_name: "test",
      serial_no: "test",
      location: "test",
      status: "test",
      expected_checkin_date: "test",
      cpu: "test",
      request_status: "request",
    },
    {
      key: "6",
      image: "John Brown",
      asset_tag: "test",
      model: "test",
      model_no: "test",
      asset_name: "test",
      serial_no: "test",
      location: "test",
      status: "test",
      expected_checkin_date: "test",
      cpu: "test",
      request_status: "request",
    },
    {
      key: "7",
      image: "John Brown",
      asset_tag: "test",
      model: "test",
      model_no: "test",
      asset_name: "test",
      serial_no: "test",
      location: "test",
      status: "test",
      expected_checkin_date: "test",
      cpu: "test",
      request_status: "unrequest",
    },
    {
      key: "8",
      image: "John Brown",
      asset_tag: "test",
      model: "test",
      model_no: "test",
      asset_name: "test",
      serial_no: "test",
      location: "test",
      status: "test",
      expected_checkin_date: "test",
      cpu: "test",
      request_status: "request",
    },
    {
      key: "9",
      image: "John Brown",
      asset_tag: "test",
      model: "test",
      model_no: "test",
      asset_name: "test",
      serial_no: "test",
      location: "test",
      status: "test",
      expected_checkin_date: "test",
      cpu: "test",
      request_status: "request",
    },
    {
      key: "10",
      image: "John Brown",
      asset_tag: "test",
      model: "test",
      model_no: "test",
      asset_name: "test",
      serial_no: "test",
      location: "test",
      status: "test",
      expected_checkin_date: "test",
      cpu: "test",
      request_status: "request",
    },
  ];

  const handleCancelButton = () => {};

  const handleRequestButton = () => {};

  const columns: TableColumnsType<DataType> = [
    {
      title: "Image",
      dataIndex: "image",
      width: 120,
    },
    {
      title: "Asset Tag",
      dataIndex: "asset_tag",
      width: 120,
    },
    {
      title: "Model",
      dataIndex: "model",
      width: 120,
    },
    {
      title: "Model No.",
      dataIndex: "model_no",
      width: 120,
    },
    {
      title: "Asset Name",
      dataIndex: "asset_name",
      width: 120,
    },
    {
      title: "Serial",
      dataIndex: "serial_no",
      width: 120,
    },
    {
      title: "Location",
      dataIndex: "location",
      width: 120,
    },
    {
      title: "Status",
      dataIndex: "status",
      width: 120,
    },
    {
      title: "Expected Checkin Date",
      dataIndex: "expected_checkin_date",
      width: 120,
    },
    {
      title: "CPU",
      dataIndex: "cpu",
      width: 120,
    },
    {
      title: "Actions",
      dataIndex: "actions",
      width: 120,
      fixed: "right",
      render: (_, data) => (
        <div>
          {data.request_status == "request" ? (
            <Popconfirm
              title="Do you want to cancel?"
              description="Are you sure to cancel this request?"
              okText="Yes"
              cancelText="No"
              onConfirm={() => handleCancelButton()}
            >
              <Tag
                className="cursor-pointer"
                icon={<AiOutlineClose className="float-left mt-1 mr-1" />}
                color="#f50"
              >
                Cancel
              </Tag>
            </Popconfirm>
          ) : (
            <Popconfirm
              title="Do you want to request?"
              description="Are you sure to request this item?"
              okText="Yes"
              cancelText="No"
              onConfirm={() => handleRequestButton()}
            >
              <Tag
                className="cursor-pointer"
                icon={<AiOutlineCheck className="float-left mt-1 mr-1" />}
                color="#108ee9"
              >
                Request
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
              title: "Requestable Items",
            },
          ]}
        />
        <Button icon={<AiOutlinePlus />} type="primary">
          Create New
        </Button>
      </div>
      <div className="flex justify-between">
        <Alert
          message="Note: This is the list of all requestable items. Please check closely."
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
        scroll={{ x: "max-content" }}
      />
    </div>
  );
}
