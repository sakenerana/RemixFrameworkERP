import { HomeOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "@remix-run/react";
import {
  Alert,
  Breadcrumb,
  Button,
  Row,
  Space,
  Spin,
  Table,
  TableColumnsType,
  Tabs,
  TabsProps,
} from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  AiOutlinePlus,
  AiOutlineStock,
} from "react-icons/ai";
import { FcInspection, FcRefresh, FcRules, FcStatistics } from "react-icons/fc";

interface DataType {
  id: number;
  title: string;
  body: string;
  userId?: number; // Optional property
}

export default function BudgetAccounts() {
  const [data, setData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "PHP",
    }).format(amount);
  };

  const handleRefetch = async () => {
    setLoading(true);
    await fetchData();
    setLoading(false);
  };

  const fetchData = async () => {
    try {
      const response = await axios
        .get<DataType[]>("https://jsonplaceholder.typicode.com/posts") // Specify response type
        .then((response) => {
          setData(response.data);
          setLoading(false);
        })
        .catch((error) => {
          setError(error.message);
          setLoading(false);
        });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // Empty dependency array means this runs once on mount

  const columns: TableColumnsType<DataType> = [
    {
      title: "Name",
      dataIndex: "name",
      width: 120,
    },
    {
      title: "Type",
      dataIndex: "product_key",
      width: 120,
    },
    {
      title: "Balance",
      dataIndex: "product_key",
      width: 120,
    },
    {
      title: "Last Updated",
      dataIndex: "product_key",
      width: 120,
    },
  ];

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "All Accounts",
      icon: <FcRules className="float-left mt-1" />,
      children: (
        <div>
          {loading && <Spin></Spin>}
          {!loading && (
            <Table<DataType>
              size="small"
              columns={columns}
              dataSource={data}
              className="pt-5"
              bordered
              scroll={{ x: "max-content" }}
            />
          )}
        </div>
      ),
    },
    {
      key: "2",
      label: "Assets",
      icon: <FcInspection className="float-left mt-1" />,
      children: (
        <div>
          {loading && <Spin></Spin>}
          {!loading && (
            <Table<DataType>
              size="small"
              columns={columns}
              dataSource={data}
              className="pt-5"
              bordered
              scroll={{ x: "max-content" }}
            />
          )}
        </div>
      ),
    },
    {
      key: "3",
      label: "Liabilities",
      icon: <FcStatistics className="float-left mt-1" />,
      children: (
        <div>
          {loading && <Spin></Spin>}
          {!loading && (
            <Table<DataType>
              size="small"
              columns={columns}
              dataSource={data}
              className="pt-5"
              bordered
              scroll={{ x: "max-content" }}
            />
          )}
        </div>
      ),
    },
  ];

  const onChange = (key: string) => {
    console.log(key);
  };

  return (
    <div>
      <div className="flex pb-5 justify-between">
        <Breadcrumb
          items={[
            {
              href: "/budget",
              title: <HomeOutlined />,
            },
            {
              title: "Budget",
            },
            {
              title: "Accounts",
            },
          ]}
        />
        <Space direction="horizontal">
          <Space wrap>
            <Button onClick={handleRefetch} icon={<FcRefresh />} type="default">
              Refresh
            </Button>
          </Space>
          <Space wrap>
            <Link to={"create-accounts"}>
              <Button icon={<AiOutlinePlus />} type="primary">
                Create Account
              </Button>
            </Link>
          </Space>
        </Space>
      </div>
      <Alert
        message="You can see here all the list and status of  accounts. Please check closely."
        type="info"
        showIcon
      />
      {/* THIS IS THE FIRST ROWN OF DASHBOARD */}

      <Row gutter={16} className="pt-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-6 w-full">
          <div
            className="rounded-md shadow-md overflow-hidden transition-transform duration-300 hover:scale-105"
            style={{ border: "1px solid #e1e3e1" }}
          >
            <div className="p-6">
              <h2 className="text-sm font-semibold mb-2">Total Assets</h2>
              <p className="flex flex-wrap text-green-600 text-2xl font-bold">
                <AiOutlineStock className="mt-1 mr-2" />{" "}
                {formatCurrency(123141)}
              </p>
            </div>
          </div>
          <div
            className="rounded-md shadow-md overflow-hidden transition-transform duration-300 hover:scale-105"
            style={{ border: "1px solid #e1e3e1" }}
          >
            <div className="p-6">
              <h2 className="text-sm font-semibold mb-2">Total Liabilities</h2>
              <p className="flex flex-wrap text-red-600 text-2xl font-bold">
                <AiOutlineStock className="mt-1 mr-2" />{" "}
                {formatCurrency(123141)}
              </p>
            </div>
          </div>
          <div
            className="rounded-md shadow-md overflow-hidden transition-transform duration-300 hover:scale-105"
            style={{ border: "1px solid #e1e3e1" }}
          >
            <div className="p-6">
              <h2 className="text-sm font-semibold mb-2">Net Worth</h2>
              <p className="flex flex-wrap text-green-600 text-2xl font-bold">
                <AiOutlineStock className="mt-1 mr-2" />{" "}
                {formatCurrency(123141)}
              </p>
            </div>
          </div>
        </div>
      </Row>
      <Row gutter={16} className="pt-5">
        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 2xl:grid-cols-1 gap-6 w-full">
          <Tabs type="card" items={items} onChange={onChange} />
        </div>
      </Row>
    </div>
  );
}
