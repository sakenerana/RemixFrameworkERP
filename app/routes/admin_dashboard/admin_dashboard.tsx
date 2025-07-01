import { CheckCircleOutlined } from "@ant-design/icons";
import {
  Alert,
  Card,
  Col,
  Row,
  TableColumnsType,
  TableProps,
  Table,
  message,
  Tag,
  Spin,
} from "antd";
import { useEffect, useState } from "react";
import { AiOutlineSolution, AiOutlineUserAdd, AiOutlineUserDelete, AiOutlineUsergroupAdd } from "react-icons/ai";
import {
} from "react-icons/fc";
import { RiCircleFill, RiPieChart2Fill } from "react-icons/ri";
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
  const [dataUserTable, setDataUserTable] = useState<User[]>([]);
  const [dataDepartment, setDataDepartment] = useState<any>();
  const [dataGroup, setDataGroup] = useState<any>();
  const [dataInactiveUsers, setDataInactiveUsers] = useState<any>();
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
  const fetchDataUserTable = async () => {
    try {
      setLoading(true);
      const dataFetch = await UserService.getActiveUsers();
      setDataUserTable(dataFetch); // Works in React state
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

  // Fetch data from Supabase
  const fetchDataInactiveUsers = async () => {
    try {
      setLoading(true);
      const data = await UserService.getTableCountsInactiveUsers();
      setDataInactiveUsers(data); // Works in React state
    } catch (error) {
      message.error("error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDataUser();
    fetchDataUserTable();
    fetchDataDepartment();
    fetchDataGroup();
    fetchDataInactiveUsers();
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

  const columnsUser: TableColumnsType<User> = [
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: () => (
        <>
          <Tag color="green">
            <CheckCircleOutlined className="float-left mt-1 mr-1" /> Active
          </Tag>
        </>
      )
    },
  ];

  const salesData = [
    { category: "Jan", value: dataUser },
    { category: "Feb", value: 200 },
    { category: "Mar", value: 150 },
    { category: "Apr", value: 80 },
    { category: "May", value: 270 },
    { category: "Jun", value: 270 },
    { category: "Jul", value: 270 },
    { category: "Aug", value: 270 },
    { category: "Sept", value: 270 },
    { category: "Oct", value: 270 },
    { category: "Nov", value: 270 },
    { category: "Dec", value: 270 },
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
          <Card
            className="rounded-md shadow-md overflow-hidden transition-transform duration-300 hover:scale-105"
          >
            <div>
              <h2 className="flex flex-wrap text-sm font-semibold mb-2"><RiCircleFill className="text-[5px] text-green-500 mt-2 mr-2" /> Users</h2>
              <p className="flex flex-wrap text-green-600 text-2xl font-bold">
                <AiOutlineUserAdd className="mt-1 mr-2" />{" "}
                {loading && <Spin></Spin>}
                {!loading && dataUser}
              </p>
              <p>Your total user's of ERP System</p>
            </div>
          </Card>
          <Card
            className="rounded-md shadow-md overflow-hidden transition-transform duration-300 hover:scale-105"
          >
            <div>
              <h2 className="flex flex-wrap text-sm font-semibold mb-2"><RiCircleFill className="text-[5px] text-green-500 mt-2 mr-2" /> Departments</h2>
              <p className="flex flex-wrap text-green-600 text-2xl font-bold">
                <AiOutlineSolution className="mt-1 mr-2" />{" "}
                {loading && <Spin></Spin>}
                {!loading && dataDepartment}
              </p>
              <p>Total department's of ERP System</p>
            </div>
          </Card>
          <Card
            className="rounded-md shadow-md overflow-hidden transition-transform duration-300 hover:scale-105"
          >
            <div>
              <h2 className="flex flex-wrap text-sm font-semibold mb-2"><RiCircleFill className="text-[5px] text-green-500 mt-2 mr-2" /> Groups</h2>
              <p className="flex flex-wrap text-green-600 text-2xl font-bold">
                <AiOutlineUsergroupAdd className="mt-1 mr-2" />{" "}
                {loading && <Spin></Spin>}
                {!loading && dataGroup}
              </p>
              <p>Total group's of ERP System</p>
            </div>
          </Card>
          <Card
            className="rounded-md shadow-md overflow-hidden transition-transform duration-300 hover:scale-105"
          >
            <div>
              <h2 className="flex flex-wrap text-sm font-semibold mb-2"><RiCircleFill className="text-[5px] text-green-500 mt-2 mr-2" /> Inactive Users</h2>
              <p className="flex flex-wrap text-red-600 text-2xl font-bold">
                <AiOutlineUserDelete className="mt-1 mr-2" />{" "}
                {loading && <Spin></Spin>}
                {!loading && dataInactiveUsers}
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
                <RiCircleFill className="text-[5px] text-green-500 mt-2 mr-2" /> Added By Category
              </h2>
              <p className="flex flex-wrap">Current month breakdown</p>
              {loading && <Spin></Spin>}
              {!loading &&
                <PieChart
                  data={[
                    { type: "Users", value: dataUser },
                    { type: "Departments", value: dataDepartment },
                    { type: "Groups", value: dataGroup },
                    { type: "Inactive Users", value: dataGroup },
                  ]}
                  title=""
                />}

            </div>
          </Card>
          <Card
            className="rounded-md shadow-md overflow-hidden transition-transform duration-300"
          >
            <div>
              <h2 className="flex flex-wrap text-sm font-semibold mb-2">
                <RiCircleFill className="text-[5px] text-green-500 mt-2 mr-2" /> Monthly Data Trend
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

      <Row gutter={16} className="pt-7">
        <Col span={24}>
          <div className="shadow-lg m-[-5px]">
            <Card title={
              <div className="flex items-center">
                <RiPieChart2Fill className="mr-2 text-green-500" /> {/* Your icon */}
                Accounts Overview
              </div>
            }>
              {loading && <Spin></Spin>}
              {!loading &&
                <Table<User>
                  bordered
                  size={"small"}
                  columns={columnsUser}
                  dataSource={dataUserTable}
                />}
            </Card>
          </div>
        </Col>
      </Row>
    </div>
  );
}
