import { HomeOutlined, LoadingOutlined } from "@ant-design/icons";
import { Link, useNavigate, useParams } from "@remix-run/react";
import { Breadcrumb, Button, Col, DatePicker, Form, Input, message, Modal, Row, Select } from "antd";
import { useEffect, useMemo, useState } from "react";
import { AiOutlineRollback, AiOutlineSend } from "react-icons/ai";
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
                            label="Asset Name"
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input asset name!",
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={8}>
                        <Form.Item
                            label="Asset Model"
                            name="asset_model_id"
                            rules={[
                                {
                                    required: true,
                                    message: "Please select model!",
                                },
                            ]}
                        >
                            <Select placeholder="Select Asset Model">
                                {dataAssetModel.map((item: AssetModel) => (
                                    <Option key={item.id} value={item.id}>
                                        {item.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={8}>
                        <Form.Item
                            label="Location"
                            name="location_id"
                            rules={[
                                {
                                    required: true,
                                    message: "Please select location!",
                                },
                            ]}
                        >
                            <Select placeholder="Select Location">
                                {dataLocation.map((item: Location) => (
                                    <Option key={item.id} value={item.id}>
                                        {item.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={8}>
                        <Form.Item
                            label="Order Number"
                            name="order_no"
                        >
                            <Input />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={8}>
                        <Form.Item
                            label="Purchase Date"
                            name="purchase_date"
                        >
                            <DatePicker className="w-full" />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={8}>
                        <Form.Item
                            label="Purchase Cost"
                            name="purchase_cost"
                        >
                            <Input type="number" suffix="PHP" />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={8}>
                        <Form.Item
                            label="Qty"
                            name="qty"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input seats!",
                                },
                            ]}
                        >
                            <Input type="number" />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={8}>
                        <Form.Item
                            label="Min QTY"
                            name="min_qty"
                        >
                            <Input type="number" />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={24}>
                        <AssetTag onDataChange={handleAssetTagChange} initialKeys={form.getFieldValue('asset_tag') || []} hasID={id} ></AssetTag>
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