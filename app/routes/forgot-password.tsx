import { ArrowLeftOutlined, LoadingOutlined, MailOutlined } from "@ant-design/icons";
import { Button, Card, Form, Image, Input, message } from "antd";
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
      if (error) throw error;

      message.success("Successful. Please check your email.");
      form.resetFields();
    } catch (error) {
      return { error };
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[url(/img/cfionline.jpg)] bg-cover bg-center bg-no-repeat bg-fixed">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.28),_transparent_36%),linear-gradient(115deg,rgba(8,15,36,0.92),rgba(18,45,88,0.82),rgba(8,15,36,0.88))]" />
      <div className="absolute inset-0 bg-black/20" />

      {/* <ClientOnly> */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid w-full max-w-6xl gap-8 lg:grid-cols-[1.05fr_480px] lg:items-center">
          <section className="hidden text-white lg:block">
            <div className="max-w-xl">
              <p className="mb-5 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.32em] text-blue-100 backdrop-blur-sm">
                Account Recovery
              </p>
              <h1 className="max-w-lg text-5xl font-semibold leading-tight text-white">
                Restore access without disrupting your workflow.
              </h1>
              <p className="mt-6 max-w-lg text-base leading-7 text-blue-100/90">
                Request a secure reset link and continue managing operations, member services,
                and internal records from the same protected environment.
              </p>

              <div className="mt-10 grid max-w-2xl grid-cols-3 gap-4">
                {[
                  { value: "Email", label: "Reset instructions" },
                  { value: "Secure", label: "Recovery process" },
                  { value: "Fast", label: "Return to access" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-sm border border-white/15 bg-white/10 p-5 backdrop-blur-sm"
                  >
                    <p className="text-2xl font-semibold text-white">{item.value}</p>
                    <p className="mt-2 text-sm leading-6 text-blue-100/85">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <Card className="overflow-hidden rounded-sm border border-white/20 bg-white/95 shadow-[0_24px_80px_rgba(15,23,42,0.35)] backdrop-blur-xl">

            <div className="px-6 py-7 sm:px-10 sm:py-9">
              <div className="mb-8 flex flex-col items-center text-center">
                <div className="rounded-sm border border-slate-200 bg-slate-50/80 px-5 py-4 shadow-sm">
                  <Image
                    width={170}
                    preview={false}
                    src="./img/cficoop.svg"
                    alt="CFI Cooperative Logo"
                  />
                </div>
                <p className="mt-6 text-xs font-semibold uppercase tracking-[0.28em] text-blue-700">
                  CFI Management System
                </p>
                <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
                  Reset your password
                </h1>
                <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                  Enter your registered email address and we&apos;ll send password reset
                  instructions.
                </p>
              </div>

              <Form
                form={form}
                name="forgot-password"
                onFinish={onFinish}
                layout="vertical"
                className="space-y-5"
              >
                <Form.Item
                  name="email"
                  label={<span className="text-sm font-semibold text-slate-700">Registered email</span>}
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
                    prefix={<MailOutlined className="text-slate-400" />}
                    placeholder="your.email@example.com"
                    size="large"
                    className="h-12 rounded-sm border-slate-200 px-4 text-slate-700 shadow-sm transition-all hover:border-blue-400 focus:border-blue-500 focus:shadow-[0_0_0_4px_rgba(59,130,246,0.12)]"
                  />
                </Form.Item>

                <div className="rounded-sm border border-slate-200 bg-slate-50 px-5 py-4 text-sm leading-6 text-slate-600">
                  <span className="font-semibold text-slate-800">Security note:</span> Accounts
                  without verified email addresses will not receive reset links. Contact{" "}
                  <a
                    href="mailto:support@cfi.coop"
                    className="font-semibold text-blue-700 transition-colors hover:text-blue-900"
                  >
                    support@cfi.coop
                  </a>{" "}
                  for assistance.
                </div>

                <Form.Item className="mb-0 pt-2">
                  <Button
                    type="primary"
                    htmlType="submit"
                    block
                    size="large"
                    className="h-12 rounded-sm border-0 bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 text-base font-semibold shadow-lg shadow-blue-900/20 transition-all hover:brightness-105"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <LoadingOutlined className="mr-2 animate-spin" />
                        Sending instructions...
                      </span>
                    ) : (
                      "Send Reset Link"
                    )}
                  </Button>
                </Form.Item>

                <div className="relative my-7">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-3 text-slate-400">Back to access</span>
                  </div>
                </div>

                <Link to="/">
                  <Button
                    block
                    size="large"
                    className="h-12 rounded-sm border-slate-200 font-semibold text-slate-700 shadow-sm transition-all hover:border-slate-300 hover:text-slate-900"
                  >
                    <ArrowLeftOutlined className="mr-2" />
                    Return to Login
                  </Button>
                </Link>
              </Form>
            </div>
          </Card>
        </div>
      </div>
      {/* </ClientOnly> */}
    </div>
  );
}
