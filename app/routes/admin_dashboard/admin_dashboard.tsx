import {
  Alert,
  Card,
  Col,
  Row,
  TableColumnsType,
  TableProps,
  Table,
  message,
} from "antd";
import { useEffect, useState } from "react";
import { AiOutlineStock, AiOutlineUserAdd } from "react-icons/ai";
import {
} from "react-icons/fc";
import BarChart from "~/components/bar_chart";
import PieChart from "~/components/pie_chart";
import { DepartmentService } from "~/services/department.service";
import { GroupService } from "~/services/groups.service";
import { UserService } from "~/services/user.service";
import { User } from "~/types/user.type";

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
  const [dataUser, setDataUser] = useState<any>();
  const [dataDepartment, setDataDepartment] = useState<any>();
  const [dataGroup, setDataGroup] = useState<any>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from Supabase
  const fetchDataUser = async () => {
    try {
      setLoading(true);
      const data = await UserService.getTableCounts();
      setDataUser(data); // Works in React state
    } catch (error) {
      message.error("error");
    } finally {
      setLoading(false);
    }
  };

  // Fetch data from Supabase
  const fetchDataDepartment = async () => {
    try {
      setLoading(true);
      const data = await DepartmentService.getTableCounts();
      setDataDepartment(data); // Works in React state
    } catch (error) {
      message.error("error");
    } finally {
      setLoading(false);
    }
  };

  // Fetch data from Supabase
  const fetchDataGroup = async () => {
    try {
      setLoading(true);
      const data = await GroupService.getTableCounts();
      setDataGroup(data); // Works in React state
    } catch (error) {
      message.error("error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDataUser();
    fetchDataDepartment();
    fetchDataGroup();
  }, []); // Empty dependency array means this runs once on mount
  
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
        message="You can see here all the status of overall admin status. Please check closely."
        type="info"
        showIcon
      />

      {/* THIS IS THE FIRST ROWN OF DASHBOARD */}

      <Row gutter={16} className="pt-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-6 w-full">
          <div
            className="rounded-md shadow-md overflow-hidden transition-transform duration-300 hover:scale-105"
            style={{ border: "1px solid #e1e3e1" }}
          >
            <div className="p-6">
              <h2 className="text-sm font-semibold mb-2">Users</h2>
              <p className="flex flex-wrap text-green-600 text-2xl font-bold">
                <AiOutlineUserAdd className="mt-1 mr-2" />{" "}
                {dataUser}
              </p>
              <p>Your total user's of ERP System</p>
            </div>
          </div>
          <div
            className="rounded-md shadow-md overflow-hidden transition-transform duration-300 hover:scale-105"
            style={{ border: "1px solid #e1e3e1" }}
          >
            <div className="p-6">
              <h2 className="text-sm font-semibold mb-2">Departments</h2>
              <p className="flex flex-wrap text-green-600 text-2xl font-bold">
                <AiOutlineStock className="mt-1 mr-2" />{" "}
                {dataDepartment}
              </p>
              <p>Total department's of ERP System</p>
            </div>
          </div>
          <div
            className="rounded-md shadow-md overflow-hidden transition-transform duration-300 hover:scale-105"
            style={{ border: "1px solid #e1e3e1" }}
          >
            <div className="p-6">
              <h2 className="text-sm font-semibold mb-2">Groups</h2>
              <p className="flex flex-wrap text-green-600 text-2xl font-bold">
                <AiOutlineStock className="mt-1 mr-2" />{" "}
                {dataGroup}
              </p>
              <p>Total group's of ERP System</p>
            </div>
          </div>
          <div
            className="rounded-md shadow-md overflow-hidden transition-transform duration-300 hover:scale-105"
            style={{ border: "1px solid #e1e3e1" }}
          >
            <div className="p-6">
              <h2 className="text-sm font-semibold mb-2">Savings Rate</h2>
              <p className="flex flex-wrap text-green-600 text-2xl font-bold">
                <AiOutlineStock className="mt-1 mr-2" />{" "}
                {formatCurrency(123141)}
              </p>
              <p>Percentage of income saved</p>
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

      {/* THIS IS THE THIRD ROW OF DASHBOARD */}

      <Row gutter={16} className="pt-5">
        <Col span={12}>
          <div className="shadow-md">
            <Card title="Accounts Overview" variant="borderless">
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
          <div className="shadow-md">
            <Card title="Recent Transactions" variant="borderless">
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
