import { CalendarOutlined, CheckCircleOutlined, HomeOutlined, LoadingOutlined, SafetyCertificateOutlined, SettingOutlined } from "@ant-design/icons";
import { useNavigate } from "@remix-run/react";
import {
  Alert,
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
  AiOutlineForm,
  AiOutlinePlus,
} from "react-icons/ai";
import { FcRefresh } from "react-icons/fc";
import { TiWarning } from "react-icons/ti";
import { Link } from "react-router-dom";
import PrintDropdownComponent from "~/components/print_dropdown";
import { LicenseService } from "~/services/license.service";
import { License } from "~/types/license.type";
import dayjs from 'dayjs';

export default function LicensesRoute() {
  const [data, setData] = useState<License[]>([]);
  const [loading, setLoading] = useState(false);
  const [isUserID, setUserID] = useState<any>();
  const [isDepartmentID, setDepartmentID] = useState<any>();

  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState<License[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const navigate = useNavigate();

  const handleSuccess = () => {
    setIsModalOpen(false);
    setRefreshKey(prev => prev + 1); // Triggers data refresh
  };

  const handleRefetch = async () => {
    setLoading(true);
    await fetchData();
    setLoading(false);
  };

  // Edit record
  const editRecord = (record: License) => {
    navigate(`/inventory/form-license/${record.id}`);
  };

  const handleDeactivateButton = async (record: License) => {
    const { error } = await LicenseService.deactivateStatus(
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
      const dataFetch = await LicenseService.getAllPosts(isDepartmentID);
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
    "Expiration Date": true,
    // "Termination Date": false,
    "Licensed to Email": false,
    "Licensed to Name": true,
    "Manufacturer": true,
    "Company": false,
    "Category": false,
    "Supplier": false,
    "Order Number": false,
    "Purchase Cost": false,
    "Purchase Date": false,
    "Purchase Order Number": false,
    "Min QTY": false,
    "Qty": true,
    "Checked Out No.": true,
    "Depreciation": false,
    "Notes": false,
    "Status": true,
    "Actions": true,
  });

  const columns: TableColumnsType<License> = [
    {
      title: "Name",
      dataIndex: "name",
      width: 350,
      render: (_, data) => (
        <Link to={`/inventory/product-key/${data.id}`} className="flex flex-wrap">
          <AiOutlineForm className="mt-1 mr-2" />
          <a className="hover:underline">{data.name || 'N/A'}</a>
        </Link>
      )
    },
    {
      title: "Expiration Date",
      dataIndex: "expiration_date",
      width: 120,
      render: (dateString) => (
        <div className="flex items-center">
          <CalendarOutlined className="mr-2 text-gray-400" />
          <div className="flex flex-col">
            <span className="text-sm">
              {dayjs(dateString).format('MMM DD YYYY')} {/* Date */}
            </span>
            {/* <span className="text-xs text-gray-500">
              {dayjs(dateString).format('h:mm A')}
            </span> */}
          </div>
        </div>
      )
    },
    // {
    //   title: "Termination Date",
    //   dataIndex: "termination_date",
    //   width: 120,
    //   render: (text) => text || 'N/A'
    // },
    {
      title: "Licensed to Email",
      dataIndex: "license_email",
      width: 120,
      render: (text) => text || 'N/A'
    },
    {
      title: "Licensed to Name",
      dataIndex: "license_name",
      width: 120,
      render: (text) => text || 'N/A'
    },
    {
      title: "Manufacturer",
      dataIndex: "manufacturers",
      width: 120,
      render: (manufacturers) => manufacturers?.name || 'N/A'
    },
    {
      title: "Company",
      dataIndex: "companies",
      width: 120,
      render: (companies) => companies?.name || 'N/A'
    },
    {
      title: "Category",
      dataIndex: "categories",
      width: 120,
      render: (categories) => categories?.name || 'N/A'
    },
    {
      title: "Supplier",
      dataIndex: "suppliers",
      width: 120,
      render: (suppliers) => suppliers?.name || 'N/A'
    },
    {
      title: "Order Number",
      dataIndex: "order_number",
      width: 120,
      render: (text) => text || 'N/A'
    },
    {
      title: "Purchase Cost",
      dataIndex: "purchase_cost",
      width: 120,
      render: (text) =>
        text !== null && text !== undefined
          ? `₱${parseFloat(text).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
          : 'N/A'
    },
    {
      title: "Purchase Date",
      dataIndex: "purchase_date",
      width: 120,
      render: (dateString) => (
        <div className="flex items-center">
          <CalendarOutlined className="mr-2 text-gray-400" />
          <div className="flex flex-col">
            <span className="text-sm">
              {dayjs(dateString).format('MMM DD YYYY')} {/* Date */}
            </span>
            {/* <span className="text-xs text-gray-500">
              {dayjs(dateString).format('h:mm A')}
            </span> */}
          </div>
        </div>
      )
    },
    {
      title: "Purchase Order Number",
      dataIndex: "purchase_order_no",
      width: 120,
      render: (text) => text || 'N/A'
    },
    {
      title: "Min QTY",
      dataIndex: "min_qty",
      width: 120,
      render: (text) => text || 0
    },
    {
      title: "Qty",
      dataIndex: "seats",
      width: 120,
      render: (text) => text || 0
    },
    {
      title: "Checked Out No.",
      dataIndex: "checkedout_no",
      width: 120,
      render: (_, data) => (
        <div>
          {data.license_check[0]?.count >= data.min_qty ? (
            // If count meets or exceeds minimum quantity
            <span className="flex flex-wrap text-green-600">
              (<TiWarning className="mt-1 text-orange-500" />) {data.license_check[0].count}
            </span>
          ) : (
            // If count is below minimum quantity
            <span className="text-green-600">
              {data.license_check[0]?.count || 0}
            </span>
          )}
        </div>
      )
    },
    {
      title: "Depreciation",
      dataIndex: "depreciations",
      width: 120,
      render: (depreciations) => depreciations?.name || 'N/A'
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
            description="Are you sure to update this license?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => editRecord(record)}
          >
            <Tag
              className="cursor-pointer"
              icon={<AiOutlineEdit className="float-left mt-1 mr-1" />}
              color="#f7b63e"
              variant="solid"
            >
              Update
            </Tag>
          </Popconfirm>
          <Popconfirm
            title="Do you want to deactivate?"
            description="Are you sure to deactivate this license?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDeactivateButton(record)}
          >
            {record.status_labels.name === 'Active' && (
              <Tag
                className="cursor-pointer ml-2"
                icon={<AiOutlineDelete className="float-left mt-1 mr-1" />}
                color="#f50"
                variant="solid"
              >
                Deactivate
              </Tag>
            )}
            {record.status_labels.name === 'Inactive' && (
              <Tag
                className="cursor-pointer ml-2"
                icon={<AiOutlineDelete className="float-left mt-1 mr-1" />}
                color="#1677ff"
                variant="solid"
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
  const columnMenuItems: MenuProps['items'] = [
    {
      type: 'group',
      label: 'Select Column for Visibility',
      children: [
        // Split into two columns
        {
          key: 'column-group-1',
          style: { display: 'inline-block', width: '50%' },
          label: (
            <div>
              {Object.keys(columnVisibility)
                .slice(0, Math.ceil(Object.keys(columnVisibility).length / 2))
                .map(columnTitle => (
                  <div key={columnTitle} style={{ padding: '4px 0' }}>
                    <Checkbox
                      checked={columnVisibility[columnTitle]}
                      onChange={() => toggleColumn(columnTitle)}
                    >
                      {columnTitle}
                    </Checkbox>
                  </div>
                ))}
            </div>
          ),
        },
        {
          key: 'column-group-2',
          style: { display: 'inline-block', width: '50%' },
          label: (
            <div>
              {Object.keys(columnVisibility)
                .slice(Math.ceil(Object.keys(columnVisibility).length / 2))
                .map(columnTitle => (
                  <div key={columnTitle} style={{ padding: '4px 0' }}>
                    <Checkbox
                      checked={columnVisibility[columnTitle]}
                      onChange={() => toggleColumn(columnTitle)}
                    >
                      {columnTitle}
                    </Checkbox>
                  </div>
                ))}
            </div>
          ),
        },
      ],
    },
  ];

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
                title: <span className="text-blue-600 font-medium">Software Licenses</span>,
              },
            ]}
            className="text-sm"
          />
        </div>

        <Space wrap className="mt-2 sm:mt-0">
          <Link to="/inventory/deleted-license">
            <Button
              icon={<AiOutlineFileExclamation />}
              danger
              className="flex items-center gap-2 border-red-500 text-red-500 hover:bg-red-50"
            >
              Expired Licenses
            </Button>
          </Link>
          <Link to="/inventory/form-license">
            <Button
              icon={<AiOutlinePlus />}
              type="primary"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              Add License
            </Button>
          </Link>
        </Space>
      </div>

      {/* Toolbar Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6 rounded-lg">
        <Alert
          message="License Compliance: Track and manage all software licenses to ensure compliance."
          type="info"
          showIcon
        />

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto">
          <Input.Search
            allowClear
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search licenses..."
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
                className: "shadow-lg rounded-md min-w-[220px]"
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
            tip="Loading license data..."
            indicator={
              <LoadingOutlined
                style={{
                  fontSize: 36,
                  color: '#1890ff'
                }}
                spin
              />
            }
          />
        </div>
      ) : (
        <Table<License>
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
            showTotal: (total) => `Total ${total} licenses`,
          }}
          locale={{
            emptyText: (
              <div className="py-8 flex flex-col items-center">
                <SafetyCertificateOutlined className="text-3xl text-gray-400 mb-2" />
                <p className="text-gray-500 mb-4">No software licenses found</p>
                <Button
                  type="primary"
                  className="mt-2"
                  onClick={() => navigate('/inventory/form-license')}
                  icon={<AiOutlinePlus />}
                >
                  Register First License
                </Button>
              </div>
            )
          }}
        />
      )}
    </Card>
  );
}
