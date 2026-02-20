import {
    Layout,
    ConfigProvider,
    Avatar,
} from "antd";
import { ProtectedRoute } from "~/components/ProtectedRoute";
import { ArrowLeftFromLine, Home, LogOut, User } from "lucide-react";
import MetricCardPersonnel from "~/components/MetricCardPersonnel";
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

export const VIEW_SATELLITE_BRANCHES_MAIN: Staff[] = [
    { id: '1', name: 'Barili', tasks: 9817, taskCompleted: 14, replenishmentDays: 7, status: 'stable' },
    { id: '2', name: 'Bogo', tasks: 9724, taskCompleted: 6, replenishmentDays: 10, status: 'warning' },
    { id: '3', name: 'Camotes', tasks: 9687, taskCompleted: 13, replenishmentDays: 5, status: 'stable' },
    { id: '4', name: 'Carcar', tasks: 8232, taskCompleted: 21, replenishmentDays: 14, status: 'good' },
    { id: '5', name: 'Danao', tasks: 7575, taskCompleted: 4, replenishmentDays: 12, status: 'critical' },
    { id: '6', name: 'Lapu-Lapu', tasks: 7575, taskCompleted: 18, replenishmentDays: 12, status: 'good' },
    { id: '7', name: 'Toledo', tasks: 7575, taskCompleted: 4, replenishmentDays: 12, status: 'critical' },
    { id: '8', name: 'Bantayan', tasks: 7575, taskCompleted: 16, replenishmentDays: 11, status: 'good' },
];

export const VIEW_SATELLITE_BRANCHES_BACOLOD: Staff[] = [
    { id: '1', name: 'Kabankalan', tasks: 9817, taskCompleted: 14, replenishmentDays: 7, status: 'stable' },
    { id: '2', name: 'San Carlos', tasks: 9724, taskCompleted: 6, replenishmentDays: 10, status: 'warning' },
];

export const VIEW_SATELLITE_BRANCHES_BATANGAS: Staff[] = [
    { id: '1', name: 'N/A', tasks: 0, taskCompleted: 0, replenishmentDays: 0, status: 'good' },
];

export const VIEW_SATELLITE_BRANCHES_BOHOL: Staff[] = [
    { id: '1', name: 'Jagna', tasks: 9817, taskCompleted: 14, replenishmentDays: 7, status: 'stable' },
    { id: '2', name: 'Talibon', tasks: 9724, taskCompleted: 6, replenishmentDays: 10, status: 'warning' },
];

export const VIEW_SATELLITE_BRANCHES_CAGAYAN: Staff[] = [
    { id: '1', name: 'Butuan', tasks: 9817, taskCompleted: 14, replenishmentDays: 7, status: 'stable' },
    { id: '2', name: 'Surigao', tasks: 9724, taskCompleted: 6, replenishmentDays: 10, status: 'warning' },
    { id: '3', name: 'Valencia', tasks: 7575, taskCompleted: 16, replenishmentDays: 11, status: 'good' },
];

export const VIEW_SATELLITE_BRANCHES_CALBAYOG: Staff[] = [
    { id: '1', name: 'Catbalogan Satellite', tasks: 9817, taskCompleted: 14, replenishmentDays: 7, status: 'stable' },
];

export const VIEW_SATELLITE_BRANCHES_CATARMAN: Staff[] = [
    { id: '1', name: 'Rawis', tasks: 9817, taskCompleted: 14, replenishmentDays: 7, status: 'stable' },
];

export const VIEW_SATELLITE_BRANCHES_DAVAO: Staff[] = [
    { id: '1', name: 'Mati', tasks: 9817, taskCompleted: 14, replenishmentDays: 7, status: 'stable' },
    { id: '2', name: 'Tagum', tasks: 9724, taskCompleted: 6, replenishmentDays: 10, status: 'warning' },
];

export const VIEW_SATELLITE_BRANCHES_DIPOLOG: Staff[] = [
    { id: '1', name: 'Pagadian', tasks: 9817, taskCompleted: 14, replenishmentDays: 7, status: 'stable' },
    { id: '2', name: 'Ozamis', tasks: 9724, taskCompleted: 6, replenishmentDays: 10, status: 'warning' },
    { id: '3', name: 'Ipil', tasks: 7575, taskCompleted: 16, replenishmentDays: 11, status: 'good' },
];

export const VIEW_SATELLITE_BRANCHES_DUMAGUETE: Staff[] = [
    { id: '1', name: 'Bais', tasks: 9817, taskCompleted: 14, replenishmentDays: 7, status: 'stable' },
    { id: '2', name: 'Bayawan', tasks: 9724, taskCompleted: 6, replenishmentDays: 10, status: 'warning' },
    { id: '3', name: 'Siquijor', tasks: 7575, taskCompleted: 16, replenishmentDays: 11, status: 'good' },
];

export const VIEW_SATELLITE_BRANCHES_ILOILO: Staff[] = [
    { id: '1', name: 'Aklan', tasks: 9817, taskCompleted: 14, replenishmentDays: 7, status: 'stable' },
    { id: '2', name: 'Antique', tasks: 9724, taskCompleted: 6, replenishmentDays: 10, status: 'warning' },
    { id: '3', name: 'Guimaras', tasks: 7575, taskCompleted: 16, replenishmentDays: 11, status: 'good' },
    { id: '4', name: 'Roxas', tasks: 7575, taskCompleted: 16, replenishmentDays: 11, status: 'good' },
];

export const VIEW_SATELLITE_BRANCHES_MAKATI: Staff[] = [
    { id: '1', name: 'Palawan', tasks: 9817, taskCompleted: 14, replenishmentDays: 7, status: 'stable' },
    { id: '2', name: 'Olongapo', tasks: 9724, taskCompleted: 6, replenishmentDays: 10, status: 'warning' },
];

export const VIEW_SATELLITE_BRANCHES_ORMOC: Staff[] = [
    { id: '1', name: 'Maasin', tasks: 9817, taskCompleted: 14, replenishmentDays: 7, status: 'stable' },
    { id: '2', name: 'Naval', tasks: 9724, taskCompleted: 6, replenishmentDays: 10, status: 'warning' },
    { id: '3', name: 'Sogod', tasks: 7575, taskCompleted: 16, replenishmentDays: 11, status: 'good' },
];

export const VIEW_SATELLITE_BRANCHES_TACLOBAN: Staff[] = [
    { id: '1', name: 'Borongan', tasks: 9817, taskCompleted: 14, replenishmentDays: 7, status: 'stable' },
];

interface BranchData {
    id: number;
    title: string;
    subtitle: string;
    value: string;
    percentage: number;
    percentageColor: string;
    subtitleValue: string;
    topStaffLabel: string;
    topStaffName: string;
    staffs: Staff[];
    type: 'tasks';
}

const BRANCHES_DATA: BranchData[] = [
    {
        id: 1,
        title: "Main Office",
        subtitle: "test",
        value: "480",
        percentage: 24,
        percentageColor: "bg-green-500",
        subtitleValue: "123",
        topStaffLabel: "Most Active Satellite",
        topStaffName: "Main Office",
        staffs: VIEW_SATELLITE_BRANCHES_MAIN.map(p => ({ ...p, status: 'good' as const })),
        type: "tasks"
    },
    {
        id: 2,
        title: "Bacolod Branch",
        subtitle: "test",
        value: "560",
        percentage: 28,
        percentageColor: "bg-orange-500",
        subtitleValue: "123",
        topStaffLabel: "Most Active Satellite",
        topStaffName: "Bacolod Branch",
        staffs: VIEW_SATELLITE_BRANCHES_BACOLOD.map(p => ({ ...p, status: 'good' as const })),
        type: "tasks"
    },
    {
        id: 3,
        title: "Batangas Branch",
        subtitle: "test",
        value: "160",
        percentage: 8,
        percentageColor: "bg-red-500",
        subtitleValue: "123",
        topStaffLabel: "Most Active Satellite",
        topStaffName: "Batangas Branch",
        staffs: VIEW_SATELLITE_BRANCHES_BATANGAS.map(p => ({ ...p, status: 'good' as const })),
        type: "tasks"
    },
    {
        id: 4,
        title: "Bohol Branch",
        subtitle: "test",
        value: "160",
        percentage: 8,
        percentageColor: "bg-red-500",
        subtitleValue: "123",
        topStaffLabel: "Most Active Satellite",
        topStaffName: "Bohol Branch",
        staffs: VIEW_SATELLITE_BRANCHES_BOHOL.map(p => ({ ...p, status: 'good' as const })),
        type: "tasks"
    },
    {
        id: 5,
        title: "Cagayan Branch",
        subtitle: "test",
        value: "160",
        percentage: 8,
        percentageColor: "bg-red-500",
        subtitleValue: "123",
        topStaffLabel: "Most Active Satellite",
        topStaffName: "Cagayan Branch",
        staffs: VIEW_SATELLITE_BRANCHES_CAGAYAN.map(p => ({ ...p, status: 'good' as const })),
        type: "tasks"
    },
    {
        id: 6,
        title: "Calbayog Branch",
        subtitle: "test",
        value: "160",
        percentage: 8,
        percentageColor: "bg-red-500",
        subtitleValue: "123",
        topStaffLabel: "Most Active Satellite",
        topStaffName: "Calbayog Branch",
        staffs: VIEW_SATELLITE_BRANCHES_CALBAYOG.map(p => ({ ...p, status: 'good' as const })),
        type: "tasks"
    },
    {
        id: 7,
        title: "Catarman Branch",
        subtitle: "test",
        value: "160",
        percentage: 8,
        percentageColor: "bg-red-500",
        subtitleValue: "123",
        topStaffLabel: "Most Active Satellite",
        topStaffName: "Catarman Branch",
        staffs: VIEW_SATELLITE_BRANCHES_CATARMAN.map(p => ({ ...p, status: 'good' as const })),
        type: "tasks"
    },
    {
        id: 8,
        title: "Davao Branch",
        subtitle: "test",
        value: "160",
        percentage: 8,
        percentageColor: "bg-red-500",
        subtitleValue: "123",
        topStaffLabel: "Most Active Satellite",
        topStaffName: "Davao Branch",
        staffs: VIEW_SATELLITE_BRANCHES_DAVAO.map(p => ({ ...p, status: 'good' as const })),
        type: "tasks"
    },
    {
        id: 9,
        title: "Dipolog Branch",
        subtitle: "test",
        value: "160",
        percentage: 8,
        percentageColor: "bg-red-500",
        subtitleValue: "123",
        topStaffLabel: "Most Active Satellite",
        topStaffName: "Dipolog Branch",
        staffs: VIEW_SATELLITE_BRANCHES_DIPOLOG.map(p => ({ ...p, status: 'good' as const })),
        type: "tasks"
    },
    {
        id: 10,
        title: "Dumaguete Branch",
        subtitle: "test",
        value: "160",
        percentage: 8,
        percentageColor: "bg-red-500",
        subtitleValue: "123",
        topStaffLabel: "Most Active Satellite",
        topStaffName: "Dumaguete Branch",
        staffs: VIEW_SATELLITE_BRANCHES_DUMAGUETE.map(p => ({ ...p, status: 'good' as const })),
        type: "tasks"
    },
    {
        id: 11,
        title: "Iloilo Branch",
        subtitle: "test",
        value: "160",
        percentage: 8,
        percentageColor: "bg-red-500",
        subtitleValue: "123",
        topStaffLabel: "Most Active Satellite",
        topStaffName: "Iloilo Branch",
        staffs: VIEW_SATELLITE_BRANCHES_ILOILO.map(p => ({ ...p, status: 'good' as const })),
        type: "tasks"
    },
    {
        id: 12,
        title: "Makati Branch",
        subtitle: "test",
        value: "160",
        percentage: 8,
        percentageColor: "bg-red-500",
        subtitleValue: "123",
        topStaffLabel: "Most Active Satellite",
        topStaffName: "Makati Branch",
        staffs: VIEW_SATELLITE_BRANCHES_MAKATI.map(p => ({ ...p, status: 'good' as const })),
        type: "tasks"
    },
    {
        id: 13,
        title: "Ormoc Branch",
        subtitle: "test",
        value: "160",
        percentage: 8,
        percentageColor: "bg-red-500",
        subtitleValue: "123",
        topStaffLabel: "Most Active Satellite",
        topStaffName: "Ormoc Branch",
        staffs: VIEW_SATELLITE_BRANCHES_ORMOC.map(p => ({ ...p, status: 'good' as const })),
        type: "tasks"
    },
    {
        id: 14,
        title: "Tacloban Branch",
        subtitle: "test",
        value: "160",
        percentage: 8,
        percentageColor: "bg-red-500",
        subtitleValue: "123",
        topStaffLabel: "Most Active Satellite",
        topStaffName: "Tacloban Branch",
        staffs: VIEW_SATELLITE_BRANCHES_TACLOBAN.map(p => ({ ...p, status: 'good' as const })),
        type: "tasks"
    },
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
                                <h2 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">Personnel by Branches</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {BRANCHES_DATA.map((branch) => (
                                        <MetricCardPersonnel
                                            key={branch.id}
                                            title={branch.title}
                                            subtitle={branch.subtitle}
                                            value={branch.value}
                                            percentage={branch.percentage}
                                            percentageColor={branch.percentageColor}
                                            subtitleValue={branch.subtitleValue}
                                            topStaffLabel={branch.topStaffLabel}
                                            topStaffName={branch.topStaffName}
                                            staffs={branch.staffs}
                                            type={branch.type}
                                        />
                                    ))}
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