import React, { useState } from "react";
import {
  ApartmentOutlined,
  AuditOutlined,
  DropboxOutlined,
} from "@ant-design/icons";
import type { MenuProps, TabsProps } from "antd";
import { Card, Carousel, Space } from "antd";
import {
  useNavigate,
} from "@remix-run/react";
import { supabase } from "~/lib/supabase";

type MenuItem = Required<MenuProps>["items"][number];

const contentStyle: React.CSSProperties = {
  textAlign: "center",
  justifyContent: "center",
};

export default function LandingPage() {
  const navigate = useNavigate();
  //   const { access_token, user } = useSupabaseAuth();
  const onUser = async () => {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) throw error;
      console.log("test3", user?.id);
    } catch (error) {
      return { error };
    }
  };

  React.useEffect(() => {
    // const userData = localStorage.getItem("sb-auth-token");
    // onUser();
    // if (userData) {
    //   console.log("LocalStorage user:", JSON.parse(userData));
    // }
  }, []);

  const handleClickInventory = async () => {
    await localStorage.setItem('main', '1');
    await navigate("/inventory");
  }

  const handleClickBudget = async () => {
    await localStorage.setItem('main', '2');
    navigate("/budget");
  }

  const handleClickWorkflow = async () => {
    navigate("/workflow");
  }

  // const onClick: MenuProps["onClick"] = (e) => {
  //   if (e.key == "1") {
  //     navigate("/inventory");
  //   } else if (e.key == "2") {
  //     navigate("/budget-tracker");
  //   } else if (e.key == "3") {
  //     navigate("/workflow-tracker");
  //   }
  // };

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: (
        <div>
          <DropboxOutlined /> Inventory
        </div>
      ),
    },
    {
      key: "2",
      label: (
        <div>
          <AuditOutlined /> Budget Tracker
        </div>
      ),
    },
    {
      key: "3",
      label: (
        <div>
          <ApartmentOutlined /> Workflow Tracker
        </div>
      ),
    },
  ];

  return (
    <div className="h-full">
      <div className="h-auto">
        <div className="flex justify-center pt-4">
          <img className="h-16" src="./img/cficoop.svg" alt="cficoop" />
        </div>

        <div className="flex flex-wrap gap-6 justify-center mt-2 mb-2">
          <Card
            className="border-gray-300"
            hoverable // Adds a hover effect
            onClick={handleClickInventory}
            style={{
              width: 200,
              textAlign: "center",
              cursor: "pointer",
            }}
          >
            <Space direction="vertical" size={16}>
              <DropboxOutlined
                style={{ fontSize: "32px", color: "#573019" }}
              />
              <p className="text-2xl">Inventory</p>
            </Space>
          </Card>
          <Card
            className="border-gray-300"
            hoverable // Adds a hover effect
            onClick={handleClickBudget}
            style={{
              width: 200,
              textAlign: "center",
              cursor: "pointer",
            }}
          >
            <Space direction="vertical" size={16}>
              <AuditOutlined
                style={{ fontSize: "32px", color: "#1890ff" }}
              />
              <p className="text-2xl">Budget Tracker</p>
            </Space>
          </Card>
          <Card
            className="border-gray-300"
            hoverable // Adds a hover effect
            onClick={handleClickWorkflow}
            style={{
              width: 200,
              textAlign: "center",
              cursor: "pointer",
            }}
          >
            <Space direction="vertical" size={16}>
              <ApartmentOutlined
                style={{ fontSize: "32px", color: "#00ed63" }}
              />
              <p className="text-2xl">Workflow Tracker</p>
            </Space>
          </Card>
        </div>
        {/* <div className="">
          <Menu
            style={contentStyle}
            onClick={onClick}
            mode="horizontal"
            items={items}
          />
        </div> */}
        <div className="grid grid-cols-1">
          <Carousel autoplay={{ dotDuration: true }} autoplaySpeed={3000}>
            <div>
              <h3>
                <img
                  className="h-[100%]"
                  src="./img/cfionline.jpg"
                  alt="cfi-online"
                />
              </h3>
            </div>
            <div>
              <h3>
                <img
                  className="h-[100%]"
                  src="./img/cfi-bills-payment.jpg"
                  alt="cfi-bills"
                />
              </h3>
            </div>
            <div>
              <h3>
                <img
                  className="h-[100%]"
                  src="./img/cfi-cpp.jpg"
                  alt="cfi-bills"
                />
              </h3>
            </div>
          </Carousel>
        </div>
        {/* <footer className="bg-gray-800 text-white p-6">
          <div className="container mx-auto">
            <p className="text-center">© 2025 CFI. All rights reserved.</p>
          </div>
        </footer> */}
      </div>
    </div>
  );
}
