import React, { useMemo, useState } from 'react';
import { ConfigProvider, Layout, Avatar, message } from 'antd';
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
import { FaDollarSign } from 'react-icons/fa';
import { LuChartNoAxesColumn } from 'react-icons/lu';

export interface SidebarItemType {
    id: string;
    label: string;
    icon: React.ReactNode;
    badge?: number;
}
const { Header, Content, Sider, Footer } = Layout;

const sidebarItems: SidebarItemType[] = [
    { id: 'company', label: 'Cebu CFI Community Coop.', icon: <Building2 className="w-4 h-4" />, badge: 3 },
    { id: 'mail', label: 'sakenerana@gmail.com', icon: <Mail className="w-4 h-4" />, badge: 3 },
    { id: 'username', label: 'cdmerana', icon: <User className="w-4 h-4" />, badge: 5 },
    { id: 'nickname', label: 'IT Staff - CD Erana', icon: <ContactRound className="w-4 h-4" /> },
    { id: 'department', label: 'IT Department', icon: <Warehouse className="w-4 h-4" />, badge: 2 },
];

export default function LandingPage2() {
    const [activeTab, setActiveTab] = useState('events');
    const { user } = useAuth();
    const [dataUser, setData] = useState<any>();
    const [dataInventory, setDataInventory] = useState(false);
    const [dataBudget, setDataBudget] = useState(false);
    const [dataNewMembership, setDataNewMembership] = useState(false);
    const [dataLoanRelease, setDataLoanRelease] = useState(false);
    const [dataWorkflow, setDataWorkflow] = useState(false);
    const [dataBilling, setDataBilling] = useState(false);
    const [dataTicketing, setDataTicketing] = useState(false);
    const [dataAdmin, setDataAdmin] = useState(false);
    const [loading, setLoading] = useState(false);
    const apiAuthExternal = import.meta.env.VITE_AUTH_EXTERNAL;
    const apiAuthExternalPassword = import.meta.env.VITE_AUTH_EXTERNAL_PASSWORD;

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
            setDataBilling(arr.includes(5));
            setDataTicketing(arr.includes(6));
            setDataLoanRelease(arr.includes(7));
            setDataNewMembership(arr.includes(8));
        } catch (error) {
            message.error("Error loading user data");
        } finally {
            setLoading(false);
        }
    };

    useMemo(() => {
        fetchDataByUUID();
    }, []);

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
                            {/* <button className="h-full px-6 flex items-center justify-center hover:bg-blue-600 transition-colors border-r border-blue-400">
                                <MapIcon className="text-white w-5 h-5" />
                            </button>
                            <button className="h-full px-6 flex items-center justify-center hover:bg-blue-600 transition-colors border-r border-blue-400">
                                <FileText className="text-white w-5 h-5" />
                            </button>
                            <button className="h-full px-6 flex items-center justify-center hover:bg-blue-600 transition-colors">
                                <Plus className="text-white w-5 h-5" />
                            </button> */}
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
                                <div className="flex items-center gap-3 text-gray-600 text-sm">
                                    <LogOut className="text-red-900 w-4 h-4" />
                                    <span className='text-red-900'>Sign Out</span>
                                </div>
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
                            <MetricCard
                                title="Financial Monitoring"
                                link="/budget"
                                data={[
                                    { name: 'Unbudgeted', value: 35, color: '#bdc3c7' },
                                    { name: 'Budget', value: 65, color: '#9cc332' }
                                ]}
                                centerLabel="unbudget / budget"
                                icon={<FaDollarSign className="w-8 h-8 text-gray-400" />}
                                legend={[
                                    { label: 'unbudget', value: 35, color: '#bdc3c7' },
                                    { label: 'budget', value: 65, color: '#9cc332' }
                                ]}
                            />

                            <MetricCard
                                title="Performance Report"
                                link="/performancereport"
                                data={[
                                    { name: 'Membership', value: 35, color: '#bdc3c7' },
                                    { name: 'Loan Release', value: 65, color: '#9cc332' },
                                    { name: 'Collections', value: 65, color: '#1890ff' }
                                ]}
                                centerLabel="membership / loan release / collections"
                                icon={<LuChartNoAxesColumn className="w-8 h-8 text-gray-400" />}
                                legend={[
                                    { label: 'membership', value: 35, color: '#bdc3c7' },
                                    { label: 'loan release', value: 65, color: '#9cc332' },
                                    { label: 'collections', value: 65, color: '#1890ff' }
                                ]}
                            />

                            <MetricCard
                                title="Operation Process"
                                link="/workflow"
                                data={[
                                    { name: 'Requests', value: 65, color: '#9cc332' }
                                ]}
                                centerLabel="requests"
                                icon={<FileText className="w-8 h-8 text-gray-400" />}
                                legend={[
                                    { label: 'requests', value: 65, color: '#9cc332' },
                                ]}
                            />

                            <MetricCard
                                title="CFI Asset Management"
                                link="/inventory"
                                data={[
                                    { name: 'Licenses', value: 35, color: '#bdc3c7' },
                                    { name: 'Assets', value: 65, color: '#9cc332' }
                                ]}
                                centerLabel="licenses / assets"
                                icon={<BaggageClaim className="w-8 h-8 text-gray-400" />}
                                legend={[
                                    { label: 'licenses', value: 35, color: '#bdc3c7' },
                                    { label: 'assets', value: 65, color: '#9cc332' }
                                ]}
                            />

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

                        </div>
                    </Content>
                </Layout>

                {/* Footer */}
                {/* <Footer className="bg-[#34495e] text-white p-10">
                    <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-10">
                        <div>
                            <h3 className="text-white border-b border-gray-600 pb-2 mb-4 font-bold uppercase text-sm">Contacts</h3>
                            <div className="text-xs text-gray-400 space-y-2">
                                <p>Support Line: (032) 255-2525</p>
                                <p>Email: it.department@cebucficoop.com</p>
                                <p>© 2026 CFI. All rights reserved.</p>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-white border-b border-gray-600 pb-2 mb-4 font-bold uppercase text-sm">OPEN HOURS</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <ul className="text-xs text-gray-400 space-y-2">
                                    <li className="hover:text-white cursor-pointer">• Monday to Saturday</li>
                                    <li className="hover:text-white cursor-pointer">• 8:00AM-6:30PM</li>
                                </ul>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-white border-b border-gray-600 pb-2 mb-4 font-bold uppercase text-sm">ADDRESS</h3>
                            <div className="text-xs text-gray-400 space-y-2">
                                <p>Address: Esperanza Fiel Garcia Bldg., Capitol Compound (Capitol Site),
                                    N Escario St, Cebu City, 6000 Cebu</p>
                            </div>
                        </div>
                    </div>
                </Footer> */}
            </Layout>
        </ConfigProvider>
    );
}