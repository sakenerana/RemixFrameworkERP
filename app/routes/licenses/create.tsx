import { HomeOutlined, LoadingOutlined } from "@ant-design/icons";
import { Link, useNavigate, useParams } from "@remix-run/react";
import { Breadcrumb, Button, Col, DatePicker, Divider, Form, Input, message, Modal, Row, Select } from "antd";
import { useEffect, useMemo, useState } from "react";
import { AiOutlinePhone, AiOutlineRollback, AiOutlineSend } from "react-icons/ai";
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
import moment from 'moment';
import { Company } from "~/types/company.type";
import { CompanyService } from "~/services/company.service";

export default function CreateLicense() {
    const { id } = useParams();
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
            const arr = JSON.parse(dataFetch?.access || '[]'); // Add fallback for empty access

            // Convert date strings to moment objects
            const formattedData = {
                ...dataFetch,
                purchase_date: dataFetch.purchase_date ? moment(dataFetch.purchase_date) : null,
                expiration_date: dataFetch.expiration_date ? moment(dataFetch.expiration_date) : null,
                termination_date: dataFetch.termination_date ? moment(dataFetch.termination_date) : null,
            };

            // Update all states at once
            form.setFieldsValue(formattedData);
            //   setData(dataFetch);

            // console.log("dataFetch", dataFetch.product_key)
        } catch (error) {
            // console.error("Error fetching data:", error);
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

            // Include your extra field
            const allValues = {
                ...values,
                status_id: 1,
                user_id: isUserID,
                department_id: Number(isDepartmentID),
                product_key: productKeys
            };

            if (id) {
                // Update existing record
                const { error } = await LicenseService.updatePost(Number(id), allValues);
                
                if (error) throw message.error(error.message);
                message.success("Record updated successfully");
            } else {
                // Create new record
                setLoading(true);
                const { error } = await LicenseService.createPost(allValues);

                if (error) throw message.error('Error');
                message.success("Record created successfully");
            }

            setLoading(false);
            form.resetFields();
            navigate("/inventory/licenses");
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
                            title: "Licenses",
                        },
                        {
                            title: "Form",
                        },
                    ]}
                />
                <p className="text-1xl font-extrabold bg-gradient-to-r from-blue-900 to-blue-950 text-transparent bg-clip-text tracking-wide uppercase drop-shadow-lg">{isTitle}</p>
                <Link to={'/inventory/licenses'}>
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
                            label="Software Name"
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input software name!",
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
                            label="Seats"
                            name="seats"
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

                    <Col xs={24} sm={8}>
                        <Form.Item
                            label="Company"
                            name="company_id"
                        >
                            <Select placeholder="Select Company">
                                {dataCompany.map((item: Company) => (
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
                            label="Licensed to Name"
                            name="license_name"
                        >
                            <Input />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={8}>
                        <Form.Item
                            label="Licensed to Email"
                            name="license_email"
                        >
                            <Input />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={8}>
                        <Form.Item
                            label="Supplier"
                            name="supplier_id"
                        >
                            <Select placeholder="Select Supplier">
                                {dataSupplier.map((item: Supplier) => (
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
                            name="order_number"
                        >
                            <Input />
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
                            label="Purchase Date"
                            name="purchase_date"
                        >
                            <DatePicker className="w-full" />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={8}>
                        <Form.Item
                            label="Expiration Date"
                            name="expiration_date"
                        >
                            <DatePicker className="w-full" />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={8}>
                        <Form.Item
                            label="Termination Date"
                            name="termination_date"
                        >
                            <DatePicker className="w-full" />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={8}>
                        <Form.Item
                            label="Purchase Order Number"
                            name="purchase_order_no"
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

                    <Col xs={24} sm={24}>
                        <ProductKey onDataChange={handleProductKeysChange} initialKeys={form.getFieldValue('product_key') || []} hasID={id} ></ProductKey>
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