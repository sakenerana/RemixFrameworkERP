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
} from "antd";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { AiOutlinePlus, AiOutlineSend } from "react-icons/ai";
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
              href: "/workflow",
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
          style={{ top: 20 }}
          width={400}
          title="Create Budget"
          closable={{ "aria-label": "Custom Close Button" }}
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          footer=""
        >
          <div>
            <Form
              className="mt-6"
              form={form}
              layout="vertical"
              onFinish={onFinish}
              initialValues={{
                notification: true,
                interests: ["sports", "music"],
              }}
            >
              <Row gutter={24}>
                <Col xs={24} sm={24}>
                  <Form.Item
                    label="Start of Date to End of Date"
                    name="date"
                    rules={[
                      {
                        required: true,
                        message: "Please input date!",
                      },
                    ]}
                  >
                    <RangePicker className="w-full" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col xs={24} sm={24}>
                  <Form.Item
                    label="Initial Balance"
                    name="initial_balance"
                    rules={[
                      {
                        required: true,
                        message: "Please enter initial balance!",
                      },
                    ]}
                  >
                    <InputNumber
                      type="number"
                      className="w-full"
                      addonBefore="₱"
                      defaultValue={0}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Divider />

              <Form.Item className="flex flex-wrap justify-end">
                <Button
                  onClick={onReset}
                  type="default"
                  //   loading={loading}
                  className="w-full sm:w-auto mr-4"
                  size="large"
                >
                  Reset
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={
                    <>
                      {loading && <LoadingOutlined className="animate-spin" />}
                      {!loading && <AiOutlineSend />}
                    </>
                  }
                  //   loading={loading}
                  className="w-full sm:w-auto"
                  size="large"
                >
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Modal>
      </div>
      <Alert
        message="You can see here all the status of overall budget status. Please check closely."
        type="info"
        showIcon
      />

      {/* THIS IS THE FIRST ROWN OF DASHBOARD */}

      <Row gutter={16} className="pt-5">
        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-2 gap-6 w-full">
          {budget.map((data) => (
            <>
              {loading && <Spin></Spin>}
              {!loading && (
                <Card
                  className="rounded-md shadow-md overflow-hidden transition-transform duration-300 hover:shadow-sm"
                >
                  <div className="flex flex-wrap justify-between">
                    <h2 className="text-sm font-semibold mb-2">{data.title}</h2>
                    <div className="text-red-500">
                      {/* <div className={getBudgetStatusColor(12, 150)}> */}
                      <span className="text-lg font-bold">
                        {formatCurrency(12)}
                      </span>
                      {/* <span className="text-sm font-normal text-muted-foreground text-gray-600">
                        {" "}
                        / {formatCurrency(150)}
                      </span> */}
                    </div>
                  </div>
                  {/* <span>Progress</span> */}
                  {/* <Progress
                    percent={getBudgetProgress(75, 150)}
                    status="active"
                  /> */}
                  {/* <p>Categories: </p> */}
                </Card>
              )}
            </>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 2xl:grid-cols-1 gap-6 w-full mt-6">
          {loading && <Spin></Spin>}
          {!loading && (
            <Card
              className="rounded-md shadow-md overflow-hidden transition-transform duration-300 hover:shadow-sm"
            >
              <div className="flex flex-wrap justify-between">
                <h2 className="text-sm font-semibold mb-2">Overall Budget</h2>
                <div className={getBudgetStatusColor(12, 150)}>
                  <span className="text-lg font-bold">
                    {formatCurrency(12)}
                  </span>
                  <span className="text-sm font-normal text-muted-foreground text-gray-600">
                    {" "}
                    / {formatCurrency(150)}
                  </span>
                </div>
              </div>
              <span>Progress</span>
              <Progress percent={getBudgetProgress(75, 150)} status="active" />
              {/* <p>Categories: </p> */}
            </Card>
          )}
        </div>
      </Row>

      {/* THIS IS THE BUDGET DASHBOARD */}

      <Row gutter={16} className="pt-5">
        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 2xl:grid-cols-1 gap-6 w-full">
          <Card
            className="rounded-md shadow-md overflow-hidden transition-transform duration-300"
          >
            <div>
              <h2 className="text-sm font-semibold mb-2">
                Spending By Category
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
