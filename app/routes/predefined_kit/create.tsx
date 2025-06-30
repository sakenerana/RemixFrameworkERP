import { HomeOutlined, LoadingOutlined } from "@ant-design/icons";
import { useParams } from "@remix-run/react";
import { Breadcrumb, Button, Col, DatePicker, Form, Input, message, Modal, Row, Select } from "antd";
import { useMemo, useState } from "react";
import { AiOutlineRollback, AiOutlineSend } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { PredefinedKitService } from "~/services/predefined_kit.service";
import { PredefinedKit } from "~/types/predefined_kit.type";
import moment from 'moment';

export default function CreateManufacturer() {
    const { id } = useParams();
    const [form] = Form.useForm<PredefinedKit>();
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
            const dataFetch = await PredefinedKitService.getPostById(Number(id));
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
            setIsTitle("Update Predefined Kit");
            setIsEditMode(true);
            fetchDataByUUID();
        } else {
            setIsTitle("Create Predefined Kit");
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
                const { error } = await PredefinedKitService.updatePost(Number(id), values);

                if (error) throw message.error(error.message);
                message.success("Record updated successfully");
            } else {
                // Create new record
                setLoading(true);
                const { error } = await PredefinedKitService.createPost(allValues);

                if (error) throw message.error(error.message);
                message.success("Record created successfully");
            }

            setLoading(false);
            form.resetFields();
            navigate("/inventory/predefined-kit");
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
                            title: "Accessories",
                        },
                        {
                            title: "Form",
                        },
                    ]}
                />
                <p className="text-1xl font-extrabold bg-gradient-to-r from-blue-900 to-blue-950 text-transparent bg-clip-text tracking-wide uppercase drop-shadow-lg">{isTitle}</p>
                <Link to={'/inventory/predefined-kit'}>
                    <Button className="mb-2" icon={<AiOutlineRollback />}>Back</Button>
                </Link>
            </div>

            <Form
                className="p-5 border border-gray-200"
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{
                    notification: true,
                    interests: ["sports", "music"],
                }}
            >
                <Row gutter={24}>
                    <Col xs={24} sm={12}>
                        <Form.Item
                            label="Predefined Kit Name"
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input predefined kit name!",
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={12}>
                        <Form.Item
                            label="Qty"
                            name="qty"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input predefined kit qty!",
                                },
                            ]}
                        >
                            <Input type="number" />
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={12}>
                        <Form.Item
                            label="Min Qty"
                            name="min_qty"
                        >
                            <Input type="number" />
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