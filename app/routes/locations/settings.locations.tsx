import { HomeOutlined } from "@ant-design/icons";
import { useNavigate } from "@remix-run/react";
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
  AiOutlineFileExclamation,
  AiOutlinePlus,
} from "react-icons/ai";
import { FcRefresh, FcSearch } from "react-icons/fc";
import { Link } from "react-router-dom";
import PrintDropdownComponent from "~/components/print_dropdown";
import { Location } from "~/types/location.type";

export default function LocationsRoutes() {
  const navigate = useNavigate();

  const data: Location[] = [
    {
      key: "1",
      location_name: "John Brown",
      image: "test",
      parent: "test",
      current_location: "test",
      address: "test",
      city: "test",
      state: "test",
      action: "test",
    },
    {
      key: "2",
      location_name: "John Brown",
      image: "test",
      parent: "test",
      current_location: "test",
      address: "test",
      city: "test",
      state: "test",
      action: "test",
    },
    {
      key: "3",
      location_name: "John Brown",
      image: "test",
      parent: "test",
      current_location: "test",
      address: "test",
      city: "test",
      state: "test",
      action: "test",
    },
    {
      key: "4",
      location_name: "John Brown",
      image: "test",
      parent: "test",
      current_location: "test",
      address: "test",
      city: "test",
      state: "test",
      action: "test",
    },
    {
      key: "5",
      location_name: "John Brown",
      image: "test",
      parent: "test",
      current_location: "test",
      address: "test",
      city: "test",
      state: "test",
      action: "test",
    },
    {
      key: "6",
      location_name: "John Brown",
      image: "test",
      parent: "test",
      current_location: "test",
      address: "test",
      city: "test",
      state: "test",
      action: "test",
    },
    {
      key: "7",
      location_name: "John Brown",
      image: "test",
      parent: "test",
      current_location: "test",
      address: "test",
      city: "test",
      state: "test",
      action: "test",
    },
    {
      key: "8",
      location_name: "John Brown",
      image: "test",
      parent: "test",
      current_location: "test",
      address: "test",
      city: "test",
      state: "test",
      action: "test",
    },
    {
      key: "9",
      location_name: "John Brown",
      image: "test",
      parent: "test",
      current_location: "test",
      address: "test",
      city: "test",
      state: "test",
      action: "test",
    },
    {
      key: "10",
      location_name: "John Brown",
      image: "test",
      parent: "test",
      current_location: "test",
      address: "test",
      city: "test",
      state: "test",
      action: "test",
    },
  ];

  const handleUpdateButton = () => {
    navigate("update-location");
  };

  const handleDeleteButton = () => {};

  const columns: TableColumnsType<Location> = [
    {
      title: "Location Name",
      dataIndex: "location_name",
      width: 120,
    },
    {
      title: "Image",
      dataIndex: "image",
      width: 120,
    },
    {
      title: "Parent",
      dataIndex: "parent",
      width: 120,
    },
    {
      title: "Current Location",
      dataIndex: "current_location",
      width: 120,
    },
    {
      title: "Address",
      dataIndex: "address",
      width: 120,
    },
    {
      title: "City",
      dataIndex: "city",
      width: 120,
    },
    {
      title: "State",
      dataIndex: "state",
      width: 120,
    },
    {
      title: "Actions",
      dataIndex: "actions",
      width: 120,
      fixed: "right",
      render: () => (
        <div className="flex">
          <Popconfirm
            title="Do you want to update?"
            description="Are you sure to update this location?"
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
            description="Are you sure to delete this location?"
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
  ];

  const onChange: TableProps<Location>["onChange"] = (
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
              title: "Settings",
            },
            {
              title: "Locations",
            },
          ]}
        />
        <Space wrap>
          <Link to={"deleted-location"}>
            <Button icon={<AiOutlineFileExclamation />} type="primary" danger>
              Show Deleted Locations
            </Button>
          </Link>
          <Link to={"create-location"}>
            <Button icon={<AiOutlinePlus />} type="primary">
              Create New
            </Button>
          </Link>
        </Space>
      </div>
      <div className="flex justify-between">
        <Alert
          message="Note: This is the list of all locations. Please check closely."
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
      <Table<Location>
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
