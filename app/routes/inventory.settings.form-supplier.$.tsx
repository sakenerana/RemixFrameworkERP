import { HomeOutlined, LoadingOutlined } from "@ant-design/icons";
import { Link, useNavigate, useParams } from "@remix-run/react";
import { Breadcrumb, Button, Card, Col, Divider, Form, Input, message, Modal, Row, Select } from "antd";
import { useMemo, useState } from "react";
import { AiOutlineClear, AiOutlineContacts, AiOutlineEnvironment, AiOutlineHome, AiOutlineLink, AiOutlineMail, AiOutlinePhone, AiOutlinePrinter, AiOutlineRollback, AiOutlineSave, AiOutlineSend, AiOutlineShop, AiOutlineSolution, AiOutlineUser } from "react-icons/ai";
import { SupplierService } from "~/services/supplier.service";
import { Supplier } from "~/types/supplier.type";
import countries from '~/data/country.json';
const { TextArea } = Input;

export default function CreateSuppliers() {
    // const { id } = useParams();
    const params = useParams();
    const id = params["*"];
    const [form] = Form.useForm<Supplier>();
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
            const dataFetch = await SupplierService.getPostById(Number(id));
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
            setIsTitle("Update Supplier");
            setIsEditMode(true);
            fetchDataByUUID();
        } else {
            setIsTitle("Create Supplier");
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
                const { error } = await SupplierService.updatePost(Number(id), values);

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
            navigate("/inventory/settings/suppliers");
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
                            title: <span className="text-gray-500">Supplier</span>,
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

                <Link to="/inventory/settings/suppliers">
                    <Button
                        icon={<AiOutlineRollback />}
                        className="flex items-center gap-2 border border-gray-300 hover:border-blue-500"
                    >
                        Back to Suppliers
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Supplier Information */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <AiOutlineShop className="text-blue-500" />
                                Supplier Details
                            </h3>

                            <Form.Item
                                label={<span className="font-medium">Supplier Name <span className="text-red-500">*</span></span>}
                                name="name"
                                rules={[{ required: true, message: "Required field" }]}
                            >
                                <Input
                                    placeholder="Enter supplier name"
                                    prefix={<AiOutlineSolution className="text-gray-400" />}
                                    className="h-10 w-full"
                                />
                            </Form.Item>

                            <Form.Item
                                label={<span className="font-medium">Contact Name</span>}
                                name="contact"
                            >
                                <Input
                                    placeholder="Primary contact person"
                                    prefix={<AiOutlineUser className="text-gray-400" />}
                                    className="h-10 w-full"
                                />
                            </Form.Item>

                            <Form.Item
                                label={<span className="font-medium">Email</span>}
                                name="email"
                                rules={[{ type: 'email', message: 'Invalid email format' }]}
                            >
                                <Input
                                    placeholder="contact@example.com"
                                    prefix={<AiOutlineMail className="text-gray-400" />}
                                    className="h-10 w-full"
                                />
                            </Form.Item>
                        </div>

                        {/* Contact Information */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <AiOutlineContacts className="text-blue-500" />
                                Contact Details
                            </h3>

                            <Form.Item
                                label={<span className="font-medium">Phone Number</span>}
                                name="phone"
                            >
                                <Input
                                    placeholder="+1 (555) 123-4567"
                                    prefix={<AiOutlinePhone className="text-gray-400" />}
                                    className="h-10 w-full"
                                />
                            </Form.Item>

                            <Form.Item
                                label={<span className="font-medium">Fax</span>}
                                name="fax"
                            >
                                <Input
                                    placeholder="Fax number"
                                    prefix={<AiOutlinePrinter className="text-gray-400" />}
                                    className="h-10 w-full"
                                />
                            </Form.Item>

                            <Form.Item
                                label={<span className="font-medium">Website URL</span>}
                                name="url"
                            >
                                <Input
                                    placeholder="https://example.com"
                                    prefix={<AiOutlineLink className="text-gray-400" />}
                                    className="h-10 w-full"
                                />
                            </Form.Item>
                        </div>

                        {/* Address Information */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <AiOutlineEnvironment className="text-blue-500" />
                                Address Details
                            </h3>

                            <Form.Item
                                label={<span className="font-medium">Address Line 1</span>}
                                name="address"
                            >
                                <Input
                                    placeholder="Street address"
                                    prefix={<AiOutlineHome className="text-gray-400" />}
                                    className="h-10 w-full"
                                />
                            </Form.Item>

                            <Form.Item
                                label={<span className="font-medium">Address Line 2</span>}
                                name="address2"
                            >
                                <Input
                                    placeholder="Apt, suite, etc."
                                    className="h-10 w-full"
                                />
                            </Form.Item>

                            <div className="grid grid-cols-2 gap-4">
                                <Form.Item
                                    label={<span className="font-medium">City</span>}
                                    name="city"
                                >
                                    <Input
                                        placeholder="City"
                                        className="h-10 w-full"
                                    />
                                </Form.Item>

                                <Form.Item
                                    label={<span className="font-medium">State</span>}
                                    name="state"
                                >
                                    <Input
                                        placeholder="State/Province"
                                        className="h-10 w-full"
                                    />
                                </Form.Item>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Form.Item
                                    label={<span className="font-medium">Zip Code</span>}
                                    name="zip"
                                >
                                    <Input
                                        placeholder="Postal code"
                                        className="h-10 w-full"
                                    />
                                </Form.Item>

                                <Form.Item
                                    label={<span className="font-medium">Country</span>}
                                    name="country"
                                >
                                    <Select
                                        className="h-10 w-full"
                                        showSearch
                                        placeholder="Select country"
                                        optionFilterProp="children"
                                        filterOption={(input, option) =>
                                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                        }
                                        options={countries}
                                    />
                                </Form.Item>
                            </div>
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
                                placeholder="Additional notes about this supplier (optional)"
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
                            {isEditMode ? 'Update Supplier' : 'Create Supplier'}
                        </Button>
                    </div>
                </Form>
            </Card>
        </div>
    );
}