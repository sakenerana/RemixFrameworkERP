import { Button, Col, Row, Statistic, Card, Space } from "antd";
import { useEffect } from "react";

export default function Liquidation({
  item,
  liquidationTotal,
  liquidationCount,
}: {
  item: any;
  liquidationTotal?: any;
  liquidationCount?: any;
}) {
  useEffect(() => {
    console.log("Liquidation item:", item);
  }, [item]);

  // Calculate Remaining Balance
  const totalBudget = item?.budget || 0;
  const totalSpent = item?.totalSpent || 0;
  const remainingBalance = totalBudget - totalSpent;

  return (
    <div className="space-y-6">
      {/* Liquidation Statistics */}
      <Card hoverable style={{ borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
        <Row gutter={[32, 16]} align="middle">
          {/* Completed Liquidation */}
          <Col xs={24} sm={12}>
            <Statistic
              title="Completed Liquidation"
              value={liquidationCount}
              valueStyle={{ color: "#3f8600", fontWeight: 600, fontSize: 24 }}
            />
          </Col>

          {/* Overall Total Liquidation + Inline Button */}
          <Col xs={24} sm={12}>
            <Space size="middle" align="center">
              <Statistic
                title="Overall Total Liquidation (Yearly)"
                value={liquidationTotal}
                precision={2}
                valueStyle={{ color: "#1890ff", fontWeight: 600, fontSize: 24 }}
                prefix="₱"
              />
              <Button
                type="primary"
                style={{
                  borderRadius: 12,
                  fontWeight: 600,
                  height: 40,
                  padding: "0 24px",
                  backgroundColor: "#1890ff",
                  borderColor: "#1890ff",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                  transition: "all 0.2s ease-in-out",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
              >
                View Liquidation
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Dashboard Cards */}
      <Row gutter={[24, 24]}>
        {/* Total Budget */}
        <Col xs={24} sm={8}>
          <Card hoverable style={{ borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
            <Statistic
              title="Total Budget"
              value={totalBudget}
              precision={2}
              valueStyle={{ color: "#1890ff", fontWeight: 600, fontSize: 24 }}
              prefix="₱"
            />
          </Card>
        </Col>

        {/* Total Spent */}
        <Col xs={24} sm={8}>
          <Card hoverable style={{ borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
            <Statistic
              title="Total Amount Spent"
              value={totalSpent}
              precision={2}
              valueStyle={{ color: "#cf1322", fontWeight: 600, fontSize: 24 }}
              prefix="₱"
            />
          </Card>
        </Col>

        {/* Remaining Balance */}
        <Col xs={24} sm={8}>
          <Card hoverable style={{ borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
            <Statistic
              title="Remaining Balance"
              value={remainingBalance}
              precision={2}
              valueStyle={{ color: "#3f8600", fontWeight: 600, fontSize: 24 }}
              prefix="₱"
            />
          </Card>
        </Col>
      </Row>

    </div>
  );
}
