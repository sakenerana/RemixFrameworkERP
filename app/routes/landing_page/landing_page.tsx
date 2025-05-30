import React, { useState } from "react";
import {
  ApartmentOutlined,
  AuditOutlined,
  DropboxOutlined,
} from "@ant-design/icons";
import type { MenuProps, TabsProps } from "antd";
import { Button, Card, Carousel, Space } from "antd";
import { Link, useNavigate } from "@remix-run/react";
import { supabase } from "~/lib/supabase";
import { AiOutlineReconciliation } from "react-icons/ai";
import { LuPackageSearch } from "react-icons/lu";
import { FaClipboardList, FaDollarSign } from "react-icons/fa";
import { BsShieldCheck } from "react-icons/bs";
import { Content } from "antd/es/layout/layout";

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
      // console.log("test3", user?.id);
    } catch (error) {
      return { error };
    }
  };

  const features = [
    {
      icon: <LuPackageSearch className="h-8 w-8 text-blue-500" />,
      title: "Inventory Management",
      description:
        "Track stock levels, manage suppliers, and streamline warehouse operations.",
      link: "/inventory",
    },
    {
      icon: <FaDollarSign className="h-8 w-8 text-green-500" />,
      title: "Budget Tracker",
      description:
        "Monitor expenses, set budget goals, and visualize financial performance.",
      link: "/budget",
    },
    {
      icon: <FaClipboardList className="h-8 w-8 text-orange-500" />,
      title: "Workflow Tracker",
      description:
        "Manage team workflows, assign tasks, and track progress in real-time.",
      link: "/workflow",
    },
    {
      icon: <BsShieldCheck className="h-8 w-8 text-purple-500" />,
      title: "Admin Panel",
      description:
        "Oversee user roles, permissions, and platform configurations.",
      link: "/admin",
    },
  ];

  return (
    <div className="min-h-screen bg-[url(./img/cfi-bills-payment.jpg)] p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-center pt-4">
          <img className="h-16" src="./img/cficoop.png" alt="cficoop" />
        </div>
        <h1 className="text-4xl font-bold mb-4 text-center text-white">
          Welcome to the ERP System
        </h1>
        <p className="text-lg text-white mb-10 text-center">
          Powerful tools to manage inventory, budgets, workflows, and admin
          controls.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="rounded-2xl shadow-md hover:shadow-2xl transition-shadow p-4 cursor-pointer"
            >
              <Link to={feature.link}>
                <div className="flex flex-col items-center text-center">
                  {feature.icon}
                  <h2 className="text-xl font-semibold mt-4 mb-2">
                    {feature.title}
                  </h2>
                  <p className="text-sm text-gray-500">{feature.description}</p>
                </div>
              </Link>
            </Card>
          ))}
        </div>

        <div className="mt-32 text-center">
          <h1 className="text-4xl font-bold mb-4 text-center text-white">
            GET STARTED
          </h1>
          <p className="text-lg text-white mb-10 text-center">
            All rights reserved © 2025
          </p>
        </div>
      </div>
    </div>
  );
}
