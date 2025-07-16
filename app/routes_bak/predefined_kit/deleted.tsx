import { CheckCircleOutlined, HomeOutlined, SettingOutlined } from "@ant-design/icons";
import { Link } from "@remix-run/react";
import { Alert, Breadcrumb, Button, Checkbox, Dropdown, Input, MenuProps, message, Popconfirm, Space, Spin, Table, TableColumnsType, TableProps, Tag } from "antd";
import { useEffect, useMemo, useState } from "react";
import { AiOutlineCloseCircle, AiOutlineDelete, AiOutlineEdit, AiOutlineRollback } from "react-icons/ai";
import { FcRefresh } from "react-icons/fc";
import PrintDropdownComponent from "~/components/print_dropdown";
import { PredefinedKitService } from "~/services/predefined_kit.service";
import { PredefinedKit } from "~/types/predefined_kit.type";

export default function DeletedManufacturer() {
    const [data, setData] = useState<PredefinedKit[]>([]);
    const [loading, setLoading] = useState(false);
    const [isUserID, setUserID] = useState<any>();
    const [isDepartmentID, setDepartmentID] = useState<any>();

    const [searchText, setSearchText] = useState('');
    const [filteredData, setFilteredData] = useState<PredefinedKit[]>([]);

    const handleRefetch = async () => {
        setLoading(true);
        await fetchData();
        setLoading(false);
    };

    const handleActivateButton = async (record: PredefinedKit) => {
        const { error } = await PredefinedKitService.activateStatus(
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
            const dataFetch = await PredefinedKitService.getAllPostsInactive(isDepartmentID);
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

    // State for column visibility
    const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({
        "Name": true,
        "Checked Out No.": true,
        "Status": true,
        "Actions": true,
        "Checkout": true,
    });

    const columns: TableColumnsType<PredefinedKit> = [
        {
            title: "Name",
            dataIndex: "name",
            width: 350,
        },
        {
            title: "Checked Out No.",
            dataIndex: "checkedout_no",
            width: 350,
            render: (_, data) => (
                <div>{data.predefined_check[0].count}</div>
            )
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
                        description="Are you sure to activate this predefined kit?"
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

    const onChange: TableProps<PredefinedKit>["onChange"] = (
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
                            title: "Predefined Kit",
                        },
                        {
                            title: "Inactive",
                        },
                    ]}
                />
                <Link to={'/inventory/predefined-kit'}>
                    <Button icon={<AiOutlineRollback />}>Back</Button>
                </Link>
            </div>
            <div className="flex justify-between">
                <Alert
                    message="Note: This is the list of all inactive predefined kit. Please check closely."
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
                <Table<PredefinedKit>
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