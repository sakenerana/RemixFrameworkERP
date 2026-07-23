import {
  AppstoreOutlined,
  BarChartOutlined,
  GlobalOutlined,
  LoadingOutlined,
  ReloadOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import { Alert, Button, Card, Col, Progress, Row, Spin, Statistic, Tag, Typography } from "antd";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { CrownFilled } from '@ant-design/icons';

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
    alertMessage: "Monitor workflow usage and identify the most requested services across departments.",
    mostRequested: "Most Requested Workflows",
    readyToDeploy: "Ready to Deploy",
    pending: "Pending",
    archived: "Archived",
    users: "Users",
    dashboardTitle: "Workflows",
    switchToFilipino: "Switch to Filipino",
    switchToEnglish: "Switch to English",
    toBeDetermined: "TBD"
  },
  fil: {
    alertMessage: "Subaybayan ang paggamit ng workflow at tukuyin ang pinaka-hinihinging serbisyo sa mga departamento.",
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

const CACHE_KEY = 'workflowDashboardData';
const CACHE_EXPIRY = 15 * 60 * 1000; // 15 minutes
const { Text, Title } = Typography;

export default function WorkflowDashboard() {
  const [data, setData] = useState<ApiResponse>({ data: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<'en' | 'fil'>('en');

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

      // Check cache first
      const cachedData = localStorage.getItem(CACHE_KEY);
      const now = new Date().getTime();

      if (cachedData) {
        const { data, timestamp } = JSON.parse(cachedData);
        if (now - timestamp < CACHE_EXPIRY) {
          setData(data);
          setLoading(false);
          return;
        }
      }

      const response = await axios.post<ApiResponse>(
        `${import.meta.env.VITE_API_BASE_URL}/active-activities`,
        {
          userid: Number(getABID),
          username: getUsername
        }
      );

      const processedData = {
        ...response.data,
        data: response.data.data.sort((a, b) => b.activities_count - a.activities_count)
      };

      setData(processedData);

      // Update cache
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        data: processedData,
        timestamp: now
      }));
    } catch (err) {
      // Try to use cached data if available
      const cachedData = localStorage.getItem(CACHE_KEY);
      if (cachedData) {
        const { data } = JSON.parse(cachedData);
        setData(data);
      } else {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      }
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    localStorage.removeItem(CACHE_KEY);
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  const sortedActivities = useMemo(
    () => [...data.data].sort((a, b) => b.activities_count - a.activities_count),
    [data.data]
  );
  const topActivities = sortedActivities.slice(0, 3);
  const topActivityIds = topActivities.map((item) => item.id);
  const totalUses = data.data.reduce((sum, item) => sum + item.activities_count, 0);
  const activeWorkflowCount = data.data.filter((item) => item.activities_count > 0).length;
  const averageUses = data.data.length ? Math.round(totalUses / data.data.length) : 0;
  const leaderCount = topActivities[0]?.activities_count ?? 0;
  const lastUpdated = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const rankStyles = [
    {
      label: '1st Place',
      accent: '#d97706',
      background: 'linear-gradient(135deg, #fff7ed 0%, #fffbeb 100%)',
      border: '#f59e0b',
    },
    {
      label: '2nd Place',
      accent: '#475569',
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      border: '#94a3b8',
    },
    {
      label: '3rd Place',
      accent: '#0f766e',
      background: 'linear-gradient(135deg, #ecfdf5 0%, #f0fdfa 100%)',
      border: '#14b8a6',
    },
  ];

  return (
    <div className="workflow-dashboard-page">
      <Card className="mb-5 rounded-md border border-gray-200 shadow-sm" styles={{ body: { padding: 20 } }}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <Tag color="blue" className="mb-3 rounded-full px-3 py-1">
              Workflow Operations
            </Tag>
            <Title level={2} className="!mb-1 !text-slate-900">
              {t.dashboardTitle}
            </Title>
            <Text className="text-sm text-gray-500">
              Track demand across active workflow services and identify high-volume requests.
            </Text>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              onClick={handleRefresh}
              icon={<ReloadOutlined />}
              loading={loading}
              className="border-gray-300"
            >
              Refresh
            </Button>
            <Button
              type="default"
              onClick={toggleLanguage}
              icon={<GlobalOutlined />}
            >
              {language === 'en' ? t.switchToFilipino : t.switchToEnglish}
            </Button>
          </div>
        </div>
      </Card>

      {error && (
        <Alert message={`Error: ${error}`} type="error" className="mb-4 rounded-md" />
      )}

      <Alert
        message={t.alertMessage}
        type="info"
        showIcon
        className="mb-5 rounded-md"
      />

      <Row gutter={[16, 16]} className="mb-5">
        <Col xs={24} sm={12} lg={6}>
          <Card className="h-full rounded-md border border-gray-200 shadow-sm">
            <Statistic
              title="Total Uses"
              value={totalUses}
              prefix={<BarChartOutlined className="text-blue-600" />}
              valueStyle={{ color: '#0f172a', fontWeight: 700 }}
            />
            <Text className="text-xs text-gray-500">All workflow requests recorded</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="h-full rounded-md border border-gray-200 shadow-sm">
            <Statistic
              title="Workflow Types"
              value={data.data.length}
              prefix={<AppstoreOutlined className="text-emerald-600" />}
              valueStyle={{ color: '#0f172a', fontWeight: 700 }}
            />
            <Text className="text-xs text-gray-500">{activeWorkflowCount} with activity</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="h-full rounded-md border border-gray-200 shadow-sm">
            <Statistic
              title="Average Uses"
              value={averageUses}
              valueStyle={{ color: '#0f172a', fontWeight: 700 }}
            />
            <Text className="text-xs text-gray-500">Average per workflow type</Text>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="h-full rounded-md border border-gray-200 shadow-sm">
            <Statistic
              title="Top Workflow Uses"
              value={leaderCount}
              prefix={<TrophyOutlined className="text-amber-600" />}
              valueStyle={{ color: '#0f172a', fontWeight: 700 }}
            />
            <Text className="text-xs text-gray-500">Current leading request type</Text>
          </Card>
        </Col>
      </Row>

      {loading ? (
        <Card className="rounded-md border border-gray-200 shadow-sm">
          <div className="flex h-64 items-center justify-center">
            <Spin
              size="large"
              tip="Loading user workflows..."
              indicator={<LoadingOutlined style={{ fontSize: 36 }} spin />}
            />
          </div>
        </Card>
      ) : (
        <>
          <div className="mb-5">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <Title level={4} className="!mb-0">
                  {t.mostRequested}
                </Title>
                <Text className="text-sm text-gray-500">Ranked by total usage as of {lastUpdated}</Text>
              </div>
            </div>
            <Row gutter={[16, 16]}>
              {topActivities.map((workflow, index) => {
                const style = rankStyles[index];

                return (
                  <Col key={workflow.id} xs={24} md={8}>
                    <Card
                      className="h-full rounded-md border shadow-sm transition-shadow hover:shadow-md"
                      styles={{
                        body: {
                          padding: 20,
                          background: style.background,
                          borderLeft: `4px solid ${style.border}`,
                        },
                      }}
                    >
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <Tag
                          className="rounded-full px-3 py-1 font-semibold"
                          style={{ color: style.accent, borderColor: style.border }}
                        >
                          {style.label}
                        </Tag>
                        <CrownFilled style={{ color: style.accent, fontSize: 18 }} />
                      </div>
                      <Title level={4} className="!mb-4 line-clamp-2 !text-slate-900">
                        {workflow.name}
                      </Title>
                      <div className="flex items-end justify-between gap-4">
                        <Text className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Usage
                        </Text>
                        <span className="text-2xl font-bold text-slate-900">
                          {workflow.activities_count.toLocaleString()}
                        </span>
                      </div>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          </div>

          <Card
            title={
              <div className="flex flex-col">
                <span className="text-base font-semibold text-slate-900">Workflow Request Volume</span>
                <span className="text-xs font-normal text-gray-500">All workflow services sorted by demand</span>
              </div>
            }
            className="rounded-md border border-gray-200 shadow-sm"
            styles={{ body: { padding: 16 } }}
          >
            <Row gutter={[12, 12]}>
              {sortedActivities.map((item) => {
                const rank = topActivityIds.indexOf(item.id) + 1;
                const isTopRank = rank > 0 && rank <= 3;
                const usagePercent = leaderCount > 0 ? Math.round((item.activities_count / leaderCount) * 100) : 0;

                return (
                  <Col key={item.id} xs={24} sm={12} lg={8} xl={6}>
                    <Card
                      className="h-full rounded-md border border-gray-200 transition-shadow hover:shadow-md"
                      styles={{ body: { padding: 14 } }}
                    >
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="mb-2 flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-emerald-500" />
                            {isTopRank && (
                              <Tag color={rank === 1 ? 'gold' : rank === 2 ? 'default' : 'cyan'} className="m-0 rounded-full">
                                Rank {rank}
                              </Tag>
                            )}
                          </div>
                          <h3 className="mb-0 line-clamp-2 text-sm font-semibold text-slate-900">
                            {item.name}
                          </h3>
                        </div>
                        <span className="shrink-0 rounded-md bg-blue-50 px-2 py-1 text-lg font-bold text-blue-700">
                          {item.activities_count.toLocaleString()}
                        </span>
                      </div>
                      <Progress
                        percent={usagePercent}
                        showInfo={false}
                        strokeColor={isTopRank ? '#2563eb' : '#94a3b8'}
                        trailColor="#eef2f7"
                        size="small"
                      />
                    </Card>
                  </Col>
                );
              })}
            </Row>
          </Card>
        </>
      )}
    </div>
  );
}
