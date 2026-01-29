import { CheckCircleOutlined, GlobalOutlined } from "@ant-design/icons";
import {
    Alert,
    Button,
    Card,
    Col,
    Row,
    TableColumnsType,
    Table,
    message,
    Tag,
    Spin,
    Space,
    Typography,
    Progress,
} from "antd";
import { useEffect, useMemo, useState } from "react";
import { AiOutlineDesktop, AiOutlineMobile, AiOutlineSchedule, AiOutlineShopping, AiOutlineSnippets } from "react-icons/ai";
import { RiCircleFill, RiPieChart2Fill } from "react-icons/ri";
import AreaChart from "~/components/area_chart";
import BarChart from "~/components/bar_chart";
import PieChart from "~/components/pie_chart";
import { ProtectedRoute } from "~/components/ProtectedRoute";
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
    gradient: string;
}

// Language content
const translations = {
    en: {
        alertMessage: "You can see here all the status of overall inventory status. Please check closely.",
        assets: "Assets",
        licenses: "Licenses",
        accessories: "Accessories",
        consumables: "Consumables",
        components: "Components",
        totalDescription: "Total",
        inventoryByCategory: "Inventory By Category",
        currentMonthBreakdown: "Current month breakdown",
        monthlyDataTrend: "Monthly Data Trend",
        lastMonths: "Last current months",
        latestAssets: "Latest (5) Assets Overview",
        active: "Active",
        dashboardTitle: "Inventory Dashboard",
        switchToFilipino: "Switch to Filipino",
        switchToEnglish: "Switch to English"
    },
    fil: {
        alertMessage: "Maaari mong makita dito ang lahat ng status ng kabuuang inventory. Mangyaring suriin nang mabuti.",
        assets: "Mga Asset",
        licenses: "Mga Lisensya",
        accessories: "Mga Aksesorya",
        consumables: "Mga Consumable",
        components: "Mga Komponente",
        totalDescription: "Kabuuan",
        inventoryByCategory: "Inventory Ayon sa Kategorya",
        currentMonthBreakdown: "Pagbabalangkas ng kasalukuyang buwan",
        monthlyDataTrend: "Trend ng Buwanang Data",
        lastMonths: "Nakaraang mga buwan",
        latestAssets: "Pangkalahatang-ideya ng Pinakabagong (5) Asset",
        active: "Aktibo",
        dashboardTitle: "Dashboard ng Inventory",
        switchToFilipino: "Palitan sa Filipino",
        switchToEnglish: "Palitan sa Ingles"
    }
};

const dataAreaChart = [
    { date: '2025-01-01', value: 3000, category: 'Assets' },
    { date: '2025-01-02', value: 4000, category: 'Assets' },
    { date: '2025-01-03', value: 3500, category: 'Assets' },
    { date: '2025-01-04', value: 5000, category: 'Assets' },
    { date: '2025-01-05', value: 4500, category: 'Assets' },
    { date: '2025-01-01', value: 2000, category: 'Licenses' },
    { date: '2025-01-02', value: 3000, category: 'Licenses' },
    { date: '2025-01-03', value: 4500, category: 'Licenses' },
    { date: '2025-01-04', value: 3500, category: 'Licenses' },
    { date: '2025-01-05', value: 4000, category: 'Licenses' },
    { date: '2025-01-01', value: 1500, category: 'Accessories' },
    { date: '2025-01-02', value: 2500, category: 'Accessories' },
    { date: '2025-01-03', value: 3000, category: 'Accessories' },
    { date: '2025-01-04', value: 4000, category: 'Accessories' },
    { date: '2025-01-05', value: 3500, category: 'Accessories' },
    { date: '2025-01-01', value: 1500, category: 'Consumables' },
    { date: '2025-01-02', value: 2500, category: 'Consumables' },
    { date: '2025-01-03', value: 3000, category: 'Consumables' },
    { date: '2025-01-04', value: 4000, category: 'Consumables' },
    { date: '2025-01-05', value: 3500, category: 'Consumables' },
    { date: '2025-01-01', value: 1500, category: 'Components' },
    { date: '2025-01-02', value: 2500, category: 'Components' },
    { date: '2025-01-03', value: 3000, category: 'Components' },
    { date: '2025-01-04', value: 4000, category: 'Components' },
    { date: '2025-01-05', value: 3500, category: 'Components' },
];

export default function DashboardRoutes() {
    const [dataAsset, setDataAsset] = useState<any>();
    const [dataAssetTable, setDataAssetTable] = useState<Asset[]>([]);
    const [dataLicense, setDataLicense] = useState<any>();
    const [dataAccessory, setDataAccessory] = useState<any>();
    const [dataConsumable, setDataConsumable] = useState<any>();
    const [dataComponent, setDataComponent] = useState<any>();
    const [loading, setLoading] = useState(true);
    const [language, setLanguage] = useState<'en' | 'fil'>('en');
    const [t, setT] = useState(translations.en);

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

    // Toggle language
    const toggleLanguage = () => {
        const newLanguage = language === 'en' ? 'fil' : 'en';
        setLanguage(newLanguage);
        setT(translations[newLanguage]);
    };

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
            setDataAssetTable(dataFetch);
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
    }, []);

    const dashboardMetrics: DashboardMetric[] = [
        {
            title: t.assets,
            value: metrics.assets,
            icon: <AiOutlineSnippets />,
            color: "#ffffff",
            trend: 12,
            loading,
            description: `${t.totalDescription} ${t.assets.toLowerCase()}`,
            gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" // Purple gradient
        },
        {
            title: t.licenses,
            value: metrics.licenses,
            icon: <AiOutlineSchedule />,
            color: "#ffffff",
            trend: 0,
            loading,
            description: `${t.totalDescription} ${t.licenses.toLowerCase()}`,
            gradient: "linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%)" // Coral Pink
        },
        {
            title: t.accessories,
            value: metrics.accessory,
            icon: <AiOutlineMobile />,
            color: "#ffffff",
            trend: 5,
            loading,
            description: `${t.totalDescription} ${t.accessories.toLowerCase()}`,
            gradient: "linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)" // Ocean Blue
        },
        {
            title: t.consumables,
            value: metrics.consumable,
            icon: <AiOutlineShopping />,
            color: "#ffffff",
            trend: -8,
            loading,
            description: `${t.totalDescription} ${t.consumables.toLowerCase()}`,
            gradient: "linear-gradient(135deg, #56ab2f 0%, #a8e063 100%)" // Forest Green
        },
        {
            title: t.components,
            value: metrics.component,
            icon: <AiOutlineDesktop />,
            color: "#ffffff",
            trend: -8,
            loading,
            description: `${t.totalDescription} ${t.components.toLowerCase()}`,
            gradient: "linear-gradient(135deg, #ff9966 0%, #ff5e62 100%)" // Sunset Orange
        }
    ];

    const renderTrendIndicator = (trend: number) => {
        if (trend > 0) {
            return <span style={{ color: '#ffffff' }}>↑ {trend}%</span>;
        } else if (trend < 0) {
            return <span style={{ color: '#ffffff' }}>↓ {Math.abs(trend)}%</span>;
        }
        return <span style={{ color: '#ffffff' }}>→</span>;
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "PHP",
        }).format(amount);
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
                        <CheckCircleOutlined className="float-left mt-1 mr-1" /> {t.active}
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
        <ProtectedRoute>
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h1 className="font-bold">{t.dashboardTitle}</h1>
                    <Button type="default" onClick={toggleLanguage}>
                        <GlobalOutlined />
                        {language === 'en' ? t.switchToFilipino : t.switchToEnglish}
                    </Button>
                </div>

                <Alert
                    message={t.alertMessage}
                    type="info"
                    showIcon
                />

                {/* Metrics Section */}
                <Row gutter={[16, 16]} justify="space-between" className="mt-4">
                    {dashboardMetrics.map((metric, index) => (
                        <Col
                            key={index}
                            xs={24}
                            sm={12}
                            md={8}
                            lg={6}
                            flex="1 1 0"
                            style={{ minWidth: "200px", maxWidth: "100%" }}
                        >
                            <Card
                                hoverable
                                loading={metric.loading}
                                bodyStyle={{
                                    padding: '16px',
                                    background: metric.gradient,
                                    borderRadius: '8px',
                                    color: '#ffffff'
                                }}
                                className="rounded-md shadow-sm overflow-hidden transition-transform duration-300 hover:scale-105"
                            >
                                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Text strong style={{ color: metric.color, fontSize: '14px' }}>
                                            {metric.icon} {metric.title}
                                        </Text>
                                        {metric.trend !== undefined && (
                                            <Text style={{ color: metric.color, fontSize: '12px' }}>
                                                {renderTrendIndicator(metric.trend)}
                                            </Text>
                                        )}
                                    </div>
                                    <Title level={3} style={{ margin: 0, color: metric.color, fontSize: '28px' }}>
                                        {metric.loading ? '--' : metric.value}
                                    </Title>
                                    <Text style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '12px' }}>{metric.description}</Text>
                                    {metric.trend !== undefined && (
                                        <Progress
                                            percent={Math.abs(metric.trend)}
                                            showInfo={false}
                                            strokeColor="#ffffff"
                                            trailColor="rgba(255, 255, 255, 0.3)"
                                            size="small"
                                        />
                                    )}
                                </Space>
                            </Card>
                        </Col>
                    ))}
                </Row>

                {/* Charts Section */}
                <Row className="pt-5">
                    <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-2 gap-6 w-full">
                        <Card className="rounded-md shadow-sm overflow-hidden transition-transform duration-300">
                            <div>
                                <h2 className="flex flex-wrap text-sm font-semibold mb-2">
                                    <RiCircleFill className="text-[5px] text-green-500 mt-2 mr-2" /> {t.inventoryByCategory}
                                </h2>
                                <p className="flex flex-wrap text-xs">{t.currentMonthBreakdown}</p>
                                {loading && <Spin></Spin>}
                                {!loading &&
                                    <AreaChart data={dataAreaChart} />
                                    // <PieChart
                                    //     data={[
                                    //         { type: t.assets, value: dataAsset },
                                    //         { type: t.licenses, value: dataLicense },
                                    //         { type: t.accessories, value: dataAccessory },
                                    //         { type: t.consumables, value: dataConsumable },
                                    //         { type: t.components, value: dataComponent },
                                    //     ]}
                                    //     title=""
                                    // />
                                }
                            </div>
                        </Card>
                        <Card className="rounded-md shadow-sm overflow-hidden transition-transform duration-300">
                            <div>
                                <h2 className="flex flex-wrap text-sm font-semibold mb-2">
                                    <RiCircleFill className="text-[5px] text-green-500 mt-2 mr-2" /> {t.monthlyDataTrend}
                                </h2>
                                <p className="flex flex-wrap text-xs">{t.lastMonths}</p>
                                <BarChart
                                    data={salesData}
                                    title=""

                                    height={350}
                                />
                            </div>
                        </Card>
                    </div>
                </Row>

                {/* Latest Assets Table */}
                <Row gutter={16} className="pt-7">
                    <Col span={24}>
                        <div className="shadow-sm">
                            <Card title={
                                <div className="flex items-center">
                                    <RiPieChart2Fill className="mr-2 text-green-500" />
                                    {t.latestAssets}
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
        </ProtectedRoute>
    );
}