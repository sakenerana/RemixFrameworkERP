import { LoadingOutlined } from "@ant-design/icons";
import { Button, Col, DatePicker, Form, Input, message, Modal, Row } from "antd";
import { useEffect, useMemo, useState } from "react";
import { AiOutlineSend } from "react-icons/ai";
import { AccessoryService } from "~/services/accessory.service";
import { ComponentService } from "~/services/component.service";
import { ConsumableService } from "~/services/consumable.service";
import { PredefinedKitService } from "~/services/predefined_kit.service";
const { TextArea } = Input;

interface CheckoutProps {
    stateData: any;
    onSuccess?: () => void; // Callback for parent component
    onClose?: () => void; // Callback to close modal
}

export default function Checkout({ stateData, onSuccess, onClose }: CheckoutProps) {
    const [form] = Form.useForm<any>();
    const [loading, setLoading] = useState(false);
    const [isUserID, setUserID] = useState<any>();
    const [isDepartmentID, setDepartmentID] = useState<any>();

    useEffect(() => {
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

    const onFinish = async () => {
        try {
            const values = await form.validateFields();


            if (stateData.categories && stateData.categories.type === "Component") {
                var allValues = {
                    ...values,
                    status_id: 1,
                    user_id: isUserID,
                    department_id: Number(isDepartmentID),
                    component_id: stateData.id,
                };
            } else if (stateData.categories && stateData.categories.type === "Consumable") {
                var allValues = {
                    ...values,
                    status_id: 1,
                    user_id: isUserID,
                    department_id: Number(isDepartmentID),
                    consumable_id: stateData.id,
                };
            } else if (stateData.categories && stateData.categories.type === "Accessory") {
                var allValues = {
                    ...values,
                    status_id: 1,
                    user_id: isUserID,
                    department_id: Number(isDepartmentID),
                    accessory_id: stateData.id,
                };
            } else {
                var allValues = {
                    ...values,
                    status_id: 1,
                    user_id: isUserID,
                    department_id: Number(isDepartmentID),
                    predefined_id: stateData.id,
                };
                // Runs otherwise (including if categories is missing)
            }

            setLoading(true);

            if (stateData.categories && stateData.categories.type === "Component") {
                const { error } = await ComponentService.createPostComponentCheck(allValues);

                if (error) throw new Error(error.message);

                message.success("Record component checked out successfully");
                form.resetFields();
            } else if (stateData.categories && stateData.categories.type === "Consumable") {
                const { error } = await ConsumableService.createPostConsumableCheck(allValues);

                if (error) throw new Error(error.message);

                message.success("Record consumable checked out successfully");
                form.resetFields();
            } else if (stateData.categories && stateData.categories.type === "Accessory") {
                const { error } = await AccessoryService.createPostAccessoriesCheck(allValues);

                if (error) throw new Error(error.message);

                message.success("Record accessory checked out successfully");
                form.resetFields();
            } else {
                const { error } = await PredefinedKitService.createPostPredefinedCheck(allValues);

                if (error) throw new Error(error.message);

                message.success("Record predefined checked out successfully");
                form.resetFields();
            }

            // Notify parent component
            if (onSuccess) onSuccess();
            if (onClose) onClose();

        } catch (error) {
            message.error("Error during checkout");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <p><span className="font-bold">Reference ID:</span> {stateData.id}</p>
            <p><span className="font-bold">Reference Name:</span> {stateData.name}</p>
            <Form
                className="mt-5"
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{
                    notification: true,
                    interests: ["sports", "music"],
                }}
            >
                <Row gutter={24}>
                    <Col xs={24} sm={24}>
                        {stateData.categories && stateData.categories.type === "Consumable" && (
                            <Form.Item
                                label="Item No."
                                name="item_no"
                                rules={[{ required: true, message: "Please input item number!" }]}
                            >
                                <Input placeholder="Item No." />
                            </Form.Item>
                        )}

                        {stateData.categories && stateData.categories.type === "Accessory" && (
                            <Form.Item
                                label="Model No."
                                name="model_no"
                                rules={[{ required: true, message: "Please input model number!" }]}
                            >
                                <Input placeholder="Model No." />
                            </Form.Item>
                        )}

                        <Form.Item
                            label="Name/Username"
                            name="name"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input name!",
                                },
                            ]}
                        >
                            <Input placeholder="Name" />
                        </Form.Item>

                        <Form.Item
                            label="Checkout Date"
                            name="checkout_date"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input name!",
                                },
                            ]}
                        >
                            <DatePicker className="w-full" />
                        </Form.Item>

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
                        className="w-full sm:w-auto bg-green-600 hover:bg-green-700 focus:bg-green-700 border-green-600 hover:border-green-700 focus:border-green-700"
                        style={{ backgroundColor: '#16a34a', borderColor: '#16a34a' }} // Alternative to Tailwind classes
                        size="large"
                    >
                        <p className="text-white">Checkout</p>
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}