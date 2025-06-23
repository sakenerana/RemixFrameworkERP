import { useState } from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined, SwapOutlined } from "@ant-design/icons";
import {
  Button,
  Layout,
  Menu,
  Space,
  theme,
  Image,
  Modal,
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
      <Layout className="flex flex-col h-screen">
        <Sider className="h-full" trigger={null} collapsible collapsed={collapsed} width={250}>
          <div className="demo-logo-vertical" />
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={["1"]}
            items={menuItems}
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
              <Image width={270} src="./img/cficoop.svg" />
            </div>
            <div className="flex-1">
              <div className="flex justify-end">
                <Space>
                  <Link to="/landing-page">
                    <Button icon={<SwapOutlined />} type="text">

                    </Button>
                  </Link>
                  {/* <Space.Compact style={{ width: "100%" }}>
                    <Input placeholder="Search by Asset Tag" />
                    <Button icon={<FcSearch />} type="default">
                      Search
                    </Button>
                  </Space.Compact> */}
                  {/* <Dropdown menu={{ items }} placement="topLeft">
                    <Button icon={<FcPlus />}>Create New</Button>
                  </Dropdown> */}
                  <Button
                    onClick={() => handleTrack()}
                    icon={<FcSettings />}
                    type="text"
                  >
                    Settings
                  </Button>
                  <Modal
                    className=""
                    style={{ top: 20 }}
                    width={600}
                    title={<p className="flex flex-wrap gap-2"><FcSettings className="mt-1" /> Settings</p>}
                    closable={{ "aria-label": "Custom Close Button" }}
                    open={isModalOpen}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    footer=""
                  >
                    <Setting onSendData={(data: any) => setIsModalOpen(data)}></Setting>
                  </Modal>
                </Space>
              </div>
            </div>
          </Header>
          <Content
            className="flex flex-col h-full overflow-auto"
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
              <b>Developed by:</b> CFI IT Department
            </div>
          </div>
        </Layout>
      </Layout>
    </div>
  );
}
