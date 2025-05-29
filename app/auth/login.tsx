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
        console.log("fp", data);
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
    <div className="flex flex-col h-screen items-center pt-40 bg-[url(/img/cfi-bills-payment.jpg)] bg-cover bg-no-repeat">
      <Card className="shadow-2xl">
        {/* {loading && (
          <div className="flex justify-center">
            <Spin />
          </div>
        )} */}
        <div className="flex flex-col items-center mb-6">
          <Image width={290} src="./img/cficoop.svg" />
        </div>
        <h1 className="flex flex-col items-center">
          <b>LOGIN</b>
        </h1>

        {errorAlert && (
          <Alert
            className="mt-2"
            message="Invalid email or password.."
            type="error"
            showIcon
          />
        )}

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
            <Input.Password
              prefix={<LockOutlined />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item>
            <Flex justify="space-between" align="center">
              <a href="/forgot-password">Forgot password</a>
            </Flex>
          </Form.Item>

          <Form.Item>
            <Button block type="primary" htmlType="submit">
              {loading && <LoadingOutlined className="animate-spin" />}
              {!loading && <p>Log in</p>}
            </Button>
            {/* or <a href="">Register now!</a> */}
          </Form.Item>
        </Form>
        {/* <div className="flex justify-center">
          <a href="/signup">Register Now</a>
        </div> */}
      </Card>
    </div>
  );
}
