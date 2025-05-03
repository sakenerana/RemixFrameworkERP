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
    product_key: string;
    expiration_date: string;
    licensed_to_email: string;
    licensed_to_name: string;
    manufacturer: string;
    min_qty: string;
    total: string;
    avail: string;
    action: string;
    check_status: string;
}

export default function SuppliersRoutes() {

    const data: DataType[] = [
        {
            key: "1",
            name: "John Brown",
            product_key: "test",
            expiration_date: 'test',
            licensed_to_email: "test",
            licensed_to_name: "test",
            manufacturer: "test",
            min_qty: "test",
            total: "test",
            avail: "test",
            action: 'test',
            check_status: 'checkout'
        },
        {
            key: "2",
            name: "John Brown",
            product_key: "test",
            expiration_date: 'test',
            licensed_to_email: "test",
            licensed_to_name: "test",
            manufacturer: "test",
            min_qty: "test",
            total: "test",
            avail: "test",
            action: 'test',
            check_status: 'checkout'
        },
        {
            key: "3",
            name: "John Brown",
            product_key: "test",
            expiration_date: 'test',
            licensed_to_email: "test",
            licensed_to_name: "test",
            manufacturer: "test",
            min_qty: "test",
            total: "test",
            avail: "test",
            action: 'test',
            check_status: 'checkout'
        },
        {
            key: "4",
            name: "John Brown",
            product_key: "test",
            expiration_date: 'test',
            licensed_to_email: "test",
            licensed_to_name: "test",
            manufacturer: "test",
            min_qty: "test",
            total: "test",
            avail: "test",
            action: 'test',
            check_status: 'checkin'
        },
        {
            key: "5",
            name: "John Brown",
            product_key: "test",
            expiration_date: 'test',
            licensed_to_email: "test",
            licensed_to_name: "test",
            manufacturer: "test",
            min_qty: "test",
            total: "test",
            avail: "test",
            action: 'test',
            check_status: 'checkout'
        },
        {
            key: "6",
            name: "John Brown",
            product_key: "test",
            expiration_date: 'test',
            licensed_to_email: "test",
            licensed_to_name: "test",
            manufacturer: "test",
            min_qty: "test",
            total: "test",
            avail: "test",
            action: 'test',
            check_status: 'checkin'
        },
        {
            key: "7",
            name: "John Brown",
            product_key: "test",
            expiration_date: 'test',
            licensed_to_email: "test",
            licensed_to_name: "test",
            manufacturer: "test",
            min_qty: "test",
            total: "test",
            avail: "test",
            action: 'test',
            check_status: 'checkout'
        },
        {
            key: "8",
            name: "John Brown",
            product_key: "test",
            expiration_date: 'test',
            licensed_to_email: "test",
            licensed_to_name: "test",
            manufacturer: "test",
            min_qty: "test",
            total: "test",
            avail: "test",
            action: 'test',
            check_status: 'checkout'
        },
        {
            key: "9",
            name: "John Brown",
            product_key: "test",
            expiration_date: 'test',
            licensed_to_email: "test",
            licensed_to_name: "test",
            manufacturer: "test",
            min_qty: "test",
            total: "test",
            avail: "test",
            action: 'test',
            check_status: 'checkin'
        },
        {
            key: "10",
            name: "John Brown",
            product_key: "test",
            expiration_date: 'test',
            licensed_to_email: "test",
            licensed_to_name: "test",
            manufacturer: "test",
            min_qty: "test",
            total: "test",
            avail: "test",
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
            title: "Product Key",
            dataIndex: "product_key",
        },
        {
            title: "Expiration Date",
            dataIndex: "expiration_date",
        },
        {
            title: "Licensed to Email",
            dataIndex: "licensed_to_email",
        },
        {
            title: "Licensed to Name",
            dataIndex: "licensed_to_name",
        },
        {
            title: "manufacturer",
            dataIndex: "manufacturer",
        },
        {
            title: "Min QTY",
            dataIndex: "min_qty",
        },
        {
            title: "Total",
            dataIndex: "total",
        },
        {
            title: "Avail",
            dataIndex: "avail",
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
                            title: "Suppliers",
                        },
                    ]}
                />
                <Button icon={<AiOutlinePlus />} type="primary">Create New</Button>
            </div>
            <div className="flex justify-between">
                <Alert
                    message="Note: This is the list of all suppliers. Please check closely."
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