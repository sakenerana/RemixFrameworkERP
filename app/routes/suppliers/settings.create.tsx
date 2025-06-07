import { HomeOutlined, LoadingOutlined } from "@ant-design/icons";
import { Link } from "@remix-run/react";
import { Breadcrumb, Button, Col, Divider, Form, Input, message, Modal, Row } from "antd";
import { useMemo, useState } from "react";
import { AiOutlinePhone, AiOutlineRollback, AiOutlineSend } from "react-icons/ai";
import { SupplierService } from "~/services/supplier.service";
import { Supplier } from "~/types/supplier.type";

export default function CreateSuppliers() {
    const [form] = Form.useForm<Supplier>();
    const [loading, setLoading] = useState(false);
    const [isEditMode, setIsEditMode] = useState(true);
    const [editingId, setEditingId] = useState<number | null>(null);

    useMemo(() => {
        form.resetFields();
    }, []);

    const onReset = () => {
        Modal.confirm({
            title: "Confirm Reset",
            content: "Are you sure you want to reset all form fields?",
            okText: "Reset",
            cancelText: "Cancel",
            onOk: () => form.resetFields(),
        });
    };

    // Create or Update record
    const onFinish = async () => {
        try {

            const values = await form.validateFields();

            // Include your extra field
            const allValues = {
                ...values,
                status_id: 1,
            };

            if (editingId) {
                // Update existing record
                const { error } = await SupplierService.updatePost(editingId, values);

                if (error) throw message.error(error.message);
                message.success("Record updated successfully");
            } else {
                // Create new record
                setLoading(true);
                const { error } = await SupplierService.createPost(allValues);

                if (error) throw message.error(error.message);
                message.success("Record created successfully");
            }

            setLoading(false);
            form.resetFields();
            setEditingId(null);
        } catch (error) {
            message.error("Error");
        }
    };

    return (
        <div>
            <div className="flex pb-5 justify-between">
                <Breadcrumb
                    items={[
                        {
                            href: "/inventory",
                            title: <HomeOutlined />,
                        },
                        {
                            title: "Settings",
                        },
                        {
                            title: "Suppliers",
                        },
                        {
                            title: "Create",
                        },
                    ]}
                />
                <Link to={'/inventory/settings/suppliers'}>
                    <Button icon={<AiOutlineRollback />}>Back</Button>
                </Link>
            </div>

            <Form
                className="p-5 bg-gray-50"
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{
                    notification: true,
                    interests: ["sports", "music"],
                }}
            >
                <Row gutter={24}>
                    <Col xs={24} sm={8}>
                        <Form.Item
                            label="First Name"
                            name="first_name"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input account first name!",
                                },
                            ]}
                        >
                            <Input placeholder="First Name" />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={8}>
                        <Form.Item
                            label="Middle Name"
                            name="middle_name"
                        // rules={[
                        //   {
                        //     required: true,
                        //     message: "Please input middle name!",
                        //   },
                        // ]}
                        >
                            <Input placeholder="Middle Name" />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={8}>
                        <Form.Item
                            label="Last Name"
                            name="last_name"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input last name!",
                                },
                            ]}
                        >
                            <Input placeholder="Last Name" />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={12}>
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input email!",
                                },
                            ]}
                        >
                            <Input placeholder="Email" />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={12}>
                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input password!",
                                },
                            ]}
                        >
                            <Input.Password placeholder="Password" />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={12}>
                        <Form.Item
                            label="Phone No."
                            name="phone"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input phone number!",
                                },
                            ]}
                        >
                            <Input
                                type="number"
                                prefix={<AiOutlinePhone />}
                                placeholder="Phone"
                            />
                        </Form.Item>
                    </Col>

                </Row>

                <Divider />

                <Form.Item className="flex flex-wrap justify-end">
                    <Button
                        onClick={onReset}
                        type="default"
                        //   loading={loading}
                        className="w-full sm:w-auto mr-4"
                        size="large"
                    >
                        Reset
                    </Button>
                    <Button
                        type="primary"
                        htmlType="submit"
                        icon={
                            <>
                                {loading && <LoadingOutlined className="animate-spin" />}
                                {!loading && <AiOutlineSend />}
                            </>
                        }
                        className="w-full sm:w-auto"
                        size="large"
                    >
                        {isEditMode && <p>Update</p>}
                        {!isEditMode && <p>Submit</p>}
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}