import { HomeOutlined, LoadingOutlined } from "@ant-design/icons";
import { useParams } from "@remix-run/react";
import { Breadcrumb, Button, Col, DatePicker, Form, Input, message, Modal, Row, Select } from "antd";
import { useMemo, useState } from "react";
import { AiOutlineRollback, AiOutlineSend } from "react-icons/ai";
import { Link } from "react-router-dom";
import { PredefinedKitService } from "~/services/predefined_kit.service";
import { PredefinedKit } from "~/types/predefined_kit.type";

export default function CreateManufacturer() {
    const { id } = useParams();
    const [form] = Form.useForm<PredefinedKit>();
    const [loading, setLoading] = useState(false);
    const [isEditMode, setIsEditMode] = useState(true);
    const [editingId, setEditingId] = useState<any | null>(id);
    const [isTitle, setIsTitle] = useState('');

    useMemo(() => {
        if (id) {
            setIsTitle("Update Predefined Kit");
            setIsEditMode(true);
        } else {
            setIsTitle("Create Predefined Kit");
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
                const { error } = await PredefinedKitService.updatePost(editingId, values);

                if (error) throw message.error(error.message);
                message.success("Record updated successfully");
            } else {
                // Create new record
                setLoading(true);
                const { error } = await PredefinedKitService.createPost(allValues);

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
                <Link to={'/inventory/predefined-kit'}>
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
                    <Col xs={24} sm={12}>
                        <Form.Item
                            label="Predefined Kit Name"
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input predefined kit name!",
                                },
                            ]}
                        >
                            <Input />
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