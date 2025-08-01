import { HomeOutlined } from "@ant-design/icons";
import { Link, useNavigate, useParams } from "@remix-run/react";
import { Breadcrumb, Button, Card, DatePicker, Form, Input, InputNumber, message, Modal, Select } from "antd";
import { useEffect, useMemo, useState } from "react";
import { AiOutlineCalendar, AiOutlineClear, AiOutlineCode, AiOutlineDown, AiOutlineFileText, AiOutlineRollback, AiOutlineSave, AiOutlineShop, AiOutlineTags } from "react-icons/ai";
import ProductKey from "~/components/product_key";
import { CategoryService } from "~/services/category.service";
import { DepreciationService } from "~/services/depreciation.service";
import { LicenseService } from "~/services/license.service";
import { ManufacturerService } from "~/services/manufacturer.service";
import { SupplierService } from "~/services/supplier.service";
import { Category } from "~/types/category.type";
import { Depreciation } from "~/types/depreciation.type";
import { License } from "~/types/license.type";
import { Manufacturer } from "~/types/manufacturer.type";
import { Supplier } from "~/types/supplier.type";
const { TextArea } = Input;
import { Company } from "~/types/company.type";
import { CompanyService } from "~/services/company.service";
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import utc from 'dayjs/plugin/utc';

// Extend dayjs with plugins
dayjs.extend(customParseFormat);
dayjs.extend(utc);

export default function CreateLicense() {
    // const { id } = useParams();
    const params = useParams();
    const id = params["*"];
    const [form] = Form.useForm<License>();
    const [loading, setLoading] = useState(false);
    const [isEditMode, setIsEditMode] = useState(true);
    const [isTitle, setIsTitle] = useState('');
    const [isUserID, setUserID] = useState<any>();
    const [isDepartmentID, setDepartmentID] = useState<any>();
    const navigate = useNavigate();

    const [dataCategory, setDataCategory] = useState<Category[]>([]);
    const [dataCompany, setDataCompany] = useState<Company[]>([]);
    const [dataManufacturer, setDataManufacturer] = useState<Manufacturer[]>([]);
    const [dataSupplier, setDataSupplier] = useState<Supplier[]>([]);
    const [dataDepreciation, setDataDepreciation] = useState<Depreciation[]>([]);
    const { Option } = Select;

    const [productKeys, setProductKeys] = useState<License[]>([]);

    // Fetch data from Supabase
    const fetchDataCategory = async () => {
        try {
            setLoading(true);
            const dataFetchGroup = await CategoryService.getAllPostsByLicenses(isDepartmentID);
            setDataCategory(dataFetchGroup); // Works in React state
        } catch (error) {
            message.error("error");
        } finally {
            setLoading(false);
        }
    };

    // Fetch data from Supabase
    const fetchDataCompany = async () => {
        try {
            setLoading(true);
            const dataFetchCompany = await CompanyService.getAllPosts(isDepartmentID);
            setDataCompany(dataFetchCompany); // Works in React state
        } catch (error) {
            message.error("error");
        } finally {
            setLoading(false);
        }
    };

    // Fetch data from Supabase
    const fetchDataManufacturer = async () => {
        try {
            setLoading(true);
            const dataFetchManufacturer = await ManufacturerService.getAllPosts(isDepartmentID);
            setDataManufacturer(dataFetchManufacturer); // Works in React state
        } catch (error) {
            message.error("error");
        } finally {
            setLoading(false);
        }
    };

    // Fetch data from Supabase
    const fetchDataSupplier = async () => {
        try {
            setLoading(true);
            const dataFetchSupplier = await SupplierService.getAllPosts(isDepartmentID);
            setDataSupplier(dataFetchSupplier); // Works in React state
        } catch (error) {
            message.error("error");
        } finally {
            setLoading(false);
        }
    };

    // Fetch data from Supabase
    const fetchDataDepreciation = async () => {
        try {
            setLoading(true);
            const dataFetchDepreciation = await DepreciationService.getAllPosts(isDepartmentID);
            setDataDepreciation(dataFetchDepreciation); // Works in React state
        } catch (error) {
            message.error("error");
        } finally {
            setLoading(false);
        }
    };

    // Fetch data from Supabase
    const fetchDataByUUID = async () => {
        if (!id) {
            console.error("Data is not available");
            return;
        }

        try {
            setLoading(true);
            const dataFetch = await LicenseService.getPostById(Number(id));

            const formattedData = {
                ...dataFetch,
                purchase_date: dataFetch.purchase_date
                    ? dayjs(dataFetch.purchase_date, 'YYYY-MM-DD')
                    : null,
                expiration_date: dataFetch.expiration_date
                    ? dayjs(dataFetch.expiration_date, 'YYYY-MM-DD')
                    : null,
            };

            form.setFieldsValue(formattedData);
        } catch (error) {
            message.error("Error loading asset data");
        } finally {
            setLoading(false);
        }
    };

    const handleProductKeysChange = (newData: any[]) => {
        setProductKeys(newData);
        // You can also do other things with the data here
        // console.log("Updated product keys:", newData);
    };

    useMemo(() => {
        if (id) {
            setIsTitle("Update License");
            setIsEditMode(true);
            fetchDataByUUID();
        } else {
            setIsTitle("Create License");
            setIsEditMode(false);
        }

        setUserID(localStorage.getItem('userAuthID'));
        setDepartmentID(localStorage.getItem('userDept'));
    }, []);

    useEffect(() => {
        fetchDataCategory();
        fetchDataCompany();
        fetchDataManufacturer();
        fetchDataSupplier();
        fetchDataDepreciation();
    }, []); // Empty dependency array means this runs once on mount

    const onReset = () => {
        Modal.confirm({
            title: "Confirm Reset",
            content: "Are you sure you want to reset all form fields?",
            okText: "Reset",
            cancelText: "Cancel",
            onOk: () => {
                // 1. Get the current value of the field you want to keep (e.g., `product_key`)
                const productKeyValue = form.getFieldValue('product_key');

                // 2. Reset all fields
                form.resetFields();

                // 3. Set the field back if it exists
                if (productKeyValue !== undefined) {
                    form.setFieldsValue({ product_key: productKeyValue });
                }
            },
        });
    };

    // Create or Update record
    const onFinish = async () => {
        try {
            const values = await form.validateFields();

            // Format the purchase_date before submission
            const formattedValues = {
                ...values,
                purchase_date: values.purchase_date
                    ? dayjs(values.purchase_date).format('YYYY-MM-DD')
                    : null,
                expiration_date: values.expiration_date
                    ? dayjs(values.expiration_date).format('YYYY-MM-DD')
                    : null,
                status_id: 1,
                user_id: isUserID,
                department_id: Number(isDepartmentID),
                product_key: productKeys
            };

            if (id) {
                await LicenseService.updatePost(Number(id), formattedValues);
                message.success("Record updated successfully");
            } else {
                setLoading(true);
                await LicenseService.createPost(formattedValues);
                message.success("Record created successfully");
            }

            setLoading(false);
            form.resetFields();
            navigate("/inventory/licenses");
        } catch (error) {
            message.error("Error submitting form");
            setLoading(false);
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
                            title: <span className="text-gray-500">Licenses</span>,
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

                <Link to="/inventory/licenses">
                    <Button
                        icon={<AiOutlineRollback />}
                        className="flex items-center gap-2 border border-gray-300 hover:border-blue-500"
                    >
                        Back to Licenses
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
                        {/* Software Information */}
                        <div className="space-y-4">
                            <Card type="inner" title={
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <AiOutlineCode className="text-blue-500" />
                                    Software Details
                                </h3>
                            }>
                                <Form.Item
                                    label={<span className="font-medium">Software Name <span className="text-red-500">*</span></span>}
                                    name="name"
                                    rules={[{ required: true, message: "Required field" }]}
                                >
                                    <Input
                                        placeholder="Enter software name"
                                        prefix={<AiOutlineTags className="text-gray-400" />}
                                        className="h-10 w-full"
                                    />
                                </Form.Item>

                                <Form.Item
                                    label={<span className="font-medium">Category <span className="text-red-500">*</span></span>}
                                    name="category_id"
                                    rules={[{ required: true, message: "Required field" }]}
                                >
                                    <Select
                                        placeholder="Select category"
                                        suffixIcon={<AiOutlineDown className="text-gray-400" />}
                                        className="h-10 w-full"
                                    >
                                        {dataCategory.map((item: Category) => (
                                            <Option key={item.id} value={item.id}>
                                                {item.name}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    label={<span className="font-medium">Seats <span className="text-red-500">*</span></span>}
                                    name="seats"
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
                            </Card>
                        </div>

                        {/* Company & Supplier */}
                        <div className="space-y-4">
                            <Card type="inner" title={
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <AiOutlineShop className="text-blue-500" />
                                    Vendor Details
                                </h3>
                            }>
                                <Form.Item
                                    label={<span className=" font-medium">Company</span>}
                                    name="company_id"
                                >
                                    <Select
                                        placeholder="Select company"
                                        suffixIcon={<AiOutlineDown className="text-gray-400" />}
                                        className="h-10 w-full"
                                    >
                                        {dataCompany.map((item: Company) => (
                                            <Option key={item.id} value={item.id}>
                                                {item.name}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    label={<span className="font-medium">Manufacturer</span>}
                                    name="manufacturer_id"
                                >
                                    <Select
                                        placeholder="Select manufacturer"
                                        suffixIcon={<AiOutlineDown className="text-gray-400" />}
                                        className="h-10 w-full"
                                    >
                                        {dataManufacturer.map((item: Manufacturer) => (
                                            <Option key={item.id} value={item.id}>
                                                {item.name}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    label={<span className="font-medium">Supplier</span>}
                                    name="supplier_id"
                                >
                                    <Select
                                        placeholder="Select supplier"
                                        suffixIcon={<AiOutlineDown className="text-gray-400" />}
                                        className="h-10 w-full"
                                    >
                                        {dataSupplier.map((item: Supplier) => (
                                            <Option key={item.id} value={item.id}>
                                                {item.name}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    label={<span className="font-medium">Depreciation</span>}
                                    name="depreciation_id"
                                >
                                    <Select
                                        placeholder="Select depreciation"
                                        suffixIcon={<AiOutlineDown className="text-gray-400" />}
                                        className="h-10 w-full"
                                    >
                                        {dataDepreciation.map((item: Depreciation) => (
                                            <Option key={item.id} value={item.id}>
                                                {item.name}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Card>
                        </div>

                        {/* Purchase & License */}
                        <div className="space-y-4">
                            <Card type="inner" title={
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <AiOutlineFileText className="text-blue-500" />
                                    License Details
                                </h3>
                            }>
                                <Form.Item
                                    label={<span className="font-medium">Licensed to Name</span>}
                                    name="license_name"
                                >
                                    <Input
                                        placeholder="License holder name"
                                        className="h-10 w-full"
                                    />
                                </Form.Item>

                                <Form.Item
                                    label={<span className="font-medium">Licensed to Email</span>}
                                    name="license_email"
                                    rules={[{ type: 'email', message: 'Invalid email format' }]}
                                >
                                    <Input
                                        placeholder="license@example.com"
                                        className="h-10 w-full"
                                    />
                                </Form.Item>

                                <Form.Item
                                    label={<span className="font-medium">Order Number</span>}
                                    name="order_number"
                                >
                                    <Input
                                        placeholder="PO-12345"
                                        className="h-10 w-full"
                                    />
                                </Form.Item>

                                <Form.Item
                                    label={<span className="font-medium">Purchase Cost</span>}
                                    name="purchase_cost"
                                >
                                    <InputNumber
                                        className="w-full h-10 rounded-lg"
                                        min={0}
                                        step={1000}
                                        formatter={(value) => {
                                            if (value === undefined || value === null) return '₱ 0';
                                            // Format with commas and peso sign
                                            return `₱ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                                        }}
                                        parser={(value: any) => {
                                            // Remove all non-numeric characters
                                            return value ? value.replace(/[^\d]/g, '') : '';
                                        }}
                                        placeholder="Enter amount"
                                    />
                                </Form.Item>

                                <Form.Item
                                    label={<span className="font-medium">Purchase Date</span>}
                                    name="purchase_date"
                                    getValueFromEvent={(date) => date} // Receives Day.js object directly
                                    getValueProps={(value) => ({ value: value ? dayjs(value, 'YYYY-MM-DD') : null })}
                                >
                                    <DatePicker
                                        className="w-full h-10"
                                        format="YYYY-MM-DD"
                                        suffixIcon={<AiOutlineCalendar className="text-gray-400" />}
                                    />
                                </Form.Item>

                                <Form.Item
                                    label={<span className="font-medium">Expiration Date</span>}
                                    name="expiration_date"
                                    getValueFromEvent={(date) => date} // Receives Day.js object directly
                                    getValueProps={(value) => ({ value: value ? dayjs(value, 'YYYY-MM-DD') : null })}
                                >
                                    <DatePicker
                                        className="w-full h-10"
                                        format="YYYY-MM-DD"
                                        suffixIcon={<AiOutlineCalendar className="text-gray-400" />}
                                    />
                                </Form.Item>
                            </Card>
                        </div>
                    </div>

                    {/* Full Width Sections */}
                    <div className="mt-6 w-full">
                        <Card type="inner" title={
                            <div className="flex flex-wrap gap-2">
                                {/* <AiOutlineContacts className="text-blue-500 mt-1" /> */}
                                <span>Product Keys</span>
                            </div>
                        }>
                            <Form.Item>
                                <ProductKey
                                    onDataChange={handleProductKeysChange}
                                    initialKeys={form.getFieldValue('product_key') || []}
                                    hasID={id}
                                />
                            </Form.Item>

                            <Form.Item
                                label={<span className="font-medium">Notes</span>}
                                name="notes"
                            >
                                <TextArea
                                    rows={4}
                                    placeholder="Additional notes about this license (optional)"
                                    className="rounded-lg w-full"
                                    maxLength={500}
                                    showCount
                                />
                            </Form.Item>
                        </Card>
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
                            {isEditMode ? 'Update License' : 'Create License'}
                        </Button>
                    </div>
                </Form>
            </Card>
        </div>
    );
}