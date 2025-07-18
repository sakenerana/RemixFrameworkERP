import { ApartmentOutlined, CheckCircleOutlined, CloseCircleOutlined, GlobalOutlined, TeamOutlined, UserOutlined } from "@ant-design/icons";
import {
    Alert,
    Button,
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
import { RiCircleFill, RiPieChart2Fill } from "react-icons/ri";
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
            color: "#52c41a",
            trend: 12,
            loading,
            description: `${t.totalDescription} ${t.assets.toLowerCase()}`
        },
        {
            title: t.licenses,
            value: metrics.licenses,
            icon: <AiOutlineSchedule />,
            color: "#1890ff",
            trend: 0,
            loading,
            description: `${t.totalDescription} ${t.licenses.toLowerCase()}`
        },
        {
            title: t.accessories,
            value: metrics.accessory,
            icon: <AiOutlineMobile />,
            color: "#722ed1",
            trend: 5,
            loading,
            description: `${t.totalDescription} ${t.accessories.toLowerCase()}`
        },
        {
            title: t.consumables,
            value: metrics.consumable,
            icon: <AiOutlineShopping />,
            color: "#f5222d",
            trend: -8,
            loading,
            description: `${t.totalDescription} ${t.consumables.toLowerCase()}`
        },
        {
            title: t.components,
            value: metrics.component,
            icon: <AiOutlineDesktop />,
            color: "#f4a540",
            trend: -8,
            loading,
            description: `${t.totalDescription} ${t.components.toLowerCase()}`
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
                    <Title level={3}>{t.dashboardTitle}</Title>
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
                                bodyStyle={{ padding: '16px' }}
                                className="rounded-md shadow-sm overflow-hidden transition-transform duration-300 hover:scale-105"
                            >
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
                                    <Text type="secondary" className="text-xs">{metric.description}</Text>
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
                                    <PieChart
                                        data={[
                                            { type: t.assets, value: dataAsset },
                                            { type: t.licenses, value: dataLicense },
                                            { type: t.accessories, value: dataAccessory },
                                            { type: t.consumables, value: dataConsumable },
                                            { type: t.components, value: dataComponent },
                                        ]}
                                        title=""
                                    />}
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
                                    color="#16a34a"
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