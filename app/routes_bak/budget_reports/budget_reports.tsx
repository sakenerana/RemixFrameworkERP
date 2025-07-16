import { Alert, Row } from "antd";
import BarChart from "~/components/bar_chart";
import LineChart from "~/components/line_chart";
import PieChart from "~/components/pie_chart";

export default function BudgetReports() {
  const salesData = [
    { category: "Jan", value: 120 },
    { category: "Feb", value: 200 },
    { category: "Mar", value: 150 },
    { category: "Apr", value: 80 },
    { category: "May", value: 270 },
  ];

  const trendData = [
    { date: "2023-01", value: 35 },
    { date: "2023-02", value: 42 },
    { date: "2023-03", value: 38 },
    { date: "2023-04", value: 51 },
    { date: "2023-05", value: 49 },
    { date: "2023-06", value: 49 },
    { date: "2023-07", value: 49 },
    { date: "2023-08", value: 49 },
    { date: "2023-09", value: 49 },
    { date: "2023-10", value: 49 },
    { date: "2023-11", value: 49 },
  ];

  return (
    <div>
      <Alert
        message="Financial Reports. Analyze your financial data."
        type="info"
        showIcon
      />

      {/* THIS IS THE FIRST ROW OF DASHBOARD */}

      <Row gutter={16} className="pt-5">
        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 2xl:grid-cols-1 gap-6 w-full">
          <div
            className="rounded-md shadow-md overflow-hidden transition-transform duration-300"
            style={{ border: "1px solid #e1e3e1" }}
          >
            <div className="p-6">
              <h2 className="text-sm font-semibold mb-2">
                Spending By Category
              </h2>
              <p className="flex flex-wrap">Current month breakdown</p>
              <LineChart
                data={trendData}
                title="Monthly Performance"
                color="#6a5acd"
              />
            </div>
          </div>
        </div>
      </Row>

      {/* THIS IS THE SECOND ROW OF DASHBOARD */}

      <Row gutter={16} className="pt-5">
        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-2 gap-6 w-full">
          <div
            className="rounded-md shadow-md overflow-hidden transition-transform duration-300"
            style={{ border: "1px solid #e1e3e1" }}
          >
            <div className="p-6">
              <h2 className="text-sm font-semibold mb-2">
                Spending By Category
              </h2>
              <p className="flex flex-wrap">Current month breakdown</p>
              <PieChart
                data={[
                  { type: "Food", value: 27 },
                  { type: "Transport", value: 25 },
                  { type: "Entertainment", value: 18 },
                ]}
                title=""
              />
            </div>
          </div>
          <div
            className="rounded-md shadow-md overflow-hidden transition-transform duration-300"
            style={{ border: "1px solid #e1e3e1" }}
          >
            <div className="p-6">
              <h2 className="text-sm font-semibold mb-2">
                Monthly Spending Trend
              </h2>
              <p className="flex flex-wrap">Last current months</p>
              <BarChart
                data={salesData}
                title=""
                color="#16a34a"
                height={350}
              />
            </div>
          </div>
        </div>
      </Row>
    </div>
  );
}
