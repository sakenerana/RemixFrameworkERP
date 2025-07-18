import { GlobalOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import {
  Alert,
  Button,
  Card,
  Col,
  Flex,
  Progress,
  Row,
  Space,
  Spin,
  Statistic,
  TableColumnsType,
  TableProps,
  Tag,
} from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  FcDiploma1,
  FcInspection,
  FcMultipleDevices,
  FcNews,
  FcPackage,
} from "react-icons/fc";
import { RiCircleFill, RiPieChart2Fill } from "react-icons/ri";
import { useAuth } from "~/auth/AuthContext";

interface DataType {
  id: number;
  title: string;
  body: string;
  userId?: number;
}

// Language content
const translations = {
  en: {
    alertMessage: "You can see here all the status of overall workflows. Please check closely.",
    mostRequested: "Most Requested Workflows",
    readyToDeploy: "Ready to Deploy",
    pending: "Pending",
    archived: "Archived",
    users: "Users",
    dashboardTitle: "Workflow Dashboard",
    switchToFilipino: "Switch to Filipino",
    switchToEnglish: "Switch to English",
    toBeDetermined: "TBD"
  },
  fil: {
    alertMessage: "Maaari mong makita dito ang lahat ng status ng kabuuang trabaho. Mangyaring suriin nang mabuti.",
    mostRequested: "Pinaka-Hinihinging Workflows",
    readyToDeploy: "Handa nang I-deploy",
    pending: "Nakabinbin",
    archived: "Na-archive",
    users: "Mga User",
    dashboardTitle: "Dashboard ng Workflow",
    switchToFilipino: "Palitan sa Filipino",
    switchToEnglish: "Palitan sa Ingles",
    toBeDetermined: "TBD"
  }
};

export default function WorkflowDashboard() {
  const [data, setData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState<'en' | 'fil'>('en');
  const [t, setT] = useState(translations.en);
  const { user, token } = useAuth();
  // Toggle language
  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'fil' : 'en';
    setLanguage(newLanguage);
    setT(translations[newLanguage]);
  };

  const fetchData = async () => {
    try {
      const response = await axios
        .post<DataType[]>(
          "https://iaccs-api-staging.cficoop.com/api/external/activitybuilder/active-activities",
          {
            userid: user?.id ?? 4, // Replace with actual user ID logic
            username: user?.email ?? "raerana" // Replace with actual user email logic
          },
          {
            headers: {
              "x-external-platform": "erp",
              Authorization: `Bearer ${token}`
            }
          }
        )
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

    // try {
    //   const response = await axios
    //     .get<DataType[]>("https://jsonplaceholder.typicode.com/posts")
    //     .then((response) => {
    //       setData(response.data);
    //       setLoading(false);
    //     })
    //     .catch((error) => {
    //       setError(error.message);
    //       setLoading(false);
    //     });
    // } catch (err) {
    //   console.error(err);
    // }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onChange: TableProps<DataType>["onChange"] = (
    pagination,
    filters,
    sorter,
    extra
  ) => {
    console.log("params", pagination, filters, sorter, extra);
  };

  return (
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

      {/* First Row - Most Requested Workflows */}
      <Row gutter={16} className="pt-5 pb-3">
        <Col span={24}>
          <div className="shadow-lg m-[-7px]">
            {loading && <Spin></Spin>}
            {!loading && (
              <Card
                title={
                  <div className="flex items-center">
                    <RiPieChart2Fill className="mr-2 text-green-500" />
                    {t.mostRequested}
                  </div>
                }
              >
                <Flex gap="4px 0" wrap>
                  <Tag color="#87d068">{t.readyToDeploy}</Tag>
                  <Tag color="#f50">{t.pending}</Tag>
                  <Tag color="#b602f7">{t.archived}</Tag>
                  <Tag color="#079feb">{t.users}</Tag>
                </Flex>
                <Flex gap="small" vertical>
                  <Progress percent={30} />
                  <Progress percent={50} status="active" />
                  <Progress percent={70} status="exception" />
                  <Progress percent={100} />
                  <Progress percent={50} showInfo={false} />
                </Flex>
              </Card>
            )}
          </div>
        </Col>
      </Row>

      {/* Second Row - Workflow Cards */}
      <Row gutter={16} className="pt-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {data.map((item) => (
            <div key={item.id}>
              {loading && <Spin></Spin>}
              {!loading && (
                <Card
                  className="rounded-md shadow-md overflow-hidden transition-transform duration-300 hover:scale-105"
                >
                  <div>
                    <h2 className="text-sm font-semibold mb-2">
                      <RiCircleFill className="float-left text-[5px] text-green-500 mt-2 mr-2" />
                      {item.title}
                    </h2>
                  </div>
                  <div className="absolute top-0 right-0 px-3 py-1 text-xs font-medium rounded-bl-lg bg-green-100 text-green-800">
                    {t.toBeDetermined}
                  </div>
                </Card>
              )}
            </div>
          ))}
        </div>
      </Row>
    </div>
  );
}