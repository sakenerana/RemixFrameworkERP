import { CalendarOutlined, FileSearchOutlined, HomeOutlined, LinkOutlined, LoadingOutlined, SettingOutlined, FilterOutlined, EyeOutlined, DollarOutlined, PieChartOutlined, BarChartOutlined } from "@ant-design/icons";
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
    Progress,
    Divider,
} from "antd";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { FcRefresh } from "react-icons/fc";
import PrintDropdownComponent from "~/components/print_dropdown";
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;

interface BudgetHistoryDataType {
    id: number;
    reference_no: string;
    budget_name: string;
    budget_category: string;
    department: string;
    requested_by: string;
    approved_by: string;
    fiscal_year: string;
    status: 'approved' | 'pending' | 'rejected' | 'under_review' | 'completed';
    total_amount: number;
    utilized_amount: number;
    remaining_amount: number;
    utilization_rate: number;
    created_at: string;
    approved_at: string;
    start_date: string;
    end_date: string;
    priority: 'operational' | 'strategic' | 'emergency' | 'capital';
    notes: string;
}

interface BudgetStats {
    total_budgets: number;
    total_allocated: number;
    total_utilized: number;
    average_utilization: number;
    pending_approvals: number;
    approved_budgets: number;
}

export default function BudgetHistoryReports() {
    const [data, setData] = useState<BudgetHistoryDataType[]>([]);
    const [stats, setStats] = useState<BudgetStats>({
        total_budgets: 0,
        total_allocated: 0,
        total_utilized: 0,
        average_utilization: 0,
        pending_approvals: 0,
        approved_budgets: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchText, setSearchText] = useState('');
    const [filteredData, setFilteredData] = useState<BudgetHistoryDataType[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<BudgetHistoryDataType | null>(null);
    const [dateRange, setDateRange] = useState<any>(null);
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [departmentFilter, setDepartmentFilter] = useState<string>('all');

    const navigate = useNavigate();

    const handleRefetch = async () => {
        setLoading(true);
        await fetchBudgetHistoryData();
        setLoading(false);
    };

    const fetchBudgetHistoryData = async () => {
        const getABID = localStorage.getItem('ab_id');
        const getUsername = localStorage.getItem('username');
        const CACHE_KEY = `budgetHistory_${getABID}`;
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
                `${import.meta.env.VITE_API_BASE_URL}/budget-history`,
                {
                    userid: Number(getABID),
                    username: getUsername,
                    tracked_user_id: Number(getABID)
                }
            );

            // For demo purposes, generating mock data
            const mockData = generateMockBudgetHistoryData();
            const mockStats = calculateBudgetStats(mockData);

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
            console.error('Failed to fetch budget history data:', err);
        } finally {
            setLoading(false);
        }
    };

    // Generate mock data for demonstration
    const generateMockBudgetHistoryData = (): BudgetHistoryDataType[] => {
        const categories = ['Operations', 'IT Infrastructure', 'Marketing', 'HR', 'R&D', 'Facilities', 'Training'];
        const departments = ['Finance', 'IT', 'HR', 'Operations', 'Marketing', 'Sales', 'R&D'];
        const users = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson', 'David Brown'];
        const approvers = ['Robert Chen', 'Lisa Wang', 'Michael Garcia', 'Emily Davis'];

        return Array.from({ length: 45 }, (_, i) => {
            const totalAmount = Math.floor(Math.random() * 500000) + 50000;
            const utilizedAmount = Math.floor(Math.random() * totalAmount);
            const utilizationRate = (utilizedAmount / totalAmount) * 100;

            return {
                id: i + 1,
                reference_no: `BUD-${2024000 + i}`,
                budget_name: `${categories[Math.floor(Math.random() * categories.length)]} Budget`,
                budget_category: categories[Math.floor(Math.random() * categories.length)],
                department: departments[Math.floor(Math.random() * departments.length)],
                requested_by: users[Math.floor(Math.random() * users.length)],
                approved_by: approvers[Math.floor(Math.random() * approvers.length)],
                fiscal_year: '2024',
                status: ['approved', 'pending', 'rejected', 'under_review', 'completed'][Math.floor(Math.random() * 5)] as any,
                total_amount: totalAmount,
                utilized_amount: utilizedAmount,
                remaining_amount: totalAmount - utilizedAmount,
                utilization_rate: utilizationRate,
                created_at: dayjs().subtract(Math.floor(Math.random() * 90), 'days').format('YYYY-MM-DD HH:mm:ss'),
                approved_at: dayjs().subtract(Math.floor(Math.random() * 60), 'days').format('YYYY-MM-DD HH:mm:ss'),
                start_date: dayjs().subtract(Math.floor(Math.random() * 30), 'days').format('YYYY-MM-DD'),
                end_date: dayjs().add(Math.floor(Math.random() * 60), 'days').format('YYYY-MM-DD'),
                priority: ['operational', 'strategic', 'emergency', 'capital'][Math.floor(Math.random() * 4)] as any,
                notes: 'Budget allocation for quarterly expenses and project funding.',
            };
        });
    };

    const calculateBudgetStats = (data: BudgetHistoryDataType[]): BudgetStats => {
        const totalAllocated = data.reduce((acc, item) => acc + item.total_amount, 0);
        const totalUtilized = data.reduce((acc, item) => acc + item.utilized_amount, 0);
        const pending = data.filter(item => item.status === 'pending').length;
        const approved = data.filter(item => item.status === 'approved' || item.status === 'completed').length;
        const avgUtilization = data.length > 0 ? data.reduce((acc, item) => acc + item.utilization_rate, 0) / data.length : 0;

        return {
            total_budgets: data.length,
            total_allocated: totalAllocated,
            total_utilized: totalUtilized,
            average_utilization: Math.round(avgUtilization * 10) / 10,
            pending_approvals: pending,
            approved_budgets: approved,
        };
    };

    useEffect(() => {
        fetchBudgetHistoryData();
    }, []);

    // Apply filters
    useEffect(() => {
        let filtered = data;

        // Search filter
        if (searchText.trim() !== '') {
            filtered = filtered.filter(item =>
                item.budget_name?.toLowerCase().includes(searchText.toLowerCase()) ||
                item.reference_no?.toLowerCase().includes(searchText.toLowerCase()) ||
                item.requested_by?.toLowerCase().includes(searchText.toLowerCase()) ||
                item.budget_category?.toLowerCase().includes(searchText.toLowerCase())
            );
        }

        // Status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(item => item.status === statusFilter);
        }

        // Category filter
        if (categoryFilter !== 'all') {
            filtered = filtered.filter(item => item.budget_category === categoryFilter);
        }

        // Department filter
        if (departmentFilter !== 'all') {
            filtered = filtered.filter(item => item.department === departmentFilter);
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
    }, [searchText, data, statusFilter, categoryFilter, departmentFilter, dateRange]);

    const handleViewDetails = (record: BudgetHistoryDataType) => {
        setSelectedRecord(record);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedRecord(null);
    };

    const getStatusColor = (status: string) => {
        const colors: any = {
            approved: 'green',
            completed: 'green',
            pending: 'orange',
            under_review: 'blue',
            rejected: 'red'
        };
        return colors[status] || 'default';
    };

    const getPriorityColor = (priority: string) => {
        const colors: any = {
            operational: 'blue',
            strategic: 'purple',
            emergency: 'red',
            capital: 'orange'
        };
        return colors[priority] || 'default';
    };

    const getUtilizationColor = (rate: number) => {
        if (rate >= 90) return 'red';
        if (rate >= 75) return 'orange';
        if (rate >= 50) return 'gold';
        return 'green';
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    // State for column visibility
    const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({
        "Reference No": true,
        "Budget Name": true,
        "Category": true,
        "Department": true,
        "Requested By": true,
        "Total Amount": true,
        "Utilized": true,
        "Remaining": true,
        "Utilization Rate": true,
        "Status": true,
        "Priority": true,
        "Fiscal Year": true,
        "Created Date": true,
        "Actions": true,
    });

    const columns: TableColumnsType<BudgetHistoryDataType> = [
        {
            title: "Reference No",
            dataIndex: "reference_no",
            key: "reference_no",
            width: 140,
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
            sorter: (a, b) => a.reference_no.localeCompare(b.reference_no),
        },
        {
            title: "Budget Name",
            dataIndex: "budget_name",
            key: "budget_name",
            width: 180,
            render: (text) => (
                <Tooltip title={text} placement="topLeft">
                    <div className="line-clamp-2 font-medium">
                        {text}
                    </div>
                </Tooltip>
            ),
            sorter: (a, b) => a.budget_name.localeCompare(b.budget_name),
        },
        {
            title: "Category",
            dataIndex: "budget_category",
            key: "category",
            width: 140,
            render: (category) => (
                <Tag color="blue" className="font-medium">
                    {category}
                </Tag>
            ),
            sorter: (a, b) => a.budget_category.localeCompare(b.budget_category),
        },
        {
            title: "Department",
            dataIndex: "department",
            key: "department",
            width: 120,
            render: (dept) => <Tag color="cyan">{dept}</Tag>,
            sorter: (a, b) => a.department.localeCompare(b.department),
        },
        {
            title: "Requested By",
            dataIndex: "requested_by",
            key: "requested_by",
            width: 140,
            sorter: (a, b) => a.requested_by.localeCompare(b.requested_by),
        },
        {
            title: "Total Amount",
            dataIndex: "total_amount",
            key: "total_amount",
            width: 140,
            render: (amount) => (
                <span className="font-semibold text-gray-900">
                    {formatCurrency(amount)}
                </span>
            ),
            sorter: (a, b) => a.total_amount - b.total_amount,
        },
        {
            title: "Utilized",
            dataIndex: "utilized_amount",
            key: "utilized_amount",
            width: 130,
            render: (amount) => formatCurrency(amount),
            sorter: (a, b) => a.utilized_amount - b.utilized_amount,
        },
        {
            title: "Remaining",
            dataIndex: "remaining_amount",
            key: "remaining_amount",
            width: 130,
            render: (amount, record) => (
                <span className={amount < record.total_amount * 0.1 ? 'text-red-600 font-semibold' : 'text-green-600'}>
                    {formatCurrency(amount)}
                </span>
            ),
            sorter: (a, b) => a.remaining_amount - b.remaining_amount,
        },
        {
            title: "Utilization Rate",
            dataIndex: "utilization_rate",
            key: "utilization_rate",
            width: 150,
            render: (rate) => (
                <div className="flex items-center gap-2">
                    <Progress
                        percent={Math.round(rate)}
                        size="small"
                        strokeColor={getUtilizationColor(rate)}
                        showInfo={false}
                    />
                    <span className="text-xs font-medium min-w-[35px]">
                        {Math.round(rate)}%
                    </span>
                </div>
            ),
            sorter: (a, b) => a.utilization_rate - b.utilization_rate,
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
            width: 110,
            render: (priority) => (
                <Tag color={getPriorityColor(priority)} className="capitalize">
                    {priority}
                </Tag>
            ),
            sorter: (a, b) => a.priority.localeCompare(b.priority),
        },
        {
            title: "Fiscal Year",
            dataIndex: "fiscal_year",
            key: "fiscal_year",
            width: 100,
            render: (year) => <Tag color="purple">{year}</Tag>,
        },
        {
            title: "Created Date",
            dataIndex: "created_at",
            key: "created_at",
            width: 150,
            render: (date) => dayjs(date).format('MMM DD, YYYY'),
            sorter: (a, b) => dayjs(a.created_at).unix() - dayjs(b.created_at).unix(),
        },
        {
            title: "Actions",
            key: "actions",
            width: 100,
            fixed: "right",
            render: (_, record) => (
                <Tooltip title="View budget details">
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

    // Get unique categories and departments for filters
    const uniqueCategories = [...new Set(data.map(item => item.budget_category))];
    const uniqueDepartments = [...new Set(data.map(item => item.department))];

    return (
        <div className="w-full px-6 py-4 rounded-lg shadow-sm">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
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
                        className="text-sm"
                    />
                    <h1 className="text-2xl font-bold text-gray-900 mt-2">Budget Tracking History</h1>
                </div>
            </div>

            {/* Statistics Cards */}
            <Row gutter={16} className="mb-6">
                <Col span={4}>
                    <Card>
                        <Statistic
                            title="Total Budgets"
                            value={stats.total_budgets}
                            valueStyle={{ color: '#3f51b5' }}
                            prefix={<PieChartOutlined />}
                        />
                    </Card>
                </Col>
                <Col span={4}>
                    <Card>
                        <Statistic
                            title="Total Allocated"
                            value={stats.total_allocated}
                            valueStyle={{ color: '#4caf50' }}
                            prefix={<DollarOutlined />}
                            formatter={value => formatCurrency(Number(value))}
                        />
                    </Card>
                </Col>
                <Col span={4}>
                    <Card>
                        <Statistic
                            title="Total Utilized"
                            value={stats.total_utilized}
                            valueStyle={{ color: '#ff9800' }}
                            prefix={<DollarOutlined />}
                            formatter={value => formatCurrency(Number(value))}
                        />
                    </Card>
                </Col>
                <Col span={4}>
                    <Card>
                        <Statistic
                            title="Avg. Utilization"
                            value={stats.average_utilization}
                            valueStyle={{ color: '#9c27b0' }}
                            suffix="%"
                        />
                    </Card>
                </Col>
                <Col span={4}>
                    <Card>
                        <Statistic
                            title="Pending Approvals"
                            value={stats.pending_approvals}
                            valueStyle={{ color: '#f44336' }}
                        />
                    </Card>
                </Col>
                <Col span={4}>
                    <Card>
                        <Statistic
                            title="Approved Budgets"
                            value={stats.approved_budgets}
                            valueStyle={{ color: '#4caf50' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Toolbar Section */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
                <Alert
                    message="Comprehensive history of all budget allocations and expenditures. Track utilization, monitor approvals, and analyze financial performance."
                    type="info"
                    showIcon
                    className="w-full lg:w-auto rounded-lg"
                />

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto">
                    <Input.Search
                        allowClear
                        onChange={(e) => setSearchText(e.target.value)}
                        placeholder="Search budgets..."
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
                        <Option value="approved">Approved</Option>
                        <Option value="pending">Pending</Option>
                        <Option value="under_review">Under Review</Option>
                        <Option value="rejected">Rejected</Option>
                        <Option value="completed">Completed</Option>
                    </Select>

                    <Select
                        value={categoryFilter}
                        onChange={setCategoryFilter}
                        className="w-full lg:w-40"
                        placeholder="Category"
                    >
                        <Option value="all">All Categories</Option>
                        {uniqueCategories.map(category => (
                            <Option key={category} value={category}>{category}</Option>
                        ))}
                    </Select>

                    <Select
                        value={departmentFilter}
                        onChange={setDepartmentFilter}
                        className="w-full lg:w-40"
                        placeholder="Department"
                    >
                        <Option value="all">All Departments</Option>
                        {uniqueDepartments.map(dept => (
                            <Option key={dept} value={dept}>{dept}</Option>
                        ))}
                    </Select>

                    <Button
                        onClick={() => {
                            setDateRange(null);
                            setStatusFilter('all');
                            setCategoryFilter('all');
                            setDepartmentFilter('all');
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
                        tip="Loading budget history..."
                        indicator={<LoadingOutlined style={{ fontSize: 36 }} spin />}
                    />
                </div>
            ) : (
                <Table<BudgetHistoryDataType>
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
                                Showing {range[0]}-{range[1]} of {total} budget records
                            </span>
                        ),
                    }}
                    locale={{
                        emptyText: (
                            <div className="py-12 flex flex-col items-center">
                                <FileSearchOutlined className="text-3xl text-gray-400 mb-3" />
                                <p className="text-gray-500 mb-2 text-base">No budget history found</p>
                                <p className="text-gray-400 text-sm mb-4">Adjust your filters or create new budget requests</p>
                            </div>
                        )
                    }}
                />
            )}

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
                                    <span>{selectedRecord.reference_no}</span>
                                </div>
                                <span className="text-gray-400">•</span>
                                <div className="flex items-center gap-1">
                                    <span className="font-medium text-gray-700">Category:</span>
                                    <Tag color="blue">{selectedRecord.budget_category}</Tag>
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
                        {/* Budget Overview */}
                        <Row gutter={16}>
                            <Col span={12}>
                                <Card size="small" title="Budget Information">
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Budget Name:</span>
                                            <span className="font-medium">{selectedRecord.budget_name}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Department:</span>
                                            <Tag color="cyan">{selectedRecord.department}</Tag>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Fiscal Year:</span>
                                            <Tag color="purple">{selectedRecord.fiscal_year}</Tag>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Priority:</span>
                                            <Tag color={getPriorityColor(selectedRecord.priority)}>
                                                {selectedRecord.priority}
                                            </Tag>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Requested By:</span>
                                            <span>{selectedRecord.requested_by}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Approved By:</span>
                                            <span>{selectedRecord.approved_by}</span>
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
                                                {formatCurrency(selectedRecord.total_amount)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Utilized Amount:</span>
                                            <span className="font-medium text-orange-600">
                                                {formatCurrency(selectedRecord.utilized_amount)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Remaining Balance:</span>
                                            <span className={`font-semibold ${selectedRecord.remaining_amount < selectedRecord.total_amount * 0.1
                                                    ? 'text-red-600'
                                                    : 'text-green-600'
                                                }`}>
                                                {formatCurrency(selectedRecord.remaining_amount)}
                                            </span>
                                        </div>
                                        <Divider className="my-2" />
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span>Utilization Rate:</span>
                                                <span className="font-semibold">{Math.round(selectedRecord.utilization_rate)}%</span>
                                            </div>
                                            <Progress
                                                percent={Math.round(selectedRecord.utilization_rate)}
                                                strokeColor={getUtilizationColor(selectedRecord.utilization_rate)}
                                                size="small"
                                            />
                                        </div>
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
                                                {dayjs(selectedRecord.created_at).format('MMM DD, YYYY HH:mm')}
                                            </p>
                                        </Timeline.Item>
                                        <Timeline.Item color="blue">
                                            <p className="font-medium">Approval Process</p>
                                            <p className="text-sm text-gray-500">
                                                {selectedRecord.approved_at
                                                    ? `Approved on ${dayjs(selectedRecord.approved_at).format('MMM DD, YYYY')}`
                                                    : 'Pending approval'
                                                }
                                            </p>
                                        </Timeline.Item>
                                        <Timeline.Item color="orange">
                                            <p className="font-medium">Active Period</p>
                                            <p className="text-sm text-gray-500">
                                                {dayjs(selectedRecord.start_date).format('MMM DD, YYYY')} - {dayjs(selectedRecord.end_date).format('MMM DD, YYYY')}
                                            </p>
                                        </Timeline.Item>
                                        {selectedRecord.status === 'completed' && (
                                            <Timeline.Item color="green">
                                                <p className="font-medium">Budget Closed</p>
                                                <p className="text-sm text-gray-500">
                                                    Final utilization: {Math.round(selectedRecord.utilization_rate)}%
                                                </p>
                                            </Timeline.Item>
                                        )}
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