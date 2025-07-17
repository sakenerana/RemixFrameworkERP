import { HomeOutlined, LoadingOutlined } from "@ant-design/icons";
import { Link, useNavigate, useParams } from "@remix-run/react";
import { Breadcrumb, Button, Card, Col, Divider, Form, Input, message, Modal, Row } from "antd";
import { useMemo, useState } from "react";
import { AiOutlineBuild, AiOutlineClear, AiOutlineCustomerService, AiOutlineLink, AiOutlineMail, AiOutlinePhone, AiOutlineRollback, AiOutlineSave, AiOutlineSend, AiOutlineSolution } from "react-icons/ai";
import { ManufacturerService } from "~/services/manufacturer.service";
import { Manufacturer } from "~/types/manufacturer.type";
const { TextArea } = Input;

export default function CreateManufacturer() {
    // const { id } = useParams();
    const params = useParams();
    const id = params["*"];
    const [form] = Form.useForm<Manufacturer>();
    const [loading, setLoading] = useState(false);
    const [isEditMode, setIsEditMode] = useState(true);
    const [isTitle, setIsTitle] = useState('');
    const [isUserID, setUserID] = useState<any>();
    const [isDepartmentID, setDepartmentID] = useState<any>();
    const navigate = useNavigate();

    // Fetch data from Supabase
    const fetchDataByUUID = async () => {
        if (!id) {
            console.error("Data is not available");
            return;
        }

        try {
            setLoading(true);
            const dataFetch = await ManufacturerService.getPostById(Number(id));
            const arr = JSON.parse(dataFetch?.access || '[]'); // Add fallback for empty access
            // Update all states at once
            form.setFieldsValue(dataFetch);
            //   setData(dataFetch);
        } catch (error) {
            // console.error("Error fetching data:", error);
            message.error("Error loading asset data");
        } finally {
            setLoading(false);
        }
    };

    useMemo(() => {
        if (id) {
            setIsTitle("Update Manufacturer");
            setIsEditMode(true);
            fetchDataByUUID();
        } else {
            setIsTitle("Create Manufacturer");
            setIsEditMode(false);
        }

        setUserID(localStorage.getItem('userAuthID'));
        setDepartmentID(localStorage.getItem('userDept'));
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
                user_id: isUserID,
                department_id: Number(isDepartmentID)
            };

            if (id) {
                // Update existing record
                const { error } = await ManufacturerService.updatePost(Number(id), values);

                if (error) throw message.error(error.message);
                message.success("Record updated successfully");
            } else {
                // Create new record
                setLoading(true);
                const { error } = await ManufacturerService.createPost(allValues);

                if (error) throw message.error(error.message);
                message.success("Record created successfully");
            }

            setLoading(false);
            form.resetFields();
            navigate("/inventory/settings/manufacturers");
        } catch (error) {
            message.error("Error");
        }
    };

    return (
        <div className="w-full px-4">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 py-2">
                <Breadcrumb
                    items={[
                        {
                            href: "/inventory",
                            title: <HomeOutlined className="text-gray-500" />,
                        },
                        {
                            title: <span className="text-gray-500">Settings</span>,
                        },
                        {
                            title: <span className="text-gray-500">Manufacturer</span>,
                        },
                        {
                            title: <span className="text-blue-600 font-medium">Form</span>,
                        },
                    ]}
                    className="text-sm"
                />

                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-800 to-blue-600 text-transparent bg-clip-text">
                    {isTitle}
                </h1>

                <Link to="/inventory/settings/manufacturers">
                    <Button
                        icon={<AiOutlineRollback />}
                        className="flex items-center gap-2 border border-gray-300 hover:border-blue-500"
                    >
                        Back to Manufacturers
                    </Button>
                </Link>
            </div>

            {/* Form Card */}
            <Card
                className="w-full border-0 shadow-sm rounded-lg"
                bodyStyle={{ padding: '24px' }}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={{
                        notification: true,
                        interests: ["sports", "music"],
                    }}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Manufacturer Information */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <AiOutlineBuild className="text-blue-500" />
                                Manufacturer Details
                            </h3>

                            <Form.Item
                                label={<span className="font-medium">Manufacturer Name <span className="text-red-500">*</span></span>}
                                name="name"
                                rules={[{
                                    required: true,
                                    message: "Manufacturer name is required"
                                }]}
                            >
                                <Input
                                    placeholder="Enter manufacturer name"
                                    prefix={<AiOutlineSolution className="text-gray-400" />}
                                    className="h-10 w-full"
                                />
                            </Form.Item>

                            <Form.Item
                                label={<span className="font-medium">Website URL</span>}
                                name="url"
                                rules={[{
                                    type: 'url',
                                    message: 'Please enter a valid URL (e.g. https://example.com)'
                                }]}
                            >
                                <Input
                                    placeholder="https://example.com"
                                    prefix={<AiOutlineLink className="text-gray-400" />}
                                    className="h-10 w-full"
                                />
                            </Form.Item>
                        </div>

                        {/* Support Information */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <AiOutlineCustomerService className="text-blue-500" />
                                Support Details
                            </h3>

                            <Form.Item
                                label={<span className="font-medium">Support Phone</span>}
                                name="support_phone"
                            >
                                <Input
                                    placeholder="+1 (555) 123-4567"
                                    prefix={<AiOutlinePhone className="text-gray-400" />}
                                    className="h-10 w-full"
                                />
                            </Form.Item>

                            <Form.Item
                                label={<span className="font-medium">Support Email</span>}
                                name="support_email"
                                rules={[{
                                    type: 'email',
                                    message: 'Please enter a valid email address'
                                }]}
                            >
                                <Input
                                    placeholder="support@example.com"
                                    prefix={<AiOutlineMail className="text-gray-400" />}
                                    className="h-10 w-full"
                                />
                            </Form.Item>
                        </div>
                    </div>

                    {/* Full Width Notes Section */}
                    <div className="mt-6 w-full">
                        <Form.Item
                            label={<span className="font-medium">Notes</span>}
                            name="notes"
                        >
                            <TextArea
                                rows={4}
                                placeholder="Additional notes about this manufacturer (optional)"
                                className="rounded-lg w-full"
                                maxLength={500}
                                showCount
                            />
                        </Form.Item>
                    </div>

                    {/* Form Actions */}
                    <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 border-t pt-6 mt-8 w-full">
                        <Button
                            onClick={onReset}
                            type="default"
                            size="large"
                            className="w-full sm:w-auto h-11"
                            icon={<AiOutlineClear />}
                        >
                            Clear Form
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            size="large"
                            className="w-full sm:w-auto h-11 bg-blue-600 hover:bg-blue-700"
                            loading={loading}
                            icon={!loading && <AiOutlineSave />}
                        >
                            {isEditMode ? 'Update Manufacturer' : 'Create Manufacturer'}
                        </Button>
                    </div>
                </Form>
            </Card>
        </div>
    );
}