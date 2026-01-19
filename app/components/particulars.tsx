import axios from "axios";
import { useEffect, useState } from "react";
import { BudgetService } from "~/services/budget.service";
import Liquidation from "./liquidation";

export default function Particulars({ item }: { item: any }) {

    const [particulars, setParticulars] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingAmountSpent, setLoadingAmountSpent] = useState(true);
    const [error, setError] = useState(null);
    const [requisitions, setRequisitions] = useState<any[]>([]);

    useEffect(() => {
        console.log("Particulars item:", item);
        const fetchParticulars = async () => {
            try {
                setLoading(true);
                setError(null);

                // Check if budget_code exists and is an array
                const budgetCodes = item.departments?.budget_code;

                if (budgetCodes && budgetCodes.length > 0) {
                    // Convert string IDs to numbers
                    const idArray = budgetCodes.map((code: any) => parseInt(code, 10));

                    // AWAIT THE PROMISE
                    const dataFetch = await BudgetService.getAllParticularsByDepartment(idArray);
                    console.log("Fetched:", dataFetch);

                    // Store in state
                    setParticulars(dataFetch);
                    // fetchRequisitions(item.departments.department, dataFetch);
                } else {
                    setParticulars([]);
                }
            } catch (err: any) {
                console.error("Error fetching particulars:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };



        const fetchRequisitions = async () => {
            const userId = Number(localStorage.getItem("ab_id"));
            const username = localStorage.getItem("username") || "";

            try {
                if (item.id) {
                    const requisitionResponse = await Promise.all([
                        axios.post<{ data: any[] }>(
                            `${import.meta.env.VITE_API_BASE_URL}/completed-requisition-liquidation`,
                            { userid: userId, username }
                        )
                    ]);

                    console.log("All Requisition Data:", requisitionResponse[0].data.data);
                    setRequisitions(requisitionResponse[0].data.data);
                    return requisitionResponse;
                }
            } catch (err) {
                console.error("Error fetching requisitions:", err);
                return []; // Return empty array on error
            }
        };

        fetchParticulars();
        fetchRequisitions();
    }, [item]);

    // Display loading state
    if (loading) {
        return <div>Loading particulars...</div>;
    }

    // Display error state
    if (error) {
        return <div>Error: {error}</div>;
    }

    const fetchAllocatedAmountPerParticular = (particular: any, department: string) => {

        try {
            // Get current year
            const currentYear = new Date().getFullYear();

            // Filter based on parameters
            const filteredData = requisitions.filter(item => {
                let matchesParticular = true;
                let matchesDepartment = true;
                let matchesWorkflowType = true;
                let matchesStatus = true;
                let matchesYear = true;
                // Filter by particular (adjust based on your particular structure)
                if (particular) {
                    // Example: if particular is a string name
                    if (typeof particular === 'string') {
                        matchesParticular = item.particular === particular;
                    }
                    // Example: if particular is an object with specific properties
                    else if (particular.particulars) {
                        matchesParticular = item.particular === particular;
                    }
                }

                // Filter by department
                if (department) {
                    // Check if item.department is "N/A"
                    if (item.department === "N/A" || item.department === "n/a" || item.department === "NA") {
                        // Switch to branch comparison
                        matchesDepartment = item.branch === department ||
                            item.branchName === department ||
                            item.branchCode === department ||
                            item.officeLocation === department;
                    } else {
                        // Use original department comparison
                        matchesDepartment = item.department === department ||
                            item.departmentName === department ||
                            item.deptCode === department;
                    }
                }

                // Filter by workflow type - only include "Requisition"
                matchesWorkflowType = item.workflowType === "Requisition";

                // Filter by status - only include "Completed" status
                matchesStatus = item.status === "Completed";

                // Filter by current year using startDate and dueDate
                if (item.startDate && item.dueDate) {
                    // Use startDate to determine the year
                    const itemDate = new Date(item.startDate);
                    matchesYear = itemDate.getFullYear() === 2024;
                }

                return matchesParticular && matchesDepartment && matchesWorkflowType && matchesStatus && matchesYear;
            });

            // Calculate total amount from filtered data
            const totalAmount = filteredData.reduce((sum, item) => {
                return sum + (Number(item.totalAmount) || 0);
            }, 0);
            return new Intl.NumberFormat('en-PH', {
                style: 'currency',
                currency: 'PHP'
            }).format(totalAmount);

        } catch (error) {
            console.error("Error fetching spent amount:", error);
            return 0;
        }
    };

    const fetchLiquidationByDepartment = (department: string) => {

        try {
            // Get current year
            const currentYear = new Date().getFullYear();

            // Filter based on parameters
            const filteredData = requisitions.filter(item => {
                let matchesDepartment = true;
                let matchesWorkflowType = true;
                let matchesStatus = true;
                let matchesYear = true;

                // Filter by department
                if (department) {
                    // Check if item.department is "N/A"
                    if (item.department === "N/A" || item.department === "n/a" || item.department === "NA" || item.department === null) {
                        // Switch to branch comparison
                        matchesDepartment = item.branch === department ||
                            item.branchName === department ||
                            item.branchCode === department ||
                            item.officeLocation === department;
                    } else {
                        // Use original department comparison
                        matchesDepartment = item.department === department ||
                            item.departmentName === department ||
                            item.deptCode === department;
                    }
                }

                // Filter by workflow type - only include "Liquidation"
                matchesWorkflowType = item.workflowType === "Liquidation";

                // Filter by status - only include "Completed" status
                matchesStatus = item.status === "Completed";

                // Filter by current year using startDate and dueDate
                if (item.startDate && item.dueDate) {
                    // Use startDate to determine the year
                    const itemDate = new Date(item.startDate);
                    matchesYear = itemDate.getFullYear() === 2024;
                }

                return matchesDepartment && matchesWorkflowType && matchesStatus && matchesYear;
            });

            // Calculate total amount from filtered data
            const totalAmount = filteredData.reduce((sum, item) => {
                return sum + (Number(item.totalAmount) || 0);
            }, 0);
            return new Intl.NumberFormat('en-PH', {
                style: 'currency',
                currency: 'PHP'
            }).format(totalAmount);

        } catch (error) {
            console.error("Error fetching spent amount:", error);
            return 0;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header with Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Total Budget Card */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="text-sm text-blue-600 font-medium">Total Budget</div>
                    <div className="text-2xl font-bold text-blue-800 mt-1">
                        {new Intl.NumberFormat('en-PH', {
                            style: 'currency',
                            currency: 'PHP',
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        }).format(item.budget)}
                    </div>
                </div>

                {/* Total Spent Card */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="text-sm text-red-600 font-medium">Total Spent</div>
                    <div className="text-2xl font-bold text-red-800 mt-1">
                        {new Intl.NumberFormat('en-PH', {
                            style: 'currency',
                            currency: 'PHP',
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        }).format(item.totalSpent || 0)}
                    </div>
                </div>

                {/* Remaining Balance Card */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="text-sm text-green-600 font-medium">Remaining Balance</div>
                    <div className="text-2xl font-bold text-green-800 mt-1">
                        {new Intl.NumberFormat('en-PH', {
                            style: 'currency',
                            currency: 'PHP',
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        }).format(item.budget - (item.totalSpent || 0))}
                    </div>
                    <div className="mt-2">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                            <span>Utilization</span>
                            <span>{item.totalSpent ? Math.round((item.totalSpent / item.budget) * 100) : 0}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-green-500 h-2 rounded-full"
                                style={{
                                    width: `${item.totalSpent ? Math.min((item.totalSpent / item.budget) * 100, 100) : 0}%`
                                }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Budget Particulars Requisition Table */}
            <div>
                <h4 className="text-lg font-semibold mb-3">Requisition</h4>
                <div className="overflow-x-auto border border-gray-200 rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Particular</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Spent Amount</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {particulars?.map((particular: any, index: number) => {
                                const spent = particular.spentAmount || 0;
                                const remaining = particular.allocatedAmount - spent;
                                const status = remaining <= 0 ? 'Exhausted' : remaining < particular.allocatedAmount * 0.2 ? 'Low' : 'Available';

                                return (
                                    <tr key={particular.id || index} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{particular.particulars}</div>
                                            <div className="text-xs text-gray-500">{particular.description || 'No description'}</div>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-red-800">
                                            {fetchAllocatedAmountPerParticular(particular.particulars, item.departments.department)}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status === 'Available' ? 'bg-green-100 text-green-800' :
                                                status === 'Low' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                {status}
                                            </span>
                                        </td>

                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* LIQUIDATION */}
            <div>
                <h4 className="text-lg font-semibold mb-3">Liquidation</h4>
                <Liquidation item={item} liquidationTotal={fetchLiquidationByDepartment(item.departments.department)} />
            </div>
        </div>
    )
}