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
      console.log("User Data", dataFetch)
      localStorage.setItem('userDept', dataFetch.department_id);
      localStorage.setItem('userAuthID', dataFetch.id);
      localStorage.setItem('fname', dataFetch.first_name);
      localStorage.setItem('lname', dataFetch.last_name);
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
    <div className="min-h-screen bg-[url(/img/cfi-bills-payment.jpg)] bg-cover bg-center bg-no-repeat p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header Section */}
        <header className="flex flex-col items-center pt-8 pb-12 bg-black/30 backdrop-blur-sm rounded-xl p-6 mb-10">
          <img
            className="h-20 mb-6 transition-transform duration-300 hover:scale-105"
            src="./img/cficoop.png"
            alt="CFI Cooperative Logo"
          />
          <h1 className="text-5xl font-bold mb-4 text-center text-white">
            Enterprise Resource Planning
          </h1>
          <p className="text-xl text-white/90 mb-6 text-center max-w-3xl leading-relaxed">
            Comprehensive tools to streamline inventory management, financial oversight,
            operational workflows, and administrative controls.
          </p>
          <div className="h-1 w-24 bg-blue-400 rounded-full mt-2"></div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {features.map((feature, index) => (
            <Card
              key={index}
              className={`relative overflow-hidden rounded-xl border transition-all duration-300 ${feature.access
                  ? 'border-gray-200 hover:border-blue-300 hover:shadow-lg cursor-pointer bg-white'
                  : 'border-gray-100 bg-gray-50 cursor-not-allowed'
                }`}
              hoverable={feature.access}
            >
              {/* Status Ribbon */}
              <div
                className={`absolute top-0 right-0 px-3 py-1 text-xs font-medium rounded-bl-lg ${feature.access ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}
              >
                {feature.access ? 'Available' : 'Restricted'}
              </div>

              {feature.access ? (
                <Link to={feature.link} className="block h-full">
                  <div className="p-6 flex flex-col h-full">
                    {/* Icon */}
                    <div className="flex justify-center text-4xl mb-4 text-blue-500">
                      {feature.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-grow">
                      <h3 className="text-lg font-semibold text-gray-800 text-center mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 text-sm text-center">
                        {feature.description}
                      </p>
                    </div>

                    {/* Access Indicator */}
                    <div className="mt-4 flex justify-center">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${feature.access
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                          }`}
                      >
                        {feature.access ? (
                          <>
                            <AiFillCheckCircle className="mr-1.5" />
                            Access Granted
                          </>
                        ) : (
                          <>
                            <AiFillCloseCircle className="mr-1.5" />
                            No Access
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                </Link>
              ) : (
                <div className="p-6 flex flex-col h-full">
                  {/* Icon */}
                  <div className="flex justify-center text-4xl mb-4 text-gray-400">
                    {feature.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-grow">
                    <h3 className="text-lg font-semibold text-gray-700 text-center mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-500 text-sm text-center">
                      {feature.description}
                    </p>
                  </div>

                  {/* Access Indicator */}
                  <div className="mt-4 flex justify-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      <AiFillCloseCircle className="mr-1.5" />
                      No Access
                    </span>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>

      </div>
    </div>
  );
}
