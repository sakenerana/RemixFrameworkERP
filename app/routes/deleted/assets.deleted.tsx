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
} from "antd";
import { FcRedo, FcSearch } from "react-icons/fc";
import PrintDropdownComponent from "~/components/print_dropdown";

interface DataType {
    key: React.Key;
    asset_name: string;
    item_image: string;
    asset_tag: string;
    serial_no: string;
    item_model: string;
    item_category: string;
    status: string;
    checked_out_to: string;
    location: string;
    purchase_cost: string;
    current_value: string;
    cpu: string;
    accounting_code: string;
    check_status: string;
    action: string;
}

export default function DeletedRoute() {
    const data: DataType[] = [
        {
            key: "1",
            asset_name: "John Brown",
            item_image: "test",
            asset_tag: "test",
            serial_no: "test",
            item_model: "test",
            item_category: "test",
            status: "test",
            checked_out_to: "test",
            location: "test",
            purchase_cost: "test",
            current_value: "test",
            cpu: "test",
            accounting_code: "test",
            check_status: "test",
            action: "test",
        },
        {
            key: "2",
            asset_name: "John Brown",
            item_image: "test",
            asset_tag: "test",
            serial_no: "test",
            item_model: "test",
            item_category: "test",
            status: "test",
            checked_out_to: "test",
            location: "test",
            purchase_cost: "test",
            current_value: "test",
            cpu: "test",
            accounting_code: "test",
            check_status: "test",
            action: "test",
        },
        {
            key: "3",
            asset_name: "John Brown",
            item_image: "test",
            asset_tag: "test",
            serial_no: "test",
            item_model: "test",
            item_category: "test",
            status: "test",
            checked_out_to: "test",
            location: "test",
            purchase_cost: "test",
            current_value: "test",
            cpu: "test",
            accounting_code: "test",
            check_status: "test",
            action: "test",
        },
        {
            key: "4",
            asset_name: "John Brown",
            item_image: "test",
            asset_tag: "test",
            serial_no: "test",
            item_model: "test",
            item_category: "test",
            status: "test",
            checked_out_to: "test",
            location: "test",
            purchase_cost: "test",
            current_value: "test",
            cpu: "test",
            accounting_code: "test",
            check_status: "test",
            action: "test",
        },
        {
            key: "5",
            asset_name: "John Brown",
            item_image: "test",
            asset_tag: "test",
            serial_no: "test",
            item_model: "test",
            item_category: "test",
            status: "test",
            checked_out_to: "test",
            location: "test",
            purchase_cost: "test",
            current_value: "test",
            cpu: "test",
            accounting_code: "test",
            check_status: "test",
            action: "test",
        },
        {
            key: "6",
            asset_name: "John Brown",
            item_image: "test",
            asset_tag: "test",
            serial_no: "test",
            item_model: "test",
            item_category: "test",
            status: "test",
            checked_out_to: "test",
            location: "test",
            purchase_cost: "test",
            current_value: "test",
            cpu: "test",
            accounting_code: "test",
            check_status: "test",
            action: "test",
        },
        {
            key: "7",
            asset_name: "John Brown",
            item_image: "test",
            asset_tag: "test",
            serial_no: "test",
            item_model: "test",
            item_category: "test",
            status: "test",
            checked_out_to: "test",
            location: "test",
            purchase_cost: "test",
            current_value: "test",
            cpu: "test",
            accounting_code: "test",
            check_status: "test",
            action: "test",
        },
        {
            key: "8",
            asset_name: "John Brown",
            item_image: "test",
            asset_tag: "test",
            serial_no: "test",
            item_model: "test",
            item_category: "test",
            status: "test",
            checked_out_to: "test",
            location: "test",
            purchase_cost: "test",
            current_value: "test",
            cpu: "test",
            accounting_code: "test",
            check_status: "test",
            action: "test",
        },
        {
            key: "9",
            asset_name: "John Brown",
            item_image: "test",
            asset_tag: "test",
            serial_no: "test",
            item_model: "test",
            item_category: "test",
            status: "test",
            checked_out_to: "test",
            location: "test",
            purchase_cost: "test",
            current_value: "test",
            cpu: "test",
            accounting_code: "test",
            check_status: "test",
            action: "test",
        },
        {
            key: "10",
            asset_name: "John Brown",
            item_image: "test",
            asset_tag: "test",
            serial_no: "test",
            item_model: "test",
            item_category: "test",
            status: "test",
            checked_out_to: "test",
            location: "test",
            purchase_cost: "test",
            current_value: "test",
            cpu: "test",
            accounting_code: "test",
            check_status: "test",
            action: "test",
        },
    ];

    const columns: TableColumnsType<DataType> = [
        {
            title: "Asset Name",
            dataIndex: "asset_name",
        },
        {
            title: "Item Image",
            dataIndex: "item_image",
        },
        {
            title: "Asset Tag",
            dataIndex: "asset_tag",
        },
        {
            title: "Serial",
            dataIndex: "serial_no",
        },
        {
            title: "Model",
            dataIndex: "item_model",
        },
        {
            title: "Category",
            dataIndex: "item_category",
        },
        {
            title: "Status",
            dataIndex: "status",
        },
        {
            title: "Checked Out To",
            dataIndex: "checked_out_to",
        },
        {
            title: "Location",
            dataIndex: "location",
        },
        {
            title: "Purchase Cost",
            dataIndex: "purchase_cost",
        },
        {
            title: "Current Value",
            dataIndex: "current_value",
        },
        {
            title: "CPU",
            dataIndex: "cpu",
        },
        {
            title: "Accounting Code",
            dataIndex: "accounting_code",
        },
        {
            title: "Checkin/Checkout",
            dataIndex: "check_status",
        },
        {
            title: "Actions",
            dataIndex: "actions",
            render: () => (
                <div>
                    <Button color="danger" variant="filled">
                        Restore
                    </Button>
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
            <div className="pb-5">
                <Breadcrumb
                    items={[
                        {
                            href: "/main/dashboard",
                            title: <HomeOutlined />,
                        },
                        {
                            title: "Assets"
                        },
                        {
                            title: "Deleted",
                        },
                    ]}
                />
            </div>
            <div className="flex justify-between">
                <Alert
                    message="Note: This is the list of all deleted item. Please check closely."
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