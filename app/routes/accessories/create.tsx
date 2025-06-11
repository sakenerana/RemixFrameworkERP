import { HomeOutlined, LoadingOutlined } from "@ant-design/icons";
import { useParams } from "@remix-run/react";
import { Breadcrumb, Button, Col, DatePicker, Form, Input, message, Modal, Row, Select } from "antd";
import { useMemo, useState } from "react";
import { AiOutlineRollback, AiOutlineSend } from "react-icons/ai";
import { Link } from "react-router-dom";
import { AccessoryService } from "~/services/accessory.service";
import { Accessories } from "~/types/accessories.type";
const { TextArea } = Input;

export default function CreateAccessory() {
    const { id } = useParams();
    const [form] = Form.useForm<Accessories>();
    const [loading, setLoading] = useState(false);
    const [isEditMode, setIsEditMode] = useState(true);
    const [editingId, setEditingId] = useState<any | null>(id);
    const [isTitle, setIsTitle] = useState('');

    useMemo(() => {
        if (id) {
            setIsTitle("Update Accessory");
            setIsEditMode(true);
        } else {
            setIsTitle("Create Accessory");
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
                const { error } = await AccessoryService.updatePost(editingId, values);

                if (error) throw message.error(error.message);
                message.success("Record updated successfully");
            } else {
                // Create new record
                setLoading(true);
                const { error } = await AccessoryService.createPost(allValues);

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
                            title: "Accessories",
                        },
                        {
                            title: "Form",
                        },
                    ]}
                />
                <p className="text-1xl font-extrabold bg-gradient-to-r from-blue-900 to-blue-950 text-transparent bg-clip-text tracking-wide uppercase drop-shadow-lg">{isTitle}</p>
                <Link to={'/inventory/accessories'}>
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
                            label="Accessory Name"
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input accessory name!",
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
                                placeholder="Select Country"
                            // filterOption={(input, option) =>
                            //     (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            // }
                            // options={[]}
                            />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={8}>
                        <Form.Item
                            label="Supplier"
                            name="supplier_id"
                        >
                            <Select
                                showSearch
                                placeholder="Select Supplier"
                            // filterOption={(input, option) =>
                            //     (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            // }
                            // options={[]}
                            />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={8}>
                        <Form.Item
                            label="Manufacturer"
                            name="manufacturer_id"
                        >
                            <Select
                                showSearch
                                placeholder="Select Manufacturer"
                            // filterOption={(input, option) =>
                            //     (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            // }
                            // options={[]}
                            />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={8}>
                        <Form.Item
                            label="Location"
                            name="location_id"
                        >
                            <Select
                                showSearch
                                placeholder="Select Location"
                            // filterOption={(input, option) =>
                            //     (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            // }
                            // options={[]}
                            />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={8}>
                        <Form.Item
                            label="Model No."
                            name="model_no"
                        >
                            <Input />
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
                            label="Purchase Date"
                            name="purchase_date"
                        >
                            <DatePicker className="w-full" />
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
                            label="Quantity"
                            name="qty"
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