import { HomeOutlined, InfoCircleOutlined, LoadingOutlined, SettingOutlined } from "@ant-design/icons";
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
    Tooltip,
} from "antd";
import { useEffect, useMemo, useState } from "react";
import {
    AiOutlineExport,
    AiOutlineRollback,
    AiOutlineSend,
} from "react-icons/ai";
import { FcRefresh } from "react-icons/fc";
import { Link, useParams } from "react-router-dom";
import Checkout from "~/components/checkout";
import PrintDropdownComponent from "~/components/print_dropdown";
import { LicenseService } from "~/services/license.service";
import { License } from "~/types/license.type";

export default function ProductKey() {
    const { id } = useParams();
    const [data, setData] = useState<License[]>([]);
    const [dataRow, setDataRow] = useState<License>();
    const [loading, setLoading] = useState(false);
    const [isUserID, setUserID] = useState<any>();
    const [isDepartmentID, setDepartmentID] = useState<any>();
    const [searchText, setSearchText] = useState('');
    const [filteredData, setFilteredData] = useState<License[]>([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const [form] = Form.useForm<any>();

    const navigate = useNavigate();

    const handleSuccess = () => {
        setIsModalOpen(false);
        setRefreshKey(prev => prev + 1); // Triggers data refresh
    };

    const handleRefetch = async () => {
        setLoading(true);
        await fetchData();
        setLoading(false);
    };

    // Fetch data from Supabase
    const fetchData = async () => {
        try {
            setLoading(true);
            const dataFetch = await LicenseService.getAllProductKeyByID(isDepartmentID, Number(id));
            setData(dataFetch); // Works in React state
            // console.log("FILTER", dataFetch)
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
            const filtered = data[0].product_key.filter((value: any) =>
                // console.log("FILTER!!", value)
                value.product_key.toLowerCase().includes(searchText.toLowerCase())
            );
            setFilteredData(filtered);
        }
    }, [searchText]); // Empty dependency array means this runs once on mount

    const handleCheckoutButton = (values: License) => {
        // Include your extra field
        const newValues = {
            ...values,
            status_id: 1,
            user_id: isUserID,
            department_id: Number(isDepartmentID),
            categories: data[0].categories,
            license_id: data[0].id,
            name: data[0].name
        };

        setIsModalOpen(true);
        setDataRow(newValues);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
    };

    // State for column visibility
    const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({
        "Product Key": true,
        "Checked Out To": true,
        "Checkout": true,
    });

    const columns: TableColumnsType<License> = [
        {
            title: "Product Key",
            dataIndex: "product_key",
            width: 350,
            render: (text) => text || 'N/A'
        },
        {
            title: "Checked Out To",
            dataIndex: "checkedout_to",
            width: 350,
            render: (_, record) => {
                // Find the corresponding item in data[0].license_check that matches this record
                const checkedOutItem = data[0]?.license_check.find(
                    item => item.product_key === record.product_key // or some other matching property
                );
                return <div>{checkedOutItem?.name || 'N/A'}</div>;
            }
        },
        {
            title: "Checkout",
            dataIndex: "checkout",
            width: 120,
            fixed: "right",
            render: (_, record, index) => {
                const currentName = data[0]?.license_check.find(
                    item => item.product_key === record.product_key // or some other matching property
                );
                const isDisabled = currentName !== undefined;

                return (
                    <div>
                        <Popconfirm
                            disabled={isDisabled}
                            title="Do you want to checkout?"
                            description="Are you sure to checkout this product key?"
                            okText="Yes"
                            cancelText="No"
                            onConfirm={() => handleCheckoutButton(record)}
                        >
                            <Tag
                                className={`cursor-pointer ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                                icon={<AiOutlineExport className="float-left mt-1 mr-1" />}
                                color={isDisabled ? "#d9d9d9" : "#3fd168"} // Gray when disabled, green when enabled
                            >
                                {isDisabled ? 'Completed' : 'Check-out'}
                            </Tag>
                        </Popconfirm>
                        {isDisabled && (
                            <Tooltip title="All items have been checked out">
                                <InfoCircleOutlined className="ml-2 text-gray-400" />
                            </Tooltip>
                        )}
                    </div>
                );
            },
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

    const onChange: TableProps<License>["onChange"] = (
        pagination,
        filters,
        sorter,
        extra
    ) => {
        console.log("params", pagination, filters, sorter, extra);
    };

    return (
        <div>
            <Modal
                style={{ top: 20 }}
                width={420}
                title="Check-out License"
                closable={{ "aria-label": "Custom Close Button" }}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                footer=""
            >
                <Checkout stateData={dataRow} onSuccess={handleSuccess} onClose={() => { setIsModalOpen(false), fetchData() }}></Checkout>
            </Modal>
            <div className="flex pb-5 justify-between">
                <Breadcrumb
                    items={[
                        {
                            href: "/inventory",
                            title: <HomeOutlined />,
                        },
                        {
                            title: "licenses",
                        },
                    ]}
                />
                <Link to={'/inventory/licenses'}>
                    <Button icon={<AiOutlineRollback />}>Back</Button>
                </Link>
            </div>
            <div className="flex justify-between">
                <Alert
                    message={
                        <span>
                            Note: This is the list of all product key of <strong>{data[0]?.name || 'items'}</strong>. Please check closely.
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
                <Table<License>
                    size="small"
                    columns={filteredColumns}
                    dataSource={searchText ? filteredData : data[0]?.product_key}
                    onChange={onChange}
                    className="pt-5"
                    bordered
                    scroll={{ x: "max-content" }}
                />
            )}
        </div>
    );
}
