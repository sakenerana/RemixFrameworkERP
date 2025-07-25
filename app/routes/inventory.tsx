import { useEffect, useState } from "react";
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
    // Only allow layout toggle on desktop
    if (!isMobile) {
      setIsHorizontal(prev => !prev);
    }
  };
  const handleTrack = () => setIsModalOpen(true);
  const handleCancel = () => setIsModalOpen(false);

  const menuItems: MenuItem[] = [
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
    {
      key: "6",
      icon: <FcPaid />,
      label: <Link to="/inventory/predefined-kit">Predefined Kits</Link>,
    },
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
            colorTextQuaternary: isDarkMode ? '#b3b3b3' : undefined,
          },
          components: {
            Layout: {
              headerBg: isDarkMode ? '#1f1f1f' : '#001529',
              bodyBg: isDarkMode ? '#141414' : '#f5f5f5',
              colorText: isDarkMode ? '#ffffff' : undefined,
            },
            Typography: { colorText: isDarkMode ? '#ffffff' : undefined },
            Menu: { colorText: isDarkMode ? '#ffffff' : undefined },
            Button: { colorText: isDarkMode ? '#ffffff' : undefined },
            Card: {
              colorBgContainer: isDarkMode ? '#1f1f1f' : '#ffffff',
              colorText: isDarkMode ? 'rgba(255, 255, 255, 0.85)' : undefined,
              colorTextHeading: isDarkMode ? '#ffffff' : undefined,
              colorTextDescription: isDarkMode ? 'rgba(255, 255, 255, 0.65)' : undefined,
              colorBorderSecondary: isDarkMode ? '#424242' : '#f0f0f0',
            },
          },
        }}
      >
        <Layout className="min-h-screen">
          {/* Mobile Header */}
          {isMobile && (
            <Header className="flex items-center justify-between p-0 px-4" style={{
              background: isDarkMode ? '#1f1f1f' : '#ffffff',
              borderBottom: isDarkMode ? '1px solid #303030' : '1px solid #f0f0f0'
            }}>
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
                  background: isDarkMode ? '#141414' : '#ffffff',
                  borderRight: isDarkMode ? '1px solid #303030' : '1px solid #e8e8e8',
                  boxShadow: isDarkMode ? '2px 0 8px rgba(0, 0, 0, 0.45)' : '2px 0 8px rgba(0, 0, 0, 0.05)',
                  overflow: 'hidden',
                }}
              >
                {/* User Profile Section */}
                <div className="h-16 flex items-center justify-center" style={{
                  background: isDarkMode ? '#1f1f1f' : '#fafafa',
                  color: isDarkMode ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.88)'
                }}>
                  {collapsed ? (
                    <div className="p-2">
                      <Avatar
                        src="/img/user.png"
                        size={40}
                        className="cursor-pointer transition-transform hover:scale-105"
                        style={{ border: isDarkMode ? '2px solid #434343' : '2px solid #e8e8e8' }}
                      />
                    </div>
                  ) : (
                    <div className="flex items-center w-full px-4">
                      <Avatar
                        src="/img/user.png"
                        size={48}
                        className="cursor-pointer transition-transform hover:scale-105"
                        style={{ border: isDarkMode ? '2px solid #434343' : '2px solid #e8e8e8' }}
                      />
                      <div className="ml-4 overflow-hidden">
                        <div className="font-medium text-base truncate">{isFname} {isLname}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1">
                          <Tag
                            color={isDarkMode ? 'volcano' : 'blue'}
                            style={{
                              fontSize: '10px',
                              fontWeight: 600,
                              padding: '0 6px',
                              lineHeight: '18px'
                            }}
                          >
                            CFI - User
                          </Tag>
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
                    background: isDarkMode ? '#141414' : '#ffffff',
                    height: 'calc(100vh - 80px)',
                    overflowY: 'auto',
                    padding: '8px 0',
                  }}
                  className="custom-menu"
                />
              </Sider>
            )}

            <Layout className="flex-1 overflow-auto">
              {/* Desktop Header */}
              {!isMobile && (
                <Header className="flex items-center h-16 p-0" style={{
                  background: isDarkMode ? '#1f1f1f' : '#ffffff',
                  borderBottom: `1px solid ${isDarkMode ? '#303030' : '#f0f0f0'}`,
                  position: 'sticky',
                  top: 0,
                  zIndex: 100,
                }}>
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
                <Header className="p-0" style={{ height: 'auto', lineHeight: 'normal' }}>
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
                  background: isDarkMode ? '#141414' : '#ffffff',
                  color: isDarkMode ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.88)',
                  marginTop: isMobile ? 0 : isHorizontal ? 0 : 0
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