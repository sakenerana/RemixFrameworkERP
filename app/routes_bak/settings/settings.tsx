import {
  CloseOutlined,
  LoadingOutlined,
  LogoutOutlined,
  QuestionOutlined,
  SwapOutlined,
  UnlockOutlined,
} from "@ant-design/icons";
import { useNavigate } from "@remix-run/react";
import { Alert, Button, Card, Col, Drawer, Form, Input, List, message, Modal, Row, Space, Spin } from "antd";
import { useState, useEffect } from "react";
import { AiOutlineSend, AiOutlineUnlock } from "react-icons/ai";
import { useAuth } from "~/auth/AuthContext";
import { supabase } from "~/lib/supabase";

interface ChildComponentProps {
  onSendData: (data: any) => void;
}

const Setting: React.FC<ChildComponentProps> = ({ onSendData }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const { signOut, getUser } = useAuth();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile viewport
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const onCancel = () => {
    Modal.confirm({
      title: "Cancel Change Password",
      content: "Are you sure you want to cancel this transaction?",
      okText: "Yes",
      cancelText: "Cancel",
      onOk: () => {
        setLoading(false);
        setOpen(false);
        form.resetFields();
      },
    });
  };

  const showDrawer = () => {
    setOpen(true);
    onSendData(false);
  };

  const data = [
    { title: "Timezone:", description: "US/Pacific" },
    { title: "Table Storage", description: "500MB" },
    { title: "Database Driver", description: "mysql" },
    { title: "Version", description: "0.0.1" },
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
      setLoading(false);
      message.error("Error");
    }
  }

  return (
    <Row gutter={[16, 16]}>
      {loading && <Spin className="mb-8" />}

      <Col span={24}>
        <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
          {/* Change Password Card */}
          <Card
            hoverable
            onClick={showDrawer}
            style={{
              width: isMobile ? '100%' : 160,
              textAlign: "center",
              cursor: "pointer",
              marginBottom: isMobile ? 16 : 0,
            }}
            bodyStyle={{ padding: isMobile ? '16px' : '12px' }}
          >
            <Space direction="vertical" size={16}>
              <UnlockOutlined style={{ fontSize: "32px", color: "#1890ff" }} />
              <p className="m-0">Change Password</p>
            </Space>
          </Card>

          {/* Landing Page Card */}
          <Card
            hoverable
            onClick={handleLandingPage}
            style={{
              width: isMobile ? '100%' : 160,
              textAlign: "center",
              cursor: "pointer",
              marginBottom: isMobile ? 16 : 0,
            }}
            bodyStyle={{ padding: isMobile ? '16px' : '12px' }}
          >
            <Space direction="vertical" size={16}>
              <SwapOutlined style={{ fontSize: "32px", color: "#1890ff" }} />
              <p className="m-0">Landing Page</p>
            </Space>
          </Card>

          {/* Sign Out Card */}
          <Card
            hoverable
            onClick={handleSignout}
            style={{
              width: isMobile ? '100%' : 160,
              textAlign: "center",
              cursor: "pointer",
            }}
            bodyStyle={{ padding: isMobile ? '16px' : '12px' }}
          >
            <Space direction="vertical" size={16}>
              <LogoutOutlined style={{ fontSize: "32px", color: "#f70000" }} />
              <p className="m-0">Sign Out</p>
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
                title={<span className={isMobile ? "text-sm" : ""}>{item.title}</span>}
                description={<span className={isMobile ? "text-sm" : ""}>{item.description}</span>}
              />
            </List.Item>
          )}
        />
      </Col>

      {/* Password Change Drawer */}
      <Drawer
        title={
          <div className="flex items-center">
            <AiOutlineUnlock className="mr-2" />
            <span>Create a new password</span>
          </div>
        }
        width={isMobile ? '100%' : 420}
        open={open}
        onClose={onCancel}
        closeIcon={<CloseOutlined />}
        styles={{
          body: {
            paddingBottom: 80,
            paddingTop: 20,
          },
          header: {
            padding: isMobile ? '12px 16px' : '16px 24px',
            borderBottom: '1px solid #f0f0f0',
          }
        }}
      >
        <Form
          form={form}
          name="passwordChange"
          autoComplete="off"
          layout="vertical"
          onFinish={onFinish}
        >
          <Alert
            className="mb-6"
            message="Password Requirements"
            description="Input your new password and confirm password. Minimum 8 characters with at least one number and special character."
            type="info"
            showIcon
          />

          <Form.Item
            label="New Password"
            name="password"
            rules={[
              { required: true, message: 'Please input your new password' },
              { min: 8, message: 'Password must be at least 8 characters' },
              { pattern: /^(?=.*[0-9])(?=.*[!@#$%^&*])/, message: 'Include at least one number and special character' }
            ]}
          >
            <Input.Password size={isMobile ? "large" : "middle"} placeholder="Enter new password" />
          </Form.Item>

          <Form.Item
            label="Confirm Password"
            name="password2"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm your password' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The passwords do not match!'));
                },
              }),
            ]}
          >
            <Input.Password size={isMobile ? "large" : "middle"} placeholder="Confirm new password" />
          </Form.Item>

          <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8">
            <Button
              onClick={onCancel}
              type="default"
              size={isMobile ? "large" : "middle"}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              size={isMobile ? "large" : "middle"}
              className="w-full sm:w-auto"
              loading={loading}
              icon={!loading && <AiOutlineSend className="ml-1" />}
            >
              {loading ? 'Updating...' : 'Update Password'}
            </Button>
          </div>
        </Form>
      </Drawer>
    </Row>
  );
}

export default Setting;