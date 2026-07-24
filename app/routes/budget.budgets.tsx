import { EditOutlined, HomeOutlined, LoadingOutlined } from "@ant-design/icons";
import {
  Alert,
  Breadcrumb,
  Button,
  Card,
  DatePicker,
  Descriptions,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Progress,
  Row,
  Select,
  Skeleton,
  Space,
  Spin,
  Tag,
  Tooltip,
} from "antd";
import axios from "axios";
import moment from "moment";
import { Link } from "@remix-run/react";
import { useEffect, useMemo, useState } from "react";
import { AiOutlineBuild, AiOutlineCalendar, AiOutlineCheck, AiOutlineClear, AiOutlineDollarCircle, AiOutlineEye, AiOutlineInfoCircle, AiOutlinePlus, AiOutlineRise, AiOutlineSearch } from "react-icons/ai";
import { RiCircleFill } from "react-icons/ri";
import { BudgetService } from "~/services/budget.service";
import { Budget } from "~/types/budget.type";
import dayjs from 'dayjs';
import { DepartmentService } from "~/services/department.service";
import { UserService } from "~/services/user.service";
import { Department } from "~/types/department.type";
import { canManageBudgetParticulars } from "~/utils/budgetAccess";

export default function Budgets() {
  const [data, setData] = useState<Budget>();
  const [dataUnbudget, setDataUnbudget] = useState<any>();
  const [dataBudgetPerDepartment, setDataBudgetPerDepartment] = useState<any>();
  const [dataTotalRequisition, setDataTotalRequisition] = useState<any>(0);
  const [dataTotalLiquidation, setDataTotalLiquidation] = useState<any>(0);
  const [dataTotalBudgeted, setDataTotalBudgeted] = useState<any>(0);
  const [dataTotalUnBudgeted, setDataTotalUnBudgeted] = useState<any>(0);
  const [dataCombinedTotal, setDataCombinedTotal] = useState<any>(0);
  const [dataDepartment, setDataDepartment] = useState<Department[]>([]);
  const [dataBudgetDepartment, setDataBudgetDepartment] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingBudget, setLoadingBudget] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isUserID, setUserID] = useState<any>();
  const [isDepartmentID, setDepartmentID] = useState<any>();
  const [isOfficeID, setOfficeID] = useState<any>();
  const [canManageParticulars, setCanManageParticulars] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenEditAllocateBudget, setIsModalOpenEditAllocateBudget] = useState(false);
  const [isUnbudgetedRequisitionModalOpen, setIsUnbudgetedRequisitionModalOpen] = useState(false);
  const [form] = Form.useForm<Budget>();
  const [formEditAllocateBudget] = Form.useForm<Budget>();
  const [formUnbudgeted] = Form.useForm<any>();
  const { RangePicker } = DatePicker;
  const { Option } = Select;

  // Gradient backgrounds for statistics cards
  const statGradients = {
    overallRequisition: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', // Purple gradient
    overallLiquidation: 'linear-gradient(135deg, #0ba360 0%, #3cba92 100%)', // Green gradient
  };

  // Alternative gradient options:
  // Option 2 (Blue/Teal theme):
  // const statGradients = {
  //   overallRequisition: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)', // Navy blue
  //   overallLiquidation: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', // Teal green
  // };

  // Option 3 (Warm theme):
  // const statGradients = {
  //   overallRequisition: 'linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%)', // Orange gradient
  //   overallLiquidation: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)', // Purple/blue gradient
  // };

  const onReset = () => {
    Modal.confirm({
      title: "Confirm Reset",
      content: "Are you sure you want to reset all form fields?",
      okText: "Reset",
      cancelText: "Cancel",
      onOk: () => form.resetFields(),
    });
  };

  const onResetUnbudgetedRequisition = () => {
    Modal.confirm({
      title: "Confirm Reset",
      content: "Are you sure you want to reset all form fields?",
      okText: "Reset",
      cancelText: "Cancel",
      onOk: () => form.resetFields(),
    });
  };

  const handleTrack = () => {
    setIsModalOpen(true);
  };

  const handleUnbudgetedRequisition = () => {
    setIsUnbudgetedRequisitionModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setIsModalOpenEditAllocateBudget(false);
    form.resetFields();
    formEditAllocateBudget.resetFields();
  };

  const handleCancelUnbudgetedRequisition = () => {
    setIsUnbudgetedRequisitionModalOpen(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "PHP",
    }).format(amount);
  };

  const fetchData = async () => {
    try {
      // setLoading(true);
      const dataFetch: any = await BudgetService.getByData();
      setData(dataFetch); // Works in React state
      const totalBudget = dataFetch?.reduce((sum: any, item: any) => sum + (item.budget || 0), 0) || 0;
      setDataTotalBudgeted(totalBudget);
      // console.log("BUDGET DATAS", dataFetch)
    } catch (error) {
      message.error("error");
    } finally {
      // setLoading(false);
    }
  };

  const fetchUnbudgetData = async () => {
    try {
      // setLoading(true);
      const dataFetch: any = await BudgetService.getAllUnbudgeted();
      setDataUnbudget(dataFetch); // Works in React state
      const totalUnBudget = dataFetch?.reduce((sum: any, item: any) => sum + (item.amount || 0), 0) || 0;
      setDataTotalUnBudgeted(totalUnBudget);
      console.log("UNBUDGET DATA", totalUnBudget)
    } catch (error) {
      message.error("error");
    } finally {
      // setLoading(false);
    }
  };

  // Fetch data from Supabase
  const fetchDataDepartment = async () => {
    try {
      setLoading(true);
      const dataFetch = await DepartmentService.getAllPosts();
      setDataDepartment(dataFetch); // Works in React state
      // console.log("DATA DEPARTMENT", dataFetch)
    } catch (error) {
      message.error("error");
    } finally {
      setLoading(false);
    }
  };

  // Fetch data from Supabase
  const fetchBudgetDepartment = async () => {
    try {
      setLoading(true);
      const dataFetch = await BudgetService.getAllBudgetPosts();
      setDataBudgetDepartment(dataFetch); // Works in React state
      console.log("DATA DEPARTMENT BUDGET", dataFetch)
    } catch (error) {
      message.error("error");
    } finally {
      setLoading(false);
    }
  };

  const fetchDataBudgetApproved = async () => {
    const userId = Number(localStorage.getItem("ab_id"));
    const username = localStorage.getItem("username") || "";
    const departmentId = isDepartmentID;

    // Cache configuration
    const CACHE_KEY = `budgetApproved_${userId}_${departmentId}`;
    const CACHE_EXPIRY = 30 * 60 * 1000; // 30 minutes cache
    const now = new Date().getTime();

    if (!userId || !username) {
      console.warn("Missing required identifiers");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Check cache first
      const cachedData = localStorage.getItem(CACHE_KEY);
      if (cachedData) {
        const { totals, timestamp } = JSON.parse(cachedData);
        if (now - timestamp < CACHE_EXPIRY) {
          setDataTotalRequisition(totals.requisition);
          setDataTotalLiquidation(totals.liquidation);
          setDataCombinedTotal(totals.combined);
          setLoading(false);
          return;
        }
      }
      setLoadingBudget(true)
      // Parallel API calls
      const [requisitionResponse, budgetData] = await Promise.all([
        axios.post<{ data: any[] }>(
          `${import.meta.env.VITE_API_BASE_URL}/completed-requisition-liquidation`,
          { userid: userId, username }
        ),
        BudgetService.getByData()
      ]);

      const items = requisitionResponse.data.data || [];
      // const startDate = `2025-01-01`;
      // const endDate = '2025-12-31';
      const startDate = budgetData[0]?.start_date;
      const endDate = budgetData[0]?.end_date;
      // Early return if missing dates
      if (!startDate || !endDate) {
        resetTotals();
        localStorage.removeItem(CACHE_KEY); // Clear stale cache
        return;
      }

      // Pre-compute date strings
      const rangeStartStr = new Date(startDate).toISOString().split('T')[0];
      const rangeEndStr = new Date(endDate).toISOString().split('T')[0];

      // Calculate totals in single pass
      const totals = items.reduce((acc, item) => {

        if (!item.startDate) return acc;

        const itemDateStr = new Date(item.startDate).toISOString().split('T')[0];
        const inRange = itemDateStr >= rangeStartStr && itemDateStr <= rangeEndStr;
        const matches = item.status === 'Completed' && inRange;
        //const matches = item.department === userDepartment && item.branch === userOffice && item.status === 'Completed' && inRange;

        if (matches) {
          const amount = Number(item.totalAmount) || 0;
          if (item.workflowType === "Requisition") {
            acc.requisition += amount;
          } else if (item.workflowType === "Liquidation") {
            acc.liquidation += amount;
          }
          acc.combined += amount;
        }
        return acc;
      }, { requisition: 0, liquidation: 0, combined: 0 });

      // Update state and cache
      setDataTotalRequisition(totals.requisition);
      setDataTotalLiquidation(totals.liquidation);
      setDataCombinedTotal(totals.combined);
      setLoadingBudget(false);

      localStorage.setItem(CACHE_KEY, JSON.stringify({
        totals,
        timestamp: now
      }));

    } catch (err) {
      // Fallback to cache if available
      const cachedData = localStorage.getItem(CACHE_KEY);
      if (cachedData) {
        const { totals } = JSON.parse(cachedData);
        setDataTotalRequisition(totals.requisition);
        setDataTotalLiquidation(totals.liquidation);
        setDataCombinedTotal(totals.combined);
      } else {
        const message = err instanceof Error ? err.message : "Unknown error occurred";
        setError(message);
        resetTotals();
      }
      console.error("fetchDataBudgetApproved failed:", err);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to reset all totals
  const resetTotals = () => {
    setDataTotalRequisition(0);
    setDataTotalLiquidation(0);
    setDataCombinedTotal(0);
  };

  const disableCreateBudgetButton = async () => {
    if (isDepartmentID == 2 || isDepartmentID == 1) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        await Promise.all([
          fetchData(),
          fetchUnbudgetData(),
          fetchDataBudgetApproved()
        ]);
      } catch (error) {
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
    fetchDataDepartment();
    fetchBudgetDepartment();
    disableCreateBudgetButton();
  }, []);

  useMemo(() => {
    setUserID(localStorage.getItem('userAuthID'));
    setDepartmentID(localStorage.getItem('userDept'));
    setOfficeID(localStorage.getItem('userOfficeID'));

    const resolveParticularAccess = async () => {
      const localAccess = localStorage.getItem('access');
      const localDepartment = localStorage.getItem('dept');

      if (canManageBudgetParticulars({ department: localDepartment })) {
        setCanManageParticulars(true);
        return;
      }

      const userAuthId = localStorage.getItem('userAuthID');
      if (!userAuthId) {
        setCanManageParticulars(false);
        return;
      }

      try {
        const user = await UserService.getPostById(userAuthId);
        localStorage.setItem('access', user?.access || '[]');
        setCanManageParticulars(
          canManageBudgetParticulars({
            department: localDepartment,
          })
        );
      } catch {
        setCanManageParticulars(false);
      }
    };

    resolveParticularAccess();
  }, []);

  const currentYear = new Date().getFullYear();
  const budget = [
    {
      title: `Overall Requisition - ${currentYear}`,
      value: dataTotalRequisition,
      totalBudget: dataTotalBudgeted + dataTotalUnBudgeted,
      gradient: statGradients.overallRequisition
    },
    {
      title: `Overall Liquidation - ${currentYear}`,
      value: dataTotalLiquidation,
      totalBudget: dataTotalBudgeted + dataTotalUnBudgeted,
      gradient: statGradients.overallLiquidation
    },
  ];

  const overallBudget = dataTotalBudgeted + dataTotalUnBudgeted;
  const remainingBalance = overallBudget - dataCombinedTotal;
  const utilizationRate = overallBudget > 0 ? Math.round((dataCombinedTotal / overallBudget) * 100) : 0;
  const cappedUtilizationRate = Math.min(100, utilizationRate);
  const budgetHealth = utilizationRate < 50 ? "Healthy" : utilizationRate < 80 ? "Moderate" : "Critical";
  const budgetHealthColor = utilizationRate < 50 ? "success" : utilizationRate < 80 ? "warning" : "error";

  const departmentCards = dataBudgetDepartment.map((item: any) => {
    const utilization = item.budget > 0 ? Math.min(100, (dataCombinedTotal / item.budget) * 100) : 0;

    return (
      <div
        key={item.id}
        className="border-b border-gray-100 px-5 py-4 transition-colors last:border-b-0 hover:bg-slate-50"
      >
        <div className="grid gap-4 xl:grid-cols-[minmax(260px,1fr)_180px_180px_220px] xl:items-center">
          <div className="flex min-w-0 items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-900">
              <span className="text-sm font-semibold text-white">
                {item.departments?.department?.charAt(0) || "D"}
              </span>
            </div>

            <div className="min-w-0">
              <div className="font-semibold text-slate-900">
                {item.departments?.department || "Unknown Department"}
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span>
                  Budget Period: {dayjs(item.start_date).format("MMM D")} - {dayjs(item.end_date).format("MMM D, YYYY")}
                </span>
                <span className="h-1 w-1 rounded-full bg-slate-300" />
                <Tag color="green" className="m-0">Active</Tag>
              </div>
            </div>
          </div>

          <div>
            <div className="text-xs uppercase tracking-wide text-slate-400">Allocated Budget</div>
            <div className="mt-1 text-base font-semibold text-slate-900">
              {formatCurrency(Number(item.budget || 0))}
            </div>
          </div>

          <div>
            <div className="mb-1 flex items-center justify-between text-xs text-slate-500">
              <span>Utilization</span>
              <span>{Math.round(utilization)}%</span>
            </div>
            <Progress
              percent={utilization}
              size="small"
              showInfo={false}
              strokeColor={
                utilization > 80 ? "#ef4444" :
                  utilization > 60 ? "#f59e0b" : "#2563eb"
              }
            />
          </div>

          <div className="flex flex-wrap justify-start gap-2 xl:justify-end">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined className="text-sm" />}
              onClick={() => {
                setIsModalOpenEditAllocateBudget(true);
                setDataBudgetPerDepartment(item);
                formEditAllocateBudget.setFieldsValue({ budget: item.budget });
              }}
              disabled={isDisabled}
              className="flex items-center rounded-md border border-slate-200 px-3 py-1.5 text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            >
              Edit Budget
            </Button>

            <Button
              type="primary"
              size="small"
              icon={<AiOutlineEye />}
              href={`/budget/budget-details?id=${item.id}`}
              className="flex items-center rounded-md bg-blue-600 px-3 py-1.5"
            >
              View Details
            </Button>
          </div>
        </div>
      </div>
    );
  });

  const onFinish = async () => {
    try {
      const values = await form.validateFields();
      const { date } = values;

      // Validate date range
      if (!date || date.length !== 2) {
        throw new Error("Please select a valid budget period");
      }

      const [startDate, endDate] = date;
      const currentDate = new Date(); // Get current date
      const formattedDate = currentDate.toISOString().split('T')[0];

      // console.log("currentDate", currentDate)
      // Check if data already exists for this department in current year
      setLoading(true);
      const existingData = await BudgetService.getAllPosts(values.department_id, formattedDate);

      if (existingData && existingData.length > 0) {
        throw new Error(`A budget record already exists for ${dayjs(existingData[0].start_date).format('MMM DD YYYY')} - ${dayjs(existingData[0].end_date).format('MMM DD YYYY')} in this department`);
      }

      // Prepare payload with formatted dates
      const allValues = {
        ...values,
        start_date: startDate.format("YYYY-MM-DD"),
        end_date: endDate.format("YYYY-MM-DD"),
        status_id: 1,
        office_id: isOfficeID,
      };

      // Create new record
      const { error } = await BudgetService.createPost(allValues);
      if (error) throw new Error(error.message);

      message.success("Record created successfully");
      setIsModalOpen(false);
      form.resetFields();
      fetchData();
    } catch (error) {
      console.error("Error:", error);
      message.error(error instanceof Error ? error.message : "Failed to create record");
    } finally {
      setLoading(false);
    }
  };

  const onFinishUnbudgetedRequisition = async () => {
    try {
      const values = await formUnbudgeted.validateFields();
      console.log("UNBUDGETED REQUISITION VALUES", values);
      const { date, notes } = values;

      // Prepare payload with formatted dates
      const allValues = {
        ...values,
        status_id: 1,
        office_id: isOfficeID,
      };

      // Create new record
      const { error } = await BudgetService.createUnbudgeted(allValues);
      if (error) throw new Error(error.message);

      message.success("Record created successfully for unbudgeted requisition");
      setIsUnbudgetedRequisitionModalOpen(false);
      formUnbudgeted.resetFields();
      fetchUnbudgetData();
    } catch (error) {
      console.error("Error:", error);
      message.error(error instanceof Error ? error.message : "Failed to create record");
    }
  };

  const onFinishEditAllocateBudget = async () => {
    try {
      const values = await formEditAllocateBudget.validateFields();


      // Prepare payload with formatted dates
      const allValues = {
        ...values,
        status_id: 1,
      };
      // console.log("UNBUDGETED REQUISITION VALUES", allValues, dataBudgetPerDepartment.id);
      // Update existing record
      const { error } = await BudgetService.updatePost(dataBudgetPerDepartment.id, allValues);
      if (error) throw new Error(error.message);

      message.success("Record updated successfully for budget adjustment.");
      setIsModalOpenEditAllocateBudget(false);
      formEditAllocateBudget.resetFields();
      fetchData();
      fetchBudgetDepartment()
    } catch (error) {
      console.error("Error:", error);
      message.error(error instanceof Error ? error.message : "Failed to create record");
    }
  };

  return (
    <div className="budget-management-page">
      <div className="flex justify-between">
        <Breadcrumb
          items={[
            {
              href: "/budget",
              title: <HomeOutlined />,
            },
            {
              title: "Budget",
            },
            {
              title: "Budgets",
            },
          ]}
        />
        <Space direction="horizontal">
          {canManageParticulars && (
            <Space wrap>
              <Link to="/budget/budget-code">
                <Button
                  icon={<AiOutlinePlus />}
                  type="default"
                  className="mb-2"
                >
                  Particulars
                </Button>
              </Link>
            </Space>
          )}
          {canManageParticulars && (
            <>
              <Space wrap>
                <Button
                  onClick={() => handleUnbudgetedRequisition()}
                  icon={<AiOutlinePlus />}
                  type="default"
                  disabled={isDisabled}
                  className="mb-2"
                >
                  Create Unbudgeted
                </Button>
              </Space>
              <Space wrap>
                <Button
                  onClick={() => handleTrack()}
                  icon={<AiOutlinePlus />}
                  type="primary"
                  disabled={isDisabled}
                  className="mb-2"
                >
                  Create Budget
                </Button>
              </Space>
            </>
          )}
        </Space>
        <Modal
          width={460}
          title={
            <div className="flex items-center gap-3">
              <AiOutlineDollarCircle className="text-green-500 text-2xl" />
              <span className="text-xl font-semibold">Create Budget</span>
            </div>
          }
          open={isModalOpen}
          onCancel={handleCancel}
          footer={null}
          centered
          destroyOnClose
          styles={{
            header: {
              borderBottom: '1px solid #f0f0f0',
              padding: '20px 24px'
            },
            body: {
              padding: '24px'
            }
          }}
          className="budget-modal"
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            className="budget-form"
          >
            {/* Date Range Field */}
            <Form.Item
              label={
                <span className="font-medium flex items-center">
                  Budget Period <span className="text-red-500 ml-1">*</span>
                </span>
              }
              name="date"
              rules={[
                {
                  required: true,
                  message: 'Please select budget period'
                }
              ]}
              className="mb-6"
            >
              <RangePicker
                className="w-full h-10 rounded-lg"
                suffixIcon={<AiOutlineCalendar className="text-gray-400" />}
                format="MMM D, YYYY"
                placeholder={['Start date', 'End date']}
              />
            </Form.Item>

            {/* SELECT DEPARTMENT */}
            <Form.Item
              label={
                <span className="font-medium flex items-center">
                  Select Department <span className="text-red-500 ml-1">*</span>
                </span>
              }
              name="department_id"
              rules={[
                {
                  required: true,
                  message: 'Please select department'
                }
              ]}
              className="mb-6"
            >
              <Select placeholder="Select a department" style={{ width: '100%' }}>
                {dataDepartment.map((item: any) => (
                  <Option key={item.id} value={item.id}>
                    {item.department}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            {/* Initial Balance Field */}
            <Form.Item
              label={
                <span className="font-medium flex items-center">
                  Initial Budget <span className="text-red-500 ml-1">*</span>
                </span>
              }
              name="budget"
              rules={[
                {
                  required: true,
                  message: 'Please enter initial amount'
                },
                {
                  type: 'number',
                  min: 0,
                  message: 'Amount must be positive'
                }
              ]}
              className="mb-2"
            >
              <InputNumber
                className="w-full h-10 rounded-lg"
                min={0}
                step={1000}
                formatter={(value) => {
                  if (value === undefined || value === null) return '₱ 0';
                  // Format with commas and peso sign
                  return `₱ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                }}
                parser={(value: any) => {
                  // Remove all non-numeric characters
                  return value ? value.replace(/[^\d]/g, '') : '';
                }}
                placeholder="Enter amount"
              />
            </Form.Item>

            <div className="text-sm mb-6">
              <AiOutlineInfoCircle className="inline mr-2" />
              Enter the starting balance for this budget period
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 border-t pt-6 mt-6">
              <Button
                onClick={onReset}
                type="default"
                size="large"
                className="w-full sm:w-auto h-11"
                icon={<AiOutlineClear className="text-gray-600" />}
              >
                Clear
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                className="w-full sm:w-auto h-11 bg-green-600 hover:bg-green-700"
                loading={loading}
                icon={!loading && <AiOutlineCheck />}
              >
                {loading ? 'Creating...' : 'Create Budget'}
              </Button>
            </div>
          </Form>
        </Modal>

        {/* UNBUDGETED REQUISITION MODAL */}
        <Modal
          width={460}
          title={
            <div className="flex items-center gap-3">
              <AiOutlineDollarCircle className="text-green-500 text-2xl" />
              <span className="text-xl font-semibold">Create Unbudgeted</span>
            </div>
          }
          open={isUnbudgetedRequisitionModalOpen}
          onCancel={handleCancelUnbudgetedRequisition}
          footer={null}
          centered
          destroyOnClose
          styles={{
            header: { borderBottom: '1px solid #f0f0f0', padding: '20px 24px' },
            body: { padding: '24px' }
          }}
          className="unbudgeted-requisition-modal"
        >
          <Form
            form={formUnbudgeted}
            layout="vertical"
            onFinish={onFinishUnbudgetedRequisition}
            className="unbudgeted-requisition-form"
          >
            {/* Date Field */}
            <Form.Item
              label={
                <span className="font-medium flex items-center">
                  Date <span className="text-red-500 ml-1">*</span>
                </span>
              }
              name="date"
              rules={[
                {
                  required: true,
                  message: 'Please select date'
                }
              ]}
              className="mb-6"
            >
              <DatePicker
                className="w-full h-10 rounded-lg"
                suffixIcon={<AiOutlineCalendar className="text-gray-400" />}
                format="MMM D, YYYY"
                placeholder="Select date"
              />
            </Form.Item>

            {/* SELECT DEPARTMENT */}
            <Form.Item
              label={
                <span className="font-medium flex items-center">
                  Select Department <span className="text-red-500 ml-1">*</span>
                </span>
              }
              name="department_id"
              rules={[
                {
                  required: true,
                  message: 'Please select department'
                }
              ]}
              className="mb-6"
            >
              <Select placeholder="Select a department" style={{ width: '100%' }}>
                {dataDepartment.map((item: any) => (
                  <Option key={item.id} value={item.id}>
                    {item.department}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            {/* Amount Field */}
            <Form.Item
              label={
                <span className="font-medium flex items-center">
                  Amount <span className="text-red-500 ml-1">*</span>
                </span>
              }
              name="amount"
              rules={[
                {
                  required: true,
                  message: 'Please enter amount'
                },
                {
                  type: 'number',
                  min: 0,
                  message: 'Amount must be positive'
                }
              ]}
              className="mb-2"
            >
              <InputNumber
                className="w-full h-10 rounded-lg"
                min={0}
                step={1000}
                formatter={(value) => {
                  if (value === undefined || value === null) return '₱ 0';
                  // Format with commas and peso sign
                  return `₱ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                }}
                parser={(value: any) => {
                  // Remove all non-numeric characters
                  return value ? value.replace(/[^\d]/g, '') : '';
                }}
                placeholder="Enter amount"
              />
            </Form.Item>

            {/* Notes Field */}
            <Form.Item
              label={
                <span className="font-medium flex items-center">
                  Notes <span className="text-red-500 ml-1">*</span>
                </span>
              }
              name="notes"
              rules={[
                {
                  required: true,
                  message: 'Please enter notes'
                }
              ]}
              className="mb-2"
            >
              <Input.TextArea
                className="w-full h-20 rounded-lg"
                placeholder="Enter notes"
              />
            </Form.Item>
            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 border-t pt-6 mt-6">
              <Button
                onClick={onResetUnbudgetedRequisition}
                type="default"
                size="large"
                className="w-full sm:w-auto h-11"
                icon={<AiOutlineClear className="text-gray-600" />}
              >
                Clear
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                className="w-full sm:w-auto h-11 bg-green-600 hover:bg-green-700"
                loading={loading}
                icon={!loading && <AiOutlineCheck />}
              >
                {loading ? 'Creating...' : 'Create Unbudgeted'}
              </Button>
            </div>
          </Form>
        </Modal>

        {/* EDIT ALLOCATED BUDGET PER DEPARTMENT */}
        <Modal
          width={460}
          title={
            <div className="flex items-center gap-3">
              <AiOutlineDollarCircle className="text-green-500 text-2xl" />
              <span className="text-xl font-semibold">Update Budget</span>
            </div>
          }
          open={isModalOpenEditAllocateBudget}
          onCancel={handleCancel}
          footer={null}
          centered
          destroyOnClose
          styles={{
            header: {
              borderBottom: '1px solid #f0f0f0',
              padding: '20px 24px'
            },
            body: {
              padding: '24px'
            }
          }}
          className="budget-modal"
        >
          <Form
            form={formEditAllocateBudget}
            layout="vertical"
            onFinish={onFinishEditAllocateBudget}
            className="budget-form"
          >
            <Descriptions className="mb-6" title="">
              <Descriptions.Item label="Department" span={3}>
                {dataBudgetPerDepartment?.departments?.department}
              </Descriptions.Item>
              <Descriptions.Item label="Start Date" span={3}>
                {dataBudgetPerDepartment?.start_date ?
                  new Date(dataBudgetPerDepartment.start_date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) :
                  'N/A'
                }
              </Descriptions.Item>
              <Descriptions.Item label="End Date" span={3}>
                {dataBudgetPerDepartment?.end_date ?
                  new Date(dataBudgetPerDepartment.end_date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) :
                  'N/A'
                }
              </Descriptions.Item>
            </Descriptions>

            {/* Initial Balance Field */}
            <Form.Item
              label={
                <span className="font-medium flex items-center">
                  Initial Budget <span className="text-red-500 ml-1">*</span>
                </span>
              }
              name="budget"
              rules={[
                {
                  required: true,
                  message: 'Please enter initial amount'
                },
                {
                  type: 'number',
                  min: 0,
                  message: 'Amount must be positive'
                }
              ]}
              className="mb-2"
            >
              <InputNumber
                className="w-full h-10 rounded-lg"
                min={0}
                step={1000}
                formatter={(value) => {
                  if (value === undefined || value === null) return '₱ 0';
                  // Format with commas and peso sign
                  return `₱ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                }}
                parser={(value: any) => {
                  // Remove all non-numeric characters
                  return value ? value.replace(/[^\d]/g, '') : '';
                }}
                placeholder="Enter amount"
              />
            </Form.Item>

            <div className="text-sm mb-6">
              <AiOutlineInfoCircle className="inline mr-2" />
              Enter the starting balance for this budget period
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 border-t pt-6 mt-6">
              <Button
                onClick={onReset}
                type="default"
                size="large"
                className="w-full sm:w-auto h-11"
                icon={<AiOutlineClear className="text-gray-600" />}
              >
                Clear
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                className="w-full sm:w-auto h-11 bg-green-600 hover:bg-green-700"
                loading={loading}
                icon={!loading && <AiOutlineCheck />}
              >
                {loading ? 'Creating...' : 'Update Budget'}
              </Button>
            </div>
          </Form>
        </Modal>

      </div>
      <section className="mt-5 space-y-5">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-blue-600">
                <AiOutlineDollarCircle />
                Budget Control Center
              </div>
              <h1 className="mt-2 text-2xl font-semibold text-slate-950">Budget Management</h1>
              <p className="mt-1 text-sm text-slate-500">
                Monitor allocations, spending, liquidation, and department budget usage for {currentYear}.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:min-w-[620px]">
              <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                <div className="text-xs text-slate-500">Departments</div>
                <div className="mt-1 text-xl font-semibold text-slate-900">{dataDepartment.length}</div>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                <div className="text-xs text-slate-500">Budget Health</div>
                <div className="mt-1"><Tag color={budgetHealthColor}>{budgetHealth}</Tag></div>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                <div className="text-xs text-slate-500">Period</div>
                <div className="mt-1 text-sm font-semibold text-slate-900">Jan - Dec {currentYear}</div>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                <div className="text-xs text-slate-500">Utilization</div>
                <div className="mt-1 text-xl font-semibold text-slate-900">{utilizationRate}%</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card className="rounded-xl border border-slate-200 shadow-sm" bodyStyle={{ padding: 20 }} loading={loading}>
            <div className="flex items-start justify-between">
              <div>
                <p className="m-0 text-sm font-medium text-slate-500">Total Budget</p>
                <div className="mt-3 text-2xl font-semibold text-slate-950">{formatCurrency(overallBudget || 0)}</div>
                <p className="m-0 mt-2 text-xs text-slate-500">Approved allocation for the year</p>
              </div>
              <div className="rounded-lg bg-blue-50 p-2 text-blue-600"><AiOutlineDollarCircle /></div>
            </div>
          </Card>

          <Card className="rounded-xl border border-slate-200 shadow-sm" bodyStyle={{ padding: 20 }} loading={loadingBudget}>
            <div className="flex items-start justify-between">
              <div>
                <p className="m-0 text-sm font-medium text-slate-500">Amount Spent</p>
                <div className="mt-3 text-2xl font-semibold text-slate-950">{formatCurrency(dataCombinedTotal || 0)}</div>
                <p className="m-0 mt-2 text-xs text-slate-500">Requisition and liquidation combined</p>
              </div>
              <div className="rounded-lg bg-rose-50 p-2 text-rose-600"><AiOutlineRise /></div>
            </div>
          </Card>

          <Card className="rounded-xl border border-slate-200 shadow-sm" bodyStyle={{ padding: 20 }} loading={loadingBudget}>
            <div className="flex items-start justify-between">
              <div>
                <p className="m-0 text-sm font-medium text-slate-500">Liquidation</p>
                <div className="mt-3 text-2xl font-semibold text-slate-950">{formatCurrency(dataTotalLiquidation || 0)}</div>
                <p className="m-0 mt-2 text-xs text-slate-500">Completed liquidation amount</p>
              </div>
              <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600"><AiOutlineCheck /></div>
            </div>
          </Card>

          <Card className="rounded-xl border border-slate-200 shadow-sm" bodyStyle={{ padding: 20 }} loading={loadingBudget}>
            <div className="flex items-start justify-between">
              <div>
                <p className="m-0 text-sm font-medium text-slate-500">Remaining Balance</p>
                <div className={`mt-3 text-2xl font-semibold ${remainingBalance < 0 ? "text-rose-600" : "text-emerald-700"}`}>
                  {formatCurrency(remainingBalance || 0)}
                </div>
                <p className="m-0 mt-2 text-xs text-slate-500">Available budget after spending</p>
              </div>
              <div className="rounded-lg bg-slate-100 p-2 text-slate-600"><AiOutlineInfoCircle /></div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.65fr)]">
          <Card className="rounded-xl border border-slate-200 shadow-sm" bodyStyle={{ padding: 24 }} loading={loading}>
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h2 className="m-0 text-lg font-semibold text-slate-950">Budget Utilization</h2>
                <p className="m-0 mt-1 text-sm text-slate-500">Current spend against approved budget.</p>
              </div>
              <div className="text-left lg:text-right">
                <div className="text-3xl font-semibold text-blue-700">{utilizationRate}%</div>
                <Tag color={budgetHealthColor}>{budgetHealth}</Tag>
              </div>
            </div>

            <div className="mt-6">
              <Progress
                percent={cappedUtilizationRate}
                showInfo={false}
                strokeColor={utilizationRate > 100 ? "#dc2626" : utilizationRate > 80 ? "#ef4444" : utilizationRate > 60 ? "#f59e0b" : "#2563eb"}
                trailColor="#e2e8f0"
              />
              <div className="mt-2 flex justify-between text-xs text-slate-500">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-3">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs text-slate-500">Requisition</div>
                <div className="mt-1 text-lg font-semibold text-slate-900">{formatCurrency(dataTotalRequisition || 0)}</div>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs text-slate-500">Daily Average Spend</div>
                <div className="mt-1 text-lg font-semibold text-slate-900">{formatCurrency(dataCombinedTotal / 365)}</div>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs text-slate-500">Monthly Average</div>
                <div className="mt-1 text-lg font-semibold text-slate-900">{formatCurrency(dataCombinedTotal / 12)}</div>
              </div>
            </div>
          </Card>

          <Card className="rounded-xl border border-slate-200 shadow-sm" bodyStyle={{ padding: 24 }} loading={loading}>
            <h2 className="m-0 text-lg font-semibold text-slate-950">Funding Summary</h2>
            <p className="m-0 mt-1 text-sm text-slate-500">Allocation composition for {currentYear}.</p>

            <div className="mt-5 space-y-4">
              <div>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-slate-500">Budgeted</span>
                  <span className="font-semibold text-slate-900">{formatCurrency(dataTotalBudgeted || 0)}</span>
                </div>
                <Progress percent={overallBudget > 0 ? Math.round((dataTotalBudgeted / overallBudget) * 100) : 0} showInfo={false} strokeColor="#16a34a" />
              </div>
              <div>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-slate-500">Unbudgeted</span>
                  <span className="font-semibold text-slate-900">{formatCurrency(dataTotalUnBudgeted || 0)}</span>
                </div>
                <Progress percent={overallBudget > 0 ? Math.round((dataTotalUnBudgeted / overallBudget) * 100) : 0} showInfo={false} strokeColor="#f59e0b" />
              </div>
              <div className="rounded-lg bg-slate-50 p-4 text-sm text-slate-600">
                Overspending is shown as a negative remaining balance so finance can review allocations quickly.
              </div>
            </div>
          </Card>
        </div>

        <Card className="rounded-xl border border-slate-200 shadow-sm" bodyStyle={{ padding: 0 }}>
          <div className="border-b border-slate-200 px-5 py-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="m-0 text-lg font-semibold text-slate-950">Department Budgets</h2>
                <p className="m-0 mt-1 text-sm text-slate-500">
                  Showing {dataBudgetDepartment.length || dataDepartment.length} active department allocations.
                </p>
              </div>
              <Tag color="blue" className="m-0 px-3 py-1">{formatCurrency(dataTotalBudgeted || 0)} allocated</Tag>
            </div>
          </div>

          <div className="hidden border-b border-slate-100 bg-slate-50 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 xl:grid xl:grid-cols-[minmax(260px,1fr)_180px_180px_220px]">
            <span>Department</span>
            <span>Budget</span>
            <span>Usage</span>
            <span className="text-right">Actions</span>
          </div>

          <div>{departmentCards}</div>

          {dataDepartment.length === 0 && (
            <div className="py-16 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                <AiOutlineBuild className="text-2xl text-slate-400" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-slate-700">No Departments Found</h3>
              <p className="mb-6 text-slate-500">Add departments to start managing budgets</p>
              <Button type="primary" icon={<AiOutlinePlus />}>Add First Department</Button>
            </div>
          )}

          <div className="border-t border-slate-200 bg-slate-50 px-5 py-3">
            <div className="flex flex-wrap justify-between gap-3 text-sm text-slate-600">
              <span>Showing <span className="font-semibold">{dataBudgetDepartment.length || dataDepartment.length}</span> departments</span>
              <span>
                Total Used: <span className="font-semibold text-blue-700">{formatCurrency(dataCombinedTotal || 0)}</span>
                <span className="mx-2 text-slate-300">/</span>
                Utilization: <span className="font-semibold text-slate-900">{utilizationRate}%</span>
              </span>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
