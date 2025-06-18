import { CheckCircleOutlined, HomeOutlined, SettingOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "@remix-run/react";
import { Alert, Breadcrumb, Button, Checkbox, Dropdown, Input, MenuProps, message, Popconfirm, Space, Spin, Table, TableColumnsType, TableProps, Tag } from "antd";
import { useEffect, useMemo, useState } from "react";
import { AiOutlineCloseCircle, AiOutlineDelete, AiOutlineEdit, AiOutlineFileExclamation, AiOutlinePlus } from "react-icons/ai";
import { FcRefresh, FcSearch } from "react-icons/fc";
import PrintDropdownComponent from "~/components/print_dropdown";
import { AssetModelService } from "~/services/asset_model.service";
import { AssetModel } from "~/types/asset_model.tpye";

export default function AssetModelsRoutes() {
    const [data, setData] = useState<AssetModel[]>([]);
    const [loading, setLoading] = useState(false);
    const [isUserID, setUserID] = useState<any>();
    const [isDepartmentID, setDepartmentID] = useState<any>();

    const [searchText, setSearchText] = useState('');
    const [filteredData, setFilteredData] = useState<AssetModel[]>([]);

    const navigate = useNavigate();

    const handleRefetch = async () => {
        setLoading(true);
        await fetchData();
        setLoading(false);
    };

    // Edit record
    const editRecord = (record: AssetModel) => {
        navigate(`form-asset-model/${record.id}`);
    };

    const handleDeactivateButton = async (record: AssetModel) => {
        const { error } = await AssetModelService.deactivateStatus(
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
            const dataFetch = await AssetModelService.getAllPosts(isDepartmentID);
            console.log("cats", dataFetch)
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
        "Model No": true,
        "Min Qty": true,
        "Assets": true,
        "Category": true,
        "Manufacturer": true,
        "EOL": false,
        "Depreciation": false,
        "Notes": false,
        "Status": true,
        "Actions": true,
    });

    const columns: TableColumnsType<AssetModel> = [
        {
            title: "Name",
            dataIndex: "name",
            width: 120,
            render: (text) => text || 'N/A'
        },
        {
            title: "Model No",
            dataIndex: "model_no",
            width: 120,
            render: (text) => text || 'N/A'
        },
        {
            title: "Min Qty",
            dataIndex: "min_qty",
            width: 120,
            render: (text) => text || 'N/A'
        },
        {
            title: "Assets",
            dataIndex: "assets",
            width: 120,
            render: (text) => text || 'N/A'
        },
        {
            title: "Category",
            dataIndex: "categories",
            width: 120,
            render: (categories) => categories?.name || 'N/A'
        },
        {
            title: "Manufacturer",
            dataIndex: "manufacturers",
            width: 120,
            render: (manufacturers) => manufacturers?.name || 'N/A'
        },
        {
            title: "EOL",
            dataIndex: "eol",
            width: 120,
            render: (text) => text || 'N/A'
        },
        {
            title: "Depreciation",
            dataIndex: "depreciations",
            width: 120,
            render: (depreciations) => depreciations?.name || 'N/A'
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
                        title="Do you want to update?"
                        description="Are you sure to update this asset model?"
                        okText="Yes"
                        cancelText="No"
                        onConfirm={() => editRecord(record)}
                    >
                        <Tag
                            className="cursor-pointer"
                            icon={<AiOutlineEdit className="float-left mt-1 mr-1" />}
                            color="#f7b63e"
                        >
                            Update
                        </Tag>
                    </Popconfirm>
                    <Popconfirm
                        title="Do you want to deactivate?"
                        description="Are you sure to deactivate this asset model?"
                        okText="Yes"
                        cancelText="No"
                        onConfirm={() => handleDeactivateButton(record)}
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

    const onChange: TableProps<AssetModel>["onChange"] = (
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
                            title: "Asset Model",
                        },
                    ]}
                />
                <Space wrap>
                    <Link to={"deleted-asset-model"}>
                        <Button icon={<AiOutlineFileExclamation />} danger>
                            Show Inactive Asset Model
                        </Button>
                    </Link>

                    <Link to={"form-asset-model"}>
                        <Button icon={<AiOutlinePlus />} type="primary">
                            Create Asset Model
                        </Button>
                    </Link>
                </Space>
            </div>
            <div className="flex justify-between">
                <Alert
                    message="Note: This is the list of all asset models. Please check closely."
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
                <Table<AssetModel>
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