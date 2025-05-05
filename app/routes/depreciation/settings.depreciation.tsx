import { HomeOutlined, UserOutlined } from "@ant-design/icons";
import {
    Alert,
    Breadcrumb,
    Button,
    Input,
    Space,
    Table,
    TableColumnsType,
    TableProps,
    Tag,
} from "antd";
import { AiOutlinePlus } from "react-icons/ai";
import { FcSearch } from "react-icons/fc";
import PrintDropdownComponent from "~/components/print_dropdown";

interface DataType {
    key: React.Key;
    name: string;
    term: string;
    floor_value: string;
    assets: string;
    assets_models: string;
    licenses: string;
    action: string;
}

export default function DepreciationRoutes() {

    const data: DataType[] = [
        {
            key: "1",
            name: "John Brown",
            term: "test",
            floor_value: 'test',
            assets: "test",
            assets_models: "test",
            licenses: "test",
            action: 'test',
        },
        {
            key: "2",
            name: "John Brown",
            term: "test",
            floor_value: 'test',
            assets: "test",
            assets_models: "test",
            licenses: "test",
            action: 'test',
        },
        {
            key: "3",
            name: "John Brown",
            term: "test",
            floor_value: 'test',
            assets: "test",
            assets_models: "test",
            licenses: "test",
            action: 'test',
        },
        {
            key: "4",
            name: "John Brown",
            term: "test",
            floor_value: 'test',
            assets: "test",
            assets_models: "test",
            licenses: "test",
            action: 'test',
        },
        {
            key: "5",
            name: "John Brown",
            term: "test",
            floor_value: 'test',
            assets: "test",
            assets_models: "test",
            licenses: "test",
            action: 'test',
        },
        {
            key: "6",
            name: "John Brown",
            term: "test",
            floor_value: 'test',
            assets: "test",
            assets_models: "test",
            licenses: "test",
            action: 'test',
        },
        {
            key: "7",
            name: "John Brown",
            term: "test",
            floor_value: 'test',
            assets: "test",
            assets_models: "test",
            licenses: "test",
            action: 'test',
        },
        {
            key: "8",
            name: "John Brown",
            term: "test",
            floor_value: 'test',
            assets: "test",
            assets_models: "test",
            licenses: "test",
            action: 'test',
        },
        {
            key: "9",
            name: "John Brown",
            term: "test",
            floor_value: 'test',
            assets: "test",
            assets_models: "test",
            licenses: "test",
            action: 'test',
        },
        {
            key: "10",
            name: "John Brown",
            term: "test",
            floor_value: 'test',
            assets: "test",
            assets_models: "test",
            licenses: "test",
            action: 'test',
        },
    ];

    const columns: TableColumnsType<DataType> = [
        {
            title: "Name",
            dataIndex: "name",
        },
        {
            title: "Term",
            dataIndex: "term",
        },
        {
            title: "Floor Value",
            dataIndex: "floor_value",
        },
        {
            title: "Assets",
            dataIndex: "assets",
        },
        {
            title: "Assets Models",
            dataIndex: "assets_models",
        },
        {
            title: "Licenses",
            dataIndex: "licenses",
        },
        {
            title: "Actions",
            dataIndex: "actions",
            render: () => (
                <div className="flex">
                    <Tag color="#f7b63e">Update</Tag>
                    <Tag color="#f50">Delete</Tag>
                </div>
            ),
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
                            href: "/main/dashboard",
                            title: <HomeOutlined />,
                        },
                        {
                            title: "Settings",
                        },
                        {
                            title: "Depreciation"
                        }
                    ]}
                />
                <Button icon={<AiOutlinePlus />} type="primary">Create New</Button>
            </div>
            <div className="flex justify-between">
                <Alert
                    message="Note: This is the list of all depreciated items. Please check closely."
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
                        <PrintDropdownComponent></PrintDropdownComponent>
                    </Space>
                </Space>
            </div>
            <Table<DataType>
                size="small"
                columns={columns}
                dataSource={data}
                onChange={onChange}
                className="pt-5"
                bordered
            />
        </div>
    );
}