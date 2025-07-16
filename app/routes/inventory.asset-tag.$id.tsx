import { HomeOutlined, InfoCircleOutlined, SettingOutlined } from "@ant-design/icons";
import { useNavigate } from "@remix-run/react";
import {
    Alert,
    Breadcrumb,
    Button,
    Checkbox,
    Dropdown,
    Form,
    Input,
    MenuProps,
    message,
    Modal,
    Popconfirm,
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
} from "react-icons/ai";
import { RiCircleFill } from "react-icons/ri";
import { FcRefresh } from "react-icons/fc";
import { Link, useParams } from "react-router-dom";
import Checkout from "~/components/checkout";
import PrintDropdownComponent from "~/components/print_dropdown";
import { AssetService } from "~/services/asset.service";
import { Asset } from "~/types/asset.type";

export default function AssetTag() {
    const { id } = useParams();
    const [data, setData] = useState<Asset[]>([]);
    const [dataRow, setDataRow] = useState<Asset>();
    const [loading, setLoading] = useState(false);
    const [isUserID, setUserID] = useState<any>();
    const [isDepartmentID, setDepartmentID] = useState<any>();
    const [searchText, setSearchText] = useState('');
    const [filteredData, setFilteredData] = useState<Asset[]>([]);

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
            const dataFetch = await AssetService.getAllAssetTagByID(isDepartmentID, Number(id));
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
            const filtered = data[0].asset_tag.filter((value: any) =>
                value.asset_tag.toLowerCase().includes(searchText.toLowerCase())
            );
            setFilteredData(filtered);
        }
    }, [searchText]); // Empty dependency array means this runs once on mount

    const handleCheckoutButton = (values: Asset) => {
        // Include your extra field
        const newValues = {
            ...values,
            status_id: 1,
            user_id: isUserID,
            department_id: Number(isDepartmentID),
            categories: data[0].asset_model.categories,
            assets_id: data[0].id,
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
        "Asset Tag": true,
        "Serial": true,
        "Status Type": true,
        "Checked Out To": true,
        "Checkout": true,
    });

    const columns: TableColumnsType<Asset> = [
        {
            title: "Asset Tag",
            dataIndex: "asset_tag",
            width: 120,
            render: (text) => text || 'N/A'
        },
        {
            title: "Serial",
            dataIndex: "serial",
            width: 120,
            render: (text) => text || 'N/A'
        },
        {
            title: "Status Type",
            dataIndex: "status_type",
            width: 120,
            render: (_, record, index) => {
                return (
                    <div>
                        {record.status_type === 'Pending' && (
                            <span className="flex flex-wrap"><RiCircleFill className="text-orange-500 mt-1 mr-2" /> Pending</span>
                        )}
                        {record.status_type === 'Ready to Deploy' && (
                            <span className="flex flex-wrap"><RiCircleFill className="text-green-500 mt-1 mr-2" /> Ready to Deploy</span>
                        )}
                        {record.status_type === 'Archived' && (
                            <span className="flex flex-wrap"><RiCircleFill className="text-blue-500 mt-1 mr-2" /> Archived</span>
                        )}
                        {record.status_type === 'Broken - Not Fixable' && (
                            <span className="flex flex-wrap"><RiCircleFill className="text-red-500 mt-1 mr-2" /> Broken - Not Fixable</span>
                        )}
                        {record.status_type === 'Lost/Stolen' && (
                            <span className="flex flex-wrap"><RiCircleFill className="text-gray-500 mt-1 mr-2" /> Lost/Stolen</span>
                        )}
                        {record.status_type === 'Out for Repair' && (
                            <span className="flex flex-wrap"><RiCircleFill className="text-yellow-500 mt-1 mr-2" /> Out for Repair</span>
                        )}
                    </div>
                );
            }
        },
        {
            title: "Checked Out To",
            dataIndex: "checkedout_to",
            width: 120,
            render: (_, record) => {
                // Find the corresponding item in data[0].assets_check that matches this record
                const checkedOutItem = data[0]?.assets_check.find(
                    item => item.asset_tag === record.asset_tag // or some other matching property
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
                const currentName = data[0]?.assets_check.find(
                    item => item.asset_tag === record.asset_tag // or some other matching property
                );
                const isDisabled = currentName !== undefined;

                return (
                    <div>
                        <Popconfirm
                            disabled={isDisabled}
                            title="Do you want to checkout?"
                            description="Are you sure to checkout this asset?"
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

    const onChange: TableProps<Asset>["onChange"] = (
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
                title="Check-out Asset"
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
                            title: "Assets",
                        },
                    ]}
                />
                <Link to={'/inventory/assets'}>
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
                <Table<Asset>
                    size="small"
                    columns={filteredColumns}
                    dataSource={searchText ? filteredData : data[0]?.asset_tag}
                    onChange={onChange}
                    className="pt-5"
                    bordered
                    scroll={{ x: "max-content" }}
                />
            )}
        </div>
    );
}
