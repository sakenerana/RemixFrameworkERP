import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, Flex, Image } from 'antd';

export default function LoginIndex() {

  const onFinish = (values: string) => {
    console.log('Received values of form: ', values);
  };

  return (
    <div className='flex flex-col items-center pt-40'>
      <div>
        <Image width={120} src="/public/remix-logo.png" />
      </div>
      <h1 className='flex flex-col items-center'>INVENTORY</h1>
      <Form
        name="login"
        initialValues={{ remember: true }}
        style={{ maxWidth: 360, width: 360 }}
        onFinish={onFinish}
        className='p-7'
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: 'Please input your Username!' }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Username" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please input your Password!' }]}
        >
          <Input prefix={<LockOutlined />} type="password" placeholder="Password" />
        </Form.Item>
        <Form.Item>
          <Flex justify="space-between" align="center">
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
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
    </div>
  );
}

