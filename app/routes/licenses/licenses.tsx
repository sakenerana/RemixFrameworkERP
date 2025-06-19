import { CheckCircleOutlined, HomeOutlined, SettingOutlined } from "@ant-design/icons";
import { useNavigate } from "@remix-run/react";
import {
  Alert,
  Breadcrumb,
  Button,
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
  TableProps,
  Tag,
} from "antd";
import { useEffect, useMemo, useState } from "react";
import {
  AiOutlineCloseCircle,
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlineExport,
  AiOutlineFileExclamation,
  AiOutlineImport,
  AiOutlinePlus,
  AiOutlineSend,
} from "react-icons/ai";
import { FcRefresh } from "react-icons/fc";
import { Link } from "react-router-dom";
import PrintDropdownComponent from "~/components/print_dropdown";
import { LicenseService } from "~/services/license.service";
import { License } from "~/types/license.type";

export default function LicensesRoute() {
  const [data, setData] = useState<License[]>([]);
  const [loading, setLoading] = useState(false);
  const [isUserID, setUserID] = useState<any>();
  const [isDepartmentID, setDepartmentID] = useState<any>();

  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState<License[]>([]);

  const navigate = useNavigate();

  const handleRefetch = async () => {
    setLoading(true);
    await fetchData();
    setLoading(false);
  };

  // Edit record
  const editRecord = (record: License) => {
    navigate(`form-license/${record.id}`);
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

  const handleCheckinButton = () => { };

  const handleCheckoutButton = () => { };

  // State for column visibility
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({
    "Name": true,
    "Expiration Date": true,
    "Termination Date": false,
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
    "Min QTY": true,
    "Total": true,
    "Avail": true,
    "Depreciation": false,
    "Notes": false,
    "Status": true,
    "Actions": true,
    "Checkout": true,
  });

  const columns: TableColumnsType<License> = [
    {
      title: "Name",
      dataIndex: "name",
      width: 120,
      render: (text) => text || 'N/A'
    },
    {
      title: "Expiration Date",
      dataIndex: "expiration_date",
      width: 120,
      render: (text) => text || 'N/A'
    },
    {
      title: "Termination Date",
      dataIndex: "termination_date",
      width: 120,
      render: (text) => text || 'N/A'
    },
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
      render: (text) => text || 'N/A'
    },
    {
      title: "Purchase Date",
      dataIndex: "purchase_date",
      width: 120,
      render: (text) => text || 'N/A'
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
      render: (text) => text || 'N/A'
    },
    {
      title: "Total",
      dataIndex: "seats",
      width: 120,
      render: (text) => text || 'N/A'
    },
    {
      title: "Avail",
      dataIndex: "avail",
      width: 120,
      render: (text) => text || 0
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
    {
      title: "Checkout",
      dataIndex: "checkout",
      width: 120,
      fixed: "right",
      render: (_, data) => (
        <div>
          {data.check_status == "checkin" ? (
            <Popconfirm
              title="Do you want to checkin?"
              description="Are you sure to checkin this request?"
              okText="Yes"
              cancelText="No"
              onConfirm={() => handleCheckinButton()}
            >
              <Tag
                className="cursor-pointer"
                icon={<AiOutlineImport className="float-left mt-1 mr-1" />}
                color="#108ee9"
              >
                {data.check_status}
              </Tag>
            </Popconfirm>
          ) : (
            <Popconfirm
              title="Do you want to checkout?"
              description="Are you sure to checkout this request?"
              okText="Yes"
              cancelText="No"
              onConfirm={() => handleCheckoutButton()}
            >
              <Tag
                className="cursor-pointer"
                icon={<AiOutlineExport className="float-left mt-1 mr-1" />}
                color="#f50"
              >
                {data.check_status}
              </Tag>
            </Popconfirm>
          )}
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

  const onChange: TableProps<License>["onChange"] = (
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
              title: "Licenses",
            },
          ]}
        />
        <Space wrap>
          <Link to={"deleted-license"}>
            <Button icon={<AiOutlineFileExclamation />} danger>
              Show Inactive Licenses
            </Button>
          </Link>

          <Link to={"form-license"}>
            <Button icon={<AiOutlinePlus />} type="primary">
              Create License
            </Button>
          </Link>
        </Space>
      </div>
      <div className="flex justify-between">
        <Alert
          message="Note: This is the list of all licensed item. Please check closely."
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
        <Table<License>
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
