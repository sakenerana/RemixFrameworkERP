import { HomeOutlined, LoadingOutlined } from "@ant-design/icons";
import { useNavigate } from "@remix-run/react";
import {
  Breadcrumb,
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Row,
  Select,
  Space,
  Spin,
} from "antd";
import { useState } from "react";
import { AiOutlineArrowLeft, AiOutlineSend } from "react-icons/ai";
import { FcRefresh } from "react-icons/fc";
import { Link } from "react-router-dom";

interface DataType {
  id: number;
  title: string;
  body: string;
  userId?: number; // Optional property
}

export default function CreateAccounts() {
  const [data, setData] = useState<DataType[]>([]);
  const [form] = Form.useForm<DataType>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const onFinish = (values: DataType) => {
    setLoading(true);
    console.log("Form values:", values);
    // Simulate API call
    setTimeout(
      () => {
        message.success("Form submitted successfully!");
        setLoading(false);
      },
      1500
    );
  };

  const onReset = () => {
    Modal.confirm({
      title: "Confirm Reset",
      content: "Are you sure you want to reset all form fields?",
      okText: "Reset",
      cancelText: "Cancel",
      onOk: () => form.resetFields(),
    });
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
              title: "Create Account",
            },
          ]}
        />
        <Space direction="horizontal">
          <Space wrap>
            <Button onClick={onReset} icon={<FcRefresh />} type="default">
              Reset Form
            </Button>
          </Space>
          <Space wrap>
            <Link to={"/budget/accounts"}>
              <Button icon={<AiOutlineArrowLeft />} type="primary">
                Back
              </Button>
            </Link>
          </Space>
        </Space>
      </div>
      <div className="bg-gray-200 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Card
            title={
              <span className="text-xl font-semibold">
                Add New Account - Enter the details for your new financial
                account.
              </span>
            }
            bordered={false}
            className="shadow-lg"
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              initialValues={{
                notification: true,
                interests: ["sports", "music"],
              }}
            >
              <Row gutter={24}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Accout Name"
                    name="account_name"
                    rules={[
                      {
                        required: true,
                        message: "Please input account name!",
                      },
                    ]}
                  >
                    <Input placeholder="e.g. Checking Account" />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Account Type"
                    name="account_type"
                    rules={[
                      {
                        required: true,
                        message: "Please select account type!",
                      },
                    ]}
                  >
                    <Select
                      placeholder="Select gender"
                      options={[
                        { value: "jack", label: "Jack" },
                        { value: "lucy", label: "Lucy" },
                        { value: "Yiminghe", label: "yiminghe" },
                      ]}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col xs={24} sm={12}>
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

              <Form.Item>
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
          </Card>
        </div>
      </div>
    </div>
  );
}
