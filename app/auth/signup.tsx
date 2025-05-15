import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { Button, Card, Checkbox, Flex, Form, Image, Input, Spin } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();

  const onFinish = async (values: any) => {
    console.log("Received values of form: ", values);

    // e.preventDefault();
    setLoading(true);
    await signUp(values.email, values.password);
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-screen items-center pt-40 bg-gradient-to-r from-indigo-950 to-indigo-900">
      <Card>
        <div className="flex flex-col items-center mb-6">
          <Image width={290} src="./img/cficoop.svg" />
        </div>
        <h1 className="flex flex-col items-center">
          <b>REGISTRATION</b>
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
            <Button block type="primary" htmlType="submit">
              Signup
            </Button>
            {/* or <a href="">Register now!</a> */}
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Signup;
