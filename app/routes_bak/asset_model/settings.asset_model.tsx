import { CheckCircleOutlined, FileSearchOutlined, HomeOutlined, LoadingOutlined, SettingOutlined } from "@ant-design/icons";
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
        "Category": true,
        "Manufacturer": true,
        "Supplier": false,
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
            title: "Supplier",
            dataIndex: "suppliers",
            width: 120,
            render: (suppliers) => suppliers?.name || 'N/A'
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
        <div className="w-full px-4">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 py-2">
                <Breadcrumb
                    items={[
                        {
                            href: "/inventory",
                            title: <HomeOutlined className="text-gray-500" />,
                        },
                        {
                            title: <span className="text-gray-500">Settings</span>,
                        },
                        {
                            title: <span className="text-blue-600 font-medium">Asset Models</span>,
                        },
                    ]}
                    className="text-sm"
                />

                <Space wrap className="mt-2 sm:mt-0">
                    <Link to="deleted-asset-model">
                        <Button
                            icon={<AiOutlineFileExclamation />}
                            danger
                            className="flex items-center gap-2"
                        >
                            Inactive Models
                        </Button>
                    </Link>
                    <Link to="form-asset-model">
                        <Button
                            icon={<AiOutlinePlus />}
                            type="primary"
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                        >
                            New Asset Model
                        </Button>
                    </Link>
                </Space>
            </div>

            {/* Toolbar Section */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6 rounded-lg">
                <Alert
                    message="Asset Model Management: View and manage all asset models in your inventory system."
                    type="info"
                    showIcon
                />

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto">
                    <Input.Search
                        allowClear
                        onChange={(e) => setSearchText(e.target.value)}
                        placeholder="Search models..."
                        className="w-full sm:w-64"
                        size="middle"
                    />

                    <Space>
                        <Button
                            onClick={handleRefetch}
                            icon={<FcRefresh />}
                            className="flex items-center gap-2"
                        >
                            Refresh
                        </Button>

                        <Dropdown
                            menu={{ items: columnMenuItems }}
                            placement="bottomRight"
                            trigger={['click']}
                        >
                            <Button
                                icon={<SettingOutlined />}
                                className="flex items-center gap-2"
                            >
                                Columns
                            </Button>
                        </Dropdown>

                        <PrintDropdownComponent
                            stateData={data}
                            buttonProps={{
                                className: "flex items-center gap-2",
                            }}
                        />
                    </Space>
                </div>
            </div>

            {/* Table Section */}
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Spin
                        size="large"
                        tip="Loading asset model data..."
                        indicator={<LoadingOutlined style={{ fontSize: 36 }} spin />}
                    />
                </div>
            ) : (
                <Table<AssetModel>
                    size="middle"
                    columns={filteredColumns}
                    dataSource={searchText ? filteredData : data}
                    onChange={onChange}
                    className="shadow-sm rounded-lg overflow-hidden"
                    bordered
                    scroll={{ x: "max-content" }}
                    rowKey="id"
                    pagination={{
                        showSizeChanger: true,
                        showQuickJumper: true,
                        pageSizeOptions: ['10', '20', '50', '100'],
                        defaultPageSize: 20,
                        className: "px-4 py-2",
                        showTotal: (total) => `Total ${total} asset models`,
                    }}
                    locale={{
                        emptyText: (
                            <div className="py-8 flex flex-col items-center">
                                <FileSearchOutlined className="text-3xl text-gray-400 mb-2" />
                                <p className="text-gray-500">No asset model found</p>
                                <Button
                                    type="primary"
                                    className="mt-4"
                                    onClick={() => navigate('/inventory/settings/asset-model/form-asset-model')}
                                >
                                    <AiOutlinePlus className="mr-2" />
                                    Add First Asset Model
                                </Button>
                            </div>
                        )
                    }}
                />
            )}
        </div>
    );
}