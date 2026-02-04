import {
    Layout,
    ConfigProvider,
    Avatar,
} from "antd";
import { ProtectedRoute } from "~/components/ProtectedRoute";
import { ArrowLeftFromLine, Home, LogOut, User } from "lucide-react";
import MetricCard2 from "~/components/MetricCard2";
import StockPredictions from "~/components/StockPredictions";

const { Header, Content } = Layout;

export interface Product {
    id: string;
    name: string;
    views?: number;
    inventory?: number;
    daysSupply: number;
    replenishmentDays: number;
    avgDailySales?: number;
    totalSales?: string;
    status: 'critical' | 'warning' | 'stable' | 'good';
}

export const VIEW_PRODUCTS: Product[] = [
    { id: '1', name: 'Utility Pocket Coat', views: 9817, daysSupply: 14, replenishmentDays: 7, status: 'stable' },
    { id: '2', name: 'Feather Trim Jacket', views: 9724, daysSupply: 6, replenishmentDays: 10, status: 'warning' },
    { id: '3', name: 'Bomber Jacket', views: 9687, daysSupply: 13, replenishmentDays: 5, status: 'stable' },
    { id: '4', name: 'Half-Zip Sweater', views: 8232, daysSupply: 21, replenishmentDays: 14, status: 'good' },
    { id: '5', name: 'Felted Wool Jacket', views: 7575, daysSupply: 4, replenishmentDays: 12, status: 'critical' },
];

export default function PerformanceReportLayoutIndex() {
    return (
        <ProtectedRoute>
            <ConfigProvider
                theme={{
                    token: {
                        colorPrimary: '#1890ff',
                        borderRadius: 4,
                    },
                }}
            >
                <div className="flex h-screen bg-[#f3f4f6] overflow-hidden">
                    {/* Main Content Area */}
                    <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
                        {/* Top Header */}
                        <header className="bg-[#1890ff] px-0 flex items-center justify-between h-14 sticky top-0 z-50 shadow-md">
                            <div className="flex items-center">
                                <div className="flex items-center h-14">
                                    <a href="/landing-page" className="h-full">
                                        <button className="h-full px-6 flex items-center justify-center hover:bg-blue-600 transition-colors border-r border-blue-400 bg-blue-700">
                                            <Home className="text-white w-5 h-5" />
                                        </button>
                                    </a>
                                    <a href="/performancereport" className="h-full">
                                        <button className="h-full px-6 flex items-center justify-center hover:bg-blue-600 transition-colors border-r border-blue-400">
                                            <ArrowLeftFromLine className="text-white w-5 h-5" />
                                        </button>
                                    </a>
                                </div>
                            </div>
                            <div className="flex items-center px-6 gap-4">
                                <div className="hidden md:flex flex-col items-end text-white leading-tight">
                                    <span className="text-xs font-bold">CFI Management System</span>
                                    <span className="text-[10px] opacity-80">Online</span>
                                </div>
                                <Avatar src="/img/cfi-circle.png" />
                            </div>
                        </header>

                        {/* Dashboard Content */}
                        <main className="p-6 space-y-8">
                            {/* Views Section */}
                            <section>
                                <h2 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">New Membership by Branches</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <MetricCard2
                                        title="Most Viewed Products"
                                        subtitle="test"
                                        value="480"
                                        percentage={24}
                                        percentageColor="bg-green-500"
                                        subtitleValue="69.2 M"
                                        topProductLabel="Most Viewed Product"
                                        topProductName="Utility Pocket Coat"
                                        products={VIEW_PRODUCTS}
                                        type="views"
                                    />
                                    <MetricCard2
                                        title="Least Viewed Products"
                                        subtitle="test"
                                        value="560"
                                        percentage={28}
                                        percentageColor="bg-orange-500"
                                        subtitleValue="53.2 M"
                                        topProductLabel="Least Viewed Product"
                                        topProductName="Half-Zip Sweater"
                                        products={[...VIEW_PRODUCTS].reverse()}
                                        type="views"
                                    />
                                    <MetricCard2
                                        title="Products Not Viewed"
                                        subtitle="test"
                                        value="160"
                                        percentage={8}
                                        percentageColor="bg-red-500"
                                        subtitleValue="48.5 M"
                                        topProductLabel="Highest Inventory Product"
                                        topProductName="Down Jacket"
                                        products={VIEW_PRODUCTS.map(p => ({ ...p, status: 'critical' as const }))}
                                        type="views"
                                    />
                                    <MetricCard2
                                        title="Products Not Viewed"
                                        subtitle="test"
                                        value="160"
                                        percentage={8}
                                        percentageColor="bg-red-500"
                                        subtitleValue="48.5 M"
                                        topProductLabel="Highest Inventory Product"
                                        topProductName="Down Jacket"
                                        products={VIEW_PRODUCTS.map(p => ({ ...p, status: 'critical' as const }))}
                                        type="views"
                                    />
                                    <MetricCard2
                                        title="Products Not Viewed"
                                        subtitle="test"
                                        value="160"
                                        percentage={8}
                                        percentageColor="bg-red-500"
                                        subtitleValue="48.5 M"
                                        topProductLabel="Highest Inventory Product"
                                        topProductName="Down Jacket"
                                        products={VIEW_PRODUCTS.map(p => ({ ...p, status: 'critical' as const }))}
                                        type="views"
                                    />
                                    <MetricCard2
                                        title="Products Not Viewed"
                                        subtitle="test"
                                        value="160"
                                        percentage={8}
                                        percentageColor="bg-red-500"
                                        subtitleValue="48.5 M"
                                        topProductLabel="Highest Inventory Product"
                                        topProductName="Down Jacket"
                                        products={VIEW_PRODUCTS.map(p => ({ ...p, status: 'critical' as const }))}
                                        type="views"
                                    />
                                </div>
                            </section>

                        </main>
                    </div>

                    {/* Right Sidebar */}
                    <StockPredictions />
                </div>
            </ConfigProvider>
        </ProtectedRoute>
    );
}