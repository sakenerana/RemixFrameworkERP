import { useEffect, useState } from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined, MoonOutlined, SunOutlined, SwapOutlined } from "@ant-design/icons";
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
} from "antd";
import { Link, Outlet } from "@remix-run/react";
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
import Setting from "~/routes/settings/settings";

const { Header, Sider, Content } = Layout;

export default function InventoryLayoutIndex() {
  const [collapsed, setCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const items = [
    {
      key: "1",
      icon: <FcPackage />,
      label: <Link to="/inventory/assets/list-assets/create-assets">Assets</Link>,
    },
    {
      key: "2",
      icon: <FcDiploma1 />,
      label: <Link to="/inventory/licenses/create-license">Licenses</Link>,
    },
    {
      key: "3",
      icon: <FcMultipleDevices />,
      label: <Link to="/inventory/accessories/create-accessory">Accessories</Link>,
    },
    {
      key: "4",
      icon: <FcNews />,
      label: <Link to="/inventory/consumables/create-consumable">Consumables</Link>,
    },
    {
      key: "5",
      icon: <FcMultipleSmartphones />,
      label: <Link to="/inventory/components/create-component">Tech Components</Link>,
    },
    // {
    //   key: "6",
    //   icon: <FcPortraitMode />,
    //   label: <Link to="/inventory/users/create-user">Users</Link>,
    // },
  ];

  const menuItems = [
    {
      key: "1",
      icon: <FcGlobe />,
      label: <Link to="/inventory">Dashboard</Link>,
    },
    {
      key: "11",
      icon: <FcSalesPerformance />,
      label: <Link to="/inventory/assets">Assets</Link>,
    },
    // {
    //   key: "11",
    //   icon: <FcSalesPerformance />,
    //   label: <Link to="/inventory/users">Assets</Link>,
    //   children: [
    //     {
    //       key: "11.1",
    //       icon: <FcInspection />,
    //       label: <Link to="/inventory/assets/requested">Requested</Link>,
    //     },
    //     {
    //       key: "11.2",
    //       icon: <FcCancel />,
    //       label: <Link to="/inventory/assets/deleted">Deleted</Link>,
    //     },
    //     {
    //       key: "11.3",
    //       icon: <FcPackage />,
    //       label: <Link to="/inventory/assets/list-assets">Assets</Link>,
    //     },
    //   ],
    // },
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
      label: (
        <Link to="/inventory/predefined-kit">
          Predefined Kits
        </Link>
      ),
    },
    // {
    //   key: "5",
    //   icon: <FcPortraitMode />,
    //   label: <Link to="/inventory/users">Users</Link>,
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
        // {
        //   key: "2.2",
        //   icon: <FcDepartment />,
        //   label: (
        //     <Link to="/inventory/settings/departments">Departments</Link>
        //   ),
        // },
        {
          key: "2.3",
          icon: <FcFlowChart />,
          label: (
            <Link to="/inventory/settings/categories">Categories</Link>
          ),
        },
        {
          key: "2.4",
          icon: <FcFactory />,
          label: (
            <Link to="/inventory/settings/manufacturers">
              Manufacturers
            </Link>
          ),
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
          label: (
            <Link to="/inventory/settings/depreciation">Depreciation</Link>
          ),
        },
        {
          key: "2.8",
          icon: <FcMultipleDevices />,
          label: (
            <Link to="/inventory/settings/asset-model">Asset Model</Link>
          ),
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
          label: (
            <Link to="/inventory/reports/activity-report">
              Activity Report
            </Link>
          ),
        },
        {
          key: "3.2",
          icon: <FcComboChart />,
          label: (
            <Link to="/inventory/reports/custom-asset-report">
              Custom Asset Report
            </Link>
          ),
        },
        // {
        //   key: "3.3",
        //   icon: <FcComboChart />,
        //   label: <Link to="/inventory/reports/audit-log">Audit Log</Link>,
        // },
        // {
        //   key: "3.4",
        //   icon: <FcComboChart />,
        //   label: (
        //     <Link to="/inventory/reports/depreciation-report">
        //       Depreciation Report
        //     </Link>
        //   ),
        // },
        // {
        //   key: "3.5",
        //   icon: <FcComboChart />,
        //   label: (
        //     <Link to="/inventory/reports/licenses-report">
        //       License Report
        //     </Link>
        //   ),
        // },
        // {
        //   key: "3.6",
        //   icon: <FcComboChart />,
        //   label: (
        //     <Link to="/inventory/reports/asset-maintenance-report">
        //       Asset Maitenance Report
        //     </Link>
        //   ),
        // },
        // {
        //   key: "3.7",
        //   icon: <FcComboChart />,
        //   label: (
        //     <Link to="/inventory/reports/unaccepted-assets">
        //       Unaccepted Assets
        //     </Link>
        //   ),
        // },
        // {
        //   key: "3.8",
        //   icon: <FcComboChart />,
        //   label: (
        //     <Link to="/inventory/reports/accessory-report">
        //       Accessory Report
        //     </Link>
        //   ),
        // },
      ],
    },
    // {
    //   key: "4",
    //   icon: <FcOk />,
    //   label: (
    //     <Link to="/inventory/requestable-items">Requestable Items</Link>
    //   ),
    // },
  ]

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
          <Sider
            className="h-screen sticky top-0"
            trigger={null}
            collapsible
            collapsed={collapsed}
            width={250}
            theme={isDarkMode ? "dark" : "light"}
            style={{
              background: isDarkMode ? '#141414' : '#ffffff',
              borderRight: isDarkMode ? '1px solid #303030' : '1px solid #f0f0f0'
            }}
          >
            <div
              className="demo-logo-vertical"
              style={{
                background: isDarkMode ? '#1f1f1f' : '#fafafa',
                color: isDarkMode ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.88)'
              }}
            />

            <Menu
              theme={isDarkMode ? 'dark' : 'light'}
              mode="inline"
              defaultSelectedKeys={["1"]}
              items={menuItems}
              style={{
                background: isDarkMode ? '#141414' : '#ffffff',
                borderRight: 'none'
              }}
              className="h-[calc(100vh-64px)] overflow-y-auto"
            />
          </Sider>
          <Layout>
            <Header
              style={{
                padding: 0,
                background: isDarkMode ? '#1f1f1f' : '#ffffff',
                borderBottom: isDarkMode ? '1px solid #303030' : '1px solid #f0f0f0'
              }}
              className="flex items-center"
            >
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

              <div className="flex-1">
                <div className="flex justify-end items-center h-full pr-4">
                  <Space className="gap-3">
                    <Switch
                      checkedChildren={<MoonOutlined className="text-white" />}
                      unCheckedChildren={<SunOutlined className="text-yellow-500" />}
                      checked={isDarkMode}
                      onChange={() => setIsDarkMode(prev => !prev)}
                      className={isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}
                    />

                    <Link to="/landing-page">
                      <Button
                        icon={<SwapOutlined />}
                        type="text"
                        className="text-white hover:bg-[rgba(255,255,255,0.1)]"
                        style={{
                          color: isDarkMode ? 'rgba(255, 255, 255, 0.85)' : '#303030'
                        }}
                      />
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
              className="flex flex-col h-full overflow-auto"
              style={{
                margin: "24px 16px",
                padding: 24,
                background: isDarkMode ? '#141414' : '#ffffff',  // Dark: dark gray, Light: white
                borderRadius: 8,  // Using standard border radius
                color: isDarkMode ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.88)'
              }}
            >
              <Outlet />
            </Content>
            <div className="flex justify-between">
              <div className="w-fit pl-5 pb-5">
                Ant Design using Remix <b>©{new Date().getFullYear()}</b> Inspired
                by <b>SnipeIT</b>
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
