import { HomeOutlined, LoadingOutlined } from "@ant-design/icons";
import { useParams } from "@remix-run/react";
import { Breadcrumb, Button, Card, Col, DatePicker, Form, Input, InputNumber, message, Modal, Row, Select } from "antd";
import { useMemo, useState } from "react";
import { AiOutlineClear, AiOutlineDropbox, AiOutlinePlusCircle, AiOutlineRollback, AiOutlineSave, AiOutlineSend, AiOutlineStock, AiOutlineTags } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { PredefinedKitService } from "~/services/predefined_kit.service";
import { PredefinedKit } from "~/types/predefined_kit.type";
import moment from 'moment';

export default function CreateManufacturer() {
    // const { id } = useParams();
    const params = useParams();
    const id = params["*"];
    const [form] = Form.useForm<PredefinedKit>();
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
            const dataFetch = await PredefinedKitService.getPostById(Number(id));
            const arr = JSON.parse(dataFetch?.access || '[]'); // Add fallback for empty access

            // Convert date strings to moment objects
            const formattedData = {
                ...dataFetch,
                purchase_date: dataFetch.purchase_date ? moment(dataFetch.purchase_date) : null,
            };

            // Update all states at once
            form.setFieldsValue(formattedData);
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
            setIsTitle("Update Predefined Kit");
            setIsEditMode(true);
            fetchDataByUUID();
        } else {
            setIsTitle("Create Predefined Kit");
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
                const { error } = await PredefinedKitService.updatePost(Number(id), values);

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
            navigate("/inventory/predefined-kit");
        } catch (error) {
            message.error("Error");
        }
    };

    return (
        <div className="w-full">
            {/* Header Section - Full Width */}
            <div className="px-6 py-4 shadow-sm">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <Breadcrumb
                        items={[
                            {
                                href: "/inventory",
                                title: <HomeOutlined className="text-gray-500" />,
                            },
                            {
                                title: <span className="text-gray-500">Accessories</span>,
                            },
                            {
                                title: <span className="text-blue-600 font-medium">Predefined Kit</span>,
                            },
                        ]}
                        className="text-sm"
                    />

                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-800 to-blue-600 text-transparent bg-clip-text">
                        {isTitle}
                    </h1>

                    <Link to="/inventory/predefined-kit">
                        <Button
                            icon={<AiOutlineRollback />}
                            className="flex items-center gap-2 border border-gray-300 hover:border-blue-500"
                        >
                            Back to Kits
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Form Card - Full Width */}
            <div className="p-5">
                <Card
                    className="w-full border-0 shadow-none"
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
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Kit Information */}
                            <div className="space-y-4 md:col-span-2 lg:col-span-1">
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <AiOutlineDropbox className="text-blue-500" />
                                    Kit Details
                                </h3>

                                <Form.Item
                                    label={<span className="font-medium">Kit Name <span className="text-red-500">*</span></span>}
                                    name="name"
                                    rules={[{ required: true, message: "Required field" }]}
                                >
                                    <Input
                                        placeholder="Enter kit name"
                                        prefix={<AiOutlineTags className="text-gray-400" />}
                                        className="h-10 w-full"
                                    />
                                </Form.Item>
                            </div>

                            {/* Quantity Information */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <AiOutlineStock className="text-blue-500" />
                                    Quantity Details
                                </h3>

                                <Form.Item
                                    label={<span className="font-medium">Quantity <span className="text-red-500">*</span></span>}
                                    name="qty"
                                    rules={[{ required: true, message: "Required field" }]}
                                >
                                    <InputNumber
                                        className="w-full h-10"
                                        min={1}
                                        placeholder="1"
                                    />
                                </Form.Item>

                                <Form.Item
                                    label={<span className="font-medium">Minimum Quantity</span>}
                                    name="min_qty"
                                >
                                    <InputNumber
                                        className="w-full h-10"
                                        min={0}
                                        placeholder="0"
                                    />
                                </Form.Item>
                            </div>

                            {/* <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                                    <AiOutlinePlusCircle className="text-blue-500" />
                                    Additional Details
                                </h3>

                                <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
                                    <span className="text-gray-400">Additional fields can be added here</span>
                                </div>
                            </div> */}
                        </div>

                        {/* Form Actions - Full Width */}
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
                                {isEditMode ? 'Update Kit' : 'Create Kit'}
                            </Button>
                        </div>
                    </Form>
                </Card>
            </div>
        </div>
    );
}