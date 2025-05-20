import { HomeOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "@remix-run/react";
import {
  Alert,
  Breadcrumb,
  Button,
  Progress,
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
import { AiOutlinePlus, AiOutlineStock } from "react-icons/ai";
import { FcInspection, FcRefresh, FcRules, FcStatistics } from "react-icons/fc";

interface DataType {
  id: number;
  title: string;
  body: string;
  userId?: number; // Optional property
}

export default function Budgets() {
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

  const getBudgetProgress = (spent: number, total: number) => {
    return Math.min((spent / total) * 100, 100);
  };

  const getBudgetStatusColor = (spent: number, total: number) => {
    const percentage = (spent / total) * 100;
    if (percentage < 70) return "text-green-600";
    if (percentage < 90) return "text-amber-600";
    return "text-red-600";
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

  return (
    <div>
      <div className="flex pb-5 justify-between">
        <Breadcrumb
          items={[
            {
              href: "/workflow",
              title: <HomeOutlined />,
            },
            {
              title: "Budget",
            },
            {
              title: "Budgets",
            },
          ]}
        />
        <Space direction="horizontal">
          <Space wrap>
            <Link to={"create-budget"}>
              <Button icon={<AiOutlinePlus />} type="primary">
                Create Account
              </Button>
            </Link>
          </Space>
        </Space>
      </div>
      <Alert
        message="You can see here all the status of overall budget status. Please check closely."
        type="info"
        showIcon
      />

      {/* THIS IS THE FIRST ROWN OF DASHBOARD */}

      <Row gutter={16} className="pt-5">
        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-2 gap-6 w-full">
          {data.map((data) => (
            <>
              {loading && <Spin></Spin>}
              {!loading && (
                <div
                  className="rounded-md shadow-md overflow-hidden transition-transform duration-300 hover:shadow-sm p-6"
                  style={{ border: "1px solid #e1e3e1" }}
                >
                  <div className="flex flex-wrap justify-between">
                    <h2 className="text-sm font-semibold mb-2">Net Worth</h2>
                    <div className={getBudgetStatusColor(12, 150)}>
                      <span className="text-lg font-bold">
                        {formatCurrency(12)}
                      </span>
                      <span className="text-sm font-normal text-muted-foreground text-gray-600">
                        {" "}
                        / {formatCurrency(150)}
                      </span>
                    </div>
                  </div>
                  <span>Progress</span>
                  <Progress percent={getBudgetProgress(75, 150)} status="active" />
                  <p>Categories: </p>
                </div>
              )}
            </>
          ))}
        </div>
      </Row>
    </div>
  );
}
