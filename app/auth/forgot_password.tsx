import React from 'react';
import { MailOutlined } from '@ant-design/icons';
import { Button, Form, Input, Flex } from 'antd';

export default function ForgotPasswordIndex() {

    const onFinish = (values: any) => {
        console.log('Received values of form: ', values);
    };

    return (
        <div className='flex flex-col items-center pt-40'>
            <h1 className='flex flex-col items-center'>FORGOT PASSWORD</h1>
            <Form
                name="login"
                initialValues={{ remember: true }}
                style={{ maxWidth: 360, width: 360 }}
                onFinish={onFinish}
                className='p-7'
            >
                <Form.Item
                    name="email"
                    rules={[
                        {
                            type: 'email',
                            message: 'The input is not valid E-mail!',
                        },
                        {
                            required: true,
                            message: 'Please input your E-mail!',
                        },
                    ]}
                >
                    <Input prefix={<MailOutlined />} placeholder="Email" />
                </Form.Item>
                <p><b>Usernames without an associated email address will not be emailed a password reset link.</b></p><br/>
                <p className='pb-5'>If you cannot remember your username, contact your administrator.</p>
                <Form.Item>
                    <Button block type="primary" htmlType="submit">
                        Email Password Reset
                    </Button>
                    {/* or <a href="">Register now!</a> */}
                </Form.Item>
            </Form>
        </div>
    );
}

