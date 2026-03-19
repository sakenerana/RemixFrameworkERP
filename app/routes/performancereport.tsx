import { useEffect, useMemo, useState } from "react";
import { Avatar, Button, ConfigProvider, DatePicker, Layout, Typography } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { Link } from "@remix-run/react";
import { ArrowLeftFromLine, Home, RotateCcw } from "lucide-react";

import KPICard from "~/components/KPICard";
import DailyDetailsChart from "~/components/DailyDetailsChart";
import PerformanceCharts from "~/components/PerformanceCharts";
import { ProtectedRoute } from "~/components/ProtectedRoute";
import axios from "axios";

const { Header, Content } = Layout;
const { Title, Text } = Typography;

export interface KPIData {
  label: string;
  link: string;
  value: string;
  trend: number;
  comparison: string;
  history: { month: string; value: number }[];
}

interface NewMembershipApiResponse {
  error: boolean;
  message: string;
  workflow_name: string;
  year: number;
  total_count: number;
  monthly_counts: Record<string, number>;
}

interface KpiDefinition {
  label: string;
  link: string;
  endpoints: string[];
}

const KPI_DEFINITIONS: KpiDefinition[] = [
  {
    label: "NEW MEMBERSHIP",
    link: "/newmembership",
    endpoints: ["newmembers/count"],
  },
  {
    label: "LOAN RELEASE",
    link: "/loanrelease",
    endpoints: ["loanprocessingv2/count"],
  },
  {
    label: "COLLECTION",
    link: "/collections",
    endpoints: [
      "branchremittancecollection/count",
      "remittancecollections/count",
    ],
  },
  {
    label: "PERSONNEL TASK COMPLETION",
    link: "/personnel",
    endpoints: ["personnel/count"],
  },
];

const mergeMonthlyCounts = (responses: NewMembershipApiResponse[]) => {
  return responses.reduce<Record<string, number>>((acc, response) => {
    Object.entries(response?.monthly_counts ?? {}).forEach(([month, value]) => {
      acc[month] = (acc[month] ?? 0) + Number(value ?? 0);
    });

    return acc;
  }, {});
};

export default function PerformanceReportLayoutIndex() {
  const currentYear = dayjs().year();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [kpiApiData, setKpiApiData] = useState<
    Record<
      string,
      {
        totalCount: number;
        monthlyCounts: Record<string, number>;
      } | null
    >
  >({});
  const [isKpiLoading, setIsKpiLoading] = useState(false);

  const selectedYearValue = useMemo(() => dayjs().year(selectedYear), [selectedYear]);
  const kpiData = useMemo(
    () => {
      const monthOrder = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      const monthLabelMap: Record<string, string> = {
        January: "Jan",
        February: "Feb",
        March: "Mar",
        April: "Apr",
        May: "May",
        June: "Jun",
        July: "Jul",
        August: "Aug",
        September: "Sep",
        October: "Oct",
        November: "Nov",
        December: "Dec",
      };

      return KPI_DEFINITIONS.map((kpi) => {
        const apiData = kpiApiData[kpi.label];
        const link =
          kpi.label === "LOAN RELEASE" || kpi.label === "NEW MEMBERSHIP" || kpi.label === "COLLECTION"
            ? `${kpi.link}?year=${selectedYear}`
            : kpi.link;

        return {
          label: kpi.label,
          link,
          value: isKpiLoading
            ? "..."
            : (apiData?.totalCount ?? 0).toLocaleString(),
          trend: 0,
          history: monthOrder.map((month) => ({
            month: monthLabelMap[month],
            value: apiData?.monthlyCounts[month] ?? 0,
          })),
          comparison: `per year - ${selectedYear}`,
        };
      });
    },
    [isKpiLoading, kpiApiData, selectedYear]
  );

  useEffect(() => {
    let ignore = false;
    const controller = new AbortController();

    const fetchKpiCounts = async () => {
      setIsKpiLoading(true);
      const userId = Number(localStorage.getItem("ab_id"));
      const username = localStorage.getItem("username") || "";

      try {
        const responses = await Promise.allSettled(
          KPI_DEFINITIONS.map(async (kpi) => {
            const endpointResults = await Promise.allSettled(
              kpi.endpoints.map(async (endpoint) => {
                const response = await axios.get<NewMembershipApiResponse>(
                  `${import.meta.env.VITE_API_BASE_URL}/${endpoint}/${selectedYear}`,
                  {
                    params: { userid: userId, username },
                    signal: controller.signal,
                  }
                );

                return response.data;
              })
            );
            const endpointResponses = endpointResults
              .filter(
                (
                  result
                ): result is PromiseFulfilledResult<NewMembershipApiResponse> =>
                  result.status === "fulfilled"
              )
              .map((result) => result.value);

            return {
              label: kpi.label,
              payload: {
                total_count: endpointResponses.reduce(
                  (sum, response) => sum + Number(response?.total_count ?? 0),
                  0
                ),
                monthly_counts: mergeMonthlyCounts(endpointResponses),
              },
            };
          })
        );

        if (!ignore) {
          const nextData = KPI_DEFINITIONS.reduce<
            Record<string, { totalCount: number; monthlyCounts: Record<string, number> } | null>
          >((acc, kpi, index) => {
            const result = responses[index];

            if (result.status === "fulfilled") {
              acc[kpi.label] = {
                totalCount: Number(result.value.payload?.total_count ?? 0),
                monthlyCounts: result.value.payload?.monthly_counts ?? {},
              };
              return acc;
            }

            acc[kpi.label] = null;
            return acc;
          }, {});

          setKpiApiData(nextData);
        }
      } catch {
        if (!ignore) {
          setKpiApiData(
            KPI_DEFINITIONS.reduce<Record<string, null>>((acc, kpi) => {
              acc[kpi.label] = null;
              return acc;
            }, {})
          );
        }
      } finally {
        if (!ignore) {
          setIsKpiLoading(false);
        }
      }
    };

    fetchKpiCounts();
    return () => {
      ignore = true;
      controller.abort();
    };
  }, [selectedYear]);

  const handleYearChange = (date: Dayjs | null) => {
    if (!date) return;
    setSelectedYear(date.year());
  };

  const resetYear = () => {
    setSelectedYear(currentYear);
  };

  return (
    <ProtectedRoute>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#1677ff",
            borderRadius: 8,
          },
        }}
      >
        <Layout className="min-h-screen bg-slate-50">
          <Header className="bg-[#1890ff] px-0 flex items-center justify-between h-14 sticky top-0 z-50 shadow-md">
            <div className="flex items-center">
              <div className="flex items-center h-14">
                <Link to="/landing-page" className="h-full">
                  <button className="h-full px-6 flex items-center justify-center hover:bg-blue-600 transition-colors border-r border-blue-400 bg-blue-700">
                    <Home className="text-white w-5 h-5" />
                  </button>
                </Link>
                <Link to="/landing-page" className="h-full">
                  <button className="h-full px-6 flex items-center justify-center hover:bg-blue-600 transition-colors border-r border-blue-400">
                    <ArrowLeftFromLine className="text-white w-5 h-5" />
                  </button>
                </Link>
              </div>
            </div>

            <div className="flex items-center px-6 gap-4">
              <div className="hidden md:flex flex-col items-end text-white leading-tight">
                <span className="text-xs font-bold">CFI Management System</span>
                <span className="text-[10px] opacity-80">Online</span>
              </div>
              <Avatar src="/img/cfi-circle.png" />
            </div>
          </Header>

          <Content className="p-4 md:p-6">
            <div className="mb-4 rounded-sm border border-gray-300 bg-white px-4 py-3 shadow-sm">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-col gap-0.5 sm:flex-row sm:items-center sm:gap-3">
                    <Title level={4} style={{ margin: 0 }} className="!mb-0 !text-[24px]">
                      Performance Report
                    </Title>
                    <Text type="secondary" className="text-sm">
                      Track yearly KPIs and trends in one view.
                    </Text>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start md:self-auto">
                  <DatePicker
                    picker="year"
                    allowClear={false}
                    value={selectedYearValue}
                    onChange={handleYearChange}
                    className="min-w-[132px]"
                    size="middle"
                  />
                  <Button
                    icon={<RotateCcw className="h-4 w-4" />}
                    onClick={resetYear}
                    size="middle"
                  >
                    Current Year
                  </Button>
                </div>
              </div>
            </div>

            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {kpiData.map((kpi, idx) => (
                <Link key={kpi.label} to={kpi.link} className="block transition-transform duration-200 hover:-translate-y-0.5">
                  <KPICard data={kpi} index={idx} />
                </Link>
              ))}
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                <DailyDetailsChart selectedYear={selectedYear} />
              </div>
              <div className="lg:col-span-1 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                <PerformanceCharts selectedYear={selectedYear} />
              </div>
            </section>
          </Content>
        </Layout>
      </ConfigProvider>
    </ProtectedRoute>
  );
}
