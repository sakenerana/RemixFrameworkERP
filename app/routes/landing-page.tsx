import React, { useEffect, useState } from 'react';
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
} from 'lucide-react';
import MetricCard from '~/components/MetricCard';
import { useAuth } from '~/auth/AuthContext';
import { UserService } from '~/services/user.service';
import { BudgetService } from '~/services/budget.service';
import { LicenseService } from '~/services/license.service';
import { AssetService } from '~/services/asset.service';
import { AccessoryService } from '~/services/accessory.service';
import { FaDollarSign, FaRegUser } from 'react-icons/fa';
import { LuChartNoAxesColumn } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';

export interface SidebarItemType {
    id: string;
    label: string;
    icon: React.ReactNode;
    badge?: number;
}
const { Header, Content, Sider, Footer } = Layout;

export default function LandingPage2() {
    const [activeTab, setActiveTab] = useState('events');
    const { user } = useAuth();
    const [dataUser, setData] = useState<any>();
    const [dataInventory, setDataInventory] = useState(false);
    const [dataBudget, setDataBudget] = useState(false);
    const [dataPerformanceReport, setDataPerformanceReport] = useState(false);
    const [dataWorkflow, setDataWorkflow] = useState(false);
    const [dataTicketing, setDataTicketing] = useState(false);
    const [dataHR, setDataHR] = useState(false);
    const [dataAdmin, setDataAdmin] = useState(false);
    const [loading, setLoading] = useState(false);
    const [budgetedTotal, setBudgetedTotal] = useState(0);
    const [unbudgetedTotal, setUnbudgetedTotal] = useState(0);
    const [newMembershipTotal, setNewMembershipTotal] = useState(0);
    const [loanReleaseTotal, setLoanReleaseTotal] = useState(0);
    const [collectionTotal, setCollectionTotal] = useState(0);
    const [workflowRequestTotal, setWorkflowRequestTotal] = useState(0);
    const [licenseTotal, setLicenseTotal] = useState(0);
    const [assetTotal, setAssetTotal] = useState(0);
    const [accessoryTotal, setAccessoryTotal] = useState(0);
    const apiAuthExternal = import.meta.env.VITE_AUTH_EXTERNAL;
    const apiAuthExternalPassword = import.meta.env.VITE_AUTH_EXTERNAL_PASSWORD;
    const { signOut, getUser } = useAuth();
    const navigate = useNavigate();
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

    const handleSignout = async () => {
        // Clear all relevant localStorage data
        localStorage.removeItem("ab_id");
        localStorage.removeItem("username");
        localStorage.removeItem("dept");
        localStorage.removeItem("fname");
        localStorage.removeItem("lname");
        localStorage.removeItem("userAuthID");
        localStorage.removeItem("userDept");
        localStorage.removeItem("userOffice");
        localStorage.removeItem("userOfficeID");

        localStorage.removeItem("workflowDashboardData");
        localStorage.removeItem("userActivitiesData");

        // Clear any cached API data (remove all keys starting with your app's cache prefix)
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith("budgetApproved_") || key.startsWith("completedRequisition_") || key.startsWith("userActiveActivities_")) {
                localStorage.removeItem(key);
            }
        });

        await signOut();
        // setLoading(false);
        navigate("/");
    };

    const formatCompactCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            notation: 'compact',
            maximumFractionDigits: 1,
        }).format(amount || 0);
    };

    // Fetch data from Supabase
    const fetchDataByUUID = async () => {
        if (!user?.id) {
            console.error("User ID is not available");
            return;
        }

        try {
            setLoading(true);
            const dataFetch = await UserService.getByUuid(user.id);
            const arr = JSON.parse(dataFetch?.access || '[]'); // Add fallback for empty access
            localStorage.setItem('userOfficeID', dataFetch.office.id);
            localStorage.setItem('userOffice', dataFetch.office.name);
            localStorage.setItem('userDept', dataFetch.department_id);
            localStorage.setItem('dept', dataFetch.departments.department);
            localStorage.setItem('userAuthID', dataFetch.id);
            localStorage.setItem('fname', dataFetch.first_name);
            localStorage.setItem('lname', dataFetch.last_name);
            localStorage.setItem('ab_id', dataFetch.ab_user_id);
            localStorage.setItem('username', dataFetch.username);

            // Update all states at once
            setData(dataFetch);
            setDataInventory(arr.includes(1));
            setDataBudget(arr.includes(2));
            setDataWorkflow(arr.includes(3));
            setDataAdmin(arr.includes(4));
            setDataTicketing(arr.includes(5));
            setDataPerformanceReport(arr.includes(6));
            setDataHR(arr.includes(7));
            // console.log("User data loaded successfully", dataFetch);
        } catch (error) {
            message.error("Error loading user data");
        } finally {
            setLoading(false);
        }
    };

    const fetchNewMembershipTotal = async () => {
        try {
            const userId = Number(localStorage.getItem("ab_id"));
            const username = localStorage.getItem("username") || "";
            const response = await axios.get(
                `${import.meta.env.VITE_API_BASE_URL}/newmembers/branch-data/${currentYear}`,
                {
                    params: { userid: userId, username },
                }
            );

            setNewMembershipTotal(Number(response.data?.total_count ?? 0));
        } catch (error) {
            setNewMembershipTotal(0);
        }
    };

    const fetchLoanReleaseTotal = async () => {
        try {
            const userId = Number(localStorage.getItem("ab_id"));
            const username = localStorage.getItem("username") || "";
            const response = await axios.get(
                `${import.meta.env.VITE_API_BASE_URL}/loanprocessingv2/branch-data/${currentYear}`,
                {
                    params: { userid: userId, username },
                }
            );

            setLoanReleaseTotal(Number(response.data?.total_count ?? 0));
        } catch (error) {
            setLoanReleaseTotal(0);
        }
    };

    const fetchCollectionTotal = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_IACCS_API_BASE_URL}/api/external/iaccs-monitoring/billing/date`,
                {
                    params: {
                        year: currentYear,
                        month: 0,
                    },
                }
            );

            setCollectionTotal(Math.abs(Number(response.data?.data?.total_paid ?? 0)));
        } catch (error) {
            setCollectionTotal(0);
        }
    };

    const fetchWorkflowRequestTotal = async () => {
        try {
            const userId = Number(localStorage.getItem("ab_id"));
            const username = localStorage.getItem("username") || "";

            const response = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/user-active-activities`,
                {
                    userid: userId,
                    username,
                    tracked_user_id: userId,
                }
            );

            const requestData = Array.isArray(response.data?.data) ? response.data.data : [];
            setWorkflowRequestTotal(requestData.length);
        } catch (error) {
            setWorkflowRequestTotal(0);
        }
    };

    const fetchInventoryTotals = async () => {
        try {
            const departmentId = Number(localStorage.getItem("userDept"));

            if (!departmentId) {
                setLicenseTotal(0);
                setAssetTotal(0);
                setAccessoryTotal(0);
                return;
            }

            const [licenses, assets, accessories] = await Promise.all([
                LicenseService.getAllPosts(departmentId),
                AssetService.getAllPosts(departmentId),
                AccessoryService.getAllPosts(departmentId),
            ]);

            setLicenseTotal(Array.isArray(licenses) ? licenses.length : 0);
            setAssetTotal(Array.isArray(assets) ? assets.length : 0);
            setAccessoryTotal(Array.isArray(accessories) ? accessories.length : 0);
        } catch (error) {
            setLicenseTotal(0);
            setAssetTotal(0);
            setAccessoryTotal(0);
        }
    };

    const fetchBudgetSummary = async () => {
        try {
            const [budgetData, unbudgetData] = await Promise.all([
                BudgetService.getByData(),
                BudgetService.getAllUnbudgeted(),
            ]);

            const totalBudgeted = budgetData?.reduce((sum: number, item: any) => sum + Number(item?.budget || 0), 0) || 0;
            const totalUnbudgeted = unbudgetData?.reduce((sum: number, item: any) => sum + Number(item?.amount || 0), 0) || 0;

            setBudgetedTotal(totalBudgeted);
            setUnbudgetedTotal(totalUnbudgeted);
        } catch (error) {
            setBudgetedTotal(0);
            setUnbudgetedTotal(0);
        }
    };

    useEffect(() => {
        const initializeLandingPage = async () => {
            await fetchDataByUUID();
            await Promise.all([
                fetchBudgetSummary(),
                fetchNewMembershipTotal(),
                fetchLoanReleaseTotal(),
                fetchCollectionTotal(),
                fetchWorkflowRequestTotal(),
                fetchInventoryTotals(),
            ]);
        };

        initializeLandingPage();
    }, [user?.id]);

    const sidebarItems: SidebarItemType[] = [
        { id: 'company', label: 'Cebu CFI Community Coop.', icon: <Building2 className="w-4 h-4" />, badge: 3 },
        { id: 'mail', label: dataUser?.email || 'N/A', icon: <Mail className="w-4 h-4" />, badge: 3 },
        { id: 'username', label: dataUser?.username || 'Unknown Username', icon: <User className="w-4 h-4" />, badge: 5 },
        { id: 'nickname', label: `${dataUser?.first_name || 'First'} ${dataUser?.last_name || 'Last'}`, icon: <ContactRound className="w-4 h-4" /> },
        { id: 'department', label: `${dataUser?.departments?.department || 'Unknown Department'} Staff`, icon: <Warehouse className="w-4 h-4" />, badge: 2 },
    ];

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
                {/* Top Header */}
                <Header className="bg-[#1890ff] px-0 flex items-center justify-between h-14 sticky top-0 z-50 shadow-md">
                    <div className="flex items-center">
                        <div className="flex items-center h-14">
                            <button className="h-full px-6 flex items-center justify-center hover:bg-blue-600 transition-colors border-r border-blue-400 bg-blue-700">
                                <Home className="text-white w-5 h-5" />
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center px-6 gap-4">
                        <div className="hidden md:flex flex-col items-end text-white leading-tight">
                            <span className="text-xs font-bold">CFI Management System</span>
                            <span className="text-[10px] opacity-80">Online</span>
                        </div>
                        <Avatar src="./img/cfi-circle.png" />
                    </div>
                </Header>

                <Layout>
                    {/* Sidebar */}
                    <Sider width={260} className="bg-white border-r border-gray-200 hidden lg:block overflow-auto">
                        <div className="bg-[#34495e] text-white p-3 flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            <span className="font-semibold text-sm">PERSONAL DETAILS</span>
                        </div>
                        <div className="py-2">
                            {sidebarItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between px-4 py-3 hover:bg-gray-50  border-b border-gray-100 transition-colors"
                                >
                                    <div className="flex items-center gap-3 text-gray-600 text-sm">
                                        {item.icon}
                                        <span>{item.label}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div>
                            <div
                                className="flex cursor-pointer px-4 py-3 hover:bg-gray-50  border-b border-gray-100 transition-colors"
                            >
                                <Button
                                    type="default"
                                    className="flex items-center gap-3 text-sm cursor-pointer w-full text-left"
                                    onClick={handleSignout}
                                >
                                    <LogOut className="text-red-900 w-4 h-4" />
                                    <span className="text-red-900">SIGN OUT</span>
                                </Button>
                            </div>
                        </div>
                        <div className="mt-8 p-4">
                            <a href="https://webportal.cficoop.com/" className="block" target='_blank'>
                                <div className="relative rounded overflow-hidden shadow-sm group cursor-pointer">
                                    <img src="./img/cfi-bills-payment.jpg" alt="CFI Bills Payment" className="w-full h-auto grayscale group-hover:grayscale-0 transition-all duration-500" />
                                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2 text-white text-[10px] font-bold uppercase tracking-wider">
                                        CFI Bills Payment Online
                                    </div>
                                </div>
                            </a>

                            <a href="https://webportal.cficoop.com/" className="block mt-2" target='_blank'>
                                <div className="relative rounded overflow-hidden shadow-sm group cursor-pointer">
                                    <img src="./img/cfi-cpp.jpg" alt="CFI CPP" className="w-full h-auto grayscale group-hover:grayscale-0 transition-all duration-500" />
                                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2 text-white text-[10px] font-bold uppercase tracking-wider">
                                        CFI CPP Online
                                    </div>
                                </div>
                            </a>

                            <a href="https://webportal.cficoop.com/" className="block mt-2" target='_blank'>
                                <div className="relative rounded overflow-hidden shadow-sm group cursor-pointer">
                                    <img src="./img/cfionline.jpg" alt="CFI Online" className="w-full h-auto grayscale group-hover:grayscale-0 transition-all duration-500" />
                                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2 text-white text-[10px] font-bold uppercase tracking-wider">
                                        CFI Online
                                    </div>
                                </div>
                            </a>
                        </div>
                    </Sider>

                    {/* Main Dashboard Content */}
                    <Content className="p-6 bg-[#ecf0f1]">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                            {dataBudget && (
                                <MetricCard
                                    title="Budget Monitoring"
                                    link="/budget"
                                    data={[
                                        { name: 'Unbudgeted', value: unbudgetedTotal, color: '#bdc3c7' },
                                        { name: 'Budget', value: budgetedTotal, color: '#9cc332' }
                                    ]}
                                    centerLabel={`unbudget / budget / ${currentYear}`}
                                    icon={<FaDollarSign className="w-8 h-8 text-gray-400" />}
                                    legend={[
                                        { label: 'unbudget', value: formatCompactCurrency(unbudgetedTotal), color: '#bdc3c7' },
                                        { label: 'budget', value: formatCompactCurrency(budgetedTotal), color: '#9cc332' }
                                    ]}
                                />
                            )}

                            {dataPerformanceReport && (
                                <MetricCard
                                    title="Performance Report"
                                    link="/performancereport"
                                    data={[
                                        { name: 'Membership', value: newMembershipTotal, color: '#bdc3c7' },
                                        { name: 'Loan Release', value: loanReleaseTotal, color: '#9cc332' },
                                        { name: 'Collection', value: collectionTotal, color: '#1890ff' }
                                    ]}
                                    centerLabel="membership / loan release / collection"
                                    icon={<LuChartNoAxesColumn className="w-8 h-8 text-gray-400" />}
                                    legend={[
                                        { label: 'membership', value: newMembershipTotal.toLocaleString(), color: '#bdc3c7' },
                                        { label: 'loan release', value: loanReleaseTotal.toLocaleString(), color: '#9cc332' },
                                        { label: 'collection', value: formatCompactCurrency(collectionTotal), color: '#1890ff' }
                                    ]}
                                />
                            )}

                            {dataWorkflow && (
                                <MetricCard
                                    title="Performance Metric Report"
                                    link="/workflow"
                                    data={[
                                        { name: 'Requests', value: workflowRequestTotal, color: '#9cc332' }
                                    ]}
                                    centerLabel="requests"
                                    icon={<FileText className="w-8 h-8 text-gray-400" />}
                                    legend={[
                                        { label: 'requests', value: workflowRequestTotal, color: '#9cc332' },
                                    ]}
                                />
                            )}

                            {dataInventory && (
                                <MetricCard
                                    title="CFI Asset Management"
                                    link="/inventory"
                                    data={[
                                        { name: 'Licenses', value: licenseTotal, color: '#bdc3c7' },
                                        { name: 'Assets', value: assetTotal, color: '#9cc332' },
                                        { name: 'Accessories', value: accessoryTotal, color: '#1890ff' }
                                    ]}
                                    centerLabel="licenses / assets / accessories"
                                    icon={<BaggageClaim className="w-8 h-8 text-gray-400" />}
                                    legend={[
                                        { label: 'licenses', value: licenseTotal, color: '#bdc3c7' },
                                        { label: 'assets', value: assetTotal, color: '#9cc332' },
                                        { label: 'accessories', value: accessoryTotal, color: '#1890ff' }
                                    ]}
                                />
                            )}

                            {dataTicketing && (
                                <MetricCard
                                    title="IT Support Ticket"
                                    link="https://it-support.cficoop.com/en/"
                                    data={[
                                        { name: 'Offline', value: 50, color: '#bdc3c7' },
                                        { name: 'Online', value: 50, color: '#9cc332' }
                                    ]}
                                    centerLabel="offline / online"
                                    icon={<FaDollarSign className="w-8 h-8 text-gray-400" />}
                                    legend={[
                                        { label: 'offline', value: 50, color: '#bdc3c7' },
                                        { label: 'online', value: 50, color: '#9cc332' }
                                    ]}
                                />
                            )}

                            {dataHR && (
                                <MetricCard
                                    title="Human Resource Management"
                                    link="/hr"
                                    data={[
                                        { name: 'Male', value: 50, color: '#bdc3c7' },
                                        { name: 'Female', value: 50, color: '#9cc332' }
                                    ]}
                                    centerLabel="male / female"
                                    icon={<FaRegUser className="w-8 h-8 text-gray-400" />}
                                    legend={[
                                        { label: 'male', value: 50, color: '#bdc3c7' },
                                        { label: 'female', value: 50, color: '#9cc332' }
                                    ]}
                                />
                            )}

                        </div>
                    </Content>
                </Layout>
            </Layout>
        </ConfigProvider>
    );
}
