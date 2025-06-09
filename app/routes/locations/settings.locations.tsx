import { CheckCircleOutlined, HomeOutlined, LoadingOutlined, SettingOutlined } from "@ant-design/icons";
import { useNavigate } from "@remix-run/react";
import {
  Alert,
  Breadcrumb,
  Button,
  Checkbox,
  Col,
  Divider,
  Dropdown,
  Form,
  Input,
  MenuProps,
  message,
  Modal,
  Popconfirm,
  Row,
  Space,
  Spin,
  Table,
  TableColumnsType,
  TableProps,
  Tag,
} from "antd";
import { useEffect, useState } from "react";
import {
  AiOutlineCloseCircle,
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlineFileExclamation,
  AiOutlinePlus,
  AiOutlineSend,
} from "react-icons/ai";
import { FcRefresh, FcSearch } from "react-icons/fc";
import { Link } from "react-router-dom";
import PrintDropdownComponent from "~/components/print_dropdown";
import { LocationService } from "~/services/location.service";
import { Location } from "~/types/location.type";

export default function LocationsRoutes() {
  const [data, setData] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);

  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState<Location[]>([]);

  const handleRefetch = async () => {
    setLoading(true);
    await fetchData();
    setLoading(false);
  };

  // const handleTrack = () => {
  //   setIsEditMode(false);
  //   setIsModalOpen(true);
  //   setEditingId(null);
  //   form.resetFields();
  //   setIsTitle('Create Location')
  // };

  // // Edit record
  // const editRecord = (record: Location) => {
  //   setIsEditMode(true);
  //   form.setFieldsValue(record);
  //   setEditingId(record.id);
  //   setIsModalOpen(true);
  //   setIsTitle('Update Location')
  // };

  const handleDeactivateButton = async (record: Location) => {
    const { error } = await LocationService.deactivateStatus(
      record.id,
      record
    );

    if (error) throw message.error(error.message);
    message.success("Record deactivated successfully");
    fetchData();
  };

  // Fetch data from Supabase
  const fetchData = async () => {
    try {
      setLoading(true);
      const dataFetch = await LocationService.getAllPosts();
      setData(dataFetch); // Works in React state
    } catch (error) {
      message.error("error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchText.trim() === '') {
      fetchData();
    } else {
      const filtered = data.filter(data =>
        data.name?.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredData(filtered);
    }

  }, [searchText]); // Empty dependency array means this runs once on mount


  // State for column visibility
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({
    "Location Name": true,
    "Image": true,
    "Current Location": true,
    "Address": true,
    "City": true,
    "State": true,
    "Postal Code": false,
    "Country": false,
    "Fax": false,
    "Status": true,
    "Actions": true,
  });

  const columns: TableColumnsType<Location> = [
    {
      title: "Location Name",
      dataIndex: "name",
      width: 120,
    },
    {
      title: "Image",
      dataIndex: "image",
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
      title: "Postal Code",
      dataIndex: "postal_code",
      width: 120,
    },
    {
      title: "Country",
      dataIndex: "country",
      width: 120,
    },
    {
      title: "Fax",
      dataIndex: "fax",
      width: 120,
    },
    {
      title: "Status",
      dataIndex: "status",
      width: 120,
      render: (_, record) => {
        if (record.status_labels.name === 'Active') {
          return (
            <Tag color="green">
              <CheckCircleOutlined className="float-left mt-1 mr-1" /> Active
            </Tag>
          );
        } else if (record.status_labels.name === 'Inactive') {
          return (
            <Tag color="red">
              <AiOutlineCloseCircle className="float-left mt-1 mr-1" /> Inactive
            </Tag>
          );
        }
      },
    },
    {
      title: "Actions",
      dataIndex: "actions",
      width: 120,
      fixed: "right",
      render: (_, record) => (
        <div className="flex">
          <Popconfirm
            title="Do you want to update?"
            description="Are you sure to update this location?"
            okText="Yes"
            cancelText="No"
          // onConfirm={() => editRecord(record)}
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
            title="Do you want to deactivate?"
            description="Are you sure to deactivate this location?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDeactivateButton(record)}
          >
            {record.status_labels.name === 'Active' && (
              <Tag
                className="cursor-pointer"
                icon={<AiOutlineDelete className="float-left mt-1 mr-1" />}
                color="#f50"
              >
                Deactivate
              </Tag>
            )}
            {record.status_labels.name === 'Inactive' && (
              <Tag
                className="cursor-pointer"
                icon={<AiOutlineDelete className="float-left mt-1 mr-1" />}
                color="#1677ff"
              >
                Activate
              </Tag>
            )}
          </Popconfirm>
        </div>
      ),
    },
  ];

  // Toggle column visibility
  const toggleColumn = (columnTitle: string) => {
    setColumnVisibility(prev => ({
      ...prev,
      [columnTitle]: !prev[columnTitle]
    }));
  };

  // Create dropdown menu items
  const columnMenuItems: MenuProps['items'] = Object.keys(columnVisibility).map(columnTitle => ({
    key: columnTitle,
    label: (
      <Checkbox
        checked={columnVisibility[columnTitle]}
        onClick={() => toggleColumn(columnTitle)}
      >
        {columnTitle}
      </Checkbox>
    ),
  }));

  // Filter columns based on visibility
  const filteredColumns = columns.filter(column =>
    column.title ? columnVisibility[column.title.toString()] : true
  );

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
              href: "/inventory",
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
            <Button icon={<AiOutlineFileExclamation />} danger>
              Show Inactive Locations
            </Button>
          </Link>
          <Link to={"form-location"}>
            <Button icon={<AiOutlinePlus />} type="primary">
              Create Location
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
            <Input.Search onChange={(e) => setSearchText(e.target.value)} placeholder="Search" />
          </Space.Compact>
          <Space wrap>
            <Button onClick={handleRefetch} icon={<FcRefresh />} type="default">
              Refresh
            </Button>
          </Space>
          <Space wrap>
            <Dropdown
              menu={{ items: columnMenuItems }}
              placement="bottomRight"
              trigger={['click']}
            >
              <Button icon={<SettingOutlined />}>Columns</Button>
            </Dropdown>
            <PrintDropdownComponent stateData={data}></PrintDropdownComponent>
          </Space>
        </Space>
      </div>
      {loading && <Spin></Spin>}
      {!loading && (
        <Table<Location>
          size="small"
          columns={filteredColumns}
          dataSource={searchText ? filteredData : data}
          onChange={onChange}
          className="pt-5"
          bordered
          scroll={{ x: "max-content" }}
        />
      )}
    </div>
  );
}
