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
import { AiOutlineCalendar, AiOutlineCheck, AiOutlineClear, AiOutlineDollarCircle, AiOutlineInfoCircle, AiOutlinePlus, AiOutlineRise } from "react-icons/ai";
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
      // console.log("DATA DEPARTMENT BUDGET", dataFetch)
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
    label: item.departments.department,
    children: <Particulars item={item} />,
    extra: (
      <div className="flex items-center gap-3">
        {/* Budget Amount with subtle styling */}
        <div className="text-xl font-bold text-blue-800 tracking-tight">
          {new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
          }).format(item.budget)}
        </div>

        {/* Edit Icon with button style */}
        <Button
          type="text"
          size="small"
          icon={<EditOutlined className="text-xs" />}
          onClick={(e) => {
            e.stopPropagation();
            setIsModalOpenEditAllocateBudget(true);
            setDataBudgetPerDepartment(item);
            // console.log("COLLAPSE ITEM", item);
            formEditAllocateBudget.setFieldsValue({ budget: item.budget });
          }}
          disabled={isDisabled}
          className="flex items-center text-xs text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-2 py-1 rounded"
        >
          Edit
        </Button>
      </div>
    )
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

      <Row gutter={16} className="pt-5">
        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 2xl:grid-cols-1 gap-6 w-full">
          {/* Overall Budget Card */}
          <Card
            loading={loading}
            className="rounded-lg mb-6 shadow-sm"
          >
            <div className="flex flex-col">

              <div className="flex justify-between items-center mb-4">
                <h2 className="flex flex-wrap text-lg font-semibold">
                  <RiCircleFill className="text-[5px] text-green-500 mt-3 mr-2" />
                  Overall Budget Status
                </h2>
                <div className="flex items-center gap-2">
                  <span className="text-sm">Current Period:</span>
                  <Tag color="blue">
                    {`January 01 ${currentYear}`} to {`December 31 ${currentYear}`}
                    {/* {dayjs(data?.start_date || '').format('MMM DD YYYY')} - {dayjs(data?.end_date || '').format('MMM DD YYYY')} */}
                  </Tag>
                </div>
              </div>


              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="text-sm">Total Budgeted</div>
                  <div className="text-2xl font-bold">
                    {formatCurrency(dataTotalBudgeted || 0)}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm">Amount Spent</div>
                  <div className="text-2xl font-bold text-red-600">
                    {formatCurrency(dataCombinedTotal)}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm">Remaining</div>
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(Number(dataTotalBudgeted + dataTotalUnBudgeted || 0) - dataCombinedTotal || 0)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div className="space-y-2">
                  <div className="text-sm">Total Unbudgeted</div>
                  <div className="text-2xl font-bold">
                    {formatCurrency(dataTotalUnBudgeted || 0)}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm">OVERALL BUDGET STATUS</div>
                  <div className="text-2xl font-bold text-blue-800">
                    {formatCurrency(dataTotalBudgeted + dataTotalUnBudgeted || 0)}
                  </div>
                </div>
              </div>

              <Progress
                percent={50}
                strokeColor="#1890ff"
                status="active"
                className="mt-6"
              />

              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>
          </Card>
        </div>
      </Row>

      {/* LIST OF DEPARTMENT AND INFORMATION CARD */}
      <Row gutter={16} className="">
        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 2xl:grid-cols-1 gap-6 w-full">
          <Card
            className="rounded-lg mb-6 shadow-sm"
          >
            <div className="flex flex-col">
              <h2 className="flex flex-wrap text-md font-semibold">
                <RiCircleFill className="text-[5px] text-green-500 mt-2 mr-2" />
                ALL DEPARTMENTS ({dataDepartment.length})
              </h2>
              <div className="mt-2">
                <Collapse items={departments} />
              </div>
            </div>
          </Card>
        </div>
      </Row>

      {/* THIS IS THE BUDGET DASHBOARD */}

      <Row gutter={16}>
        <div className="w-full bg-gradient-to-r from-blue-50 to-blue-100 p-5 rounded-lg border border-blue-200 shadow-sm hover:shadow-md transition-shadow">
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