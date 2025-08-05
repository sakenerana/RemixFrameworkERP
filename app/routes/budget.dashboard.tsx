import { GlobalOutlined, LoadingOutlined } from "@ant-design/icons";
import {
  Alert,
  Button,
  Card,
  Row,
  Tag,
  message,
  Skeleton,
  Spin,
} from "antd";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { AiOutlineDollar, AiOutlineFileText, AiOutlineInfoCircle, AiOutlineShoppingCart, AiOutlineStock, AiOutlineWallet } from "react-icons/ai";
import { RiCircleFill } from "react-icons/ri";
import PieChart from "~/components/pie_chart";
import { ProtectedRoute } from "~/components/ProtectedRoute";
import { BudgetService } from "~/services/budget.service";
import { Budget } from "~/types/budget.type";

// Language content
const translations = {
  en: {
    alertMessage: "You can see here all the status of overall budget status. Please check closely.",
    spendingByCategory: "Spending By Workflow",
    currentMonthBreakdown: "Current month breakdown",
    dashboardTitle: "Budget Dashboard",
    switchToFilipino: "Switch to Filipino",
    switchToEnglish: "Switch to English",
  },
  fil: {
    alertMessage: "Maaari mong makita dito ang lahat ng status ng kabuuang budget. Mangyaring suriin nang mabuti.",
    spendingByCategory: "Pagkakagastos ayon sa Kategorya",
    currentMonthBreakdown: "Pagbabalangkas ng kasalukuyang buwan",
    dashboardTitle: "Dashboard ng Budget",
    switchToFilipino: "Palitan sa Filipino",
    switchToEnglish: "Palitan sa Ingles",
  }
};

export default function BudgetRoutes() {
  const [data, setData] = useState<Budget>();
  const [dataMonthly, setMonthlyData] = useState<any>();
  const [dataTotalRequisition, setDataTotalRequisition] = useState<any>(0);
  const [dataTotalLiquidation, setDataTotalLiquidation] = useState<any>(0);
  const [dataCombinedTotal, setDataCombinedTotal] = useState<any>(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<'en' | 'fil'>('en');
  const [t, setT] = useState(translations.en);

  const [isUserID, setUserID] = useState<any>();
  const [isDepartmentID, setDepartmentID] = useState<any>();
  const [isOfficeID, setOfficeID] = useState<any>();

  // Toggle language
  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'fil' : 'en';
    setLanguage(newLanguage);
    setT(translations[newLanguage]);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "PHP",
    }).format(amount);
  };

  const fetchData = async () => {
    try {
      // setLoading(true);
      const dataFetch = await BudgetService.getByData(isDepartmentID, isOfficeID);
      setData(dataFetch); // Works in React state
      // console.log("BUDGET DATAS", dataFetch)
    } catch (error) {
      message.error("error");
    } finally {
      // setLoading(false);
    }
  };

  const fetchDataBudgetApproved = async () => {
    const userId = Number(localStorage.getItem("ab_id"));
    const username = localStorage.getItem("username") || "";
    const userDepartment = localStorage.getItem("dept") || "";
    const userOffice = localStorage.getItem("userOffice") || "";
    const departmentId = isDepartmentID;
    const currentYear = new Date().getFullYear();
    // const currentYear = 2024;

    // Cache configuration
    const CACHE_KEY = `budgetApproved_${userId}_${departmentId}_${currentYear}`;
    const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes cache
    const now = new Date().getTime();

    if (!userId || !username || !departmentId) {
      console.warn("Missing required identifiers");
      return;
    }

    // Helper function to reset all data
    const resetData = () => {
      setDataTotalRequisition(0);
      setDataTotalLiquidation(0);
      setDataCombinedTotal(0);
      setMonthlyData([]);
    };

    try {
      setLoading(true);
      setError(null);
      resetData(); // Reset data at start

      // Check cache first
      const cachedData = localStorage.getItem(CACHE_KEY);
      if (cachedData) {
        const { totals, monthlyData, timestamp } = JSON.parse(cachedData);
        if (now - timestamp < CACHE_EXPIRY) {
          setDataTotalRequisition(totals.requisition);
          setDataTotalLiquidation(totals.liquidation);
          setDataCombinedTotal(totals.combined);
          setMonthlyData(monthlyData);
          setLoading(false);
          return;
        }
      }

      // Fetch data
      const response = await axios.post<{ data: any[] }>(
        "/api/completed-requisition-liquidation",
        { userid: userId, username }
      );

      const items = response.data.data || [];
      // console.log("ITEMS", items)
      // Process data in single pass
      const result = items.reduce((acc, item) => {
        if (!item.startDate) return acc;

        const itemYear = new Date(item.startDate).getFullYear();
        if (itemYear !== currentYear) return acc;

        const matches = item.department === userDepartment && item.status === 5;
        if (!matches) return acc;

        const offices = item.branch === userOffice;
        if (!offices) return acc;

        const amount = Number(item.totalAmount) || 0;
        const date = new Date(item.startDate);
        const month = `${String(date.getMonth() + 1).padStart(2, '0')}`;

        // Update workflow type totals
        if (item.workflowType === "Requisition") {
          acc.totals.requisition += amount;
        } else if (item.workflowType === "Liquidation") {
          acc.totals.liquidation += amount;
        }
        acc.totals.combined += amount;

        // Update monthly totals
        if (!acc.monthlyTotals[month]) {
          acc.monthlyTotals[month] = 0;
        }
        acc.monthlyTotals[month] += amount;

        return acc;
      }, {
        totals: { requisition: 0, liquidation: 0, combined: 0 },
        monthlyTotals: {} as Record<string, number>
      });

      // Format monthly data
      const monthlyData = Object.entries(result.monthlyTotals).map(([month, total]) => ({
        month: `${currentYear}-${month}`,
        total
      }));

      // Sort monthly data chronologically
      monthlyData.sort((a, b) => a.month.localeCompare(b.month));

      // Update state
      setDataTotalRequisition(result.totals.requisition);
      setDataTotalLiquidation(result.totals.liquidation);
      setDataCombinedTotal(result.totals.combined);
      setMonthlyData(monthlyData);

      // Update cache
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        totals: result.totals,
        monthlyData,
        timestamp: now
      }));

    } catch (err) {
      // Fallback to cache if available
      const cachedData = localStorage.getItem(CACHE_KEY);
      if (cachedData) {
        const { totals, monthlyData } = JSON.parse(cachedData);
        setDataTotalRequisition(totals.requisition);
        setDataTotalLiquidation(totals.liquidation);
        setDataCombinedTotal(totals.combined);
        setMonthlyData(monthlyData);
      } else {
        setError(err instanceof Error ? err.message : "Unknown error occurred");
        resetData();
      }
      console.error("fetchDataBudgetApproved failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        await Promise.all([
          fetchData(),
          fetchDataBudgetApproved()
        ]);
      } catch (error) {
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  useMemo(() => {
    setUserID(localStorage.getItem('userAuthID'));
    setDepartmentID(localStorage.getItem('userDept'));
    setOfficeID(localStorage.getItem('userOfficeID'));
  }, []);

  return (
    <ProtectedRoute>
      <div>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">{t.dashboardTitle}</h1>
          <Button type="default" onClick={toggleLanguage}>
            <GlobalOutlined />
            {language === 'en' ? t.switchToFilipino : t.switchToEnglish}
          </Button>
        </div>

        <Alert
          message={t.alertMessage}
          type="info"
          showIcon
        />

        {/* First Row - Summary Cards */}
        <Row gutter={16} className="pt-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-6 w-full">
            {/* 1. Total Budget for this year */}
            {loading ? (
              <Card>
                <Skeleton active paragraph={{ rows: 3 }} />
              </Card>
            ) : (
              <Card className="rounded-md shadow-sm overflow-hidden transition-transform duration-300 hover:scale-[1.02]">
                <div>
                  <h2 className="flex flex-wrap text-sm font-semibold mb-2">
                    <RiCircleFill className="text-[5px] text-blue-500 mt-2 mr-2" /> Total Budget
                  </h2>
                  <p className="flex flex-wrap text-blue-600 text-2xl font-bold">
                    <AiOutlineDollar className="mt-1 mr-2" /> {formatCurrency(data?.budget ?? 0)}
                  </p>
                  <p className="text-xs mt-4">Annual allocation for {new Date().getFullYear()}</p>
                </div>
                <div className="absolute top-0 right-0 px-3 py-1 text-xs font-medium rounded-bl-lg bg-blue-100 text-blue-800">
                  Annual
                </div>
              </Card>
            )}


            {/* 2. Total Requisition for this year */}
            {loading ? (
              <Card>
                <Skeleton active paragraph={{ rows: 3 }} />
              </Card>
            ) : (
              <Card className="rounded-md shadow-sm overflow-hidden transition-transform duration-300 hover:scale-[1.02]">
                <div>
                  <h2 className="flex flex-wrap text-sm font-semibold mb-2">
                    <RiCircleFill className="text-[5px] text-amber-500 mt-2 mr-2" /> Total Requisition
                  </h2>
                  <p className="flex flex-wrap text-amber-600 text-2xl font-bold">
                    <AiOutlineShoppingCart className="mt-1 mr-2" /> {formatCurrency(Number(dataTotalRequisition) || 0)}
                  </p>
                  <p className="text-xs mt-4">Approved requests this year</p>
                </div>
                <div className="absolute top-0 right-0 px-3 py-1 text-xs font-medium rounded-bl-lg bg-amber-100 text-amber-800">
                  YTD
                </div>
              </Card>
            )}

            {/* 3. Total Liquidation for this year */}
            {loading ? (
              <Card>
                <Skeleton active paragraph={{ rows: 3 }} />
              </Card>
            ) : (
              <Card className="rounded-md shadow-sm overflow-hidden transition-transform duration-300 hover:scale-[1.02]">
                <div>
                  <h2 className="flex flex-wrap text-sm font-semibold mb-2">
                    <RiCircleFill className="text-[5px] text-purple-500 mt-2 mr-2" /> Total Liquidation
                  </h2>
                  <p className="flex flex-wrap text-purple-600 text-2xl font-bold">
                    <AiOutlineFileText className="mt-1 mr-2" /> {formatCurrency(Number(dataTotalLiquidation) || 0)}
                  </p>
                  <p className="text-xs mt-4">Settled expenses this year</p>
                </div>
                <div className="absolute top-0 right-0 px-3 py-1 text-xs font-medium rounded-bl-lg bg-purple-100 text-purple-800">
                  YTD
                </div>
              </Card>
            )}

            {/* 4. Amount Spent */}
            {loading ? (
              <Card>
                <Skeleton active paragraph={{ rows: 3 }} />
              </Card>
            ) : (
              <Card className="rounded-md shadow-sm overflow-hidden transition-transform duration-300 hover:scale-[1.02]">
                <div>
                  <h2 className="flex flex-wrap text-sm font-semibold mb-2">
                    <RiCircleFill className="text-[5px] text-green-500 mt-2 mr-2" /> Amount Spent
                  </h2>
                  <p className="flex flex-wrap text-green-600 text-2xl font-bold">
                    <AiOutlineWallet className="mt-1 mr-2" /> {formatCurrency(Number(dataCombinedTotal) || 0)}
                  </p>
                  <p className="text-xs mt-4">Annual spent this year</p>
                  <div className="mt-2">
                    {/* <Progress
                    percent={Math.min(100, ((Number(12345) || 0) / (Number(12345) || 1) * 100)}
                    strokeColor={(Number(12345) || 0) > (Number(12345) || 0) ? "#f5222d" : "#52c41a"}
                    showInfo={false}
                    size="small"
                  /> */}
                    <p className="text-xs mt-1 text-gray-500">
                      {/* {Math.round(((Number(12345) || 0) / (Number(12345) || 1) * 100)}% utilized */}
                    </p>
                  </div>
                </div>
                <div className="absolute top-0 right-0 px-3 py-1 text-xs font-medium rounded-bl-lg bg-green-100 text-green-800">
                  Balance
                </div>
              </Card>
            )}

          </div>
        </Row>

        {/* Second Row - Charts */}
        <Row gutter={16} className="pt-5">
          <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-2 gap-6 w-full">
            <Card className="rounded-md shadow-sm overflow-hidden transition-transform duration-300">
              <div>
                <h2 className="flex flex-wrap text-sm font-semibold mb-2">
                  <RiCircleFill className="text-[5px] text-green-500 mt-2 mr-2" />
                  {t.spendingByCategory}
                </h2>
                <p className="flex flex-wrap text-xs">{t.currentMonthBreakdown}</p>

                {loading ? (
                  <div className="h-64 flex items-center justify-center">
                    <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
                  </div>
                ) : dataMonthly && dataMonthly.length > 0 ? (
                  <PieChart
                    data={dataMonthly.map((item: any) => ({
                      type: item.month,
                      value: item.total
                    }))}
                    title=""
                  />
                ) : (
                  <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
                    No Data Available
                  </div>
                )}

                {/* {dataMonthly && dataMonthly.length > 0 ? (
                  <PieChart
                    data={dataMonthly.map((item: any) => ({
                      type: item.month,
                      value: item.total
                    }))}
                    title=""
                  // colors={['#0088FE', '#00C49F', '#FFBB28', '#FF8042']} // Custom colors
                  />
                ) : (
                  <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
                    No Data Available
                  </div>
                )} */}
              </div>

              {/* Category Legend */}
              {dataMonthly && dataMonthly.length > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                  {dataMonthly.map((item: any, index: number) => (
                    <div key={index} className="flex items-center">
                      <span
                        className="w-2 h-2 rounded-full mr-2"
                        style={{
                          backgroundColor: ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'][index % 4]
                        }}
                      />
                      <span className="truncate">{item.month}</span>
                      <span className="ml-auto font-medium">
                        {formatCurrency(item.total)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <Card className="rounded-lg p-2 shadow-sm">
              {/* Header */}
              <div className="flex items-center gap-2 mb-3">
                <RiCircleFill className="text-green-500 text-[5px] mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold">Monthly Spending - {new Date().getFullYear()}</h3>
                  <p className="text-xs">Full year overview</p>
                </div>
              </div>

              {/* Monthly Data Grid */}
              {loading ? (
                <div className="grid grid-cols-3 gap-3 mt-4">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={`month-skel-${i}`} className="p-2 rounded-md border border-gray-100">
                      <Skeleton.Input active size="small" block className="mb-1" />
                      <Skeleton.Input active size="small" block />
                    </div>
                  ))}
                </div>
              ) : (
                // Your existing monthly grid
                <>
                  <div className="grid grid-cols-3 gap-3 mt-4">
                    {Array.from({ length: 12 }).map((_, index) => {
                      const monthNumber = (index + 1).toString().padStart(2, '0');
                      // const currentYear = 2024;
                      const currentYear = new Date().getFullYear();
                      const monthKey = `${currentYear}-${monthNumber}`;
                      const monthData = dataMonthly?.find((item: any) => item.month === monthKey);
                      const total = monthData?.total || 0;
                      const monthName = new Date(currentYear, index).toLocaleString('default', { month: 'long' });
                      const isCurrentMonth = index === new Date().getMonth();

                      return (
                        <div
                          key={index}
                          className={`p-2 rounded-md border ${isCurrentMonth
                            ? 'border-green-300 bg-green-50/50'
                            : 'border-gray-100'
                            }`}
                        >
                          <div className="text-xs font-medium">
                            {monthName.slice(0, 3)}
                          </div>
                          <div className={`text-sm ${total > 0
                            ? 'font-semibold text-green-800'
                            : 'text-green-400'
                            }`}>
                            {total > 0 ? `${formatCurrency(total)}` : '—'}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Yearly Summary */}
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <div className="flex justify-between text-sm">
                      <span>Total annual spending:</span>
                      <span className="font-semibold">
                        {formatCurrency(dataCombinedTotal ?? 0)}
                      </span>
                    </div>


                    {dataMonthly && dataMonthly.length > 0 && (
                      <div className="flex justify-between text-sm mt-1">
                        <span>Highest month:</span>
                        <span className="font-medium">
                          {(() => {
                            // Find the month with highest spending
                            const highestMonth = dataMonthly.reduce((prev: any, current: any) =>
                              (prev.total > current.total) ? prev : current
                            );
                            const monthName = new Date(highestMonth.month).toLocaleString('default', { month: 'long' });
                            return (
                              <>
                                {monthName}
                                <span className="text-green-600 ml-1">
                                  ({formatCurrency(highestMonth.total)})
                                </span>
                              </>
                            );
                          })()}
                        </span>
                      </div>
                    )}
                  </div>
                </>
              )}
            </Card>
          </div>
        </Row>

        <div className="w-full mt-4 bg-gradient-to-r from-blue-50 to-blue-100 p-5 rounded-lg border border-blue-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start gap-4">
            <AiOutlineInfoCircle className="text-blue-600 text-2xl mt-1 flex-shrink-0" />
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold text-blue-900">
                  Budgeting Tip of the Month
                </h3>
                <Tag color="blue" className="text-xs">NEW</Tag>
              </div>
              <p className="text-sm text-blue-800 leading-relaxed">
                Track expenses weekly to avoid surprises.
                <span className="font-medium text-blue-900"> Save 10% as emergency buffer.</span>
              </p>
              {/* <div className="mt-2 flex items-center gap-2">
                <Button
                  type="text"
                  size="small"
                  icon={<AiOutlinePlusCircle />}
                  className="text-blue-600 text-xs"
                >
                  Create Reminder
                </Button>
                <Button
                  type="text"
                  size="small"
                  icon={<AiOutlineShareAlt />}
                  className="text-blue-600 text-xs"
                >
                  Share Tip
                </Button>
              </div> */}
              <blockquote className="mt-3 px-3 py-2 bg-blue-50/50 border-l-4 border-blue-300 rounded-r">
                <p className="text-xs text-blue-700 italic">
                  “A budget is telling your money where to go instead of wondering where it went.”
                  <span className="block font-medium text-blue-800 mt-1 not-italic">— IT Department</span>
                </p>
              </blockquote>
              <blockquote className="mt-3 px-3 py-2 bg-blue-50/50 border-l-4 border-blue-300 rounded-r">
                <p className="text-xs text-blue-700 italic">
                  “Don’t save what is left after spending; spend what is left after saving.”
                  <span className="block font-medium text-blue-800 mt-1 not-italic">— Finance Department</span>
                </p>
              </blockquote>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}