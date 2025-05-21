import { LoadingOutlined, MailOutlined } from "@ant-design/icons";
import { Button, Form, Input, Alert, Image, Card, message } from "antd";
import { Link } from "@remix-run/react";
import supabase from "~/utils/supabase.client";
import { useState } from "react";
import { useAuth } from "./AuthContext";

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
    <div className="flex flex-col h-screen items-center pt-40 bg-[url(/img/cfionline.jpg)] bg-cover bg-no-repeat">
      <Card className="shadow-xl">
        <div className="flex flex-col items-center mb-5">
          <Image width={290} src="./img/cficoop.svg" />
        </div>
        <h1 className="flex flex-col items-center">
          <b>FORGOT PASSWORD</b>
        </h1>

        <Form
          name="login"
          initialValues={{ remember: true }}
          style={{ maxWidth: 360, width: 360 }}
          onFinish={onFinish}
        >
          <Alert
            className="mb-5 mt-5"
            message="Please enter your active email to reset password."
            type="info"
            showIcon
          />

          <Form.Item
            name="email"
            rules={[
              {
                type: "email",
                message: "The input is not valid E-mail!",
              },
              {
                required: true,
                message: "Please input your E-mail!",
              },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>
          <p>
            <b>
              Usernames without an associated email address will not be emailed
              a password reset link.
            </b>
          </p>
          <br />
          <p className="pb-5">
            If you cannot remember your username, contact your administrator.
          </p>
          <Form.Item>
            <Button block type="primary" htmlType="submit">
              {loading && <LoadingOutlined className="animate-spin" />}
              {!loading && <p>Email Password Reset</p>}
            </Button>
            <p className="flex flex-col items-center pt-5 pb-5">or</p>
            <Link to="/">
              <Button block type="default">
                Go to Login
              </Button>
            </Link>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
