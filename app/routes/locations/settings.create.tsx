import { HomeOutlined, LoadingOutlined } from "@ant-design/icons";
import { Breadcrumb, Button, Card, Col, Divider, Form, Input, message, Modal, Row, Select } from "antd";
import { useMemo, useState } from "react";
import { AiOutlineEnvironment, AiOutlinePhone, AiOutlineRollback, AiOutlineSend } from "react-icons/ai";
import { Link, useNavigate, useParams } from "react-router-dom";
import { LocationService } from "~/services/location.service";
import { Location } from "~/types/location.type";
import countries from '../../data/country.json';
const { TextArea } = Input;

export default function CreateLocation() {
    const { id } = useParams();
    const [form] = Form.useForm<Location>();
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
            const dataFetch = await LocationService.getPostById(Number(id));
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
            setIsTitle("Update Location");
            setIsEditMode(true);
            fetchDataByUUID();
        } else {
            setIsTitle("Create Location");
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
                const { error } = await LocationService.updatePost(Number(id), values);

                if (error) throw message.error(error.message);
                message.success("Record updated successfully");
            } else {
                // Create new record
                setLoading(true);
                const { error } = await LocationService.createPost(allValues);

                if (error) throw message.error(error.message);
                message.success("Record created successfully");
            }

            setLoading(false);
            form.resetFields();
            navigate("/inventory/settings/locations");
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
                            title: "Location",
                        },
                        {
                            title: "Form",
                        },
                    ]}
                />
                <p className="text-1xl font-extrabold bg-gradient-to-r from-blue-900 to-blue-950 text-transparent bg-clip-text tracking-wide uppercase drop-shadow-lg">{isTitle}</p>
                <Link to={'/inventory/settings/locations'}>
                    <Button className="mb-2" icon={<AiOutlineRollback />}>Back</Button>
                </Link>
            </div>

            <Card>
                <Form
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
                                label="Location Name"
                                name="name"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please input location name!",
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

                        <Col xs={24} sm={24}>
                            <Form.Item
                                label="Notes"
                                name="notes"
                            >
                                <TextArea rows={4} placeholder="(Optional)" />
                            </Form.Item>
                        </Col>

                    </Row>

                    <Divider />

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
            </Card>
        </div>
    );
}