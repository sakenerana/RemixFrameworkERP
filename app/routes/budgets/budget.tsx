import { HomeOutlined, LoadingOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "@remix-run/react";
import {
  Alert,
  Breadcrumb,
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Progress,
  Row,
  Select,
  Space,
  Spin,
  Tag,
} from "antd";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { AiOutlineCalendar, AiOutlineCheck, AiOutlineClear, AiOutlineDollarCircle, AiOutlineInfoCircle, AiOutlinePlus, AiOutlineSend } from "react-icons/ai";
import { RiCircleFill } from "react-icons/ri";
import LineChart from "~/components/line_chart";

interface DataType {
  id: number;
  title: string;
  body: string;
  userId?: number; // Optional property
}

export default function Budgets() {
  const [data, setData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isUserID, setUserID] = useState<any>();
  const [isDepartmentID, setDepartmentID] = useState<any>();

  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm<DataType>();
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

  const handleOk = () => {
    setIsModalOpen(false);
  };

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

  const getBudgetProgress = (spent: number, total: number) => {
    return Math.min((spent / total) * 100, 100);
  };

  const getBudgetStatusColor = (spent: number, total: number) => {
    const percentage = (spent / total) * 100;
    if (percentage < 70) return "text-green-600";
    if (percentage < 90) return "text-amber-600";
    return "text-red-600";
  };

  const handleRefetch = async () => {
    setLoading(true);
    await fetchData();
    setLoading(false);
  };

  const fetchData = async () => {
    try {
      const response = await axios
        .get<DataType[]>("https://jsonplaceholder.typicode.com/posts") // Specify response type
        .then((response) => {
          setData(response.data);
          setLoading(false);
        })
        .catch((error) => {
          setError(error.message);
          setLoading(false);
        });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // Empty dependency array means this runs once on mount+

  useMemo(() => {
    setUserID(localStorage.getItem('userAuthID'));
    setDepartmentID(localStorage.getItem('userDept'));
  }, []);

  const budget = [
    {
      title: "Requisition",
    },
    {
      title: "Liquidation",
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

      // Include your extra field
      const allValues = {
        ...values,
        status_id: isUserID,
        department_id: isDepartmentID
      };
      console.log("Form Values", allValues)
      // if (editingId) {
      //   // Update existing record
      //   const { error } = await GroupService.updatePost(editingId, values);

      //   if (error) throw message.error(error.message);
      //   message.success("Record updated successfully");
      // } else {
      //   // Create new record
      //   setLoading(true);
      //   const { error } = await GroupService.createPost(allValues);

      //   if (error) throw message.error(error.message);
      //   message.success("Record created successfully");
      // }

      setLoading(false);
      setIsModalOpen(false);
      form.resetFields();
      fetchData();
    } catch (error) {
      message.error("Error");
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

            {/* Initial Balance Field */}
            <Form.Item
              label={
                <span className="font-medium flex items-center">
                  Initial Balance <span className="text-red-500 ml-1">*</span>
                </span>
              }
              name="initial_balance"
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

            <div className="text-sm text-gray-500 mb-6">
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
        {/* Summary Cards - Top Row */}
        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2 gap-6 w-full">
          {budget.map((data: any) => (
            <Card
              key={data.title}
              loading={loading}
              className="rounded-lg hover:border-blue-300 transition-all shadow-sm hover:shadow-md"
            >
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-start mb-2">
                  <span className="flex flex-wrap text-sm font-medium"><RiCircleFill className="text-[5px] text-green-500 mt-2 mr-2" /> {data.title}</span>
                  {!loading && (
                    <Tag color={data.value > data.limit ? "red" : "green"} className="text-xs">
                      {data.value > data.limit ? "Over" : "Under"}
                    </Tag>
                  )}
                </div>
                <div className="mt-auto">
                  {!loading && (
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold">
                        {formatCurrency(data.value)}
                      </span>
                      <span className="text-sm">
                        of {formatCurrency(data.limit)}
                      </span>
                    </div>
                  )}
                  <Progress
                    percent={Math.min(100, (data.value / data.limit) * 100)}
                    strokeColor={data.value > data.limit ? "#f5222d" : "#52c41a"}
                    showInfo={false}
                    className="mt-3"
                  />
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
                <h2 className="flex flex-wrap text-lg font-semibold"><RiCircleFill className="text-[5px] text-green-500 mt-3 mr-2" /> Overall Budget Status</h2>
                <div className="flex items-center gap-2">
                  <span className="text-sm">Current Period:</span>
                  <DatePicker.RangePicker
                    size="small"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="text-sm">Total Budget</div>
                  <div className="text-2xl font-bold">
                    {formatCurrency(15000)}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm">Amount Spent</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {formatCurrency(7500)}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm">Remaining</div>
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(7500)}
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
        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 2xl:grid-cols-1 gap-6 w-full">
          <Card
            className="rounded-md shadow-md overflow-hidden transition-transform duration-300"
          >
            <div>
              <h2 className="flex flex-wrap text-sm font-semibold mb-2">
                <RiCircleFill className="text-[5px] text-green-500 mt-2 mr-2" /> Spending By Category
              </h2>
              <p className="flex flex-wrap">Current month breakdown</p>
              <LineChart
                data={trendData}
                title="Monthly Performance"
                color="#6a5acd"
              />
            </div>
          </Card>
        </div>
      </Row>
    </div>
  );
}
