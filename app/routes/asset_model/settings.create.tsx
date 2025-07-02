import { HomeOutlined, LoadingOutlined } from "@ant-design/icons";
import { Link, useNavigate, useParams } from "@remix-run/react";
import { Breadcrumb, Button, Card, Col, Form, Input, message, Modal, Row, Select } from "antd";
import { useEffect, useMemo, useState } from "react";
import { AiOutlineBarcode, AiOutlineCalendar, AiOutlineClear, AiOutlineDown, AiOutlineForm, AiOutlineNumber, AiOutlineRollback, AiOutlineSave, AiOutlineSend, AiOutlineSetting, AiOutlineShop, AiOutlineTag } from "react-icons/ai";
import { AssetModelService } from "~/services/asset_model.service";
import { CategoryService } from "~/services/category.service";
import { DepreciationService } from "~/services/depreciation.service";
import { ManufacturerService } from "~/services/manufacturer.service";
import { SupplierService } from "~/services/supplier.service";
import { AssetModel } from "~/types/asset_model.tpye";
import { Category } from "~/types/category.type";
import { Depreciation } from "~/types/depreciation.type";
import { Manufacturer } from "~/types/manufacturer.type";
import { Supplier } from "~/types/supplier.type";
const { TextArea } = Input;

export default function CreateAssetModel() {
    const { id } = useParams();
    const [form] = Form.useForm<AssetModel>();
    const [loading, setLoading] = useState(false);
    const [isEditMode, setIsEditMode] = useState(true);
    const [isTitle, setIsTitle] = useState('');
    const [isUserID, setUserID] = useState<any>();
    const [isDepartmentID, setDepartmentID] = useState<any>();
    const navigate = useNavigate();

    const [dataCategory, setDataCategory] = useState<Category[]>([]);
    const [dataManufacturer, setDataManufacturer] = useState<Manufacturer[]>([]);
    const [dataSupplier, setDataSupplier] = useState<Supplier[]>([]);
    const [dataDepreciation, setDataDepreciation] = useState<Depreciation[]>([]);
    const { Option } = Select;

    // Fetch data from Supabase
    const fetchDataCategory = async () => {
        try {
            setLoading(true);
            const dataFetchGroup = await CategoryService.getAllPosts(isDepartmentID);
            setDataCategory(dataFetchGroup); // Works in React state
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
            const dataFetch = await AssetModelService.getPostById(Number(id));
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
            setIsTitle("Update Asset Model");
            setIsEditMode(true);
            fetchDataByUUID();
        } else {
            setIsTitle("Create Asset Model");
            setIsEditMode(false);
        }

        setUserID(localStorage.getItem('userAuthID'));
        setDepartmentID(localStorage.getItem('userDept'));
    }, []);

    useEffect(() => {
        fetchDataCategory();
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
                const { error } = await AssetModelService.updatePost(Number(id), values);

                if (error) throw message.error(error.message);
                message.success("Record updated successfully");
            } else {
                // Create new record
                setLoading(true);
                const { error } = await AssetModelService.createPost(allValues);

                if (error) throw message.error(error.message);
                message.success("Record created successfully");
            }

            setLoading(false);
            form.resetFields();
            navigate("/inventory/settings/asset-model");
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
                            title: <span className="text-gray-500">Asset Model</span>,
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

                <Link to="/inventory/settings/asset-model">
                    <Button
                        icon={<AiOutlineRollback />}
                        className="flex items-center gap-2 border border-gray-300 hover:border-blue-500"
                    >
                        Back to Models
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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Basic Information */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <AiOutlineForm className="text-blue-500" />
                                Basic Information
                            </h3>

                            <Form.Item
                                label={<span className="font-medium">Model Name <span className="text-red-500">*</span></span>}
                                name="name"
                                rules={[{ required: true, message: "Please input name!" }]}
                            >
                                <Input
                                    placeholder="Enter model name"
                                    className="h-10 w-full"
                                    prefix={<AiOutlineTag className="text-gray-400" />}
                                />
                            </Form.Item>

                            <Form.Item
                                label={<span className="font-medium">Category <span className="text-red-500">*</span></span>}
                                name="category_id"
                                rules={[{ required: true, message: "Please select category!" }]}
                            >
                                <Select
                                    placeholder="Select Category"
                                    className="h-10 w-full"
                                    suffixIcon={<AiOutlineDown className="text-gray-400" />}
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
                                    prefix={<AiOutlineBarcode className="text-gray-400" />}
                                />
                            </Form.Item>
                        </div>

                        {/* Vendor Information */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <AiOutlineShop className="text-blue-500" />
                                Vendor Information
                            </h3>

                            <Form.Item
                                label={<span className="font-medium">Manufacturer</span>}
                                name="manufacturer_id"
                            >
                                <Select
                                    placeholder="Select Manufacturer"
                                    className="h-10 w-full"
                                    suffixIcon={<AiOutlineDown className="text-gray-400" />}
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
                                    placeholder="Select Supplier"
                                    className="h-10 w-full"
                                    suffixIcon={<AiOutlineDown className="text-gray-400" />}
                                >
                                    {dataSupplier.map((item: Supplier) => (
                                        <Option key={item.id} value={item.id}>
                                            {item.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </div>

                        {/* Inventory Settings */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <AiOutlineSetting className="text-blue-500" />
                                Inventory Settings
                            </h3>

                            <Form.Item
                                label={<span className="font-medium">Depreciation</span>}
                                name="depreciation_id"
                            >
                                <Select
                                    placeholder="Select Depreciation"
                                    className="h-10 w-full"
                                    suffixIcon={<AiOutlineDown className="text-gray-400" />}
                                >
                                    {dataDepreciation.map((item: Depreciation) => (
                                        <Option key={item.id} value={item.id}>
                                            {item.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item
                                label={<span className="font-medium">Minimum Quantity</span>}
                                name="min_qty"
                            >
                                <Input
                                    type="number"
                                    placeholder="Enter minimum quantity"
                                    className="h-10 w-full"
                                    prefix={<AiOutlineNumber className="text-gray-400" />}
                                />
                            </Form.Item>

                            <Form.Item
                                label={<span className="font-medium">End of Life (EOL)</span>}
                                name="eol"
                            >
                                <Input
                                    type="number"
                                    placeholder="Enter months"
                                    className="h-10 w-full"
                                    prefix={<AiOutlineCalendar className="text-gray-400" />}
                                    suffix={<span className="text-gray-500">MONTHS</span>}
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
                                placeholder="Additional notes about this asset model (optional)"
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
                            Reset Form
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            size="large"
                            className="w-full sm:w-auto h-11 bg-blue-600 hover:bg-blue-700"
                            loading={loading}
                            icon={!loading && <AiOutlineSave />}
                        >
                            {isEditMode ? 'Update Asset Model' : 'Create Asset Model'}
                        </Button>
                    </div>
                </Form>
            </Card>
        </div>
    );
}