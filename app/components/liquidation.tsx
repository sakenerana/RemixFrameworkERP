import { Button, Col, Row, Statistic, Card, Space } from "antd";
import { useEffect } from "react";

export default function Liquidation({
  item,
  liquidationTotal,
  requisitionTotal,
  liquidationCount,
}: {
  item: any;
  requisitionTotal?: any;
  liquidationTotal?: any;
  liquidationCount?: any;
}) {
  useEffect(() => {
    console.log("Liquidation item:", item);
  }, [item]);

  // Calculate Remaining Balance
  const totalBudget = item?.budget || 0;
  const totalSpent = Number(requisitionTotal) + Number(liquidationTotal) || 0;
  const remainingBalance = totalBudget - totalSpent;

  // Gradient backgrounds for statistics cards
  const statGradients = {
    totalBudget: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',        // Purple gradient
    totalSpent: 'linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%)',        // Orange gradient
    remainingBalance: 'linear-gradient(135deg, #0ba360 0%, #3cba92 100%)',  // Green gradient
  };

  // Alternative gradient options:
  // Option 2 (Blue theme):
  // const statGradients = {
  //   totalBudget: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',     // Navy blue
  //   totalSpent: 'linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)',     // Red gradient
  //   remainingBalance: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', // Teal green
  // };

  // Option 3 (Elegant theme):
  // const statGradients = {
  //   totalBudget: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',     // Purple/blue
  //   totalSpent: 'linear-gradient(135deg, #ee0979 0%, #ff6a00 100%)',     // Pink/orange
  //   remainingBalance: 'linear-gradient(135deg, #00b09b 0%, #96c93d 100%)', // Green gradient
  // };

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
                title="Overall Total Requisition (Yearly)"
                value={requisitionTotal}
                precision={2}
                valueStyle={{ color: "#1890ff", fontWeight: 600, fontSize: 24 }}
                prefix=""
              />
            </Space>
            <Space size="middle" align="center">
              <Statistic
                title="Overall Total Liquidation (Yearly)"
                value={liquidationTotal}
                precision={2}
                valueStyle={{ color: "#1890ff", fontWeight: 600, fontSize: 24 }}
                prefix=""
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
          <Card
            hoverable
            style={{
              borderRadius: 12,
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              border: 'none',
              overflow: 'hidden'
            }}
            bodyStyle={{
              padding: '24px',
              background: statGradients.totalBudget,
              color: 'white',
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Statistic
              title={<span style={{ color: 'white' }}>Total Budget</span>}
              value={totalBudget}
              precision={2}
              valueStyle={{ color: 'white', fontWeight: 600, fontSize: 24 }}
              prefix={<span style={{ color: 'rgba(255, 255, 255, 0.9)' }}>₱</span>}
            />
            <div style={{ marginTop: '12px', fontSize: '12px', color: 'rgba(255, 255, 255, 0.8)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.9)' }} />
                Allocated budget amount
              </div>
            </div>
          </Card>
        </Col>

        {/* Total Spent */}
        <Col xs={24} sm={8}>
          <Card
            hoverable
            style={{
              borderRadius: 12,
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              border: 'none',
              overflow: 'hidden'
            }}
            bodyStyle={{
              padding: '24px',
              background: statGradients.totalSpent,
              color: 'white',
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Statistic
              title={<span style={{ color: 'white' }}>Total Amount Spent</span>}
              value={totalSpent}
              precision={2}
              valueStyle={{ color: 'white', fontWeight: 600, fontSize: 24 }}
              prefix={<span style={{ color: 'rgba(255, 255, 255, 0.9)' }}>₱</span>}
            />
            <div style={{ marginTop: '12px', fontSize: '12px', color: 'rgba(255, 255, 255, 0.8)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.9)' }} />
                Actual expenditure
              </div>
              
            </div>
          </Card>
        </Col>

        {/* Remaining Balance */}
        <Col xs={24} sm={8}>
          <Card
            hoverable
            style={{
              borderRadius: 12,
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              border: 'none',
              overflow: 'hidden'
            }}
            bodyStyle={{
              padding: '24px',
              background: statGradients.remainingBalance,
              color: 'white',
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Statistic
              title={<span style={{ color: 'white' }}>Remaining Balance</span>}
              value={remainingBalance}
              precision={2}
              valueStyle={{ color: 'white', fontWeight: 600, fontSize: 24 }}
              prefix={<span style={{ color: 'rgba(255, 255, 255, 0.9)' }}>₱</span>}
            />
            <div style={{ marginTop: '12px', fontSize: '12px', color: 'rgba(255, 255, 255, 0.8)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.9)' }} />
                Available for spending
              </div>
              {/* {totalBudget > 0 && (
                <div style={{ marginTop: '6px', fontSize: '11px', color: 'rgba(255, 255, 255, 0.9)' }}>
                  {Math.round((remainingBalance / totalBudget) * 100)}% of budget remaining
                </div>
              )} */}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}