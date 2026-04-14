import { Avatar } from "antd";
import { ArrowLeftFromLine, Home } from "lucide-react";
import { useMemo } from "react";
import { useSearchParams } from "@remix-run/react";

const formatPesoValue = (value: number) => {
    const safeValue = Number.isFinite(value) ? value : 0;
    const sign = safeValue < 0 ? "-" : "";
    return `${sign}\u20B1${Math.abs(safeValue).toLocaleString()}`;
};

export default function CollectionLgu() {
    const [searchParams] = useSearchParams();

    const branchName = searchParams.get("branch") || "Main Office";
    const departmentName = searchParams.get("department") || "Unknown Department";
    const selectedYear = searchParams.get("year") || "";
    const selectedMonth = searchParams.get("month") || "";
    const paid = Number(searchParams.get("paid") || 0);
    const billed = Number(searchParams.get("billed") || 0);

    const geos = useMemo(() => {
        try {
            const parsed = JSON.parse(searchParams.get("geos") || "[]");
            return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
        } catch {
            return [];
        }
    }, [searchParams]);

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-[#1890ff] flex items-center justify-between h-14 shadow-md px-4">
                <div className="flex items-center">
                    <a href="/landing-page">
                        <button className="h-14 px-5 flex items-center hover:bg-blue-600 transition border-r border-blue-400 bg-blue-700">
                            <Home className="text-white w-5 h-5" />
                        </button>
                    </a>
                    <a href="/collections">
                        <button className="h-14 px-5 flex items-center hover:bg-blue-600 transition">
                            <ArrowLeftFromLine className="text-white w-5 h-5" />
                        </button>
                    </a>
                </div>

                <div className="flex items-center gap-3 text-white">
                    <div className="hidden md:flex flex-col text-right leading-tight">
                        <span className="text-xs font-bold">CFI Management System</span>
                        <span className="text-[10px] opacity-80">Online</span>
                    </div>
                    <Avatar src="/img/cfi-circle.png" />
                </div>
            </header>

            <div className="bg-slate-800 text-white py-6 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h2 className="text-2xl font-semibold tracking-wide">Collection LGU Details</h2>
                    <p className="text-sm text-gray-300 mt-1">
                        {departmentName} • {branchName}
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 mt-6 pb-10 space-y-6">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                    <SummaryCard title="Department" value={departmentName} />
                    <SummaryCard title="Total Paid" value={formatPesoValue(paid)} />
                    <SummaryCard title="Total Billed" value={formatPesoValue(billed)} />
                    <SummaryCard
                        title="Selected Period"
                        value={selectedYear && selectedMonth ? `${selectedYear} • ${selectedMonth}` : "N/A"}
                    />
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="border-b border-gray-200 px-6 py-4">
                        <h3 className="text-lg font-semibold text-gray-800">LGU List</h3>
                        <p className="text-sm text-gray-500 mt-1">
                            Showing all GEO entries that belong to {departmentName}.
                        </p>
                    </div>

                    {geos.length === 0 ? (
                        <div className="px-6 py-10 text-center text-sm text-gray-500">
                            No LGU data available for this department.
                        </div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b">
                                <tr className="text-gray-600">
                                    <th className="p-4 text-left">#</th>
                                    <th className="p-4 text-left">LGU Name</th>
                                </tr>
                            </thead>
                            <tbody>
                                {geos.map((geo, index) => (
                                    <tr key={`${geo}-${index}`} className="border-b last:border-b-0">
                                        <td className="p-4 font-semibold text-gray-700">{index + 1}</td>
                                        <td className="p-4 text-gray-800">{geo}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}

function SummaryCard({ title, value }: { title: string; value: string }) {
    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <p className="text-xs text-gray-500">{title}</p>
            <p className="text-xl font-semibold text-gray-800 mt-1 break-words">{value}</p>
        </div>
    );
}
