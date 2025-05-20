import {
  LogoutOutlined,
  MenuUnfoldOutlined,
  QuestionOutlined,
  SwapOutlined,
  TeamOutlined,
  UnlockOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useNavigate } from "@remix-run/react";
import { Card, Col, List, Row, Space, Spin } from "antd";
import { useState } from "react";
import { useAuth } from "~/auth/AuthContext";

export default function Setting() {
  const [loading, setLoading] = useState(false);
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const data = [
    {
      title: "Timezone:",
      description: "US/Pacific",
    },
    {
      title: "Table Storage",
      description: "500MB",
    },
    {
      title: "Database Driver",
      description: "mysql",
    },
    {
      title: "Version",
      description: "0.0.1",
    },
  ];

  const handleClick = () => {
    console.log("Card clicked!");
    // Add your action here (e.g., navigation, modal, etc.)
  };

  const handleSignout = async () => {
    setLoading(true);
    await signOut();
    setLoading(false);
    navigate("/");
  };

  const handleLandingPage = async () => {
    setLoading(true);
    navigate("/landing-page");
    setLoading(false);
  };

  return (
    <Row>
      {loading && <Spin className="mb-8" />}

      <Col span={24}>
        <div className="flex flex-wrap gap-6">
          <Card
            className="border-gray-300"
            hoverable // Adds a hover effect
            onClick={handleClick}
            style={{
              width: 200,
              textAlign: "center",
              cursor: "pointer",
            }}
          >
            <Space direction="vertical" size={16}>
              <MenuUnfoldOutlined
                style={{ fontSize: "32px", color: "#1890ff" }}
              />
              <p>General Settings</p>
            </Space>
          </Card>

          <Card
            className="border-gray-300"
            hoverable // Adds a hover effect
            onClick={handleClick}
            style={{
              width: 200,
              textAlign: "center",
              cursor: "pointer",
            }}
          >
            <Space direction="vertical" size={16}>
              <UserOutlined style={{ fontSize: "32px", color: "#1890ff" }} />
              <p>User Info</p>
            </Space>
          </Card>

          <Card
            className="border-gray-300"
            hoverable // Adds a hover effect
            onClick={handleClick}
            style={{
              width: 200,
              textAlign: "center",
              cursor: "pointer",
            }}
          >
            <Space direction="vertical" size={16}>
              <UnlockOutlined style={{ fontSize: "32px", color: "#1890ff" }} />
              <p>Change Password</p>
            </Space>
          </Card>

          <Card
            className="border-gray-300"
            hoverable // Adds a hover effect
            onClick={handleLandingPage}
            style={{
              width: 200,
              textAlign: "center",
              cursor: "pointer",
            }}
          >
            <Space direction="vertical" size={16}>
              <SwapOutlined style={{ fontSize: "32px", color: "#1890ff" }} />
              <p>Back To Landing Page</p>
            </Space>
          </Card>

          <Card
            className="border-gray-300"
            hoverable // Adds a hover effect
            onClick={handleSignout}
            style={{
              width: 200,
              textAlign: "center",
              cursor: "pointer",
            }}
          >
            <Space direction="vertical" size={16}>
              <LogoutOutlined style={{ fontSize: "32px", color: "#f70000" }} />
              <p>Sign-Out</p>
            </Space>
          </Card>
        </div>
      </Col>
      <Col span={24}>
        <List
          className="mt-6"
          itemLayout="horizontal"
          dataSource={data}
          renderItem={(item, index) => (
            <List.Item>
              <List.Item.Meta
                avatar={<QuestionOutlined />}
                title={item.title}
                description={item.description}
              />
            </List.Item>
          )}
        />
      </Col>
    </Row>
  );
}
