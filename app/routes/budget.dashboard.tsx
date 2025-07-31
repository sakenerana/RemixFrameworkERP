import { GlobalOutlined } from "@ant-design/icons";
import {
  Alert,
  Button,
  Card,
  Col,
  Row,
  TableColumnsType,
  TableProps,
  Table,
  Tag,
  Progress,
} from "antd";
import { useState } from "react";
import { AiOutlineDollar, AiOutlineFileText, AiOutlineInfoCircle, AiOutlineShoppingCart, AiOutlineStock, AiOutlineWallet } from "react-icons/ai";
import { RiCircleFill, RiPieChart2Fill } from "react-icons/ri";
import BarChart from "~/components/bar_chart";
import PieChart from "~/components/pie_chart";
import { ProtectedRoute } from "~/components/ProtectedRoute";

interface DataType {
  key: React.Key;
  date: string;
  name: string;
  created_by: string;
  action: string;
  item: string;
}

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<'en' | 'fil'>('en');
  const [t, setT] = useState(translations.en);

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

  const onChange: TableProps<DataType>["onChange"] = (
    pagination,
    filters,
    sorter,
    extra
  ) => {
    console.log("params", pagination, filters, sorter, extra);
  };

  const salesData = [
    { category: "Jan", value: 120, date: '2023-03-01' },
    { category: "Feb", value: 200, date: '2023-03-01' },
    { category: "Mar", value: 150, date: '2023-03-01' },
    { category: "Apr", value: 80, date: '2023-03-01' },
    { category: "May", value: 270, date: '2023-03-01' },
  ];

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
            <Card className="rounded-md shadow-sm overflow-hidden transition-transform duration-300 hover:scale-[1.02]">
              <div>
                <h2 className="flex flex-wrap text-sm font-semibold mb-2">
                  <RiCircleFill className="text-[5px] text-blue-500 mt-2 mr-2" /> Total Budget
                </h2>
                <p className="flex flex-wrap text-blue-600 text-2xl font-bold">
                  <AiOutlineDollar className="mt-1 mr-2" /> {formatCurrency(Number(12345) || 0)}
                </p>
                <p className="text-xs mt-4 text-gray-500">Annual allocation for {new Date().getFullYear()}</p>
              </div>
              <div className="absolute top-0 right-0 px-3 py-1 text-xs font-medium rounded-bl-lg bg-blue-100 text-blue-800">
                Annual
              </div>
            </Card>

            {/* 2. Total Requisition for this year */}
            <Card className="rounded-md shadow-sm overflow-hidden transition-transform duration-300 hover:scale-[1.02]">
              <div>
                <h2 className="flex flex-wrap text-sm font-semibold mb-2">
                  <RiCircleFill className="text-[5px] text-amber-500 mt-2 mr-2" /> Total Requisition
                </h2>
                <p className="flex flex-wrap text-amber-600 text-2xl font-bold">
                  <AiOutlineShoppingCart className="mt-1 mr-2" /> {formatCurrency(Number(12345) || 0)}
                </p>
                <p className="text-xs mt-4 text-gray-500">Approved requests this year</p>
              </div>
              <div className="absolute top-0 right-0 px-3 py-1 text-xs font-medium rounded-bl-lg bg-amber-100 text-amber-800">
                YTD
              </div>
            </Card>

            {/* 3. Total Liquidation for this year */}
            <Card className="rounded-md shadow-sm overflow-hidden transition-transform duration-300 hover:scale-[1.02]">
              <div>
                <h2 className="flex flex-wrap text-sm font-semibold mb-2">
                  <RiCircleFill className="text-[5px] text-purple-500 mt-2 mr-2" /> Total Liquidation
                </h2>
                <p className="flex flex-wrap text-purple-600 text-2xl font-bold">
                  <AiOutlineFileText className="mt-1 mr-2" /> {formatCurrency(Number(12345) || 0)}
                </p>
                <p className="text-xs mt-4 text-gray-500">Settled expenses this year</p>
              </div>
              <div className="absolute top-0 right-0 px-3 py-1 text-xs font-medium rounded-bl-lg bg-purple-100 text-purple-800">
                YTD
              </div>
            </Card>

            {/* 4. Amount Spent */}
            <Card className="rounded-md shadow-sm overflow-hidden transition-transform duration-300 hover:scale-[1.02]">
              <div>
                <h2 className="flex flex-wrap text-sm font-semibold mb-2">
                  <RiCircleFill className="text-[5px] text-green-500 mt-2 mr-2" /> Amount Spent
                </h2>
                <p className="flex flex-wrap text-green-600 text-2xl font-bold">
                  <AiOutlineWallet className="mt-1 mr-2" /> {formatCurrency((Number(12345) || 0) - (Number(12345) || 0))}
                </p>
                <p className="text-xs mt-4 text-gray-500">Annual spent this year</p>
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
          </div>
        </Row>

        {/* Second Row - Charts */}
        <Row gutter={16} className="pt-5">
          <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-2 gap-6 w-full">
            <Card className="rounded-md shadow-sm overflow-hidden transition-transform duration-300">
              <div>
                <h2 className="flex flex-wrap text-sm font-semibold mb-2">
                  <RiCircleFill className="text-[5px] text-green-500 mt-2 mr-2" /> {t.spendingByCategory}
                </h2>
                <p className="flex flex-wrap text-xs">{t.currentMonthBreakdown}</p>
                <PieChart
                  data={[
                    { type: 'test1', value: 27 },
                    { type: 'test2', value: 25 },
                    { type: 'test3', value: 25 },
                    { type: 'test4', value: 25 },
                  ]}
                  title=""
                />
              </div>
            </Card>

            <div className="rounded-lg p-4 border border-gray-200 shadow-sm">
              {/* Header */}
              <div className="flex items-center gap-2 mb-3">
                <RiCircleFill className="text-green-500 text-[5px] mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold">Monthly Spending - 2023</h3>
                  <p className="text-xs">Full year overview</p>
                </div>
              </div>

              {/* Monthly Data Grid */}
              <div className="grid grid-cols-3 gap-3 mt-4">
                {Array.from({ length: 12 }).map((_, index) => {
                  const monthName = new Date(2023, index).toLocaleString('default', { month: 'long' });
                  const monthData = salesData.find(item => new Date(item.date).getMonth() === index);
                  const amount = monthData?.value || 0;
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
                      <div className={`text-sm ${amount > 0 ? 'font-semibold text-gray-800' : 'text-gray-400'
                        }`}>
                        {amount > 0 ? `${formatCurrency(amount ?? 0)}` : '—'}
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
                    ${salesData.reduce((sum, item) => sum + item.value, 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span>Highest month:</span>
                  <span className="font-medium">
                    {new Date(Math.max(...salesData.map(d => new Date(d.date).getTime())))
                      .toLocaleString('default', { month: 'long' })}
                    <span className="text-green-600 ml-1">
                      (${Math.max(...salesData.map(d => d.value)).toLocaleString()})
                    </span>
                  </span>
                </div>
              </div>
            </div>
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