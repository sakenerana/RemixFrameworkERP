import {
  Alert,
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

export default function BudgetRoutes() {
  //   const [data, setData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
      title: "Accounts",
      dataIndex: "name",
    },
    {
      title: "Balance",
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
      title: "Categories",
      dataIndex: "name",
    },
    {
      title: "Balance",
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
      <Alert
        message="You can see here all the status of overall budget status. Please check closely."
        type="info"
        showIcon
      />

      {/* THIS IS THE FIRST ROWN OF DASHBOARD */}

      <Row gutter={16} className="pt-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-6 w-full">
          <Card
            className="rounded-md shadow-md overflow-hidden transition-transform duration-300 hover:scale-105"
          >
            <div>
              <h2 className="flex flex-wrap text-sm font-semibold mb-2"><RiCircleFill className="text-[5px] text-green-500 mt-2 mr-2" /> Net Worth</h2>
              <p className="flex flex-wrap text-green-600 text-2xl font-bold">
                <AiOutlineStock className="mt-1 mr-2" />{" "}
                {formatCurrency(123141)}
              </p>
              <p>Your total assets minus liabilities</p>
            </div>
          </Card>
          <Card
            className="rounded-md shadow-md overflow-hidden transition-transform duration-300 hover:scale-105"
          >
            <div>
              <h2 className="flex flex-wrap text-sm font-semibold mb-2"><RiCircleFill className="text-[5px] text-green-500 mt-2 mr-2" /> Monthly Income</h2>
              <p className="flex flex-wrap text-green-600 text-2xl font-bold">
                <AiOutlineStock className="mt-1 mr-2" />{" "}
                {formatCurrency(123141)}
              </p>
              <p>Total income this month</p>
            </div>
          </Card>
          <Card
            className="rounded-md shadow-md overflow-hidden transition-transform duration-300 hover:scale-105"
          >
            <div>
              <h2 className="flex flex-wrap text-sm font-semibold mb-2"><RiCircleFill className="text-[5px] text-green-500 mt-2 mr-2" /> Monthly Expenses</h2>
              <p className="flex flex-wrap text-green-600 text-2xl font-bold">
                <AiOutlineStock className="mt-1 mr-2" />{" "}
                {formatCurrency(123141)}
              </p>
              <p>Total expenses this month</p>
            </div>
          </Card>
          <Card
            className="rounded-md shadow-md overflow-hidden transition-transform duration-300 hover:scale-105"
          >
            <div>
              <h2 className="flex flex-wrap text-sm font-semibold mb-2"><RiCircleFill className="text-[5px] text-green-500 mt-2 mr-2" /> Savings Rate</h2>
              <p className="flex flex-wrap text-green-600 text-2xl font-bold">
                <AiOutlineStock className="mt-1 mr-2" />{" "}
                {formatCurrency(123141)}
              </p>
              <p>Percentage of income saved</p>
            </div>
          </Card>
        </div>
      </Row>

      {/* THIS IS THE SECOND ROW OF DASHBOARD */}

      <Row gutter={16} className="pt-5">
        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-2 gap-6 w-full">
          <Card
            className="rounded-md shadow-md overflow-hidden transition-transform duration-300"
          >
            <div>
              <h2 className="flex flex-wrap text-sm font-semibold mb-2">
                <RiCircleFill className="text-[5px] text-green-500 mt-2 mr-2" /> Spending By Category
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
          </Card>
          <Card
            className="rounded-md shadow-md overflow-hidden transition-transform duration-300"
          >
            <div>
              <h2 className="flex flex-wrap text-sm font-semibold mb-2">
                <RiCircleFill className="text-[5px] text-green-500 mt-2 mr-2" /> Monthly Spending Trend
              </h2>
              <p className="flex flex-wrap">Last current months</p>
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

      {/* THIS IS THE THIRD ROW OF DASHBOARD */}

      <Row gutter={32} className="pt-7">
        <Col span={12}>
          <div className="shadow-lg m-[-5px]">
            <Card title={
              <div className="flex items-center">
                <RiPieChart2Fill className="mr-2 text-green-500" /> {/* Your icon */}
                Accounts Overview
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
                <RiPieChart2Fill className="mr-2 text-green-500" /> {/* Your icon */}
                Recent Transactions
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
