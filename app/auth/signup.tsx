import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import {
  Alert,
  Button,
  Card,
  Checkbox,
  Flex,
  Form,
  Image,
  Input,
  Spin,
} from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [succesAlert, setSuccessAlert] = useState(false);
  const [errorAlert, setErrorAlert] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    // e.preventDefault();
    try {
      setLoading(true);
      const { error } = await signUp(values.email, values.password);
      setSuccessAlert(true);
      navigate("/landing-page");
      if (error) throw error;
    } catch (error) {
      setSuccessAlert(false);
      setErrorAlert(true);
      setLoading(false);
      return { error };
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col h-screen items-center pt-40 bg-[url(/img/cfionline.jpg)] bg-cover bg-no-repeat">
      <Card>
        <div className="flex flex-col items-center mb-6">
          <Image width={290} src="./img/cficoop.svg" />
        </div>
        <h1 className="flex flex-col items-center">
          <b>REGISTRATION</b>
        </h1>

        {succesAlert && (
          <Alert
            className="mt-2"
            message="Successfully Registered."
            type="success"
            showIcon
          />
        )}
        {errorAlert && (
          <Alert
            className="mt-2"
            message="Invalid email or password minimum to 6 characters."
            type="error"
            showIcon
          />
        )}
        {loading ? (
          <div className="flex justify-center pt-30">
            <Spin />
          </div>
        ) : (
          <>
            <Form
              name="login"
              initialValues={{ remember: true }}
              style={{ maxWidth: 360, width: 360 }}
              onFinish={onFinish}
              className="p-7"
            >
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: "Please input your Email!" },
                ]}
              >
                <Input prefix={<UserOutlined />} placeholder="Username" />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  { required: true, message: "Please input your Password!" },
                ]}
              >
                <Input
                  prefix={<LockOutlined />}
                  type="password"
                  placeholder="Password"
                />
              </Form.Item>
              <p className="pb-5">
                If already registered please go to login. And make sure your
                email is active and valid.
              </p>
              <Form.Item>
                <Button block type="primary" htmlType="submit">
                  Signup
                </Button>
                <p className="flex flex-col items-center pt-5 pb-5">or</p>
                <Link to="/">
                  <Button block type="default">
                    Go to Login
                  </Button>
                </Link>
              </Form.Item>
            </Form>
          </>
        )}
      </Card>
    </div>
  );
};

export default Signup;
