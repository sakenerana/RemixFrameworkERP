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
} from "antd";
import { Link, Outlet } from "@remix-run/react";
import {
  FcComboChart,
  FcDiploma1,
  FcGlobe,
  FcSalesPerformance,
  FcSettings,
} from "react-icons/fc";
import Setting from "~/routes/settings/settings";
import ScrollingAttentionBanner from "./scrolling_attention";
import MovingAttentionAlert from "./attention";

const { Header, Sider, Content } = Layout;

interface MenuItem {
  key: string;
  icon: React.ReactNode;
  label: React.ReactNode;
}

export default function BudgetLayoutIndex() {
  const [collapsed, setCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHorizontal, setIsHorizontal] = useState(false);
  const [isFname, setIsFname] = useState('');
  const [isLname, setIsLname] = useState('');
  const [isMobile, setIsMobile] = useState(false);

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
      label: <Link to="/budget">Dashboard</Link>,
    },
    {
      key: "2",
      icon: <FcDiploma1 />,
      label: <Link to="/budget/transactions">Transactions</Link>,
    },
    {
      key: "3",
      icon: <FcSalesPerformance />,
      label: <Link to="/budget/budgets">Budgets</Link>,
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
      label: 'Settings',
      icon: <FcSettings />,
      onClick: handleTrack
    },
    {
      key: '4',
      label: 'Switch App',
      icon: <SwapOutlined />,
      onClick: () => window.location.href = '/landing-page'
    }
  ];

  return (
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
              width={250}
              breakpoint="lg"
              onBreakpoint={(broken) => {
                setCollapsed(broken);
              }}
              style={{
                background: isDarkMode ? '#141414' : '#ffffff',
                borderRight: isDarkMode ? '1px solid #303030' : '1px solid #f0f0f0',
              }}
            >
              <div className="h-16 flex items-center justify-center" style={{
                background: isDarkMode ? '#1f1f1f' : '#fafafa',
                color: isDarkMode ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.88)'
              }}>
                {collapsed ? (
                  <img src="/img/user.png" alt="User" width={40} className="rounded-full" />
                ) : (
                  <div className="flex items-center px-4 w-full">
                    <img src="/img/user.png" alt="User" width={30} className="rounded-full" />
                    <span className="ml-3 font-medium truncate">{isFname} {isLname}</span>
                  </div>
                )}
              </div>
              <Menu
                theme={isDarkMode ? 'dark' : 'light'}
                mode="inline"
                defaultSelectedKeys={['1']}
                items={menuItems}
                style={{
                  background: isDarkMode ? '#141414' : '#ffffff',
                  height: 'calc(100vh - 64px)',
                  overflowY: 'auto',
                }}
              />
            </Sider>
          )}

          <Layout className="flex-1 overflow-auto">
            {/* Desktop Header */}
            {!isMobile && (
              <Header className="flex items-center" style={{
                padding: 0,
                background: isDarkMode ? '#1f1f1f' : '#ffffff',
                borderBottom: isDarkMode ? '1px solid #303030' : '1px solid #f0f0f0'
              }}>
                <Space style={{ marginLeft: 16 }}>
                  {!isHorizontal && (
                    <Button
                      type="text"
                      icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                      onClick={toggleSidebar}
                      style={{
                        fontSize: "16px",
                        width: 64,
                        height: 64,
                        color: isDarkMode ? 'rgba(255, 255, 255, 0.85)' : '#303030'
                      }}
                    />
                  )}
                  <div className="ml-4">
                    <Image
                      className="mt-4"
                      width={200}
                      src={isDarkMode ? '/img/cficoop-white.png' : '/img/cficoop.svg'}
                      preview={false}
                    />
                  </div>
                </Space>

                <div className="flex-1">
                  <div className="flex justify-end items-center h-full pr-4">
                    <Space className="gap-2">
                      <Switch
                        checkedChildren={<MoonOutlined />}
                        unCheckedChildren={<SunOutlined />}
                        checked={isDarkMode}
                        onChange={toggleDarkMode}
                        className={isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}
                      />
                      {!isMobile && (
                        <Button
                          type="text"
                          icon={isHorizontal ? <VerticalAlignTopOutlined /> : <MenuOutlined />}
                          onClick={toggleLayout}
                        >
                          {isHorizontal ? 'Vertical' : 'Horizontal'}
                        </Button>
                      )}
                      <Button
                        icon={isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
                        onClick={toggleFullscreen}
                      >
                        Screen
                      </Button>
                      <Link to="/landing-page">
                        <Button icon={<SwapOutlined />}>Switch</Button>
                      </Link>
                      <Button
                        onClick={handleTrack}
                        icon={<FcSettings />}
                      >
                        Settings
                      </Button>
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
  );
}