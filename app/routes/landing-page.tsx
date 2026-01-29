import React, { useMemo, useState } from "react";
import type { MenuProps } from "antd";
import { Card, message } from "antd";
import { Link } from "@remix-run/react";
import { AiFillCheckCircle, AiFillCloseCircle } from "react-icons/ai";
import { LuPackageSearch } from "react-icons/lu";
import { FaClipboardList, FaDollarSign, FaFileInvoiceDollar, FaHandHoldingUsd, FaMoneyCheckAlt, FaTicketAlt, FaUserPlus } from "react-icons/fa";
import { BsShieldCheck } from "react-icons/bs";
import { useAuth } from "~/auth/AuthContext";
import { UserService } from "~/services/user.service";
import { ProtectedRoute } from "~/components/ProtectedRoute";

export default function LandingPage() {
  const { user } = useAuth();
  const [dataUser, setData] = useState<any>();
  const [dataInventory, setDataInventory] = useState(false);
  const [dataBudget, setDataBudget] = useState(false);
  const [dataNewMembership, setDataNewMembership] = useState(false);
  const [dataLoanRelease, setDataLoanRelease] = useState(false);
  const [dataWorkflow, setDataWorkflow] = useState(false);
  const [dataBilling, setDataBilling] = useState(false);
  const [dataTicketing, setDataTicketing] = useState(false);
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
      localStorage.setItem('userOfficeID', dataFetch.office.id);
      localStorage.setItem('userOffice', dataFetch.office.name);
      localStorage.setItem('userDept', dataFetch.department_id);
      localStorage.setItem('dept', dataFetch.departments.department);
      localStorage.setItem('userAuthID', dataFetch.id);
      localStorage.setItem('fname', dataFetch.first_name);
      localStorage.setItem('lname', dataFetch.last_name);
      localStorage.setItem('ab_id', dataFetch.ab_user_id);
      localStorage.setItem('username', dataFetch.username);

      // Update all states at once
      setData(dataFetch);
      setDataInventory(arr.includes(1));
      setDataBudget(arr.includes(2));
      setDataWorkflow(arr.includes(3));
      setDataAdmin(arr.includes(4));
      setDataBilling(arr.includes(5));
      setDataTicketing(arr.includes(6));
      setDataLoanRelease(arr.includes(7));
      setDataNewMembership(arr.includes(8));
    } catch (error) {
      message.error("Error loading user data");
    } finally {
      setLoading(false);
    }
  };

  // Regular features for all users
  const regularFeatures = useMemo(() => [
    {
      icon: <FaDollarSign className="h-10 w-10 text-white" />,
      title: "Budget Monitoring",
      link: "/budget",
      access: dataBudget,
      bgColor: "bg-gradient-to-br from-green-500 to-emerald-600",
      badgeColor: "bg-green-700/30 text-green-100",
      iconBg: "bg-green-600/30"
    },
    {
      icon: <FaUserPlus className="h-10 w-10 text-white" />,
      title: "New Membership",
      link: "/membership",
      access: dataNewMembership, // You'll need to add this to your dependencies
      bgColor: "bg-gradient-to-br from-purple-500 to-violet-600",
      badgeColor: "bg-purple-700/30 text-purple-100",
      iconBg: "bg-purple-600/30"
    },
    {
      icon: <FaHandHoldingUsd className="h-10 w-10 text-white" />,
      title: "Loan Release",
      link: "/loan",
      access: dataLoanRelease, // You'll need to add this to your dependencies
      bgColor: "bg-gradient-to-br from-indigo-500 to-blue-600",
      badgeColor: "bg-indigo-700/30 text-indigo-100",
      iconBg: "bg-indigo-600/30"
    },
    {
      icon: <FaClipboardList className="h-10 w-10 text-white" />,
      title: "Workflow",
      link: "/workflow",
      access: dataWorkflow,
      bgColor: "bg-gradient-to-br from-orange-500 to-amber-600",
      badgeColor: "bg-orange-700/30 text-orange-100",
      iconBg: "bg-orange-600/30"
    },
    {
      icon: <FaFileInvoiceDollar className="h-10 w-10 text-white" />,
      title: "BCD",
      link: "/billing",
      access: dataBilling,
      bgColor: "bg-gradient-to-br from-red-500 to-rose-600",
      badgeColor: "bg-red-700/30 text-red-100",
      iconBg: "bg-red-600/30"
    },
    {
      icon: <FaTicketAlt className="h-10 w-10 text-white" />,
      title: "Ticketing",
      link: "https://it-support.cficoop.com/en/",
      access: dataTicketing,
      bgColor: "bg-gradient-to-br from-teal-500 to-cyan-600",
      badgeColor: "bg-teal-700/30 text-teal-100",
      iconBg: "bg-teal-600/30"
    },
    {
      icon: <LuPackageSearch className="h-10 w-10 text-white" />,
      title: "Inventory",
      link: "/inventory",
      access: dataInventory,
      bgColor: "bg-gradient-to-br from-blue-500 to-indigo-600",
      badgeColor: "bg-blue-700/30 text-blue-100",
      iconBg: "bg-blue-600/30"
    },
  ], [dataInventory, dataNewMembership, dataLoanRelease, dataBudget, dataWorkflow, dataBilling, dataTicketing]); // Add new dependencies here

  // Admin feature - kept separate
  const adminFeature = {
    icon: <BsShieldCheck className="h-10 w-10 text-white" />,
    title: "Administration",
    link: "/admin",
    access: dataAdmin,
    bgColor: "bg-gradient-to-br from-purple-500 to-violet-600",
    badgeColor: "bg-purple-700/30 text-purple-100",
    iconBg: "bg-purple-600/30"
  };

  useMemo(() => {
    fetchDataByUUID();
  }, []);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-blue-900 via-indigo-900 to-blue-800">
          <div className="absolute inset-0 bg-black/10" />

          <div className="relative max-w-6xl mx-auto px-4 py-16 sm:py-24 lg:px-8">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-white/10 backdrop-blur-sm rounded-xl">
                  <img
                    className="h-14"
                    src="./img/cficoop.png"
                    alt="CFI Cooperative"
                  />
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                Enterprise Resource Planning
              </h1>

              <p className="text-base text-white/80 max-w-2xl mx-auto">
                Streamlined solutions for enterprise operations.
              </p>
            </div>
          </div>
        </div>

        {/* Regular User Modules Grid */}
        <div className="max-w-5xl mx-auto px-4 py-12 sm:py-16 lg:px-8">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 text-center mb-2">
              Available Modules
            </h2>
            <p className="text-gray-600 text-sm text-center">
              Select a module to manage your daily operations
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {regularFeatures.map((feature, index) => (
              <div
                key={index}
                className={`
                  relative rounded-lg border transition-all duration-200 overflow-hidden
                  ${feature.access
                    ? `${feature.bgColor} border-transparent hover:shadow-lg hover:scale-[1.03] cursor-pointer`
                    : 'bg-gray-100 border-gray-200 cursor-default'
                  }
                `}
              >
                {feature.access ? (
                  <Link to={feature.link} className="block h-full">
                    <div className="p-4 h-full flex flex-col">
                      <div className="flex flex-col items-center text-center">
                        <div className={`p-4 rounded-full ${feature.iconBg} backdrop-blur-sm mb-3`}>
                          {feature.icon}
                        </div>

                        <h3 className="font-bold text-white text-base mb-2">
                          {feature.title}
                        </h3>

                        <div className="mt-2">
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${feature.badgeColor}`}>
                            Available
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div className="p-4 h-full flex flex-col">
                    <div className="flex flex-col items-center text-center">
                      <div className="p-4 bg-gray-200 rounded-full mb-3">
                        <div className="text-gray-400">
                          {React.cloneElement(feature.icon, { className: "h-10 w-10 text-gray-400" })}
                        </div>
                      </div>

                      <h3 className="font-bold text-gray-600 text-base mb-2">
                        {feature.title}
                      </h3>

                      <div className="mt-2">
                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-200 text-gray-600">
                          Restricted
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Admin Panel Section - Separate and Centered */}
        {adminFeature.access && (
          <div className="max-w-5xl mx-auto px-4 pb-12 lg:px-8">
            <div className="border-t border-gray-200 pt-12 mb-8">
              <div className="text-center mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  Administrative Controls
                </h2>
                <p className="text-gray-600 text-sm">
                  System configuration and user management
                </p>
              </div>

              <div className="flex justify-center">
                <div className="w-full max-w-md">
                  <div className={`
                    relative rounded-xl border transition-all duration-200 overflow-hidden
                    ${adminFeature.bgColor} border-transparent hover:shadow-lg hover:scale-[1.02] cursor-pointer
                  `}>
                    <Link to={adminFeature.link} className="block">
                      <div className="p-6">
                        <div className="flex flex-col items-center text-center">
                          <div className={`p-5 rounded-full ${adminFeature.iconBg} backdrop-blur-sm mb-4`}>
                            {adminFeature.icon}
                          </div>

                          <h3 className="font-bold text-white text-xl mb-3">
                            {adminFeature.title}
                          </h3>

                          <div className="mt-2">
                            <span className={`text-xs font-medium px-3 py-1.5 rounded-full ${adminFeature.badgeColor}`}>
                              Administrator Access Only
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Admin Note */}
        <div className="max-w-5xl mx-auto px-4 pb-8 lg:px-8">
          <div className="text-center pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              For additional module access, contact system administration.
            </p>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}