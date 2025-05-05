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
    image: string;
    asset_tag: string;
    model: string;
    model_no: string;
    asset_name: string;
    serial_no: string;
    location: string;
    status: string;
    expected_checkin_date: string;
    cpu: string;
    action: string;
}

export default function RequestableItemsRoutes() {

    const data: DataType[] = [
        {
            key: "1",
            image: "John Brown",
            asset_tag: "test",
            model: 'test',
            model_no: "test",
            asset_name: "test",
            serial_no: "test",
            location: "test",
            status: "test",
            expected_checkin_date: "test",
            cpu: "test",
            action: 'test',
        },
        {
            key: "2",
            image: "John Brown",
            asset_tag: "test",
            model: 'test',
            model_no: "test",
            asset_name: "test",
            serial_no: "test",
            location: "test",
            status: "test",
            expected_checkin_date: "test",
            cpu: "test",
            action: 'test',
        },
        {
            key: "3",
            image: "John Brown",
            asset_tag: "test",
            model: 'test',
            model_no: "test",
            asset_name: "test",
            serial_no: "test",
            location: "test",
            status: "test",
            expected_checkin_date: "test",
            cpu: "test",
            action: 'test',
        },
        {
            key: "4",
            image: "John Brown",
            asset_tag: "test",
            model: 'test',
            model_no: "test",
            asset_name: "test",
            serial_no: "test",
            location: "test",
            status: "test",
            expected_checkin_date: "test",
            cpu: "test",
            action: 'test',
        },
        {
            key: "5",
            image: "John Brown",
            asset_tag: "test",
            model: 'test',
            model_no: "test",
            asset_name: "test",
            serial_no: "test",
            location: "test",
            status: "test",
            expected_checkin_date: "test",
            cpu: "test",
            action: 'test',
        },
        {
            key: "6",
            image: "John Brown",
            asset_tag: "test",
            model: 'test',
            model_no: "test",
            asset_name: "test",
            serial_no: "test",
            location: "test",
            status: "test",
            expected_checkin_date: "test",
            cpu: "test",
            action: 'test',
        },
        {
            key: "7",
            image: "John Brown",
            asset_tag: "test",
            model: 'test',
            model_no: "test",
            asset_name: "test",
            serial_no: "test",
            location: "test",
            status: "test",
            expected_checkin_date: "test",
            cpu: "test",
            action: 'test',
        },
        {
            key: "8",
            image: "John Brown",
            asset_tag: "test",
            model: 'test',
            model_no: "test",
            asset_name: "test",
            serial_no: "test",
            location: "test",
            status: "test",
            expected_checkin_date: "test",
            cpu: "test",
            action: 'test',
        },
        {
            key: "9",
            image: "John Brown",
            asset_tag: "test",
            model: 'test',
            model_no: "test",
            asset_name: "test",
            serial_no: "test",
            location: "test",
            status: "test",
            expected_checkin_date: "test",
            cpu: "test",
            action: 'test',
        },
        {
            key: "10",
            image: "John Brown",
            asset_tag: "test",
            model: 'test',
            model_no: "test",
            asset_name: "test",
            serial_no: "test",
            location: "test",
            status: "test",
            expected_checkin_date: "test",
            cpu: "test",
            action: 'test',
        },
    ];

    const columns: TableColumnsType<DataType> = [
        {
            title: "Image",
            dataIndex: "image",
        },
        {
            title: "Asset Tag",
            dataIndex: "asset_tag",
        },
        {
            title: "Model",
            dataIndex: "model",
        },
        {
            title: "Model No.",
            dataIndex: "model_no",
        },
        {
            title: "Asset Name",
            dataIndex: "asset_name",
        },
        {
            title: "Serial",
            dataIndex: "serial_no",
        },
        {
            title: "Location",
            dataIndex: "location",
        },
        {
            title: "Status",
            dataIndex: "status",
        },
        {
            title: "Expected Checkin Date",
            dataIndex: "expected_checkin_date",
        },
        {
            title: "CPU",
            dataIndex: "cpu",
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
                            title: "Requestable Items",
                        },
                    ]}
                />
                <Button icon={<AiOutlinePlus />} type="primary">Create New</Button>
            </div>
            <div className="flex justify-between">
                <Alert
                    message="Note: This is the list of all requestable items. Please check closely."
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