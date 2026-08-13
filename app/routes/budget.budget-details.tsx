import {
  ArrowLeftOutlined,
  BankOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  HomeOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { Link, useSearchParams } from "@remix-run/react";
import { Breadcrumb, Button, Card, Empty, Progress, Spin, Tag } from "antd";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import Particulars from "~/components/particulars";
import { AppPageHeader } from "~/components/ui/AppPageHeader";
import { SummaryMetricCard } from "~/components/ui/SummaryMetricCard";
import { BudgetService } from "~/services/budget.service";
import { Budget } from "~/types/budget.type";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount || 0);

const parseBudgetCodes = (budgetCodes: unknown) => {
  if (Array.isArray(budgetCodes)) return budgetCodes.length;

  if (typeof budgetCodes === "string") {
    return budgetCodes
      .replace(/[{}[\]"]/g, "")
      .split(",")
      .map((code) => code.trim())
      .filter(Boolean).length;
  }

  return 0;
};

export default function BudgetDetails() {
  const [searchParams] = useSearchParams();
  const budgetId = searchParams.get("id");
  const [budget, setBudget] = useState<Budget | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBudget = async () => {
      if (!budgetId || Number.isNaN(Number(budgetId))) {
        setError("Missing budget id");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await BudgetService.getPostDetailsById(Number(budgetId));
        setBudget(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load budget details");
      } finally {
        setLoading(false);
      }
    };

    fetchBudget();
  }, [budgetId]);

  const budgetMeta = useMemo(() => {
    if (!budget) {
      return {
        departmentName: "Budget Details",
        periodLabel: "No period",
        budgetCodeCount: 0,
      };
    }

    return {
      departmentName: budget.departments?.department || "Unknown Department",
      periodLabel: `${dayjs(budget.start_date).format("MMM D")} - ${dayjs(budget.end_date).format("MMM D, YYYY")}`,
      budgetCodeCount: parseBudgetCodes(budget.departments?.budget_code),
    };
  }, [budget]);

  if (loading) {
    return (
      <div className="budget-details-page flex min-h-[420px] items-center justify-center">
        <Spin
          indicator={<LoadingOutlined style={{ fontSize: 32 }} spin />}
          tip="Loading budget details..."
        />
      </div>
    );
  }

  if (error || !budget) {
    return (
      <Card className="budget-details-page rounded-lg border border-gray-200 shadow-sm">
        <Empty
          description={error || "Budget details not found"}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        >
          <Link to="/budget/budgets">
            <Button type="primary" icon={<ArrowLeftOutlined />}>
              Back to Budgets
            </Button>
          </Link>
        </Empty>
      </Card>
    );
  }

  return (
    <div className="budget-details-page space-y-4">
      <AppPageHeader
        eyebrow="Department Budget"
        title={budgetMeta.departmentName}
        subtitle="Review allocated budget particulars, requisition totals, and liquidation activity."
        breadcrumb={
          <Breadcrumb
            items={[
              {
                href: "/budget",
                title: <HomeOutlined />,
              },
              {
                href: "/budget/budgets",
                title: "Budgets",
              },
              {
                title: budgetMeta.departmentName,
              },
            ]}
          />
        }
        meta={
          <>
            <Tag color="green" className="m-0 rounded-full px-3 py-1">Active</Tag>
            <Tag className="m-0 rounded-full px-3 py-1">{budgetMeta.budgetCodeCount} particulars</Tag>
          </>
        }
        actions={
          <Link to="/budget/budgets">
            <Button icon={<ArrowLeftOutlined />}>Back to Budgets</Button>
          </Link>
        }
      />

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <SummaryMetricCard
          title="Allocated Budget"
          value={formatCurrency(Number(budget.budget))}
          icon={<BankOutlined className="text-blue-600" />}
          description="Approved department allocation"
        />
        <SummaryMetricCard
          title="Budget Period"
          value={budgetMeta.periodLabel}
          icon={<CalendarOutlined className="text-emerald-600" />}
          description="Current active coverage"
        />
        <SummaryMetricCard
          title="Budget Status"
          value="Active"
          icon={<CheckCircleOutlined className="text-green-600" />}
          description={`${budgetMeta.budgetCodeCount} mapped particulars`}
          valueColor="#15803d"
        />
      </div>

      <Card className="rounded-lg border border-gray-200 shadow-sm" styles={{ body: { padding: 16 } }}>
        <div className="mb-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="m-0 text-base font-semibold text-slate-950">Allocation Usage</h2>
              <p className="m-0 mt-1 text-sm text-slate-500">Current spend is summarized below by particular.</p>
            </div>
            <div className="min-w-[220px]">
              <div className="mb-1 flex justify-between text-xs text-slate-500">
                <span>Utilization</span>
                <span>0%</span>
              </div>
              <Progress percent={0} showInfo={false} size="small" strokeColor="#2563eb" />
            </div>
          </div>
        </div>

        <Particulars item={budget} />
      </Card>
    </div>
  );
}
