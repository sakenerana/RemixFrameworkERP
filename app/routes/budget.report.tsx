import { FileSearchOutlined, HomeOutlined, LinkOutlined, LoadingOutlined, EyeOutlined, DollarOutlined, PieChartOutlined, BarChartOutlined } from "@ant-design/icons";
import {
    Alert,
    Breadcrumb,
    Button,
    Checkbox,
    MenuProps,
    Modal,
    Table,
    TableColumnsType,
    Tag,
    Timeline,
    Tooltip,
    DatePicker,
    Card,
    Row,
    Col,
    message,
} from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { AppPageHeader } from "~/components/ui/AppPageHeader";
import PrintDropdownComponent from "~/components/print_dropdown";
import { DataTableToolbar } from "~/components/ui/DataTableToolbar";
import { SummaryMetricCard } from "~/components/ui/SummaryMetricCard";
import dayjs from 'dayjs';
import { BudgetService } from "~/services/budget.service";
import { Budget } from "~/types/budget.type";

const { RangePicker } = DatePicker;

interface BudgetHistoryDataType {
    id?: number;
    referenceNo: string;
    processTitle: string;
    department: string;
    workflowType: string;
    status: string;
    totalAmount: number;
    startDate: string;
    dueDate: string;
    notes: string;
}

interface BudgetHistoryApiRow {
    id?: number;
    referenceNo?: string | null;
    processTitle?: string | null;
    department?: string | null;
    workflowType?: string | null;
    status?: string | null;
    totalAmount?: number | string | null;
    startDate?: string | null;
    dueDate?: string | null;
    notes?: string | null;
}

const getBudgetHistoryItems = (payload: unknown): BudgetHistoryApiRow[] => {
    if (Array.isArray(payload)) return payload as BudgetHistoryApiRow[];

    if (
        typeof payload === "object" &&
        payload !== null &&
        Array.isArray((payload as { data?: unknown }).data)
    ) {
        return (payload as { data: BudgetHistoryApiRow[] }).data;
    }

    return [];
};

const toBudgetHistoryRow = (item: BudgetHistoryApiRow): BudgetHistoryDataType => ({
    id: item.id,
    referenceNo: item.referenceNo || "",
    processTitle: item.processTitle || "Untitled request",
    department: item.department || "N/A",
    workflowType: item.workflowType || "N/A",
    status: item.status || "N/A",
    totalAmount: Number(item.totalAmount || 0),
    startDate: item.startDate || "",
    dueDate: item.dueDate || "",
    notes: item.notes || "No notes provided",
});

export default function BudgetHistoryReports() {
    const [loading, setLoading] = useState(false);
    const [loadingpendingApproved, setLoadingPendingApproved] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filteredData, setFilteredData] = useState<BudgetHistoryDataType[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<BudgetHistoryDataType | null>(null);

    const [dataBudget, setDataBudget] = useState<Budget>();
    const [dataPendingApprovals, setDataPendingApprovals] = useState(0);
    const [dataApprovedBudget, setDataApprovedBudget] = useState(0);

    const [isDepartmentID, setDepartmentID] = useState<number | null>(null);
    const [isOfficeID, setOfficeID] = useState<number | null>(null);

    // const handleRefetch = async () => {
    //     setLoading(true);
    //     await fetchBudgetHistoryData();
    //     setLoading(false);
    // };

    const fetchDataBudgetAllocated = async () => {
        try {
            // setLoading(true);
            const dataFetch = await BudgetService.getByData();
            const activeBudget = Array.isArray(dataFetch) ? dataFetch[0] : dataFetch;
            setDataBudget(activeBudget);

            if (activeBudget?.start_date && activeBudget?.end_date) {
                fetchPendingApprovalsCount(activeBudget.start_date, activeBudget.end_date);
            } else {
                setDataPendingApprovals(0);
                setDataApprovedBudget(0);
                setLoadingPendingApproved(false);
            }
        } catch (error) {
            message.error("errorss");
        } finally {
            // setLoading(false);
        }
    };

    const fetchPendingApprovalsCount = async (
        startDate: string,
        endDate: string
    ) => {
        const userId = Number(localStorage.getItem("ab_id"));
        const username = localStorage.getItem("username") || "";
        const dept = localStorage.getItem("dept") || "";
        setLoadingPendingApproved(true);

        try {
            const response = await axios.post<{ data: BudgetHistoryApiRow[] }>(
                `${import.meta.env.VITE_API_BASE_URL}/completed-requisition-liquidation`,
                { userid: userId, username }
            );


            const items = getBudgetHistoryItems(response.data);

            // Filter by:
            // 1️⃣ status === "In Progress"
            // 2️⃣ date >= startDate AND date <= endDate
            const filteredPending = items.filter((item) => {
                if (!item.startDate) return false;
                const itemDate = new Date(item.startDate);
                return (
                    item.status === "In Progress" &&
                    item.department === dept &&
                    itemDate >= new Date(startDate) &&
                    itemDate <= new Date(endDate)
                );
            });

            const filteredApproved = items.filter((item) => {
                if (!item.startDate) return false;
                const itemDate = new Date(item.startDate);
                return (
                    item.status === "Completed" &&
                    item.department === dept &&
                    itemDate >= new Date(startDate) &&
                    itemDate <= new Date(endDate)
                );
            });

            const countPending = filteredPending.length;
            const countApproved = filteredApproved.length;
            setDataPendingApprovals(countPending);
            setDataApprovedBudget(countApproved);
            setLoadingPendingApproved(false);

        } catch (error) {
            console.error("API ERROR:", error);
            message.error("Failed to fetch pending approvals count");
        }
    };

    const fetchBudgetHistoryData = async (
        startDate: string,
        endDate: string
    ) => {
        const userId = Number(localStorage.getItem("ab_id"));
        const username = localStorage.getItem("username") || "";
        const dept = localStorage.getItem("dept") || "";
        setLoading(true);
        try {
            const response = await axios.post<{ data: BudgetHistoryApiRow[] }>(
                `${import.meta.env.VITE_API_BASE_URL}/completed-requisition-liquidation`,
                { userid: userId, username }
            );


            const items = getBudgetHistoryItems(response.data);

            // Filter by:
            // 1️⃣ status === "In Progress"
            // 2️⃣ date >= startDate AND date <= endDate
            const filteredDateRange = items.filter((item) => {
                if (!item.startDate) return false;
                const itemDate = new Date(item.startDate);
                return (
                    item.status === "Completed" &&
                    item.department === dept &&
                    itemDate >= new Date(startDate) &&
                    itemDate <= new Date(endDate)
                );
            }).map(toBudgetHistoryRow);

            setFilteredData(filteredDateRange);
            setLoading(false);

        } catch (error) {
            console.error("API ERROR:", error);
            message.error("Failed to fetch pending approvals count");
        }
    };

    useEffect(() => {
        setDepartmentID(Number(localStorage.getItem('userDept')) || null);
        setOfficeID(Number(localStorage.getItem('userOfficeID')) || null);
    }, []);

    useEffect(() => {
        if (!isDepartmentID || !isOfficeID) return;

        fetchDataBudgetAllocated();
    }, [isDepartmentID, isOfficeID]);

    const handleViewDetails = (record: BudgetHistoryDataType) => {
        setSelectedRecord(record);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedRecord(null);
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(Number(amount) || 0);
    };

    // State for column visibility
    const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({
        "Reference No": true,
        "Process Title": true,
        "Department": true,
        "Workflow Type": true,
        "Total Amount": true,
        "Status": true,
        "Created Date": true,
        "Actions": true,
    });

    const columns: TableColumnsType<BudgetHistoryDataType> = [
        {
            title: "Reference No",
            dataIndex: "referenceNo",
            key: "referenceNo",
            // width: 140,
            fixed: 'left',
            render: (refno) => (
                <a
                    target="_blank"
                    href={`${import.meta.env.VITE_AB_LINK}/budget/${refno}`}
                    className="font-mono text-sm flex items-center hover:text-blue-500 hover:underline"
                >
                    <LinkOutlined className="mr-1" />
                    {refno}
                </a>
            ),
            sorter: (a, b) => a.referenceNo.localeCompare(b.referenceNo),
        },
        {
            title: "Process Title",
            dataIndex: "processTitle",
            key: "processTitle",
            width: 180,
            render: (text) => (
                <Tooltip title={text} placement="topLeft">
                    <div className="line-clamp-2 font-medium">
                        {text}
                    </div>
                </Tooltip>
            ),
            sorter: (a, b) => a.processTitle.localeCompare(b.processTitle),
        },
        {
            title: "Department",
            dataIndex: "department",
            key: "department",
            // width: 120,
            render: (dept) => <Tag color="cyan" variant="solid">{dept}</Tag>,
            sorter: (a, b) => a.department.localeCompare(b.department),
        },
        {
            title: "Workflow Type",
            dataIndex: "workflowType",
            key: "workflowType",
            // width: 120,
            render: (data) => (
                <Tag color="blue" variant="solid" className="capitalize">
                    {data.replace('_', ' ')}
                </Tag>
            ),
            sorter: (a, b) => a.workflowType.localeCompare(b.workflowType),
        },
        {
            title: "Total Amount",
            dataIndex: "totalAmount",
            key: "totalAmount",
            // width: 140,
            render: (amount) => (
                <span className="font-semibold text-gray-900">
                    {formatCurrency(amount)}
                </span>
            ),
            sorter: (a, b) => a.totalAmount - b.totalAmount,
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            // width: 120,
            render: (status) => (
                <Tag color="green" variant="solid" className="capitalize">
                    {status.replace('_', ' ')}
                </Tag>
            ),
            sorter: (a, b) => a.status.localeCompare(b.status),
        },
        {
            title: "Created Date",
            dataIndex: "startDate",
            key: "startDate",
            // width: 150,
            render: (date) => dayjs(date).format('MMM DD, YYYY'),
            sorter: (a, b) => dayjs(a.startDate).unix() - dayjs(b.startDate).unix(),
        },
        {
            title: "Actions",
            key: "actions",
            // width: 100,
            fixed: "right",
            render: (_, record) => (
                <Tooltip title="View budget details">
                    <Button
                        type="link"
                        icon={<EyeOutlined />}
                        onClick={() => handleViewDetails(record)}
                        className="text-blue-500 hover:text-blue-700"
                    >Check Details </Button>
                </Tooltip>
            ),
        },
    ];

    // Toggle column visibility
    const toggleColumn = (columnTitle: string) => {
        setColumnVisibility(prev => ({
            ...prev,
            [columnTitle]: !prev[columnTitle]
        }));
    };

    // Create dropdown menu items
    const columnMenuItems: MenuProps['items'] = Object.keys(columnVisibility).map(columnTitle => ({
        key: columnTitle,
        label: (
            <Checkbox
                checked={columnVisibility[columnTitle]}
                onChange={() => toggleColumn(columnTitle)}
            >
                {columnTitle}
            </Checkbox>
        ),
    }));

    // Filter columns based on visibility
    const filteredColumns = columns.filter(column =>
        column.title ? columnVisibility[column.title.toString()] : true
    );

    const totalAllocated = Number(dataBudget?.budget) || 0;
    const pendingApprovals = Number(dataPendingApprovals) || 0;
    const approvedBudgets = Number(dataApprovedBudget) || 0;
    const historyTotalAmount = filteredData.reduce(
        (sum, item) => sum + (Number(item.totalAmount) || 0),
        0
    );

    return (
        <div className="budget-report-page space-y-5">
            <AppPageHeader
                breadcrumb={
                    <Breadcrumb
                        items={[
                            {
                                href: "/budget",
                                title: <HomeOutlined className="text-gray-400" />,
                            },
                            {
                                title: <span className="text-blue-600 font-medium">Budget History & Reports</span>,
                            },
                        ]}
                        className="text-xs"
                    />
                }
                title="Budget Tracking History"
                subtitle="Track approved budget activity and review financial records by date range."
                actions={
                    <DataTableToolbar
                        framed={false}
                        compactActions
                        leadingControls={
                            <RangePicker
                                onChange={(value, dateString) => {
                                    if (!dateString[0] || !dateString[1]) return;
                                    fetchBudgetHistoryData(dateString[0], dateString[1]);
                                }}
                                className="w-full md:w-[300px]"
                                placeholder={['Start Date', 'End Date']}
                                size="middle"
                            />
                        }
                        columnMenuItems={columnMenuItems}
                        columnsMenuClassName="shadow-lg rounded-md min-w-[200px] py-2"
                        exportNode={
                            <PrintDropdownComponent
                                stateData={filteredData}
                                buttonProps={{
                                    className: "w-full md:w-[112px]",
                                }}
                            />
                        }
                    />
                }
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                <SummaryMetricCard
                    title="Total Allocated"
                    value={formatCurrency(totalAllocated)}
                    icon={<DollarOutlined className="text-blue-600" />}
                    description="Current budget allocation"
                />
                <SummaryMetricCard
                    title="Pending Approvals"
                    value={pendingApprovals.toLocaleString()}
                    icon={<PieChartOutlined className="text-amber-600" />}
                    description="Items still in progress"
                    loading={loadingpendingApproved}
                />
                <SummaryMetricCard
                    title="Approved Budgets"
                    value={approvedBudgets.toLocaleString()}
                    icon={<BarChartOutlined className="text-emerald-600" />}
                    description="Completed approvals"
                    loading={loadingpendingApproved}
                />
                <SummaryMetricCard
                    title="History Amount"
                    value={formatCurrency(historyTotalAmount)}
                    icon={<FileSearchOutlined className="text-violet-600" />}
                    description="Loaded report total"
                />
            </div>

            {error && (
                <Alert
                    message="Unable to load the budget report."
                    description={error}
                    type="error"
                    showIcon
                />
            )}

            <Card
                className="border border-slate-200 shadow-sm"
                bodyStyle={{ padding: 0 }}
            >
                <div className="flex flex-col gap-2 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="m-0 text-lg font-semibold text-slate-900">Report Records</h2>
                        <p className="m-0 mt-1 text-sm text-slate-500">
                            Showing {filteredData.length.toLocaleString()} budget record{filteredData.length === 1 ? "" : "s"}
                        </p>
                    </div>
                    {loading && (
                        <span className="inline-flex items-center gap-2 text-sm text-blue-600">
                            <LoadingOutlined spin />
                            Loading history
                        </span>
                    )}
                </div>

                <Table<BudgetHistoryDataType>
                    size="middle"
                    columns={filteredColumns}
                    dataSource={filteredData}
                    className="overflow-hidden"
                    loading={{
                        spinning: loading,
                        indicator: <LoadingOutlined style={{ fontSize: 28 }} spin />,
                    }}
                    scroll={{ x: 'max-content', y: 600 }}
                    rowKey={(record) => record.id || record.referenceNo}
                    pagination={{
                        showSizeChanger: true,
                        showQuickJumper: true,
                        pageSizeOptions: ['10', '20', '50', '100'],
                        defaultPageSize: 20,
                        className: "px-4 py-2 rounded-b-lg",
                        showTotal: (total, range) => (
                            <span className="text-sm">
                                Showing {range[0]}-{range[1]} of {total} budget records
                            </span>
                        ),
                    }}
                    locale={{
                        emptyText: (
                            <div className="py-10 flex flex-col items-center">
                                <FileSearchOutlined className="text-3xl text-gray-400 mb-3" />
                                <p className="text-gray-500 mb-2 text-base">No budget history found</p>
                                <p className="text-gray-400 text-sm">Select a date range to load report records</p>
                            </div>
                        )
                    }}
                />
            </Card>

            {/* Budget Details Modal */}
            <Modal
                width={900}
                title={
                    <div className="space-y-2">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Budget Details & Utilization
                        </h2>
                        {selectedRecord && (
                            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                                <div className="flex items-center gap-1">
                                    <span className="font-medium text-gray-700">Ref:</span>
                                    <span>{selectedRecord.processTitle}</span>
                                </div>
                                <span className="text-gray-400">•</span>
                                <span className="text-gray-400">•</span>
                                <div className="flex items-center gap-1">
                                    <span className="font-medium text-gray-700">Status:</span>
                                    <Tag color="green" className="capitalize">
                                        {selectedRecord.status.replace('_', ' ')}
                                    </Tag>
                                </div>
                            </div>
                        )}
                    </div>
                }
                open={isModalOpen}
                onCancel={handleCloseModal}
                footer={[
                    <Button key="close" onClick={handleCloseModal}>
                        Close
                    </Button>,
                ]}
                centered
            >
                {selectedRecord && (
                    <div className="space-y-6">
                        {/* Budget Overview */}
                        <Row gutter={16}>
                            <Col span={12}>
                                <Card size="small" title="Budget Information">
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Budget Name:</span>
                                            <span className="font-medium">{selectedRecord.processTitle}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Department:</span>
                                            <Tag color="cyan">{selectedRecord.department}</Tag>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Workflow:</span>
                                            <Tag color="blue">{selectedRecord.workflowType}</Tag>
                                        </div>
                                    </div>
                                </Card>
                            </Col>
                            <Col span={12}>
                                <Card size="small" title="Financial Summary">
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Total Allocated:</span>
                                            <span className="font-semibold text-lg text-gray-900">
                                                {formatCurrency(selectedRecord.totalAmount)}
                                            </span>
                                        </div>
                                        {/* <div className="flex justify-between">
                                            <span className="text-gray-600">Utilized Amount:</span>
                                            <span className="font-medium text-orange-600">
                                                {formatCurrency(selectedRecord.utilized_amount)}
                                            </span>
                                        </div> */}
                                        {/* <div className="flex justify-between">
                                            <span className="text-gray-600">Remaining Balance:</span>
                                            <span className={`font-semibold ${selectedRecord.remaining_amount < selectedRecord.total_amount * 0.1
                                                ? 'text-red-600'
                                                : 'text-green-600'
                                                }`}>
                                                {formatCurrency(selectedRecord.remaining_amount)}
                                            </span>
                                        </div> */}
                                    </div>
                                </Card>
                            </Col>
                        </Row>

                        {/* Timeline and Dates */}
                        <Row gutter={16}>
                            <Col span={12}>
                                <Card size="small" title="Timeline">
                                    <Timeline>
                                        <Timeline.Item color="green">
                                            <p className="font-medium">Budget Created</p>
                                            <p className="text-sm text-gray-500">
                                                {dayjs(selectedRecord.startDate).format('MMM DD, YYYY HH:mm')}
                                            </p>
                                        </Timeline.Item>
                                        <Timeline.Item color="blue">
                                            <p className="font-medium">Approval Process</p>
                                        </Timeline.Item>
                                        <Timeline.Item color="orange">
                                            <p className="font-medium">Active Period</p>
                                            <p className="text-sm text-gray-500">
                                                {dayjs(selectedRecord.startDate).format('MMM DD, YYYY')} - {dayjs(selectedRecord.dueDate).format('MMM DD, YYYY')}
                                            </p>
                                        </Timeline.Item>
                                    </Timeline>
                                </Card>
                            </Col>
                            <Col span={12}>
                                <Card size="small" title="Notes & Remarks">
                                    <div className="text-gray-600 text-sm leading-relaxed">
                                        {selectedRecord.notes}
                                    </div>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                )}
            </Modal>
        </div>
    );
}

