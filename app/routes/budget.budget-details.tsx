import { ArrowLeftOutlined, HomeOutlined, LoadingOutlined } from "@ant-design/icons";
import { Link, useSearchParams } from "@remix-run/react";
import { Breadcrumb, Button, Card, Empty, Progress, Spin, Tag } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import Particulars from "~/components/particulars";
import { BudgetService } from "~/services/budget.service";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount || 0);

export default function BudgetDetails() {
  const [searchParams] = useSearchParams();
  const budgetId = searchParams.get("id");
  const [budget, setBudget] = useState<any>(null);
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

  if (loading) {
    return (
      <div className="flex min-h-[420px] items-center justify-center">
        <Spin
          indicator={<LoadingOutlined style={{ fontSize: 32 }} spin />}
          tip="Loading budget details..."
        />
      </div>
    );
  }

  if (error || !budget) {
    return (
      <Card className="rounded-xl border border-gray-200 shadow-sm">
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
    <div className="space-y-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
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
              title: budget.departments?.department || "Budget Details",
            },
          ]}
        />

        <Link to="/budget/budgets">
          <Button icon={<ArrowLeftOutlined />}>Back to Budgets</Button>
        </Link>
      </div>

      <Card className="rounded-xl border border-gray-200 shadow-sm" bodyStyle={{ padding: 24 }}>
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600">
              <span className="text-base font-bold text-white">
                {budget.departments?.department?.charAt(0) || "B"}
              </span>
            </div>

            <div className="min-w-0">
              <h1 className="m-0 text-xl font-semibold text-gray-900">
                {budget.departments?.department || "Unknown Department"}
              </h1>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-gray-500">
                <span>
                  Budget Period: {dayjs(budget.start_date).format("MMM D")} -{" "}
                  {dayjs(budget.end_date).format("MMM D, YYYY")}
                </span>
                <span className="h-1 w-1 rounded-full bg-gray-300" />
                <span>
                  Status: <Tag color="green">Active</Tag>
                </span>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-[minmax(180px,220px)_minmax(180px,220px)] md:items-center">
            <div className="md:text-right">
              <div className="text-2xl font-bold text-blue-800">
                {formatCurrency(Number(budget.budget))}
              </div>
              <div className="text-xs text-gray-500">Allocated Budget</div>
            </div>

            <Progress percent={0} size="small" strokeColor="#10b981" />
          </div>
        </div>
      </Card>

      <Card className="rounded-xl border border-gray-200 shadow-sm" bodyStyle={{ padding: 24 }}>
        <Particulars item={budget} />
      </Card>
    </div>
  );
}
