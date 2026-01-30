import { CalendarOutlined, CheckCircleOutlined, LinkOutlined } from "@ant-design/icons";
import { Button, Col, Row, Statistic, Card, Space, Modal, Table, Tag } from "antd";
import { useEffect, useState } from "react";
import dayjs from 'dayjs';
import type { ColumnsType } from 'antd/es/table';

// Define the type for your liquidation data
interface LiquidationDataType {
  key?: string; // Important: Add key for each record
  startDate: string;
  referenceNo: string;
  particular: string;
  totalAmount: number;
  status: 'Completed' | 'Pending' | 'Rejected' | string;
  // Add other fields that might be in your data
}

export default function Liquidation({
  item,
  liquidationTotal,
  requisitionTotal,
  liquidationCount,
  liquidationData = [] // Provide default empty array
}: {
  item: any;
  requisitionTotal?: any;
  liquidationTotal?: any;
  liquidationCount?: any;
  liquidationData?: LiquidationDataType[];
}) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("Liquidation data received:", liquidationData);
  }, [liquidationData]);

  // Calculate Remaining Balance
  const totalBudget = item?.budget || 0;
  const totalSpent = Number(requisitionTotal) + Number(liquidationTotal) || 0;
  const remainingBalance = totalBudget - totalSpent;

  // Gradient backgrounds for statistics cards
  const statGradients = {
    totalBudget: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    totalSpent: 'linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%)',
    remainingBalance: 'linear-gradient(135deg, #0ba360 0%, #3cba92 100%)',
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "PHP",
    }).format(amount);
  };

  // Prepare data with unique keys
  const preparedData = liquidationData.map((item, index) => ({
    ...item,
    key: item.key || item.referenceNo || `row-${index}`, // Ensure each row has a unique key
  }));

  // Columns for the liquidation table with proper typing
  const liquidationColumns: ColumnsType<LiquidationDataType> = [
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      width: 150,
      render: (dateString: string) => {
        if (!dateString) return <span className="text-gray-400">No date</span>;

        const date = dayjs(dateString);
        if (!date.isValid()) return <span className="text-gray-400">Invalid date</span>;

        return (
          <div className="flex items-center">
            <CalendarOutlined className="mr-2 text-gray-400" />
            <div className="flex flex-col">
              <span className="text-sm">
                {date.format('MMM DD YYYY')}
              </span>
            </div>
          </div>
        );
      }
    },
    {
      title: "Reference No",
      dataIndex: "referenceNo",
      key: "referenceNo",
      width: 180,
      fixed: 'left' as const,
      render: (referenceNo: string) => {
        if (!referenceNo) return <span className="text-gray-400">No reference</span>;

        return (
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={`${import.meta.env.VITE_AB_LINK || '#'}/activities/${referenceNo}`}
            className="font-mono text-sm flex items-center hover:text-blue-500 hover:underline"
            onClick={(e) => {
              if (!import.meta.env.VITE_AB_LINK) {
                e.preventDefault();
                console.warn('VITE_AB_LINK is not set');
              }
            }}
          >
            <LinkOutlined className="mr-1" />
            {referenceNo}
          </a>
        );
      },
    },
    {
      title: "Particular",
      dataIndex: "particular",
      key: "particular",
      width: 300,
      fixed: 'left' as const,
      render: (particular: string) => (
        <div className="font-mono text-sm">
          {particular || <span className="text-gray-400">No particular</span>}
        </div>
      ),
    },
    {
      title: "Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
      width: 150,
      align: 'right' as const,
      sorter: (a: LiquidationDataType, b: LiquidationDataType) =>
        (a.totalAmount || 0) - (b.totalAmount || 0),
      render: (totalAmount: number) => (
        <div className="text-right font-medium">
          {formatCurrency(totalAmount || 0)}
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      width: 120,
      render: (_, record) => {
        if (record.status === 'Completed') {
          return (
            <Tag color="green">
              <CheckCircleOutlined className="float-left mt-1 mr-1" /> Completed
            </Tag>
          );
        }
      },
    },
  ];

  const showModal = () => {
    setIsModalVisible(true);
    console.log("Liquidation item:", preparedData);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

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
                onClick={showModal}
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
            </div>
          </Card>
        </Col>
      </Row>

      {/* Liquidation Details Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '18px', fontWeight: 600 }}>Liquidation Details</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginRight: '30px' }}>
              <Statistic
                title="Total Liquidation"
                value={liquidationTotal}
                precision={2}
                valueStyle={{ color: '#1890ff', fontSize: '16px' }}
                prefix="₱"
              />
            </div>
          </div>
        }
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={1200}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Close
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            OK
          </Button>,
        ]}
        bodyStyle={{ padding: '0' }}
      >
        <div style={{ marginTop: '16px' }}>
          <Table
            columns={liquidationColumns}
            dataSource={preparedData}
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
            }}
            scroll={{ x: 'max-content' }}
            rowKey="key" // Specify which field to use as row key
          />
        </div>
      </Modal>
    </div>
  );
}