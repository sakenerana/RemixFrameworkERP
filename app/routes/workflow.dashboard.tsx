import { GlobalOutlined, LoadingOutlined } from "@ant-design/icons";
import { Alert, Button, Card, Col, Flex, Progress, Row, Spin, Tag } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { RiCircleFill, RiPieChart2Fill } from "react-icons/ri";
import { useAuth } from "~/auth/AuthContext";
import { CrownFilled } from '@ant-design/icons';
import LineChart from "~/components/line_chart";

interface Activity {
  id: number;
  name: string;
  activities_count: number;
}

interface ApiResponse {
  data: Activity[];
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
  const [data, setData] = useState<ApiResponse>({ data: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<'en' | 'fil'>('en');
  const { user, token } = useAuth();

  const t = translations[language];

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'fil' : 'en');
  };

  const fetchData = async () => {
    const getABID = localStorage.getItem('ab_id');
    const getUsername = localStorage.getItem('username');

    try {
      setLoading(true);
      setError(null);

      const response = await axios.post<ApiResponse>(
        '/api/active-activities',
        {
          userid: Number(getABID),
          username: getUsername
        },
        // {
        //   headers: {
        //     "x-external-platform": "erp",
        //     "Authorization": `Bearer ${token}`,
        //     "Content-Type": "application/json"
        //   },
        //   withCredentials: true
        // }
      );

      console.log("RESPONSE", response.data)
      setData({
        ...response.data,
        data: response.data.data.sort((a, b) => b.activities_count - a.activities_count)
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const topActivities = [...data.data]
    .sort((a, b) => b.activities_count - a.activities_count)
    .slice(0, 3)
    .map(item => item.id);

  const trendData = [
    { date: "January", value: 35 },
    { date: "February", value: 42 },
    { date: "March", value: 38 },
    { date: "April", value: 51 },
    { date: "May", value: 49 },
    { date: "June", value: 49 },
    { date: "July", value: 49 },
    { date: "August", value: 49 },
    { date: "September", value: 49 },
    { date: "October", value: 49 },
    { date: "November", value: 49 },
    { date: "December", value: 50 },
  ];

  const top5Workflows = [...data.data]
    .sort((a, b) => b.activities_count - a.activities_count)
    .slice(0, 5);

  const barColors = ['#FFD700', '#C0C0C0', '#CD7F32', '#82ca9d', '#8884d8']; // Gold, Silver, Bronze, etc.


  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{t.dashboardTitle}</h1>
        <Button
          type="default"
          onClick={toggleLanguage}
          icon={<GlobalOutlined />}
        >
          {language === 'en' ? t.switchToFilipino : t.switchToEnglish}
        </Button>
      </div>

      {error && (
        <Alert message={`Error: ${error}`} type="error" className="mb-4" />
      )}

      <Alert
        message={t.alertMessage}
        type="info"
        showIcon
        className="mb-6"
      />

      {/* Stats Card */}
      {/* Top 3 Workflows – New Design */}
      <Row gutter={[16, 16]} className="mb-6">
        {top5Workflows.slice(0, 3).map((workflow, index) => {
          const rankColors = ['bg-yellow-400', 'bg-gray-400', 'bg-amber-600']; // Gold, Silver, Bronze
          const ranks = ['1st', '2nd', '3rd'];

          return (
            <Col key={workflow.id} xs={24} sm={12} md={8}>
              <Card
                className="h-full hover:shadow-lg transition-all duration-300"
                bodyStyle={{ padding: '20px' }}
              >
                <div className="flex flex-col items-start space-y-3">
                  {/* Rank Badge */}
                  <span
                    className={`text-white text-xs font-semibold px-3 py-1 rounded-full ${rankColors[index]}`}
                  >
                    {ranks[index]} Place
                  </span>

                  {/* Workflow Name */}
                  <h3 className="text-xl font-semibold line-clamp-2">
                    {workflow.name}
                  </h3>

                  {/* Usage Tag */}
                  <Tag
                    color="blue"
                    style={{
                      fontSize: '13px',
                      fontWeight: 600,
                      borderRadius: '4px',
                      padding: '2px 10px',
                    }}
                  >
                    {workflow.activities_count.toLocaleString()} Uses
                  </Tag>
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>


      {/* Activities Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spin
            size="large"
            tip="Loading user workflows..."
            indicator={<LoadingOutlined style={{ fontSize: 36 }} spin />}
          />
        </div>
      ) : (
        <>
          <Row gutter={[16, 16]}>
            {data.data.map((item) => {
              const rank = topActivities.indexOf(item.id) + 1;
              const crownColors = ['#FFD700', '#C0C0C0', '#CD7F32']; // Gold, Silver, Bronze

              return (
                <Col key={item.id} xs={24} sm={12} md={8} lg={6}>
                  <Card
                    className="h-full transition-transform hover:scale-105 hover:shadow-lg relative"
                    bodyStyle={{ padding: '12px' }}
                  >
                    {/* Only show crown for top 3 rankings */}
                    {rank <= 3 && (
                      <div className="absolute -top-2 -right-2">
                        <CrownFilled
                          style={{
                            display: rank === 0 ? 'none': '',
                            fontSize: '18px',
                            color: crownColors[rank - 1], // Applies gold/silver/bronze
                            filter: 'drop-shadow(0px 1px 2px rgba(0,0,0,0.3))'
                          }}
                        />
                        <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs font-bold text-white">
                          {rank === 0 ? '' : rank}
                        </span>
                      </div>
                    )}
                    <div className="flex items-start">
                      <RiCircleFill className="text-[5px] text-green-500 mt-2 mr-2" />
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold mb-0 line-clamp-2">
                          {item.name}
                        </h3>
                        <div className="text-right mt-2">
                          <Tag
                            color={
                              rank === 1 ? 'gold' :
                                rank === 2 ? 'default' :
                                  rank === 3 ? 'orange' : 'green'
                            }
                          >
                            {item.activities_count.toLocaleString()}
                          </Tag>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </>
      )}

    </div>
  );
}