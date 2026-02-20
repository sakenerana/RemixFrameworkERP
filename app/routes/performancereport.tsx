import { useEffect, useState, useRef } from "react";
import {
  FullscreenExitOutlined,
  FullscreenOutlined,
  MenuFoldOutlined,
  MenuOutlined,
  MenuUnfoldOutlined,
  MoonOutlined,
  SunOutlined,
  SwapOutlined,
  VerticalAlignTopOutlined,
  MessageOutlined,
  CloseOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import {
  Button,
  Layout,
  Menu,
  Space,
  theme,
  Image,
  Modal,
  ConfigProvider,
  Switch,
  Dropdown,
  Tooltip,
  Avatar,
  Tag,
  MenuProps,
} from "antd";
import { Link, Outlet, useMatches, useNavigate } from "@remix-run/react";
import {
  FcSettings,
} from "react-icons/fc";
import ScrollingAttentionBanner from "~/components/scrolling_attention";
import MovingAttentionAlert from "~/components/attention";
import Setting from "./settings";
import { ProtectedRoute } from "~/components/ProtectedRoute";
import ManagerGroupChat from "~/components/chat";
import { AiOutlineMinus } from "react-icons/ai";
import { LuChartBarStacked, LuCreditCard, LuLayoutDashboard, LuTrendingUp } from "react-icons/lu";
import { useAuth } from "~/auth/AuthContext";
import { ArrowLeftFromLine, FileText, Home, Plus } from "lucide-react";
import KPICard from "~/components/KPICard";
import DailyDetailsChart from "~/components/DailyDetailsChart";
import PerformanceCharts from "~/components/PerformanceCharts";

const { Header, Sider, Content } = Layout;

interface MenuItem {
  key: string;
  icon: React.ReactNode;
  label: React.ReactNode;
}

export interface KPIData {
  label: string;
  link: string;
  value: string;
  trend: number;
  comparison: string;
  history: { month: string; value: number }[];
}

export const KPI_DATA: KPIData[] = [
  {
    label: 'NEW MEMBERSHIP',
    link: '/newmembership',
    value: '1234',
    trend: 16.58,
    comparison: 'per year - 2026',
    history: [
      { month: 'Jan', value: 40 }, { month: 'Feb', value: 70 }, { month: 'Mar', value: 50 },
      { month: 'Apr', value: 80 }, { month: 'May', value: 60 }, { month: 'Jun', value: 90 },
      { month: 'Jul', value: 75 }, { month: 'Aug', value: 85 }, { month: 'Sep', value: 100 },
      { month: 'Oct', value: 95 }, { month: 'Nov', value: 110 }, { month: 'Dec', value: 120 }
    ]
  },
  {
    label: 'LOAN RELEASE',
    link: '/loanrelease',
    value: '456',
    trend: 16.85,
    comparison: 'per year - 2026',
    history: [
      { month: 'Jan', value: 30 }, { month: 'Feb', value: 50 }, { month: 'Mar', value: 40 },
      { month: 'Apr', value: 60 }, { month: 'May', value: 45 }, { month: 'Jun', value: 70 },
      { month: 'Jul', value: 55 }, { month: 'Aug', value: 65 }, { month: 'Sep', value: 80 },
      { month: 'Oct', value: 75 }, { month: 'Nov', value: 85 }, { month: 'Dec', value: 90 }
    ]
  },
  {
    label: 'COLLECTION',
    link: '/collections',
    value: '7890',
    trend: 15.21,
    comparison: 'per year - 2026',
    history: [
      { month: 'Jan', value: 10 }, { month: 'Feb', value: 20 }, { month: 'Mar', value: 10 },
      { month: 'Apr', value: 20 }, { month: 'May', value: 15 }, { month: 'Jun', value: 20 },
      { month: 'Jul', value: 20 }, { month: 'Aug', value: 20 }, { month: 'Sep', value: 20 },
      { month: 'Oct', value: 20 }, { month: 'Nov', value: 25 }, { month: 'Dec', value: 30 }
    ]
  },
  {
    label: 'PERSONNEL TASK COMPLETION',
    link: '/personnel',
    value: '143',
    trend: -0.29,
    comparison: 'per year - 2026',
    history: [
      { month: 'Jan', value: 28 }, { month: 'Feb', value: 29 }, { month: 'Mar', value: 27 },
      { month: 'Apr', value: 28 }, { month: 'May', value: 28 }, { month: 'Jun', value: 29 },
      { month: 'Jul', value: 28 }, { month: 'Aug', value: 28 }, { month: 'Sep', value: 28 },
      { month: 'Oct', value: 28 }, { month: 'Nov', value: 28 }, { month: 'Dec', value: 28 }
    ]
  }
];

export default function PerformanceReportLayoutIndex() {
  const navigate = useNavigate();
  const matches = useMatches();
  const [collapsed, setCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHorizontal, setIsHorizontal] = useState(false);
  const [isFname, setIsFname] = useState('');
  const [isLname, setIsLname] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [chatVisible, setChatVisible] = useState(false);
  const [isChatMinimized, setIsChatMinimized] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const { signOut, getUser } = useAuth();

  // Get current path for menu selection
  const currentPath = matches[matches.length - 1]?.pathname || '';

  // Redirect to dashboard on initial load if at root admin path
  useEffect(() => {
    if (currentPath === '/performancereport') {
      navigate('/performancereport', { replace: true });
    }
  }, [currentPath, navigate]);

  return (
    <ProtectedRoute>
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
                <a href="/landing-page" className="h-full">
                  <button className="h-full px-6 flex items-center justify-center hover:bg-blue-600 transition-colors border-r border-blue-400 bg-blue-700">
                    <Home className="text-white w-5 h-5" />
                  </button>
                </a>
                <a href="/landing-page" className="h-full">
                  <button className="h-full px-6 flex items-center justify-center hover:bg-blue-600 transition-colors border-r border-blue-400">
                    <ArrowLeftFromLine className="text-white w-5 h-5" />
                  </button>
                </a>
              </div>
            </div>
            <div className="flex items-center px-6 gap-4">
              <div className="hidden md:flex flex-col items-end text-white leading-tight">
                <span className="text-xs font-bold">CFI Management System</span>
                <span className="text-[10px] opacity-80">Online</span>
              </div>
              <Avatar src="/img/cfi-circle.png" />
            </div>
          </Header>

          <Content className="bg-gray-100 p-4">

            {/* KPI Cards Grid */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {KPI_DATA.map((kpi, idx) => (
                <div className="cursor-pointer hover:scale-105 transition-transform">
                  <a href={kpi.link}>
                    <KPICard key={kpi.label} data={kpi} index={idx} />
                  </a>
                </div>
              ))}
            </section>

            {/* Charts Section */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
              <div className="lg:col-span-2">
                <DailyDetailsChart />
              </div>
              <div className="lg:col-span-1">
                <PerformanceCharts />
              </div>
            </section>

          </Content>
        </Layout>


      </ConfigProvider>
    </ProtectedRoute>
  );
}