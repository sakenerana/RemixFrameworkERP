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
  AiOutlineFileExclamation,
  AiOutlineImport,
  AiOutlinePlus,
} from "react-icons/ai";
import { FcRefresh, FcSearch } from "react-icons/fc";
import PrintDropdownComponent from "~/components/print_dropdown";

interface DataType {
  key: React.Key;
  name: string;
  action: string;
  check_status: string;
}

export default function PredefinedKitRoute() {
  const data: DataType[] = [
    {
      key: "1",
      name: "John Brown",
      action: "test",
      check_status: "checkout",
    },
    {
      key: "2",
      name: "John Brown",
      action: "test",
      check_status: "checkout",
    },
    {
      key: "3",
      name: "John Brown",
      action: "test",
      check_status: "checkout",
    },
    {
      key: "4",
      name: "John Brown",
      action: "test",
      check_status: "checkout",
    },
    {
      key: "5",
      name: "John Brown",
      action: "test",
      check_status: "checkout",
    },
    {
      key: "6",
      name: "John Brown",
      action: "test",
      check_status: "checkout",
    },
    {
      key: "7",
      name: "John Brown",
      action: "test",
      check_status: "checkout",
    },
    {
      key: "8",
      name: "John Brown",
      action: "test",
      check_status: "checkout",
    },
    {
      key: "9",
      name: "John Brown",
      action: "test",
      check_status: "checkout",
    },
    {
      key: "10",
      name: "John Brown",
      action: "test",
      check_status: "checkout",
    },
  ];

  const columns: TableColumnsType<DataType> = [
    {
      title: "Name",
      dataIndex: "name",
      width: 350
    },
    {
      title: "Actions",
      dataIndex: "actions",
      width: 120,
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
      title: "Checkin/Checkout",
      dataIndex: "check_status",
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
              title: "Predefined Kits",
            },
          ]}
        />
        <Space wrap>
          <Button icon={<AiOutlineFileExclamation />} type="primary" danger>
            Show Deleted Predefined Kit
          </Button>
          <Button icon={<AiOutlinePlus />} type="primary">
            Create New
          </Button>
        </Space>
      </div>
      <div className="flex justify-between">
        <Alert
          message="Note: This is the list of all predefined kit. Please check closely."
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
