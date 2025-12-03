import { CalendarOutlined, FileSearchOutlined, HomeOutlined, LinkOutlined, LoadingOutlined, SettingOutlined, FilterOutlined, DownloadOutlined, EyeOutlined } from "@ant-design/icons";
import { useNavigate } from "@remix-run/react";
import {
    Alert,
    Breadcrumb,
    Button,
    Checkbox,
    Dropdown,
    Input,
    MenuProps,
    Modal,
    Popconfirm,
    Space,
    Spin,
    Table,
    TableColumnsType,
    Tag,
    Timeline,
    Tooltip,
    DatePicker,
    Select,
    Card,
    Statistic,
    Row,
    Col,
} from "antd";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { AiFillProfile } from "react-icons/ai";
import { FcRefresh } from "react-icons/fc";
import { RiCircleFill } from "react-icons/ri";
import PrintDropdownComponent from "~/components/print_dropdown";
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;

interface HistoryDataType {
    id: number;
    refno: string;
    workflow_name: string;
    process_title: string;
    requested_by: string;
    requested_by_department: string;
    status: 'completed' | 'cancelled' | 'rejected' | 'in_progress';
    created_at: string;
    completed_at: string;
    duration_days: number;
    total_steps: number;
    completed_steps: number;
    current_step: string;
    assigned_to: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
}

interface HistoryStats {
    total_workflows: number;
    completed_workflows: number;
    average_completion_time: number;
    pending_workflows: number;
}

export default function WorkflowHistoryReports() {
    const [data, setData] = useState<HistoryDataType[]>([]);
    const [stats, setStats] = useState<HistoryStats>({
        total_workflows: 0,
        completed_workflows: 0,
        average_completion_time: 0,
        pending_workflows: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchText, setSearchText] = useState('');
    const [filteredData, setFilteredData] = useState<HistoryDataType[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<HistoryDataType | null>(null);
    const [dateRange, setDateRange] = useState<any>(null);
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [priorityFilter, setPriorityFilter] = useState<string>('all');

    const navigate = useNavigate();

    const handleRefetch = async () => {
        setLoading(true);
        await fetchHistoryData();
        setLoading(false);
    };

    const fetchHistoryData = async () => {
        const getABID = localStorage.getItem('ab_id');
        const getUsername = localStorage.getItem('username');
        const CACHE_KEY = `workflowHistory_${getABID}`;
        const CACHE_EXPIRY = 10 * 60 * 1000; // 10 minutes cache

        try {
            setLoading(true);
            setError(null);

            // Check cache first
            const cachedData = localStorage.getItem(CACHE_KEY);
            const now = new Date().getTime();

            if (cachedData) {
                const { data, timestamp, stats } = JSON.parse(cachedData);
                if (now - timestamp < CACHE_EXPIRY) {
                    setData(data);
                    setStats(stats);
                    setLoading(false);
                    return;
                }
            }

            // Mock API call - replace with your actual API endpoint
            const response = await axios.post<any>(
                `${import.meta.env.VITE_API_BASE_URL}/workflow-history`,
                {
                    userid: Number(getABID),
                    username: getUsername,
                    tracked_user_id: Number(getABID)
                }
            );

            // For demo purposes, generating mock data
            const mockData = generateMockHistoryData();
            const mockStats = calculateStats(mockData);

            setData(mockData);
            setStats(mockStats);

            // Update cache
            localStorage.setItem(CACHE_KEY, JSON.stringify({
                data: mockData,
                stats: mockStats,
                timestamp: now
            }));

        } catch (err) {
            const cachedData = localStorage.getItem(CACHE_KEY);
            if (cachedData) {
                const { data, stats } = JSON.parse(cachedData);
                setData(data);
                setStats(stats);
            } else {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
            }
            console.error('Failed to fetch history data:', err);
        } finally {
            setLoading(false);
        }
    };

    // Generate mock data for demonstration
    const generateMockHistoryData = (): HistoryDataType[] => {
        const workflows = ['Purchase Request', 'Leave Application', 'IT Support', 'Expense Claim', 'Document Approval'];
        const departments = ['HR', 'IT', 'Finance', 'Operations', 'Marketing'];
        const users = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson', 'David Brown'];

        return Array.from({ length: 50 }, (_, i) => ({
            id: i + 1,
            refno: `REF-${2024000 + i}`,
            workflow_name: workflows[Math.floor(Math.random() * workflows.length)],
            process_title: `${workflows[Math.floor(Math.random() * workflows.length)]} Process`,
            requested_by: users[Math.floor(Math.random() * users.length)],
            requested_by_department: departments[Math.floor(Math.random() * departments.length)],
            status: ['completed', 'cancelled', 'rejected', 'in_progress'][Math.floor(Math.random() * 4)] as any,
            created_at: dayjs().subtract(Math.floor(Math.random() * 30), 'days').format('YYYY-MM-DD HH:mm:ss'),
            completed_at: dayjs().subtract(Math.floor(Math.random() * 15), 'days').format('YYYY-MM-DD HH:mm:ss'),
            duration_days: Math.floor(Math.random() * 20) + 1,
            total_steps: Math.floor(Math.random() * 8) + 3,
            completed_steps: Math.floor(Math.random() * 8) + 1,
            current_step: `Step ${Math.floor(Math.random() * 5) + 1}`,
            assigned_to: users[Math.floor(Math.random() * users.length)],
            priority: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)] as any,
        }));
    };

    const calculateStats = (data: HistoryDataType[]): HistoryStats => {
        const completed = data.filter(item => item.status === 'completed').length;
        const pending = data.filter(item => item.status === 'in_progress').length;
        const avgTime = data.filter(item => item.status === 'completed')
            .reduce((acc, item) => acc + item.duration_days, 0) / completed || 0;

        return {
            total_workflows: data.length,
            completed_workflows: completed,
            average_completion_time: Math.round(avgTime * 10) / 10,
            pending_workflows: pending,
        };
    };

    useEffect(() => {
        fetchHistoryData();
    }, []);

    // Apply filters
    useEffect(() => {
        let filtered = data;

        // Search filter
        if (searchText.trim() !== '') {
            filtered = filtered.filter(item =>
                item.process_title?.toLowerCase().includes(searchText.toLowerCase()) ||
                item.refno?.toLowerCase().includes(searchText.toLowerCase()) ||
                item.requested_by?.toLowerCase().includes(searchText.toLowerCase())
            );
        }

        // Status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(item => item.status === statusFilter);
        }

        // Priority filter
        if (priorityFilter !== 'all') {
            filtered = filtered.filter(item => item.priority === priorityFilter);
        }

        // Date range filter
        if (dateRange && dateRange.length === 2) {
            const [start, end] = dateRange;
            filtered = filtered.filter(item => {
                const createdDate = dayjs(item.created_at);
                return createdDate.isAfter(start) && createdDate.isBefore(end);
            });
        }

        setFilteredData(filtered);
    }, [searchText, data, statusFilter, priorityFilter, dateRange]);

    const handleViewDetails = (record: HistoryDataType) => {
        setSelectedRecord(record);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedRecord(null);
    };

    const getStatusColor = (status: string) => {
        const colors: any = {
            completed: 'green',
            in_progress: 'blue',
            cancelled: 'orange',
            rejected: 'red'
        };
        return colors[status] || 'default';
    };

    const getPriorityColor = (priority: string) => {
        const colors: any = {
            low: 'blue',
            medium: 'green',
            high: 'orange',
            critical: 'red'
        };
        return colors[priority] || 'default';
    };

    // State for column visibility
    const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({
        "Reference No": true,
        "Workflow": true,
        "Process Title": true,
        "Requested By": true,
        "Department": true,
        "Status": true,
        "Priority": true,
        "Created Date": true,
        "Completed Date": true,
        "Duration": true,
        "Progress": true,
        "Actions": true,
    });

    const columns: TableColumnsType<HistoryDataType> = [
        {
            title: "Reference No",
            dataIndex: "refno",
            key: "refno",
            width: 140,
            fixed: 'left',
            render: (refno) => (
                <a
                    target="_blank"
                    href={`${import.meta.env.VITE_AB_LINK}/activities/${refno}`}
                    className="font-mono text-sm flex items-center hover:text-blue-500 hover:underline"
                >
                    <LinkOutlined className="mr-1" />
                    {refno}
                </a>
            ),
            sorter: (a, b) => a.refno.localeCompare(b.refno),
        },
        {
            title: "Workflow",
            dataIndex: "workflow_name",
            key: "workflow_name",
            width: 150,
            render: (workflow) => (
                <Tag color="blue" className="font-medium">
                    {workflow}
                </Tag>
            ),
            sorter: (a, b) => a.workflow_name.localeCompare(b.workflow_name),
        },
        {
            title: "Process Title",
            dataIndex: "process_title",
            key: "process_title",
            width: 200,
            render: (text) => (
                <Tooltip title={text} placement="topLeft">
                    <div className="line-clamp-2">
                        {text}
                    </div>
                </Tooltip>
            ),
            sorter: (a, b) => a.process_title.localeCompare(b.process_title),
        },
        {
            title: "Requested By",
            dataIndex: "requested_by",
            key: "requested_by",
            width: 140,
            sorter: (a, b) => a.requested_by.localeCompare(b.requested_by),
        },
        {
            title: "Department",
            dataIndex: "requested_by_department",
            key: "department",
            width: 120,
            render: (dept) => <Tag color="cyan">{dept}</Tag>,
            sorter: (a, b) => a.requested_by_department.localeCompare(b.requested_by_department),
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            width: 120,
            render: (status) => (
                <Tag color={getStatusColor(status)} className="capitalize">
                    {status.replace('_', ' ')}
                </Tag>
            ),
            sorter: (a, b) => a.status.localeCompare(b.status),
        },
        {
            title: "Priority",
            dataIndex: "priority",
            key: "priority",
            width: 100,
            render: (priority) => (
                <Tag color={getPriorityColor(priority)} className="capitalize">
                    {priority}
                </Tag>
            ),
            sorter: (a, b) => a.priority.localeCompare(b.priority),
        },
        {
            title: "Created Date",
            dataIndex: "created_at",
            key: "created_at",
            width: 150,
            render: (date) => dayjs(date).format('MMM DD, YYYY HH:mm'),
            sorter: (a, b) => dayjs(a.created_at).unix() - dayjs(b.created_at).unix(),
        },
        {
            title: "Completed Date",
            dataIndex: "completed_at",
            key: "completed_at",
            width: 150,
            render: (date) => date ? dayjs(date).format('MMM DD, YYYY HH:mm') : '-',
            sorter: (a, b) => dayjs(a.completed_at || 0).unix() - dayjs(b.completed_at || 0).unix(),
        },
        {
            title: "Duration",
            dataIndex: "duration_days",
            key: "duration",
            width: 100,
            render: (days, record) => (
                <span className={record.status === 'completed' ? 'text-green-600 font-medium' : 'text-orange-600'}>
                    {days} days
                </span>
            ),
            sorter: (a, b) => a.duration_days - b.duration_days,
        },
        {
            title: "Progress",
            dataIndex: "progress",
            key: "progress",
            width: 140,
            render: (_, record) => (
                <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{
                                width: `${(record.completed_steps / record.total_steps) * 100}%`
                            }}
                        />
                    </div>
                    <span className="text-xs text-gray-600 min-w-[40px]">
                        {record.completed_steps}/{record.total_steps}
                    </span>
                </div>
            ),
        },
        {
            title: "Actions",
            key: "actions",
            width: 100,
            fixed: "right",
            render: (_, record) => (
                <Tooltip title="View detailed history">
                    <Button
                        type="link"
                        icon={<EyeOutlined />}
                        onClick={() => handleViewDetails(record)}
                        className="text-blue-500 hover:text-blue-700"
                    />
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

    return (
        <div className="w-full px-6 py-4 rounded-lg shadow-sm">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <Breadcrumb
                        items={[
                            {
                                href: "/workflow",
                                title: <HomeOutlined className="text-gray-400" />,
                            },
                            {
                                title: <span className="text-blue-600 font-medium">Workflow History & Reports</span>,
                            },
                        ]}
                        className="text-sm"
                    />
                    <h1 className="text-2xl font-bold mt-2">Workflow History Logs</h1>
                </div>
            </div>

            {/* Statistics Cards */}
            <Row gutter={16} className="mb-6">
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Total Workflows"
                            value={stats.total_workflows}
                            valueStyle={{ color: '#3f51b5' }}
                            prefix={<FileSearchOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Completed"
                            value={stats.completed_workflows}
                            valueStyle={{ color: '#4caf50' }}
                            suffix={`/ ${stats.total_workflows}`}
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Avg. Completion Time"
                            value={stats.average_completion_time}
                            valueStyle={{ color: '#ff9800' }}
                            suffix="days"
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Pending"
                            value={stats.pending_workflows}
                            valueStyle={{ color: '#f44336' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Toolbar Section */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
                <Alert
                    message="Comprehensive history of all workflow activities. Track progress, analyze performance, and generate reports."
                    type="info"
                    showIcon
                    className="w-full lg:w-auto rounded-lg"
                />

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto">
                    <Input.Search
                        allowClear
                        onChange={(e) => setSearchText(e.target.value)}
                        placeholder="Search workflows..."
                        className="w-full sm:w-64"
                        size="middle"
                    />

                    <Space>
                        <Button
                            onClick={handleRefetch}
                            icon={<FcRefresh className="text-blue-500" />}
                            className="flex items-center gap-2 hover:border-blue-500"
                        >
                            Refresh
                        </Button>

                        <Dropdown
                            menu={{
                                items: columnMenuItems,
                                className: "shadow-lg rounded-md min-w-[200px] py-2"
                            }}
                            placement="bottomRight"
                            trigger={['click']}
                        >
                            <Button
                                icon={<SettingOutlined />}
                                className="flex items-center gap-2 hover:border-blue-500"
                            >
                                Columns
                            </Button>
                        </Dropdown>

                        <PrintDropdownComponent
                            stateData={data}
                            buttonProps={{
                                className: "flex items-center gap-2 hover:border-blue-500",
                            }}
                        />
                    </Space>
                </div>
            </div>

            {/* Filters Section */}
            <Card className="mb-6 shadow-sm">
                <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
                    <span className="text-sm font-medium text-gray-700">Filters:</span>

                    <RangePicker
                        onChange={setDateRange}
                        className="w-full lg:w-auto"
                        placeholder={['Start Date', 'End Date']}
                    />

                    <Select
                        value={statusFilter}
                        onChange={setStatusFilter}
                        className="w-full lg:w-40"
                        placeholder="Status"
                    >
                        <Option value="all">All Status</Option>
                        <Option value="completed">Completed</Option>
                        <Option value="in_progress">In Progress</Option>
                        <Option value="cancelled">Cancelled</Option>
                        <Option value="rejected">Rejected</Option>
                    </Select>

                    <Select
                        value={priorityFilter}
                        onChange={setPriorityFilter}
                        className="w-full lg:w-40"
                        placeholder="Priority"
                    >
                        <Option value="all">All Priority</Option>
                        <Option value="low">Low</Option>
                        <Option value="medium">Medium</Option>
                        <Option value="high">High</Option>
                        <Option value="critical">Critical</Option>
                    </Select>

                    <Button
                        onClick={() => {
                            setDateRange(null);
                            setStatusFilter('all');
                            setPriorityFilter('all');
                            setSearchText('');
                        }}
                        type="default"
                        className="flex items-center gap-2"
                    >
                        <FilterOutlined />
                        Clear Filters
                    </Button>
                </div>
            </Card>

            {/* Table Section */}
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Spin
                        size="large"
                        tip="Loading workflow history..."
                        indicator={<LoadingOutlined style={{ fontSize: 36 }} spin />}
                    />
                </div>
            ) : (
                <Table<HistoryDataType>
                    size="middle"
                    columns={filteredColumns}
                    dataSource={filteredData}
                    className="shadow-sm rounded-lg overflow-hidden"
                    bordered
                    scroll={{ x: 'max-content', y: 600 }}
                    rowKey="id"
                    pagination={{
                        showSizeChanger: true,
                        showQuickJumper: true,
                        pageSizeOptions: ['10', '20', '50', '100'],
                        defaultPageSize: 20,
                        className: "px-4 py-2 rounded-b-lg",
                        showTotal: (total, range) => (
                            <span className="text-sm">
                                Showing {range[0]}-{range[1]} of {total} records
                            </span>
                        ),
                    }}
                    locale={{
                        emptyText: (
                            <div className="py-12 flex flex-col items-center">
                                <FileSearchOutlined className="text-3xl text-gray-400 mb-3" />
                                <p className="text-gray-500 mb-2 text-base">No workflow history found</p>
                                <p className="text-gray-400 text-sm mb-4">Adjust your filters or create new workflows</p>
                            </div>
                        )
                    }}
                />
            )}

            {/* History Details Modal */}
            <Modal
                width={800}
                title={
                    <div className="space-y-2">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Workflow History Details
                        </h2>
                        {selectedRecord && (
                            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                                <div className="flex items-center gap-1">
                                    <span className="font-medium text-gray-700">Ref:</span>
                                    <span>{selectedRecord.refno}</span>
                                </div>
                                <span className="text-gray-400">•</span>
                                <div className="flex items-center gap-1">
                                    <span className="font-medium text-gray-700">Workflow:</span>
                                    <Tag color="blue">{selectedRecord.workflow_name}</Tag>
                                </div>
                                <span className="text-gray-400">•</span>
                                <div className="flex items-center gap-1">
                                    <span className="font-medium text-gray-700">Status:</span>
                                    <Tag color={getStatusColor(selectedRecord.status)} className="capitalize">
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
                        <Row gutter={16}>
                            <Col span={12}>
                                <Card size="small" title="Basic Information">
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Process Title:</span>
                                            <span className="font-medium">{selectedRecord.process_title}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Requested By:</span>
                                            <span>{selectedRecord.requested_by}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Department:</span>
                                            <Tag color="cyan">{selectedRecord.requested_by_department}</Tag>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Priority:</span>
                                            <Tag color={getPriorityColor(selectedRecord.priority)}>
                                                {selectedRecord.priority}
                                            </Tag>
                                        </div>
                                    </div>
                                </Card>
                            </Col>
                            <Col span={12}>
                                <Card size="small" title="Timeline Information">
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Created:</span>
                                            <span>{dayjs(selectedRecord.created_at).format('MMM DD, YYYY HH:mm')}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Completed:</span>
                                            <span>
                                                {selectedRecord.completed_at
                                                    ? dayjs(selectedRecord.completed_at).format('MMM DD, YYYY HH:mm')
                                                    : '-'
                                                }
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Duration:</span>
                                            <span className="font-medium">{selectedRecord.duration_days} days</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Progress:</span>
                                            <span>
                                                {selectedRecord.completed_steps} / {selectedRecord.total_steps} steps
                                            </span>
                                        </div>
                                    </div>
                                </Card>
                            </Col>
                        </Row>

                        <Card size="small" title="Activity Timeline">
                            <Timeline>
                                <Timeline.Item color="green">
                                    <p className="font-medium">Workflow Created</p>
                                    <p className="text-sm text-gray-500">
                                        {dayjs(selectedRecord.created_at).format('MMM DD, YYYY HH:mm')}
                                    </p>
                                </Timeline.Item>
                                <Timeline.Item color="blue">
                                    <p className="font-medium">In Progress</p>
                                    <p className="text-sm text-gray-500">
                                        Current step: {selectedRecord.current_step}
                                    </p>
                                </Timeline.Item>
                                {selectedRecord.status === 'completed' && (
                                    <Timeline.Item color="green">
                                        <p className="font-medium">Completed</p>
                                        <p className="text-sm text-gray-500">
                                            {dayjs(selectedRecord.completed_at).format('MMM DD, YYYY HH:mm')}
                                        </p>
                                    </Timeline.Item>
                                )}
                                {selectedRecord.status === 'cancelled' && (
                                    <Timeline.Item color="orange">
                                        <p className="font-medium">Cancelled</p>
                                    </Timeline.Item>
                                )}
                                {selectedRecord.status === 'rejected' && (
                                    <Timeline.Item color="red">
                                        <p className="font-medium">Rejected</p>
                                    </Timeline.Item>
                                )}
                            </Timeline>
                        </Card>
                    </div>
                )}
            </Modal>
        </div>
    );
}