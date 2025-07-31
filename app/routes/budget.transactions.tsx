import {
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  HomeOutlined,
  InboxOutlined,
  LoadingOutlined,
  SettingOutlined,
} from "@ant-design/icons";
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
  Space,
  Spin,
  Table,
  TableColumnsType,
  TableProps,
  Tag,
} from "antd";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import {
  AiOutlineCheckCircle,
  AiOutlineLike,
  AiOutlinePlus,
} from "react-icons/ai";
import { FcRefresh, FcSearch } from "react-icons/fc";
import { Link } from "react-router-dom";
import PrintDropdownComponent from "~/components/print_dropdown";
import dayjs from 'dayjs';
import { RiCircleFill } from "react-icons/ri";
import { BudgetService } from "~/services/budget.service";

export default function BudgetTransactions() {
  const [data, setData] = useState<any[]>([]);
  const [dataBudget, setDataBudget] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUserID, setUserID] = useState<any>();
  const [isDepartmentID, setDepartmentID] = useState<any>();

  const navigate = useNavigate();

  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState<any[]>([]);

  // DUMMY DATA
  const value = 123412;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "PHP",
    }).format(amount);
  };

  const handleRefetch = async () => {
    setLoading(true);
    await fetchData();
    setLoading(false);
  };

  const fetchDataBudget = async () => {
    try {
      // setLoading(true);
      const dataFetch = await BudgetService.getByData(isDepartmentID);
      setDataBudget(dataFetch); // Works in React state
      console.log("BUDGET DATA", dataFetch)
    } catch (error) {
      message.error("error");
    } finally {
      // setLoading(false);
    }
  };

  const fetchData = async () => {
    const getABID = localStorage.getItem('ab_id');
    const getUsername = localStorage.getItem('username');
    const userDepartment = localStorage.getItem('dept'); // Assuming department is stored

    try {
      setLoading(true);
      setError(null);

      const response = await axios.post<any>(
        '/api/completed-requisition-liquidation',
        {
          userid: Number(getABID),
          username: getUsername,
        },
      );

      // Filter data by department
      const filteredByDepartment = response.data.data.filter(
        (item: any) => item.department === userDepartment
      );

      // Sort by `startDate` (newest first)
      const sorted = [...filteredByDepartment].sort((a, b) => {
        return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
      });

      setData(sorted);
      // console.log("SORTED TRANSACTIONS BY DATE (NEWEST FIRST)", sorted);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Failed to fetch data:', err);
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
      fetchDataBudget();
      fetchData();
    } else {
      const filtered = data.filter(data =>
        data.referenceNo?.toLowerCase().includes(searchText.toLowerCase()) ||
        data.processTitle?.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [searchText]); // Empty dependency array means this runs once on mount

  // State for column visibility
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({
    "Process Title": true,
    "Reference No": true,
    "Start Date": true,
    "Due Date": true,
    "Workflow Type": true,
    "Type": true,
    "Status": true,
    "Amount": true,
  });

  const columns: TableColumnsType<any> = [
    {
      title: "Process Title",
      dataIndex: "processTitle",
      width: 120,
      render: (_, value) => (
        <div className="font-mono text-sm">
          {value.processTitle}
        </div>
      ),
      fixed: 'left'
    },
    {
      title: "Reference No",
      dataIndex: "referenceNo",
      width: 120,
      render: (_, value) => (
        <div className="font-mono text-sm">
          {value.referenceNo}
        </div>
      ),
      fixed: 'left'
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
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
      title: "Due Date",
      dataIndex: "dueDate",
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
      title: "Workflow Type",
      dataIndex: "workflowType",
      width: 120,
      render: (_, record) => {
        return (
          <>
            {record.workflowType === 'Requisition' && (
              <span className="flex flex-wrap"><RiCircleFill className="text-blue-500 mt-1 mr-2" /> {record.workflowType}</span>
            )}
            {record.workflowType === 'Liquidattion' && (
              <span className="flex flex-wrap"><RiCircleFill className="text-blue-600 mt-1 mr-2" /> {record.workflowType}</span>
            )}
          </>
        );
      },
      fixed: 'left'
    },
    {
      title: "Type",
      dataIndex: "requisitionType",
      width: 120,
      render: (_, value) => (
        <Tag color="blue">
          {value.requisitionType}
        </Tag>
      ),
      fixed: 'left'
    },
    {
      title: "Status",
      dataIndex: "status",
      width: 120,
      render: (_, record) => {
        if (record.status === 5) {
          return (
            <Tag color="green">
              <CheckCircleOutlined className="float-left mt-1 mr-1" /> Completed
            </Tag>
          );
        }
      },
    },
    {
      title: "Amount",
      dataIndex: "amount",
      width: 120,
      render: (_, value) => (
        <div className="text-right font-medium">
          {formatCurrency(value.totalAmount)}
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

  const onChange: TableProps<any>["onChange"] = (
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
                href: "/budget",
                title: <HomeOutlined className="text-gray-400" />,
              },
              {
                title: <span>Budget</span>,
              },
              {
                title: <span className="text-blue-600 font-medium">Transactions</span>,
              },
            ]}
            className="text-sm"
          />
        </div>

      </div>

      {/* Toolbar Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6 rounded-lg">
        <Alert
          message="This is the list of all transactions. Please review carefully."
          type="info"
          showIcon
          className="w-full lg:w-auto"
        />

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto">
          <Input.Search
            allowClear
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search transactions..."
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
            tip="Loading transactions..."
            indicator={<LoadingOutlined style={{ fontSize: 36 }} spin />}
          />
        </div>
      ) : (
        <Table<any>
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
            showTotal: (total) => `Total ${total} transactions`,
          }}
          locale={{
            emptyText: (
              <div className="py-8 flex flex-col items-center">
                <InboxOutlined className="text-3xl text-gray-400 mb-2" />
                <p className="text-gray-500 mb-4">No transactions found</p>
                {/* <Button
                  type="primary"
                  className="mt-2"
                  onClick={() => navigate('/transactions/new')}
                  icon={<AiOutlinePlus />}
                >
                  Create First Transaction
                </Button> */}
              </div>
            )
          }}
        />
      )}
    </div>
  );
}
