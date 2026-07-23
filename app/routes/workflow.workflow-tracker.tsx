import {
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  FileSearchOutlined,
  HomeOutlined,
  LinkOutlined,
  LoadingOutlined,
  ReloadOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Breadcrumb,
  Button,
  Card,
  Checkbox,
  Col,
  Dropdown,
  Input,
  MenuProps,
  Modal,
  Popconfirm,
  Progress,
  Row,
  Space,
  Spin,
  Statistic,
  Table,
  TableColumnsType,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import axios from "axios";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import PrintDropdownComponent from "~/components/print_dropdown";

const { Text, Title } = Typography;

interface WorkflowInfo {
  id: number;
  name: string;
}

interface DataType {
  id: number;
  requested_by: string;
  refno: string;
  created_at: string;
  due_date: string;
  status: number;
  workflow_id: number;
  step_id: number;
  workflow: WorkflowInfo | string;
  sequences?: string[];
  current_sequence?: string;
  userId?: number;
}

const CACHE_EXPIRY = 15 * 60 * 1000;

const getWorkflowName = (workflow?: WorkflowInfo | string) => {
  if (!workflow) return "No workflow";
  return typeof workflow === "string" ? workflow : workflow.name;
};

export default function WorkflowTracker() {
  const [data, setData] = useState<DataType[]>([]);
  const [dataModal, setDataModal] = useState<DataType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({
    "Process Title": true,
    "Reference No": true,
    "Created At": true,
    "Due Date": true,
    Workflow: true,
    Actions: true,
  });

  const fetchData = async ({ forceRefresh = false } = {}) => {
    const getABID = localStorage.getItem("ab_id");
    const getUsername = localStorage.getItem("username");
    const cacheKey = `userActiveActivities_${getABID}`;

    try {
      setLoading(true);
      setError(null);

      if (forceRefresh) {
        localStorage.removeItem(cacheKey);
      }

      const cachedData = localStorage.getItem(cacheKey);
      const now = Date.now();

      if (cachedData) {
        const parsedCache = JSON.parse(cachedData);
        if (now - parsedCache.timestamp < CACHE_EXPIRY) {
          setData(parsedCache.data);
          return;
        }
      }

      const response = await axios.post<any>(
        `${import.meta.env.VITE_API_BASE_URL}/user-active-activities`,
        {
          userid: Number(getABID),
          username: getUsername,
          tracked_user_id: Number(getABID),
        }
      );

      const responseData = response.data.data || [];
      setData(responseData);
      localStorage.setItem(cacheKey, JSON.stringify({ data: responseData, timestamp: now }));
    } catch (err) {
      const cachedData = localStorage.getItem(cacheKey);

      if (cachedData) {
        const parsedCache = JSON.parse(cachedData);
        setData(parsedCache.data);
        return;
      }

      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const displayedData = useMemo(() => {
    const searchValue = searchText.trim().toLowerCase();

    if (!searchValue) {
      return data;
    }

    return data.filter((item) =>
      [
        item.requested_by,
        item.refno,
        getWorkflowName(item.workflow),
        dayjs(item.created_at).format("MMM DD YYYY"),
        dayjs(item.due_date).format("MMM DD YYYY"),
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(searchValue))
    );
  }, [data, searchText]);

  const trackerStats = useMemo(() => {
    const today = dayjs();
    const workflowTypes = new Set(data.map((item) => getWorkflowName(item.workflow)).filter(Boolean));
    const dueSoon = data.filter((item) => {
      const dueDate = dayjs(item.due_date);
      const daysRemaining = dueDate.diff(today, "day");
      return dueDate.isValid() && daysRemaining >= 0 && daysRemaining <= 7;
    }).length;
    const overdue = data.filter((item) => {
      const dueDate = dayjs(item.due_date);
      return dueDate.isValid() && dueDate.isBefore(today, "day");
    }).length;

    return {
      total: data.length,
      workflowTypes: workflowTypes.size,
      dueSoon,
      overdue,
    };
  }, [data]);

  const handleTrack = (value: DataType) => {
    setDataModal(value);
    setIsModalOpen(true);
  };

  const toggleColumn = (columnTitle: string) => {
    setColumnVisibility((prev) => ({
      ...prev,
      [columnTitle]: !prev[columnTitle],
    }));
  };

  const columnMenuItems: MenuProps["items"] = Object.keys(columnVisibility).map((columnTitle) => ({
    key: columnTitle,
    label: (
      <Checkbox checked={columnVisibility[columnTitle]} onClick={() => toggleColumn(columnTitle)}>
        {columnTitle}
      </Checkbox>
    ),
  }));

  const columns: TableColumnsType<DataType> = [
    {
      title: "Process Title",
      dataIndex: "requested_by",
      key: "process_title",
      width: 280,
      render: (text) => (
        <Tooltip title={text} placement="topLeft">
          <Text strong className="block leading-5 text-slate-900">
            <span className="line-clamp-3">{text}</span>
          </Text>
        </Tooltip>
      ),
      sorter: (a, b) => a.requested_by.localeCompare(b.requested_by),
    },
    {
      title: "Reference No",
      dataIndex: "refno",
      key: "refno",
      width: 160,
      render: (_, value) => (
        <a
          target="_blank"
          rel="noreferrer"
          href={`${import.meta.env.VITE_AB_LINK}/activities/${value.refno}`}
          className="inline-flex items-center gap-2 font-mono text-sm text-slate-700 hover:text-blue-600 hover:underline"
        >
          <LinkOutlined />
          {value.refno}
        </a>
      ),
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      width: 150,
      render: (dateString) => (
        <div className="flex items-center gap-2">
          <CalendarOutlined className="text-slate-400" />
          <div className="flex flex-col">
            <span className="text-sm text-slate-900">{dayjs(dateString).format("MMM DD YYYY")}</span>
            <span className="text-xs text-slate-500">{dayjs(dateString).format("h:mm A")}</span>
          </div>
        </div>
      ),
    },
    {
      title: "Due Date",
      dataIndex: "due_date",
      width: 150,
      render: (dateString) => {
        const dueDate = dayjs(dateString);
        const isOverdue = dueDate.isValid() && dueDate.isBefore(dayjs(), "day");

        return (
          <div className="flex items-center gap-2">
            <CalendarOutlined className={isOverdue ? "text-red-500" : "text-slate-400"} />
            <div className="flex flex-col">
              <span className={isOverdue ? "text-sm font-semibold text-red-600" : "text-sm text-slate-900"}>
                {dueDate.format("MMM DD YYYY")}
              </span>
              <span className="text-xs text-slate-500">{dueDate.format("h:mm A")}</span>
            </div>
          </div>
        );
      },
    },
    {
      title: "Workflow",
      dataIndex: "workflow",
      key: "workflow",
      width: 160,
      render: (workflow) => <Tag color="green">{getWorkflowName(workflow)}</Tag>,
    },
    {
      title: "Actions",
      dataIndex: "actions",
      width: 170,
      fixed: "right",
      render: (_, value) => (
        <Popconfirm
          title="Track workflow"
          description="Open this workflow timeline?"
          okText="Open"
          cancelText="Cancel"
          onConfirm={() => handleTrack(value)}
        >
          <Button type="primary" size="small" icon={<FileSearchOutlined />} className="font-semibold">
            Track Workflow
          </Button>
        </Popconfirm>
      ),
    },
  ];

  const filteredColumns = columns.filter((column) =>
    column.title ? columnVisibility[column.title.toString()] : true
  );

  const workflowSteps = dataModal?.sequences || [];

  return (
    <div className="workflow-tracker-page space-y-4">
      <Card className="rounded-lg shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <Breadcrumb
              items={[
                {
                  href: "/workflow",
                  title: <HomeOutlined className="text-slate-400" />,
                },
                {
                  title: <span className="font-medium text-blue-600">Workflow Tracker</span>,
                },
              ]}
              className="text-sm"
            />
            <div>
              <Title level={4} className="!m-0 !text-slate-900">
                Workflow Tracker
              </Title>
              <Text className="text-slate-500">
                Monitor requested workflows, due dates, and active routing progress.
              </Text>
            </div>
          </div>

          <Space wrap>
            <Tag color="blue">{displayedData.length} shown</Tag>
            <Tag color={trackerStats.overdue > 0 ? "red" : "green"}>{trackerStats.overdue} overdue</Tag>
          </Space>
        </div>
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} xl={6}>
          <Card className="rounded-lg shadow-sm">
            <Statistic title="Total Requests" value={trackerStats.total} prefix={<FileSearchOutlined />} />
            <Progress percent={100} showInfo={false} strokeColor="#2563eb" className="!mt-3" />
          </Card>
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <Card className="rounded-lg shadow-sm">
            <Statistic title="Workflow Types" value={trackerStats.workflowTypes} prefix={<CheckCircleOutlined />} />
            <Progress
              percent={Math.min(trackerStats.workflowTypes * 12, 100)}
              showInfo={false}
              strokeColor="#16a34a"
              className="!mt-3"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <Card className="rounded-lg shadow-sm">
            <Statistic title="Due This Week" value={trackerStats.dueSoon} prefix={<ClockCircleOutlined />} />
            <Progress
              percent={trackerStats.total ? Math.round((trackerStats.dueSoon / trackerStats.total) * 100) : 0}
              showInfo={false}
              strokeColor="#f59e0b"
              className="!mt-3"
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <Card className="rounded-lg shadow-sm">
            <Statistic
              title="Overdue"
              value={trackerStats.overdue}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: trackerStats.overdue ? "#dc2626" : "#16a34a" }}
            />
            <Progress
              percent={trackerStats.total ? Math.round((trackerStats.overdue / trackerStats.total) * 100) : 0}
              showInfo={false}
              strokeColor={trackerStats.overdue ? "#dc2626" : "#16a34a"}
              className="!mt-3"
            />
          </Card>
        </Col>
      </Row>

      <Card className="rounded-lg shadow-sm">
        <div className="mb-4 flex flex-col items-start justify-end gap-4 lg:flex-row lg:items-center">
          <div className="flex w-full flex-col items-start gap-3 sm:flex-row sm:items-center lg:w-auto">
            <Input.Search
              allowClear
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="Search workflows..."
              className="w-full sm:w-72"
              size="middle"
            />

            <Space wrap>
              <Button
                onClick={() => fetchData({ forceRefresh: true })}
                icon={<ReloadOutlined />}
                loading={loading}
                className="flex items-center gap-2 hover:border-blue-500"
              >
                Refresh
              </Button>

              <Dropdown
                menu={{
                  items: columnMenuItems,
                  className: "min-w-[200px] rounded-md py-2 shadow-lg",
                }}
                placement="bottomRight"
                trigger={["click"]}
              >
                <Button icon={<SettingOutlined />} className="flex items-center gap-2 hover:border-blue-500">
                  Columns
                </Button>
              </Dropdown>

              <PrintDropdownComponent
                stateData={displayedData}
                buttonProps={{
                  className: "flex items-center gap-2 hover:border-blue-500",
                }}
              />
            </Space>
          </div>
        </div>

        {error && (
          <Alert
            type="error"
            showIcon
            message="Unable to refresh workflow requests"
            description={error}
            className="mb-4 rounded-lg"
          />
        )}

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Spin
              size="large"
              tip="Loading workflow requests..."
              indicator={<LoadingOutlined style={{ fontSize: 36 }} spin />}
            />
          </div>
        ) : (
          <Table<DataType>
            size="middle"
            columns={filteredColumns}
            dataSource={displayedData}
            className="workflow-tracker-table rounded-lg overflow-hidden"
            bordered
            scroll={{ x: "max-content" }}
            rowKey="id"
            pagination={{
              showSizeChanger: true,
              showQuickJumper: true,
              pageSizeOptions: ["10", "20", "50", "100"],
              defaultPageSize: 20,
              className: "px-4 py-2 rounded-b-lg",
              showTotal: (total) => <span className="text-sm">Showing {displayedData.length} of {total} requests</span>,
            }}
            locale={{
              emptyText: (
                <div className="flex flex-col items-center py-12">
                  <FileSearchOutlined className="mb-3 text-3xl text-slate-400" />
                  <p className="mb-2 text-base text-slate-500">No workflow requests found</p>
                  <p className="mb-4 text-sm text-slate-400">Create new requests or check your filters</p>
                </div>
              ),
            }}
          />
        )}
      </Card>

      <Modal
        width={760}
        title={
          <div className="space-y-3">
            <div className="flex flex-wrap items-start justify-between gap-3 pr-8">
              <div className="max-w-[620px]">
                <Title level={5} className="!m-0 !leading-7 !text-slate-950">
                  {dataModal?.requested_by}
                </Title>
                <Text className="font-semibold text-slate-500">{getWorkflowName(dataModal?.workflow)}</Text>
              </div>
              <Tag color="green" className="mt-1">Active</Tag>
            </div>

            <div className="grid gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm sm:grid-cols-2">
              <div>
                <div className="text-xs font-bold uppercase tracking-wide text-slate-400">Reference No</div>
                <div className="font-mono font-semibold text-slate-700">{dataModal?.refno || "N/A"}</div>
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wide text-slate-400">Created</div>
                <div className="font-semibold text-slate-700">
                  {dataModal?.created_at ? dayjs(dataModal.created_at).format("MMM DD YYYY, h:mm A") : "N/A"}
                </div>
              </div>
            </div>
          </div>
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        centered
        styles={{
          header: {
            borderBottom: "1px solid #f0f0f0",
            padding: "18px 22px",
          },
          body: {
            maxHeight: "62vh",
            overflowY: "auto",
            padding: "20px 22px",
          },
        }}
        className="workflow-modal"
      >
        {workflowSteps.length ? (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <Text strong className="text-slate-900">Approval Path</Text>
                <div className="text-sm text-slate-500">{workflowSteps.length} configured steps</div>
              </div>
              {dataModal?.current_sequence && (
                <Tag color="blue" className="font-semibold">
                  Current: {dataModal.current_sequence}
                </Tag>
              )}
            </div>

            <div className="relative space-y-3">
              {workflowSteps.map((stepName, index) => {
                const isStart = index === 0;
                const isEnd = stepName === "End";
                const isCurrent = stepName === dataModal?.current_sequence;
                const isDuplicate = workflowSteps.indexOf(stepName) !== index;
                const stepLabel = isEnd ? "End" : isStart ? "Start" : `Step ${index + 1}`;

                return (
                  <div key={`${stepName}-${index}`} className="relative flex gap-4">
                    <div className="flex w-10 flex-col items-center">
                      <div
                        className={`z-10 flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-bold ${
                          isCurrent
                            ? "border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-100"
                            : isEnd
                            ? "border-green-500 bg-green-50 text-green-700"
                            : "border-slate-300 bg-white text-slate-500"
                        }`}
                      >
                        {isEnd ? <CheckCircleOutlined /> : index + 1}
                      </div>
                      {index < workflowSteps.length - 1 && <div className="mt-2 h-full min-h-9 w-px bg-slate-200" />}
                    </div>

                    <div
                      className={`flex-1 rounded-lg border p-4 transition ${
                        isCurrent
                          ? "border-blue-300 bg-blue-50"
                          : isEnd
                          ? "border-green-200 bg-green-50"
                          : "border-slate-200 bg-white"
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <div className="text-xs font-bold uppercase tracking-wide text-slate-400">{stepLabel}</div>
                          <div className="mt-1 text-base font-semibold text-slate-800">{stepName}</div>
                        </div>
                        <Space wrap>
                          {isCurrent && <Tag color="blue">Current</Tag>}
                          {isDuplicate && <Tag color="orange">Repeat</Tag>}
                          {isEnd && <Tag color="green">Complete Point</Tag>}
                        </Space>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center py-10 text-center">
            <FileSearchOutlined className="mb-3 text-3xl text-slate-400" />
            <Text className="text-slate-500">No workflow timeline is available for this request.</Text>
          </div>
        )}
      </Modal>
    </div>
  );
}
