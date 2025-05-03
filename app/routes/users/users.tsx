import { HomeOutlined } from "@ant-design/icons";
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
import { AiOutlinePlus, AiOutlineUserDelete } from "react-icons/ai";
import { FcSearch } from "react-icons/fc";
import PrintDropdownComponent from "~/components/print_dropdown";


interface DataType {
    key: React.Key;
    name: string;
    title: string;
    email: string;
    phone_no: string;
    username: string;
    department: string;
    location: string;
    manager: string;
    action: string;
    check_status: string;
}

export default function UsersRoutes() {

    const data: DataType[] = [
        {
            key: "1",
            name: "John Brown",
            title: "test",
            email: 'test',
            phone_no: "test",
            username: "test",
            department: "test",
            location: "test",
            manager: "test",
            action: 'test',
            check_status: 'checkout'
        },
        {
            key: "2",
            name: "John Brown",
            title: "test",
            email: 'test',
            phone_no: "test",
            username: "test",
            department: "test",
            location: "test",
            manager: "test",
            action: 'test',
            check_status: 'checkout'
        },
        {
            key: "3",
            name: "John Brown",
            title: "test",
            email: 'test',
            phone_no: "test",
            username: "test",
            department: "test",
            location: "test",
            manager: "test",
            action: 'test',
            check_status: 'checkout'
        },
        {
            key: "4",
            name: "John Brown",
            title: "test",
            email: 'test',
            phone_no: "test",
            username: "test",
            department: "test",
            location: "test",
            manager: "test",
            action: 'test',
            check_status: 'checkout'
        },
        {
            key: "5",
            name: "John Brown",
            title: "test",
            email: 'test',
            phone_no: "test",
            username: "test",
            department: "test",
            location: "test",
            manager: "test",
            action: 'test',
            check_status: 'checkout'
        },
        {
            key: "6",
            name: "John Brown",
            title: "test",
            email: 'test',
            phone_no: "test",
            username: "test",
            department: "test",
            location: "test",
            manager: "test",
            action: 'test',
            check_status: 'checkout'
        },
        {
            key: "7",
            name: "John Brown",
            title: "test",
            email: 'test',
            phone_no: "test",
            username: "test",
            department: "test",
            location: "test",
            manager: "test",
            action: 'test',
            check_status: 'checkout'
        },
        {
            key: "8",
            name: "John Brown",
            title: "test",
            email: 'test',
            phone_no: "test",
            username: "test",
            department: "test",
            location: "test",
            manager: "test",
            action: 'test',
            check_status: 'checkout'
        },
        {
            key: "9",
            name: "John Brown",
            title: "test",
            email: 'test',
            phone_no: "test",
            username: "test",
            department: "test",
            location: "test",
            manager: "test",
            action: 'test',
            check_status: 'checkout'
        },
        {
            key: "10",
            name: "John Brown",
            title: "test",
            email: 'test',
            phone_no: "test",
            username: "test",
            department: "test",
            location: "test",
            manager: "test",
            action: 'test',
            check_status: 'checkout'
        },
    ];

    const columns: TableColumnsType<DataType> = [
        {
            title: "Name",
            dataIndex: "name",
        },
        {
            title: "Title",
            dataIndex: "title",
        },
        {
            title: "Email",
            dataIndex: "email",
        },
        {
            title: "Phone",
            dataIndex: "phone_no",
        },
        {
            title: "Username",
            dataIndex: "username",
        },
        {
            title: "Department",
            dataIndex: "department",
        },
        {
            title: "Location",
            dataIndex: "location",
        },
        {
            title: "Manager",
            dataIndex: "manager",
        },
        {
            title: "Checkin/Checkout",
            dataIndex: "check_status",
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
        {
            title: "Checkout",
            dataIndex: "checkout",
            render: (_, data) => (
                <div>
                    {data.check_status == "checkin" ? (
                        <Tag color="#108ee9">{data.check_status}</Tag>
                    ) : (
                        <Tag color="#f50">{data.check_status}</Tag>
                    )}
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
                            title: "Users",
                        },
                    ]}
                />
                <Space wrap>
                    <Button icon={<AiOutlineUserDelete />} type="primary" danger >Show Deleted Users</Button>
                    <Button icon={<AiOutlinePlus />} type="primary">Create New</Button>
                </Space>
            </div>
            <div className="flex justify-between">
                <Alert
                    message="Note: This is the list of all users. Please check closely."
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