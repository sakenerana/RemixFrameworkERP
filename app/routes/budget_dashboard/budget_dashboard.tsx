import {
  Alert,
  Button,
  Card,
  Col,
  Row,
  TableColumnsType,
  TableProps,
  Table,
} from "antd";
import { useState } from "react";
import { AiOutlineStock } from "react-icons/ai";
import { RiCircleFill, RiPieChart2Fill } from "react-icons/ri";
import BarChart from "~/components/bar_chart";
import PieChart from "~/components/pie_chart";

interface DataType {
  key: React.Key;
  date: string;
  name: string;
  created_by: string;
  action: string;
  item: string;
}

interface DataTypeLocation {
  key: React.Key;
  name: string;
  age: number;
  address: string;
}

interface DataTypeAssetCategories {
  key: React.Key;
  name: string;
  age: number;
  address: string;
}

// Language content
const translations = {
  en: {
    alertMessage: "You can see here all the status of overall budget status. Please check closely.",
    netWorth: "Net Worth",
    monthlyIncome: "Monthly Income",
    monthlyExpenses: "Monthly Expenses",
    savingsRate: "Savings Rate",
    totalAssetsMinusLiabilities: "Your total assets minus liabilities",
    totalIncomeThisMonth: "Total income this month",
    totalExpensesThisMonth: "Total expenses this month",
    percentageOfIncomeSaved: "Percentage of income saved",
    spendingByCategory: "Spending By Category",
    currentMonthBreakdown: "Current month breakdown",
    monthlySpendingTrend: "Monthly Spending Trend",
    lastMonths: "Last current months",
    accountsOverview: "Accounts Overview",
    recentTransactions: "Recent Transactions",
    dashboardTitle: "Budget Dashboard",
    switchToFilipino: "Switch to Filipino",
    switchToEnglish: "Switch to English",
    food: "Food",
    transport: "Transport",
    entertainment: "Entertainment",
    accounts: "Accounts",
    balance: "Balance",
    categories: "Categories",
    toBeDetermined: "TBD"
  },
  fil: {
    alertMessage: "Maaari mong makita dito ang lahat ng status ng kabuuang budget. Mangyaring suriin nang mabuti.",
    netWorth: "Netong Halaga",
    monthlyIncome: "Buwanang Kita",
    monthlyExpenses: "Buwanang Gastos",
    savingsRate: "Rate ng Pag-iipon",
    totalAssetsMinusLiabilities: "Ang iyong kabuuang assets minus liabilities",
    totalIncomeThisMonth: "Kabuuang kita ngayong buwan",
    totalExpensesThisMonth: "Kabuuang gastos ngayong buwan",
    percentageOfIncomeSaved: "Porsyento ng kita na naiipon",
    spendingByCategory: "Pagkakagastos ayon sa Kategorya",
    currentMonthBreakdown: "Pagbabalangkas ng kasalukuyang buwan",
    monthlySpendingTrend: "Trend ng Buwanang Paggastos",
    lastMonths: "Nakaraang mga buwan",
    accountsOverview: "Pangkalahatang-ideya ng mga Account",
    recentTransactions: "Mga Kamakailang Transaksyon",
    dashboardTitle: "Dashboard ng Budget",
    switchToFilipino: "Palitan sa Filipino",
    switchToEnglish: "Palitan sa Ingles",
    food: "Pagkain",
    transport: "Transportasyon",
    entertainment: "Aliwan",
    accounts: "Mga Account",
    balance: "Balanse",
    categories: "Mga Kategorya",
    toBeDetermined: "TBD"
  }
};

export default function BudgetRoutes() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  const columns: TableColumnsType<DataType> = [
    {
      title: "Date",
      dataIndex: "date",
    },
    {
      title: "Created By",
      dataIndex: "created_by",
    },
    {
      title: "Action",
      dataIndex: "action",
    },
    {
      title: "Item",
      dataIndex: "item",
    },
  ];

  const data: DataType[] = [
    {
      key: "1",
      date: "test",
      name: "John Brown",
      created_by: "test",
      action: "test",
      item: "test",
    },
    {
      key: "2",
      date: "test",
      name: "John Brown",
      created_by: "test",
      action: "test",
      item: "test",
    },
    {
      key: "3",
      date: "test",
      name: "John Brown",
      created_by: "test",
      action: "test",
      item: "test",
    },
    {
      key: "4",
      date: "test",
      name: "John Brown",
      created_by: "test",
      action: "test",
      item: "test",
    },
  ];

  const onChange: TableProps<DataType>["onChange"] = (
    pagination,
    filters,
    sorter,
    extra
  ) => {
    console.log("params", pagination, filters, sorter, extra);
  };

  const columnsLocation: TableColumnsType<DataTypeLocation> = [
    {
      title: t.accounts,
      dataIndex: "name",
    },
    {
      title: t.balance,
      dataIndex: "age",
    },
  ];

  const dataLocation: DataTypeLocation[] = [
    {
      key: "1",
      name: "John Brown",
      age: 32,
      address: "New York No. 1 Lake Park",
    },
    {
      key: "2",
      name: "Jim Green",
      age: 42,
      address: "London No. 1 Lake Park",
    },
    {
      key: "3",
      name: "Joe Black",
      age: 32,
      address: "Sydney No. 1 Lake Park",
    },
  ];

  const columnsAssetCategories: TableColumnsType<DataTypeAssetCategories> = [
    {
      title: t.categories,
      dataIndex: "name",
    },
    {
      title: t.balance,
      dataIndex: "age",
    },
  ];

  const DataTypeAssetCategories: DataTypeAssetCategories[] = [
    {
      key: "1",
      name: "John Brown",
      age: 32,
      address: "New York No. 1 Lake Park",
    },
    {
      key: "2",
      name: "Jim Green",
      age: 42,
      address: "London No. 1 Lake Park",
    },
    {
      key: "3",
      name: "Joe Black",
      age: 32,
      address: "Sydney No. 1 Lake Park",
    },
  ];

  const salesData = [
    { category: "Jan", value: 120 },
    { category: "Feb", value: 200 },
    { category: "Mar", value: 150 },
    { category: "Apr", value: 80 },
    { category: "May", value: 270 },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{t.dashboardTitle}</h1>
        <Button type="default" onClick={toggleLanguage}>
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
          <Card className="rounded-md shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
            <div>
              <h2 className="flex flex-wrap text-sm font-semibold mb-2">
                <RiCircleFill className="text-[5px] text-green-500 mt-2 mr-2" /> {t.netWorth}
              </h2>
              <p className="flex flex-wrap text-green-600 text-2xl font-bold">
                <AiOutlineStock className="mt-1 mr-2" /> {formatCurrency(123141)}
              </p>
              <p>{t.totalAssetsMinusLiabilities}</p>
            </div>
            <div className="absolute top-0 right-0 px-3 py-1 text-xs font-medium rounded-bl-lg bg-green-100 text-green-800">
              {t.toBeDetermined}
            </div>
          </Card>

          <Card className="rounded-md shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
            <div>
              <h2 className="flex flex-wrap text-sm font-semibold mb-2">
                <RiCircleFill className="text-[5px] text-green-500 mt-2 mr-2" /> {t.monthlyIncome}
              </h2>
              <p className="flex flex-wrap text-green-600 text-2xl font-bold">
                <AiOutlineStock className="mt-1 mr-2" /> {formatCurrency(123141)}
              </p>
              <p>{t.totalIncomeThisMonth}</p>
            </div>
            <div className="absolute top-0 right-0 px-3 py-1 text-xs font-medium rounded-bl-lg bg-green-100 text-green-800">
              {t.toBeDetermined}
            </div>
          </Card>

          <Card className="rounded-md shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
            <div>
              <h2 className="flex flex-wrap text-sm font-semibold mb-2">
                <RiCircleFill className="text-[5px] text-green-500 mt-2 mr-2" /> {t.monthlyExpenses}
              </h2>
              <p className="flex flex-wrap text-green-600 text-2xl font-bold">
                <AiOutlineStock className="mt-1 mr-2" /> {formatCurrency(123141)}
              </p>
              <p>{t.totalExpensesThisMonth}</p>
            </div>
            <div className="absolute top-0 right-0 px-3 py-1 text-xs font-medium rounded-bl-lg bg-green-100 text-green-800">
              {t.toBeDetermined}
            </div>
          </Card>

          <Card className="rounded-md shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
            <div>
              <h2 className="flex flex-wrap text-sm font-semibold mb-2">
                <RiCircleFill className="text-[5px] text-green-500 mt-2 mr-2" /> {t.savingsRate}
              </h2>
              <p className="flex flex-wrap text-green-600 text-2xl font-bold">
                <AiOutlineStock className="mt-1 mr-2" /> {formatCurrency(123141)}
              </p>
              <p>{t.percentageOfIncomeSaved}</p>
            </div>
            <div className="absolute top-0 right-0 px-3 py-1 text-xs font-medium rounded-bl-lg bg-green-100 text-green-800">
              {t.toBeDetermined}
            </div>
          </Card>
        </div>
      </Row>

      {/* Second Row - Charts */}
      <Row gutter={16} className="pt-5">
        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-2 gap-6 w-full">
          <Card className="rounded-md shadow-md overflow-hidden transition-transform duration-300">
            <div>
              <h2 className="flex flex-wrap text-sm font-semibold mb-2">
                <RiCircleFill className="text-[5px] text-green-500 mt-2 mr-2" /> {t.spendingByCategory}
              </h2>
              <p className="flex flex-wrap">{t.currentMonthBreakdown}</p>
              <PieChart
                data={[
                  { type: t.food, value: 27 },
                  { type: t.transport, value: 25 },
                  { type: t.entertainment, value: 18 },
                ]}
                title=""
              />
            </div>
          </Card>

          <Card className="rounded-md shadow-md overflow-hidden transition-transform duration-300">
            <div>
              <h2 className="flex flex-wrap text-sm font-semibold mb-2">
                <RiCircleFill className="text-[5px] text-green-500 mt-2 mr-2" /> {t.monthlySpendingTrend}
              </h2>
              <p className="flex flex-wrap">{t.lastMonths}</p>
              <BarChart
                data={salesData}
                title=""
                color="#16a34a"
                height={350}
              />
            </div>
          </Card>
        </div>
      </Row>

      {/* Third Row - Tables */}
      <Row gutter={32} className="pt-7">
        <Col span={12}>
          <div className="shadow-lg m-[-5px]">
            <Card title={
              <div className="flex items-center">
                <RiPieChart2Fill className="mr-2 text-green-500" />
                {t.accountsOverview}
              </div>
            }>
              <Table<DataTypeLocation>
                bordered
                size={"small"}
                columns={columnsLocation}
                dataSource={dataLocation}
              />
            </Card>
          </div>
        </Col>
        <Col span={12}>
          <div className="shadow-lg m-[-5px]">
            <Card title={
              <div className="flex items-center">
                <RiPieChart2Fill className="mr-2 text-green-500" />
                {t.recentTransactions}
              </div>
            }>
              <Table<DataTypeAssetCategories>
                bordered
                size={"small"}
                columns={columnsAssetCategories}
                dataSource={DataTypeAssetCategories}
              />
            </Card>
          </div>
        </Col>
      </Row>
    </div>
  );
}