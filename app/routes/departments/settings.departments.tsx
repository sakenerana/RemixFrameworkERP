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
    department_name: string;
    manager: string;
    users: string;
    notes: string;
    action: string;
}

export default function DepartmentsRoutes() {

    const data: DataType[] = [
        {
            key: "1",
            department_name: "John Brown",
            manager: "test",
            users: 'test',
            notes: "test",
            action: 'test',
        },
        {
            key: "2",
            department_name: "John Brown",
            manager: "test",
            users: 'test',
            notes: "test",
            action: 'test',
        },
        {
            key: "3",
            department_name: "John Brown",
            manager: "test",
            users: 'test',
            notes: "test",
            action: 'test',
        },
        {
            key: "4",
            department_name: "John Brown",
            manager: "test",
            users: 'test',
            notes: "test",
            action: 'test',
        },
        {
            key: "5",
            department_name: "John Brown",
            manager: "test",
            users: 'test',
            notes: "test",
            action: 'test',
        },
        {
            key: "6",
            department_name: "John Brown",
            manager: "test",
            users: 'test',
            notes: "test",
            action: 'test',
        },
        {
            key: "7",
            department_name: "John Brown",
            manager: "test",
            users: 'test',
            notes: "test",
            action: 'test',
        },
        {
            key: "8",
            department_name: "John Brown",
            manager: "test",
            users: 'test',
            notes: "test",
            action: 'test',
        },
        {
            key: "9",
            department_name: "John Brown",
            manager: "test",
            users: 'test',
            notes: "test",
            action: 'test',
        },
        {
            key: "10",
            department_name: "John Brown",
            manager: "test",
            users: 'test',
            notes: "test",
            action: 'test',
        },
    ];

    const columns: TableColumnsType<DataType> = [
        {
            title: "Department Name",
            dataIndex: "department_name",
        },
        {
            title: "Manager",
            dataIndex: "manager",
        },
        {
            title: "Users",
            dataIndex: "users",
        },
        {
            title: "Notes",
            dataIndex: "notes",
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
                            title: "Departments"
                        }
                    ]}
                />
                <Button icon={<AiOutlinePlus />} type="primary">Create New</Button>
            </div>
            <div className="flex justify-between">
                <Alert
                    message="Note: This is the list of all departments. Please check closely."
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