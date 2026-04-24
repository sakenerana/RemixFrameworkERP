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
  history: { month: string; fullMonth?: string; value: number }[];
  isLoading?: boolean;
  isError?: boolean;
}

interface NewMembershipApiResponse {
  error: boolean;
  message: string;
  workflow_name: string;
  year: number;
  total_count: number;
  monthly_counts: Record<string, number>;
}

interface PersonnelMonthlyTotalsEntry {
  user_id: number;
  name: string;
  monthly_totals: Record<string, number>;
  year_total: number;
}

interface PersonnelMonthlyTotalsResponse {
  error: boolean;
  message: string;
  year: number;
  data: PersonnelMonthlyTotalsEntry[];
}

interface BillingMonthEntry {
  month: number;
  billed: number;
  paid: number;
}

interface BillingByDateApiResponse {
  error: boolean;
  data: {
    year: number;
    total_billed: number;
    total_paid: number;
    months: BillingMonthEntry[];
  };
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

const MONTH_ABBR_TO_FULL: Record<string, string> = {
  Jan: "January",
  Feb: "February",
  Mar: "March",
  Apr: "April",
  May: "May",
  Jun: "June",
  Jul: "July",
  Aug: "August",
  Sep: "September",
  Oct: "October",
  Nov: "November",
  Dec: "December",
};

const mapPersonnelMonthlyTotalsToMonthlyCounts = (
  monthlyTotals: Record<string, number> = {}
) => {
  return Object.entries(monthlyTotals).reduce<Record<string, number>>(
    (acc, [month, value]) => {
      const mappedMonth = MONTH_ABBR_TO_FULL[month] ?? month;
      acc[mappedMonth] = Number(value ?? 0);
      return acc;
    },
    {}
  );
};

const MONTH_NAMES = [
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

const mapBillingMonthsToMonthlyCounts = (months: BillingMonthEntry[] = []) => {
  const paidByMonth = new Map<number, number>(
    months.map((item) => [Number(item.month), Number(item.paid ?? 0)])
  );

  return MONTH_NAMES.reduce<Record<string, number>>((acc, monthName, index) => {
    acc[monthName] = paidByMonth.get(index + 1) ?? 0;
    return acc;
  }, {});
};

const formatPeso = (value: number) =>
  new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value ?? 0);

export default function PerformanceReportLayoutIndex() {
  const currentYear = dayjs().year();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [kpiApiData, setKpiApiData] = useState<
    Record<
      string,
      {
        totalCount: number;
        monthlyCounts: Record<string, number>;
        isLoading: boolean;
        isError: boolean;
      }
    >
  >(
    KPI_DEFINITIONS.reduce<
      Record<
        string,
        {
          totalCount: number;
          monthlyCounts: Record<string, number>;
          isLoading: boolean;
          isError: boolean;
        }
      >
    >((acc, kpi) => {
      acc[kpi.label] = {
        totalCount: 0,
        monthlyCounts: {},
        isLoading: true,
        isError: false,
      };
      return acc;
    }, {})
  );

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
          kpi.label === "LOAN RELEASE" ||
          kpi.label === "NEW MEMBERSHIP" ||
          kpi.label === "COLLECTION" ||
          kpi.label === "PERSONNEL TASK COMPLETION"
            ? `${kpi.link}?year=${selectedYear}`
            : kpi.link;

        return {
          label: kpi.label,
          link,
          value: apiData?.isLoading
            ? "..."
            : kpi.label === "COLLECTION"
              ? formatPeso(Math.abs(apiData?.totalCount ?? 0))
              : (apiData?.totalCount ?? 0).toLocaleString(),
          trend: 0,
          history: monthOrder.map((month) => ({
            month: monthLabelMap[month],
            fullMonth: month,
            value:
              kpi.label === "COLLECTION"
                ? Math.abs(apiData?.monthlyCounts[month] ?? 0)
                : (apiData?.monthlyCounts[month] ?? 0),
          })),
          comparison: apiData?.isError ? "unable to sync data" : `per year - ${selectedYear}`,
          isLoading: apiData?.isLoading ?? false,
          isError: apiData?.isError ?? false,
        };
      });
    },
    [kpiApiData, selectedYear]
  );

  useEffect(() => {
    let ignore = false;
    const controller = new AbortController();

    const fetchKpiCounts = async () => {
      const userId = Number(localStorage.getItem("ab_id"));
      const username = localStorage.getItem("username") || "";
      const baseLoadingState = KPI_DEFINITIONS.reduce<
        Record<
          string,
          {
            totalCount: number;
            monthlyCounts: Record<string, number>;
            isLoading: boolean;
            isError: boolean;
          }
        >
      >((acc, kpi) => {
        acc[kpi.label] = {
          totalCount: 0,
          monthlyCounts: {},
          isLoading: true,
          isError: false,
        };
        return acc;
      }, {});

      if (!ignore) {
        setKpiApiData(baseLoadingState);
      }

      KPI_DEFINITIONS.forEach(async (kpi) => {
        try {
            if (kpi.label === "PERSONNEL TASK COMPLETION") {
              const response = await axios.get<PersonnelMonthlyTotalsResponse>(
                `${import.meta.env.VITE_IACCS_API_BASE_URL}/api/external/activitybuilder/monthly-completed-totals/${selectedYear}`,
                {
                  params: { userid: userId, username },
                  signal: controller.signal,
                }
              );

              const personnelRows = response.data?.data ?? [];
              const matchedPersonnel = personnelRows.find(
                (row) => Number(row.user_id) === Number(userId)
              );

              if (!ignore) {
                setKpiApiData((prev) => ({
                  ...prev,
                  [kpi.label]: {
                    totalCount: Number(matchedPersonnel?.year_total ?? 0),
                    monthlyCounts: mapPersonnelMonthlyTotalsToMonthlyCounts(
                      matchedPersonnel?.monthly_totals
                    ),
                    isLoading: false,
                    isError: false,
                  },
                }));
              }

              return;
            }

            if (kpi.label === "COLLECTION") {
              const response = await axios.get<BillingByDateApiResponse>(
                `${import.meta.env.VITE_IACCS_API_BASE_URL}/api/external/iaccs-monitoring/billing/date`,
                {
                  params: {
                    year: selectedYear,
                    month: 0,
                  },
                  signal: controller.signal,
                },
              );

              if (!ignore) {
                setKpiApiData((prev) => ({
                  ...prev,
                  [kpi.label]: {
                    totalCount: Number(response.data?.data?.total_paid ?? 0),
                    monthlyCounts: mapBillingMonthsToMonthlyCounts(response.data?.data?.months),
                    isLoading: false,
                    isError: false,
                  },
                }));
              }

              return;
            }

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

            if (!ignore) {
              setKpiApiData((prev) => ({
                ...prev,
                [kpi.label]: {
                  totalCount: endpointResponses.reduce(
                    (sum, response) => sum + Number(response?.total_count ?? 0),
                    0
                  ),
                  monthlyCounts: mergeMonthlyCounts(endpointResponses),
                  isLoading: false,
                  isError: false,
                },
              }));
            }
        } catch {
          if (!ignore) {
            setKpiApiData((prev) => ({
              ...prev,
              [kpi.label]: {
                totalCount: 0,
                monthlyCounts: {},
                isLoading: false,
                isError: true,
              },
            }));
          }
        }
      });
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
