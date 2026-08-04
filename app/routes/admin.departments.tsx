import {
  ApartmentOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  HomeOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Breadcrumb,
  Button,
  Card,
  Checkbox,
  Form,
  Input,
  MenuProps,
  message,
  Modal,
  Popconfirm,
  Select,
  Spin,
  Table,
  TableColumnsType,
  Tag,
  Typography,
} from "antd";
import { useEffect, useMemo, useState } from "react";
import {
  AiOutlineApartment,
  AiOutlineBuild,
  AiOutlineCheckCircle,
  AiOutlineCloseCircle,
  AiOutlinePlus,
  AiOutlineSave,
  AiOutlineTeam,
  AiOutlineUndo,
} from "react-icons/ai";
import PrintDropdownComponent from "~/components/print_dropdown";
import { DataTableToolbar } from "~/components/ui/DataTableToolbar";
import { AppPageHeader } from "~/components/ui/AppPageHeader";
import { BudgetCodeService } from "~/services/budget_code.service";
import { DepartmentService } from "~/services/department.service";
import { Department } from "~/types/department.type";

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

export default function DepartmentsRoutes() {
  const [data, setData] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(true);
  const [isTitle, setIsTitle] = useState('');
  const [form] = Form.useForm<Department>();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchText, setSearchText] = useState('');

  const handleRefetch = async () => {
    setLoading(true);
    await fetchData();
    setLoading(false);
  };

  const onReset = () => {
    Modal.confirm({
      title: "Confirm Reset",
      content: "Are you sure you want to reset all form fields?",
      okText: "Reset",
      cancelText: "Cancel",
      onOk: () => form.resetFields(),
    });
  };

  const handleTrack = () => {
    setIsEditMode(false);
    setIsModalOpen(true);
    setEditingId(null);
    form.resetFields();
    setIsTitle('Create Department')
  };

  // Edit record
  const editRecord = (record: Department) => {
    setIsEditMode(true);
    form.setFieldsValue({
      ...record,
      budget_code: normalizeBudgetCodeIds((record as any).budget_code),
    });
    setEditingId(record.id);
    setIsModalOpen(true);
    setIsTitle('Update Department')
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleDeleteButton = async (record: Department) => {
    if (record.status_labels?.name === 'Active') {
      const { error } = await DepartmentService.deactivateStatus(
        record.id,
        record
      );

      if (error) throw message.error(error.message);
      message.success("Record deactivated successfully");
      fetchData();
    } else if (record.status_labels?.name === 'Inactive') {
      const { error } = await DepartmentService.activateStatus(
        record.id,
        record
      );

      if (error) throw message.error(error.message);
      message.success("Record activated successfully");
      fetchData();
    }
  };

  // Fetch data from Supabase
  const fetchData = async () => {
    try {
      setLoading(true);
      const dataFetch = await DepartmentService.getAllPosts();
      setData(dataFetch); // Works in React state
    } catch (error) {
      message.error("error");
    } finally {
      setLoading(false);
    }
  };

  // Fetch data from Supabase Budget Code particulars
  const [particularOptions, setParticularOptions] = useState<Array<{ label: string; value: string }>>([]);
  const fetchBudgetParticular = async () => {
    try {
      setLoading(true);
      const dataFetch = await BudgetCodeService.getAllParticulars();
      setParticularOptions(dataFetch.map((item: any) => ({
        label: item.particulars || "N/A",
        value: item.id.toString()
      })));
    } catch (error) {
      message.error("error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgetParticular();
    fetchData();
  }, []);

  const displayedData = useMemo(() => {
    const normalizedSearch = searchText.trim().toLowerCase();

    if (!normalizedSearch) {
      return data;
    }

    return data.filter((department) =>
      department.department?.toLowerCase().includes(normalizedSearch)
    );
  }, [data, searchText]);

  const selectedBudgetCodes = Form.useWatch("budget_code", form) || [];

  // Create or Update record
  const onFinish = async () => {
    try {

      const values = await form.validateFields();

      // Include your extra field
      const allValues = {
        ...values,
        status_id: 1,
      };

      if (editingId) {
        // Update existing record
        const { error } = await DepartmentService.updatePost(editingId, values);
        if (error) throw message.error(error.message);
        message.success("Record updated successfully");
      } else {
        // Create new record
        setLoading(true);
        const { error } = await DepartmentService.createPost(allValues);

        if (error) throw message.error(error.message);
        message.success("Record created successfully");
      }

      setLoading(false);
      setIsModalOpen(false);
      form.resetFields();
      setEditingId(null);
      fetchData();
    } catch (error) {
      message.error("Error");
    }
  };

  // State for column visibility
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({
    "Department Name": true,
    "Status": true,
    "Actions": true,
  });

  const columns: TableColumnsType<Department> = [
    {
      title: "Department Name",
      dataIndex: "department",
      width: 320,
      render: (text) => (
        <div className="flex items-center">
          <Avatar
            src="/img/supplier-icon.png"
            size="small"
            className="mr-3 bg-blue-100 text-blue-600"
            icon={<AiOutlineTeam />}
          />
          <span className="font-semibold text-gray-900">
            {text || <span>N/A</span>}
          </span>
        </div>
      )
    },
    {
      title: "Status",
      dataIndex: "status",
      width: 120,
      render: (_, record) => {
        if (record.status_labels?.name === 'Active') {
          return (
            <Tag color="success" className="inline-flex items-center gap-1 rounded-full px-2">
              <CheckCircleOutlined /> Active
            </Tag>
          );
        } else if (record.status_labels?.name === 'Inactive') {
          return (
            <Tag color="error" className="inline-flex items-center gap-1 rounded-full px-2">
              <AiOutlineCloseCircle /> Inactive
            </Tag>
          );
        }
      },
    },
    {
      title: "Actions",
      dataIndex: "actions",
      width: 190,
      fixed: "right",
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <Popconfirm
            title="Do you want to update?"
            description="Are you sure to update this department?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => editRecord(record)}
          >
            <Button
              size="small"
              icon={<EditOutlined />}
              className="border-amber-200 bg-amber-50 text-amber-700 hover:!border-amber-400 hover:!text-amber-700"
            >
              Update
            </Button>
          </Popconfirm>
          <Popconfirm
            title={record.status_labels?.name === 'Active' ? "Do you want to deactivate?" : "Do you want to activate?"}
            description={record.status_labels?.name === 'Active' ? "Are you sure to deactivate this department?" : "Are you sure to activate this department?"}
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDeleteButton(record)}
          >
            {record.status_labels?.name === 'Active' && (
              <Button
                danger
                size="small"
                icon={<DeleteOutlined />}
              >
                Deactivate
              </Button>
            )}
            {record.status_labels?.name === 'Inactive' && (
              <Button
                type="primary"
                size="small"
                icon={<AiOutlineCheckCircle />}
              >
                Activate
              </Button>
            )}
          </Popconfirm>
        </div>
      ),
    },
  ];

  // Toggle column visibility
  const toggleColumn = (columnTitle: string) => {
    setColumnVisibility(prev => ({
      ...prev,
      [columnTitle]: !prev[columnTitle]
    }));
  };

  // Create dropdown menu items
  const columnMenuItems: MenuProps['items'] = Object.keys(columnVisibility).map(columnTitle => ({
    key: columnTitle,
    label: (
      <Checkbox
        checked={columnVisibility[columnTitle]}
        onClick={() => toggleColumn(columnTitle)}
      >
        {columnTitle}
      </Checkbox>
    ),
  }));

  // Filter columns based on visibility
  const filteredColumns = columns.filter(column =>
    column.title ? columnVisibility[column.title.toString()] : true
  );

  const activeCount = data.filter((department) => department.status_labels?.name === 'Active').length;
  const inactiveCount = data.filter((department) => department.status_labels?.name === 'Inactive').length;

  return (
    <Card className="admin-departments-page rounded-md border border-gray-200 shadow-sm" styles={{ body: { padding: 14 } }}>
      {/* Header Section */}
      <AppPageHeader
        className="mb-3"
        breadcrumb={
          <Breadcrumb
            items={[
              {
                href: "/admin/dashboard",
                title: <HomeOutlined className="text-gray-400" />,
              },
              {
                title: <span className="text-gray-500">Settings</span>,
              },
              {
                title: <span className="text-blue-600 font-medium">Departments</span>,
              },
            ]}
            className="text-sm"
          />
        }
        title="Departments"
        subtitle="Maintain department records and connect each department to budget particulars."
        actions={
          <>
            <Tag className="m-0 rounded-full border-0 bg-slate-50 px-4 py-1.5 text-sm text-slate-900">
              Total {data.length}
            </Tag>
            <Tag className="m-0 rounded-full border-0 bg-emerald-50 px-4 py-1.5 text-sm text-emerald-600">
              Active {activeCount}
            </Tag>
            <Tag className="m-0 rounded-full border-0 bg-red-50 px-4 py-1.5 text-sm text-red-500">
              Inactive {inactiveCount}
            </Tag>
            <Button
              onClick={() => handleTrack()}
              icon={<AiOutlinePlus />}
              type="primary"
              className="flex h-10 items-center gap-2 bg-blue-600 px-4 font-semibold hover:bg-blue-700"
            >
              New Department
            </Button>
          </>
        }
      />

      {/* Department Creation/Edit Modal */}
      <Modal
        width={760}
        className="department-form-modal"
        title={
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <AiOutlineBuild className="text-xl" />
            </div>
            <div>
              <Typography.Title level={4} className="!mb-0">
                {isTitle}
              </Typography.Title>
              <Typography.Text className="text-sm text-slate-500">
                Maintain department details and assigned budget particulars.
              </Typography.Text>
            </div>
          </div>
        }
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        centered
        destroyOnClose
        styles={{
          header: {
            borderBottom: '1px solid #f0f0f0',
            padding: '16px 24px'
          },
          body: {
            padding: '20px 24px'
          }
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="space-y-4"
        >

          <Form.Item
            label={
              <span className="font-medium">
                Department Name <span className="text-red-500">*</span>
              </span>
            }
            name="department"
            rules={[
              {
                required: true,
                message: 'Department name is required',
              },
              {
                min: 2,
                message: 'Minimum 3 characters',
              },
              {
                max: 50,
                message: 'Maximum 50 characters',
              }
            ]}
            validateTrigger="onBlur"
          >
            <Input
              placeholder="Enter department name (e.g., Finance, IT, HR)"
              prefix={<AiOutlineApartment className="text-gray-400" />}
              className="h-10"
              allowClear
            />
          </Form.Item>

          <Form.Item
            label={
              <span className="font-medium">
                Select Budget Particulars: <span className="text-red-500">*</span>
              </span>
            }
            name="budget_code"
            rules={[{ required: true, message: 'Please select at least one budget particular' }]}
          >
            <Select
              mode="multiple"
              allowClear
              showSearch
              loading={loading}
              maxTagCount="responsive"
              maxTagPlaceholder={(omittedValues) => `+${omittedValues.length} more`}
              optionFilterProp="label"
              placeholder="Choose budget particulars"
              options={particularOptions}
              notFoundContent={loading ? "Loading particulars..." : "No particulars found"}
            />
          </Form.Item>

          <div className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="m-0 text-sm font-semibold text-slate-900">Budget mapping</p>
                <p className="m-0 text-sm text-slate-600">
                  Selected particulars become available for this department's budget records.
                </p>
              </div>
              <Tag className="m-0 rounded-full border-0 bg-white px-3 py-1 text-blue-600">
                {selectedBudgetCodes.length} selected
              </Tag>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 border-t border-slate-100 pt-5">
            <Button
              onClick={onReset}
              type="default"
              className="h-10 w-full sm:w-auto"
              icon={<AiOutlineUndo />}
            >
              Reset Form
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              className="h-10 w-full bg-blue-600 px-5 font-semibold hover:bg-blue-700 sm:w-auto"
              loading={loading}
              icon={!loading && <AiOutlineSave />}
            >
              {isEditMode ? 'Update Department' : 'Create Department'}
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Toolbar Section */}
      <DataTableToolbar
        alertMessage="Department Structure: Organize your company's departments and reporting structure."
        alertClassName="admin-departments-compact-alert"
        className="mb-3"
        searchPlaceholder="Search departments..."
        onSearchChange={setSearchText}
        onRefresh={handleRefetch}
        columnMenuItems={columnMenuItems}
        columnsMenuClassName="shadow-lg rounded-md min-w-[220px]"
        exportNode={
          <PrintDropdownComponent
            stateData={data}
            buttonProps={{
              className: "flex items-center gap-2 border-gray-300 hover:border-blue-500",
            }}
          />
        }
      />

      {/* Table Section */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spin
            size="large"
            tip="Loading department data..."
            indicator={
              <LoadingOutlined
                style={{
                  fontSize: 36,
                  color: '#1890ff'
                }}
                spin
              />
            }
          />
        </div>
      ) : (
        <Table<Department>
          size="small"
          columns={filteredColumns}
          dataSource={displayedData}
          className="admin-departments-table overflow-hidden rounded-md border border-gray-200"
          bordered={false}
          scroll={{ x: "max-content" }}
          rowKey="id"
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            defaultPageSize: 20,
            className: "px-4 py-2",
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} departments`,
          }}
          locale={{
            emptyText: (
              <div className="py-8 flex flex-col items-center">
                <ApartmentOutlined className="text-3xl text-gray-400 mb-2" />
                <p className="text-gray-500 mb-4">No departments found</p>
                <Button
                  type="primary"
                  className="mt-2"
                  onClick={() => handleTrack()}
                  icon={<AiOutlinePlus />}
                >
                  Create First Department
                </Button>
              </div>
            )
          }}
        />
      )}
    </Card>
  );
}
