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
    location_name: string;
    image: string;
    parent: string;
    current_location: string;
    address: string;
    city: string;
    state: string;
    action: string;
}

export default function LocationsRoutes() {

    const data: DataType[] = [
        {
            key: "1",
            location_name: "John Brown",
            image: "test",
            parent: 'test',
            current_location: "test",
            address: "test",
            city: "test",
            state: "test",
            action: 'test',
        },
        {
            key: "2",
            location_name: "John Brown",
            image: "test",
            parent: 'test',
            current_location: "test",
            address: "test",
            city: "test",
            state: "test",
            action: 'test',
        },
        {
            key: "3",
            location_name: "John Brown",
            image: "test",
            parent: 'test',
            current_location: "test",
            address: "test",
            city: "test",
            state: "test",
            action: 'test',
        },
        {
            key: "4",
            location_name: "John Brown",
            image: "test",
            parent: 'test',
            current_location: "test",
            address: "test",
            city: "test",
            state: "test",
            action: 'test',
        },
        {
            key: "5",
            location_name: "John Brown",
            image: "test",
            parent: 'test',
            current_location: "test",
            address: "test",
            city: "test",
            state: "test",
            action: 'test',
        },
        {
            key: "6",
            location_name: "John Brown",
            image: "test",
            parent: 'test',
            current_location: "test",
            address: "test",
            city: "test",
            state: "test",
            action: 'test',
        },
        {
            key: "7",
            location_name: "John Brown",
            image: "test",
            parent: 'test',
            current_location: "test",
            address: "test",
            city: "test",
            state: "test",
            action: 'test',
        },
        {
            key: "8",
            location_name: "John Brown",
            image: "test",
            parent: 'test',
            current_location: "test",
            address: "test",
            city: "test",
            state: "test",
            action: 'test',
        },
        {
            key: "9",
            location_name: "John Brown",
            image: "test",
            parent: 'test',
            current_location: "test",
            address: "test",
            city: "test",
            state: "test",
            action: 'test',
        },
        {
            key: "10",
            location_name: "John Brown",
            image: "test",
            parent: 'test',
            current_location: "test",
            address: "test",
            city: "test",
            state: "test",
            action: 'test',
        },
    ];

    const columns: TableColumnsType<DataType> = [
        {
            title: "Location Name",
            dataIndex: "location_name",
        },
        {
            title: "Image",
            dataIndex: "image",
        },
        {
            title: "Parent",
            dataIndex: "parent",
        },
        {
            title: "Current Location",
            dataIndex: "current_location",
        },
        {
            title: "Address",
            dataIndex: "address",
        },
        {
            title: "City",
            dataIndex: "city",
        },
        {
            title: "State",
            dataIndex: "state",
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
                            title: "Locations"
                        }
                    ]}
                />
                <Button icon={<AiOutlinePlus />} type="primary">Create New</Button>
            </div>
            <div className="flex justify-between">
                <Alert
                    message="Note: This is the list of all locations. Please check closely."
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