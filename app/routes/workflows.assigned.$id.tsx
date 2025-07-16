import { FileSearchOutlined, HomeOutlined, LoadingOutlined, SettingOutlined } from "@ant-design/icons";
import { useNavigate } from "@remix-run/react";
import {
    Alert,
    Breadcrumb,
    Button,
    Checkbox,
    Dropdown,
    Input,
    MenuProps,
    Popconfirm,
    Space,
    Spin,
    Table,
    TableColumnsType,
    TableProps,
    Tag,
} from "antd";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { AiFillProfile } from "react-icons/ai";
import { FcRefresh, FcSearch } from "react-icons/fc";
import PrintDropdownComponent from "~/components/print_dropdown";

interface DataType {
    id: number;
    title: string;
    body: string;
    userId?: number; // Optional property
}

export default function Assigned() {
    const [data, setData] = useState<DataType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isUserID, setUserID] = useState<any>();
    const [isDepartmentID, setDepartmentID] = useState<any>();

    const [searchText, setSearchText] = useState('');
    const [filteredData, setFilteredData] = useState<any[]>([]);

    const navigate = useNavigate();

    const handleRefetch = async () => {
        setLoading(true);
        await fetchData();
        setLoading(false);
    };

    const fetchData = async () => {
        try {
            const response = await axios
                .get<DataType[]>("https://jsonplaceholder.typicode.com/posts") // Specify response type
                .then((response) => {
                    setData(response.data);
                    setLoading(false);
                })
                .catch((error) => {
                    setError(error.message);
                    setLoading(false);
                });
        } catch (err) {
            console.error(err);
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
                data.title?.toLowerCase().includes(searchText.toLowerCase())
            );
            setFilteredData(filtered);
        }
    }, [searchText]); // Empty dependency array means this runs once on mount

    const handleShowWorkflows = () => {
        navigate("assigned");
    };

    const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({
        "Name": true,
        "Product Key": true,
    });

    const columns: TableColumnsType<DataType> = [
        {
            title: "Names",
            dataIndex: "name",
            width: 120,
        },
        {
            title: "Product Key",
            dataIndex: "product_key",
            width: 120,
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

    const onChange: TableProps<DataType>["onChange"] = (
        pagination,
        filters,
        sorter,
        extra
    ) => {
        console.log("params", pagination, filters, sorter, extra);
    };

    return (
        <div className="w-full px-6 py-4 rounded-lg shadow-sm">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <Breadcrumb
                        items={[
                            {
                                href: "/workflow",
                                title: <HomeOutlined className="text-gray-400" />,
                            },
                            {
                                title: <span className="text-gray-500">Workflow</span>,
                            },
                            {
                                title: <span className="text-blue-600 font-medium">Assigned</span>,
                            },
                        ]}
                        className="text-sm"
                    />
                </div>
            </div>

            {/* Toolbar Section */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
                <Alert
                    message="Review all users with assigned workflows. Monitor status and take action as needed."
                    type="info"
                    showIcon
                    className="w-full lg:w-auto"
                />

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto">
                    <Input.Search
                        allowClear
                        onChange={(e) => setSearchText(e.target.value)}
                        placeholder="Search assignments..."
                        className="w-full sm:w-64"
                        size="middle"
                    />

                    <Space>
                        <Button
                            onClick={handleRefetch}
                            icon={<FcRefresh className="text-blue-500" />}
                            className="flex items-center gap-2 hover:border-blue-500"
                        >
                            Refresh
                        </Button>

                        <Dropdown
                            menu={{
                                items: columnMenuItems,
                                className: "shadow-lg rounded-md min-w-[200px] py-2"
                            }}
                            placement="bottomRight"
                            trigger={['click']}
                        >
                            <Button
                                icon={<SettingOutlined />}
                                className="flex items-center gap-2 hover:border-blue-500"
                            >
                                Columns
                            </Button>
                        </Dropdown>

                        <PrintDropdownComponent
                            stateData={data}
                            buttonProps={{
                                className: "flex items-center gap-2 hover:border-blue-500",
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
                        tip="Loading assigned workflows..."
                        indicator={<LoadingOutlined style={{ fontSize: 36 }} spin />}
                    />
                </div>
            ) : (
                <Table<DataType>
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
                        className: "px-4 py-2 rounded-b-lg",
                        showTotal: (total) => (
                            <span className="text-sm">
                                Showing {data.length} of {total} assignments
                            </span>
                        ),
                    }}
                    locale={{
                        emptyText: (
                            <div className="py-12 flex flex-col items-center">
                                <FileSearchOutlined className="text-3xl mb-3" />
                                <p className="text-gray-500 mb-2 text-base">No assigned workflows found</p>
                                <p className="text-gray-400 text-sm mb-4">Create new assignments or check your filters</p>
                                {/* <Button
                                    type="primary"
                                    className="mt-2"
                                    onClick={() => navigate('/workflow/assign')}
                                    icon={<AiOutlinePlus />}
                                >
                                    Assign Workflow
                                </Button> */}
                            </div>
                        )
                    }}
                />
            )}
        </div>
    );
}