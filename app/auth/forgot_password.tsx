import { LoadingOutlined, MailOutlined } from "@ant-design/icons";
import { Button, Form, Input, Alert, Image, Card, message } from "antd";
import { Link } from "@remix-run/react";
import { useState } from "react";
import { useAuth } from "./AuthContext";
import ClientOnly from "~/components/client-only";

export default function ForgotPasswordIndex() {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm<any>();
  const { resetPassword } = useAuth();

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const { error } = await resetPassword(values.email);
      message.success("Successful. Please check your email.");
      setLoading(false);
      if (!error) throw error;
    } catch (error) {
      setLoading(false);
      return { error };
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[url(/img/cfionline.jpg)] bg-cover bg-center bg-no-repeat bg-fixed">
      <ClientOnly>
        <Card className="w-full max-w-md shadow-xl rounded-lg overflow-hidden backdrop-blur-sm bg-white/90">
          <div className="px-8 py-8">
            {/* Logo Section */}
            <div className="flex flex-col items-center mb-8">
              <Image
                width={250}
                src="./img/cficoop.svg"
                alt="CFI Cooperative Logo"
                className="transition-all duration-300 hover:scale-105"
              />
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
              Reset Your Password
            </h1>

            {/* Info Alert */}
            <Alert
              className="mb-6 rounded-lg"
              message="Password Reset Instructions"
              description="Please enter your registered email address to receive a password reset link."
              type="info"
              showIcon
              closable
            />

            {/* Reset Form */}
            <Form
              name="forgot-password"
              onFinish={onFinish}
              layout="vertical"
            >
              {/* Email Field */}
              <Form.Item
                name="email"
                label="Email Address"
                rules={[
                  {
                    type: "email",
                    message: "Please enter a valid email address",
                  },
                  {
                    required: true,
                    message: "Please enter your email address",
                  },
                ]}
                className="mb-4"
              >
                <Input
                  prefix={<MailOutlined className="text-gray-400" />}
                  placeholder="your.email@example.com"
                  size="large"
                  className="py-2"
                />
              </Form.Item>

              {/* Information Text */}
              <p className="text-sm text-gray-600 mb-6">
                <span className="font-semibold">Note:</span> Accounts without a verified email address
                will not receive a password reset link. Please contact support if you need assistance.
              </p>

              {/* Submit Button */}
              <Form.Item className="mb-4">
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  size="large"
                  className="h-12 font-medium text-base"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <LoadingOutlined className="animate-spin mr-2" />
                      Sending Reset Link...
                    </span>
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>
              </Form.Item>

              {/* Divider */}
              <div className="flex items-center mb-4">
                <div className="flex-1 border-t border-gray-300"></div>
                <span className="px-3 text-gray-500">or</span>
                <div className="flex-1 border-t border-gray-300"></div>
              </div>

              {/* Back to Login */}
              <Link to="/">
                <Button
                  block
                  size="large"
                  className="h-12 font-medium"
                >
                  Return to Login
                </Button>
              </Link>
            </Form>
          </div>
        </Card>
      </ClientOnly>
    </div>
  );
}
