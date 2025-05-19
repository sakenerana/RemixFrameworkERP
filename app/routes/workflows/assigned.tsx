import { HomeOutlined } from "@ant-design/icons";
import { useNavigate } from "@remix-run/react";
import {
    Alert,
    Breadcrumb,
    Button,
    Input,
    Popconfirm,
    Space,
    Spin,
    Table,
    TableColumnsType,
    TableProps,
    Tag,
} from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
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

    useEffect(() => {
        fetchData();
    }, []); // Empty dependency array means this runs once on mount

    const handleShowWorkflows = () => {
        navigate("assigned");
    };

    const columns: TableColumnsType<DataType> = [
        {
            title: "Name",
            dataIndex: "name",
            width: 120,
        },
        {
            title: "Product Key",
            dataIndex: "product_key",
            width: 120,
        },
    ];

    const onChange: TableProps<DataType>["onChange"] = (
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
                            href: "/workflow",
                            title: <HomeOutlined />,
                        },
                        {
                            title: "Workflow",
                        },
                        {
                            title: "Assigned",
                        },
                    ]}
                />
            </div>
            <div className="flex justify-between">
                <Alert
                    message="Note: This is the list of all users with existing workflows. Please check closely."
                    type="info"
                    showIcon
                />
                <Space direction="horizontal">
                    <Space.Compact style={{ width: "100%" }}>
                        <Input placeholder="Search" />
                        <Button icon={<FcSearch />} type="default">
                            Search
                        </Button>
                    </Space.Compact>
                    <Space wrap>
                        <Button onClick={handleRefetch} icon={<FcRefresh />} type="default">
                            Refresh
                        </Button>
                    </Space>
                    <Space wrap>
                        <PrintDropdownComponent></PrintDropdownComponent>
                    </Space>
                </Space>
            </div>
            {loading && <Spin></Spin>}
            {!loading && (
                <Table<DataType>
                    size="small"
                    columns={columns}
                    dataSource={data}
                    onChange={onChange}
                    className="pt-5"
                    bordered
                    scroll={{ x: "max-content" }}
                />
            )}
        </div>
    );
}