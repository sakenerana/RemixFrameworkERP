import { GlobalOutlined, LoadingOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Progress,
  Row,
  Tag,
  message,
  Skeleton,
  Spin,
} from "antd";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { AiOutlineDollar, AiOutlineFileText, AiOutlineInfoCircle, AiOutlineShoppingCart, AiOutlineStock, AiOutlineWallet } from "react-icons/ai";
import AreaChart from "~/components/area_chart";
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
  const [dataUnbudget, setDataUnbudget] = useState<any>();
  const [dataTotalBudgeted, setDataTotalBudgeted] = useState<any>(0);
  const [dataTotalUnBudgeted, setDataTotalUnBudgeted] = useState<any>(0);
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

  // Gradient backgrounds for statistics cards
  const statGradients = {
    totalBudget: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',        // Purple gradient
    totalRequisition: 'linear-gradient(135deg, #0ba360 0%, #3cba92 100%)',  // Green gradient
    totalLiquidation: 'linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%)', // Orange gradient
    amountSpent: 'linear-gradient(135deg, #ee0979 0%, #ff6a00 100%)'       // Red gradient
  };

  // Alternative gradient options:
  // Option 2 (Corporate Blue theme):
  // const statGradients = {
  //   totalBudget: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
  //   totalRequisition: 'linear-gradient(135deg, #00b09b 0%, #96c93d 100%)',
  //   totalLiquidation: 'linear-gradient(135deg, #ff9966 0%, #ff5e62 100%)',
  //   amountSpent: 'linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)'
  // };

  // Option 3 (Elegant theme):
  // const statGradients = {
  //   totalBudget: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
  //   totalRequisition: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
  //   totalLiquidation: 'linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%)',
  //   amountSpent: 'linear-gradient(135deg, #ff0844 0%, #ffb199 100%)'
  // };

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
      const dataFetch: any = await BudgetService.getByData();
      setData(dataFetch); // Works in React state
      const totalBudget = dataFetch?.reduce((sum: any, item: any) => sum + (item.budget || 0), 0) || 0;
      setDataTotalBudgeted(totalBudget);
      // console.log("BUDGET DATAS", dataFetch)
    } catch (error) {
      message.error("error");
    } finally {
      // setLoading(false);
    }
  };

  const fetchUnbudgetData = async () => {
    try {
      // setLoading(true);
      const dataFetch: any = await BudgetService.getAllUnbudgeted();
      setDataUnbudget(dataFetch); // Works in React state
      const totalUnBudget = dataFetch?.reduce((sum: any, item: any) => sum + (item.amount || 0), 0) || 0;
      setDataTotalUnBudgeted(totalUnBudget);
      // console.log("DATA FETCH", totalUnBudget)
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
    const CACHE_EXPIRY = 30 * 60 * 1000; // 30 minutes cache
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
        `${import.meta.env.VITE_API_BASE_URL}/completed-requisition-liquidation`,
        { userid: userId, username }
      );

      const items = response.data.data || [];
      // console.log("ITEMS", items)
      // Process data in single pass
      const result = items.reduce((acc, item) => {
        if (!item.startDate) return acc;

        const itemYear = new Date(item.startDate).getFullYear();
        if (itemYear !== currentYear) return acc;

        // const matches = item.department === userDepartment && item.status === 'Completed';
        const matches = item.status === 'Completed';
        if (!matches) return acc;

        // const offices = item.branch === userOffice;
        // if (!offices) return acc;

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
          fetchUnbudgetData(),
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

  const currentYear = new Date().getFullYear();
  const overallBudget = (Number(dataTotalBudgeted) || 0) + (Number(dataTotalUnBudgeted) || 0);
  const amountSpent = Number(dataCombinedTotal) || 0;
  const remainingBalance = overallBudget - amountSpent;
  const utilizationRate = overallBudget > 0 ? Math.round((amountSpent / overallBudget) * 100) : 0;
  const cappedUtilizationRate = Math.min(100, utilizationRate);
  const budgetHealth = utilizationRate < 50 ? "Healthy" : utilizationRate < 80 ? "Moderate" : "Critical";
  const budgetHealthColor = utilizationRate < 50 ? "success" : utilizationRate < 80 ? "warning" : "error";
  const monthlySeries = Array.from({ length: 12 }).map((_, index) => {
    const monthNumber = (index + 1).toString().padStart(2, "0");
    const monthKey = `${currentYear}-${monthNumber}`;
    const monthName = new Date(currentYear, index).toLocaleString("default", { month: "short" });
    const total = dataMonthly?.find((item: any) => item.month === monthKey)?.total || 0;

    return {
      monthKey,
      monthName,
      total,
      date: `${monthKey}-01`,
      value: total,
      category: "Amount Spent",
      isCurrentMonth: index === new Date().getMonth(),
    };
  });
  const chartData = monthlySeries.map(({ date, value, category }) => ({ date, value, category }));
  const highestMonth = monthlySeries.reduce(
    (highest, current) => current.total > highest.total ? current : highest,
    monthlySeries[0]
  );

  return (
    <ProtectedRoute>
      <div className="budget-dashboard-page space-y-5">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-blue-600">
                <AiOutlineStock />
                Budget Dashboard
              </div>
              <h1 className="mt-2 text-2xl font-semibold text-slate-950">Financial Overview</h1>
              <p className="mt-1 text-sm text-slate-500">
                Track annual allocations, completed requisitions, liquidation, and monthly spending for {currentYear}.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Tag color={budgetHealthColor} className="m-0 px-3 py-1">{budgetHealth}</Tag>
              <Button type="default" onClick={toggleLanguage}>
                <GlobalOutlined />
                {language === 'en' ? t.switchToFilipino : t.switchToEnglish}
              </Button>
            </div>
          </div>
        </div>

        {error && (
          <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card className="rounded-xl border border-slate-200 shadow-sm" bodyStyle={{ padding: 20 }} loading={loading}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="m-0 text-sm font-medium text-slate-500">Total Budget</p>
                <div className="mt-3 text-2xl font-semibold text-slate-950">{formatCurrency(overallBudget)}</div>
                <p className="m-0 mt-2 text-xs text-slate-500">Annual allocation for {currentYear}</p>
              </div>
              <div className="rounded-lg bg-blue-50 p-2 text-blue-600"><AiOutlineDollar /></div>
            </div>
          </Card>

          <Card className="rounded-xl border border-slate-200 shadow-sm" bodyStyle={{ padding: 20 }} loading={loading}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="m-0 text-sm font-medium text-slate-500">Total Requisition</p>
                <div className="mt-3 text-2xl font-semibold text-slate-950">{formatCurrency(Number(dataTotalRequisition) || 0)}</div>
                <p className="m-0 mt-2 text-xs text-slate-500">Approved requests this year</p>
              </div>
              <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600"><AiOutlineShoppingCart /></div>
            </div>
          </Card>

          <Card className="rounded-xl border border-slate-200 shadow-sm" bodyStyle={{ padding: 20 }} loading={loading}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="m-0 text-sm font-medium text-slate-500">Total Liquidation</p>
                <div className="mt-3 text-2xl font-semibold text-slate-950">{formatCurrency(Number(dataTotalLiquidation) || 0)}</div>
                <p className="m-0 mt-2 text-xs text-slate-500">Settled expenses this year</p>
              </div>
              <div className="rounded-lg bg-amber-50 p-2 text-amber-600"><AiOutlineFileText /></div>
            </div>
          </Card>

          <Card className="rounded-xl border border-slate-200 shadow-sm" bodyStyle={{ padding: 20 }} loading={loading}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="m-0 text-sm font-medium text-slate-500">Amount Spent</p>
                <div className="mt-3 text-2xl font-semibold text-slate-950">{formatCurrency(amountSpent)}</div>
                <p className="m-0 mt-2 text-xs text-slate-500">Requisition and liquidation total</p>
              </div>
              <div className="rounded-lg bg-rose-50 p-2 text-rose-600"><AiOutlineWallet /></div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.4fr)_minmax(360px,0.6fr)]">
          <Card className="rounded-xl border border-slate-200 shadow-sm" bodyStyle={{ padding: 24 }}>
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <h2 className="m-0 text-lg font-semibold text-slate-950">Monthly Spending Trend</h2>
                <p className="m-0 mt-1 text-sm text-slate-500">Functional chart based on completed requisition and liquidation records.</p>
              </div>
              <div className="text-left md:text-right">
                <div className="text-sm text-slate-500">Total annual spending</div>
                <div className="text-xl font-semibold text-slate-950">{formatCurrency(amountSpent)}</div>
              </div>
            </div>

            <div className="mt-6 h-[340px]">
              {loading ? (
                <div className="flex h-full items-center justify-center">
                  <Spin indicator={<LoadingOutlined style={{ fontSize: 28 }} spin />} />
                </div>
              ) : chartData.some((item) => item.value > 0) ? (
                <AreaChart
                  data={chartData}
                  config={{
                    color: ['#2563eb'],
                    xAxis: {
                      type: 'time',
                      mask: 'MMM',
                      tickCount: 12,
                    },
                    yAxis: {
                      label: {
                        formatter: (value: string) => formatCurrency(Number(value)).replace('.00', ''),
                      },
                    },
                    tooltip: {
                      formatter: (datum: any) => ({
                        name: datum.category,
                        value: formatCurrency(Number(datum.value) || 0),
                      }),
                    },
                  }}
                />
              ) : (
                <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50 text-sm text-slate-500">
                  No spending data available for {currentYear}
                </div>
              )}
            </div>
          </Card>

          <Card className="rounded-xl border border-slate-200 shadow-sm" bodyStyle={{ padding: 24 }} loading={loading}>
            <h2 className="m-0 text-lg font-semibold text-slate-950">Budget Utilization</h2>
            <p className="m-0 mt-1 text-sm text-slate-500">Spending compared with available annual budget.</p>

            <div className="mt-6 flex items-end justify-between gap-4">
              <div>
                <div className="text-4xl font-semibold text-blue-700">{utilizationRate}%</div>
                <Tag color={budgetHealthColor}>{budgetHealth}</Tag>
              </div>
              <div className={`text-right text-lg font-semibold ${remainingBalance < 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
                {formatCurrency(remainingBalance)}
                <div className="text-xs font-normal text-slate-500">Remaining balance</div>
              </div>
            </div>

            <div className="mt-6">
              <Progress
                percent={cappedUtilizationRate}
                showInfo={false}
                strokeColor={utilizationRate > 100 ? '#dc2626' : utilizationRate > 80 ? '#ef4444' : utilizationRate > 60 ? '#f59e0b' : '#2563eb'}
                trailColor="#e2e8f0"
              />
              <div className="mt-2 flex justify-between text-xs text-slate-500">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>

            <div className="mt-6 space-y-3 rounded-lg bg-slate-50 p-4 text-sm">
              <div className="flex justify-between gap-3">
                <span className="text-slate-500">Budgeted</span>
                <span className="font-semibold text-slate-900">{formatCurrency(Number(dataTotalBudgeted) || 0)}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-slate-500">Unbudgeted</span>
                <span className="font-semibold text-slate-900">{formatCurrency(Number(dataTotalUnBudgeted) || 0)}</span>
              </div>
            </div>
          </Card>
        </div>

        <Card className="rounded-xl border border-slate-200 shadow-sm" bodyStyle={{ padding: 24 }}>
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="m-0 text-lg font-semibold text-slate-950">Monthly Spending - {currentYear}</h2>
              <p className="m-0 mt-1 text-sm text-slate-500">Full-year month-by-month overview.</p>
            </div>
            {highestMonth && highestMonth.total > 0 && (
              <div className="text-sm text-slate-500">
                Highest month: <span className="font-semibold text-slate-900">{highestMonth.monthName}</span>
                <span className="ml-1 text-emerald-700">({formatCurrency(highestMonth.total)})</span>
              </div>
            )}
          </div>

          {loading ? (
            <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-6">
              {Array.from({ length: 12 }).map((_, index) => (
                <div key={`month-skel-${index}`} className="rounded-lg border border-slate-100 p-3">
                  <Skeleton.Input active size="small" block className="mb-2" />
                  <Skeleton.Input active size="small" block />
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-6">
              {monthlySeries.map((item) => (
                <div
                  key={item.monthKey}
                  className={`rounded-lg border p-3 ${item.isCurrentMonth ? 'border-blue-300 bg-blue-50' : 'border-slate-200 bg-white'}`}
                >
                  <div className="text-xs font-medium text-slate-500">{item.monthName}</div>
                  <div className={`mt-2 text-base font-semibold ${item.total > 0 ? 'text-slate-950' : 'text-slate-400'}`}>
                    {item.total > 0 ? formatCurrency(item.total) : '--'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </ProtectedRoute>
  );
}
