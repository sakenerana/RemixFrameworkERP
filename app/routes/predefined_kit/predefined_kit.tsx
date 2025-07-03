import { BoxPlotOutlined, CheckCircleOutlined, HomeOutlined, InboxOutlined, InfoCircleOutlined, LoadingOutlined, SettingOutlined } from "@ant-design/icons";
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
  Modal,
  Popconfirm,
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
  AiOutlinePlus,
} from "react-icons/ai";
import { FcRefresh } from "react-icons/fc";
import { Link } from "react-router-dom";
import Checkout from "~/components/checkout";
import PrintDropdownComponent from "~/components/print_dropdown";
import { PredefinedKitService } from "~/services/predefined_kit.service";
import { PredefinedKit } from "~/types/predefined_kit.type";
import { TiWarning } from "react-icons/ti";

export default function PredefinedKitRoute() {
  const [data, setData] = useState<PredefinedKit[]>([]);
  const [dataRow, setDataRow] = useState<PredefinedKit>();
  const [loading, setLoading] = useState(false);
  const [isUserID, setUserID] = useState<any>();
  const [isDepartmentID, setDepartmentID] = useState<any>();

  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState<PredefinedKit[]>([]);

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
  const editRecord = (record: PredefinedKit) => {
    navigate(`form-predefined-kit/${record.id}`);
  };

  const handleDeactivateButton = async (record: PredefinedKit) => {
    const { error } = await PredefinedKitService.deactivateStatus(
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
      const dataFetch = await PredefinedKitService.getAllPosts(isDepartmentID);
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

  const handleCheckoutButton = (data: PredefinedKit) => {
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
    "Min Qty": false,
    "Qty": true,
    "Checked Out No.": true,
    "Status": true,
    "Actions": true,
    "Checkout": true,
  });

  const columns: TableColumnsType<PredefinedKit> = [
    {
      title: "Name",
      dataIndex: "name",
      width: 350,
      render: (_, data) => (
        <Link to={`/inventory/predefined-kit/checkedout/${data.id}`} className="flex flex-wrap">
          <AiOutlineForm className="mt-1 mr-2" />
          <a className="hover:underline">{data.name || 'N/A'}</a>
        </Link>
      )
    },
    {
      title: "Min Qty",
      dataIndex: "min_qty",
      width: 120,
      render: (text) => text || 'N/A'
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
          {data.predefined_check[0]?.count >= data.min_qty ? (
            // If count meets or exceeds minimum quantity
            <span className="flex flex-wrap text-green-600">
              (<TiWarning className="mt-1 text-orange-500" />) {data.predefined_check[0].count}
            </span>
          ) : (
            // If count is below minimum quantity
            <span className="text-green-600">
              {data.predefined_check[0]?.count || 0}
            </span>
          )}
        </div>
      )
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
            description="Are you sure to update this predefined kit?"
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
            description="Are you sure to deactivate this predefined kit?"
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
        const currentCount = data?.predefined_check?.[0]?.count || 0;
        const totalQty = data?.qty || 0;
        const isDisabled = currentCount >= totalQty;

        return (
          <div>
            <Popconfirm
              disabled={isDisabled}
              title="Do you want to checkout?"
              description="Are you sure to checkout this predefined kit?"
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

  const onChange: TableProps<PredefinedKit>["onChange"] = (
    pagination,
    filters,
    sorter,
    extra
  ) => {
    console.log("params", pagination, filters, sorter, extra);
  };

  return (
    <div className="w-full px-6 py-4 rounded-lg shadow-sm">
      {/* Checkout Modal */}
      <Modal
        width={480}
        title={
          <div className="flex items-center gap-2">
            <InboxOutlined className="text-blue-500" />
            <span>Check-out Predefined Kit</span>
          </div>
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        centered
        styles={{
          header: {  },
          body: {  }
        }}
      >
        <Checkout
          stateData={dataRow}
          onSuccess={handleSuccess}
          onClose={() => {
            setIsModalOpen(false);
            fetchData();
          }}
        />
      </Modal>

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
                title: <span className="text-blue-600 font-medium">Predefined Kits</span>,
              },
            ]}
            className="text-sm"
          />
        </div>

        <Space wrap className="mt-2 sm:mt-0">
          <Link to="deleted-predefined-kit">
            <Button
              icon={<AiOutlineFileExclamation />}
              danger
              className="flex items-center gap-2 border-red-500 text-red-500 hover:bg-red-50"
            >
              Archived Kits
            </Button>
          </Link>
          <Link to="form-predefined-kit">
            <Button
              icon={<AiOutlinePlus />}
              type="primary"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              New Kit
            </Button>
          </Link>
        </Space>
      </div>

      {/* Toolbar Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6 rounded-lg">
        <Alert
          message="Kit Management: Predefined kits are pre-configured sets of items that can be checked out together."
          type="info"
          showIcon
        />

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto">
          <Input.Search
            allowClear
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search kits..."
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
            tip="Loading predefined kits..."
            indicator={<LoadingOutlined style={{ fontSize: 36 }} spin />}
          />
        </div>
      ) : (
        <Table<PredefinedKit>
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
            showTotal: (total) => `Total ${total} kits`,
          }}
          locale={{
            emptyText: (
              <div className="py-8 flex flex-col items-center">
                <BoxPlotOutlined className="text-3xl text-gray-400 mb-2" />
                <p className="text-gray-500 mb-4">No predefined kits found</p>
                <Button
                  type="primary"
                  className="mt-2"
                  onClick={() => navigate('/inventory/predefined-kit/form-predefined-kit')}
                  icon={<AiOutlinePlus />}
                >
                  Create First Kit
                </Button>
              </div>
            )
          }}
        />
      )}
    </div>
  );
}
