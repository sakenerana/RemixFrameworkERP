import { ApartmentOutlined, CheckCircleOutlined, CloseCircleOutlined, TeamOutlined, UserOutlined } from "@ant-design/icons";
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
    Space,
    Typography,
    Progress,
} from "antd";
import { useEffect, useMemo, useState } from "react";
import { AiOutlineDesktop, AiOutlineMobile, AiOutlineSchedule, AiOutlineShopping, AiOutlineSnippets, AiOutlineSolution, AiOutlineStock, AiOutlineUserAdd, AiOutlineUserDelete, AiOutlineUsergroupAdd } from "react-icons/ai";
import {
} from "react-icons/fc";
import { RiCircleFill, RiPieChart2Fill } from "react-icons/ri";
import BarChart from "~/components/bar_chart";
import PieChart from "~/components/pie_chart";
import { AccessoryService } from "~/services/accessory.service";
import { AssetService } from "~/services/asset.service";
import { ComponentService } from "~/services/component.service";
import { ConsumableService } from "~/services/consumable.service";
import { LicenseService } from "~/services/license.service";
import { Asset } from "~/types/asset.type";
const { Title, Text } = Typography;

interface DataType {
    key: React.Key;
    date: string;
    name: string;
    created_by: string;
    action: string;
    item: string;
}

interface DashboardMetric {
    title: string;
    value: number | string;
    icon: React.ReactNode;
    color: string;
    trend?: number;
    loading: boolean;
    description: string;
}

export default function DashboardRoutes() {
    const [dataAsset, setDataAsset] = useState<any>();
    const [dataAssetTable, setDataAssetTable] = useState<Asset[]>([]);
    const [dataLicense, setDataLicense] = useState<any>();
    const [dataAccessory, setDataAccessory] = useState<any>();
    const [dataConsumable, setDataConsumable] = useState<any>();
    const [dataComponent, setDataComponent] = useState<any>();
    const [loading, setLoading] = useState(true);

    const [isUserID, setUserID] = useState<any>();
    const [isDepartmentID, setDepartmentID] = useState<any>();
    const [error, setError] = useState<string | null>(null);

    const [metrics, setMetrics] = useState<any>({
        assets: 0,
        licenses: 0,
        accessory: 0,
        consumable: 0,
        component: 0
    });

    // Fetch all data in parallel
    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [assets, licenses, accessory, consumable, component] = await Promise.all([
                AssetService.getTableCounts(),
                LicenseService.getTableCounts(),
                AccessoryService.getTableCounts(),
                ConsumableService.getTableCounts(),
                ComponentService.getTableCounts()
            ]);

            setMetrics({
                assets,
                licenses,
                accessory,
                consumable,
                component
            });
            setDataAsset(assets);
            setDataLicense(licenses);
            setDataAccessory(accessory);
            setDataConsumable(consumable);
            setDataComponent(dataComponent);
        } catch (err) {
            setError("Failed to load dashboard data");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Fetch data from Supabase
    const fetchDataAssetTable = async () => {
        try {
            setLoading(true);
            const dataFetch = await AssetService.getAllPostsLimit(isDepartmentID);
            setDataAssetTable(dataFetch); // Works in React state
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
        fetchDashboardData();
        fetchDataAssetTable();
    }, []); // Empty dependency array means this runs once on mount

    const dashboardMetrics: DashboardMetric[] = [
        {
            title: "Assets",
            value: metrics.assets,
            icon: <AiOutlineSnippets />,
            color: "#52c41a",
            trend: 12,
            loading,
            description: "Total assets"
        },
        {
            title: "Licenses",
            value: metrics.licenses,
            icon: <AiOutlineSchedule />,
            color: "#1890ff",
            trend: 0,
            loading,
            description: "Total licenses"
        },
        {
            title: "Accessories",
            value: metrics.accessory,
            icon: <AiOutlineMobile />,
            color: "#722ed1",
            trend: 5,
            loading,
            description: "Total accessories"
        },
        {
            title: "Consumables",
            value: metrics.consumable,
            icon: <AiOutlineShopping />,
            color: "#f5222d",
            trend: -8,
            loading,
            description: "Total consumables"
        },
        {
            title: "Components",
            value: metrics.component,
            icon: <AiOutlineDesktop />,
            color: "#f4a540",
            trend: -8,
            loading,
            description: "Total Components"
        }
    ];

    const renderTrendIndicator = (trend: number) => {
        if (trend > 0) {
            return <span style={{ color: '#52c41a' }}>↑ {trend}%</span>;
        } else if (trend < 0) {
            return <span style={{ color: '#f5222d' }}>↓ {Math.abs(trend)}%</span>;
        }
        return <span>→</span>;
    };

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
            {/* Metrics Section */}
            <Row gutter={[16, 16]} justify="space-between" className="mt-4">
                {dashboardMetrics.map((metric, index) => (
                    <Col
                        key={index}
                        xs={24}
                        sm={12}
                        md={8}
                        lg={6}
                        flex="1 1 0" // Force equal distribution
                        style={{ minWidth: "200px", maxWidth: "100%" }} // Prevent overflow
                    >
                        <Card
                            hoverable
                            loading={metric.loading}
                            bodyStyle={{ padding: '16px' }}
                            className="rounded-md shadow-md overflow-hidden transition-transform duration-300 hover:scale-105"
                        >
                            {/* Card content remains the same */}
                            <Space direction="vertical" size="small" style={{ width: '100%' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Text strong style={{ color: metric.color }}>
                                        {metric.icon} {metric.title}
                                    </Text>
                                    {metric.trend !== undefined && (
                                        <Text type="secondary">
                                            {renderTrendIndicator(metric.trend)}
                                        </Text>
                                    )}
                                </div>
                                <Title level={3} style={{ margin: 0, color: metric.color }}>
                                    {metric.loading ? '--' : metric.value}
                                </Title>
                                <Text type="secondary">{metric.description}</Text>
                                {metric.trend !== undefined && (
                                    <Progress
                                        percent={Math.abs(metric.trend)}
                                        showInfo={false}
                                        strokeColor={metric.trend > 0 ? '#52c41a' : '#f5222d'}
                                        size="small"
                                    />
                                )}
                            </Space>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* THIS IS THE SECOND ROW OF DASHBOARD */}

            <Row className="pt-5">
                <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-2 gap-6 w-full">
                    <Card
                        className="rounded-md shadow-md overflow-hidden transition-transform duration-300"
                    >
                        <div>
                            <h2 className="flex flex-wrap text-sm font-semibold mb-2">
                                <RiCircleFill className="text-[5px] text-green-500 mt-2 mr-2" /> Inventory By Category
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
                    </Card>
                    <Card
                        className="rounded-md shadow-md overflow-hidden transition-transform duration-300"
                    >
                        <div>
                            <h2 className="flex flex-wrap text-sm font-semibold mb-2">
                                <RiCircleFill className="text-[5px] text-green-500 mt-2 mr-2" /> Monthly Data Trend
                            </h2>
                            <p className="flex flex-wrap">Last current months</p>
                            <BarChart
                                data={salesData}
                                title=""
                                color="#16a34a"
                                height={350}
                            />
                        </div>
                    </Card>
                </div>
            </Row>

            {/* THIS IS THE THIRD ROW OF DASHBOARD */}

            <Row gutter={16} className="pt-7">
                <Col span={24}>
                    <div className="shadow-lg">
                        <Card title={
                            <div className="flex items-center">
                                <RiPieChart2Fill className="mr-2 text-green-500" /> {/* Your icon */}
                                Latest (5) Assets Overview
                            </div>
                        }>
                            {loading && <Spin></Spin>}
                            {!loading &&
                                <Table<Asset>
                                    bordered
                                    size={"small"}
                                    columns={columnsAsset}
                                    dataSource={dataAssetTable}
                                    pagination={false}
                                />}
                        </Card>
                    </div>
                </Col>
            </Row>
        </div>
    );
}