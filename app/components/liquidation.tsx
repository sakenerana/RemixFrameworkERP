import { Button, Col, Row, Statistic } from "antd";
import { useEffect } from "react";

export default function Liquidation({ item, liquidationTotal }: { item: any, liquidationTotal?: any }) {

  useEffect(() => {
    // You can add any side effects or data fetching logic here if needed
    console.log("Liquidation item:", liquidationTotal);
  }, [item]);

  const fetchLiquidationDataByDepartment = async () => {
    // Placeholder for data fetching logic
    // const response = await fetch('/api/liquidation');
    // const data = await response.json();
    // Process the data as needed
  }

  return (
    <div>
      <Row gutter={16}>
        <Col span={12}>
          <Statistic title="Completed Liquidation" value={112893} />
        </Col>
        <Col span={12}>
          <Statistic title="Overall Total Liquidation (Yearly)" value={liquidationTotal} precision={2} />
          <Button style={{ marginTop: 16 }} type="primary">
            View Liquidation
          </Button>
        </Col>
      </Row>
    </div>
  );
}