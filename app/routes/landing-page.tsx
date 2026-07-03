import React, { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { ConfigProvider, Layout, Avatar, message, Button } from 'antd';
import {
    Home,
    FileText,
    Building2,
    User,
    Mail,
    ContactRound,
    Warehouse,
    LogOut,
    BaggageClaim,
    ShieldCheck,
} from 'lucide-react';
import { FaDollarSign, FaFileAlt, FaRegUser } from 'react-icons/fa';
import { LuChartNoAxesColumn } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';
import MetricCard from '~/components/MetricCard';
import { useAuth } from '~/auth/AuthContext';
import { UserService } from '~/services/user.service';
import { BudgetService } from '~/services/budget.service';
import { LicenseService } from '~/services/license.service';
import { AssetService } from '~/services/asset.service';
import { AccessoryService } from '~/services/accessory.service';

const { Header, Content, Sider } = Layout;

const ACCESS = {
    inventory: 1,
    budget: 2,
    workflow: 3,
    admin: 4,
    ticketing: 5,
    performanceReport: 6,
    hr: 7,
    reports: 8,
} as const;

const INITIAL_ACCESS = {
    inventory: false,
    budget: false,
    workflow: false,
    admin: false,
    ticketing: false,
    performanceReport: false,
    hr: false,
    reports: false,
};

const INITIAL_TOTALS = {
    budgeted: 0,
    unbudgeted: 0,
    newMembership: 0,
    loanRelease: 0,
    collection: 0,
    workflowRequests: 0,
    licenses: 0,
    assets: 0,
    accessories: 0,
};

const LOCAL_STORAGE_KEYS = [
    'ab_id',
    'username',
    'dept',
    'fname',
    'lname',
    'userAuthID',
    'userDept',
    'userOffice',
    'userOfficeID',
    'workflowDashboardData',
    'userActivitiesData',
];

const CACHE_KEY_PREFIXES = [
    'budgetApproved_',
    'completedRequisition_',
    'userActiveActivities_',
];

const PROMO_LINKS = [
    {
        href: 'https://webportal.cficoop.com/',
        src: './img/cfi-bills-payment.jpg',
        alt: 'CFI Bills Payment',
        label: 'CFI Bills Payment Online',
    },
    {
        href: 'https://webportal.cficoop.com/',
        src: './img/cfi-cpp.jpg',
        alt: 'CFI CPP',
        label: 'CFI CPP Online',
    },
    {
        href: 'https://webportal.cficoop.com/',
        src: './img/cfionline.jpg',
        alt: 'CFI Online',
        label: 'CFI Online',
    },
];

type AccessState = typeof INITIAL_ACCESS;
type DashboardTotals = typeof INITIAL_TOTALS;

interface SidebarItemType {
    id: string;
    label: string;
    icon: React.ReactNode;
}

interface LandingUser {
    id: number | string;
    email?: string;
    username?: string;
    first_name?: string;
    last_name?: string;
    access?: string;
    ab_user_id?: number | string;
    department_id?: number | string;
    office?: {
        id?: number | string;
        name?: string;
    };
    departments?: {
        department?: string;
    };
}

interface DashboardMetric {
    title: string;
    link: string;
    data: Array<{ name: string; value: number; color: string }>;
    centerLabel: string;
    icon: React.ReactNode;
    legend: Array<{ label: string; value: string | number; color: string }>;
    isVisible: boolean;
    isLoading: boolean;
}

const formatCompactCurrency = (amount: number) =>
    new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
        notation: 'compact',
        maximumFractionDigits: 1,
    }).format(amount || 0);

const getAccessState = (access: string | undefined): AccessState => {
    try {
        const accessList = JSON.parse(access || '[]');
        const modules = Array.isArray(accessList) ? accessList.map(Number) : [];

        return {
            inventory: modules.includes(ACCESS.inventory),
            budget: modules.includes(ACCESS.budget),
            workflow: modules.includes(ACCESS.workflow),
            admin: modules.includes(ACCESS.admin),
            ticketing: modules.includes(ACCESS.ticketing),
            performanceReport: modules.includes(ACCESS.performanceReport),
            hr: modules.includes(ACCESS.hr),
            reports: modules.includes(ACCESS.reports),
        };
    } catch {
        return INITIAL_ACCESS;
    }
};

const persistUserSession = (userData: LandingUser) => {
    localStorage.setItem('userOfficeID', String(userData.office?.id ?? ''));
    localStorage.setItem('userOffice', userData.office?.name ?? '');
    localStorage.setItem('userDept', String(userData.department_id ?? ''));
    localStorage.setItem('dept', userData.departments?.department ?? '');
    localStorage.setItem('userAuthID', String(userData.id ?? ''));
    localStorage.setItem('fname', userData.first_name ?? '');
    localStorage.setItem('lname', userData.last_name ?? '');
    localStorage.setItem('ab_id', String(userData.ab_user_id ?? ''));
    localStorage.setItem('username', userData.username ?? '');
};

const clearSessionStorage = () => {
    LOCAL_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));

    Object.keys(localStorage)
        .filter((key) => CACHE_KEY_PREFIXES.some((prefix) => key.startsWith(prefix)))
        .forEach((key) => localStorage.removeItem(key));
};

export default function LandingPage2() {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();

    const [userData, setUserData] = useState<LandingUser>();
    const [access, setAccess] = useState<AccessState>(INITIAL_ACCESS);
    const [isLoading, setIsLoading] = useState(false);
    const [totals, setTotals] = useState<DashboardTotals>(INITIAL_TOTALS);

    const currentYear = new Date().getFullYear();
    const canAccessAdminPanel = access.admin;

    const handleSignout = useCallback(async () => {
        clearSessionStorage();
        await signOut();
        navigate('/');
    }, [navigate, signOut]);

    const fetchUserByUuid = useCallback(async () => {
        if (!user?.id) {
            return undefined;
        }

        const fetchedUser = await UserService.getByUuid(user.id);
        persistUserSession(fetchedUser);
        setUserData(fetchedUser);
        setAccess(getAccessState(fetchedUser?.access));

        return fetchedUser as LandingUser;
    }, [user?.id]);

    const fetchBudgetSummary = useCallback(async () => {
        try {
            const [budgetData, unbudgetData] = await Promise.all([
                BudgetService.getByData(),
                BudgetService.getAllUnbudgeted(),
            ]);

            return {
                budgeted: budgetData?.reduce((sum: number, item: any) => sum + Number(item?.budget || 0), 0) || 0,
                unbudgeted: unbudgetData?.reduce((sum: number, item: any) => sum + Number(item?.amount || 0), 0) || 0,
            };
        } catch {
            return { budgeted: 0, unbudgeted: 0 };
        }
    }, []);

    const fetchPerformanceTotals = useCallback(async (landingUser: LandingUser | undefined) => {
        const userId = Number(landingUser?.ab_user_id ?? 0);
        const username = landingUser?.username ?? '';

        const [newMembership, loanRelease, collection] = await Promise.all([
            axios
                .get(`${import.meta.env.VITE_API_BASE_URL}/newmembers/branch-data/${currentYear}`, {
                    params: { userid: userId, username },
                })
                .then((response) => Number(response.data?.total_count ?? 0))
                .catch(() => 0),
            axios
                .get(`${import.meta.env.VITE_API_BASE_URL}/loanprocessingv2/branch-data/${currentYear}`, {
                    params: { userid: userId, username },
                })
                .then((response) => Number(response.data?.total_count ?? 0))
                .catch(() => 0),
            axios
                .get(`${import.meta.env.VITE_IACCS_API_BASE_URL}/api/external/iaccs-monitoring/billing/date`, {
                    params: { year: currentYear, month: 0 },
                })
                .then((response) => {
                    const totalPaid =
                        Number(response.data?.data?.total_cash_payment ?? 0) +
                        Number(response.data?.data?.total_non_cash_payment ?? 0);

                    return Math.abs(totalPaid);
                })
                .catch(() => 0),
        ]);

        return { newMembership, loanRelease, collection };
    }, [currentYear]);

    const fetchWorkflowRequestTotal = useCallback(async (landingUser: LandingUser | undefined) => {
        try {
            const userId = Number(landingUser?.ab_user_id ?? 0);
            const username = landingUser?.username ?? '';

            const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/user-active-activities`, {
                userid: userId,
                username,
                tracked_user_id: userId,
            });

            return Array.isArray(response.data?.data) ? response.data.data.length : 0;
        } catch {
            return 0;
        }
    }, []);

    const fetchInventoryTotals = useCallback(async (landingUser: LandingUser | undefined) => {
        try {
            const departmentId = Number(landingUser?.department_id ?? 0);

            if (!departmentId) {
                return { licenses: 0, assets: 0, accessories: 0 };
            }

            const [licenses, assets, accessories] = await Promise.all([
                LicenseService.getAllPosts(departmentId),
                AssetService.getAllPosts(departmentId),
                AccessoryService.getAllPosts(departmentId),
            ]);

            return {
                licenses: Array.isArray(licenses) ? licenses.length : 0,
                assets: Array.isArray(assets) ? assets.length : 0,
                accessories: Array.isArray(accessories) ? accessories.length : 0,
            };
        } catch {
            return { licenses: 0, assets: 0, accessories: 0 };
        }
    }, []);

    useEffect(() => {
        let isCurrent = true;

        const initializeLandingPage = async () => {
            try {
                setIsLoading(true);
                const landingUser = await fetchUserByUuid();

                if (!landingUser) {
                    return;
                }

                const [budgetSummary, performanceTotals, workflowRequests, inventoryTotals] = await Promise.all([
                    fetchBudgetSummary(),
                    fetchPerformanceTotals(landingUser),
                    fetchWorkflowRequestTotal(landingUser),
                    fetchInventoryTotals(landingUser),
                ]);

                if (!isCurrent) {
                    return;
                }

                setTotals({
                    ...INITIAL_TOTALS,
                    ...budgetSummary,
                    ...performanceTotals,
                    workflowRequests,
                    ...inventoryTotals,
                });
            } catch {
                if (isCurrent) {
                    message.error('Error loading user data');
                }
            } finally {
                if (isCurrent) {
                    setIsLoading(false);
                }
            }
        };

        initializeLandingPage();

        return () => {
            isCurrent = false;
        };
    }, [
        fetchBudgetSummary,
        fetchInventoryTotals,
        fetchPerformanceTotals,
        fetchUserByUuid,
        fetchWorkflowRequestTotal,
    ]);

    const sidebarItems = useMemo<SidebarItemType[]>(
        () => [
            { id: 'company', label: 'Cebu CFI Community Coop.', icon: <Building2 className="w-4 h-4" /> },
            { id: 'mail', label: userData?.email || 'N/A', icon: <Mail className="w-4 h-4" /> },
            { id: 'username', label: userData?.username || 'Unknown Username', icon: <User className="w-4 h-4" /> },
            {
                id: 'nickname',
                label: `${userData?.first_name || 'First'} ${userData?.last_name || 'Last'}`,
                icon: <ContactRound className="w-4 h-4" />,
            },
            {
                id: 'department',
                label: `${userData?.departments?.department || 'Unknown Department'} Staff`,
                icon: <Warehouse className="w-4 h-4" />,
            },
        ],
        [userData],
    );

    const dashboardMetrics = useMemo<DashboardMetric[]>(
        () => [
            {
                title: 'Budget Monitoring',
                link: '/budget',
                isVisible: access.budget,
                isLoading,
                data: [
                    { name: 'Unbudgeted', value: totals.unbudgeted, color: '#bdc3c7' },
                    { name: 'Budget', value: totals.budgeted, color: '#9cc332' },
                ],
                centerLabel: `unbudget / budget / ${currentYear}`,
                icon: <FaDollarSign className="w-8 h-8 text-gray-400" />,
                legend: [
                    { label: 'unbudget', value: formatCompactCurrency(totals.unbudgeted), color: '#bdc3c7' },
                    { label: 'budget', value: formatCompactCurrency(totals.budgeted), color: '#9cc332' },
                ],
            },
            {
                title: 'Performance Report',
                link: '/performancereport',
                isVisible: access.performanceReport,
                isLoading,
                data: [
                    { name: 'Membership', value: totals.newMembership, color: '#bdc3c7' },
                    { name: 'Loan Release', value: totals.loanRelease, color: '#9cc332' },
                    { name: 'Collection', value: totals.collection, color: '#1890ff' },
                ],
                centerLabel: 'membership / loan release / collection',
                icon: <LuChartNoAxesColumn className="w-8 h-8 text-gray-400" />,
                legend: [
                    { label: 'membership', value: totals.newMembership.toLocaleString(), color: '#bdc3c7' },
                    { label: 'loan release', value: totals.loanRelease.toLocaleString(), color: '#9cc332' },
                    { label: 'collection', value: formatCompactCurrency(totals.collection), color: '#1890ff' },
                ],
            },
            {
                title: 'Performance Metric Report',
                link: '/workflow',
                isVisible: access.workflow,
                isLoading,
                data: [{ name: 'Requests', value: totals.workflowRequests, color: '#9cc332' }],
                centerLabel: 'requests',
                icon: <FileText className="w-8 h-8 text-gray-400" />,
                legend: [{ label: 'requests', value: totals.workflowRequests, color: '#9cc332' }],
            },
            {
                title: 'CFI Asset Management',
                link: '/inventory',
                isVisible: access.inventory,
                isLoading,
                data: [
                    { name: 'Licenses', value: totals.licenses, color: '#bdc3c7' },
                    { name: 'Assets', value: totals.assets, color: '#9cc332' },
                    { name: 'Accessories', value: totals.accessories, color: '#1890ff' },
                ],
                centerLabel: 'licenses / assets / accessories',
                icon: <BaggageClaim className="w-8 h-8 text-gray-400" />,
                legend: [
                    { label: 'licenses', value: totals.licenses, color: '#bdc3c7' },
                    { label: 'assets', value: totals.assets, color: '#9cc332' },
                    { label: 'accessories', value: totals.accessories, color: '#1890ff' },
                ],
            },
            {
                title: 'IT Support Ticket',
                link: 'https://it-support.cficoop.com/en/',
                isVisible: access.ticketing,
                isLoading,
                data: [
                    { name: 'Offline', value: 50, color: '#bdc3c7' },
                    { name: 'Online', value: 50, color: '#9cc332' },
                ],
                centerLabel: 'offline / online',
                icon: <FaDollarSign className="w-8 h-8 text-gray-400" />,
                legend: [
                    { label: 'offline', value: 50, color: '#bdc3c7' },
                    { label: 'online', value: 50, color: '#9cc332' },
                ],
            },
            {
                title: 'Human Resource Management',
                link: '/hr',
                isVisible: access.hr,
                isLoading,
                data: [
                    { name: 'Male', value: 50, color: '#bdc3c7' },
                    { name: 'Female', value: 50, color: '#9cc332' },
                ],
                centerLabel: 'male / female',
                icon: <FaRegUser className="w-8 h-8 text-gray-400" />,
                legend: [
                    { label: 'male', value: 50, color: '#bdc3c7' },
                    { label: 'female', value: 50, color: '#9cc332' },
                ],
            },
            {
                title: 'Reports',
                link: '/reports',
                isVisible: access.reports,
                isLoading,
                data: [
                    { name: 'Generated', value: 50, color: '#bdc3c7' },
                    { name: 'Pending', value: 50, color: '#9cc332' },
                ],
                centerLabel: 'generated / pending',
                icon: <FaFileAlt className="w-8 h-8 text-gray-400" />,
                legend: [
                    { label: 'generated', value: 50, color: '#bdc3c7' },
                    { label: 'pending', value: 50, color: '#9cc332' },
                ],
            },
        ],
        [access, currentYear, isLoading, totals],
    );

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: '#1890ff',
                    borderRadius: 4,
                },
            }}
        >
            <Layout className="min-h-screen">
                <Header className="bg-[#1890ff] px-0 flex items-center justify-between h-14 sticky top-0 z-50 shadow-md">
                    <div className="flex items-center">
                        <div className="flex items-center h-14">
                            <button
                                className="h-full px-6 flex items-center justify-center hover:bg-blue-600 transition-colors border-r border-blue-400 bg-blue-700"
                                type="button"
                                aria-label="Home"
                            >
                                <Home className="text-white w-5 h-5" />
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center px-6 gap-4">
                        <div className="hidden md:flex flex-col items-end text-white leading-tight">
                            <span className="text-xs font-bold">CFI Management System</span>
                            <span className="text-[10px] opacity-80">{isLoading ? 'Loading' : 'Online'}</span>
                        </div>
                        <Avatar src="./img/cfi-circle.png" />
                    </div>
                </Header>

                <Layout>
                    <Sider width={260} className="bg-white border-r border-gray-200 hidden lg:block overflow-y-auto overflow-x-hidden">
                        <div className="bg-[#34495e] text-white p-3 flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            <span className="font-semibold text-sm">PERSONAL DETAILS</span>
                        </div>
                        <div className="py-2">
                            {sidebarItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex min-w-0 items-center justify-between px-4 py-3 hover:bg-gray-50 border-b border-gray-100 transition-colors"
                                >
                                    <div className="flex min-w-0 items-center gap-3 text-gray-600 text-sm">
                                        {item.icon}
                                        <span className="min-w-0 truncate" title={item.label}>
                                            {item.label}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex cursor-pointer px-4 py-3 hover:bg-gray-50 border-b border-gray-100 transition-colors">
                            <Button
                                type="default"
                                className="flex items-center gap-3 text-sm cursor-pointer w-full text-left"
                                onClick={handleSignout}
                            >
                                <LogOut className="text-red-900 w-4 h-4" />
                                <span className="text-red-900">SIGN OUT</span>
                            </Button>
                        </div>
                        <div className="mt-8 p-4">
                            {PROMO_LINKS.map((link) => (
                                <a
                                    key={link.src}
                                    href={link.href}
                                    className="block mt-2 first:mt-0"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <div className="relative rounded overflow-hidden shadow-sm group cursor-pointer">
                                        <img
                                            src={link.src}
                                            alt={link.alt}
                                            className="w-full h-auto grayscale group-hover:grayscale-0 transition-all duration-500"
                                        />
                                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2 text-white text-[10px] font-bold uppercase tracking-wider">
                                            {link.label}
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </Sider>

                    <Content className="p-6 bg-[#ecf0f1]">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {dashboardMetrics
                                .filter((metric) => metric.isVisible)
                                .map((metric) => (
                                    <MetricCard
                                        key={metric.title}
                                        title={metric.title}
                                        link={metric.link}
                                        data={metric.data}
                                        centerLabel={metric.centerLabel}
                                        icon={metric.icon}
                                        legend={metric.legend}
                                        isLoading={metric.isLoading}
                                    />
                                ))}
                        </div>
                    </Content>
                </Layout>

                {canAccessAdminPanel && (
                    <Button
                        type="primary"
                        size="small"
                        className="fixed bottom-4 right-4 z-50 flex h-9 items-center gap-2 rounded-full px-4 font-semibold shadow-lg"
                        icon={<ShieldCheck className="h-5 w-5" />}
                        onClick={() => navigate('/admin')}
                    >
                        Admin Panel
                    </Button>
                )}
            </Layout>
        </ConfigProvider>
    );
}
