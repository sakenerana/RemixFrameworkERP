import { CalendarOutlined, HomeOutlined, LoadingOutlined, SettingOutlined } from "@ant-design/icons";
import { useNavigate } from "@remix-run/react";
import {
    Alert,
    Breadcrumb,
    Button,
    Checkbox,
    Col,
    Dropdown,
    Form,
    Input,
    MenuProps,
    message,
    Modal,
    Popconfirm,
    Row,
    Space,
    Spin,
    Table,
    TableColumnsType,
    TableProps,
    Tag,
} from "antd";
import { useEffect, useMemo, useState } from "react";
import {
    AiOutlineExport,
    AiOutlineRollback,
    AiOutlineSend,
} from "react-icons/ai";
import { FcRefresh } from "react-icons/fc";
import { Link, useParams } from "react-router-dom";
import PrintDropdownComponent from "~/components/print_dropdown";
import { ConsumableService } from "~/services/consumable.service";
import { Consumable } from "~/types/consumable.type";
import dayjs from 'dayjs';

export default function Checkedout() {
    const { id } = useParams();
    const [data, setData] = useState<Consumable[]>([]);
    const [dataRow, setDataRow] = useState<Consumable>();
    const [loading, setLoading] = useState(false);
    const [isUserID, setUserID] = useState<any>();
    const [isDepartmentID, setDepartmentID] = useState<any>();

    const [searchText, setSearchText] = useState('');
    const [filteredData, setFilteredData] = useState<Consumable[]>([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm<any>();

    const navigate = useNavigate();

    const handleRefetch = async () => {
        setLoading(true);
        await fetchData();
        setLoading(false);
    };

    // Fetch data from Supabase
    const fetchData = async () => {
        try {
            setLoading(true);
            const dataFetch = await ConsumableService.getAllChecked(isDepartmentID, Number(id));
            setData(dataFetch); // Works in React state
        } catch (error) {
            message.error("error");
        } finally {
            setLoading(false);
        }
    };

    useMemo(() => {
        setUserID(localStorage.getItem('userAuthID'));
        setDepartmentID(localStorage.getItem('userDept'));
    }, []);

    useEffect(() => {
        if (searchText.trim() === '') {
            fetchData();
        } else {
            const filtered = data.filter(data =>
                data.name?.toLowerCase().includes(searchText.toLowerCase())
            );
            setFilteredData(filtered);
        }
    }, [searchText]); // Empty dependency array means this runs once on mount

    const handleCheckinButton = (data: Consumable) => {
        setIsModalOpen(true);
        setDataRow(data);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
    };

    // Create or Update record
    const onFinish = async () => {
        try {

            const values = await form.validateFields();


            if (values.checkin?.toLowerCase() === 'checkin') {
                try {
                    setLoading(true);

                    // Validate we have an ID to delete
                    if (!dataRow?.id) {
                        throw new Error('Invalid record ID');
                    }

                    // Remove existing record
                    const success = await ConsumableService.deleteConsumableCheck(Number(dataRow.id));
                    if (!success) throw new Error("Checkin operation failed.");

                    message.success("Record checked-in successfully");

                    // Close modal and reset only after successful operation
                    setIsModalOpen(false);
                    form.resetFields();

                    // Refresh parent data
                    if (fetchData) fetchData();

                } catch (error) {
                    message.error("Check-in failed");
                } finally {
                    setLoading(false); // Ensure loading state is always reset
                }
            } else {
                message.error("Please type 'checkin' exactly to confirm");
            }


        } catch (error) {
            message.error("Error");
        }
    };

    // State for column visibility
    const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({
        "Name": true,
        "Item No.": true,
        "Checked Out Date": true,
        "Notes": true,
        "Checkin": true,
    });

    const columns: TableColumnsType<Consumable> = [
        {
            title: "Name",
            dataIndex: "name",
            width: 350,
            render: (text) => text || 'N/A'
        },
        {
            title: "Item No.",
            dataIndex: "item_no",
            width: 120,
            render: (text) => text || 'N/A'
        },
        {
            title: "Checked Out Date",
            dataIndex: "checkout_date",
            width: 350,
            render: (dateString) => (
                <div className="flex items-center">
                    <CalendarOutlined className="mr-2 text-gray-400" />
                    <div className="flex flex-col">
                        <span className="text-sm">
                            {dayjs(dateString).format('MMM DD YYYY')} {/* Date */}
                        </span>
                    </div>
                </div>
            )
        },
        {
            title: "Notes",
            dataIndex: "notes",
            width: 350,
            render: (text) => text || 'N/A'
        },
        {
            title: "Checkin",
            dataIndex: "checkin",
            width: 120,
            fixed: "right",
            render: (_, data) => (
                <div>
                    <Popconfirm
                        title="Do you want to checkin?"
                        description="Are you sure to checkin this consumable?"
                        okText="Yes"
                        cancelText="No"
                        onConfirm={() => handleCheckinButton(data)}
                    >
                        <Tag
                            className="cursor-pointer"
                            icon={<AiOutlineExport className="float-left mt-1 mr-1" />}
                            color="#1677ff"
                        >
                            Check-in
                        </Tag>
                    </Popconfirm>
                </div>
            ),
        },
    ];

    // Toggle column visibility
    const toggleColumn = (columnTitle: string) => {
        setColumnVisibility(prev => ({
            ...prev,
            [columnTitle]: !prev[columnTitle]
        }));
    };

    // Create dropdown menu items
    const columnMenuItems: MenuProps['items'] = Object.keys(columnVisibility).map(columnTitle => ({
        key: columnTitle,
        label: (
            <Checkbox
                checked={columnVisibility[columnTitle]}
                onClick={() => toggleColumn(columnTitle)}
            >
                {columnTitle}
            </Checkbox>
        ),
    }));

    // Filter columns based on visibility
    const filteredColumns = columns.filter(column =>
        column.title ? columnVisibility[column.title.toString()] : true
    );

    return (
        <div>
            <Modal
                style={{ top: 20 }}
                width={420}
                title="Check-In Consumable"
                closable={{ "aria-label": "Custom Close Button" }}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                footer=""
            >
                <p>Do you want to Checkin this item from <span className="font-bold">{dataRow?.name}</span>.</p>
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
                            <Form.Item
                                label="Please input 'checkin' to become valid."
                                name="checkin"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please input checkin!",
                                    },
                                ]}
                            >
                                <Input placeholder="checkin" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item className="flex flex-wrap justify-end">
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
                            Checkin
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            <div className="flex pb-5 justify-between">
                <Breadcrumb
                    items={[
                        {
                            href: "/inventory",
                            title: <HomeOutlined />,
                        },
                        {
                            title: "Consumables",
                        },
                    ]}
                />
                <Link to={'/inventory/consumables'}>
                    <Button icon={<AiOutlineRollback />}>Back</Button>
                </Link>
            </div>
            <div className="flex justify-between">
                <Alert
                    message={
                        <span>
                            Note: This is the list of all <strong>{data[0]?.consumables?.name || 'items'}</strong> item user. Please check closely.
                        </span>
                    }
                    type="info"
                    showIcon
                />
                <Space direction="horizontal">
                    <Space.Compact style={{ width: "100%" }}>
                        <Input.Search onChange={(e) => setSearchText(e.target.value)} placeholder="Search" />
                    </Space.Compact>
                    <Space wrap>
                        <Button onClick={handleRefetch} icon={<FcRefresh />} type="default">
                            Refresh
                        </Button>
                    </Space>
                    <Space wrap>
                        <Dropdown
                            menu={{ items: columnMenuItems }}
                            placement="bottomRight"
                            trigger={['click']}
                        >
                            <Button icon={<SettingOutlined />}>Columns</Button>
                        </Dropdown>
                        <PrintDropdownComponent stateData={data}></PrintDropdownComponent>
                    </Space>
                </Space>
            </div>
            {loading && <Spin></Spin>}
            {!loading && (
                <Table<Consumable>
                    size="small"
                    columns={filteredColumns}
                    dataSource={searchText ? filteredData : data}
                    className="pt-5"
                    bordered
                    scroll={{ x: "max-content" }}
                />
            )}
        </div>
    );
}
