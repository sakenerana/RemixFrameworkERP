import { EditOutlined, HomeOutlined, LoadingOutlined } from "@ant-design/icons";
import {
  Alert,
  Breadcrumb,
  Button,
  Card,
  Collapse,
  CollapseProps,
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
import { useEffect, useMemo, useState } from "react";
import { AiOutlineBuild, AiOutlineCalendar, AiOutlineCheck, AiOutlineClear, AiOutlineDollarCircle, AiOutlineDown, AiOutlineEye, AiOutlineInfoCircle, AiOutlinePlus, AiOutlineRise, AiOutlineSearch } from "react-icons/ai";
import { RiCircleFill } from "react-icons/ri";
import { BudgetService } from "~/services/budget.service";
import { Budget } from "~/types/budget.type";
import dayjs from 'dayjs';
import { DepartmentService } from "~/services/department.service";
import { Department } from "~/types/department.type";
import Particulars from "~/components/particulars";

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
    if (isDepartmentID == 2) {
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

  const departments: CollapseProps['items'] = dataBudgetDepartment.map((item: any) => ({
    key: item.id,
    label: (
      <div className="flex items-center justify-between w-full pr-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">
              {item.departments?.department?.charAt(0) || 'D'}
            </span>
          </div>
          <div>
            <div className="font-semibold text-gray-800">{item.departments?.department || 'Unknown Department'}</div>
            <div className="text-xs text-gray-500 flex items-center gap-2">
              <span>Budget Period: {dayjs(item.start_date).format('MMM D')} - {dayjs(item.end_date).format('MMM D, YYYY')}</span>
              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
              <span>Status: <Tag color="green">Active</Tag></span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="font-bold text-lg text-blue-800">
              {new Intl.NumberFormat('en-PH', {
                style: 'currency',
                currency: 'PHP',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              }).format(item.budget)}
            </div>
            <div className="text-xs text-gray-500">Allocated Budget</div>
          </div>
          <div className="w-32">
            <Progress
              percent={Math.min(100, (dataCombinedTotal / item.budget) * 100)}
              size="small"
              strokeColor={
                (dataCombinedTotal / item.budget) > 0.8 ? '#ef4444' :
                  (dataCombinedTotal / item.budget) > 0.6 ? '#f59e0b' : '#10b981'
              }
            />
          </div>
        </div>
      </div>
    ),
    children: <Particulars item={item} />,
    extra: (
      <div className="flex items-center gap-3">
        <Button
          type="text"
          size="small"
          icon={<EditOutlined className="text-sm" />}
          onClick={(e) => {
            e.stopPropagation();
            setIsModalOpenEditAllocateBudget(true);
            setDataBudgetPerDepartment(item);
            formEditAllocateBudget.setFieldsValue({ budget: item.budget });
          }}
          disabled={isDisabled}
          className="flex items-center text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg border border-gray-200 hover:border-blue-300 transition-all"
        >
          Edit Budget
        </Button>
      </div>
    ),
    style: {
      marginBottom: 8,
      background: 'white',
      borderRadius: 8,
      border: '1px solid #e5e7eb',
    }
  }));

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
    <div>
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
      <Alert
        message="You can see here all the status of overall budget status. Please check closely."
        type="info"
        showIcon
      />

      {/* THIS IS THE FIRST ROW OF DASHBOARD */}

      <Row gutter={16} className="pt-5">
        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2 gap-6 w-full">
          {budget.map((data: any, index: number) => (
            <Card
              key={data.title}
              loading={false}
              className="rounded-md shadow-md overflow-hidden transition-transform duration-300 hover:scale-[1.02] border-none"
              bodyStyle={{
                padding: '24px',
                background: data.gradient,
                borderRadius: '8px',
                color: 'white',
                minHeight: '180px',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <span className="flex flex-wrap text-sm font-semibold text-white">
                    <RiCircleFill className="text-[5px] text-white/90 mt-2 mr-2" />
                    {data.title}
                  </span>
                  <Tag
                    color="gray"
                    className="flex gap-1 text-xs bg-white/20 backdrop-blur-sm border-white/30 text-gray-800"
                  >
                    <AiOutlineRise className="text-gray-500" /> TBD
                  </Tag>
                </div>
                <div className="mt-auto">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-white">
                      {loadingBudget ? (
                        <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
                      ) : (
                        formatCurrency(data.value ?? 0)
                      )}
                    </span>
                    <span className="text-sm text-white/80">
                      of {formatCurrency(data.totalBudget ?? 0)}
                    </span>
                  </div>
                  {loading ? (
                    <Skeleton active paragraph={false} className="mt-3 bg-white/20" />
                  ) : (
                    <div className="mt-4">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-full bg-white/20 rounded-full h-2">
                          <div
                            className="bg-white/90 h-2 rounded-full"
                            style={{
                              width: `${Math.min(100, (data.value / data.totalBudget) * 100)}%`
                            }}
                          />
                        </div>
                        <span className="text-xs font-medium text-white min-w-[40px]">
                          {Math.round(Math.min(100, (data.value / data.totalBudget) * 100))}%
                        </span>
                      </div>
                      <div className="flex justify-between text-xs text-white/80 mt-1">
                        <span>0%</span>
                        <span>Utilization</span>
                        <span>100%</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Row>

      {/* 2nd Row of Budget Cards */}
      <Row gutter={16} className="pt-5">
        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 2xl:grid-cols-1 gap-6 w-full">
          {/* Overall Budget Card - Enhanced Design */}
          <Card
            loading={loading}
            className="rounded-xl shadow-lg border-0 overflow-hidden"
            bodyStyle={{ padding: 0 }}
          >
            <div className="relative">
              {/* Header with gradient background */}
              <div className=" px-6 pt-6 rounded-md">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <h2 className="text-xl font-bold">Overall Budget Status</h2>
                    </div>
                    <p className="text-gray-500 text-sm">Financial overview for current period</p>
                  </div>
                  <Tag className="bg-gray/20 border-gray/30 text-gray-500 text-sm px-3 py-1 rounded-full">
                    {/* <AiOutlineCalendar /> */}
                    {`Jan 01 ${currentYear}`} - {`Dec 31 ${currentYear}`}
                  </Tag>
                </div>
              </div>

              {/* Main Content */}
              <div className="p-6">
                {/* Key Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">

                  {/* Total Budgeted */}
                  <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-green-700 text-sm font-medium">Total Budgeted</div>
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                        <AiOutlineDollarCircle className="text-green-600 text-sm" />
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-green-800">
                      {formatCurrency(dataTotalBudgeted || 0)}
                    </div>
                    <div className="text-xs text-green-600 mt-1">Allocated funds</div>
                  </div>

                  {/* Total Unbudgeted */}
                  <div className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-amber-700 text-sm font-medium">Total Unbudgeted</div>
                      <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center">
                        <span className="text-amber-600 text-xs font-bold">U</span>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-amber-800">
                      {formatCurrency(dataTotalUnBudgeted || 0)}
                    </div>
                    <div className="text-xs text-amber-600 mt-1">Additional expenses</div>
                  </div>

                  {/* Overall Budget */}
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-blue-700 text-sm font-medium">Overall Budget</div>
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                        <AiOutlineInfoCircle className="text-blue-600 text-sm" />
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-blue-800">
                      {formatCurrency(dataTotalBudgeted + dataTotalUnBudgeted || 0)}
                    </div>
                    <div className="text-xs text-blue-600 mt-1">Overall allocation</div>
                  </div>

                  {/* Amount Spent */}
                  <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-red-700 text-sm font-medium">Amount Spent</div>
                      <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                        <AiOutlineRise className="text-red-600 text-sm" />
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-red-800">
                      {formatCurrency(dataCombinedTotal || 0)}
                    </div>
                    <div className="text-xs text-red-600 mt-1">Utilized funds</div>
                  </div>

                  {/* Remaining Balance */}
                  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-emerald-700 text-sm font-medium">Remaining Balance</div>
                      <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
                        <AiOutlineCheck className="text-emerald-600 text-sm" />
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-emerald-800">
                      {formatCurrency((dataTotalBudgeted + dataTotalUnBudgeted || 0) - dataCombinedTotal || 0)}
                    </div>
                    <div className="text-xs text-emerald-600 mt-1">Available funds</div>
                  </div>

                </div>

                {/* Progress Section */}
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-700">Budget Utilization</h3>
                      <p className="text-sm text-gray-500">How much of your total budget has been used</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-700">
                        {dataTotalBudgeted + dataTotalUnBudgeted > 0
                          ? `${Math.round((dataCombinedTotal / (dataTotalBudgeted + dataTotalUnBudgeted)) * 100)}%`
                          : '0%'
                        }
                      </div>
                      <div className="text-xs text-gray-500">Utilization Rate</div>
                    </div>
                  </div>

                  {/* Custom Progress Bar */}
                  <div className="relative pt-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>0%</span>
                      <span className="font-medium">Budget Utilization</span>
                      <span>100%</span>
                    </div>

                    <div className="h-4 bg-gray-200 rounded-full overflow-hidden relative">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"
                        style={{
                          width: `${dataTotalBudgeted + dataTotalUnBudgeted > 0
                            ? Math.min(100, (dataCombinedTotal / (dataTotalBudgeted + dataTotalUnBudgeted)) * 100)
                            : 0}%`
                        }}
                      >
                        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-white border-2 border-blue-500 rounded-full shadow-sm"></div>
                      </div>
                    </div>

                    {/* Milestone markers */}
                    <div className="flex justify-between mt-1 relative">
                      {[0, 25, 50, 75, 100].map((marker) => (
                        <div key={marker} className="flex flex-col items-center">
                          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                          <span className="text-xs text-gray-500 mt-1">{marker}%</span>
                        </div>
                      ))}
                    </div>

                    {/* Budget breakdown indicators */}
                    <div className="flex justify-between mt-6">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded"></div>
                        <span className="text-sm text-gray-600">Budget Used</span>
                        <span className="text-sm font-semibold">{formatCurrency(dataCombinedTotal)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-gray-300 rounded"></div>
                        <span className="text-sm text-gray-600">Budget Available</span>
                        <span className="text-sm font-semibold">
                          {formatCurrency((dataTotalBudgeted + dataTotalUnBudgeted) - dataCombinedTotal)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="text-sm text-gray-500 mb-1">Daily Average Spend</div>
                    <div className="text-lg font-semibold text-gray-800">
                      {formatCurrency(dataCombinedTotal / 365)}
                    </div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="text-sm text-gray-500 mb-1">Monthly Average</div>
                    <div className="text-lg font-semibold text-gray-800">
                      {formatCurrency(dataCombinedTotal / 12)}
                    </div>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="text-sm text-gray-500 mb-1">Budget Health</div>
                    <div className="flex items-center">
                      <div className={`text-lg font-semibold mr-2 ${(dataCombinedTotal / (dataTotalBudgeted + dataTotalUnBudgeted)) < 0.5
                        ? 'text-green-600'
                        : (dataCombinedTotal / (dataTotalBudgeted + dataTotalUnBudgeted)) < 0.8
                          ? 'text-amber-600'
                          : 'text-red-600'
                        }`}>
                        {dataTotalBudgeted + dataTotalUnBudgeted > 0
                          ? Math.round((dataCombinedTotal / (dataTotalBudgeted + dataTotalUnBudgeted)) * 100)
                          : 0
                        }%
                      </div>
                      <Tag color={
                        (dataCombinedTotal / (dataTotalBudgeted + dataTotalUnBudgeted)) < 0.5
                          ? 'success'
                          : (dataCombinedTotal / (dataTotalBudgeted + dataTotalUnBudgeted)) < 0.8
                            ? 'warning'
                            : 'error'
                      }>
                        {(dataCombinedTotal / (dataTotalBudgeted + dataTotalUnBudgeted)) < 0.5
                          ? 'Healthy'
                          : (dataCombinedTotal / (dataTotalBudgeted + dataTotalUnBudgeted)) < 0.8
                            ? 'Moderate'
                            : 'Critical'
                        }
                      </Tag>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </Row>

      {/* LIST OF DEPARTMENT AND INFORMATION CARD */}
      <Row gutter={16} className="mt-6">
        <div className="w-full">
          <Card
            className="rounded-xl shadow-md border-0 overflow-hidden"
            bodyStyle={{ padding: 0 }}
          >
            {/* Header with Stats */}
            <div className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200 p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <h2 className="text-xl font-bold text-gray-800">Departments Overview</h2>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">
                        Total Departments: <span className="font-semibold">{dataDepartment.length}</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-600">
                        Total Budget: <span className="font-semibold">{formatCurrency(dataTotalBudgeted || 0)}</span>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="text"
                    size="small"
                    icon={<AiOutlineInfoCircle />}
                    onClick={() => {/* Add department summary modal */ }}
                    className="text-gray-500 hover:text-blue-600"
                  >
                    View Summary
                  </Button>
                  <Tag color="blue" className="px-3 py-1 rounded-full">
                    <span className="flex items-center gap-1">
                      <RiCircleFill className="text-[6px]" />
                      Active
                    </span>
                  </Tag>
                </div>
              </div>
            </div>

            {/* Departments List - Enhanced Collapse */}
            <div className="p-2">
              <Collapse
                items={departments}
                expandIconPosition="end"
                ghost
                size="large"
                className="department-collapse"
                expandIcon={({ isActive }) => (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">
                      {isActive ? 'Hide Details' : 'View Details'}
                    </span>
                    <div className={`transition-transform ${isActive ? 'rotate-180' : ''}`}>
                      <AiOutlineDown className="text-gray-400" />
                    </div>
                  </div>
                )}
              />
            </div>

            {/* Empty State */}
            {dataDepartment.length === 0 && (
              <div className="py-16 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <AiOutlineBuild className="text-gray-400 text-2xl" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No Departments Found</h3>
                <p className="text-gray-500 mb-6">Add departments to start managing budgets</p>
                <Button type="primary" icon={<AiOutlinePlus />}>
                  Add First Department
                </Button>
              </div>
            )}

            {/* Footer with Summary */}
            <div className="bg-gray-50 border-t border-gray-200 px-6 py-4">
              <div className="flex flex-wrap justify-between items-center gap-4">
                <div className="text-sm text-gray-600">
                  Showing <span className="font-semibold">{dataDepartment.length}</span> departments
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-sm">
                    <span className="text-gray-500">Total Allocated: </span>
                    <span className="font-semibold text-green-600">
                      {formatCurrency(dataTotalBudgeted || 0)}
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-500">Total Used: </span>
                    <span className="font-semibold text-blue-600">
                      {formatCurrency(dataCombinedTotal || 0)}
                    </span>
                  </div>
                  <Tooltip title="Budget Utilization Rate">
                    <div className="text-sm">
                      <span className="text-gray-500">Utilization: </span>
                      <span className={`font-semibold ${(dataCombinedTotal / dataTotalBudgeted) > 0.8 ? 'text-red-600' :
                          (dataCombinedTotal / dataTotalBudgeted) > 0.6 ? 'text-amber-600' : 'text-green-600'
                        }`}>
                        {dataTotalBudgeted > 0 ? `${Math.round((dataCombinedTotal / dataTotalBudgeted) * 100)}%` : '0%'}
                      </span>
                    </div>
                  </Tooltip>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </Row>

      {/* THIS IS THE BUDGET DASHBOARD */}

      <Row gutter={16}>
        <div className="w-full bg-gradient-to-r from-blue-50 to-blue-100 p-5 rounded-lg border border-blue-200 shadow-sm hover:shadow-md transition-shadow mt-4">
          <div className="flex items-start gap-4">
            <AiOutlineInfoCircle className="text-blue-600 text-2xl mt-1 flex-shrink-0" />
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold text-blue-900">
                  Budgeting Tip of the Month
                </h3>
                <Tag color="blue" className="text-xs">NEW</Tag>
              </div>
              <p className="text-sm text-blue-800 leading-relaxed">
                Track expenses weekly to avoid surprises.
                <span className="font-medium text-blue-900"> Save 10% as emergency buffer.</span>
              </p>
              <blockquote className="mt-3 px-3 py-2 bg-blue-50/50 border-l-4 border-blue-300 rounded-r">
                <p className="text-xs text-blue-700 italic">
                  "A budget is telling your money where to go instead of wondering where it went."
                  <span className="block font-medium text-blue-800 mt-1 not-italic">— IT Department</span>
                </p>
              </blockquote>
              <blockquote className="mt-3 px-3 py-2 bg-blue-50/50 border-l-4 border-blue-300 rounded-r">
                <p className="text-xs text-blue-700 italic">
                  "Don't save what is left after spending; spend what is left after saving."
                  <span className="block font-medium text-blue-800 mt-1 not-italic">— Finance Department</span>
                </p>
              </blockquote>
            </div>
          </div>
        </div>

      </Row>
    </div>
  );
}