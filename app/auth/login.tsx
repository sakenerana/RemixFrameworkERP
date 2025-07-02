import { LoadingOutlined, LockOutlined, UserOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  Flex,
  Image,
  Card,
  Alert,
} from "antd";
import { useState } from "react";
import supabase from "~/utils/supabase.client";
import { useAuth } from "./AuthContext";
import { useNavigate } from "@remix-run/react";

export default function LoginIndex() {
  const [loading, setLoading] = useState(false);
  const [errorAlert, setErrorAlert] = useState(false);
  const { getUser } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    // let user = await supabase.auth.getUser();
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
        phone: "",
      });
      if (data) {
        navigate("/landing-page");
        // console.log("fp", data.user?.id);
      }
      if (error) throw error;
      setLoading(true);
    } catch (error) {
      navigate("/");
      setLoading(false);
      setErrorAlert(true);
      return { error };
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 bg-[url(/img/cfi-bills-payment.jpg)] bg-cover bg-center bg-no-repeat bg-fixed">
      <Card className="w-full max-w-md shadow-xl rounded-lg overflow-hidden backdrop-blur-sm bg-white/90">
        <div className="px-8 py-6">
          {/* Logo Section */}
          <div className="flex flex-col items-center mb-8">
            <Image
              width={250}
              src="./img/cficoop.svg"
              alt="CFI Cooperative Logo"
              className="transition-all duration-300 hover:scale-105"
            />
          </div>

          {/* Error Message */}
          {errorAlert && (
            <Alert
              className="mb-6 rounded-lg"
              message="Invalid credentials"
              description="The email or password you entered is incorrect. Please try again."
              type="error"
              showIcon
              closable
            />
          )}

          {/* Login Form */}
          <Form
            name="login"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            layout="vertical"
          >
            {/* Email Field */}
            <Form.Item
              name="email"
              label="Email Address"
              rules={[
                {
                  required: true,
                  message: "Please enter your email address"
                },
                {
                  type: 'email',
                  message: 'Please enter a valid email address'
                }
              ]}
              className="mb-4"
            >
              <Input
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder="your.email@example.com"
                size="large"
                className="py-2"
              />
            </Form.Item>

            {/* Password Field */}
            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: "Please enter your password" }]}
              className="mb-1"
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="••••••••"
                size="large"
                className="py-2"
              />
            </Form.Item>

            {/* Forgot Password Link */}
            <div className="flex justify-end mb-6">
              <a
                href="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <Form.Item className="mb-0">
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
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </Button>
            </Form.Item>
          </Form>

          {/* Optional: Registration Link */}
          <div className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <span
              className="font-medium text-blue-600 hover:text-blue-800 transition-colors"
            >
              Contact Administrator
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}
