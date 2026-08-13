import { useNavigate, useParams } from "@remix-run/react";
import { Spin } from "antd";
import { useEffect } from "react";

export default function BudgetDetailsRedirect() {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id || Number.isNaN(Number(id))) {
      navigate("/budget/budgets", { replace: true });
      return;
    }

    navigate(`/budget/budget-details?id=${id}`, { replace: true });
  }, [id, navigate]);

  return (
    <div className="flex min-h-[420px] items-center justify-center">
      <Spin tip="Opening budget details..." />
    </div>
  );
}
