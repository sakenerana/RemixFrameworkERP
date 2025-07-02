import { HomeOutlined, LoadingOutlined } from "@ant-design/icons";
import { Link, useNavigate, useParams } from "@remix-run/react";
import { Breadcrumb, Button, Card, Col, DatePicker, Form, Input, InputNumber, message, Modal, Row, Select } from "antd";
import { useEffect, useMemo, useState } from "react";
import { AiOutlineBarcode, AiOutlineCalendar, AiOutlineClear, AiOutlineDown, AiOutlineInfoCircle, AiOutlineRollback, AiOutlineSave, AiOutlineSend, AiOutlineShoppingCart, AiOutlineStock, AiOutlineTags } from "react-icons/ai";
import AssetTag from "~/components/asset_tag";
import { AssetService } from "~/services/asset.service";
import { Asset } from "~/types/asset.type";
import { Location } from "~/types/location.type";
const { TextArea } = Input;
import moment from 'moment';
import { LocationService } from "~/services/location.service";
import { AssetModel } from "~/types/asset_model.tpye";
import { AssetModelService } from "~/services/asset_model.service";

export default function CreateAssets() {
    const { id } = useParams();
    const [form] = Form.useForm<Asset>();
    const [loading, setLoading] = useState(false);
    const [isEditMode, setIsEditMode] = useState(true);
    const [isTitle, setIsTitle] = useState('');
    const [isUserID, setUserID] = useState<any>();
    const [isDepartmentID, setDepartmentID] = useState<any>();
    const navigate = useNavigate();

    const [dataAssetModel, setDataAssetModel] = useState<AssetModel[]>([]);
    const [dataLocation, setDataLocation] = useState<Location[]>([]);
    const { Option } = Select;

    const [assetTag, setAssetTag] = useState<Asset[]>([]);

    // Fetch data from Supabase
    const fetchDataAssetModel = async () => {
        try {
            setLoading(true);
            const dataFetchAssetModel = await AssetModelService.getAllPostsByAsset(isDepartmentID);
            setDataAssetModel(dataFetchAssetModel); // Works in React state
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
            const dataFetch = await AssetService.getPostById(Number(id));
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

    const handleAssetTagChange = (newData: any[]) => {
        setAssetTag(newData);
        // You can also do other things with the data here
    };

    useMemo(() => {
        if (id) {
            setIsTitle("Update Asset");
            setIsEditMode(true);
            fetchDataByUUID();
        } else {
            setIsTitle("Create Asset");
            setIsEditMode(false);
        }

        setUserID(localStorage.getItem('userAuthID'));
        setDepartmentID(localStorage.getItem('userDept'));
    }, []);

    useEffect(() => {
        fetchDataAssetModel();
        fetchDataLocation();
    }, []); // Empty dependency array means this runs once on mount

    const onReset = () => {
        Modal.confirm({
            title: "Confirm Reset",
            content: "Are you sure you want to reset all form fields?",
            okText: "Reset",
            cancelText: "Cancel",
            onOk: () => {
                // 1. Get the current value of the field you want to keep (e.g., `product_key`)
                const assetTagValue = form.getFieldValue('asset_tag');

                // 2. Reset all fields
                form.resetFields();

                // 3. Set the field back if it exists
                if (assetTagValue !== undefined) {
                    form.setFieldsValue({ asset_tag: assetTagValue });
                }
            },
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
                department_id: Number(isDepartmentID),
                asset_tag: assetTag
            };

            if (id) {
                // Update existing record
                const { error } = await AssetService.updatePost(Number(id), allValues);

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
            navigate("/inventory/assets");
        } catch (error) {
            message.error("Error");
        }
    };

    return (
        <div className="w-full px-4">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <Breadcrumb
                    items={[
                        {
                            href: "/inventory",
                            title: <HomeOutlined className="text-gray-500" />,
                        },
                        {
                            title: <span className="text-gray-500">Asset</span>,
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

                <Link to="/inventory/assets">
                    <Button
                        icon={<AiOutlineRollback />}
                        className="flex items-center gap-2 border border-gray-300 hover:border-blue-500"
                    >
                        Back to Assets
                    </Button>
                </Link>
            </div>

            {/* Form Card */}
            <Card
                className="shadow-sm border-0 rounded-lg"
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
                        {/* Asset Information */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <AiOutlineInfoCircle className="text-blue-500" />
                                Asset Details
                            </h3>

                            <Form.Item
                                label={<span className="font-medium">Asset Name</span>}
                                name="name"
                                rules={[{ required: true, message: "Required field" }]}
                            >
                                <Input
                                    placeholder="Enter asset name"
                                    prefix={<AiOutlineTags className="text-gray-400" />}
                                    className="h-10"
                                />
                            </Form.Item>

                            <Form.Item
                                label={<span className="font-medium">Asset Model</span>}
                                name="asset_model_id"
                                rules={[{ required: true, message: "Required field" }]}
                            >
                                <Select
                                    placeholder="Select model"
                                    suffixIcon={<AiOutlineDown className="text-gray-400" />}
                                    className="h-10"
                                >
                                    {dataAssetModel.map((item: AssetModel) => (
                                        <Option key={item.id} value={item.id}>
                                            {item.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item
                                label={<span className="font-medium">Location</span>}
                                name="location_id"
                                rules={[{ required: true, message: "Required field" }]}
                            >
                                <Select
                                    placeholder="Select location"
                                    suffixIcon={<AiOutlineDown className="text-gray-400" />}
                                    className="h-10"
                                >
                                    {dataLocation.map((item: Location) => (
                                        <Option key={item.id} value={item.id}>
                                            {item.name}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </div>

                        {/* Purchase Information */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <AiOutlineShoppingCart className="text-blue-500" />
                                Purchase Details
                            </h3>

                            <Form.Item
                                label={<span className="font-medium">Order Number</span>}
                                name="order_no"
                            >
                                <Input
                                    placeholder="PO-12345"
                                    prefix={<AiOutlineBarcode className="text-gray-400" />}
                                    className="h-10"
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
                        </div>

                        {/* Quantity Information */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <AiOutlineStock className="text-blue-500" />
                                Inventory Details
                            </h3>

                            <Form.Item
                                label={<span className="font-medium">Quantity</span>}
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
                    </div>

                    {/* Asset Tags */}
                    <div className="mt-6">
                        <Form.Item
                            label={<span className="font-medium">Asset Tags</span>}
                        >
                            <AssetTag
                                onDataChange={handleAssetTagChange}
                                initialKeys={form.getFieldValue('asset_tag') || []}
                                hasID={id}
                            />
                        </Form.Item>
                    </div>

                    {/* Notes Section */}
                    <div className="mt-6">
                        <Form.Item
                            label={<span className="font-medium">Notes</span>}
                            name="notes"
                        >
                            <TextArea
                                rows={4}
                                placeholder="Additional notes about this asset (optional)"
                                className="rounded-lg"
                                maxLength={500}
                                showCount
                            />
                        </Form.Item>
                    </div>

                    {/* Form Actions */}
                    <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 border-t pt-6 mt-8">
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
                            {isEditMode ? 'Update Asset' : 'Create Asset'}
                        </Button>
                    </div>
                </Form>
            </Card>
        </div>
    );
}