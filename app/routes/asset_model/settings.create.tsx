import { HomeOutlined, LoadingOutlined } from "@ant-design/icons";
import { Link, useNavigate, useParams } from "@remix-run/react";
import { Breadcrumb, Button, Col, Form, Input, message, Modal, Row, Select } from "antd";
import { useEffect, useMemo, useState } from "react";
import { AiOutlineRollback, AiOutlineSend } from "react-icons/ai";
import { AssetModelService } from "~/services/asset_model.service";
import { CategoryService } from "~/services/category.service";
import { DepreciationService } from "~/services/depreciation.service";
import { ManufacturerService } from "~/services/manufacturer.service";
import { AssetModel } from "~/types/asset_model.tpye";
import { Category } from "~/types/category.type";
import { Depreciation } from "~/types/depreciation.type";
import { Manufacturer } from "~/types/manufacturer.type";
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
        <div>
            <div className="flex justify-between">
                <Breadcrumb
                    items={[
                        {
                            href: "/inventory",
                            title: <HomeOutlined />,
                        },
                        {
                            title: "Settings",
                        },
                        {
                            title: "Asset Model",
                        },
                        {
                            title: "Form",
                        },
                    ]}
                />
                <p className="text-1xl font-extrabold bg-gradient-to-r from-blue-900 to-blue-950 text-transparent bg-clip-text tracking-wide uppercase drop-shadow-lg">{isTitle}</p>
                <Link to={'/inventory/settings/asset-model'}>
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
                            label="Asset Model Name"
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input name!",
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={8}>
                        <Form.Item
                            label="Category"
                            name="category_id"
                            rules={[
                                {
                                    required: true,
                                    message: "Please select category!",
                                },
                            ]}
                        >
                            <Select placeholder="Select Category">
                                {dataCategory.map((item: Category) => (
                                    <Option key={item.id} value={item.id}>
                                        {item.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={8}>
                        <Form.Item
                            label="Manufacturer"
                            name="manufacturer_id"
                        >
                            <Select placeholder="Select Manufacturer">
                                {dataManufacturer.map((item: Manufacturer) => (
                                    <Option key={item.id} value={item.id}>
                                        {item.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={8}>
                        <Form.Item
                            label="Model No."
                            name="model_no"
                        >
                            <Input />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={8}>
                        <Form.Item
                            label="Depreciation"
                            name="depreciation_id"
                        >
                            <Select placeholder="Select Depreciation">
                                {dataDepreciation.map((item: Depreciation) => (
                                    <Option key={item.id} value={item.id}>
                                        {item.name}
                                    </Option>
                                ))}
                            </Select>
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

                    <Col xs={24} sm={8}>
                        <Form.Item
                            label="EOL"
                            name="eol"
                        >
                            <Input suffix="MONTHS" type="number" />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={24}>
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