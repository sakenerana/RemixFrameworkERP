import { HomeOutlined, LoadingOutlined } from "@ant-design/icons";
import { Link, useNavigate, useParams } from "@remix-run/react";
import { Breadcrumb, Button, Col, Divider, Form, Input, message, Modal, Row, Select } from "antd";
import { useMemo, useState } from "react";
import { AiOutlineEnvironment, AiOutlineLink, AiOutlineMail, AiOutlinePhone, AiOutlinePrinter, AiOutlineRollback, AiOutlineSend, AiOutlineSolution } from "react-icons/ai";
import { SupplierService } from "~/services/supplier.service";
import { Supplier } from "~/types/supplier.type";
import countries from '../../data/country.json';
const { TextArea } = Input;

export default function CreateSuppliers() {
    const { id } = useParams();
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
                            title: "Supplier",
                        },
                        {
                            title: "Form",
                        },
                    ]}
                />
                <p className="text-1xl font-extrabold bg-gradient-to-r from-blue-900 to-blue-950 text-transparent bg-clip-text tracking-wide uppercase drop-shadow-lg">{isTitle}</p>
                <Link to={'/inventory/settings/suppliers'}>
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
                            label="Supplier Name"
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input supplier name!",
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={8}>
                        <Form.Item
                            label="Address"
                            name="address"
                        >
                            <Input prefix={<AiOutlineEnvironment />} />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={8}>
                        <Form.Item
                            label="Address2"
                            name="address2"
                        >
                            <Input prefix={<AiOutlineEnvironment />} />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={8}>
                        <Form.Item
                            label="City"
                            name="city"
                        >
                            <Input prefix={<AiOutlineEnvironment />} />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={8}>
                        <Form.Item
                            label="State"
                            name="state"
                        >
                            <Input prefix={<AiOutlineEnvironment />} />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={8}>
                        <Form.Item
                            label="Country"
                            name="country"
                        >
                            <Select
                                prefix={<AiOutlineEnvironment />}
                                showSearch
                                placeholder="Select Country"
                                filterOption={(input, option) =>
                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                                options={countries}
                            />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={8}>
                        <Form.Item
                            label="Zip"
                            name="zip"
                        >
                            <Input prefix={<AiOutlineEnvironment />} placeholder="ex. 6000" />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={8}>
                        <Form.Item
                            label="Contact Name"
                            name="contact"
                        >
                            <Input prefix={<AiOutlineSolution />} />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={8}>
                        <Form.Item
                            label="Email"
                            name="email"
                        >
                            <Input prefix={<AiOutlineMail />} />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={8}>
                        <Form.Item
                            label="Phone No."
                            name="phone"
                        >
                            <Input
                                type="number"
                                prefix={<AiOutlinePhone />}
                            />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={8}>
                        <Form.Item
                            label="Fax"
                            name="fax"
                        >
                            <Input prefix={<AiOutlinePrinter />} />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={8}>
                        <Form.Item
                            label="URL"
                            name="url"
                        >
                            <Input prefix={<AiOutlineLink />} />
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