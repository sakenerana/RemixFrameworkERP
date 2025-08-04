import { ArrowLeftOutlined, LoadingOutlined, MailOutlined } from "@ant-design/icons";
import { Button, Form, Input, Alert, Image, Card, message } from "antd";
import { Link } from "@remix-run/react";
import { useState } from "react";
// import ClientOnly from "~/components/client-only";
import { useAuth } from "~/auth/AuthContext";

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
    <div className="min-h-screen flex items-center justify-center p-6 bg-[url(/img/cfionline.jpg)] bg-cover bg-center bg-no-repeat bg-fixed">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 to-indigo-800/80"></div>

      {/* <ClientOnly> */}
      <Card className="w-full max-w-md shadow-2xl rounded-xl overflow-hidden border-0 relative">
        {/* Decorative accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 to-cyan-400"></div>

        <div className="px-10 py-8 bg-white">
          {/* Logo Section */}
          <div className="flex flex-col items-center mb-6">
            <Image
              width={180}
              src="./img/cficoop.svg"
              alt="CFI Cooperative Logo"
              className="transition-all duration-300 hover:scale-105"
            />
            <h2 className="mt-3 text-xl font-medium text-gray-600">Enterprise Portal</h2>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
            Reset Your Password
          </h1>
          <p className="text-center text-gray-500 mb-6">
            Enter your email to receive reset instructions
          </p>

          {/* Reset Form */}
          <Form
            name="forgot-password"
            onFinish={onFinish}
            layout="vertical"
            className="space-y-4"
          >
            {/* Email Field */}
            <Form.Item
              name="email"
              label={<span className="text-gray-700 font-medium">Registered Email</span>}
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
            >
              <Input
                prefix={<MailOutlined className="text-gray-400" />}
                placeholder="your.email@example.com"
                size="large"
                className="py-3 px-4 rounded-lg border-gray-300 hover:border-blue-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
              />
            </Form.Item>

            {/* Information Text */}
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 mb-4">
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-gray-700">Security Note:</span> Accounts without verified email addresses won't receive reset links. Contact <a href="mailto:support@cfi.coop" className="text-blue-600 hover:underline">support@cfi.coop</a> for assistance.
              </p>
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
                    Sending Instructions...
                  </span>
                ) : (
                  "Send Reset Link"
                )}
              </Button>
            </Form.Item>

            {/* Divider */}
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Alternative Options</span>
              </div>
            </div>

            {/* Back to Login */}
            <Link to="/">
              <Button
                block
                size="large"
                className="h-12 font-medium border-gray-300 hover:border-gray-400 text-gray-700"
              >
                <ArrowLeftOutlined className="mr-2" />
                Return to Login
              </Button>
            </Link>
          </Form>
        </div>
      </Card>
      {/* </ClientOnly> */}
    </div>
  );
}
