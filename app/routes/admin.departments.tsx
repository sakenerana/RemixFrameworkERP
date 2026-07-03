import {
  ApartmentOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  HomeOutlined,
  LoadingOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Avatar,
  Breadcrumb,
  Button,
  Card,
  Checkbox,
  Dropdown,
  Form,
  Input,
  MenuProps,
  message,
  Modal,
  Popconfirm,
  Space,
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
import { FcRefresh } from "react-icons/fc";
import PrintDropdownComponent from "~/components/print_dropdown";
import { BudgetCodeService } from "~/services/budget_code.service";
import { DepartmentService } from "~/services/department.service";
import { Department } from "~/types/department.type";

const { Text, Title } = Typography;

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
    form.setFieldsValue(record);
    setEditingId(record.id);
    setIsModalOpen(true);
    setIsTitle('Update Department')
  };

  const handleOk = () => {
    setIsModalOpen(false);
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
        label: item.particulars,
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
    <Card className="admin-departments-page rounded-md border border-gray-200 shadow-sm" styles={{ body: { padding: 16 } }}>
      {/* Header Section */}
      <div className="mb-5 rounded-md border border-gray-200 bg-white px-5 py-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
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
            <Title level={3} className="!mb-1 !mt-3">
              Departments
            </Title>
            <Text className="text-sm text-gray-500">
              Maintain department records and connect each department to budget particulars.
            </Text>
          </div>

          <Space wrap className="mt-2 sm:mt-0">
            <Tag className="rounded-full px-3 py-1">Total {data.length}</Tag>
            <Tag color="success" className="rounded-full px-3 py-1">Active {activeCount}</Tag>
            <Tag color="error" className="rounded-full px-3 py-1">Inactive {inactiveCount}</Tag>
            <Button
              onClick={() => handleTrack()}
              icon={<AiOutlinePlus />}
              type="primary"
              size="large"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              New Department
            </Button>
          </Space>
        </div>
      </div>

      {/* Department Creation/Edit Modal */}
      <Modal
        width={1000}
        title={
          <div className="flex items-center gap-2">
            <AiOutlineBuild className="text-blue-500 text-xl" />
            <span className="text-lg font-semibold">{isTitle}</span>
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
            padding: '24px'
          }
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="space-y-6"
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
            <Checkbox.Group options={particularOptions}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" />
          </Form.Item>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 border-t pt-6 mt-6">
            <Button
              onClick={onReset}
              type="default"
              size="large"
              className="w-full sm:w-auto h-11"
              icon={<AiOutlineUndo />}
            >
              Reset Form
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              className="w-full sm:w-auto h-11 bg-blue-600 hover:bg-blue-700"
              loading={loading}
              icon={!loading && <AiOutlineSave />}
            >
              {isEditMode ? 'Update Department' : 'Create Department'}
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Toolbar Section */}
      <div className="mb-5 rounded-md border border-gray-200 bg-gray-50 p-4">
        <Alert
          message="Department Structure: Organize your company's departments and reporting structure."
          type="info"
          showIcon
          className="mb-4"
        />

        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <Input.Search
            allowClear
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search departments..."
            className="w-full xl:max-w-md"
            size="large"
          />

          <Space wrap>
            <Button
              onClick={handleRefetch}
              icon={<FcRefresh className="text-blue-500" />}
              className="flex items-center gap-2 border-gray-300 hover:border-blue-500"
            >
              Refresh
            </Button>

            <Dropdown
              menu={{
                items: columnMenuItems,
                className: "shadow-lg rounded-md min-w-[220px]"
              }}
              placement="bottomRight"
              trigger={['click']}
            >
              <Button
                icon={<SettingOutlined />}
                className="flex items-center gap-2 border-gray-300 hover:border-blue-500"
              >
                Columns
              </Button>
            </Dropdown>

            <PrintDropdownComponent
              stateData={data}
              buttonProps={{
                className: "flex items-center gap-2 border-gray-300 hover:border-blue-500",
              }}
            />
          </Space>
        </div>
      </div>

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
          size="middle"
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
