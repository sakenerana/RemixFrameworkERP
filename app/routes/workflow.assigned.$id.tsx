import {
    BarChartOutlined,
    CalendarOutlined,
    FileExcelOutlined,
    FileSearchOutlined,
    HomeOutlined,
    LoadingOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { useSearchParams } from "@remix-run/react";
import {
    Alert,
    Breadcrumb,
    Card,
    Spin,
    Row,
    Col,
    Select,
    Timeline,
    Tag,
    Statistic,
    Button,
    Progress,
    Space,
    Typography,
} from "antd";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import dayjs from 'dayjs';
import * as XLSX from 'xlsx';

const { Option } = Select;
const { Text, Title } = Typography;

interface DataType {
    id: number;
    firstname: string;
    lastname: string;
    username: string;
    activities_count: number;
    workflows_breakdown: any[];
    userId?: number; // Optional property
}

interface HistoryLog {
    id: number;
    timestamp: string;
    action: string;
    user: string;
    workflow: string;
    status: 'completed' | 'pending' | 'in_progress' | 'cancelled';
    details: string;
}

export default function Assigned() {
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");
    const [data, setData] = useState<DataType[]>([]);
    const [historyLogs, setHistoryLogs] = useState<HistoryLog[]>([]);
    const [filteredHistory, setFilteredHistory] = useState<HistoryLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [timeFilter, setTimeFilter] = useState<string>('day');

    const fetchData = async () => {
        const getABID = localStorage.getItem('ab_id');
        const getUsername = localStorage.getItem('username');

        try {
            setLoading(true);
            setError(null);

            const response = await axios.post<any>(
                `${import.meta.env.VITE_API_BASE_URL}/user-activities`,
                {
                    userid: Number(getABID),
                    username: getUsername
                },
            );

            // Filter data to only include items with ID ##
            const filteredData = response.data.data.filter((item: any) => item.id === Number(id));
            setData(filteredData); // Only stores data where ID = ##
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
            console.error('Failed to fetch data:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchHistoryLogs = async () => {
        const getABID = localStorage.getItem('ab_id');

        try {
            setHistoryLoading(true);

            // Mock API call for history logs - replace with your actual endpoint
            const mockHistory: HistoryLog[] = [
                {
                    id: 1,
                    timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                    action: 'Workflow Assigned',
                    user: 'John Doe',
                    workflow: 'Purchase Request',
                    status: 'completed',
                    details: 'New purchase request assigned to finance team'
                },
                {
                    id: 2,
                    timestamp: dayjs().subtract(2, 'hours').format('YYYY-MM-DD HH:mm:ss'),
                    action: 'Status Updated',
                    user: 'Jane Smith',
                    workflow: 'Leave Application',
                    status: 'in_progress',
                    details: 'Leave application moved to HR approval'
                },
                {
                    id: 3,
                    timestamp: dayjs().subtract(1, 'day').format('YYYY-MM-DD HH:mm:ss'),
                    action: 'Workflow Completed',
                    user: 'Mike Johnson',
                    workflow: 'Expense Claim',
                    status: 'completed',
                    details: 'Expense claim processed and approved'
                },
                {
                    id: 4,
                    timestamp: dayjs().subtract(3, 'days').format('YYYY-MM-DD HH:mm:ss'),
                    action: 'Workflow Created',
                    user: 'Sarah Wilson',
                    workflow: 'IT Support',
                    status: 'pending',
                    details: 'New IT support ticket created'
                },
                {
                    id: 5,
                    timestamp: dayjs().subtract(1, 'week').format('YYYY-MM-DD HH:mm:ss'),
                    action: 'Workflow Cancelled',
                    user: 'David Brown',
                    workflow: 'Document Approval',
                    status: 'cancelled',
                    details: 'Document approval workflow cancelled by requester'
                },
                {
                    id: 6,
                    timestamp: dayjs().subtract(2, 'weeks').format('YYYY-MM-DD HH:mm:ss'),
                    action: 'Workflow Assigned',
                    user: 'Robert Chen',
                    workflow: 'Budget Approval',
                    status: 'completed',
                    details: 'Budget approval assigned to finance department'
                },
                {
                    id: 7,
                    timestamp: dayjs().subtract(1, 'month').format('YYYY-MM-DD HH:mm:ss'),
                    action: 'Status Updated',
                    user: 'Lisa Wang',
                    workflow: 'Vendor Onboarding',
                    status: 'in_progress',
                    details: 'Vendor onboarding in final review stage'
                }
            ];

            setHistoryLogs(mockHistory);
            applyTimeFilter(mockHistory, timeFilter);
        } catch (err) {
            console.error('Failed to fetch history logs:', err);
        } finally {
            setHistoryLoading(false);
        }
    };

    const applyTimeFilter = (logs: HistoryLog[], filter: string) => {
        const now = dayjs();
        let filtered: HistoryLog[] = [];

        switch (filter) {
            case 'day':
                filtered = logs.filter(log =>
                    dayjs(log.timestamp).isAfter(now.subtract(1, 'day'))
                );
                break;
            case 'week':
                filtered = logs.filter(log =>
                    dayjs(log.timestamp).isAfter(now.subtract(1, 'week'))
                );
                break;
            case 'month':
                filtered = logs.filter(log =>
                    dayjs(log.timestamp).isAfter(now.subtract(1, 'month'))
                );
                break;
            case 'year':
                filtered = logs.filter(log =>
                    dayjs(log.timestamp).isAfter(now.subtract(1, 'year'))
                );
                break;
            default:
                filtered = logs;
        }

        setFilteredHistory(filtered);
    };

    const getStatusColor = (status: string) => {
        const colors: any = {
            completed: 'green',
            in_progress: 'blue',
            pending: 'orange',
            cancelled: 'red'
        };
        return colors[status] || 'default';
    };

    const getActionColor = (action: string) => {
        if (action.includes('Completed')) return 'green';
        if (action.includes('Assigned')) return 'blue';
        if (action.includes('Created')) return 'cyan';
        if (action.includes('Updated')) return 'orange';
        if (action.includes('Cancelled')) return 'red';
        return 'purple';
    };

    useEffect(() => {
        fetchData();
        fetchHistoryLogs();
    }, []);

    useEffect(() => {
        applyTimeFilter(historyLogs, timeFilter);
    }, [timeFilter, historyLogs]);

    // Calculate statistics
    const totalActivities = data.reduce((sum, user) => sum + user.activities_count, 0);
    const totalWorkflows = data.reduce((sum, user) => sum + Object.keys(user.workflows_breakdown).length, 0);
    const selectedUser = data[0];
    const workflowEntries = useMemo(() => {
        const entries = Object.entries(selectedUser?.workflows_breakdown || {});

        return entries
            .map(([workflow, count]) => ({
                workflow,
                count: Number(count) || 0,
            }))
            .sort((a, b) => b.count - a.count);
    }, [selectedUser]);
    const topWorkflowCount = workflowEntries[0]?.count ?? 0;

    const exportToExcel = () => {
        const assignedDetails = data.flatMap((user) => {
            const profileRows = [
                { section: "User Profile", field: "User ID", value: user.id },
                { section: "User Profile", field: "Username", value: user.username },
                { section: "User Profile", field: "Full Name", value: `${user.firstname} ${user.lastname}` },
                { section: "User Profile", field: "Activities", value: user.activities_count },
            ];

            const workflowRows = Object.entries(user.workflows_breakdown || {}).map(([workflow, count]) => ({
                section: "Workflow Breakdown",
                field: workflow,
                value: count,
            }));

            return [...profileRows, ...workflowRows, { section: "", field: "", value: "" }];
        });

        const userSummary = data.map((user) => ({
            id: user.id,
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname,
            activities_count: user.activities_count,
            workflow_types: Object.keys(user.workflows_breakdown || {}).length,
        }));

        const workflowBreakdown = data.flatMap((user) =>
            Object.entries(user.workflows_breakdown || {}).map(([workflow, count]) => ({
                user_id: user.id,
                username: user.username,
                workflow,
                tasks: count,
            }))
        );

        const wb = XLSX.utils.book_new();

        const assignedDetailsSheet = XLSX.utils.json_to_sheet(assignedDetails);
        XLSX.utils.book_append_sheet(wb, assignedDetailsSheet, "Assigned Details");

        const userSummarySheet = XLSX.utils.json_to_sheet(userSummary);
        XLSX.utils.book_append_sheet(wb, userSummarySheet, "User Summary");

        const workflowBreakdownSheet = XLSX.utils.json_to_sheet(workflowBreakdown);
        XLSX.utils.book_append_sheet(wb, workflowBreakdownSheet, "Workflow Breakdown");

        const dateString = dayjs().format('YYYY-MM-DD_HH-mm-ss');
        XLSX.writeFile(wb, `workflow-assigned-${id || 'all'}-${dateString}.xlsx`);
    };

    return (
        <div className="workflow-assigned-page w-full">
            {/* Header Section */}
            <Card className="mb-5 rounded-md border border-gray-200 shadow-sm" styles={{ body: { padding: 20 } }}>
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="min-w-0">
                        <Breadcrumb
                            items={[
                                {
                                    href: "/workflow",
                                    title: <HomeOutlined className="text-gray-400" />,
                                },
                                {
                                    title: <span className="text-gray-500">Workflow</span>,
                                },
                                {
                                    title: <span className="text-blue-600 font-medium">Assigned</span>,
                                },
                            ]}
                            className="text-sm"
                        />
                        <Title level={3} className="!mb-1 !mt-3">
                            Assigned Workflows
                        </Title>
                        <Text className="text-sm text-gray-500">
                            Review the selected user's workflow activity and task distribution.
                        </Text>
                    </div>
                    <Button type="primary" icon={<FileExcelOutlined />} onClick={exportToExcel}>
                        Export to Excel
                    </Button>
                </div>
            </Card>

            {error && (
                <Alert message={`Error: ${error}`} type="error" className="mb-4 rounded-md" />
            )}

            {/* Toolbar Section */}
            <div className="mb-5 rounded-md border border-gray-200 bg-gray-50 p-4">
                <Alert
                    message="Review all users with assigned workflows. Monitor status and take action as needed."
                    type="info"
                    showIcon
                />
            </div>

            {/* Main Content - Full Width */}
            <div className="space-y-6">
                {/* User Cards Section */}
                <div>
                    {loading ? (
                        <Card className="rounded-md border border-gray-200 shadow-sm">
                            <div className="flex h-64 items-center justify-center">
                                <Spin
                                    size="large"
                                    tip="Loading assigned workflows..."
                                    indicator={<LoadingOutlined style={{ fontSize: 36 }} spin />}
                                />
                            </div>
                        </Card>
                    ) : (
                        <div className="space-y-5">
                            <Row gutter={[16, 16]}>
                                <Col xs={24} md={8}>
                                    <Card className="h-full rounded-md border border-gray-200 shadow-sm">
                                        <Statistic
                                            title="Total Activities"
                                            value={totalActivities}
                                            valueStyle={{ color: '#0f172a', fontWeight: 700 }}
                                            prefix={<FileSearchOutlined className="text-blue-600" />}
                                        />
                                        <Text className="text-xs text-gray-500">Assigned activity volume</Text>
                                    </Card>
                                </Col>
                                <Col xs={24} md={8}>
                                    <Card className="h-full rounded-md border border-gray-200 shadow-sm">
                                        <Statistic
                                            title="Workflow Types"
                                            value={totalWorkflows}
                                            valueStyle={{ color: '#0f172a', fontWeight: 700 }}
                                            prefix={<BarChartOutlined className="text-emerald-600" />}
                                        />
                                        <Text className="text-xs text-gray-500">Unique workflow categories</Text>
                                    </Card>
                                </Col>
                                <Col xs={24} md={8}>
                                    <Card className="h-full rounded-md border border-gray-200 shadow-sm">
                                        <Statistic
                                            title="Top Workflow Tasks"
                                            value={topWorkflowCount}
                                            valueStyle={{ color: '#0f172a', fontWeight: 700 }}
                                        />
                                        <Text className="text-xs text-gray-500">
                                            {workflowEntries[0]?.workflow || 'No workflow activity'}
                                        </Text>
                                    </Card>
                                </Col>
                            </Row>

                            {selectedUser ? (
                                <Card
                                    className="rounded-md border border-gray-200 shadow-sm"
                                    styles={{ body: { padding: 0 } }}
                                >
                                    <div className="border-b border-gray-200 bg-white px-5 py-4">
                                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                            <div className="flex items-center">
                                                <div className="mr-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50">
                                                    <UserOutlined className="text-xl text-blue-600" />
                                                </div>
                                                <div>
                                                    <Title level={4} className="!mb-0">
                                                        {selectedUser.username}
                                                    </Title>
                                                    <Text className="text-sm text-gray-500">
                                                        {[selectedUser.firstname, selectedUser.lastname].filter(Boolean).join(' ') || 'No full name'}
                                                    </Text>
                                                </div>
                                            </div>
                                            <Space wrap>
                                                <Tag color="processing" className="rounded-full px-3 py-1">
                                                    {selectedUser.activities_count.toLocaleString()} activities
                                                </Tag>
                                                <Tag className="rounded-full px-3 py-1">
                                                    {workflowEntries.length} workflows
                                                </Tag>
                                            </Space>
                                        </div>
                                    </div>

                                    <div className="px-5 py-4">
                                        <div className="mb-4 flex items-center justify-between">
                                            <div>
                                                <Title level={5} className="!mb-0">
                                                    Workflow Breakdown
                                                </Title>
                                                <Text className="text-sm text-gray-500">
                                                    Task distribution by assigned workflow type.
                                                </Text>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            {workflowEntries.map(({ workflow, count }) => {
                                                const percent = topWorkflowCount > 0 ? Math.round((count / topWorkflowCount) * 100) : 0;

                                                return (
                                                    <div
                                                        key={workflow}
                                                        className="rounded-md border border-gray-200 bg-white p-4 transition-shadow hover:shadow-sm"
                                                    >
                                                        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                                            <Text className="font-semibold text-slate-900">
                                                                {workflow}
                                                            </Text>
                                                            <span className="rounded-md bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
                                                                {count.toLocaleString()} tasks
                                                            </span>
                                                        </div>
                                                        <Progress
                                                            percent={percent}
                                                            showInfo={false}
                                                            strokeColor="#2563eb"
                                                            trailColor="#eef2f7"
                                                            size="small"
                                                        />
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </Card>
                            ) : (
                                <Card className="rounded-md border border-gray-200 shadow-sm">
                                    <div className="flex flex-col items-center py-12">
                                        <FileSearchOutlined className="mb-3 text-3xl text-gray-400" />
                                        <p className="mb-2 text-base text-gray-500">No assigned workflows found</p>
                                        <p className="mb-4 text-sm text-gray-400">
                                            Create new assignments or check your filters
                                        </p>
                                    </div>
                                </Card>
                            )}
                        </div>
                    )}
                </div>

                {/* History Logs Section - Now at the bottom */}
                <Card
                    title={
                        <div className="flex items-center justify-between">
                            <span className="flex items-center gap-2 text-lg font-semibold">
                                <CalendarOutlined className="text-blue-500" />
                                Activity History
                            </span>
                            <Select
                                value={timeFilter}
                                onChange={setTimeFilter}
                                size="middle"
                                className="w-32"
                            >
                                <Option value="day">Today</Option>
                                <Option value="week">This Week</Option>
                                <Option value="month">This Month</Option>
                                <Option value="year">This Year</Option>
                            </Select>
                        </div>
                    }
                    className="rounded-md border border-gray-200 shadow-sm"
                    extra={
                        <div className="flex items-center gap-4">
                            <div className="text-sm text-gray-600">
                                Showing {filteredHistory.length} activities
                            </div>
                        </div>
                    }
                >
                    {historyLoading ? (
                        <div className="flex justify-center items-center h-32">
                            <Spin size="large" tip="Loading activity history..." />
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Quick Stats */}
                            <Row gutter={[16, 16]} className="mb-6">
                                <Col xs={12} md={6}>
                                    <div className="rounded-md bg-green-50 p-3 text-center">
                                        <div className="text-2xl font-bold text-green-600">
                                            {filteredHistory.filter(log => log.status === 'completed').length}
                                        </div>
                                        <div className="text-sm text-green-700">Completed</div>
                                    </div>
                                </Col>
                                <Col xs={12} md={6}>
                                    <div className="rounded-md bg-blue-50 p-3 text-center">
                                        <div className="text-2xl font-bold text-blue-600">
                                            {filteredHistory.filter(log => log.status === 'in_progress').length}
                                        </div>
                                        <div className="text-sm text-blue-700">In Progress</div>
                                    </div>
                                </Col>
                                <Col xs={12} md={6}>
                                    <div className="rounded-md bg-orange-50 p-3 text-center">
                                        <div className="text-2xl font-bold text-orange-600">
                                            {filteredHistory.filter(log => log.status === 'pending').length}
                                        </div>
                                        <div className="text-sm text-orange-700">Pending</div>
                                    </div>
                                </Col>
                                <Col xs={12} md={6}>
                                    <div className="rounded-md bg-red-50 p-3 text-center">
                                        <div className="text-2xl font-bold text-red-600">
                                            {filteredHistory.filter(log => log.status === 'cancelled').length}
                                        </div>
                                        <div className="text-sm text-red-700">Cancelled</div>
                                    </div>
                                </Col>
                            </Row>

                            {/* Timeline */}
                            <div className="max-h-[500px] overflow-y-auto pr-4">
                                <Timeline>
                                    {filteredHistory.length > 0 ? (
                                        filteredHistory.map((log) => (
                                            <Timeline.Item
                                                key={log.id}
                                                color={getStatusColor(log.status)}
                                                dot={
                                                    <div className="w-3 h-3 rounded-full bg-current" />
                                                }
                                            >
                                                <div className="rounded-md bg-gray-50 p-4 transition-colors hover:bg-gray-100">
                                                    <div className="mb-2 flex items-start justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <Tag color={getActionColor(log.action)} className="text-xs font-medium">
                                                                {log.action}
                                                            </Tag>
                                                            <span className="text-sm font-semibold text-gray-900">
                                                                {log.workflow}
                                                            </span>
                                                        </div>
                                                        <span className="whitespace-nowrap text-xs text-gray-500">
                                                            {dayjs(log.timestamp).format('MMM DD, YYYY HH:mm')}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className="mb-1 text-sm text-gray-600">
                                                                by <span className="font-medium">{log.user}</span>
                                                            </p>
                                                            <p className="text-sm text-gray-500">
                                                                {log.details}
                                                            </p>
                                                        </div>
                                                        <Tag
                                                            color={getStatusColor(log.status)}
                                                            className="text-xs capitalize font-medium"
                                                        >
                                                            {log.status.replace('_', ' ')}
                                                        </Tag>
                                                    </div>
                                                </div>
                                            </Timeline.Item>
                                        ))
                                    ) : (
                                        <div className="py-12 text-center text-gray-500">
                                            <FileSearchOutlined className="mb-3 text-3xl" />
                                            <p className="text-lg">No activity found for selected period</p>
                                            <p className="mt-1 text-sm">Try selecting a different time filter</p>
                                        </div>
                                    )}
                                </Timeline>
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
}
