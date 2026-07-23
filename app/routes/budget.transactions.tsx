import {
  CalendarOutlined,
  CheckCircleOutlined,
  HomeOutlined,
  InboxOutlined,
  LinkOutlined,
  LoadingOutlined,
  SettingOutlined,
} from "@ant-design/icons";
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
  Space,
  Table,
  TableColumnsType,
  Tag,
} from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { FcRefresh } from "react-icons/fc";
import PrintDropdownComponent from "~/components/print_dropdown";
import dayjs from 'dayjs';
import { RiCircleFill } from "react-icons/ri";
import { BudgetService } from "~/services/budget.service";

export default function BudgetTransactions() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDepartmentID, setDepartmentID] = useState<any>();

  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState<any[]>([]);

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

  // const fetchDataBudget = async () => {
  //   try {
  //     // setLoading(true);
  //     const dataFetch = await BudgetService.getByData();
  //     setDataBudget(dataFetch); // Works in React state
  //     console.log("BUDGET DATA", dataFetch)
  //   } catch (error) {
  //     message.error("error");
  //   } finally {
  //     // setLoading(false);
  //   }
  // };

  const fetchData = async () => {
    const userId = Number(localStorage.getItem("ab_id"));
    const username = localStorage.getItem("username") || "";
    const userDepartment = localStorage.getItem("dept") || "";
    const userOffice = localStorage.getItem("userOffice") || "";
    const departmentId = isDepartmentID;

    // Cache configuration
    const CACHE_KEY = `completedRequisition_${userId}_${departmentId}`;
    const CACHE_EXPIRY = 30 * 60 * 1000; // 30 minutes cache
    const now = new Date().getTime();

    if (!userId || !username || !departmentId) {
      console.warn("Missing required identifiers");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setData([]); // Reset data at start

      // Check cache first
      const cachedData = localStorage.getItem(CACHE_KEY);
      if (cachedData) {
        const { data, timestamp } = JSON.parse(cachedData);
        if (now - timestamp < CACHE_EXPIRY) {
          setData(data);
          setLoading(false);
          return;
        }
      }

      // Parallel API calls
      const [requisitionResponse, budgetData] = await Promise.all([
        axios.post<{ data: any[] }>(
          `${import.meta.env.VITE_API_BASE_URL}/completed-requisition-liquidation`,
          { userid: userId, username }
        ),
        BudgetService.getTransactionByDepartment(departmentId)
      ]);

      const items = requisitionResponse.data.data || [];
      const startDate = budgetData?.start_date; // "2024-01-01";
      const endDate = budgetData?.end_date; // "2024-12-31";

      // Early return if missing dates
      if (!startDate || !endDate) {
        setData([]);
        localStorage.removeItem(CACHE_KEY); // Clear stale cache
        return;
      }

      // Pre-compute date strings
      const rangeStartStr = new Date(startDate).toISOString().split('T')[0];
      const rangeEndStr = new Date(endDate).toISOString().split('T')[0];

      // Optimized filtering
      const filtered = items.filter(item => {
        if (!item.startDate) return false;

        const itemDateStr = new Date(item.startDate).toISOString().split('T')[0];
        return item.department === userDepartment &&
          item.branch === userOffice &&
          // item.status === 5 &&
          itemDateStr >= rangeStartStr &&
          itemDateStr <= rangeEndStr;
      });

      // Optimized sorting
      const sorted = filtered.sort((a, b) =>
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
      );

      // Update state and cache
      setData(sorted);
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        data: sorted,
        timestamp: now
      }));

    } catch (err) {
      // Fallback to cache if available
      const cachedData = localStorage.getItem(CACHE_KEY);
      if (cachedData) {
        const { data } = JSON.parse(cachedData);
        setData(data);
      } else {
        const message = err instanceof Error ? err.message : "Unknown error occurred";
        setError(message);
        setData([]);
      }
      console.error("fetchData failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setDepartmentID(localStorage.getItem('userDept'));
  }, []);

  useEffect(() => {
    if (!isDepartmentID) return;

    if (searchText.trim() === '') {
      // fetchDataBudget();
      fetchData();
    } else {
      const filtered = data.filter(data =>
        data.referenceNo?.toLowerCase().includes(searchText.toLowerCase()) ||
        data.processTitle?.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [searchText, isDepartmentID]);

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
        <a
          target="_blank"
          href={`${import.meta.env.VITE_AB_LINK}/activities/${value.referenceNo}`} // Adjust the URL as needed
          className="font-mono text-sm flex items-center hover:text-blue-500 hover:underline"
        >
          <LinkOutlined className="mr-1" />
          {value.referenceNo}
        </a>
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
            {record.workflowType === 'Liquidation' && (
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
        <Tag color="#3b82f6">
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
        if (record.status === 'Completed') {
          return (
            <Tag color="green">
              <CheckCircleOutlined className="float-left mt-1 mr-1" /> Completed
            </Tag>
          );
        } else if (record.status === 'In Progress') {
          return (
            <Tag color="blue">
              <CheckCircleOutlined className="float-left mt-1 mr-1" /> In Progress
            </Tag>
          );
        } else if (record.status === 'Overdue') {
          return (
            <Tag color="orange">
              <CheckCircleOutlined className="float-left mt-1 mr-1" /> Overdue
            </Tag>
          );
        } else if (record.status === 'Return') {
          return (
            <Tag color="red">
              <CheckCircleOutlined className="float-left mt-1 mr-1" /> Return
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

  const tableData = searchText ? filteredData : data;
  const totalAmount = tableData.reduce(
    (sum, item) => sum + (Number(item.totalAmount) || 0),
    0
  );
  const completedCount = data.filter(item => item.status === "Completed").length;
  const requisitionCount = data.filter(item => item.workflowType === "Requisition").length;
  const liquidationCount = data.filter(item => item.workflowType === "Liquidation").length;
  const currentYear = new Date().getFullYear();

  return (
    <div className="budget-transactions-page space-y-5">
      <Card
        className="border border-slate-200 shadow-sm"
        bodyStyle={{ padding: "12px 16px" }}
      >
        <div className="grid gap-4 xl:grid-cols-[minmax(280px,1fr)_auto] xl:items-center">
          <div className="space-y-1">
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
              className="text-xs"
            />
            <div>
              <h1 className="m-0 text-xl font-semibold leading-6 text-slate-900">
                Budget Transactions
              </h1>
              <p className="m-0 text-xs text-slate-500">
                Review requisitions and liquidations recorded for the current budget period.
              </p>
            </div>
          </div>

          <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center xl:w-auto xl:justify-end">
            <Input.Search
              allowClear
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search transactions..."
              className="w-full sm:w-[320px]"
              size="middle"
            />

            <Space.Compact className="w-full sm:w-auto">
              <Button
                onClick={handleRefetch}
                icon={<FcRefresh className="text-blue-500" />}
                className="min-w-[112px]"
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
                  className="min-w-[112px]"
                >
                  Columns
                </Button>
              </Dropdown>
            </Space.Compact>

            <div className="w-full sm:w-auto">
              <PrintDropdownComponent
                stateData={tableData}
                buttonProps={{
                  className: "w-full sm:w-[112px]",
                }}
              />
            </div>
          </div>
        </div>
      </Card>

      {error && (
        <Alert
          message="Unable to load the latest transactions."
          description={error}
          type="error"
          showIcon
        />
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="border border-blue-100 bg-blue-50 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="m-0 text-sm font-medium text-blue-700">Total Records</p>
              <p className="m-0 mt-3 text-3xl font-semibold text-slate-900">
                {tableData.length.toLocaleString()}
              </p>
              <p className="m-0 mt-2 text-xs text-slate-500">Filtered transaction count</p>
            </div>
            <InboxOutlined className="rounded-lg bg-white p-3 text-xl text-blue-600 shadow-sm" />
          </div>
        </Card>

        <Card className="border border-emerald-100 bg-emerald-50 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="m-0 text-sm font-medium text-emerald-700">Completed</p>
              <p className="m-0 mt-3 text-3xl font-semibold text-slate-900">
                {completedCount.toLocaleString()}
              </p>
              <p className="m-0 mt-2 text-xs text-slate-500">Approved and closed items</p>
            </div>
            <CheckCircleOutlined className="rounded-lg bg-white p-3 text-xl text-emerald-600 shadow-sm" />
          </div>
        </Card>

        <Card className="border border-violet-100 bg-violet-50 shadow-sm">
          <div>
            <p className="m-0 text-sm font-medium text-violet-700">Workflow Mix</p>
            <div className="mt-3 flex items-end gap-4">
              <p className="m-0 text-3xl font-semibold text-slate-900">
                {requisitionCount.toLocaleString()}
              </p>
              <p className="m-0 pb-1 text-sm text-slate-500">requisitions</p>
            </div>
            <p className="m-0 mt-2 text-xs text-slate-500">
              {liquidationCount.toLocaleString()} liquidations in view
            </p>
          </div>
        </Card>

        <Card className="border border-amber-100 bg-amber-50 shadow-sm">
          <div>
            <p className="m-0 text-sm font-medium text-amber-700">Amount Tracked</p>
            <p className="m-0 mt-3 text-2xl font-semibold text-slate-900">
              {formatCurrency(totalAmount)}
            </p>
            <p className="m-0 mt-2 text-xs text-slate-500">Visible total for {currentYear}</p>
          </div>
        </Card>
      </div>

      <Card
        className="border border-slate-200 shadow-sm"
        bodyStyle={{ padding: 0 }}
      >
        <div className="flex flex-col gap-2 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="m-0 text-lg font-semibold text-slate-900">Transaction Register</h2>
            <p className="m-0 mt-1 text-sm text-slate-500">
              Showing {tableData.length.toLocaleString()} transaction{tableData.length === 1 ? "" : "s"}
            </p>
          </div>
          {loading && (
            <span className="inline-flex items-center gap-2 text-sm text-blue-600">
              <LoadingOutlined spin />
              Loading transactions
            </span>
          )}
        </div>

        <Table<any>
          size="middle"
          columns={filteredColumns}
          dataSource={tableData}
          className="overflow-hidden"
          loading={{
            spinning: loading,
            indicator: <LoadingOutlined style={{ fontSize: 28 }} spin />,
          }}
          scroll={{ x: "max-content" }}
          rowKey={(record) => record.id || record.referenceNo || record.processId}
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
      </Card>
    </div>
  );
}
