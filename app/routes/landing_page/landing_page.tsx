import React, { useEffect, useMemo, useState } from "react";
import {
  ApartmentOutlined,
  AuditOutlined,
  DropboxOutlined,
} from "@ant-design/icons";
import type { MenuProps, TabsProps } from "antd";
import { Button, Card, Carousel, message, Space } from "antd";
import { Link, useNavigate } from "@remix-run/react";
import { supabase } from "~/lib/supabase";
import { AiFillCheckCircle, AiFillCloseCircle, AiOutlineReconciliation } from "react-icons/ai";
import { LuPackageSearch } from "react-icons/lu";
import { FaClipboardList, FaDollarSign } from "react-icons/fa";
import { BsShieldCheck } from "react-icons/bs";
import { Content } from "antd/es/layout/layout";
import { useAuth } from "~/auth/AuthContext";
import { UserService } from "~/services/user.service";
import { User } from "~/types/user.type";

type MenuItem = Required<MenuProps>["items"][number];

const contentStyle: React.CSSProperties = {
  textAlign: "center",
  justifyContent: "center",
};

export default function LandingPage() {
  const { user } = useAuth();
  const [dataUser, setData] = useState<any>();
  const [dataInventory, setDataIventory] = useState(false);
  const [dataBudget, setDataBudget] = useState(false);
  const [dataWorkflow, setDataWorkflow] = useState(false);
  const [dataAdmin, setDataAdmin] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch data from Supabase
  const fetchDataByUUID = async () => {
    if (!user?.id) {
      console.error("User ID is not available");
      return;
    }

    try {
      setLoading(true);
      const dataFetch = await UserService.getByUuid(user.id);
      const arr = JSON.parse(dataFetch?.access || '[]'); // Add fallback for empty access
      console.log("User Data", dataFetch.department_id)
      localStorage.setItem('userDept', dataFetch.department_id);
      // Update all states at once
      setData(dataFetch);
      setDataIventory(arr.includes(1));
      setDataBudget(arr.includes(2));
      setDataWorkflow(arr.includes(3));
      setDataAdmin(arr.includes(4));

      // Debug log - this will show the actual values
      // console.log('Access array:', arr);
      // console.log('Inventory access:', arr.includes(1));
    } catch (error) {
      // console.error("Error fetching data:", error);
      message.error("Error loading user data");
    } finally {
      setLoading(false);
    }
  };

  const features = useMemo(() => [
    {
      icon: <LuPackageSearch className="h-8 w-8 text-blue-500" />,
      title: "Inventory",
      description: "Manage suppliers, inventory, and streamline warehouse operations.",
      link: "/inventory",
      access: dataInventory
    },
    {
      icon: <FaDollarSign className="h-8 w-8 text-green-500" />,
      title: "Budget Tracker",
      description: "Monitor expenses, set budget goals, and visualize financial performance.",
      link: "/budget",
      access: dataBudget
    },
    {
      icon: <FaClipboardList className="h-8 w-8 text-orange-500" />,
      title: "Workflow Tracker",
      description: "Manage team workflows, assign tasks, and track progress in real-time.",
      link: "/workflow",
      access: dataWorkflow
    },
    {
      icon: <BsShieldCheck className="h-8 w-8 text-purple-500" />,
      title: "Admin Panel",
      description: "Oversee user roles, permissions, and platform configurations.",
      link: "/admin",
      access: dataAdmin
    },
  ], [dataInventory, dataBudget, dataWorkflow, dataAdmin]);

  useMemo(() => {
    fetchDataByUUID();
  }, []);

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
              className={`rounded-2xl shadow-md transition-shadow p-4 ${feature.access
                ? 'hover:shadow-2xl cursor-pointer'
                : 'opacity-70 cursor-not-allowed'
                }`}
              hoverable={feature.access}
            >
              {feature.access ? (
                <Link to={feature.link}>
                  <div className="flex flex-col items-center text-center">
                    {feature.icon}
                    <h2 className="text-xl font-semibold mt-4 mb-2">{feature.title}</h2>
                    <p className="text-sm text-gray-500">{feature.description}</p>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <p className="flex flex-wrap mt-4 mb-[-20px] text-green-500">
                      <AiFillCheckCircle className="mt-1 mr-2" /> Access
                    </p>
                  </div>
                </Link>
              ) : (
                <div className="flex flex-col items-center text-center">
                  {feature.icon}
                  <h2 className="text-xl font-semibold mt-4 mb-2">{feature.title}</h2>
                  <p className="text-sm text-gray-500">{feature.description}</p>
                  <div className="flex flex-col items-center text-center">
                    <p className="flex flex-wrap mt-4 mb-[-20px] text-red-500">
                      <AiFillCloseCircle className="mt-1 mr-2" /> No Access
                    </p>
                  </div>
                </div>
              )}
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
