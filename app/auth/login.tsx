import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, Flex, Image, Card, Spin } from "antd";
import { useState } from "react";
import supabase from "~/utils/supabase.client";
import { useAuth } from "./AuthContext";
import { useNavigate } from "@remix-run/react";

export default function LoginIndex() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState();
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    // e.preventDefault();
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
        phone: "",
      });
      navigate("/landing-page");
      if (error) throw error;
      console.log("account signin");
      setLoading(true);
    } catch (error) {
      setLoading(false);
      return { error };
    }
  };

  return (
    <div className="flex flex-col h-screen items-center pt-40 bg-gradient-to-r from-indigo-950 to-indigo-900">
      <Card>
        {loading && (
          <div className="flex justify-center">
            <Spin />
          </div>
        )}
        <div className="flex flex-col items-center mb-6">
          <Image width={290} src="./img/cficoop.svg" />
        </div>
        <h1 className="flex flex-col items-center">
          <b>LOGIN</b>
        </h1>
        <Form
          name="login"
          initialValues={{ remember: true }}
          style={{ maxWidth: 360, width: 360 }}
          onFinish={onFinish}
          className="p-7"
        >
          <Form.Item
            name="email"
            rules={[{ required: true, message: "Please input your Email!" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Username" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your Password!" }]}
          >
            <Input
              prefix={<LockOutlined />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item>
            <Flex justify="space-between" align="center">
              {/* <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item> */}
              <a href="/forgot-password">Forgot password</a>
            </Flex>
          </Form.Item>

          <Form.Item>
            <Button block type="primary" htmlType="submit">
              Log in
            </Button>
            {/* or <a href="">Register now!</a> */}
          </Form.Item>
        </Form>
        <div className="flex justify-center">
          <a href="/signup">Register Now</a>
        </div>
      </Card>
    </div>
  );
}
