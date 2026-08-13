import {
  CalendarOutlined,
  CheckCircleOutlined,
  FileSearchOutlined,
  LinkOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import { Button, Card, Empty, Modal, Progress, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { useMemo, useState } from "react";

interface LiquidationDataType {
  key?: string;
  startDate: string;
  referenceNo: string;
  particular: string;
  totalAmount: number;
  status: "Completed" | "Pending" | "Rejected" | string;
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(amount || 0);

export default function Liquidation({
  item,
  liquidationTotal,
  requisitionTotal,
  liquidationCount,
  liquidationData = [],
}: {
  item: any;
  requisitionTotal?: number;
  liquidationTotal?: number;
  liquidationCount?: number;
  liquidationData?: LiquidationDataType[];
}) {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const totalBudget = Number(item?.budget || 0);
  const totalSpent = Number(requisitionTotal || 0) + Number(liquidationTotal || 0);
  const remainingBalance = totalBudget - totalSpent;
  const utilizationRate = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

  const preparedData = useMemo(
    () =>
      liquidationData.map((row, index) => ({
        ...row,
        key: row.key || row.referenceNo || `row-${index}`,
      })),
    [liquidationData]
  );

  const liquidationColumns: ColumnsType<LiquidationDataType> = [
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      width: 160,
      render: (dateString: string) => {
        const date = dayjs(dateString);

        return date.isValid() ? (
          <div className="flex items-center gap-2">
            <CalendarOutlined className="text-slate-400" />
            <span>{date.format("MMM DD YYYY")}</span>
          </div>
        ) : (
          <span className="text-slate-400">No date</span>
        );
      },
    },
    {
      title: "Reference No",
      dataIndex: "referenceNo",
      key: "referenceNo",
      width: 180,
      render: (referenceNo: string) => {
        if (!referenceNo) return <span className="text-slate-400">No reference</span>;

        return (
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={`${import.meta.env.VITE_AB_LINK || "#"}/activities/${referenceNo}`}
            className="inline-flex items-center gap-1 font-mono text-sm text-blue-600 hover:underline"
            onClick={(event) => {
              if (!import.meta.env.VITE_AB_LINK) {
                event.preventDefault();
              }
            }}
          >
            <LinkOutlined />
            {referenceNo}
          </a>
        );
      },
    },
    {
      title: "Particular",
      dataIndex: "particular",
      key: "particular",
      width: 320,
      render: (particular: string) => (
        <span className="font-medium text-slate-900">{particular || "N/A"}</span>
      ),
    },
    {
      title: "Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
      width: 160,
      align: "right",
      sorter: (a, b) => Number(a.totalAmount || 0) - Number(b.totalAmount || 0),
      render: (totalAmount: number) => (
        <span className="font-semibold text-slate-900">{formatCurrency(totalAmount)}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 130,
      render: (status: string) => (
        <Tag color={status === "Completed" ? "green" : "default"} className="m-0">
          {status === "Completed" && <CheckCircleOutlined className="mr-1" />}
          {status || "N/A"}
        </Tag>
      ),
    },
  ];

  return (
    <div className="budget-liquidation space-y-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
        <Card className="rounded-lg border border-slate-200 shadow-sm" styles={{ body: { padding: 16 } }}>
          <div className="text-sm text-slate-500">Completed Liquidation</div>
          <div className="mt-2 text-2xl font-semibold text-green-700">{liquidationCount || 0}</div>
        </Card>

        <Card className="rounded-lg border border-slate-200 shadow-sm" styles={{ body: { padding: 16 } }}>
          <div className="text-sm text-slate-500">Requisition Total</div>
          <div className="mt-2 text-2xl font-semibold text-blue-700">{formatCurrency(Number(requisitionTotal || 0))}</div>
        </Card>

        <Card className="rounded-lg border border-slate-200 shadow-sm" styles={{ body: { padding: 16 } }}>
          <div className="text-sm text-slate-500">Liquidation Total</div>
          <div className="mt-2 text-2xl font-semibold text-blue-700">{formatCurrency(Number(liquidationTotal || 0))}</div>
        </Card>

        <Card className="rounded-lg border border-slate-200 shadow-sm" styles={{ body: { padding: 16 } }}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-sm text-slate-500">Remaining Balance</div>
              <div className={`mt-2 text-2xl font-semibold ${remainingBalance < 0 ? "text-red-600" : "text-emerald-700"}`}>
                {formatCurrency(remainingBalance)}
              </div>
            </div>
            <WalletOutlined className="text-xl text-slate-400" />
          </div>
        </Card>
      </div>

      <Card className="rounded-lg border border-slate-200 shadow-sm" styles={{ body: { padding: 16 } }}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="m-0 text-base font-semibold text-slate-950">Liquidation Summary</h3>
              <Tag className="m-0 rounded-full">{preparedData.length} records</Tag>
            </div>
            <p className="m-0 mt-1 text-sm text-slate-500">Liquidation activity matched to this department for the current year.</p>
            <div className="mt-3 max-w-xl">
              <div className="mb-1 flex justify-between text-xs text-slate-500">
                <span>Budget utilization</span>
                <span>{utilizationRate}%</span>
              </div>
              <Progress
                percent={Math.min(100, utilizationRate)}
                showInfo={false}
                strokeColor={utilizationRate > 100 ? "#dc2626" : "#2563eb"}
              />
            </div>
          </div>

          <Button
            type="primary"
            icon={<FileSearchOutlined />}
            onClick={() => setIsModalVisible(true)}
            disabled={!preparedData.length}
          >
            View Liquidation
          </Button>
        </div>
      </Card>

      <Modal
        title="Liquidation Details"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        width={1100}
        footer={[
          <Button key="close" onClick={() => setIsModalVisible(false)}>
            Close
          </Button>,
        ]}
        className="budget-liquidation-modal"
      >
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
          <div>
            <div className="text-sm font-semibold text-slate-900">Total Liquidation</div>
            <div className="text-xl font-semibold text-blue-700">{formatCurrency(Number(liquidationTotal || 0))}</div>
          </div>
          <Tag color="green" className="m-0 rounded-full px-3 py-1">
            {preparedData.length} completed records
          </Tag>
        </div>

        <Table
          className="budget-liquidation-table"
          columns={liquidationColumns}
          dataSource={preparedData}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="No liquidation records found"
              />
            ),
          }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          }}
          scroll={{ x: "max-content" }}
          rowKey="key"
        />
      </Modal>
    </div>
  );
}
