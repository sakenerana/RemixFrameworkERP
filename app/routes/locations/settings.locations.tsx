import { CheckCircleOutlined, EnvironmentOutlined, HomeOutlined, LoadingOutlined, SettingOutlined } from "@ant-design/icons";
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
import { useEffect, useMemo, useState } from "react";
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
  const [isUserID, setUserID] = useState<any>();
  const [isDepartmentID, setDepartmentID] = useState<any>();

  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState<Location[]>([]);

  const navigate = useNavigate();

  const handleRefetch = async () => {
    setLoading(true);
    await fetchData();
    setLoading(false);
  };

  // Edit record
  const editRecord = (record: Location) => {
    navigate(`form-location/${record.id}`);
  };

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
      const dataFetch = await LocationService.getAllPosts(isDepartmentID);
      setData(dataFetch); // Works in React state
    } catch (error) {
      message.error("error");
    } finally {
      setLoading(false);
    }
  };

  useMemo(() => {
    setUserID(localStorage.getItem('userAuthID'));
    setDepartmentID(localStorage.getItem('userDept'));
  }, []);

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
    "Address": true,
    "Address 2": false,
    "City": true,
    "State": true,
    "Postal Code": false,
    "Country": false,
    "Zip": false,
    "Notes": false,
    "Status": true,
    "Actions": true,
  });

  const columns: TableColumnsType<Location> = [
    {
      title: "Location Name",
      dataIndex: "name",
      width: 120,
      render: (text) => text || 'N/A'
    },
    {
      title: "Address",
      dataIndex: "address",
      width: 120,
      render: (text) => text || 'N/A'
    },
    {
      title: "Address 2",
      dataIndex: "address2",
      width: 120,
      render: (text) => text || 'N/A'
    },
    {
      title: "City",
      dataIndex: "city",
      width: 120,
      render: (text) => text || 'N/A'
    },
    {
      title: "State",
      dataIndex: "state",
      width: 120,
      render: (text) => text || 'N/A'
    },
    {
      title: "Postal Code",
      dataIndex: "postal_code",
      width: 120,
      render: (text) => text || 'N/A'
    },
    {
      title: "Country",
      dataIndex: "country",
      width: 120,
      render: (text) => text || 'N/A'
    },
    {
      title: "Zip",
      dataIndex: "zip",
      width: 120,
      render: (text) => text || 'N/A'
    },
    {
      title: "Notes",
      dataIndex: "notes",
      width: 120,
      render: (text) => text || 'N/A'
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
      width: 190,
      fixed: "right",
      render: (_, record) => (
        <div className="flex">
          <Popconfirm
            title="Do you want to update?"
            description="Are you sure to update this location?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => editRecord(record)}
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
    <div className="w-full px-6 py-4 rounded-lg shadow-sm">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <Breadcrumb
            items={[
              {
                href: "/inventory",
                title: <HomeOutlined className="text-gray-400" />,
              },
              {
                title: <span className="text-gray-500">Settings</span>,
              },
              {
                title: <span className="text-blue-600 font-medium">Locations</span>,
              },
            ]}
            className="text-sm"
          />
        </div>

        <Space wrap className="mt-2 sm:mt-0">
          <Link to="deleted-location">
            <Button
              icon={<AiOutlineFileExclamation />}
              danger
              className="flex items-center gap-2 border-red-500 text-red-500 hover:bg-red-50"
            >
              Inactive Locations
            </Button>
          </Link>
          <Link to="form-location">
            <Button
              icon={<AiOutlinePlus />}
              type="primary"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              Add Location
            </Button>
          </Link>
        </Space>
      </div>

      {/* Toolbar Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6 rounded-lg">
        <Alert
          message="Location Directory: Manage all physical locations in your inventory system."
          type="info"
          showIcon
        />

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto">
          <Input.Search
            allowClear
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search locations..."
            className="w-full sm:w-64"
            size="middle"
          />

          <Space>
            <Button
              onClick={handleRefetch}
              icon={<FcRefresh className="text-blue-500" />}
              className="flex items-center gap-2 hover:border-blue-500"
            >
              Refresh
            </Button>

            <Dropdown
              menu={{
                items: columnMenuItems,
                className: "shadow-lg rounded-md"
              }}
              placement="bottomRight"
              trigger={['click']}
            >
              <Button
                icon={<SettingOutlined />}
                className="flex items-center gap-2 hover:border-blue-500"
              >
                Columns
              </Button>
            </Dropdown>

            <PrintDropdownComponent
              stateData={data}
              buttonProps={{
                className: "flex items-center gap-2 hover:border-blue-500",
              }}
            />
          </Space>
        </div>
      </div>

      {/* Table Section */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spin
            size="large"
            tip="Loading location data..."
            indicator={<LoadingOutlined style={{ fontSize: 36 }} spin />}
          />
        </div>
      ) : (
        <Table<Location>
          size="middle"
          columns={filteredColumns}
          dataSource={searchText ? filteredData : data}
          onChange={onChange}
          className="shadow-sm rounded-lg overflow-hidden"
          bordered
          scroll={{ x: "max-content" }}
          rowKey="id"
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            defaultPageSize: 20,
            className: "px-4 py-2",
            showTotal: (total) => `Total ${total} locations`,
          }}
          locale={{
            emptyText: (
              <div className="py-8 flex flex-col items-center">
                <EnvironmentOutlined className="text-3xl text-gray-400 mb-2" />
                <p className="text-gray-500">No locations found</p>
                <Button
                  type="primary"
                  className="mt-4"
                  onClick={() => navigate('/inventory/settings/locations/form-location')}
                >
                  <AiOutlinePlus className="mr-2" />
                  Add First Location
                </Button>
              </div>
            )
          }}
        />
      )}
    </div>
  );
}
