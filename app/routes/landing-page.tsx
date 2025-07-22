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
import { ProtectedRoute } from "~/components/ProtectedRoute";
import axios from "axios";

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
  const apiAuthExternal = import.meta.env.VITE_AUTH_EXTERNAL;
  const apiAuthExternalPassword = import.meta.env.VITE_AUTH_EXTERNAL_PASSWORD;

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
      localStorage.setItem('ab_id', dataFetch.ab_user_id);
      localStorage.setItem('username', dataFetch.username);

      axios.post('/auth', {
        external: "erp",
        password: apiAuthExternalPassword
      })
        .then(response => {
          console.log('Auth API successful:', response.data);
        })
        .catch(error => {
          console.error('Error reading external api:', error);
        });

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
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section with Gradient Overlay */}
        <div className="relative bg-[url(/img/cfi-bills-payment.jpg)] bg-cover bg-center bg-no-repeat">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-indigo-800/90"></div>

          <div className="relative max-w-7xl mx-auto px-6 py-24 sm:py-32 lg:px-8">
            {/* Header Content */}
            <div className="text-center backdrop-blur-sm bg-white/5 rounded-2xl p-8 border border-white/10 shadow-2xl">
              <img
                className="h-20 mx-auto mb-8 transition-transform duration-300 hover:scale-105"
                src="./img/cficoop.png"
                alt="CFI Cooperative Logo"
              />
              <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
                Enterprise Resource Planning
              </h1>
              <p className="mt-6 text-lg leading-8 text-white/90 max-w-3xl mx-auto">
                Integrated solutions to optimize inventory management, financial operations,
                workflow automation, and administrative governance.
              </p>
              <div className="mt-8 flex justify-center">
                <div className="h-1 w-24 bg-gradient-to-r from-blue-400 to-cyan-300 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid Section */}
        <div className="max-w-7xl mx-auto px-6 py-16 sm:py-24 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className={`relative overflow-hidden rounded-xl transition-all duration-300 ${feature.access
                  ? 'bg-white border border-gray-200 hover:border-blue-300 hover:shadow-xl cursor-pointer'
                  : 'bg-gray-50 border border-gray-100 cursor-not-allowed'
                  }`}
                hoverable={feature.access}
              >
                {/* Status Badge */}
                <div
                  className={`absolute top-3 right-3 px-2.5 py-0.5 text-xs font-semibold rounded-full ${feature.access
                    ? 'bg-green-50 text-green-700 ring-1 ring-green-600/20'
                    : 'bg-red-50 text-red-700 ring-1 ring-red-600/20'
                    }`}
                >
                  {feature.access ? 'Available' : 'Restricted'}
                </div>

                {feature.access ? (
                  <Link to={feature.link} className="block h-full">
                    <div className="p-5 flex flex-col h-full">
                      {/* Icon Container */}
                      <div className="flex justify-center mb-4">
                        <div className="p-3 bg-blue-50 rounded-lg text-blue-600 text-3xl">
                          {feature.icon}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-grow">
                        <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-gray-600 text-sm text-center">
                          {feature.description}
                        </p>
                      </div>

                      {/* Access Indicator */}
                      <div className="mt-6 flex justify-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${feature.access
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
                  <div className="p-5 flex flex-col h-full">
                    {/* Icon Container */}
                    <div className="flex justify-center mb-4">
                      <div className="p-3 bg-gray-100 rounded-lg text-gray-400 text-3xl">
                        {feature.icon}
                      </div>
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
                    <div className="mt-6 flex justify-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
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
    </ProtectedRoute>
  );
}
