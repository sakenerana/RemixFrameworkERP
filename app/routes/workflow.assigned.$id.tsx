import { FileSearchOutlined, HomeOutlined, LoadingOutlined, UserOutlined, CalendarOutlined, BarChartOutlined } from "@ant-design/icons";
import { useNavigate, useSearchParams } from "@remix-run/react";
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
    Divider,
    Button,
} from "antd";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "~/auth/AuthContext";
import dayjs from 'dayjs';

const { Option } = Select;

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
    const [isUserID, setUserID] = useState<any>();
    const [isDepartmentID, setDepartmentID] = useState<any>();
    const [timeFilter, setTimeFilter] = useState<string>('day');

    const { user, token } = useAuth();

    const navigate = useNavigate();

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

    useMemo(() => {
        setUserID(localStorage.getItem('userAuthID'));
        setDepartmentID(localStorage.getItem('userDept'));
    }, []);

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

    return (
        <div className="w-full rounded-lg shadow-sm">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <div>
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
                </div>
            </div>

            {/* Toolbar Section */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-4">
                <Alert
                    message="Review all users with assigned workflows. Monitor status and take action as needed."
                    type="info"
                    showIcon
                    className="w-full lg:w-auto"
                />
            </div>

            {/* Main Content - Full Width */}
            <div className="space-y-8">
                {/* User Cards Section */}
                <div>
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <Spin
                                size="large"
                                tip="Loading assigned workflows..."
                                indicator={<LoadingOutlined style={{ fontSize: 36 }} spin />}
                            />
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Statistics Cards */}
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Card size="small">
                                        <Statistic
                                            title="Total Activities"
                                            value={totalActivities}
                                            valueStyle={{ color: '#3f51b5' }}
                                            prefix={<FileSearchOutlined />}
                                        />
                                    </Card>
                                </Col>
                                <Col span={12}>
                                    <Card size="small">
                                        <Statistic
                                            title="Total Workflows"
                                            value={totalWorkflows}
                                            valueStyle={{ color: '#4caf50' }}
                                            prefix={<BarChartOutlined />}
                                        />
                                    </Card>
                                </Col>
                            </Row>

                            {/* User Cards */}
                                {data.length > 0 ? (
                                    data.map((user) => (
                                        <Card
                                            key={user.id}
                                            className="p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow border-0"
                                        >
                                            <div className="flex items-center mb-4">
                                                <div className="bg-blue-100 p-3 rounded-full mr-4">
                                                    <UserOutlined className="text-blue-600 text-lg" />
                                                </div>
                                                <div>
                                                    <h3 className="font-medium text-gray-900">{user.username}</h3>
                                                    <p className="text-gray-500 text-sm">
                                                        {user.firstname} {user.lastname}
                                                    </p>
                                                    <p className="text-xs text-gray-400">
                                                        {user.activities_count} activities
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <h4 className="font-medium border-b pb-2 text-gray-700">
                                                    Workflow Breakdown
                                                </h4>

                                                {Object.entries(user.workflows_breakdown).map(([workflow, count]) => (
                                                    <div key={workflow} className="flex justify-between items-center">
                                                        <span className="text-sm text-gray-600">{workflow}</span>
                                                        <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded-full text-xs font-medium">
                                                            {count} tasks
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </Card>
                                    ))
                                ) : (
                                    <div className="col-span-full py-12 flex flex-col items-center">
                                        <FileSearchOutlined className="text-3xl mb-3 text-gray-400" />
                                        <p className="text-gray-500 mb-2 text-base">No assigned workflows found</p>
                                        <p className="text-gray-400 text-sm mb-4">
                                            Create new assignments or check your filters
                                        </p>
                                    </div>
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
                    className="shadow-sm border-0"
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
                            <Row gutter={16} className="mb-6">
                                <Col span={6}>
                                    <div className="text-center p-3 bg-green-50 rounded-lg">
                                        <div className="text-2xl font-bold text-green-600">
                                            {filteredHistory.filter(log => log.status === 'completed').length}
                                        </div>
                                        <div className="text-sm text-green-700">Completed</div>
                                    </div>
                                </Col>
                                <Col span={6}>
                                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                                        <div className="text-2xl font-bold text-blue-600">
                                            {filteredHistory.filter(log => log.status === 'in_progress').length}
                                        </div>
                                        <div className="text-sm text-blue-700">In Progress</div>
                                    </div>
                                </Col>
                                <Col span={6}>
                                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                                        <div className="text-2xl font-bold text-orange-600">
                                            {filteredHistory.filter(log => log.status === 'pending').length}
                                        </div>
                                        <div className="text-sm text-orange-700">Pending</div>
                                    </div>
                                </Col>
                                <Col span={6}>
                                    <div className="text-center p-3 bg-red-50 rounded-lg">
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
                                                <div className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div className="flex items-center gap-3">
                                                            <Tag color={getActionColor(log.action)} className="text-xs font-medium">
                                                                {log.action}
                                                            </Tag>
                                                            <span className="text-sm font-semibold text-gray-900">
                                                                {log.workflow}
                                                            </span>
                                                        </div>
                                                        <span className="text-xs text-gray-500 whitespace-nowrap">
                                                            {dayjs(log.timestamp).format('MMM DD, YYYY HH:mm')}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <div>
                                                            <p className="text-sm text-gray-600 mb-1">
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
                                        <div className="text-center py-12 text-gray-500">
                                            <FileSearchOutlined className="text-3xl mb-3" />
                                            <p className="text-lg">No activity found for selected period</p>
                                            <p className="text-sm mt-1">Try selecting a different time filter</p>
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