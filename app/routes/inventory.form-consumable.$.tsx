import { HomeOutlined, LoadingOutlined } from "@ant-design/icons";
import { Link, useNavigate, useParams } from "@remix-run/react";
import { Breadcrumb, Button, Card, Col, DatePicker, Divider, Form, Input, InputNumber, message, Modal, Row, Select } from "antd";
import { useEffect, useMemo, useState } from "react";
import { AiOutlineCalendar, AiOutlineClear, AiOutlineDown, AiOutlineDropbox, AiOutlinePhone, AiOutlineRollback, AiOutlineSave, AiOutlineSend, AiOutlineShop, AiOutlineStock, AiOutlineTags } from "react-icons/ai";
import { CategoryService } from "~/services/category.service";
import { CompanyService } from "~/services/company.service";
import { ConsumableService } from "~/services/consumable.service";
import { LocationService } from "~/services/location.service";
import { ManufacturerService } from "~/services/manufacturer.service";
import { SupplierService } from "~/services/supplier.service";
import { Category } from "~/types/category.type";
import { Company } from "~/types/company.type";
import { Consumable } from "~/types/consumable.type";
import { Location } from "~/types/location.type";
import { Manufacturer } from "~/types/manufacturer.type";
import { Supplier } from "~/types/supplier.type";
const { TextArea } = Input;
import moment from 'moment';

export default function CreateConsumables() {
    const params = useParams();
    const id = params["*"];
    const [form] = Form.useForm<Consumable>();
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
    const [dataLocation, setDataLocation] = useState<Location[]>([]);
    const { Option } = Select;

    // Fetch data from Supabase
    const fetchDataCategory = async () => {
        try {
            setLoading(true);
            const dataFetchGroup = await CategoryService.getAllPostsByConsumables(isDepartmentID);
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
    const fetchDataLocation = async () => {
        try {
            setLoading(true);
            const dataFetchLocation = await LocationService.getAllPosts(isDepartmentID);
            setDataLocation(dataFetchLocation); // Works in React state
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
            const dataFetch = await ConsumableService.getPostById(Number(id));
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
            setIsTitle("Update Consumable");
            setIsEditMode(true);
            fetchDataByUUID();
        } else {
            setIsTitle("Create Consumable");
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
        fetchDataLocation();
    }, []); // Empty dependency array means this runs once on mount

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
                const { error } = await ConsumableService.updatePost(Number(id), values);

                if (error) throw message.error(error.message);
                message.success("Record updated successfully");
            } else {
                // Create new record
                setLoading(true);
                const { error } = await ConsumableService.createPost(allValues);

                if (error) throw message.error(error.message);
                message.success("Record created successfully");
            }

            setLoading(false);
            form.resetFields();
            navigate("/inventory/consumables");
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
                            title: <span className="text-gray-500">Consumables</span>,
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

                <Link to="/inventory/consumables">
                    <Button
                        icon={<AiOutlineRollback />}
                        className="flex items-center gap-2 border border-gray-300 hover:border-blue-500"
                    >
                        Back to Consumables
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
                        {/* Basic Information */}
                        <div className="space-y-4">
                            <Card type="inner" title={
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <AiOutlineDropbox className="text-blue-500" />
                                    Consumable Details
                                </h3>
                            }>
                                <Form.Item
                                    label={<span className="font-medium">Consumable Name <span className="text-red-500">*</span></span>}
                                    name="name"
                                    rules={[{ required: true, message: "Required field" }]}
                                >
                                    <Input
                                        placeholder="Enter consumable name"
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
                                    label={<span className="font-medium">Model Number</span>}
                                    name="model_no"
                                >
                                    <Input
                                        placeholder="Enter model number"
                                        className="h-10 w-full"
                                    />
                                </Form.Item>

                                <Form.Item
                                    label={<span className="font-medium">Item Number</span>}
                                    name="item_no"
                                >
                                    <Input
                                        placeholder="Enter item number"
                                        className="h-10 w-full"
                                    />
                                </Form.Item>
                            </Card>
                        </div>

                        {/* Vendor Information */}
                        <div className="space-y-4">
                            <Card type="inner" title={
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <AiOutlineShop className="text-blue-500" />
                                    Vendor Details
                                </h3>
                            }>
                                <Form.Item
                                    label={<span className="font-medium">Company</span>}
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
                                    label={<span className="font-medium">Location</span>}
                                    name="location_id"
                                >
                                    <Select
                                        placeholder="Select location"
                                        suffixIcon={<AiOutlineDown className="text-gray-400" />}
                                        className="h-10 w-full"
                                    >
                                        {dataLocation.map((item: Location) => (
                                            <Option key={item.id} value={item.id}>
                                                {item.name}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Card>
                        </div>

                        {/* Purchase & Inventory */}
                        <div className="space-y-4">
                            <Card type="inner" title={
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <AiOutlineStock className="text-blue-500" />
                                    Inventory Details
                                </h3>
                            }>
                                <Form.Item
                                    label={<span className="font-medium">Order Number</span>}
                                    name="order_no"
                                >
                                    <Input
                                        placeholder="Enter order number"
                                        className="h-10 w-full"
                                    />
                                </Form.Item>

                                <Form.Item
                                    label={<span className="font-medium">Purchase Date</span>}
                                    name="purchase_date"
                                >
                                    <DatePicker
                                        className="w-full h-10"
                                        suffixIcon={<AiOutlineCalendar className="text-gray-400" />}
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
                            </Card>
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
                                placeholder="Additional notes about this consumable (optional)"
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
                            {isEditMode ? 'Update Consumable' : 'Create Consumable'}
                        </Button>
                    </div>
                </Form>
            </Card>
        </div>
    );
}