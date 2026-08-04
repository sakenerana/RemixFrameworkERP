import {
  ApartmentOutlined,
  DeleteOutlined,
  EditOutlined,
  HomeOutlined,
  LoadingOutlined,
  PlusOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { Link } from "@remix-run/react";
import {
  Breadcrumb,
  Button,
  Card,
  Empty,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  TableColumnsType,
  Tag,
} from "antd";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { AppPageHeader } from "~/components/ui/AppPageHeader";
import { BudgetCodePayload, BudgetCodeService } from "~/services/budget_code.service";
import { DepartmentService } from "~/services/department.service";
import { UserService } from "~/services/user.service";
import { canManageBudgetParticulars } from "~/utils/budgetAccess";

interface BudgetCode {
  id: number;
  created_at: string;
  particulars: string;
}

interface DepartmentRecord {
  id: number;
  department: string;
  budget_code?: unknown;
}

interface AssignParticularsForm {
  department_id: number;
  budget_code: string[];
}

const normalizeBudgetCodeIds = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.map(String);
  }

  if (typeof value === "string" && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed.map(String) : [String(parsed)];
    } catch {
      return value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }

  return [];
};

export default function BudgetCodePage() {
  const [data, setData] = useState<BudgetCode[]>([]);
  const [departments, setDepartments] = useState<DepartmentRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [departmentsLoading, setDepartmentsLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [assignSaving, setAssignSaving] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<BudgetCode | null>(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [checkedAccess, setCheckedAccess] = useState(false);
  const [form] = Form.useForm<BudgetCodePayload>();
  const [assignForm] = Form.useForm<AssignParticularsForm>();

  const fetchData = async () => {
    try {
      setLoading(true);
      const rows = await BudgetCodeService.getAllParticulars();
      setData((rows || []) as BudgetCode[]);
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Failed to load budget codes");
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      setDepartmentsLoading(true);
      const rows = await DepartmentService.getAllPosts();
      setDepartments((rows || []) as DepartmentRecord[]);
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Failed to load departments");
    } finally {
      setDepartmentsLoading(false);
    }
  };

  useEffect(() => {
    const resolveAccessAndFetch = async () => {
      const localDepartment = localStorage.getItem("dept");
      let allowed = canManageBudgetParticulars({ department: localDepartment });

      if (!allowed) {
        const userAuthId = localStorage.getItem("userAuthID");

        if (userAuthId) {
          try {
            const user = await UserService.getPostById(userAuthId);
            localStorage.setItem("access", user?.access || "[]");
            allowed = canManageBudgetParticulars({
              department: localDepartment,
            });
          } catch {
            allowed = false;
          }
        }
      }

      setHasAccess(allowed);
      setCheckedAccess(true);

      if (allowed) {
        fetchData();
        fetchDepartments();
      }
    };

    resolveAccessAndFetch();
  }, []);

  const filteredData = useMemo(() => {
    const normalized = searchText.trim().toLowerCase();
    if (!normalized) return data;

    return data.filter((item) =>
      item.particulars?.toLowerCase().includes(normalized)
    );
  }, [data, searchText]);

  const openCreateModal = () => {
    setEditingRecord(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const openAssignModal = () => {
    assignForm.resetFields();
    setIsAssignModalOpen(true);

    if (!departments.length) {
      fetchDepartments();
    }
  };

  const openEditModal = (record: BudgetCode) => {
    setEditingRecord(record);
    form.setFieldsValue({ particulars: record.particulars });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingRecord(null);
    form.resetFields();
  };

  const closeAssignModal = () => {
    setIsAssignModalOpen(false);
    assignForm.resetFields();
  };

  const handleDepartmentChange = (departmentId: number) => {
    const selectedDepartment = departments.find((department) => department.id === departmentId);
    assignForm.setFieldValue(
      "budget_code",
      normalizeBudgetCodeIds(selectedDepartment?.budget_code)
    );
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);

      if (editingRecord) {
        await BudgetCodeService.updateParticular(editingRecord.id, values);
        message.success("Budget code updated successfully");
      } else {
        await BudgetCodeService.createParticular(values);
        message.success("Budget code added successfully");
      }

      closeModal();
      fetchData();
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleAssignSubmit = async () => {
    try {
      const values = await assignForm.validateFields();
      setAssignSaving(true);

      await DepartmentService.updatePost(values.department_id, {
        budget_code: values.budget_code,
      } as any);

      message.success("Department particulars updated successfully");
      closeAssignModal();
      fetchDepartments();
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message);
      }
    } finally {
      setAssignSaving(false);
    }
  };

  const handleDelete = async (record: BudgetCode) => {
    try {
      await BudgetCodeService.deleteParticular(record.id);
      message.success("Budget code deleted successfully");
      fetchData();
    } catch (error) {
      message.error(error instanceof Error ? error.message : "Failed to delete budget code");
    }
  };

  const columns: TableColumnsType<BudgetCode> = [
    {
      title: "ID",
      dataIndex: "id",
      width: 100,
      render: (id) => <Tag className="rounded-full px-3">#{id}</Tag>,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Particulars",
      dataIndex: "particulars",
      render: (value) => (
        <span className="font-semibold text-slate-900">{value || "N/A"}</span>
      ),
      sorter: (a, b) => (a.particulars || "").localeCompare(b.particulars || ""),
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      width: 190,
      render: (value) => (
        <span className="text-slate-600">
          {value ? dayjs(value).format("MMM DD, YYYY h:mm A") : "N/A"}
        </span>
      ),
      sorter: (a, b) => dayjs(a.created_at).unix() - dayjs(b.created_at).unix(),
    },
    {
      title: "Actions",
      key: "actions",
      width: 190,
      fixed: "right",
      render: (_, record) => (
        <Space size={8}>
          <Button
            size="small"
            icon={<EditOutlined />}
            className="border-amber-200 bg-amber-50 text-amber-700 hover:!border-amber-400 hover:!text-amber-700"
            onClick={() => openEditModal(record)}
          >
            Update
          </Button>
          <Popconfirm
            title="Delete budget code?"
            description="This will remove the particular from the budget_code table."
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
            onConfirm={() => handleDelete(record)}
          >
            <Button danger size="small" icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (!checkedAccess) {
    return (
      <div className="flex min-h-[420px] items-center justify-center">
        <LoadingOutlined style={{ fontSize: 32 }} spin />
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <Card className="rounded-xl border border-slate-200 shadow-sm">
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="Only Finance and IT users can manage budget particulars."
        >
          <Link to="/budget/budgets">
            <Button type="primary">Back to Budgets</Button>
          </Link>
        </Empty>
      </Card>
    );
  }

  return (
    <div className="budget-code-page space-y-3">
      <AppPageHeader
        breadcrumb={
          <Breadcrumb
            className="text-sm"
            items={[
              {
                href: "/budget",
                title: <HomeOutlined className="text-gray-400" />,
              },
              {
                title: <span className="text-gray-500">Budget</span>,
              },
              {
                title: <span className="font-medium text-blue-600">Budget Code</span>,
              },
            ]}
          />
        }
        title="Budget Code Particulars"
        subtitle="Maintain the master list of particulars used for department budget mapping."
        actions={
          <Space wrap>
            <Tag className="m-0 rounded-full border-0 bg-slate-50 px-4 py-1.5 text-sm text-slate-900">
              Total {data.length}
            </Tag>
            <Button>
              <Link to="/budget/budgets">Back to Budgets</Link>
            </Button>
            <Button
              icon={<ApartmentOutlined />}
              onClick={openAssignModal}
              loading={departmentsLoading}
            >
              Assign to Department
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              className="h-10 bg-blue-600 px-4 font-semibold hover:bg-blue-700"
              onClick={openCreateModal}
            >
              Add Particular
            </Button>
          </Space>
        }
      />

      <Card className="border border-slate-200 shadow-sm" bodyStyle={{ padding: 14 }}>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <Input.Search
            allowClear
            placeholder="Search particulars..."
            className="w-full lg:max-w-lg"
            onChange={(event) => setSearchText(event.target.value)}
          />
          <Button icon={<ReloadOutlined />} onClick={fetchData}>
            Refresh
          </Button>
        </div>
      </Card>

      <Card className="border border-slate-200 shadow-sm" bodyStyle={{ padding: 0 }}>
        <Table<BudgetCode>
          size="small"
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          className="budget-code-table overflow-hidden"
          loading={{
            spinning: loading,
            indicator: <LoadingOutlined style={{ fontSize: 28 }} spin />,
          }}
          scroll={{ x: "max-content" }}
          pagination={{
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50", "100"],
            defaultPageSize: 20,
            className: "px-4 py-2",
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} particulars`,
          }}
          locale={{
            emptyText: (
              <div className="py-10">
                <p className="m-0 text-base font-medium text-slate-600">No particulars found</p>
                <p className="m-0 mt-1 text-sm text-slate-400">Add a budget code particular to get started.</p>
              </div>
            ),
          }}
        />
      </Card>

      <Modal
        title={editingRecord ? "Update Particular" : "Add Particular"}
        open={isModalOpen}
        onCancel={closeModal}
        onOk={handleSubmit}
        okText={editingRecord ? "Update" : "Add"}
        confirmLoading={saving}
        destroyOnClose
      >
        <Form form={form} layout="vertical" className="pt-3">
          <Form.Item
            label="Particular"
            name="particulars"
            rules={[
              { required: true, message: "Particular is required" },
              { min: 2, message: "Please enter at least 2 characters" },
            ]}
          >
            <Input.TextArea
              autoSize={{ minRows: 3, maxRows: 5 }}
              placeholder="Example: Vehicle Maintenance"
              allowClear
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Assign Department Particulars"
        open={isAssignModalOpen}
        onCancel={closeAssignModal}
        onOk={handleAssignSubmit}
        okText="Save Assignment"
        confirmLoading={assignSaving}
        destroyOnClose
      >
        <Form form={assignForm} layout="vertical" className="pt-3">
          <Form.Item
            label="Department"
            name="department_id"
            rules={[{ required: true, message: "Please choose a department" }]}
          >
            <Select
              showSearch
              loading={departmentsLoading}
              placeholder="Choose department"
              optionFilterProp="label"
              onChange={handleDepartmentChange}
              options={departments.map((department) => ({
                label: department.department,
                value: department.id,
              }))}
            />
          </Form.Item>

          <Form.Item
            label="Budget Particulars"
            name="budget_code"
            rules={[{ required: true, message: "Please choose at least one particular" }]}
          >
            <Select
              mode="multiple"
              allowClear
              showSearch
              loading={loading}
              maxTagCount="responsive"
              placeholder="Choose budget particulars"
              optionFilterProp="label"
              options={data.map((item) => ({
                label: item.particulars || "N/A",
                value: String(item.id),
              }))}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
