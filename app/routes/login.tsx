import { LoadingOutlined, LockOutlined, UserOutlined } from "@ant-design/icons";
import {
  Alert,
  Button,
  Card,
  Checkbox,
  Form,
  Image,
  Input,
} from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "@remix-run/react";
import supabase from "~/utils/supabase.client";
// import ClientOnly from "~/components/client-only";
// import { useAuth } from "~/auth/AuthContext";

const obfuscate = (str: string): string => btoa(unescape(encodeURIComponent(str)));
const deobfuscate = (str: string): string => decodeURIComponent(escape(atob(str)));

export const handle = { hydrate: false };

export default function LoginIndex() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [errorAlert, setErrorAlert] = useState(false);
  // const { getUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    const obfuscatedPassword = localStorage.getItem("rememberedPassword");

    if (rememberedEmail) {
      form.setFieldsValue({
        email: rememberedEmail,
        remember: true,
      });

      if (obfuscatedPassword) {
        try {
          const rememberedPassword = deobfuscate(obfuscatedPassword);
          form.setFieldsValue({
            password: rememberedPassword,
          });
        } catch (error) {
          console.error("Failed to deobfuscate password:", error);
          localStorage.removeItem("rememberedPassword");
        }
      }
    }
  }, [form]);

  const onFinish = async (values: {
    email: string;
    password: string;
    remember: boolean;
  }) => {
    try {
      setLoading(true);
      setErrorAlert(false);

      if (values.remember) {
        localStorage.setItem("rememberedEmail", values.email);
        localStorage.setItem("rememberedPassword", obfuscate(values.password));
      } else {
        localStorage.removeItem("rememberedEmail");
        localStorage.removeItem("rememberedPassword");
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) throw error;
      if (data) {
        navigate("/landing-page");
      }
    } catch (error) {
      setErrorAlert(true);
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[url(/img/cfi-bills-payment.jpg)] bg-cover bg-center bg-no-repeat bg-fixed">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.28),_transparent_36%),linear-gradient(115deg,rgba(8,15,36,0.92),rgba(18,45,88,0.82),rgba(8,15,36,0.88))]" />
      <div className="absolute inset-0 bg-black/20" />

      {/* <ClientOnly> */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid w-full max-w-6xl gap-8 lg:grid-cols-[1.1fr_480px] lg:items-center">
          <section className="hidden text-white lg:block">
            <div className="max-w-xl">
              <p className="mb-5 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.32em] text-blue-100 backdrop-blur-sm">
                Secure Internal Access
              </p>
              <h1 className="max-w-lg text-5xl font-semibold leading-tight text-white">
                Manage cooperative operations from one reliable workspace.
              </h1>
              <p className="mt-6 max-w-lg text-base leading-7 text-blue-100/90">
                Access member services, billing, inventory, and workflow tools through a single
                protected portal designed for day-to-day operations.
              </p>

              <div className="mt-10 grid max-w-2xl grid-cols-3 gap-4">
                {[
                  { value: "24/7", label: "System availability" },
                  { value: "Centralized", label: "Operational control" },
                  { value: "Protected", label: "User authentication" },
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
                {/* <div className="rounded-sm border border-slate-200 bg-slate-50/80 px-5 py-4 shadow-sm">
                  <Image
                    width={170}
                    preview={false}
                    src="./img/cficoop.svg"
                    alt="CFI Cooperative Logo"
                  />
                </div> */}
                <p className="mt-6 text-xs font-semibold uppercase tracking-[0.28em] text-blue-700">
                  CFI Management System
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
                  Welcome back
                </h2>
                <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                  Sign in to continue to your dashboard and manage daily operations securely.
                </p>
              </div>

              {errorAlert && (
                <Alert
                  className="mb-6 rounded-sm border-red-200 bg-red-50"
                  message="Authentication failed"
                  description="The email or password you entered is incorrect. Verify your credentials and try again."
                  type="error"
                  showIcon
                  closable
                />
              )}

              <Form
                form={form}
                name="login"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                layout="vertical"
                className="space-y-5"
              >
                <Form.Item
                  name="email"
                  label={<span className="text-sm font-semibold text-slate-700">Email address</span>}
                  rules={[
                    {
                      required: true,
                      message: "Please enter your email address",
                    },
                    {
                      type: "email",
                      message: "Please enter a valid email address",
                    },
                  ]}
                >
                  <Input
                    prefix={<UserOutlined className="text-slate-400" />}
                    placeholder="your.email@example.com"
                    size="large"
                    className="h-12 rounded-xl border-slate-200 px-4 text-slate-700 shadow-sm transition-all hover:border-blue-400 focus:border-blue-500 focus:shadow-[0_0_0_4px_rgba(59,130,246,0.12)]"
                  />
                </Form.Item>

                <Form.Item
                  name="password"
                  label={<span className="text-sm font-semibold text-slate-700">Password</span>}
                  rules={[{ required: true, message: "Please enter your password" }]}
                >
                  <Input.Password
                    prefix={<LockOutlined className="text-slate-400" />}
                    placeholder="Enter your password"
                    size="large"
                    className="h-12 rounded-xl border-slate-200 px-4 text-slate-700 shadow-sm transition-all hover:border-blue-400 focus:border-blue-500 focus:shadow-[0_0_0_4px_rgba(59,130,246,0.12)]"
                  />
                </Form.Item>

                <div className="flex flex-col gap-3 pb-1 pt-1 sm:flex-row sm:items-center sm:justify-between">
                  <Form.Item name="remember" valuePropName="checked" className="mb-0">
                    <Checkbox className="text-sm text-slate-600">Remember me</Checkbox>
                  </Form.Item>

                  <a
                    href="/forgot-password"
                    className="text-sm font-semibold text-blue-700 transition-colors hover:text-blue-900"
                  >
                    Forgot password?
                  </a>
                </div>

                <Form.Item className="mb-0 pt-2">
                  <Button
                    type="primary"
                    htmlType="submit"
                    block
                    size="large"
                    className="h-12 rounded-xl border-0 bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 text-base font-semibold shadow-lg shadow-blue-900/20 transition-all hover:brightness-105"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <LoadingOutlined className="mr-2 animate-spin" />
                        Signing in...
                      </span>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </Form.Item>
              </Form>

              <div className="relative my-7">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-3 text-slate-400">Support</span>
                </div>
              </div>

              <div className="rounded-sm border border-slate-200 bg-slate-50 px-5 py-4 text-center text-sm text-slate-600">
                Don&apos;t have an account?{" "}
                <a
                  href="mailto:admin@cfi.coop"
                  className="font-semibold text-blue-700 transition-colors hover:text-blue-900"
                >
                  Contact Administrator
                </a>
              </div>
            </div>
          </Card>
        </div>
      </div>
      {/* </ClientOnly> */}
    </div>
  );
}
