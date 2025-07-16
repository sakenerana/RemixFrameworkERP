import { CheckCircleOutlined, HomeOutlined, SettingOutlined } from "@ant-design/icons";
import { Link } from "@remix-run/react";
import { Alert, Breadcrumb, Button, Checkbox, Dropdown, Input, MenuProps, message, Popconfirm, Space, Spin, Table, TableColumnsType, TableProps, Tag } from "antd";
import { useEffect, useMemo, useState } from "react";
import { AiOutlineCloseCircle, AiOutlineDelete, AiOutlineEdit, AiOutlineRollback } from "react-icons/ai";
import { FcRefresh } from "react-icons/fc";
import PrintDropdownComponent from "~/components/print_dropdown";
import { ConsumableService } from "~/services/consumable.service";
import { Consumable } from "~/types/consumable.type";

export default function DeletedConsumables() {
    const [data, setData] = useState<Consumable[]>([]);
    const [loading, setLoading] = useState(false);
    const [isUserID, setUserID] = useState<any>();
    const [isDepartmentID, setDepartmentID] = useState<any>();

    const [searchText, setSearchText] = useState('');
    const [filteredData, setFilteredData] = useState<Consumable[]>([]);

    const handleRefetch = async () => {
        setLoading(true);
        await fetchData();
        setLoading(false);
    };

    const handleActivateButton = async (record: Consumable) => {
        const { error } = await ConsumableService.activateStatus(
            record.id,
            record
        );

        if (error) throw message.error(error.message);
        message.success("Record deactivated successfully");
        fetchData();
    };

    // Fetch data from Supabase
    const fetchData = async () => {
        try {
            setLoading(true);
            const dataFetch = await ConsumableService.getAllPostsInactive(isDepartmentID);
            setData(dataFetch); // Works in React state
            console.log("teast", dataFetch)
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

    // State for column visibility
    const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({
        "Name": true,
        "Asset Category": true,
        "Company": false,
        "Model No.": true,
        "Manufacturer": false,
        "Supplier": false,
        "Location": false,
        "Min. QTY": false,
        "Qty": true,
        "Checked Out No.": true,
        "Checked Out": false,
        "Purchase Date": false,
        "Purchase Cost": true,
        "Order Number": false,
        "Notes": false,
        "Status": true,
        "Actions": true,
        "Checkout": true,
    });

    const columns: TableColumnsType<Consumable> = [
        {
            title: "Name",
            dataIndex: "name",
            width: 120,
            render: (text) => text || 'N/A'
        },
        {
            title: "Asset Category",
            dataIndex: "categories",
            width: 120,
            render: (categories) => categories?.name || 'N/A'
        },
        {
            title: "Company",
            dataIndex: "companies",
            width: 120,
            render: (companies) => companies?.name || 'N/A'
        },
        {
            title: "Model No.",
            dataIndex: "model_no",
            width: 120,
            render: (text) => text || 'N/A'
        },
        {
            title: "Manufacturer",
            dataIndex: "manufacturers",
            width: 120,
            render: (manufacturers) => manufacturers?.name || 'N/A'
        },
        {
            title: "Supplier",
            dataIndex: "suppliers",
            width: 120,
            render: (suppliers) => suppliers?.name || 'N/A'
        },
        {
            title: "Location",
            dataIndex: "locations",
            width: 120,
            render: (locations) => locations?.name || 'N/A'
        },
        {
            title: "Min. QTY",
            dataIndex: "min_qty",
            width: 120,
            render: (text) => text || 0
        },
        {
            title: "Qty",
            dataIndex: "qty",
            width: 120,
            render: (text) => text || 0
        },
        {
            title: "Checked Out No.",
            dataIndex: "qty",
            width: 120,
            render: (text) => text || 0
        },
        {
            title: "Checked Out",
            dataIndex: "checked_out",
            width: 120,
            render: (text) => text || 'N/A'
        },
        {
            title: "Purchase Date",
            dataIndex: "purchase_date",
            width: 120,
            render: (text) => text || 'N/A'
        },
        {
            title: "Purchase Cost",
            dataIndex: "purchase_cost",
            width: 120,
            render: (text) =>
                text !== null && text !== undefined
                    ? `₱${parseFloat(text).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                    : 'N/A'
        },
        {
            title: "Order Number",
            dataIndex: "order_no",
            width: 120,
            render: (text) => text || 'N/A'
        },
        {
            title: "Notes",
            dataIndex: "notes",
            width: 120,
            render: (text) => text || 'N/A'
        },
        {
            title: "Status",
            dataIndex: "status",
            width: 120,
            render: (_, record) => {
                if (record.status_labels.name === 'Active') {
                    return (
                        <Tag color="green">
                            <CheckCircleOutlined className="float-left mt-1 mr-1" /> Active
                        </Tag>
                    );
                } else if (record.status_labels.name === 'Inactive') {
                    return (
                        <Tag color="red">
                            <AiOutlineCloseCircle className="float-left mt-1 mr-1" /> Inactive
                        </Tag>
                    );
                }
            },
        },
        {
            title: "Actions",
            dataIndex: "actions",
            width: 190,
            fixed: "right",
            render: (_, record) => (
                <div className="flex">
                    <Popconfirm
                        title="Do you want to activate?"
                        description="Are you sure to activate this consumable?"
                        okText="Yes"
                        cancelText="No"
                        onConfirm={() => handleActivateButton(record)}
                    >
                        {record.status_labels.name === 'Active' && (
                            <Tag
                                className="cursor-pointer"
                                icon={<AiOutlineDelete className="float-left mt-1 mr-1" />}
                                color="#f50"
                            >
                                Deactivate
                            </Tag>
                        )}
                        {record.status_labels.name === 'Inactive' && (
                            <Tag
                                className="cursor-pointer"
                                icon={<AiOutlineDelete className="float-left mt-1 mr-1" />}
                                color="#1677ff"
                            >
                                Activate
                            </Tag>
                        )}
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
    const columnMenuItems: MenuProps['items'] = [
        {
            type: 'group',
            label: 'Select Column for Visibility',
            children: [
                // Split into two columns
                {
                    key: 'column-group-1',
                    style: { display: 'inline-block', width: '50%' },
                    label: (
                        <div>
                            {Object.keys(columnVisibility)
                                .slice(0, Math.ceil(Object.keys(columnVisibility).length / 2))
                                .map(columnTitle => (
                                    <div key={columnTitle} style={{ padding: '4px 0' }}>
                                        <Checkbox
                                            checked={columnVisibility[columnTitle]}
                                            onChange={() => toggleColumn(columnTitle)}
                                        >
                                            {columnTitle}
                                        </Checkbox>
                                    </div>
                                ))}
                        </div>
                    ),
                },
                {
                    key: 'column-group-2',
                    style: { display: 'inline-block', width: '50%' },
                    label: (
                        <div>
                            {Object.keys(columnVisibility)
                                .slice(Math.ceil(Object.keys(columnVisibility).length / 2))
                                .map(columnTitle => (
                                    <div key={columnTitle} style={{ padding: '4px 0' }}>
                                        <Checkbox
                                            checked={columnVisibility[columnTitle]}
                                            onChange={() => toggleColumn(columnTitle)}
                                        >
                                            {columnTitle}
                                        </Checkbox>
                                    </div>
                                ))}
                        </div>
                    ),
                },
            ],
        },
    ];

    // Filter columns based on visibility
    const filteredColumns = columns.filter(column =>
        column.title ? columnVisibility[column.title.toString()] : true
    );

    const onChange: TableProps<Consumable>["onChange"] = (
        pagination,
        filters,
        sorter,
        extra
    ) => {
        console.log("params", pagination, filters, sorter, extra);
    };

    return (
        <div>
            <div className="flex pb-5 justify-between">
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
                            title: "Consumable",
                        },
                        {
                            title: "Inactive",
                        },
                    ]}
                />
                <Link to={'/inventory/consumables'}>
                    <Button icon={<AiOutlineRollback />}>Back</Button>
                </Link>
            </div>
            <div className="flex justify-between">
                <Alert
                    message="Note: This is the list of all inactive consumables. Please check closely."
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
                    onChange={onChange}
                    className="pt-5"
                    bordered
                    scroll={{ x: "max-content" }}
                />
            )}
        </div>
    );
}