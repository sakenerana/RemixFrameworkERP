import { useState } from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import {
  Button,
  Dropdown,
  Input,
  Layout,
  Menu,
  Space,
  theme,
  Image,
} from "antd";
import { Link, Outlet } from "@remix-run/react";
import {
  FcAutomatic,
  FcBearish,
  FcBullish,
  FcCancel,
  FcComboChart,
  FcConferenceCall,
  FcDepartment,
  FcDiploma1,
  FcFactory,
  FcFlowChart,
  FcGlobe,
  FcInspection,
  FcLandscape,
  FcMultipleDevices,
  FcMultipleSmartphones,
  FcNews,
  FcOk,
  FcPackage,
  FcPaid,
  FcPlus,
  FcPortraitMode,
  FcSalesPerformance,
  FcSearch,
  FcSettings,
} from "react-icons/fc";

const { Header, Sider, Content } = Layout;

export default function LayoutIndex() {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const items = [
    {
      key: "1",
      icon: <FcPackage />,
      label: <Link to="/main/users">Assets</Link>,
    },
    {
      key: "2",
      icon: <FcDiploma1 />,
      label: <Link to="/main/users">Licenses</Link>,
    },
    {
      key: "3",
      icon: <FcMultipleDevices />,
      label: <Link to="/main/users">Accessories</Link>,
    },
    {
      key: "4",
      icon: <FcNews />,
      label: <Link to="/main/users">Consumables</Link>,
    },
    {
      key: "5",
      icon: <FcMultipleSmartphones />,
      label: <Link to="/main/users">Tech Components</Link>,
    },
    {
      key: "6",
      icon: <FcPortraitMode />,
      label: <Link to="/main/users">Users</Link>,
    },
  ];

  return (
    <div className="flex">
      <Layout className="flex flex-col h-full">
        <Sider trigger={null} collapsible collapsed={collapsed} width={250}>
          <div className="demo-logo-vertical" />
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={["1"]}
            items={[
              {
                key: "1",
                icon: <FcGlobe />,
                label: <Link to="/main/dashboard">Dashboard</Link>,
              },
              {
                key: "11",
                icon: <FcSalesPerformance />,
                label: <Link to="/main/users">Assets</Link>,
                children: [
                  {
                    key: "11.1",
                    icon: <FcInspection />,
                    label: <Link to="/main/assets/requested">Requested</Link>,
                  },
                  {
                    key: "11.2",
                    icon: <FcCancel />,
                    label: <Link to="/main/assets/deleted">Deleted</Link>,
                  },
                  {
                    key: "11.3",
                    icon: <FcPackage />,
                    label: <Link to="/main/assets/list-assets">Assets</Link>,
                  },
                ],
              },
              {
                key: "10",
                icon: <FcDiploma1 />,
                label: <Link to="/main/licenses">Licenses</Link>,
              },
              {
                key: "9",
                icon: <FcMultipleDevices />,
                label: <Link to="/main/accessories">Accessories</Link>,
              },
              {
                key: "8",
                icon: <FcNews />,
                label: <Link to="/main/consumables">Consumables</Link>,
              },
              {
                key: "7",
                icon: <FcMultipleSmartphones />,
                label: <Link to="/main/components">Tech Components</Link>,
              },
              {
                key: "6",
                icon: <FcPaid />,
                label: (
                  <Link to="/main/predefined-kit">
                    Predefined Kits (Bundled)
                  </Link>
                ),
              },
              {
                key: "5",
                icon: <FcPortraitMode />,
                label: <Link to="/main/users">Users</Link>,
              },
              {
                key: "2",
                icon: <FcAutomatic />,
                label: "Settings",
                children: [
                  {
                    key: "2.1",
                    icon: <FcConferenceCall />,
                    label: <Link to="/main/settings/suppliers">Suppliers</Link>,
                  },
                  {
                    key: "2.2",
                    icon: <FcDepartment />,
                    label: (
                      <Link to="/main/settings/departments">Departments</Link>
                    ),
                  },
                  {
                    key: "2.3",
                    icon: <FcFlowChart />,
                    label: (
                      <Link to="/main/settings/categories">Categories</Link>
                    ),
                  },
                  {
                    key: "2.4",
                    icon: <FcFactory />,
                    label: (
                      <Link to="/main/settings/manufacturers">
                        Manufacturers
                      </Link>
                    ),
                  },
                  {
                    key: "2.5",
                    icon: <FcLandscape />,
                    label: <Link to="/main/settings/locations">Locations</Link>,
                  },
                  {
                    key: "2.6",
                    icon: <FcDepartment />,
                    label: <Link to="/main/settings/companies">Companies</Link>,
                  },
                  {
                    key: "2.7",
                    icon: <FcBearish />,
                    label: (
                      <Link to="/main/settings/depreciation">Depreciation</Link>
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
                      <Link to="/main/reports/activity-report">
                        Activity Report
                      </Link>
                    ),
                  },
                  {
                    key: "3.2",
                    icon: <FcComboChart />,
                    label: (
                      <Link to="/main/reports/custom-asset-report">
                        Custom Asset Report
                      </Link>
                    ),
                  },
                  {
                    key: "3.3",
                    icon: <FcComboChart />,
                    label: <Link to="/main/reports/audit-log">Audit Log</Link>,
                  },
                  {
                    key: "3.4",
                    icon: <FcComboChart />,
                    label: (
                      <Link to="/main/reports/depreciation-report">
                        Depreciation Report
                      </Link>
                    ),
                  },
                  {
                    key: "3.5",
                    icon: <FcComboChart />,
                    label: (
                      <Link to="/main/reports/licenses-report">
                        License Report
                      </Link>
                    ),
                  },
                  {
                    key: "3.6",
                    icon: <FcComboChart />,
                    label: (
                      <Link to="/main/reports/asset-maintenance-report">
                        Asset Maitenance Report
                      </Link>
                    ),
                  },
                  {
                    key: "3.7",
                    icon: <FcComboChart />,
                    label: (
                      <Link to="/main/reports/unaccepted-assets">
                        Unaccepted Assets
                      </Link>
                    ),
                  },
                  {
                    key: "3.8",
                    icon: <FcComboChart />,
                    label: (
                      <Link to="/main/reports/accessory-report">
                        Accessory Report
                      </Link>
                    ),
                  },
                ],
              },
              {
                key: "4",
                icon: <FcOk />,
                label: (
                  <Link to="/main/requestable-items">Requestable Items</Link>
                ),
              },
            ]}
          />
        </Sider>
        <Layout>
          <Header
            style={{ padding: 0, background: colorBgContainer }}
            className="flex"
          >
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
              }}
            />
            <div>
              <Image width={270} src="/public/img/cficoop.svg" />
            </div>
            <div className="flex-1">
              <div className="flex justify-end">
                <Space>
                  <Space.Compact style={{ width: "100%" }}>
                    <Input placeholder="Search by Asset Tag" />
                    <Button icon={<FcSearch />} type="default">
                      Search
                    </Button>
                  </Space.Compact>
                  <Dropdown menu={{ items }} placement="topLeft">
                    <Button icon={<FcPlus />}>Create New</Button>
                  </Dropdown>
                  <Button icon={<FcSettings />} type="text">
                    Settings
                  </Button>
                </Space>
              </div>
            </div>
          </Header>
          <Content
            className="flex flex-col h-screen"
            style={{
              margin: "24px 16px",
              padding: 24,
              // minHeight: 'auto',
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
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
              <b>Email:</b> sakenerana@gmail.com &nbsp; <b>Contact:</b>{" "}
              +6309553713233
            </div>
          </div>
        </Layout>
      </Layout>
    </div>
  );
}
