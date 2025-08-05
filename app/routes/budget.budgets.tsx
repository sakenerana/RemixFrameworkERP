import { HomeOutlined, LoadingOutlined } from "@ant-design/icons";
import {
  Alert,
  Breadcrumb,
  Button,
  Card,
  DatePicker,
  Form,
  InputNumber,
  message,
  Modal,
  Progress,
  Row,
  Skeleton,
  Space,
  Spin,
  Tag,
} from "antd";
import axios from "axios";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { AiOutlineCalendar, AiOutlineCheck, AiOutlineClear, AiOutlineDollarCircle, AiOutlineInfoCircle, AiOutlinePlus, AiOutlineRise } from "react-icons/ai";
import { RiCircleFill } from "react-icons/ri";
import { BudgetService } from "~/services/budget.service";
import { Budget } from "~/types/budget.type";
import dayjs from 'dayjs';

export default function Budgets() {
  const [data, setData] = useState<Budget>();
  const [dataTotalRequisition, setDataTotalRequisition] = useState<any>(0);
  const [dataTotalLiquidation, setDataTotalLiquidation] = useState<any>(0);
  const [dataCombinedTotal, setDataCombinedTotal] = useState<any>(0);

  const [loading, setLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isUserID, setUserID] = useState<any>();
  const [isDepartmentID, setDepartmentID] = useState<any>();
  const [isOfficeID, setOfficeID] = useState<any>();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm<Budget>();
  const { RangePicker } = DatePicker;

  const onReset = () => {
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

  // const handleOk = () => {
  //   setIsModalOpen(false);
  // };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "PHP",
    }).format(amount);
  };

  // const getBudgetProgress = (spent: number, total: number) => {
  //   return Math.min((spent / total) * 100, 100);
  // };

  // const getBudgetStatusColor = (spent: number, total: number) => {
  //   const percentage = (spent / total) * 100;
  //   if (percentage < 70) return "text-green-600";
  //   if (percentage < 90) return "text-amber-600";
  //   return "text-red-600";
  // };

  // const handleRefetch = async () => {
  //   setLoading(true);
  //   await fetchData();
  //   setLoading(false);
  // };

  const fetchData = async () => {
    try {
      // setLoading(true);
      const dataFetch = await BudgetService.getByData(isDepartmentID, isOfficeID);
      setData(dataFetch); // Works in React state
      // console.log("BUDGET DATAS", dataFetch)
    } catch (error) {
      message.error("error");
    } finally {
      // setLoading(false);
    }
  };

  const fetchDataBudgetApproved = async () => {
    const userId = Number(localStorage.getItem("ab_id"));
    const username = localStorage.getItem("username") || "";
    const userDepartment = localStorage.getItem("dept") || "";
    const userOffice = localStorage.getItem("userOffice") || "";
    const departmentId = isDepartmentID;
    const officeId = isOfficeID;

    // Cache configuration
    const CACHE_KEY = `budgetApproved_${userId}_${departmentId}_${officeId}`;
    const CACHE_EXPIRY = 5 * 60 * 1000; // 15 minutes cache
    const now = new Date().getTime();

    if (!userId || !username || !departmentId || !officeId) {
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

      // Parallel API calls
      const [requisitionResponse, budgetData] = await Promise.all([
        axios.post<{ data: any[] }>(
          "/api/completed-requisition-liquidation",
          { userid: userId, username }
        ),
        BudgetService.getByData(departmentId, officeId)
      ]);

      const items = requisitionResponse.data.data || [];
      const startDate = budgetData?.start_date;
      const endDate = budgetData?.end_date;

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
        const matches = item.department === userDepartment && item.branch === userOffice && item.status === 5 && inRange;

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

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        await Promise.all([
          fetchData(),
          fetchDataBudgetApproved()
        ]);
      } catch (error) {
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  useMemo(() => {
    setUserID(localStorage.getItem('userAuthID'));
    setDepartmentID(localStorage.getItem('userDept'));
    setOfficeID(localStorage.getItem('userOfficeID'));
  }, []);

  const budget = [
    {
      title: "Requisition",
      value: dataTotalRequisition,
      totalBudget: data?.budget
    },
    {
      title: "Liquidation",
      value: dataTotalLiquidation,
      totalBudget: data?.budget
    },
  ];

  const trendData = [
    { date: "2023-01", value: 35 },
    { date: "2023-02", value: 42 },
    { date: "2023-03", value: 38 },
    { date: "2023-04", value: 51 },
    { date: "2023-05", value: 49 },
    { date: "2023-06", value: 49 },
    { date: "2023-07", value: 49 },
    { date: "2023-08", value: 49 },
    { date: "2023-09", value: 49 },
    { date: "2023-10", value: 49 },
    { date: "2023-11", value: 49 },
  ];

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
      const existingData = await BudgetService.getAllPosts(isDepartmentID, formattedDate);

      if (existingData && existingData.length > 0) {
        throw new Error(`A budget record already exists for ${dayjs(existingData[0].start_date).format('MMM DD YYYY')} - ${dayjs(existingData[0].end_date).format('MMM DD YYYY')} in this department`);
      }

      // Prepare payload with formatted dates
      const allValues = {
        ...values,
        start_date: startDate.format("YYYY-MM-DD"),
        end_date: endDate.format("YYYY-MM-DD"),
        status_id: 1,
        department_id: isDepartmentID,
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

  return (
    <div>
      <div className="flex pb-5 justify-between">
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
              onClick={() => handleTrack()}
              icon={<AiOutlinePlus />}
              type="primary"
              disabled={isDisabled}
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
                disabledDate={(current) => {
                  // Disable dates before today
                  return current && current < moment().startOf('day');
                }}
              />
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
      </div>
      <Alert
        message="You can see here all the status of overall budget status. Please check closely."
        type="info"
        showIcon
      />

      {/* THIS IS THE FIRST ROWN OF DASHBOARD */}

      <Row gutter={16} className="pt-5">
        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2 gap-6 w-full">
          {budget.map((data: any) => (
            <Card
              key={data.title}
              loading={false} // We handle loading state manually
              className="rounded-lg hover:border-blue-300 transition-all shadow-sm hover:shadow-md"
            >
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-start mb-2">
                  <span className="flex flex-wrap text-sm font-medium">
                    <RiCircleFill className="text-[5px] text-green-500 mt-2 mr-2" />
                    {data.title}
                  </span>
                  <Tag color="green" className="flex gap-1 text-xs">
                    <AiOutlineRise /> TBD
                  </Tag>
                </div>
                <div className="mt-auto">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold">
                      {loading ? (
                        <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
                      ) : (
                        formatCurrency(data.value ?? 0)
                      )}
                    </span>
                    <span className="text-sm">
                      of ${formatCurrency(data.totalBudget ?? 0)}
                    </span>
                  </div>
                  {loading ? (
                    <Skeleton active paragraph={false} className="mt-3" />
                  ) : (
                    <Progress
                      percent={Math.min(100, (data.value / data.totalBudget) * 100)}
                      strokeColor={data.value > data.totalBudget ? "#f5222d" : "#52c41a"}
                      showInfo={false}
                      className="mt-3"
                    />
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
                    {dayjs(data?.start_date || '').format('MMM DD YYYY')} - {dayjs(data?.end_date || '').format('MMM DD YYYY')}
                  </Tag>
                </div>
              </div>


              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="text-sm">Total Budget</div>
                  <div className="text-2xl font-bold">
                    {formatCurrency(data?.budget || 0)}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm">Amount Spent</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {formatCurrency(dataCombinedTotal)}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm">Remaining</div>
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(Number(data?.budget || 0) - dataCombinedTotal || 0)}
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

      {/* THIS IS THE BUDGET DASHBOARD */}

      <Row gutter={16}>
        {/* <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 2xl:grid-cols-1 gap-6 w-full">
          <Card
            className="rounded-md shadow-md overflow-hidden transition-transform duration-300"
          >
            <div>
              <h2 className="flex flex-wrap text-sm font-semibold mb-2">
                <RiCircleFill className="text-[5px] text-green-500 mt-2 mr-2" /> Spending By Category
              </h2>
              <p className="flex flex-wrap text-xs">Current month breakdown</p>
              {loading ? (
                <Skeleton active paragraph={{ rows: 6 }} />
              ) : (
                <LineChart
                  data={trendData}
                  title="Monthly Performance"
                  color="#6a5acd"
                />
              )}
            </div>
          </Card>
        </div> */}
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
              {/* <div className="mt-2 flex items-center gap-2">
                <Button
                  type="text"
                  size="small"
                  icon={<AiOutlinePlusCircle />}
                  className="text-blue-600 text-xs"
                >
                  Create Reminder
                </Button>
                <Button
                  type="text"
                  size="small"
                  icon={<AiOutlineShareAlt />}
                  className="text-blue-600 text-xs"
                >
                  Share Tip
                </Button>
              </div> */}
              <blockquote className="mt-3 px-3 py-2 bg-blue-50/50 border-l-4 border-blue-300 rounded-r">
                <p className="text-xs text-blue-700 italic">
                  “A budget is telling your money where to go instead of wondering where it went.”
                  <span className="block font-medium text-blue-800 mt-1 not-italic">— IT Department</span>
                </p>
              </blockquote>
              <blockquote className="mt-3 px-3 py-2 bg-blue-50/50 border-l-4 border-blue-300 rounded-r">
                <p className="text-xs text-blue-700 italic">
                  “Don’t save what is left after spending; spend what is left after saving.”
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
