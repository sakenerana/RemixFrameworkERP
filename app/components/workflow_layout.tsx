import { useEffect, useState } from "react";
import {
  ApartmentOutlined,
  AuditOutlined,
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
import { Button, Input, Layout, Menu, Space, theme, Image, Modal, ConfigProvider, Switch } from "antd";
import { Link, Outlet } from "@remix-run/react";
import {
  FcGlobe,
  FcSearch,
  FcSettings,
  FcTemplate,
  FcTreeStructure,
} from "react-icons/fc";
import Setting from "~/routes/settings/settings";

const { Header, Sider, Content } = Layout;

export default function WorkflowLayoutIndex() {
  const [collapsed, setCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHorizontal, setIsHorizontal] = useState(false);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage or system preference
    return localStorage.getItem('theme') === 'dark' ||
      window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    // Save preference to localStorage
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');

    // Optional: Update body class for global styles
    document.body.className = isDarkMode ? 'dark-mode' : 'light-mode';
  }, [isDarkMode]);

  const [isFullscreen, setIsFullscreen] = useState(false);

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

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleTrack = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const menuItems = [
    {
      key: "1",
      icon: <FcGlobe />,
      label: <Link to="/workflow">Dashboard</Link>,
    },
    {
      key: "2",
      icon: <FcTemplate />,
      label: <Link to="/workflow/workflows">Workflow</Link>,
    },
    {
      key: "3",
      icon: <FcTreeStructure />,
      label: <Link to="/workflow/workflow-tracker">Tracker</Link>,
    },
  ];

  return (
    <div className="flex">
      <ConfigProvider
        theme={{
          algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
          token: {
            // Force white text in dark mode
            colorText: isDarkMode ? '#ffffff' : undefined, // Primary text
            colorTextSecondary: isDarkMode ? '#e6e6e6' : undefined, // Secondary text
            colorTextTertiary: isDarkMode ? '#cccccc' : undefined, // Tertiary text
            colorTextQuaternary: isDarkMode ? '#b3b3b3' : undefined, // Quaternary text
          },
          components: {
            Layout: {
              headerBg: isDarkMode ? '#1f1f1f' : '#001529',
              bodyBg: isDarkMode ? '#141414' : '#f5f5f5',
              // Force white text in header
              colorText: isDarkMode ? '#ffffff' : undefined,
            },
            // Add other component-specific overrides as needed
            Typography: {
              colorText: isDarkMode ? '#ffffff' : undefined,
            },
            Menu: {
              colorText: isDarkMode ? '#ffffff' : undefined,
            },
            Button: {
              colorText: isDarkMode ? '#ffffff' : undefined,
            },
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
        <Layout className="flex flex-col h-screen">
          {!isHorizontal && (
            <Sider
              trigger={null}
              collapsible
              collapsed={collapsed}
              width={250}
              style={{
                background: isDarkMode ? '#141414' : '#ffffff',
                borderRight: isDarkMode ? '1px solid #303030' : '1px solid #f0f0f0',
                height: '100vh',
                position: 'sticky',
                top: 0,
                left: 0,
              }}
            >
              <div style={{
                height: 64,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: isDarkMode ? '#1f1f1f' : '#fafafa',
                color: isDarkMode ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.88)'
              }}>
                {collapsed ? <img src="./img/user.png" alt="User" width={50} /> :
                  <div className="flex flex-wrap">
                    <img src="./img/user.png" alt="User" width={30} />
                    <span className="mt-1 ml-4">Charls Dave Erana</span>
                  </div>}
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
          <Layout>
            <Header
              style={{
                padding: 0,
                background: isDarkMode ? '#1f1f1f' : '#ffffff',
                borderBottom: isDarkMode ? '1px solid #303030' : '1px solid #f0f0f0'
              }}
              className="flex items-center"
            >

              <Space style={{ marginLeft: 16 }}>
                {isHorizontal ? null : (
                  <>
                    <Button
                      type="text"
                      icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                      onClick={() => setCollapsed(!collapsed)}
                      style={{
                        fontSize: "16px",
                        width: 64,
                        height: 64,
                        color: isDarkMode ? 'rgba(255, 255, 255, 0.85)' : '#303030'
                      }}
                      className="hover:bg-[rgba(255,255,255,0.1)]"
                    />

                    <div className="ml-4">
                      <Image
                        width={270}
                        src={isDarkMode ? './img/cficoop-white.png' : './img/cficoop.svg'}
                        preview={false}
                        className="mt-5"
                      />
                    </div>
                  </>
                )}

                {/* Horizontal Menu (when in horizontal mode) */}
                {isHorizontal && (
                  <Menu
                    theme={isDarkMode ? 'dark' : 'light'}
                    mode="horizontal"
                    defaultSelectedKeys={['1']}
                    items={menuItems}
                    style={{
                      flex: 1,
                      minWidth: 0,
                      background: isDarkMode ? '#1f1f1f' : '#ffffff',
                      lineHeight: '64px',
                    }}
                  />
                )}
              </Space>


              <div className="flex-1">
                <div className="flex justify-end items-center h-full pr-4">
                  <Space className="gap-2">

                    <Switch
                      checkedChildren={<MoonOutlined className="text-white" />}
                      unCheckedChildren={<SunOutlined className="text-yellow-500" />}
                      checked={isDarkMode}
                      onChange={() => setIsDarkMode(prev => !prev)}
                      className={isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}
                    />

                    <Button
                      type="text"
                      icon={isHorizontal ? <VerticalAlignTopOutlined /> : <MenuOutlined />}
                      onClick={() => setIsHorizontal(!isHorizontal)}
                      style={{
                        color: isDarkMode ? 'rgba(255, 255, 255, 0.85)' : '#303030'
                      }}
                    >
                      {isHorizontal ? 'Vertical' : 'Horizontal'}
                    </Button>

                    <Button
                      icon={isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
                      type="text"
                      className="text-white hover:bg-[rgba(255,255,255,0.1)]"
                      style={{
                        color: isDarkMode ? 'rgba(255, 255, 255, 0.85)' : '#303030'
                      }}
                      onClick={toggleFullscreen}
                    >Screen</Button>

                    <Link to="/landing-page">
                      <Button
                        icon={<SwapOutlined />}
                        type="text"
                        className="text-white hover:bg-[rgba(255,255,255,0.1)]"
                        style={{
                          color: isDarkMode ? 'rgba(255, 255, 255, 0.85)' : '#303030'
                        }}
                      >Switch</Button>
                    </Link>

                    <Button
                      onClick={() => handleTrack()}
                      icon={<FcSettings />}
                      type="text"
                      className="text-white hover:bg-[rgba(255,255,255,0.1)]"
                      style={{
                        color: isDarkMode ? 'rgba(255, 255, 255, 0.85)' : '#303030'
                      }}
                    >
                      Settings
                    </Button>
                  </Space>
                </div>
              </div>

              <Modal
                className={isDarkMode ? 'dark-modal' : ''}
                styles={{
                  content: {
                    background: isDarkMode ? '#1f1f1f' : '#ffffff',
                    color: isDarkMode ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.88)'
                  },
                  header: {
                    background: isDarkMode ? '#1f1f1f' : '#ffffff',
                    borderBottom: isDarkMode ? '1px solid #303030' : '1px solid #f0f0f0'
                  }
                }}
                style={{ top: 20 }}
                width={600}
                title={
                  <div className="flex items-center gap-2">
                    <FcSettings className="mt-1" />
                    <span className={isDarkMode ? 'text-white' : 'text-gray-800'}>Settings</span>
                  </div>
                }
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={null}
              >
                <Setting onSendData={(data: any) => setIsModalOpen(data)} />
              </Modal>
            </Header>
            <Content
              className={`flex flex-col h-full overflow-auto themed-scrollbar ${isDarkMode ? 'dark-scrollbar' : 'light-scrollbar'
                }`}
              style={{
                margin: "24px 16px",
                padding: 24,
                background: isDarkMode ? '#141414' : '#ffffff',
                borderRadius: 8,
                color: isDarkMode ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.88)'
              }}
            >
              <Outlet />
            </Content>
            <div className="flex justify-between">
              <div className="w-fit pl-5 pb-5">
                Ant Design using Remix <b>©{new Date().getFullYear()}</b>
              </div>
              <div className="pr-5">
                <b>Developed by:</b> CFI IT Department
              </div>
            </div>
          </Layout>
        </Layout>
      </ConfigProvider>
    </div>
  );
}
