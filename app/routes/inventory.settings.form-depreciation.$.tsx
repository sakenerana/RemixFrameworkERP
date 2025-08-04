import { HomeOutlined } from "@ant-design/icons";
import { Link, useNavigate, useParams } from "@remix-run/react";
import { Breadcrumb, Button, Card, Form, Input, message, Modal } from "antd";
import { useMemo, useState } from "react";
import { AiOutlineCalculator, AiOutlineCalendar, AiOutlineClear, AiOutlineRollback, AiOutlineSave, AiOutlineSolution } from "react-icons/ai";
import { DepreciationService } from "~/services/depreciation.service";
import { Depreciation } from "~/types/depreciation.type";
const { TextArea } = Input;

export default function CreateDepreciation() {
    // const { id } = useParams();
    const params = useParams();
    const id = params["*"];
    const [form] = Form.useForm<Depreciation>();
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
            const dataFetch = await DepreciationService.getPostById(Number(id));
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
            setIsTitle("Update Depreciation");
            setIsEditMode(true);
            fetchDataByUUID();
        } else {
            setIsTitle("Create Depreciation");
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
                const { error } = await DepreciationService.updatePost(Number(id), values);

                if (error) throw message.error(error.message);
                message.success("Record updated successfully");
            } else {
                // Create new record
                setLoading(true);
                const { error } = await DepreciationService.createPost(allValues);

                if (error) throw message.error(error.message);
                message.success("Record created successfully");
            }

            setLoading(false);
            form.resetFields();
            navigate("/inventory/settings/depreciation");
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
                            title: <span className="text-gray-500">Depreciation</span>,
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

                <Link to="/inventory/settings/depreciation">
                    <Button
                        icon={<AiOutlineRollback />}
                        className="flex items-center gap-2 border border-gray-300 hover:border-blue-500"
                    >
                        Back to Depreciation
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
                        {/* Depreciation Information */}
                        <div className="space-y-4">
                            <Card type="inner" title={
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <AiOutlineCalculator className="text-blue-500" />
                                    Depreciation Details
                                </h3>
                            }>
                                <Form.Item
                                    label={<span className="font-medium">Name <span className="text-red-500">*</span></span>}
                                    name="name"
                                    rules={[{
                                        required: true,
                                        message: "Depreciation name is required"
                                    }]}
                                >
                                    <Input
                                        placeholder="Enter depreciation method name"
                                        prefix={<AiOutlineSolution className="text-gray-400" />}
                                        className="h-10 w-full"
                                    />
                                </Form.Item>

                                <Form.Item
                                    label={<span className="font-medium">Number of Months <span className="text-red-500">*</span></span>}
                                    name="months"
                                    rules={[{
                                        required: true,
                                        message: "Number of months is required"
                                    }]}
                                >
                                    <Input
                                        type="number"
                                        placeholder="Enter number of months"
                                        prefix={<AiOutlineCalendar className="text-gray-400" />}
                                        className="h-10 w-full"
                                    />
                                </Form.Item>
                            </Card>
                        </div>

                        {/* Additional Information */}
                        {/* <div className="space-y-4">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <AiOutlineInfoCircle className="text-blue-500" />
                                Additional Information
                            </h3>

                            <Form.Item
                                label={<span className="font-medium">Depreciation Rate (%)</span>}
                                name="rate"
                            >
                                <Input
                                    type="number"
                                    placeholder="Enter annual rate"
                                    prefix={<AiOutlinePercentage className="text-gray-400" />}
                                    className="h-10 w-full"
                                    suffix="%"
                                />
                            </Form.Item>

                            <Form.Item
                                label={<span className="font-medium">Residual Value</span>}
                                name="residual"
                            >
                                <Input
                                    type="number"
                                    placeholder="Enter residual value"
                                    prefix={<AiOutlineDollar className="text-gray-400" />}
                                    className="h-10 w-full"
                                />
                            </Form.Item>
                        </div> */}
                    </div>

                    {/* Full Width Notes Section */}
                    <div className="mt-6 w-full">
                        <Form.Item
                            label={<span className="font-medium">Notes</span>}
                            name="notes"
                        >
                            <TextArea
                                rows={4}
                                placeholder="Additional notes about this depreciation method (optional)"
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
                            {isEditMode ? 'Update Depreciation' : 'Create Depreciation'}
                        </Button>
                    </div>
                </Form>
            </Card>
        </div>
    );
}