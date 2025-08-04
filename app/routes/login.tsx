import { LoadingOutlined, LockOutlined, UserOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  Image,
  Card,
  Alert,
  Checkbox,
} from "antd";
import { useEffect, useState } from "react";
import supabase from "~/utils/supabase.client";
import { useNavigate } from "@remix-run/react";
import ClientOnly from "~/components/client-only";
// import { useAuth } from "~/auth/AuthContext";

// Obfuscation functions (put these outside your component)
const obfuscate = (str: string): string => btoa(unescape(encodeURIComponent(str)));
const deobfuscate = (str: string): string => decodeURIComponent(escape(atob(str)));

export const handle = { hydrate: false };
export default function LoginIndex() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [errorAlert, setErrorAlert] = useState(false);
  // const { getUser } = useAuth();
  const navigate = useNavigate();

  // Load remembered credentials on component mount
  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    const obfuscatedPassword = localStorage.getItem("rememberedPassword");

    if (rememberedEmail) {
      form.setFieldsValue({
        email: rememberedEmail,
        remember: true
      });

      // Only deobfuscate password if it exists
      if (obfuscatedPassword) {
        try {
          const rememberedPassword = deobfuscate(obfuscatedPassword);
          form.setFieldsValue({
            password: rememberedPassword
          });
        } catch (error) {
          console.error("Failed to deobfuscate password:", error);
          localStorage.removeItem("rememberedPassword");
        }
      }
    }
  }, [form]);

  const onFinish = async (values: { email: string; password: string; remember: boolean }) => {
    try {
      setLoading(true);

      // Handle remember me functionality
      if (values.remember) {
        localStorage.setItem("rememberedEmail", values.email);
        // Store obfuscated password
        localStorage.setItem("rememberedPassword", obfuscate(values.password));
      } else {
        localStorage.removeItem("rememberedEmail");
        localStorage.removeItem("rememberedPassword");
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (data) {
        navigate("/landing-page");
      }
      if (error) throw error;
    } catch (error) {
      setErrorAlert(true);
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 bg-[url(/img/cfi-bills-payment.jpg)] bg-cover bg-center bg-no-repeat bg-fixed">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-indigo-800/80"></div>

      <ClientOnly>
        <Card className="w-full max-w-md shadow-2xl rounded-xl overflow-hidden border-0 relative">
          {/* Decorative accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-400"></div>

          <div className="px-10 py-8 bg-white">
            {/* Logo Section */}
            <div className="flex flex-col items-center mb-8">
              <Image
                width={180}
                src="./img/cficoop.svg"
                alt="CFI Cooperative Logo"
                className="transition-all duration-300 hover:scale-105"
              />
              <h2 className="mt-4 text-2xl font-semibold text-gray-800">Enterprise Portal</h2>
            </div>

            {/* Error Message */}
            {errorAlert && (
              <Alert
                className="mb-6 rounded-lg border-red-200 bg-red-50"
                message="Authentication Failed"
                description="The email or password you entered is incorrect. Please verify your credentials and try again."
                type="error"
                showIcon
                closable
              />
            )}

            {/* Login Form */}
            <Form
              form={form}
              name="login"
              initialValues={{ remember: true }}
              onFinish={onFinish}
              layout="vertical"
              className="space-y-5"
            >
              {/* Email Field */}
              <Form.Item
                name="email"
                label={<span className="text-gray-700 font-medium">Email Address</span>}
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
              >
                <Input
                  prefix={<UserOutlined className="text-gray-400" />}
                  placeholder="your.email@example.com"
                  size="large"
                  className="py-3 px-4 rounded-lg border-gray-300 hover:border-blue-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                />
              </Form.Item>

              {/* Password Field */}
              <Form.Item
                name="password"
                label={<span className="text-gray-700 font-medium">Password</span>}
                rules={[{ required: true, message: "Please enter your password" }]}
              >
                <Input.Password
                  prefix={<LockOutlined className="text-gray-400" />}
                  placeholder="••••••••"
                  size="large"
                  className="py-3 px-4 rounded-lg border-gray-300 hover:border-blue-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                />
              </Form.Item>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between mb-2">
                <Form.Item name="remember" valuePropName="checked" className="mb-0">
                  <Checkbox className="text-gray-600">Remember me</Checkbox>
                </Form.Item>

                <a
                  href="/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-800 transition-colors font-medium"
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
                  className="h-12 font-medium text-base rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-md"
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

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Need help?</span>
              </div>
            </div>

            {/* Contact Admin */}
            <div className="text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <a
                href="mailto:admin@cfi.coop"
                className="font-medium text-blue-600 hover:text-blue-800 transition-colors"
              >
                Contact Administrator
              </a>
            </div>
          </div>
        </Card>
      </ClientOnly>
    </div>
  );
}
