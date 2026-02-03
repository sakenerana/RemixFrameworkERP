import { GlobalOutlined, LoadingOutlined, DollarOutlined, CheckCircleOutlined } from "@ant-design/icons";
import {
  Alert,
  Button,
  Card,
  Row,
  Tag,
  message,
  Skeleton,
  Spin,
  Table,
  Progress,
  Tooltip,
  Statistic,
  Timeline,
  Badge,
  Select,
  DatePicker,
  Input,
  Modal,
} from "antd";
import { useEffect, useMemo, useState } from "react";
import { 
  AiOutlineDollar,
  AiOutlineCheckCircle,
  AiOutlineClockCircle,
  AiOutlineFileText,
  AiOutlinePercentage,
  AiOutlineRise,
  AiOutlineFall,
  AiOutlineInfoCircle,
  AiOutlineBarChart,
  AiOutlineCalendar,
  AiOutlineUser,
  AiOutlineBank,
  AiOutlineCreditCard,
  AiOutlineSafety
} from "react-icons/ai";
import { RiCircleFill } from "react-icons/ri";
import { 
  MdOutlinePendingActions,
  MdOutlineApproval,
  MdOutlineCancel,
  MdOutlineAttachMoney,
  MdOutlinePaid
} from "react-icons/md";
import { BsCashCoin, BsBank } from "react-icons/bs";
import { GiTakeMyMoney, GiMoneyStack } from "react-icons/gi";
import { TbReceipt } from "react-icons/tb";
import { FiUpload, FiDownload } from "react-icons/fi";
import AreaChart from "~/components/area_chart";
import { ProtectedRoute } from "~/components/ProtectedRoute";

const { RangePicker } = DatePicker;
const { Search } = Input;

// Language content
const translations = {
  en: {
    dashboardTitle: "Loan Release Dashboard",
    alertMessage: "Monitor loan disbursement, release status, and payment processing activities.",
    totalLoans: "Total Loans",
    pendingRelease: "Pending Release",
    releasedToday: "Released Today",
    totalReleased: "Total Released",
    releaseRate: "Release Rate",
    avgReleaseTime: "Avg. Release Time",
    switchToFilipino: "Switch to Filipino",
    switchToEnglish: "Switch to English",
    pendingReleases: "Pending Loan Releases",
    releaseProcessing: "Release Processing Status",
    loanBreakdown: "Loan Type Breakdown",
    monthlyTrend: "Monthly Release Trend",
    quickActions: "Quick Actions",
    viewAll: "View All",
    processNow: "Process Now",
    days: "days",
    hours: "hours",
    loans: "loans",
    members: "members",
    pending: "Pending",
    released: "Released",
    cancelled: "Cancelled",
    processing: "Processing",
    releaseTime: "Release Time",
    loanApplications: "Loan Applications",
    activeLoans: "Active Loans",
    loanApprovalRate: "Approval Rate",
    totalLoanAmount: "Total Amount",
    releaseSchedule: "Release Schedule",
    recentReleases: "Recent Releases",
    upcomingReleases: "Upcoming Releases",
    releaseDetails: "Release Details",
    amount: "Amount",
    borrower: "Borrower",
    status: "Status",
    releaseDate: "Release Date",
    action: "Action",
    approve: "Approve",
    reject: "Reject",
    view: "View",
    filterByStatus: "Filter by Status",
    searchLoan: "Search loan...",
    selectDateRange: "Select Date Range",
    demoMode: "Demo Mode",
  },
  fil: {
    dashboardTitle: "Dashboard ng Pag-release ng Loan",
    alertMessage: "Subaybayan ang paglabas ng loan, status ng release, at mga aktibidad sa pagproseso ng bayad.",
    totalLoans: "Kabuuang Loan",
    pendingRelease: "Nakahintay sa Release",
    releasedToday: "Nairelease Ngayon",
    totalReleased: "Kabuuang Nirelease",
    releaseRate: "Rate ng Release",
    avgReleaseTime: "Avg. Oras ng Release",
    switchToFilipino: "Palitan sa Filipino",
    switchToEnglish: "Palitan sa Ingles",
    pendingReleases: "Mga Nakahintay na Release ng Loan",
    releaseProcessing: "Status ng Pagproseso ng Release",
    loanBreakdown: "Pagkakahati ng Uri ng Loan",
    monthlyTrend: "Trend ng Buwanang Release",
    quickActions: "Mabilisang Mga Aksyon",
    viewAll: "Tingnan Lahat",
    processNow: "Proseso Ngayon",
    days: "araw",
    hours: "oras",
    loans: "mga loan",
    members: "mga miyembro",
    pending: "Nakahintay",
    released: "Nairelease",
    cancelled: "Nakansela",
    processing: "Pinoproseso",
    releaseTime: "Oras ng Release",
    loanApplications: "Mga Aplikasyon sa Loan",
    activeLoans: "Mga Aktibong Loan",
    loanApprovalRate: "Rate ng Pag-apruba",
    totalLoanAmount: "Kabuuang Halaga",
    releaseSchedule: "Iskedyul ng Release",
    recentReleases: "Mga Kamakailang Release",
    upcomingReleases: "Mga Darating na Release",
    releaseDetails: "Mga Detalye ng Release",
    amount: "Halaga",
    borrower: "Nanghiram",
    status: "Status",
    releaseDate: "Petsa ng Release",
    action: "Aksyon",
    approve: "Aprubahan",
    reject: "Tanggihan",
    view: "Tingnan",
    filterByStatus: "Salain ayon sa Status",
    searchLoan: "Maghanap ng loan...",
    selectDateRange: "Pumili ng Saklaw ng Petsa",
    demoMode: "Demo Mode",
  }
};

// Mock data generators
const generateMockLoanData = () => {
  const loanTypes = ['Personal Loan', 'Business Loan', 'Emergency Loan', 'Education Loan', 'Housing Loan'];
  const firstNames = ['John', 'Maria', 'Carlos', 'Sophia', 'James', 'Anna', 'Michael', 'Elena'];
  const lastNames = ['Doe', 'Santos', 'Cruz', 'Reyes', 'Garcia', 'Torres', 'Rivera', 'Lim'];
  const statuses = ['PENDING_RELEASE', 'APPROVED', 'RELEASED', 'CANCELLED', 'PROCESSING'];
  const releaseMethods = ['Bank Transfer', 'Cash', 'Check', 'GCash', 'PayMaya'];
  
  return Array.from({ length: 35 }, (_, i) => ({
    id: `LNRL${String(i + 1).padStart(4, '0')}`,
    loanNumber: `LOAN-${String(i + 1).padStart(4, '0')}`,
    borrowerName: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
    loanType: loanTypes[Math.floor(Math.random() * loanTypes.length)],
    amount: Math.floor(Math.random() * 200000) + 10000,
    approvedDate: new Date(Date.now() - Math.random() * 15 * 24 * 60 * 60 * 1000).toISOString(),
    scheduledRelease: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    actualRelease: Math.random() > 0.7 ? new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000).toISOString() : null,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    releaseMethod: releaseMethods[Math.floor(Math.random() * releaseMethods.length)],
    processingTime: Math.floor(Math.random() * 72) + 2, // 2-74 hours
    bankAccount: `BDO-${Math.floor(Math.random() * 9999999999)}`,
    contactNumber: `09${Math.floor(Math.random() * 900000000) + 100000000}`,
  }));
};

const generateMockReleaseSchedule = () => {
  return Array.from({ length: 8 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return {
      id: `SCH${String(i + 1).padStart(3, '0')}`,
      date: date.toISOString(),
      scheduledCount: Math.floor(Math.random() * 15) + 5,
      releasedCount: i === 0 ? Math.floor(Math.random() * 5) + 1 : Math.floor(Math.random() * 15),
      totalAmount: Math.floor(Math.random() * 5000000) + 1000000,
    };
  });
};

// Mock data for charts
const monthlyReleaseData = [
  { date: '2025-01-01', value: 12, category: 'Personal Loan' },
  { date: '2025-01-02', value: 15, category: 'Personal Loan' },
  { date: '2025-01-03', value: 18, category: 'Personal Loan' },
  { date: '2025-01-04', value: 14, category: 'Personal Loan' },
  { date: '2025-01-05', value: 16, category: 'Personal Loan' },
  { date: '2025-01-01', value: 8, category: 'Business Loan' },
  { date: '2025-01-02', value: 10, category: 'Business Loan' },
  { date: '2025-01-03', value: 12, category: 'Business Loan' },
  { date: '2025-01-04', value: 9, category: 'Business Loan' },
  { date: '2025-01-05', value: 11, category: 'Business Loan' },
  { date: '2025-01-01', value: 5, category: 'Emergency Loan' },
  { date: '2025-01-02', value: 7, category: 'Emergency Loan' },
  { date: '2025-01-03', value: 6, category: 'Emergency Loan' },
  { date: '2025-01-04', value: 8, category: 'Emergency Loan' },
  { date: '2025-01-05', value: 7, category: 'Emergency Loan' },
];

export default function PerformanceReportDashboard() {
  const [loanData, setLoanData] = useState<any[]>([]);
  const [releaseSchedule, setReleaseSchedule] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<'en' | 'fil'>('en');
  const [t, setT] = useState(translations.en);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState<any>(null);
  const [selectedLoan, setSelectedLoan] = useState<any>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  
  // Statistics states
  const [totalLoans, setTotalLoans] = useState(0);
  const [pendingRelease, setPendingRelease] = useState(0);
  const [releasedToday, setReleasedToday] = useState(0);
  const [totalReleased, setTotalReleased] = useState(0);
  const [releaseRate, setReleaseRate] = useState(0);
  const [avgReleaseTime, setAvgReleaseTime] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [processingLoans, setProcessingLoans] = useState(0);
  const [cancelledLoans, setCancelledLoans] = useState(0);
  
  // Recent releases for table
  const [recentReleases, setRecentReleases] = useState<any[]>([]);
  const [pendingReleases, setPendingReleases] = useState<any[]>([]);

  // Table columns
  const loanColumns = [
    {
      title: 'Loan Number',
      dataIndex: 'loanNumber',
      key: 'loanNumber',
      render: (text: string) => <span className="font-mono">{text}</span>,
    },
    {
      title: t.borrower,
      dataIndex: 'borrowerName',
      key: 'borrowerName',
    },
    {
      title: 'Loan Type',
      dataIndex: 'loanType',
      key: 'loanType',
      render: (type: string) => (
        <Tag color={
          type.includes('Personal') ? 'blue' : 
          type.includes('Business') ? 'green' : 
          type.includes('Emergency') ? 'red' : 
          type.includes('Education') ? 'orange' : 'purple'
        }>
          {type}
        </Tag>
      ),
    },
    {
      title: t.amount,
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => (
        <span className="font-semibold">
          ₱{amount.toLocaleString()}
        </span>
      ),
    },
    {
      title: t.status,
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusConfig: Record<string, { color: string, icon: React.ReactNode, text: string }> = {
          'PENDING_RELEASE': { color: 'orange', icon: <AiOutlineClockCircle />, text: 'Pending Release' },
          'APPROVED': { color: 'blue', icon: <MdOutlineApproval />, text: 'Approved' },
          'RELEASED': { color: 'green', icon: <AiOutlineCheckCircle />, text: 'Released' },
          'CANCELLED': { color: 'red', icon: <MdOutlineCancel />, text: 'Cancelled' },
          'PROCESSING': { color: 'gold', icon: <MdOutlinePendingActions />, text: 'Processing' },
        };
        const config = statusConfig[status] || { color: 'default', icon: null, text: status };
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.text}
          </Tag>
        );
      },
    },
    {
      title: 'Release Method',
      dataIndex: 'releaseMethod',
      key: 'releaseMethod',
      render: (method: string) => (
        <span className="text-sm">{method}</span>
      ),
    },
    {
      title: t.action,
      key: 'action',
      render: (_: any, record: any) => (
        <div className="flex gap-1">
          {record.status === 'PENDING_RELEASE' && (
            <>
              <Button size="small" type="primary" onClick={() => handleApprove(record)}>
                {t.approve}
              </Button>
              <Button size="small" danger onClick={() => handleReject(record)}>
                {t.reject}
              </Button>
            </>
          )}
          <Button size="small" type="link" onClick={() => handleViewDetails(record)}>
            {t.view}
          </Button>
        </div>
      ),
    },
  ];

  // Toggle language
  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'fil' : 'en';
    setLanguage(newLanguage);
    setT(translations[newLanguage]);
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "PHP",
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-PH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Mock service functions
  const mockFetchLoanData = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = generateMockLoanData();
        resolve({ data });
      }, 1200);
    });
  };

  const mockFetchReleaseSchedule = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = generateMockReleaseSchedule();
        resolve({ data });
      }, 800);
    });
  };

  // Fetch loan data
  const fetchLoanData = async () => {
    try {
      const response: any = await mockFetchLoanData();
      const data = response.data || [];
      setLoanData(data);
      
      // Calculate statistics
      const total = data.length || 0;
      const pending = data.filter((loan: any) => 
        loan.status === 'PENDING_RELEASE'
      ).length || 0;
      const released = data.filter((loan: any) => 
        loan.status === 'RELEASED'
      ).length || 0;
      
      // Released today
      const today = new Date().toDateString();
      const releasedTodayCount = data.filter((loan: any) => {
        if (!loan.actualRelease) return false;
        const releaseDate = new Date(loan.actualRelease).toDateString();
        return loan.status === 'RELEASED' && releaseDate === today;
      }).length || 0;
      
      const rate = total > 0 ? (released / total) * 100 : 0;
      
      // Calculate average release time (from approval to release)
      const releasedLoans = data.filter((loan: any) => 
        loan.status === 'RELEASED' && loan.approvedDate && loan.actualRelease
      );
      const totalHours = releasedLoans.reduce((sum: number, loan: any) => {
        const approved = new Date(loan.approvedDate).getTime();
        const released = new Date(loan.actualRelease).getTime();
        return sum + ((released - approved) / (1000 * 60 * 60));
      }, 0);
      const avgTime = releasedLoans.length > 0 ? totalHours / releasedLoans.length : 0;
      
      // Total amount
      const totalAmount = data.reduce((sum: number, loan: any) => 
        sum + (loan.amount || 0), 0) || 0;
      
      // Other stats
      const processing = data.filter((loan: any) => 
        loan.status === 'PROCESSING'
      ).length || 0;
      const cancelled = data.filter((loan: any) => 
        loan.status === 'CANCELLED'
      ).length || 0;
      
      setTotalLoans(total);
      setPendingRelease(pending);
      setReleasedToday(releasedTodayCount);
      setTotalReleased(released);
      setReleaseRate(Math.round(rate));
      setAvgReleaseTime(Math.round(avgTime));
      setTotalAmount(totalAmount);
      setProcessingLoans(processing);
      setCancelledLoans(cancelled);
      
      // Set recent releases (released in last 3 days)
      const recent = data
        .filter((loan: any) => loan.status === 'RELEASED')
        .sort((a: any, b: any) => new Date(b.actualRelease).getTime() - new Date(a.actualRelease).getTime())
        .slice(0, 6)
        .map((loan: any) => ({
          id: loan.id,
          loanNumber: loan.loanNumber,
          borrowerName: loan.borrowerName,
          amount: loan.amount,
          releaseDate: loan.actualRelease,
          releaseMethod: loan.releaseMethod,
        }));
      setRecentReleases(recent);
      
      // Set pending releases
      const pendingReleases = data
        .filter((loan: any) => loan.status === 'PENDING_RELEASE')
        .slice(0, 10);
      setPendingReleases(pendingReleases);
      
    } catch (error) {
      setError("Failed to load loan data");
      console.error("Error fetching loan data:", error);
    }
  };

  // Fetch release schedule
  const fetchReleaseSchedule = async () => {
    try {
      const response: any = await mockFetchReleaseSchedule();
      setReleaseSchedule(response.data || []);
    } catch (error) {
      console.error("Error fetching release schedule:", error);
    }
  };

  // Fetch all data
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        await Promise.all([
          fetchLoanData(),
          fetchReleaseSchedule()
        ]);
      } catch (error) {
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Filter loans based on status and search
  const filteredLoans = useMemo(() => {
    let filtered = [...loanData];
    
    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(loan => loan.status === selectedStatus);
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(loan =>
        loan.loanNumber.toLowerCase().includes(term) ||
        loan.borrowerName.toLowerCase().includes(term) ||
        loan.loanType.toLowerCase().includes(term)
      );
    }
    
    // Filter by date range
    if (dateRange && dateRange[0] && dateRange[1]) {
      const startDate = dateRange[0].startOf('day');
      const endDate = dateRange[1].endOf('day');
      
      filtered = filtered.filter(loan => {
        const loanDate = new Date(loan.scheduledRelease);
        return loanDate >= startDate && loanDate <= endDate;
      });
    }
    
    return filtered;
  }, [loanData, selectedStatus, searchTerm, dateRange]);

  // Calculate loan type breakdown
  const loanTypeBreakdown = useMemo(() => {
    const breakdown: Record<string, number> = {};
    
    loanData.forEach(loan => {
      breakdown[loan.loanType] = (breakdown[loan.loanType] || 0) + 1;
    });
    
    return Object.entries(breakdown)
      .filter(([_, count]) => count > 0)
      .map(([type, count]) => ({
        type,
        value: count,
      }));
  }, [loanData]);

  // Handle actions
  const handleApprove = (loan: any) => {
    Modal.confirm({
      title: 'Confirm Loan Release',
      content: `Are you sure you want to release ${formatCurrency(loan.amount)} to ${loan.borrowerName}?`,
      okText: 'Release Now',
      cancelText: 'Cancel',
      onOk: () => {
        message.success(`Loan ${loan.loanNumber} released successfully`);
        // In real app, update status via API
      },
    });
  };

  const handleReject = (loan: any) => {
    Modal.confirm({
      title: 'Reject Loan Release',
      content: `Are you sure you want to reject the release of ${formatCurrency(loan.amount)} to ${loan.borrowerName}?`,
      okText: 'Reject',
      cancelText: 'Cancel',
      okType: 'danger',
      onOk: () => {
        message.warning(`Loan ${loan.loanNumber} release rejected`);
        // In real app, update status via API
      },
    });
  };

  const handleViewDetails = (loan: any) => {
    setSelectedLoan(loan);
    setIsModalVisible(true);
  };

  const handleReleaseAllPending = () => {
    const pendingCount = pendingReleases.length;
    if (pendingCount === 0) {
      message.info('No pending releases to process');
      return;
    }
    
    Modal.confirm({
      title: 'Release All Pending Loans',
      content: `Are you sure you want to release all ${pendingCount} pending loans?`,
      okText: 'Release All',
      cancelText: 'Cancel',
      onOk: () => {
        message.success(`Released ${pendingCount} loans successfully`);
        // In real app, update all pending loans via API
      },
    });
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'PENDING_RELEASE': return 'orange';
      case 'APPROVED': return 'blue';
      case 'RELEASED': return 'green';
      case 'CANCELLED': return 'red';
      case 'PROCESSING': return 'gold';
      default: return 'default';
    }
  };

  return (
    <ProtectedRoute>
      <div className="p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{t.dashboardTitle}</h1>
            <Tag color="blue" className="mt-1">
              {t.demoMode}
            </Tag>
          </div>
          <div className="flex items-center gap-4">
            <Button type="default" onClick={toggleLanguage} icon={<GlobalOutlined />}>
              {language === 'en' ? t.switchToFilipino : t.switchToEnglish}
            </Button>
            <Button type="primary" icon={<GiTakeMyMoney />}>
              New Release
            </Button>
          </div>
        </div>

        {/* Alert Banner */}
        <Alert
          message={t.alertMessage}
          type="info"
          showIcon
          className="mb-6"
        />

        {/* Filters */}
        <Card className="mb-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <Search
                placeholder={t.searchLoan}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                allowClear
              />
            </div>
            <Select
              value={selectedStatus}
              onChange={setSelectedStatus}
              className="w-48"
              placeholder={t.filterByStatus}
            >
              <Select.Option value="all">All Status</Select.Option>
              <Select.Option value="PENDING_RELEASE">Pending Release</Select.Option>
              <Select.Option value="APPROVED">Approved</Select.Option>
              <Select.Option value="RELEASED">Released</Select.Option>
              <Select.Option value="PROCESSING">Processing</Select.Option>
              <Select.Option value="CANCELLED">Cancelled</Select.Option>
            </Select>
            <RangePicker
              placeholder={[t.selectDateRange, t.selectDateRange]}
              value={dateRange}
              onChange={setDateRange}
              className="w-64"
            />
            <Button onClick={() => {
              setSelectedStatus('all');
              setSearchTerm('');
              setDateRange(null);
            }}>
              Clear Filters
            </Button>
          </div>
        </Card>

        {/* First Row - Key Statistics */}
        <Row gutter={[16, 16]} className="mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-4 w-full">
            
            {/* Total Loans */}
            <Card className="rounded-lg shadow-sm border-0">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-2">{t.totalLoans}</p>
                  <p className="text-2xl font-bold">{loading ? "-" : totalLoans}</p>
                  {!loading && (
                    <div className="flex items-center mt-2">
                      <AiOutlineRise className="text-green-500 mr-1" />
                      <span className="text-xs text-gray-500">+8% from last month</span>
                    </div>
                  )}
                </div>
                <div className="p-3 rounded-full bg-blue-100">
                  <GiTakeMyMoney className="text-2xl text-blue-600" />
                </div>
              </div>
              {loading && <Skeleton.Input active size="small" className="mt-2" />}
            </Card>

            {/* Pending Release */}
            <Card className="rounded-lg shadow-sm border-0">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-2">{t.pendingRelease}</p>
                  <p className="text-2xl font-bold text-orange-500">
                    {loading ? "-" : pendingRelease}
                  </p>
                  {!loading && totalLoans > 0 && (
                    <div className="mt-2">
                      <Progress 
                        percent={totalLoans > 0 ? Math.round((pendingRelease / totalLoans) * 100) : 0} 
                        size="small" 
                        strokeColor="#ff9a9e"
                        showInfo={false}
                      />
                    </div>
                  )}
                </div>
                <div className="p-3 rounded-full bg-orange-100">
                  <AiOutlineClockCircle className="text-2xl text-orange-600" />
                </div>
              </div>
              {loading && <Skeleton.Input active size="small" className="mt-2" />}
            </Card>

            {/* Released Today */}
            <Card className="rounded-lg shadow-sm border-0">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-2">{t.releasedToday}</p>
                  <p className="text-2xl font-bold text-green-500">
                    {loading ? "-" : releasedToday}
                  </p>
                  {!loading && releasedToday > 0 && (
                    <div className="flex items-center mt-2">
                      <AiOutlineCheckCircle className="text-green-500 mr-1" />
                      <span className="text-xs text-gray-500">
                        ₱{recentReleases.reduce((sum, loan) => sum + loan.amount, 0).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-3 rounded-full bg-green-100">
                  <MdOutlinePaid className="text-2xl text-green-600" />
                </div>
              </div>
              {loading && <Skeleton.Input active size="small" className="mt-2" />}
            </Card>

            {/* Total Released */}
            <Card className="rounded-lg shadow-sm border-0">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-2">{t.totalReleased}</p>
                  <p className="text-2xl font-bold text-purple-500">
                    {loading ? "-" : totalReleased}
                  </p>
                  {!loading && totalReleased > 0 && (
                    <div className="mt-2">
                      <Progress 
                        percent={releaseRate} 
                        size="small" 
                        strokeColor="#9c27b0"
                        status="active"
                      />
                    </div>
                  )}
                </div>
                <div className="p-3 rounded-full bg-purple-100">
                  <GiMoneyStack className="text-2xl text-purple-600" />
                </div>
              </div>
              {loading && <Skeleton.Input active size="small" className="mt-2" />}
            </Card>

            {/* Avg Release Time */}
            <Card className="rounded-lg shadow-sm border-0">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-2">{t.avgReleaseTime}</p>
                  <p className="text-2xl font-bold text-cyan-500">
                    {loading ? "-" : `${avgReleaseTime} ${t.hours}`}
                  </p>
                  {!loading && avgReleaseTime > 0 && (
                    <div className="flex items-center mt-2">
                      <AiOutlineClockCircle className="text-cyan-500 mr-1" />
                      <span className="text-xs text-gray-500">Processing efficiency</span>
                    </div>
                  )}
                </div>
                <div className="p-3 rounded-full bg-cyan-100">
                  <AiOutlineCalendar className="text-2xl text-cyan-600" />
                </div>
              </div>
              {loading && <Skeleton.Input active size="small" className="mt-2" />}
            </Card>

          </div>
        </Row>

        {/* Second Row - Charts and Tables */}
        <Row gutter={[16, 16]} className="mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
            
            {/* Monthly Release Trend */}
            <Card 
              title={
                <div className="flex items-center">
                  <RiCircleFill className="text-green-500 text-xs mr-2" />
                  <span>{t.monthlyTrend}</span>
                </div>
              }
              className="rounded-lg shadow-sm"
              extra={
                <Button type="text" size="small">
                  {t.viewAll}
                </Button>
              }
            >
              {loading ? (
                <div className="h-64 flex items-center justify-center">
                  <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
                </div>
              ) : (
                <div className="h-64">
                  <AreaChart 
                    data={monthlyReleaseData} 
                  />
                </div>
              )}
            </Card>

            {/* Loan Type Breakdown */}
            <Card 
              title={
                <div className="flex items-center">
                  <RiCircleFill className="text-blue-500 text-xs mr-2" />
                  <span>{t.loanBreakdown}</span>
                </div>
              }
              className="rounded-lg shadow-sm"
            >
              {loading ? (
                <Skeleton active paragraph={{ rows: 4 }} />
              ) : loanTypeBreakdown.length > 0 ? (
                <div className="space-y-4">
                  {loanTypeBreakdown.map((type, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-2"
                          style={{
                            backgroundColor: [
                              '#3f51b5', 
                              '#4caf50', 
                              '#f44336', 
                              '#ff9800', 
                              '#9c27b0'
                            ][index % 5]
                          }}
                        />
                        <span>{type.type}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium mr-2">{type.value}</span>
                        <span className="text-gray-500 text-sm">
                          ({totalLoans > 0 ? Math.round((type.value / totalLoans) * 100) : 0}%)
                        </span>
                      </div>
                    </div>
                  ))}
                  
                  <div className="pt-4 border-t">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Total Amount Released:</span>
                      <span className="font-bold">{formatCurrency(totalAmount)}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span className="font-medium">Processing Loans:</span>
                      <span className="text-blue-600">{processingLoans} loans</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 text-center text-gray-400">
                  No loan type data available
                </div>
              )}
            </Card>

          </div>
        </Row>

        {/* Third Row - Tables */}
        <Row gutter={[16, 16]} className="mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
            
            {/* Pending Releases Table */}
            <Card 
              title={
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <RiCircleFill className="text-orange-500 text-xs mr-2" />
                    <span>{t.pendingReleases}</span>
                    <Badge count={pendingReleases.length} className="ml-2" />
                  </div>
                  <Button 
                    type="primary" 
                    size="small"
                    onClick={handleReleaseAllPending}
                    icon={<MdOutlinePaid />}
                  >
                    Release All
                  </Button>
                </div>
              }
              className="rounded-lg shadow-sm"
              extra={
                <Button type="text" size="small">
                  {t.viewAll}
                </Button>
              }
            >
              {loading ? (
                <Skeleton active paragraph={{ rows: 4 }} />
              ) : (
                <Table
                  columns={loanColumns}
                  dataSource={pendingReleases}
                  pagination={false}
                  size="small"
                  scroll={{ y: 300 }}
                  locale={{
                    emptyText: (
                      <div className="py-8 text-center text-gray-400">
                        <AiOutlineCheckCircle className="text-3xl mx-auto mb-2" />
                        <p>No pending releases</p>
                      </div>
                    )
                  }}
                />
              )}
            </Card>

            {/* Recent Releases */}
            <Card 
              title={
                <div className="flex items-center">
                  <RiCircleFill className="text-green-500 text-xs mr-2" />
                  <span>{t.recentReleases}</span>
                </div>
              }
              className="rounded-lg shadow-sm"
              extra={
                <Button type="text" size="small">
                  {t.viewAll}
                </Button>
              }
            >
              {loading ? (
                <Skeleton active paragraph={{ rows: 4 }} />
              ) : recentReleases.length > 0 ? (
                <div className="space-y-3">
                  {recentReleases.map((release, index) => (
                    <div key={index} className="p-3 border rounded-lg hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">{release.loanNumber}</div>
                          <div className="text-sm text-gray-600">{release.borrowerName}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">{formatCurrency(release.amount)}</div>
                          <div className="text-xs text-gray-500">
                            {formatDate(release.releaseDate)}
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <Tag color="green" icon={<AiOutlineCheckCircle />}>
                          Released
                        </Tag>
                        <span className="text-sm">{release.releaseMethod}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-400">
                  <AiOutlineFileText className="text-3xl mx-auto mb-2" />
                  <p>No recent releases</p>
                </div>
              )}
            </Card>

          </div>
        </Row>

        {/* Fourth Row - Schedule and Actions */}
        <Row gutter={[16, 16]}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
            
            {/* Release Schedule */}
            <Card 
              title={
                <div className="flex items-center">
                  <RiCircleFill className="text-purple-500 text-xs mr-2" />
                  <span>{t.releaseSchedule}</span>
                </div>
              }
              className="rounded-lg shadow-sm"
            >
              {loading ? (
                <Skeleton active paragraph={{ rows: 4 }} />
              ) : releaseSchedule.length > 0 ? (
                <Timeline>
                  {releaseSchedule.slice(0, 5).map((schedule, index) => (
                    <Timeline.Item
                      key={index}
                      dot={<RiCircleFill className="text-purple-500" />}
                      color="purple"
                    >
                      <div className="flex justify-between">
                        <div>
                          <div className="font-medium">
                            {formatDate(schedule.date)}
                          </div>
                          <div className="text-sm text-gray-600">
                            {schedule.scheduledCount} scheduled, {schedule.releasedCount} released
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">
                            {formatCurrency(schedule.totalAmount)}
                          </div>
                          <Progress 
                            percent={Math.round((schedule.releasedCount / schedule.scheduledCount) * 100)} 
                            size="small" 
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </Timeline.Item>
                  ))}
                </Timeline>
              ) : (
                <div className="p-4 text-center text-gray-400">
                  No schedule data available
                </div>
              )}
            </Card>

            {/* Quick Actions */}
            <Card 
              title={
                <div className="flex items-center">
                  <RiCircleFill className="text-blue-500 text-xs mr-2" />
                  <span>{t.quickActions}</span>
                </div>
              }
              className="rounded-lg shadow-sm"
            >
              <div className="space-y-3">
                <Button block icon={<GiTakeMyMoney />} type="primary">
                  Process New Release
                </Button>
                <Button block icon={<FiUpload />}>
                  Bulk Upload Releases
                </Button>
                <Button block icon={<TbReceipt />}>
                  Generate Release Reports
                </Button>
                <Button block icon={<FiDownload />}>
                  Export Release Data
                </Button>
                <Button block icon={<AiOutlineBank />}>
                  Bank Reconciliation
                </Button>
              </div>
            </Card>

            {/* Stats Summary */}
            <Card 
              title={
                <div className="flex items-center">
                  <RiCircleFill className="text-green-500 text-xs mr-2" />
                  <span>Release Statistics</span>
                </div>
              }
              className="rounded-lg shadow-sm"
            >
              <div className="space-y-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center">
                    <AiOutlineDollar className="text-blue-600 text-xl mr-3" />
                    <div>
                      <p className="font-medium">Total Amount Released</p>
                      <p className="text-2xl font-bold">{formatCurrency(totalAmount)}</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-gray-600">Success Rate</p>
                    <p className="text-xl font-bold text-green-600">{releaseRate}%</p>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <p className="text-sm text-gray-600">Avg. Time</p>
                    <p className="text-xl font-bold text-orange-600">{avgReleaseTime}h</p>
                  </div>
                </div>
                
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span>Processing:</span>
                    <span className="font-medium">{processingLoans}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span>Cancelled:</span>
                    <span className="font-medium text-red-600">{cancelledLoans}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span>Today's Target:</span>
                    <span className="font-medium text-green-600">15/20</span>
                  </div>
                </div>
              </div>
            </Card>

          </div>
        </Row>

        {/* Loan Details Modal */}
        <Modal
          title="Loan Release Details"
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={[
            <Button key="close" onClick={() => setIsModalVisible(false)}>
              Close
            </Button>,
            selectedLoan?.status === 'PENDING_RELEASE' && (
              <Button key="release" type="primary" onClick={() => handleApprove(selectedLoan)}>
                Release Now
              </Button>
            ),
          ]}
          width={600}
        >
          {selectedLoan && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Loan Number</p>
                  <p className="font-medium">{selectedLoan.loanNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Borrower</p>
                  <p className="font-medium">{selectedLoan.borrowerName}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Loan Type</p>
                  <Tag color="blue">{selectedLoan.loanType}</Tag>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <Tag color={getStatusColor(selectedLoan.status)}>
                    {selectedLoan.status.replace('_', ' ')}
                  </Tag>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Amount</p>
                  <p className="text-xl font-bold">{formatCurrency(selectedLoan.amount)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Release Method</p>
                  <p className="font-medium">{selectedLoan.releaseMethod}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Approved Date</p>
                  <p>{formatDate(selectedLoan.approvedDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Scheduled Release</p>
                  <p>{formatDate(selectedLoan.scheduledRelease)}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Bank Account</p>
                  <p className="font-mono">{selectedLoan.bankAccount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Contact Number</p>
                  <p>{selectedLoan.contactNumber}</p>
                </div>
              </div>
              
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium mb-2">Processing Information</p>
                <div className="flex justify-between text-sm">
                  <span>Processing Time:</span>
                  <span>{selectedLoan.processingTime} hours</span>
                </div>
              </div>
            </div>
          )}
        </Modal>

      </div>
    </ProtectedRoute>
  );
}