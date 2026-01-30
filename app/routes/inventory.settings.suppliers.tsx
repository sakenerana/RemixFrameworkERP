import { CheckCircleOutlined, EnvironmentOutlined, HomeOutlined, LinkOutlined, LoadingOutlined, SettingOutlined, ShopOutlined } from "@ant-design/icons";
import {
  Alert,
  Avatar,
  Breadcrumb,
  Button,
  Card,
  Checkbox,
  Dropdown,
  Input,
  MenuProps,
  message,
  Popconfirm,
  Space,
  Spin,
  Table,
  TableColumnsType,
  Tag,
} from "antd";
import { useEffect, useMemo, useState } from "react";
import {
  AiOutlineCloseCircle,
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlineFileExclamation,
  AiOutlineMail,
  AiOutlinePhone,
  AiOutlinePlus,
} from "react-icons/ai";
import { FcRefresh } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import PrintDropdownComponent from "~/components/print_dropdown";
import { SupplierService } from "~/services/supplier.service";
import { Supplier } from "~/types/supplier.type";

export default function SuppliersRoutes() {
  const [data, setData] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(false);
  const [isUserID, setUserID] = useState<any>();
  const [isDepartmentID, setDepartmentID] = useState<any>();

  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState<Supplier[]>([]);

  const navigate = useNavigate();

  const handleRefetch = async () => {
    setLoading(true);
    await fetchData();
    setLoading(false);
  };

  // Edit record
  const editRecord = (record: Supplier) => {
    navigate(`/inventory/settings/form-supplier/${record.id}`);
  };

  const handleDeactivateButton = async (record: Supplier) => {
    const { error } = await SupplierService.deactivateStatus(
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
      const dataFetch = await SupplierService.getAllPosts(isDepartmentID);
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
    "Name": true,
    "URL": true,
    "Address": true,
    "Address 2": false,
    "City": true,
    "State": true,
    "Postal Code": false,
    "Country": false,
    "Phone": false,
    "Fax": false,
    "Email": false,
    "Notes": false,
    "Status": true,
    "Actions": true,
  });

  const columns: TableColumnsType<Supplier> = [
    {
      title: "Name",
      dataIndex: "name",
      width: 120,
      fixed: 'left',
      render: (text) => (
        <div className="flex items-center">
          <Avatar
            src="/img/supplier-icon.png"
            size="small"
            className="mr-3 bg-blue-100 text-blue-600"
            icon={<ShopOutlined />}
          />
          <span className="font-medium">
            {text || <span>N/A</span>}
          </span>
        </div>
      )
    },
    {
      title: "URL",
      dataIndex: "url",
      width: 120,
      render: (text) => text ? (
        <a
          href={text.startsWith('http') ? text : `https://${text}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline flex items-center truncate"
        >
          <LinkOutlined className="mr-2" />
          {text.replace(/^https?:\/\//, '')}
        </a>
      ) : <span className="text-gray-400">N/A</span>
    },
    {
      title: "Address",
      dataIndex: "address",
      width: 120,
      render: (text, record) => (
        <div className="flex items-start">
          <EnvironmentOutlined className="mr-2 mt-1 text-gray-400" />
          <div>
            <div className="text-sm">{record.address || 'N/A'}</div>
          </div>
        </div>
      )
    },
    {
      title: "Address 2",
      dataIndex: "address2",
      width: 120,
      render: (text, record) => (
        <div className="flex items-start">
          <EnvironmentOutlined className="mr-2 mt-1 text-gray-400" />
          <div>
            <div className="text-sm">{record.address2 || 'N/A'}</div>
          </div>
        </div>
      )
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
      title: "Phone",
      dataIndex: "phone",
      width: 120,
      render: (phone) => (
        <div className="flex items-center">
          <AiOutlinePhone className="text-gray-400 mr-2" />
          <span>
            {phone || <span>N/A</span>}
          </span>
        </div>
      ),
    },
    {
      title: "Fax",
      dataIndex: "fax",
      width: 120,
      render: (text) => text || 'N/A'
    },
    {
      title: "Email",
      dataIndex: "email",
      width: 120,
      render: (email) => (
        <div className="flex items-center">
          <AiOutlineMail className="text-gray-400 mr-2" />
          <a
            href={`mailto:${email}?subject=Regarding Your Account`}
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline transition-colors duration-200 truncate"
            onClick={(e) => !email && e.preventDefault()}
            title={email || 'No email provided'}
          >
            {email || <span className="text-gray-400">N/A</span>}
          </a>
        </div>
      ),
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
            description="Are you sure to update this supplier?"
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
            description="Are you sure to deactivate this supplier?"
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

  return (
    <Card className="w-full">
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
                title: <span className="text-blue-600 font-medium">Suppliers</span>,
              },
            ]}
            className="text-sm"
          />
        </div>

        <Space wrap className="mt-2 sm:mt-0">
          <Link to="/inventory/settings/deleted-suppliers">
            <Button
              icon={<AiOutlineFileExclamation />}
              danger
              className="flex items-center gap-2 border-red-500 text-red-500 hover:bg-red-50"
            >
              Inactive Suppliers
            </Button>
          </Link>
          <Link to="/inventory/settings/form-supplier">
            <Button
              icon={<AiOutlinePlus />}
              type="primary"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              New Supplier
            </Button>
          </Link>
        </Space>
      </div>

      {/* Toolbar Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6 rounded-lg">
        <Alert
          message="Supplier Directory: Manage all your vendor relationships and supplier information in one place."
          type="info"
          showIcon
        />

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto">
          <Input.Search
            allowClear
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search suppliers..."
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
                className: "shadow-lg rounded-md min-w-[200px]"
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
            tip="Loading supplier data..."
            indicator={<LoadingOutlined style={{ fontSize: 36 }} spin />}
          />
        </div>
      ) : (
        <Table<Supplier>
          size="middle"
          columns={filteredColumns}
          dataSource={searchText ? filteredData : data}
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
            showTotal: (total) => `Total ${total} suppliers`,
          }}
          locale={{
            emptyText: (
              <div className="py-8 flex flex-col items-center">
                <ShopOutlined className="text-3xl text-gray-400 mb-2" />
                <p className="text-gray-500 mb-4">No suppliers found</p>
                <Button
                  type="primary"
                  className="mt-2"
                  onClick={() => navigate('/inventory/settings/form-supplier')}
                  icon={<AiOutlinePlus />}
                >
                  Add First Supplier
                </Button>
              </div>
            )
          }}
        />
      )}
    </Card>
  );
}
