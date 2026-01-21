import React, { useMemo, useState } from "react";
import type { MenuProps } from "antd";
import { Card, message } from "antd";
import { Link } from "@remix-run/react";
import { AiFillCheckCircle, AiFillCloseCircle } from "react-icons/ai";
import { LuPackageSearch } from "react-icons/lu";
import { FaClipboardList, FaDollarSign, FaFileInvoiceDollar, FaMoneyCheckAlt, FaTicketAlt } from "react-icons/fa";
import { BsShieldCheck } from "react-icons/bs";
import { useAuth } from "~/auth/AuthContext";
import { UserService } from "~/services/user.service";
import { ProtectedRoute } from "~/components/ProtectedRoute";

export default function LandingPage() {
  const { user } = useAuth();
  const [dataUser, setData] = useState<any>();
  const [dataInventory, setDataIventory] = useState(false);
  const [dataBudget, setDataBudget] = useState(false);
  const [dataWorkflow, setDataWorkflow] = useState(false);
  const [dataBilling, setDataBilling] = useState(false);
  const [dataTicketing, setDataTicketing] = useState(false);
  const [dataLoanTracker, setDataLoanTracker] = useState(false);
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
      // console.log("User Data", dataFetch.office.name)
      localStorage.setItem('userOfficeID', dataFetch.office.id);
      localStorage.setItem('userOffice', dataFetch.office.name);
      localStorage.setItem('userDept', dataFetch.department_id);
      localStorage.setItem('dept', dataFetch.departments.department);
      localStorage.setItem('userAuthID', dataFetch.id);
      localStorage.setItem('fname', dataFetch.first_name);
      localStorage.setItem('lname', dataFetch.last_name);
      localStorage.setItem('ab_id', dataFetch.ab_user_id);
      localStorage.setItem('username', dataFetch.username);

      // axios.post('/api2', {
      //   external: "erp",
      //   password: apiAuthExternalPassword
      // })
      //   .then(response => {
      //     console.log('Auth API successful:', response.data);
      //   })
      //   .catch(error => {
      //     console.error('Error reading external api:', error);
      //   });

      // Update all states at once
      setData(dataFetch);
      setDataIventory(arr.includes(1));
      setDataBudget(arr.includes(2));
      setDataWorkflow(arr.includes(3));
      setDataAdmin(arr.includes(4));
      setDataBilling(arr.includes(5));
      setDataTicketing(arr.includes(6));
      setDataLoanTracker(arr.includes(7));

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
      icon: <FaFileInvoiceDollar className="h-8 w-8 text-red-500" />,
      title: "Billing & Collections",
      description: "Generate invoices, track payments, and manage accounts receivable efficiently.",
      link: "/billing",
      access: dataBilling
    },
    {
      icon: <FaTicketAlt className="h-8 w-8 text-teal-500" />,
      title: "Ticketing System",
      description: "Create, track, and resolve support tickets and customer inquiries.",
      link: "https://it-support.cficoop.com/en/",
      access: dataTicketing
    },
    // {
    //   icon: <FaMoneyCheckAlt className="h-8 w-8 text-green-500" />,
    //   title: "Loan Tracker",
    //   description: "Monitor, manage, and track employees’ or members’ loan requests and statuses.",
    //   link: "/loan",
    //   access: dataLoanTracker
    // },
    {
      icon: <LuPackageSearch className="h-8 w-8 text-blue-500" />,
      title: "Inventory",
      description: "Manage suppliers, inventory, and streamline warehouse operations.",
      link: "https://asset-tracker.cficoop.com/",
      access: dataInventory
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
        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-blue-900 via-indigo-900 to-blue-800">
          <div className="absolute inset-0 bg-black/10" />

          <div className="relative max-w-6xl mx-auto px-4 py-20 sm:py-28 lg:px-8">
            <div className="text-center">
              <div className="flex justify-center mb-8">
                <div className="p-4 bg-white/10 backdrop-blur-sm rounded-xl">
                  <img
                    className="h-16"
                    src="./img/cficoop.png"
                    alt="CFI Cooperative"
                  />
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Enterprise Resource Planning
              </h1>

              <p className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
                Streamlined solutions for inventory management, financial operations,
                workflow automation, and administrative governance.
              </p>
            </div>
          </div>
        </div>

        {/* Modules Grid */}
        <div className="max-w-6xl mx-auto px-4 py-16 sm:py-24 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`
            relative rounded-lg border transition-all duration-200
            ${feature.access
                    ? 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-md cursor-pointer'
                    : 'bg-gray-50/50 border-gray-100 cursor-default'
                  }
          `}
              >
                {feature.access ? (
                  <Link to={feature.link} className="block h-full">
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-5">
                        <div className={`p-3 rounded-lg ${feature.access ? 'bg-blue-50' : 'bg-gray-100'}`}>
                          <div className={feature.access ? 'text-blue-600' : 'text-gray-400'}>
                            {feature.icon}
                          </div>
                        </div>
                        <span className={`
                    text-xs font-medium px-2 py-1 rounded
                    ${feature.access
                            ? 'bg-green-50 text-green-700'
                            : 'bg-gray-100 text-gray-500'
                          }
                  `}>
                          {feature.access ? 'Available' : 'Restricted'}
                        </span>
                      </div>

                      <h3 className="font-semibold text-gray-900 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                        {feature.description}
                      </p>

                      <div className="mt-6 pt-5 border-t border-gray-100">
                        <div className={`
                    inline-flex items-center text-sm font-medium
                    ${feature.access ? 'text-blue-600' : 'text-gray-400'}
                  `}>
                          {feature.access ? (
                            <>
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                              Access granted
                            </>
                          ) : (
                            <>
                              <div className="w-2 h-2 bg-gray-400 rounded-full mr-2" />
                              Restricted access
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-5">
                      <div className="p-3 bg-gray-100 rounded-lg">
                        <div className="text-gray-400">
                          {feature.icon}
                        </div>
                      </div>
                      <span className="text-xs font-medium px-2 py-1 rounded bg-gray-100 text-gray-500">
                        Restricted
                      </span>
                    </div>

                    <h3 className="font-semibold text-gray-700 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4 leading-relaxed">
                      {feature.description}
                    </p>

                    <div className="mt-6 pt-5 border-t border-gray-100">
                      <div className="inline-flex items-center text-sm font-medium text-gray-400">
                        <div className="w-2 h-2 bg-gray-400 rounded-full mr-2" />
                        Restricted access
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Admin Note */}
          <div className="text-center mt-20 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              For additional module access, contact system administration.
            </p>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
