import { useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SwapOutlined,
} from "@ant-design/icons";
import {
  Button,
  Dropdown,
  Layout,
  Menu,
  Space,
  theme,
  Image,
  Modal,
} from "antd";
import { Link, Outlet } from "@remix-run/react";
import {
  FcComboChart,
  FcDiploma1,
  FcGlobe,
  FcPlus,
  FcRules,
  FcSalesPerformance,
  FcSettings,
} from "react-icons/fc";
import Setting from "~/routes/settings/settings";

const { Header, Sider, Content } = Layout;

export default function BudgetLayoutIndex() {
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
    // {
    //   key: "1",
    //   icon: <FcRules />,
    //   label: <Link to="/budget/accounts/create-accounts">Accounts</Link>,
    // },
    // {
    //   key: "2",
    //   icon: <FcDiploma1 />,
    //   label: (
    //     <Link to="/budget/transactions/create-transactions">Transactions</Link>
    //   ),
    // },
    {
      key: "3",
      icon: <FcSalesPerformance />,
      label: <Link to="/budget/budgets/create-budget">Budgets</Link>,
    },
  ];

  const menuItems = [
    {
      key: "1",
      icon: <FcGlobe />,
      label: <Link to="/budget">Dashboard</Link>,
    },
    // {
    //   key: "2",
    //   icon: <FcRules />,
    //   label: <Link to="/budget/accounts">Accounts</Link>,
    // },
    {
      key: "3",
      icon: <FcDiploma1 />,
      label: <Link to="/budget/transactions">Transactions</Link>,
    },
    {
      key: "4",
      icon: <FcSalesPerformance />,
      label: <Link to="/budget/budgets">Budgets</Link>,
    },
    // {
    //   key: "5",
    //   icon: <FcComboChart />,
    //   label: <Link to="/budget/budget-reports">Reports</Link>,
    // },
  ];

  return (
    <div className="flex">
      <Layout className="flex flex-col h-screen">
        <Sider
          className="h-full"
          trigger={null}
          collapsible
          collapsed={collapsed}
          width={250}
        >
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
                    <Button icon={<SwapOutlined />} type="text"></Button>
                  </Link>
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
                    title={<p className="flex flex-wrap gap-2"><FcSettings className="mt-1" /> Settings</p> }
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
