import { CheckCircleOutlined, HomeOutlined, InfoCircleOutlined, LoadingOutlined, SettingOutlined } from "@ant-design/icons";
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
  Tooltip,
} from "antd";
import { useEffect, useMemo, useState } from "react";
import {
  AiOutlineCloseCircle,
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlineExport,
  AiOutlineFileExclamation,
  AiOutlineForm,
  AiOutlineImport,
  AiOutlinePlus,
  AiOutlineSend,
} from "react-icons/ai";
import { FcRefresh, FcSearch } from "react-icons/fc";
import { TiWarning } from "react-icons/ti";
import { Link } from "react-router-dom";
import Checkout from "~/components/checkout";
import PrintDropdownComponent from "~/components/print_dropdown";
import { ConsumableService } from "~/services/consumable.service";
import { Consumable } from "~/types/consumable.type";

export default function ConsumablesRoute() {
  const [data, setData] = useState<Consumable[]>([]);
  const [dataRow, setDataRow] = useState<Consumable>();
  const [loading, setLoading] = useState(false);
  const [isUserID, setUserID] = useState<any>();
  const [isDepartmentID, setDepartmentID] = useState<any>();

  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState<Consumable[]>([]);

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
  const editRecord = (record: Consumable) => {
    navigate(`form-consumable/${record.id}`);
  };

  const handleDeactivateButton = async (record: Consumable) => {
    const { error } = await ConsumableService.deactivateStatus(
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
      const dataFetch = await ConsumableService.getAllPosts(isDepartmentID);
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

  const handleCheckoutButton = (data: Consumable) => {
    setIsModalOpen(true);
    setDataRow(data);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // State for column visibility
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({
    "Name": true,
    "Asset Category": true,
    "Company": false,
    "Model No.": false,
    "Manufacturer": false,
    "Supplier": false,
    "Location": false,
    "Min. QTY": false,
    "Qty": true,
    "Checked Out No.": true,
    "Purchase Date": false,
    "Purchase Cost": true,
    "Order Number": false,
    "Notes": false,
    "Status": true,
    "Actions": true,
    "Checkout": true,
  });

  const columns: TableColumnsType<Consumable> = [
    {
      title: "Name",
      dataIndex: "name",
      width: 350,
      render: (_, data) => (
        <Link to={`/inventory/consumables/checkedout/${data.id}`} className="flex flex-wrap">
          <AiOutlineForm className="mt-1 mr-2" />
          <a className="hover:underline">{data.name || 'N/A'}</a>
        </Link>
      )
    },
    {
      title: "Asset Category",
      dataIndex: "categories",
      width: 120,
      render: (categories) => categories?.name || 'N/A'
    },
    {
      title: "Company",
      dataIndex: "companies",
      width: 120,
      render: (companies) => companies?.name || 'N/A'
    },
    {
      title: "Model No.",
      dataIndex: "model_no",
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
      title: "Supplier",
      dataIndex: "suppliers",
      width: 120,
      render: (suppliers) => suppliers?.name || 'N/A'
    },
    {
      title: "Location",
      dataIndex: "locations",
      width: 120,
      render: (locations) => locations?.name || 'N/A'
    },
    {
      title: "Min. QTY",
      dataIndex: "min_qty",
      width: 120,
      render: (text) => text || 0
    },
    {
      title: "Qty",
      dataIndex: "qty",
      width: 120,
      render: (text) => text || 0
    },
    {
      title: "Checked Out No.",
      dataIndex: "checkedout_no",
      width: 120,
      render: (_, data) => (
        <div>
          {data.consumables_check[0]?.count >= data.min_qty ? (
            // If count meets or exceeds minimum quantity
            <span className="flex flex-wrap text-green-600">
              (<TiWarning className="mt-1 text-orange-500" />) {data.consumables_check[0].count}
            </span>
          ) : (
            // If count is below minimum quantity
            <span className="text-green-600">
              {data.consumables_check[0]?.count || 0}
            </span>
          )}
        </div>
      )
    },
    {
      title: "Purchase Date",
      dataIndex: "purchase_date",
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
      title: "Order Number",
      dataIndex: "order_no",
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
            description="Are you sure to update this consumable?"
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
            description="Are you sure to deactivate this consumable?"
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
      render: (_, data) => {
        const currentCount = data?.consumables_check?.[0]?.count || 0;
        const totalQty = data?.qty || 0;
        const isDisabled = currentCount >= totalQty;

        return (
          <div>
            <Popconfirm
              disabled={isDisabled}
              title="Do you want to checkout?"
              description="Are you sure to checkout this consumable?"
              okText="Yes"
              cancelText="No"
              onConfirm={() => handleCheckoutButton(data)}
            >
              <Tag
                className={`cursor-pointer ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                icon={<AiOutlineExport className="float-left mt-1 mr-1" />}
                color={isDisabled ? "#d9d9d9" : "#3fd168"} // Gray when disabled, green when enabled
              >
                {isDisabled ? 'Completed' : 'Check-out'}
              </Tag>
            </Popconfirm>
            {isDisabled && (
              <Tooltip title="All items have been checked out">
                <InfoCircleOutlined className="ml-2 text-gray-400" />
              </Tooltip>
            )}
          </div>
        );
      },
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

  const onChange: TableProps<Consumable>["onChange"] = (
    pagination,
    filters,
    sorter,
    extra
  ) => {
    console.log("params", pagination, filters, sorter, extra);
  };

  return (
    <div>
      <Modal
        style={{ top: 20 }}
        width={420}
        title="Check-out Consumable"
        closable={{ "aria-label": "Custom Close Button" }}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer=""
      >
        <Checkout stateData={dataRow} onSuccess={handleSuccess} onClose={() => { setIsModalOpen(false), fetchData() }}></Checkout>
      </Modal>
      <div className="flex pb-5 justify-between">
        <Breadcrumb
          items={[
            {
              href: "/inventory",
              title: <HomeOutlined />,
            },
            {
              title: "Consumables",
            },
          ]}
        />
        <Space wrap>
          <Link to={"deleted-consumables"}>
            <Button icon={<AiOutlineFileExclamation />} danger>
              Show Inactive Consumables
            </Button>
          </Link>

          <Link to={"form-consumable"}>
            <Button icon={<AiOutlinePlus />} type="primary">
              Create Consumables
            </Button>
          </Link>
        </Space>
      </div>
      <div className="flex justify-between">
        <Alert
          message="Note: This is the list of all consumables item. Please check closely."
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
        <Table<Consumable>
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
