import { LoadingOutlined } from "@ant-design/icons";
import { Button, Col, DatePicker, Form, Input, message, Modal, Row } from "antd";
import { useEffect, useMemo, useState } from "react";
import { AiOutlineCalendar, AiOutlineSend } from "react-icons/ai";
import { AccessoryService } from "~/services/accessory.service";
import { AssetService } from "~/services/asset.service";
import { ComponentService } from "~/services/component.service";
import { ConsumableService } from "~/services/consumable.service";
import { LicenseService } from "~/services/license.service";
import { PredefinedKitService } from "~/services/predefined_kit.service";
const { TextArea } = Input;
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import utc from 'dayjs/plugin/utc';

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
                    checkout_date: values.checkout_date
                        ? dayjs(values.checkout_date).format('YYYY-MM-DD')
                        : null,
                    status_id: 1,
                    user_id: isUserID,
                    department_id: Number(isDepartmentID),
                    component_id: stateData.id,
                };
            } else if (stateData.categories && stateData.categories.type === "Consumable") {
                var allValues = {
                    ...values,
                    checkout_date: values.checkout_date
                        ? dayjs(values.checkout_date).format('YYYY-MM-DD')
                        : null,
                    status_id: 1,
                    user_id: isUserID,
                    department_id: Number(isDepartmentID),
                    consumable_id: stateData.id,
                };
            } else if (stateData.categories && stateData.categories.type === "Accessory") {
                var allValues = {
                    ...values,
                    checkout_date: values.checkout_date
                        ? dayjs(values.checkout_date).format('YYYY-MM-DD')
                        : null,
                    status_id: 1,
                    user_id: isUserID,
                    department_id: Number(isDepartmentID),
                    accessory_id: stateData.id,
                };
            } else if (stateData.categories && stateData.categories.type === "License") {
                var allValues = {
                    ...values,
                    checkout_date: values.checkout_date
                        ? dayjs(values.checkout_date).format('YYYY-MM-DD')
                        : null,
                    status_id: 1,
                    user_id: isUserID,
                    department_id: Number(isDepartmentID),
                    license_id: stateData.license_id,
                    product_key: stateData.product_key,
                };
            } else if (stateData.categories && stateData.categories.type === "Asset") {
                var allValues = {
                    ...values,
                    checkout_date: values.checkout_date
                        ? dayjs(values.checkout_date).format('YYYY-MM-DD')
                        : null,
                    status_id: 1,
                    user_id: isUserID,
                    department_id: Number(isDepartmentID),
                    assets_id: stateData.assets_id,
                    asset_tag: stateData.asset_tag,
                };
            } else {
                var allValues = {
                    ...values,
                    checkout_date: values.checkout_date
                        ? dayjs(values.checkout_date).format('YYYY-MM-DD')
                        : null,
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
            } else if (stateData.categories && stateData.categories.type === "License") {
                const { error } = await LicenseService.createPostLicenseCheck(allValues);

                if (error) throw new Error(error.message);

                message.success("Record license checked out successfully");
                form.resetFields();
            } else if (stateData.categories && stateData.categories.type === "Asset") {
                const { error } = await AssetService.createPostAssetsCheck(allValues);

                if (error) throw new Error(error.message);

                message.success("Record asset checked out successfully");
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
        <div className="max-w-3xl mx-auto rounded-lg shadow-sm">
            {/* Header Section */}
            <div className="mb-6 border-b pb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                        <p className="text-sm">Reference ID</p>
                        <p className="font-medium">{stateData.id}</p>
                    </div>

                    {stateData.categories?.type === "License" && (
                        <div>
                            <p className="text-sm">Product Key</p>
                            <p className="font-medium">{stateData.product_key}</p>
                        </div>
                    )}

                    {stateData.categories?.type === "Asset" && (
                        <div>
                            <p className="text-sm">Asset Tag</p>
                            <p className="font-medium">{stateData.asset_tag}</p>
                        </div>
                    )}

                    <div className="md:col-span-2">
                        <p className="text-sm">Reference Name</p>
                        <p className="font-medium">{stateData.name}</p>
                    </div>
                </div>
            </div>

            {/* Form Section */}
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
                    <Col xs={24} sm={24}>
                        {stateData.categories?.type === "Consumable" && (
                            <Form.Item
                                label={<span className="font-medium">Item No.</span>}
                                name="item_no"
                                rules={[{ required: true, message: "Please input item number" }]}
                            >
                                <Input
                                    placeholder="Enter item number"
                                    className="py-2"
                                />
                            </Form.Item>
                        )}

                        {stateData.categories?.type === "Accessory" && (
                            <Form.Item
                                label={<span className="font-medium">Model No.</span>}
                                name="model_no"
                                rules={[{ required: true, message: "Please input model number" }]}
                            >
                                <Input
                                    placeholder="Enter model number"
                                    className="py-2"
                                />
                            </Form.Item>
                        )}

                        <Form.Item
                            label={<span className="font-medium">Name/Username</span>}
                            name="name"
                            rules={[{ required: true, message: "Please input name" }]}
                        >
                            <Input
                                placeholder="Enter name or username"
                                className="py-2"
                            />
                        </Form.Item>

                        <Form.Item
                            label={<span className="font-medium">Checkout Date</span>}
                            name="checkout_date"
                            rules={[{ required: true, message: "Please select checkout date" }]}
                            getValueFromEvent={(date) => date} // Receives Day.js object directly
                            getValueProps={(value) => ({ value: value ? dayjs(value, 'YYYY-MM-DD') : null })}
                        >
                            <DatePicker
                                className="w-full h-10"
                                format="YYYY-MM-DD"
                                suffixIcon={<AiOutlineCalendar className="text-gray-400" />}
                            />
                        </Form.Item>

                        <Form.Item
                            label={<span className="font-medium">Notes</span>}
                            name="notes"
                        >
                            <TextArea
                                rows={4}
                                placeholder="Add any additional notes (optional)"
                                className="py-2"
                            />
                        </Form.Item>
                    </Col>
                </Row>

                {/* Form Actions */}
                <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8 pt-4 border-t">
                    <Button
                        onClick={onReset}
                        type="default"
                        size="large"
                        className="w-full sm:w-auto h-11 px- hover:border-gray-400"
                    >
                        Reset
                    </Button>
                    <Button
                        type="primary"
                        htmlType="submit"
                        size="large"
                        className="w-full sm:w-auto h-11 px-6 bg-green-600 hover:bg-green-700 border-green-600 hover:border-green-700"
                        loading={loading}
                        icon={!loading && <AiOutlineSend className="text-lg" />}
                    >
                        Complete Checkout
                    </Button>
                </div>
            </Form>
        </div>
    );
}