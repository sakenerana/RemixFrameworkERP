import { Avatar } from "antd";
import { ArrowLeftFromLine, Award, Home, TrendingUp } from "lucide-react";

export default function NewMembershipStaff() {
    const branchName = "Main Branch";
    const type = "tasks";

    const staffs = [
        {
            id: 1,
            name: "John Doe",
            department: "Sales",
            tasks: 85,
            taskCompleted: 92,
            replenishmentDays: 3,
            avgDailySales: 150,
            status: "stable",
            efficiency: 95,
        },
        {
            id: 2,
            name: "Jane Smith",
            department: "Inventory",
            tasks: 70,
            taskCompleted: 88,
            replenishmentDays: 5,
            avgDailySales: 120,
            status: "warning",
            efficiency: 82,
        },
    ];

    // ✅ Avoid mutating original array
    const sortedStaff = [...staffs].sort(
        (a, b) => b.taskCompleted - a.taskCompleted
    );

    const topStaffName = sortedStaff[0]?.name || "N/A";

    const openStaffDetails = (staff: any) => {
        alert(staff.name);
    };

    return (
        <div className="min-h-screen bg-gray-100">

            {/* 🔷 Top Navigation */}
            <header className="bg-[#1890ff] flex items-center justify-between h-14 shadow-md px-4">
                <div className="flex items-center">
                    <a href="/landing-page">
                        <button className="h-14 px-5 flex items-center hover:bg-blue-600 transition border-r border-blue-400 bg-blue-700">
                            <Home className="text-white w-5 h-5" />
                        </button>
                    </a>
                    <a href="/newmembership">
                        <button className="h-14 px-5 flex items-center hover:bg-blue-600 transition">
                            <ArrowLeftFromLine className="text-white w-5 h-5" />
                        </button>
                    </a>
                </div>

                <div className="flex items-center gap-3 text-white">
                    <div className="hidden md:flex flex-col text-right leading-tight">
                        <span className="text-xs font-bold">
                            CFI Management System
                        </span>
                        <span className="text-[10px] opacity-80">
                            Online
                        </span>
                    </div>
                    <Avatar src="/img/cfi-circle.png" />
                </div>
            </header>

            {/* 🔷 Page Header */}
            <div className="bg-slate-800 text-white py-6 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h2 className="text-2xl font-semibold tracking-wide">
                        All Satellites Performance
                    </h2>
                    <p className="text-sm text-gray-300 mt-1">
                        {branchName} — Task Completion Metrics
                    </p>
                </div>
            </div>

            {/* 🔷 Reward Banner */}
            <div className="max-w-7xl mx-auto px-6 mt-6">
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4 text-center shadow-sm">
                    <div className="flex justify-center items-center mb-1">
                        <Award className="w-6 h-6 text-yellow-600 mr-2" />
                        <span className="font-semibold text-yellow-800">
                            Top 5 Satellites Receive Monthly Rewards
                        </span>
                    </div>
                    <p className="text-xs text-yellow-700">
                        Performance Bonus • Gift Cards • Extra PTO • Employee Recognition
                    </p>
                </div>
            </div>

            {/* 🔷 Content */}
            <div className="max-w-7xl mx-auto px-6 mt-6 pb-10">

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">

                    <SummaryCard
                        title="Total Satellites"
                        value={staffs.length}
                    />

                    <SummaryCard
                        title="Average Completion"
                        value={
                            staffs.length > 0
                                ? Math.round(
                                    staffs.reduce(
                                        (acc, s) => acc + (s.taskCompleted || 0),
                                        0
                                    ) / staffs.length
                                ) + "%"
                                : "0%"
                        }
                    />

                    <SummaryCard
                        title="Best Performer"
                        value={topStaffName}
                    />

                    <SummaryCard
                        title="Department Avg."
                        value={
                            staffs.length > 0
                                ? Math.round(
                                    staffs.reduce(
                                        (acc, s) => acc + (s.tasks || 0),
                                        0
                                    ) / staffs.length
                                )
                                : 0
                        }
                    />
                </div>

                {/* 🔷 Table */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b">
                            <tr className="text-gray-600">
                                <th className="p-4 text-left">Rank</th>
                                <th className="p-4 text-left">Staff</th>
                                <th className="p-4 text-left">Department</th>
                                <th className="p-4 text-left">
                                    {type === "tasks"
                                        ? "Total Tasks"
                                        : "Avg Daily Sales"}
                                </th>
                                <th className="p-4 text-left">
                                    {type === "tasks"
                                        ? "Completed"
                                        : "Replenishment"}
                                </th>
                                <th className="p-4 text-left">Efficiency</th>
                            </tr>
                        </thead>

                        <tbody>
                            {sortedStaff.map((staff, index) => {
                                const rank = index + 1;

                                return (
                                    <tr
                                        key={staff.id}
                                        onClick={() => openStaffDetails(staff)}
                                        className="border-b hover:bg-blue-50 transition cursor-pointer"
                                    >
                                        <td className="p-4 font-semibold text-gray-700">
                                            {rank}
                                        </td>

                                        <td className="p-4 font-medium text-gray-800">
                                            {staff.name}
                                        </td>

                                        <td className="p-4 text-gray-600">
                                            {staff.department}
                                        </td>

                                        <td className="p-4">
                                            {type === "tasks"
                                                ? staff.tasks
                                                : staff.avgDailySales}
                                        </td>

                                        <td className="p-4">
                                            {type === "tasks"
                                                ? `${staff.taskCompleted}%`
                                                : `${staff.replenishmentDays} days`}
                                        </td>

                                        <td className="p-4 flex items-center gap-2">
                                            <TrendingUp className="w-4 h-4 text-blue-500" />
                                            {staff.efficiency}%
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div className="mt-6 flex justify-between items-center text-sm text-gray-500">
                    <span>
                        Last updated: {new Date().toLocaleDateString()}
                    </span>

                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                        Export Report
                    </button>
                </div>
            </div>
        </div>
    );
}

/* 🔷 Reusable Summary Card */
function SummaryCard({ title, value }: any) {
    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <p className="text-xs text-gray-500">{title}</p>
            <p className="text-xl font-semibold text-gray-800 mt-1">
                {value}
            </p>
        </div>
    );
}
