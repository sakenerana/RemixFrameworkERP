import { CheckCircleOutlined } from "@ant-design/icons";
import {
    Alert,
    Card,
    Col,
    Row,
    TableColumnsType,
    TableProps,
    Table,
    message,
    Tag,
    Spin,
} from "antd";
import { useEffect, useMemo, useState } from "react";
import { AiOutlineDesktop, AiOutlineMobile, AiOutlineSchedule, AiOutlineShopping, AiOutlineSnippets, AiOutlineSolution, AiOutlineStock, AiOutlineUserAdd, AiOutlineUserDelete, AiOutlineUsergroupAdd } from "react-icons/ai";
import {
} from "react-icons/fc";
import BarChart from "~/components/bar_chart";
import PieChart from "~/components/pie_chart";
import { AccessoryService } from "~/services/accessory.service";
import { AssetService } from "~/services/asset.service";
import { ComponentService } from "~/services/component.service";
import { ConsumableService } from "~/services/consumable.service";
import { LicenseService } from "~/services/license.service";
import { Asset } from "~/types/asset.type";

interface DataType {
    key: React.Key;
    date: string;
    name: string;
    created_by: string;
    action: string;
    item: string;
}

export default function DashboardRoutes() {
    const [dataAsset, setDataAsset] = useState<any>();
    const [dataAssetTable, setDataAssetTable] = useState<Asset[]>([]);
    const [dataLicense, setDataLicense] = useState<any>();
    const [dataAccessory, setDataAccessory] = useState<any>();
    const [dataConsumable, setDataConsumable] = useState<any>();
    const [dataComponent, setDataComponent] = useState<any>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isUserID, setUserID] = useState<any>();
    const [isDepartmentID, setDepartmentID] = useState<any>();

    // Fetch data from Supabase
    const fetchDataAsset = async () => {
        try {
            setLoading(true);
            const data = await AssetService.getTableCounts();
            setDataAsset(data); // Works in React state
        } catch (error) {
            message.error("error");
        } finally {
            setLoading(false);
        }
    };

    // Fetch data from Supabase
    const fetchDataAssetTable = async () => {
        try {
            setLoading(true);
            const dataFetch = await AssetService.getAllPosts(isDepartmentID);
            setDataAssetTable(dataFetch); // Works in React state
        } catch (error) {
            message.error("error");
        } finally {
            setLoading(false);
        }
    };

    // Fetch data from Supabase
    const fetchDataLicenses = async () => {
        try {
            setLoading(true);
            const data = await LicenseService.getTableCounts();
            setDataLicense(data); // Works in React state
        } catch (error) {
            message.error("error");
        } finally {
            setLoading(false);
        }
    };

    // Fetch data from Supabase
    const fetchDataAccessories = async () => {
        try {
            setLoading(true);
            const data = await AccessoryService.getTableCounts();
            setDataAccessory(data); // Works in React state
        } catch (error) {
            message.error("error");
        } finally {
            setLoading(false);
        }
    };

    // Fetch data from Supabase
    const fetchDataConsumables = async () => {
        try {
            setLoading(true);
            const data = await ConsumableService.getTableCounts();
            setDataConsumable(data); // Works in React state
        } catch (error) {
            message.error("error");
        } finally {
            setLoading(false);
        }
    };

    // Fetch data from Supabase
    const fetchDataComponents = async () => {
        try {
            setLoading(true);
            const data = await ComponentService.getTableCounts();
            setDataComponent(data); // Works in React state
        } catch (error) {
            message.error("error");
        } finally {
            setLoading(false);
        }
    };

    useMemo(() => {
        setUserID(localStorage.getItem('userAuthID'));
        setDepartmentID(localStorage.getItem('userDept'));
    }, []);

    useEffect(() => {
        fetchDataAsset();
        fetchDataAssetTable();
        fetchDataLicenses();
        fetchDataAccessories();
        fetchDataConsumables();
        fetchDataComponents();
    }, []); // Empty dependency array means this runs once on mount

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "PHP",
        }).format(amount);
    };

    const columns: TableColumnsType<DataType> = [
        {
            title: "Date",
            dataIndex: "date",
        },
        {
            title: "Created By",
            dataIndex: "created_by",
        },
        {
            title: "Action",
            dataIndex: "action",
        },
        {
            title: "Item",
            dataIndex: "item",
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

    const columnsAsset: TableColumnsType<Asset> = [
        {
            title: "Asset Name",
            dataIndex: "name",
        },
        {
            title: "Status",
            dataIndex: "status",
            render: () => (
                <>
                    <Tag color="green">
                        <CheckCircleOutlined className="float-left mt-1 mr-1" /> Active
                    </Tag>
                </>
            )
        },
    ];

    const salesData = [
        { category: "Jan", value: dataAsset },
        { category: "Feb", value: 200 },
        { category: "Mar", value: 150 },
        { category: "Apr", value: 80 },
        { category: "May", value: 270 },
        { category: "Jun", value: 270 },
        { category: "Jul", value: 270 },
        { category: "Aug", value: 270 },
        { category: "Sept", value: 270 },
        { category: "Oct", value: 270 },
        { category: "Nov", value: 270 },
        { category: "Dec", value: 270 },
    ];

    return (
        <div>
            <Alert
                message="You can see here all the status of overall inventory status. Please check closely."
                type="info"
                showIcon
            />

            {/* THIS IS THE FIRST ROWN OF DASHBOARD */}

            <Row gutter={16} className="pt-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-6 w-full">
                    <div
                        className="rounded-md shadow-md overflow-hidden transition-transform duration-300 hover:scale-105"
                        style={{ border: "1px solid #e1e3e1" }}
                    >
                        <div className="p-4">
                            <h2 className="text-sm font-semibold mb-2">Assets</h2>
                            <p className="flex flex-wrap text-green-600 text-2xl font-bold">
                                <AiOutlineSnippets className="mt-1 mr-2" />{" "}
                                {loading && <Spin></Spin>}
                                {!loading && dataAsset}
                            </p>
                            <p>Your total assets of ERP System</p>
                        </div>
                    </div>
                    <div
                        className="rounded-md shadow-md overflow-hidden transition-transform duration-300 hover:scale-105"
                        style={{ border: "1px solid #e1e3e1" }}
                    >
                        <div className="p-4">
                            <h2 className="text-sm font-semibold mb-2">Licenses</h2>
                            <p className="flex flex-wrap text-green-600 text-2xl font-bold">
                                <AiOutlineSchedule className="mt-1 mr-2" />{" "}
                                {loading && <Spin></Spin>}
                                {!loading && dataLicense}
                            </p>
                            <p>Total licenses of ERP System</p>
                        </div>
                    </div>
                    <div
                        className="rounded-md shadow-md overflow-hidden transition-transform duration-300 hover:scale-105"
                        style={{ border: "1px solid #e1e3e1" }}
                    >
                        <div className="p-4">
                            <h2 className="text-sm font-semibold mb-2">Accessories</h2>
                            <p className="flex flex-wrap text-green-600 text-2xl font-bold">
                                <AiOutlineMobile className="mt-1 mr-2" />{" "}
                                {loading && <Spin></Spin>}
                                {!loading && dataAccessory}
                            </p>
                            <p>Total accessories of ERP System</p>
                        </div>
                    </div>
                    <div
                        className="rounded-md shadow-md overflow-hidden transition-transform duration-300 hover:scale-105"
                        style={{ border: "1px solid #e1e3e1" }}
                    >
                        <div className="p-4">
                            <h2 className="text-sm font-semibold mb-2">Consumables</h2>
                            <p className="flex flex-wrap text-green-600 text-2xl font-bold">
                                <AiOutlineShopping className="mt-1 mr-2" />{" "}
                                {loading && <Spin></Spin>}
                                {!loading && dataConsumable}
                            </p>
                            <p>Total Consumables of ERP System</p>
                        </div>
                    </div>
                    <div
                        className="rounded-md shadow-md overflow-hidden transition-transform duration-300 hover:scale-105"
                        style={{ border: "1px solid #e1e3e1" }}
                    >
                        <div className="p-4">
                            <h2 className="text-sm font-semibold mb-2">Components</h2>
                            <p className="flex flex-wrap text-green-600 text-2xl font-bold">
                                <AiOutlineDesktop className="mt-1 mr-2" />{" "}
                                {loading && <Spin></Spin>}
                                {!loading && dataComponent}
                            </p>
                            <p>Total Components of ERP System</p>
                        </div>
                    </div>
                </div>
            </Row>

            {/* THIS IS THE SECOND ROW OF DASHBOARD */}

            <Row gutter={16} className="pt-5">
                <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-2 gap-6 w-full">
                    <div
                        className="rounded-md shadow-md overflow-hidden transition-transform duration-300"
                        style={{ border: "1px solid #e1e3e1" }}
                    >
                        <div className="p-4">
                            <h2 className="text-sm font-semibold mb-2">
                                Inventory By Category
                            </h2>
                            <p className="flex flex-wrap">Current month breakdown</p>
                            {loading && <Spin></Spin>}
                            {!loading &&
                                <PieChart
                                    data={[
                                        { type: "Assets", value: dataAsset },
                                        { type: "Licenses", value: dataLicense },
                                        { type: "Accessories", value: dataAccessory },
                                        { type: "Consumables", value: dataConsumable },
                                        { type: "Components", value: dataComponent },
                                    ]}
                                    title=""
                                />}

                        </div>
                    </div>
                    <div
                        className="rounded-md shadow-md overflow-hidden transition-transform duration-300"
                        style={{ border: "1px solid #e1e3e1" }}
                    >
                        <div className="p-4">
                            <h2 className="text-sm font-semibold mb-2">
                                Monthly Data Trend
                            </h2>
                            <p className="flex flex-wrap">Last current months</p>
                            <BarChart
                                data={salesData}
                                title=""
                                color="#16a34a"
                                height={350}
                            />
                        </div>
                    </div>
                </div>
            </Row>

            {/* THIS IS THE THIRD ROW OF DASHBOARD */}

            <Row gutter={16} className="pt-5">
                <Col span={24}>
                    <div className="shadow-md">
                        <Card title="Assets Overview" variant="borderless">
                            {loading && <Spin></Spin>}
                            {!loading &&
                                <Table<Asset>
                                    bordered
                                    size={"small"}
                                    columns={columnsAsset}
                                    dataSource={dataAssetTable}
                                />}
                        </Card>
                    </div>
                </Col>
            </Row>
        </div>
    );
}