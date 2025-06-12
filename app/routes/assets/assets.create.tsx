import { HomeOutlined, LoadingOutlined } from "@ant-design/icons";
import { Link, useParams } from "@remix-run/react";
import { Breadcrumb, Button, Col, Divider, Form, Input, message, Modal, Row, Select } from "antd";
import { useMemo, useState } from "react";
import { AiOutlineRollback, AiOutlineSend } from "react-icons/ai";
import AssetTag from "~/components/asset_tag";
import { AssetService } from "~/services/asset.service";
import { Asset } from "~/types/asset.type";
const { TextArea } = Input;

export default function CreateAssets() {
    const { id } = useParams();
    const [form] = Form.useForm<Asset>();
    const [loading, setLoading] = useState(false);
    const [isEditMode, setIsEditMode] = useState(true);
    const [editingId, setEditingId] = useState<any | null>(id);
    const [isTitle, setIsTitle] = useState('');

    useMemo(() => {
        if (id) {
            setIsTitle("Update Asset");
            setIsEditMode(true);
        } else {
            setIsTitle("Create Asset");
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
                const { error } = await AssetService.updatePost(editingId, values);

                if (error) throw message.error(error.message);
                message.success("Record updated successfully");
            } else {
                // Create new record
                setLoading(true);
                const { error } = await AssetService.createPost(allValues);

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
                            title: "Asset",
                        },
                        {
                            title: "Form",
                        },
                    ]}
                />
                <p className="text-1xl font-extrabold bg-gradient-to-r from-blue-900 to-blue-950 text-transparent bg-clip-text tracking-wide uppercase drop-shadow-lg">{isTitle}</p>
                <Link to={'/inventory/assets'}>
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
                            label="Model"
                            name="model_id"
                            rules={[
                                {
                                    required: true,
                                    message: "Please select model!",
                                },
                            ]}
                        >
                            <Select
                                showSearch
                                placeholder="Select Model"
                                // filterOption={(input, option) =>
                                //     (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                // }
                                options={[]}
                            />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={8}>
                        <Form.Item
                            label="Type"
                            name="type"
                            rules={[
                                {
                                    required: true,
                                    message: "Please select type!",
                                },
                            ]}
                        >
                            <Select
                                showSearch
                                placeholder="Select Type"
                                // filterOption={(input, option) =>
                                //     (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                // }
                                options={[]}
                            />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={8}>
                        <Form.Item
                            label="Location"
                            name="location"
                            rules={[
                                {
                                    required: true,
                                    message: "Please select location!",
                                },
                            ]}
                        >
                            <Select
                                showSearch
                                placeholder="Select Location"
                                // filterOption={(input, option) =>
                                //     (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                // }
                                options={[]}
                            />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={24}>
                        <AssetTag></AssetTag>
                    </Col>

                    <Col xs={24} sm={24} className="mt-4">
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