import {
  LoadingOutlined,
  LogoutOutlined,
  QuestionOutlined,
  SwapOutlined,
  UnlockOutlined,
} from "@ant-design/icons";
import { useNavigate } from "@remix-run/react";
import { Alert, Button, Card, Col, Drawer, Form, Input, List, message, Modal, Row, Space, Spin } from "antd";
import { useState } from "react";
import { AiOutlineSend, AiOutlineUnlock } from "react-icons/ai";
import { useAuth } from "~/auth/AuthContext";
import { supabase } from "~/lib/supabase";

// types.ts (or in your component file)
interface ChildComponentProps {
  onSendData: (data: any) => void; // Explicit function type
}

const ChildComponent: React.FC<ChildComponentProps> = ({ onSendData }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const { signOut, getUser } = useAuth();
  const navigate = useNavigate();

  const onCancel = () => {
    Modal.confirm({
      title: "Cancel Change Password",
      content: "Are you sure you want to cancel this transcation?",
      okText: "Yes",
      cancelText: "Cancel",
      onOk: () => setOpen(false),
    });
  };

  const showDrawer = () => {
    setOpen(true);
    onSendData(false);
  };

  const data = [
    {
      title: "Timezone:",
      description: "US/Pacific",
    },
    {
      title: "Table Storage",
      description: "500MB",
    },
    {
      title: "Database Driver",
      description: "mysql",
    },
    {
      title: "Version",
      description: "0.0.1",
    },
  ];

  const handleSignout = async () => {
    setLoading(true);
    await signOut();
    setLoading(false);
    navigate("/");
  };

  const handleLandingPage = async () => {
    setLoading(true);
    navigate("/landing-page");
    setLoading(false);
  };

  const onFinish = async (event: any) => {
    try {
      const values = await form.validateFields();
      console.log(values)

      setLoading(true);
      const { error } = await supabase.auth.updateUser({
        password: values.password2,
      });
      if (error) throw message.error(error.message);

      message.success("Password reset successfully");
      setLoading(false);
      setOpen(false);
      form.resetFields();
    } catch (error) {
      message.error("Error");
    }
  }

  return (
    <Row>
      {loading && <Spin className="mb-8" />}

      <Col span={24}>
        <div className="flex flex-wrap gap-6">
          <Card
            hoverable // Adds a hover effect
            onClick={showDrawer}
            style={{
              width: 160,
              textAlign: "center",
              cursor: "pointer",
            }}
          >
            <Space direction="vertical" size={16}>
              <UnlockOutlined style={{ fontSize: "32px", color: "#1890ff" }} />
              <p>Change Password</p>
            </Space>
            <Drawer
              title="Create a new password"
              width={420}
              open={open}
              closeIcon={<AiOutlineUnlock />}
              styles={{
                body: {
                  paddingBottom: 80,
                },
              }}
            >
              <Form
                form={form}
                name="dependencies"
                autoComplete="off"
                style={{ maxWidth: 600 }}
                layout="vertical"
                onFinish={onFinish}
              >
                <Alert className="mb-6" message="Input your new password and confirm password." type="info" showIcon />

                <Form.Item label="New Password" name="password" rules={[{ required: true }]}>
                  <Input.Password />
                </Form.Item>

                {/* Field */}
                <Form.Item
                  label="Confirm Password"
                  name="password2"
                  dependencies={['password']}
                  rules={[
                    {
                      required: true,
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('The new password that you entered do not match!'));
                      },
                    }),
                  ]}
                >
                  <Input.Password />
                </Form.Item>

                <Form.Item className="flex flex-wrap justify-end">
                  <Button
                    onClick={onCancel}
                    type="default"
                    //   loading={loading}
                    className="w-full sm:w-auto mr-4"
                    size="large"
                  >
                    Cancel
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
            </Drawer>
          </Card>

          <Card
            hoverable // Adds a hover effect
            onClick={handleLandingPage}
            style={{
              width: 160,
              textAlign: "center",
              cursor: "pointer",
            }}
          >
            <Space direction="vertical" size={16}>
              <SwapOutlined style={{ fontSize: "32px", color: "#1890ff" }} />
              <p>Landing Page</p>
            </Space>
          </Card>

          <Card
            hoverable // Adds a hover effect
            onClick={handleSignout}
            style={{
              width: 160,
              textAlign: "center",
              cursor: "pointer",
            }}
          >
            <Space direction="vertical" size={16}>
              <LogoutOutlined style={{ fontSize: "32px", color: "#f70000" }} />
              <p>Sign-Out</p>
            </Space>
          </Card>
        </div>
      </Col>
      <Col span={24}>
        <List
          className="mt-6"
          itemLayout="horizontal"
          dataSource={data}
          renderItem={(item, index) => (
            <List.Item>
              <List.Item.Meta
                avatar={<QuestionOutlined />}
                title={item.title}
                description={item.description}
              />
            </List.Item>
          )}
        />
      </Col>
    </Row>
  );
}

export default ChildComponent;
