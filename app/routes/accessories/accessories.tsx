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
    item_image: string;
    name: string;
    asset_category: string;
    model_no: string;
    location: string;
    min_qty: string;
    total: string;
    checked_out: string;
    purchase_cost: string;
    check_status: string;
    action: string;
}

export default function AccesoriessRoute() {

    const data: DataType[] = [
        {
            key: "1",
            item_image: "John Brown",
            name: "test",
            asset_category: 'test',
            model_no: "test",
            location: "test",
            min_qty: "test",
            total: "test",
            checked_out: "test",
            purchase_cost: "test",
            check_status: 'checkout',
            action: 'test',
        },
        {
            key: "2",
            item_image: "John Brown",
            name: "test",
            asset_category: 'test',
            model_no: "test",
            location: "test",
            min_qty: "test",
            total: "test",
            checked_out: "test",
            purchase_cost: "test",
            check_status: 'checkout',
            action: 'test',
        },
        {
            key: "3",
            item_image: "John Brown",
            name: "test",
            asset_category: 'test',
            model_no: "test",
            location: "test",
            min_qty: "test",
            total: "test",
            checked_out: "test",
            purchase_cost: "test",
            check_status: 'checkout',
            action: 'test',
        },
        {
            key: "4",
            item_image: "John Brown",
            name: "test",
            asset_category: 'test',
            model_no: "test",
            location: "test",
            min_qty: "test",
            total: "test",
            checked_out: "test",
            purchase_cost: "test",
            check_status: 'checkout',
            action: 'test',
        },
        {
            key: "5",
            item_image: "John Brown",
            name: "test",
            asset_category: 'test',
            model_no: "test",
            location: "test",
            min_qty: "test",
            total: "test",
            checked_out: "test",
            purchase_cost: "test",
            check_status: 'checkout',
            action: 'test',
        },
        {
            key: "6",
            item_image: "John Brown",
            name: "test",
            asset_category: 'test',
            model_no: "test",
            location: "test",
            min_qty: "test",
            total: "test",
            checked_out: "test",
            purchase_cost: "test",
            check_status: 'checkout',
            action: 'test',
        },
        {
            key: "7",
            item_image: "John Brown",
            name: "test",
            asset_category: 'test',
            model_no: "test",
            location: "test",
            min_qty: "test",
            total: "test",
            checked_out: "test",
            purchase_cost: "test",
            check_status: 'checkout',
            action: 'test',
        },
        {
            key: "8",
            item_image: "John Brown",
            name: "test",
            asset_category: 'test',
            model_no: "test",
            location: "test",
            min_qty: "test",
            total: "test",
            checked_out: "test",
            purchase_cost: "test",
            check_status: 'checkout',
            action: 'test',
        },
        {
            key: "9",
            item_image: "John Brown",
            name: "test",
            asset_category: 'test',
            model_no: "test",
            location: "test",
            min_qty: "test",
            total: "test",
            checked_out: "test",
            purchase_cost: "test",
            check_status: 'checkout',
            action: 'test',
        },
        {
            key: "10",
            item_image: "John Brown",
            name: "test",
            asset_category: 'test',
            model_no: "test",
            location: "test",
            min_qty: "test",
            total: "test",
            checked_out: "test",
            purchase_cost: "test",
            check_status: 'checkout',
            action: 'test',
        },
    ];

    const columns: TableColumnsType<DataType> = [
        {
            title: "Item Image",
            dataIndex: "item_image",
        },
        {
            title: "Name",
            dataIndex: "name",
        },
        {
            title: "Asset Category",
            dataIndex: "asset_category",
        },
        {
            title: "Model No.",
            dataIndex: "model_no",
        },
        {
            title: "Location",
            dataIndex: "location",
        },
        {
            title: "Min. QTY",
            dataIndex: "min_qty",
        },
        {
            title: "Total",
            dataIndex: "total",
        },
        {
            title: "Checked Out",
            dataIndex: "checked_out",
        },
        {
            title: "Purchase Cost",
            dataIndex: "purchase_cost",
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
                            title: "Accessories",
                        },
                    ]}
                />
                <Button icon={<AiOutlinePlus />} type="primary">Create New</Button>
            </div>
            <div className="flex justify-between">
                <Alert
                    message="Note: This is the list of all accessories. Please check closely."
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