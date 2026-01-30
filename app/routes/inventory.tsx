import { useEffect, useRef, useState } from "react";
import {
  CloseOutlined,
  FullscreenExitOutlined,
  FullscreenOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuOutlined,
  MenuUnfoldOutlined,
  MessageOutlined,
  MoonOutlined,
  SunOutlined,
  SwapOutlined,
  VerticalAlignTopOutlined,
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
  Avatar,
  Tooltip,
  Tag,
  MenuProps,
} from "antd";
import { Link, Outlet, useMatches, useNavigate } from "@remix-run/react";
import {
  FcAutomatic,
  FcBearish,
  FcBullish,
  FcComboChart,
  FcConferenceCall,
  FcDepartment,
  FcDiploma1,
  FcFactory,
  FcFlowChart,
  FcGlobe,
  FcLandscape,
  FcMultipleDevices,
  FcMultipleSmartphones,
  FcNews,
  FcPackage,
  FcPaid,
  FcSalesPerformance,
  FcSettings,
} from "react-icons/fc";
import ScrollingAttentionBanner from "~/components/scrolling_attention";
import MovingAttentionAlert from "~/components/attention";
import Setting from "./settings";
import { ProtectedRoute } from "~/components/ProtectedRoute";
import { useAuth } from "~/auth/AuthContext";
import { AiOutlineMinus } from "react-icons/ai";
import ManagerGroupChat from "~/components/chat";

const { Header, Sider, Content } = Layout;

interface MenuItem {
  key: string;
  icon: React.ReactNode;
  label: React.ReactNode;
  children?: MenuItem[];
}

export default function InventoryLayoutIndex() {
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
    if (currentPath === '/inventory') {
      navigate('/inventory/dashboard', { replace: true });
    }
  }, [currentPath, navigate]);

  // Dark mode state initialization with localStorage
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return savedTheme ? savedTheme === 'dark' : systemDark;
    }
    return false;
  });

  // Responsive detection and automatic layout switching
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // Auto-collapse sidebar on mobile
      if (mobile) {
        setCollapsed(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Apply theme and user data
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
      const fname = localStorage.getItem('fname') || '';
      const lname = localStorage.getItem('lname') || '';
      setIsFname(fname);
      setIsLname(lname);
      document.body.className = isDarkMode ? 'dark-mode' : 'light-mode';
    }
  }, [isDarkMode]);

  const [isFullscreen, setIsFullscreen] = useState(false);

  // Toggle functions
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => {
          setIsFullscreen(false);
        });
      }
    }
  };

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);
  const toggleSidebar = () => setCollapsed(prev => !prev);
  const toggleLayout = () => {
    if (!isMobile) {
      setIsHorizontal(prev => !prev);
    }
  };
  const toggleChat = () => {
    setChatVisible(prev => {
      if (!prev) {
        setIsChatMinimized(false);
      }
      return !prev;
    });
  };
  const toggleChatMinimize = () => setIsChatMinimized(prev => !prev);
  const handleTrack = () => setIsModalOpen(true);
  const handleCancel = () => setIsModalOpen(false);

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

  const siderWidth = collapsed ? 80 : 280;

  const menuItems: MenuProps['items'] = [
    {
      key: "1",
      icon: <FcGlobe />,
      label: <Link to="/inventory/dashboard">Dashboard</Link>,
    },
    {
      key: "11",
      icon: <FcSalesPerformance />,
      label: <Link to="/inventory/assets">Assets</Link>,
    },
    {
      key: "10",
      icon: <FcDiploma1 />,
      label: <Link to="/inventory/licenses">Licenses</Link>,
    },
    {
      key: "9",
      icon: <FcMultipleDevices />,
      label: <Link to="/inventory/accessories">Accessories</Link>,
    },
    {
      key: "8",
      icon: <FcNews />,
      label: <Link to="/inventory/consumables">Consumables</Link>,
    },
    {
      key: "7",
      icon: <FcMultipleSmartphones />,
      label: <Link to="/inventory/components">Tech Components</Link>,
    },
    // {
    //   key: "6",
    //   icon: <FcPaid />,
    //   label: <Link to="/inventory/predefined-kit">Predefined Kits</Link>,
    // },
    {
      key: "2",
      icon: <FcAutomatic />,
      label: "Settings",
      children: [
        {
          key: "2.1",
          icon: <FcConferenceCall />,
          label: <Link to="/inventory/settings/suppliers">Suppliers</Link>,
        },
        {
          key: "2.3",
          icon: <FcFlowChart />,
          label: <Link to="/inventory/settings/categories">Categories</Link>,
        },
        {
          key: "2.4",
          icon: <FcFactory />,
          label: <Link to="/inventory/settings/manufacturers">Manufacturers</Link>,
        },
        {
          key: "2.5",
          icon: <FcLandscape />,
          label: <Link to="/inventory/settings/locations">Locations</Link>,
        },
        {
          key: "2.6",
          icon: <FcDepartment />,
          label: <Link to="/inventory/settings/companies">Companies</Link>,
        },
        {
          key: "2.7",
          icon: <FcBearish />,
          label: <Link to="/inventory/settings/depreciation">Depreciation</Link>,
        },
        {
          key: "2.8",
          icon: <FcMultipleDevices />,
          label: <Link to="/inventory/settings/asset-model">Asset Model</Link>,
        },
      ],
    },
    {
      key: "3",
      icon: <FcBullish />,
      label: "Reports",
      children: [
        {
          key: "3.1",
          icon: <FcComboChart />,
          label: <Link to="/inventory/reports/activity-report">Activity Report</Link>,
        },
        {
          key: "3.2",
          icon: <FcComboChart />,
          label: <Link to="/inventory/reports/custom-asset-report">Custom Asset Report</Link>,
        },
      ],
    },
  ];

  const quickCreateItems = [
    {
      key: "1",
      icon: <FcPackage />,
      label: <Link to="/inventory/assets/form-asset">Assets</Link>,
    },
    {
      key: "2",
      icon: <FcDiploma1 />,
      label: <Link to="/inventory/licenses/form-license">Licenses</Link>,
    },
    {
      key: "3",
      icon: <FcMultipleDevices />,
      label: <Link to="/inventory/accessories/form-accessory">Accessories</Link>,
    },
    {
      key: "4",
      icon: <FcNews />,
      label: <Link to="/inventory/consumables/form-consumable">Consumables</Link>,
    },
    {
      key: "5",
      icon: <FcMultipleSmartphones />,
      label: <Link to="/inventory/components/form-component">Tech Components</Link>,
    },
    {
      key: "6",
      icon: <FcPaid />,
      label: <Link to="/inventory/predefined-kit/form-predefined-kit">Predefined</Link>,
    },
  ];

  const mobileMenuItems = [
    {
      key: '1',
      label: isDarkMode ? 'Light Mode' : 'Dark Mode',
      icon: isDarkMode ? <SunOutlined /> : <MoonOutlined />,
      onClick: toggleDarkMode
    },
    {
      key: '2',
      label: isFullscreen ? 'Exit Fullscreen' : 'Fullscreen',
      icon: isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />,
      onClick: toggleFullscreen
    },
    {
      key: '3',
      label: 'Quick Create',
      icon: <FcPackage />,
      children: quickCreateItems.map(item => ({
        key: `create_${item.key}`,
        label: item.label,
        icon: item.icon
      }))
    },
    {
      key: '4',
      label: 'Settings',
      icon: <FcSettings />,
      onClick: handleTrack
    },
    {
      key: '5',
      label: 'Switch App',
      icon: <SwapOutlined />,
      onClick: () => window.location.href = '/landing-page'
    }
  ];

  return (
    <ProtectedRoute>
      <ConfigProvider
        theme={{
          algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
          token: {
            colorText: isDarkMode ? '#ffffff' : undefined,
            colorTextSecondary: isDarkMode ? '#e6e6e6' : undefined,
            colorTextTertiary: isDarkMode ? '#cccccc' : undefined,
          },
          components: {
            Layout: {
              headerBg: isDarkMode ? '#1f1f1f' : '#ffffff',
              bodyBg: isDarkMode ? '#141414' : '#f5f5f5',
            },
            Menu: {
              colorItemBgSelected: isDarkMode ? '#1d1d1d' : '#f0f0f0',
              colorItemBgHover: isDarkMode ? '#2a2a2a' : '#f5f5f5',
            },
            Card: {
              colorBgContainer: isDarkMode ? '#1f1f1f' : '#ffffff',
            },
          },
        }}
      >
        <Layout className="min-h-screen">
          {/* Mobile Header */}
          {isMobile && (
            <Header
              className="flex items-center justify-between p-0 px-4"
              style={{
                background: isDarkMode ? '#1f1f1f' : '#ffffff',
                borderBottom: isDarkMode ? '1px solid #303030' : '1px solid #f0f0f0',
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 300,
              }}
            >
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={toggleSidebar}
                style={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.85)' : '#303030' }}
              />

              <Image
                width={120}
                src={isDarkMode ? '/img/cficoop-white.png' : '/img/cficoop.svg'}
                preview={false}
              />

              <Dropdown menu={{ items: mobileMenuItems }} trigger={['click']}>
                <Button
                  type="text"
                  icon={<MenuOutlined />}
                  style={{ color: isDarkMode ? 'rgba(255, 255, 255, 0.85)' : '#303030' }}
                />
              </Dropdown>
            </Header>
          )}

          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar - Only show vertical sidebar on desktop when not in horizontal mode */}
            {!isMobile && !isHorizontal && (
              <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                collapsedWidth={80}
                width={280}
                breakpoint="lg"
                onBreakpoint={(broken) => {
                  setCollapsed(broken);
                }}
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  bottom: 0,
                  height: '100vh',
                  zIndex: 200,
                  background: isDarkMode ? '#141414' : '#ffffff',
                  borderRight: isDarkMode ? '1px solid #303030' : '1px solid #e8e8e8',
                  boxShadow: isDarkMode ? '2px 0 8px rgba(0, 0, 0, 0.45)' : '2px 0 8px rgba(0, 0, 0, 0.05)',
                  overflow: 'hidden',
                }}
                className="sidebar-gradient"
              >
                {/* User Profile Section - Enhanced */}
                <div
                  className="h-20 flex items-center justify-center relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  {/* Decorative accent */}
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-400 to-cyan-400" />

                  {collapsed ? (
                    <div className="p-3 relative group">
                      <Avatar
                        src="/img/user.png"
                        size={48}
                        className="cursor-pointer transition-all duration-300 hover:scale-110 hover:ring-4 hover:ring-blue-300/50"
                        style={{
                          border: '3px solid rgba(255, 255, 255, 0.2)',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
                        }}
                      />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                    </div>
                  ) : (
                    <div className="flex items-center w-full px-5 py-4">
                      <div className="relative group">
                        <Avatar
                          src="/img/user.png"
                          size={56}
                          className="cursor-pointer transition-all duration-300 hover:scale-110 hover:ring-4 hover:ring-blue-300/50"
                          style={{
                            border: '3px solid rgba(255, 255, 255, 0.2)',
                            boxShadow: '0 6px 16px rgba(0, 0, 0, 0.3)'
                          }}
                        />
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                        </div>
                      </div>
                      <div className="ml-4 overflow-hidden">
                        <div className="font-semibold text-lg text-white truncate">
                          {isFname} {isLname}
                        </div>
                        <div className="flex items-center mt-2">
                          <div className="flex-shrink-0">
                            <Tag
                              color="gold"
                              style={{
                                fontSize: '10px',
                                fontWeight: 700,
                                padding: '2px 8px',
                                lineHeight: '20px',
                                background: 'linear-gradient(45deg, #ffd700, #ffed4e)',
                                color: '#8b6500',
                                border: 'none',
                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                              }}
                            >
                              <div className="flex items-center">
                                <FcSettings className="mr-1" />
                                ADMINISTRATOR
                              </div>
                            </Tag>
                          </div>
                        </div>
                        <div className="text-xs text-blue-100/80 truncate mt-1">
                          CFI Cooperative
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Menu Section */}
                <Menu
                  theme={isDarkMode ? 'dark' : 'light'}
                  mode="inline"
                  defaultSelectedKeys={['1']}
                  items={menuItems}
                  style={{
                    backgroundColor: isDarkMode ? '#141414' : 'transparent',
                    color: isDarkMode ? '#141414' : '#f1f1f1',
                    height: 'calc(100vh - 200px)',
                    overflowY: 'auto',
                    padding: '8px 0',
                  }}
                  className="custom-menu glass-effect"
                />

                {/* Sidebar Footer / Sign Out */}
                {/* Enhanced Sign Out Section */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: "100%",
                    padding: collapsed ? "16px 8px" : "20px 16px",
                    borderTop: "1px solid rgba(255, 255, 255, 0.1)",
                    background: "linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  {collapsed ? (
                    <Tooltip title="Sign Out" placement="right">
                      <Button
                        type="text"
                        icon={<LogoutOutlined className="text-white/80 hover:text-red-400" />}
                        onClick={handleSignout}
                        className="flex items-center justify-center w-full h-12 hover:bg-red-500/20 rounded-lg transition-all duration-300"
                        style={{
                          color: "rgba(255, 255, 255, 0.8)",
                        }}
                      />
                    </Tooltip>
                  ) : (
                    <Button
                      color="danger" variant="solid"

                      icon={<LogoutOutlined />}
                      onClick={handleSignout}
                      className="w-full h-12 border-red-500/30 hover:border-red-500 hover:bg-red-500/10 rounded-lg transition-all duration-300 group"

                    >
                      <span className="ml-2 font-semibold text-white/90 group-hover:text-red-300 transition-colors">
                        SIGN OUT
                      </span>
                      <div className="absolute right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    </Button>
                  )}

                  {/* Version Info (only visible when expanded) */}
                  {!collapsed && (
                    <div className="mt-4 text-center">
                      <div className="text-xs text-white/50 font-medium tracking-wide">
                        v0.0.1
                      </div>
                      <div className="text-[10px] text-white/30 mt-1">
                        © {new Date().getFullYear()} CFI Admin
                      </div>
                    </div>
                  )}
                </div>
              </Sider>
            )}

            <Layout
              className="flex-1 overflow-auto"
              style={{
                marginLeft: !isMobile && !isHorizontal ? siderWidth : 0,
                transition: 'margin-left 0.3s ease',
              }}
            >
              {/* Desktop Header */}
              {!isMobile && (
                <Header
                  className="flex items-center h-16 p-0"
                  style={{
                    background: isDarkMode ? '#1f1f1f' : '#ffffff',
                    borderBottom: `1px solid ${isDarkMode ? '#303030' : '#f0f0f0'}`,
                    position: 'fixed',
                    top: 0,
                    left: !isMobile && !isHorizontal ? siderWidth : 0,
                    right: 0,
                    zIndex: 300,
                    transition: 'left 0.3s ease',
                  }}
                >
                  <Space className="h-full" style={{ marginLeft: 16 }}>
                    {!isHorizontal && (
                      <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={toggleSidebar}
                        className="flex items-center justify-center"
                        style={{
                          width: 48,
                          height: 48,
                          color: isDarkMode ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.88)'
                        }}
                      />
                    )}
                    <Image
                      width={isHorizontal ? 160 : 200}
                      src={isDarkMode ? '/img/cficoop-white.png' : '/img/cficoop.svg'}
                      preview={false}
                      className="transition-all duration-300 mt-5"
                    />
                  </Space>

                  <div className="flex-1">
                    <div className="flex justify-end items-center h-full pr-4">
                      <Space size="middle">
                        <Tooltip title={isDarkMode ? 'Light Mode' : 'Dark Mode'}>
                          <Switch
                            checkedChildren={<MoonOutlined />}
                            unCheckedChildren={<SunOutlined />}
                            checked={isDarkMode}
                            onChange={toggleDarkMode}
                            className={isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}
                          />
                        </Tooltip>

                        <Tooltip title={isHorizontal ? 'Switch to Vertical Menu' : 'Switch to Horizontal Menu'}>
                          <Button
                            type="text"
                            icon={isHorizontal ? <VerticalAlignTopOutlined /> : <MenuOutlined />}
                            onClick={toggleLayout}
                            className="hidden md:inline-flex"
                          />
                        </Tooltip>

                        <Tooltip title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}>
                          <Button
                            type="text"
                            icon={isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
                            onClick={toggleFullscreen}
                          />
                        </Tooltip>

                        <Tooltip title={chatVisible ? 'Hide Chat' : 'Show Chat'}>
                          <Button
                            type="text"
                            icon={<MessageOutlined />}
                            onClick={toggleChat}
                          />
                        </Tooltip>

                        <Tooltip title="Switch Portal">
                          <Link to="/landing-page">
                            <Button
                              type="text"
                              icon={<SwapOutlined />}
                            />
                          </Link>
                        </Tooltip>

                        <Tooltip title="Settings">
                          <Button
                            type="text"
                            icon={<FcSettings />}
                            onClick={handleTrack}
                          />
                        </Tooltip>
                      </Space>
                    </div>
                  </div>
                </Header>
              )}

              {/* Horizontal Menu - Show on mobile or when horizontal mode is enabled */}
              {(isMobile || isHorizontal) && (
                <Header
                  className="p-0"
                  style={{
                    height: 'auto',
                    lineHeight: 'normal',
                    position: 'fixed',
                    top: 64,
                    left: !isMobile && !isHorizontal ? siderWidth : 0,
                    right: 0,
                    zIndex: 250,
                    background: isDarkMode ? '#1f1f1f' : '#ffffff',
                  }}
                >
                  <Menu
                    theme={isDarkMode ? 'dark' : 'light'}
                    mode={isMobile ? 'horizontal' : 'horizontal'}
                    defaultSelectedKeys={['1']}
                    items={menuItems}
                    style={{
                      flex: 1,
                      minWidth: 0,
                      background: isDarkMode ? '#1f1f1f' : '#ffffff',
                      lineHeight: '48px',
                    }}
                    className={isMobile ? 'overflow-x-auto' : ''}
                  />
                </Header>
              )}

              {/* Content Area */}
              <Content
                className={`p-4 ${isDarkMode ? 'dark-scrollbar' : 'light-scrollbar'}`}
                style={{
                  minHeight: '100vh',
                  paddingTop: 64, // height of Header
                  background: isDarkMode ? '#141414' : '#FAFAFA',
                  color: isDarkMode ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.88)',
                }}
              >
                {!isHorizontal && (
                  <div className="mb-4">
                    <ScrollingAttentionBanner
                      text="ATTENTION: Other features is still under maintenance."
                      speed={100}
                      backgroundColor={isDarkMode ? 'bg-gray-800' : 'bg-yellow-50'}
                      textColor={isDarkMode ? 'text-gray-300' : 'text-yellow-800'}
                    />
                  </div>
                )}
                <MovingAttentionAlert />
                <Outlet />
              </Content>

              {/* Footer */}
              <footer className={`
                flex flex-col md:flex-row justify-between items-center p-4
                ${isDarkMode ? 'bg-gray-900 text-gray-300' : 'bg-white text-gray-700'}
                border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}
              `}>
                <div className="text-sm mb-2 md:mb-0">
                  Ant Design using Remix <b>©{new Date().getFullYear()}</b>
                </div>
                <div className="text-sm">
                  <b>Developed by:</b> CFI IT Department
                </div>
              </footer>
            </Layout>
          </div>

          {/* Messenger-style Chat Popup */}
          {chatVisible && (
            <div
              ref={chatRef}
              className={`fixed bottom-0 right-4 z-50 transition-all duration-300 ease-in-out ${isChatMinimized ? 'w-64 h-12' : 'w-[26rem] h-[500px]'
                }`}
              style={{
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                borderRadius: '8px',
                overflow: 'hidden',
                background: isDarkMode ? '#1f1f1f' : '#ffffff',
                border: isDarkMode ? '1px solid #303030' : '1px solid #e8e8e8',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {/* Chat Header - Always visible */}
              <div
                className={`flex items-center justify-between p-3 cursor-pointer ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-blue-500 hover:bg-blue-600'
                  }`}
                onClick={toggleChatMinimize}
                style={{
                  transition: 'background-color 0.3s',
                  flexShrink: 0 // Prevents header from shrinking
                }}
              >
                <div className="flex items-center">
                  <MessageOutlined className="text-white mr-2" />
                  <span className="text-white font-medium">Managers Chat</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    type="text"
                    icon={
                      isChatMinimized ? (
                        ''
                      ) : (
                        <AiOutlineMinus color="#ffffff" />
                      )
                    }
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleChatMinimize();
                    }}
                  />
                  <Button
                    type="text"
                    icon={<CloseOutlined className="text-white" />}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleChat();
                    }}
                  />
                </div>
              </div>

              {/* Chat Content - Scrollable area */}
              {!isChatMinimized && (
                <div className="flex-1 overflow-hidden flex flex-col">
                  <div>
                    <ManagerGroupChat isDarkMode={isDarkMode} />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Floating Chat Button (when chat is hidden) */}
          {!chatVisible && (
            <button
              onClick={toggleChat}
              className={`fixed bottom-6 right-6 z-40 flex items-center justify-center rounded-full p-4 shadow-lg transition-all hover:shadow-xl ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'
                }`}
              style={{
                width: '56px',
                height: '56px',
              }}
            >
              <MessageOutlined className="text-white text-xl" />
            </button>
          )}

          {/* Settings Modal */}
          <Modal
            open={isModalOpen}
            onCancel={handleCancel}
            footer={null}
            width={isMobile ? '90%' : 600}
            styles={{
              body: { background: isDarkMode ? '#1f1f1f' : '#ffffff' },
              header: {
                background: isDarkMode ? '#1f1f1f' : '#ffffff',
                borderBottom: isDarkMode ? '1px solid #303030' : '1px solid #f0f0f0'
              }
            }}
            title={
              <div className="flex items-center gap-2">
                <FcSettings />
                <span className={isDarkMode ? 'text-white' : 'text-gray-800'}>Settings</span>
              </div>
            }
          >
            <Setting onSendData={(data: boolean) => setIsModalOpen(data)} />
          </Modal>
        </Layout>
      </ConfigProvider>
    </ProtectedRoute>
  );
}