import { HomeOutlined, LoadingOutlined } from "@ant-design/icons";
import { Link, useParams } from "@remix-run/react";
import { Breadcrumb, Button, Col, DatePicker, Divider, Form, Input, message, Modal, Row, Select } from "antd";
import { useMemo, useState } from "react";
import { AiOutlinePhone, AiOutlineRollback, AiOutlineSend } from "react-icons/ai";
import { LicenseService } from "~/services/license.service";
import { License } from "~/types/license.type";
const { TextArea } = Input;

export default function CreateLicense() {
    const { id } = useParams();
    const [form] = Form.useForm<License>();
    const [loading, setLoading] = useState(false);
    const [isEditMode, setIsEditMode] = useState(true);
    const [editingId, setEditingId] = useState<any | null>(id);
    const [isTitle, setIsTitle] = useState('');

    useMemo(() => {
        if (id) {
            setIsTitle("Update License");
            setIsEditMode(true);
        } else {
            setIsTitle("Create License");
            setIsEditMode(false);
        }
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
                const { error } = await LicenseService.updatePost(editingId, values);

                if (error) throw message.error(error.message);
                message.success("Record updated successfully");
            } else {
                // Create new record
                setLoading(true);
                const { error } = await LicenseService.createPost(allValues);

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
            <div className="flex justify-between">
                <Breadcrumb
                    items={[
                        {
                            href: "/inventory",
                            title: <HomeOutlined />,
                        },
                        {
                            title: "Licenses",
                        },
                        {
                            title: "Form",
                        },
                    ]}
                />
                <p className="text-1xl font-extrabold bg-gradient-to-r from-blue-900 to-blue-950 text-transparent bg-clip-text tracking-wide uppercase drop-shadow-lg">{isTitle}</p>
                <Link to={'/inventory/licenses'}>
                    <Button className="mb-2" icon={<AiOutlineRollback />}>Back</Button>
                </Link>
            </div>

            <Form
                className="p-5 bg-gray-50 border border-gray-200"
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
                            label="Software Name"
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input software name!",
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={8}>
                        <Form.Item
                            label="Category"
                            name="category_id"
                            rules={[
                                {
                                    required: true,
                                    message: "Please select category!",
                                },
                            ]}
                        >
                            <Select
                                showSearch
                                placeholder="Select Category"
                                // filterOption={(input, option) =>
                                //     (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                // }
                                options={[]}
                            />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={8}>
                        <Form.Item
                            label="Seats"
                            name="total"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input seats!",
                                },
                            ]}
                        >
                            <Input type="number" />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={8}>
                        <Form.Item
                            label="Min QTY"
                            name="min_qty"
                        >
                            <Input type="number" />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={8}>
                        <Form.Item
                            label="Product Key"
                            name="product_key"
                        >
                            <Input />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={8}>
                        <Form.Item
                            label="Manufacturer"
                            name="manufacturer"
                        >
                            <Select
                                showSearch
                                placeholder="Select Manufacturer"
                                // filterOption={(input, option) =>
                                //     (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                // }
                                options={[]}
                            />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={8}>
                        <Form.Item
                            label="Licensed to Name"
                            name="licensed_to_name"
                        >
                            <Input />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={8}>
                        <Form.Item
                            label="Licensed to Email"
                            name="licensed_to_Email"
                        >
                            <Input />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={8}>
                        <Form.Item
                            label="Supplier"
                            name="supplier"
                        >
                            <Select
                                showSearch
                                placeholder="Select Supplier"
                                // filterOption={(input, option) =>
                                //     (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                // }
                                options={[]}
                            />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={8}>
                        <Form.Item
                            label="Order Number"
                            name="order_no"
                        >
                            <Input />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={8}>
                        <Form.Item
                            label="Purchase Cost"
                            name="purchase_cost"
                        >
                            <Input type="number" suffix="PHP" />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={8}>
                        <Form.Item
                            label="Purchase Date"
                            name="purchase_date"
                        >
                            <DatePicker className="w-full" />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={8}>
                        <Form.Item
                            label="Expiration Date"
                            name="expiration_date"
                        >
                            <DatePicker className="w-full" />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={8}>
                        <Form.Item
                            label="Termination Date"
                            name="termination_date"
                        >
                            <DatePicker className="w-full" />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={8}>
                        <Form.Item
                            label="Purchase Order Number"
                            name="purchase_order_no"
                        >
                            <Input />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={8}>
                        <Form.Item
                            label="Depreciation"
                            name="depreciation_id"
                        >
                            <Select
                                showSearch
                                placeholder="Select Depreciation"
                                // filterOption={(input, option) =>
                                //     (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                // }
                                options={[]}
                            />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={24}>
                        <Form.Item
                            label="Notes"
                            name="notes"
                        >
                            <TextArea rows={4} placeholder="(Optional)" />
                        </Form.Item>
                    </Col>

                </Row>

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