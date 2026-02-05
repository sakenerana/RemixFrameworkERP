import {
    Layout,
    ConfigProvider,
    Avatar,
} from "antd";
import { ProtectedRoute } from "~/components/ProtectedRoute";
import { ArrowLeftFromLine, Home, LogOut, User } from "lucide-react";
import MetricCard2 from "~/components/MetricCard2";
import BranchTopRightSider from "~/components/BranchTopRightSider";

const { Header, Content } = Layout;

export interface Staff {
    id: string;
    name: string;
    tasks?: number;
    inventory?: number;
    taskCompleted: number;
    replenishmentDays: number;
    avgDailySales?: number;
    totalSales?: string;
    status: 'critical' | 'warning' | 'stable' | 'good';
}

export const VIEW_STAFFS: Staff[] = [
    { id: '1', name: 'Charls Dave Erana', tasks: 9817, taskCompleted: 14, replenishmentDays: 7, status: 'stable' },
    { id: '2', name: 'Richard Erana', tasks: 9724, taskCompleted: 6, replenishmentDays: 10, status: 'warning' },
    { id: '3', name: 'Ron Richard Bascon', tasks: 9687, taskCompleted: 13, replenishmentDays: 5, status: 'stable' },
    { id: '4', name: 'Ray Jhun Cagata', tasks: 8232, taskCompleted: 21, replenishmentDays: 14, status: 'good' },
    { id: '5', name: 'Melvin Evangelista', tasks: 7575, taskCompleted: 4, replenishmentDays: 12, status: 'critical' },
];

export default function PersonnelLayoutIndex() {
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
                                <h2 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">Personnel Tasks</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <MetricCard2
                                        title="Main Office"
                                        subtitle="test"
                                        value="480"
                                        percentage={24}
                                        percentageColor="bg-green-500"
                                        subtitleValue="123"
                                        topStaffLabel="Most Active Staff"
                                        topStaffName="Main Office"
                                        staffs={VIEW_STAFFS}
                                        type="tasks"
                                    />
                                    <MetricCard2
                                        title="Danao Branch"
                                        subtitle="test"
                                        value="560"
                                        percentage={28}
                                        percentageColor="bg-orange-500"
                                        subtitleValue="123"
                                        topStaffLabel="Most Active Staff"
                                        topStaffName="Danao Branch"
                                        staffs={[...VIEW_STAFFS].reverse()}
                                        type="tasks"
                                    />
                                    <MetricCard2
                                        title="Lapu-Lapu Branch"
                                        subtitle="test"
                                        value="160"
                                        percentage={8}
                                        percentageColor="bg-red-500"
                                        subtitleValue="123"
                                        topStaffLabel="Most Active Staff"
                                        topStaffName="Lapu-Lapu Branch"
                                        staffs={VIEW_STAFFS.map(p => ({ ...p, status: 'critical' as const }))}
                                        type="tasks"
                                    />
                                    <MetricCard2
                                        title="Bantayan Branch"
                                        subtitle="test"
                                        value="160"
                                        percentage={8}
                                        percentageColor="bg-red-500"
                                        subtitleValue="123"
                                        topStaffLabel="Most Active Staff"
                                        topStaffName="Bantayan Branch"
                                        staffs={VIEW_STAFFS.map(p => ({ ...p, status: 'critical' as const }))}
                                        type="tasks"
                                    />
                                    <MetricCard2
                                        title="Makati Branch"
                                        subtitle="test"
                                        value="160"
                                        percentage={8}
                                        percentageColor="bg-red-500"
                                        subtitleValue="123"
                                        topStaffLabel="Most Active Staff"
                                        topStaffName="Makati Branch"
                                        staffs={VIEW_STAFFS.map(p => ({ ...p, status: 'critical' as const }))}
                                        type="tasks"
                                    />
                                    <MetricCard2
                                        title="Tacloban Branch"
                                        subtitle="test"
                                        value="160"
                                        percentage={8}
                                        percentageColor="bg-red-500"
                                        subtitleValue="123"
                                        topStaffLabel="Most Active Staff"
                                        topStaffName="Tacloban Branch"
                                        staffs={VIEW_STAFFS.map(p => ({ ...p, status: 'critical' as const }))}
                                        type="tasks"
                                    />
                                </div>
                            </section>

                        </main>
                    </div>

                    {/* Right Sidebar */}
                    <BranchTopRightSider />
                </div>
            </ConfigProvider>
        </ProtectedRoute>
    );
}