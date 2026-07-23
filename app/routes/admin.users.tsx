import {
    CheckCircleOutlined,
    DeleteOutlined,
    EditOutlined,
    HomeOutlined,
    LoadingOutlined,
    SettingOutlined,
    UserOutlined,
} from "@ant-design/icons";
import {
    Alert,
    Avatar,
    Breadcrumb,
    Button,
    Card,
    Checkbox,
    CheckboxOptionType,
    Col,
    Dropdown,
    Form,
    Input,
    MenuProps,
    message,
    Modal,
    Popconfirm,
    Row,
    Select,
    Space,
    Spin,
    Table,
    TableColumnsType,
    Tag,
    Typography,
} from "antd";
import { useEffect, useMemo, useState } from "react";
import {
    AiOutlineCheckCircle,
    AiOutlineCloseCircle,
    AiOutlineContacts,
    AiOutlineDelete,
    AiOutlineDown,
    AiOutlineEdit,
    AiOutlineInfoCircle,
    AiOutlineLock,
    AiOutlineMail,
    AiOutlinePhone,
    AiOutlinePlus,
    AiOutlineSafetyCertificate,
    AiOutlineSave,
    AiOutlineTeam,
    AiOutlineUndo,
    AiOutlineUser,
} from "react-icons/ai";
import { FcRefresh } from "react-icons/fc";
import { useAuth } from "~/auth/AuthContext";
import PrintDropdownComponent from "~/components/print_dropdown";
import { DepartmentService } from "~/services/department.service";
import { GroupService } from "~/services/groups.service";
import { OfficeService } from "~/services/office.service";
import { UserService } from "~/services/user.service";
import { Department } from "~/types/department.type";
import { Groups } from "~/types/groups.type";
import { Office } from "~/types/office.type";
import { User } from "~/types/user.type";
import supabase from "~/utils/supabase.client";

const { Text, Title } = Typography;

export default function UsersRoutes() {
    const [data, setData] = useState<User[]>([]);
    const [dataDepartment, setDataDepartment] = useState<Department[]>([]);
    const [dataGroup, setDataGroup] = useState<Groups[]>([]);
    const [dataOffice, setDataOffice] = useState<Office[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(true);
    const [isTitle, setIsTitle] = useState('');
    const [form] = Form.useForm<User>();
    const [editingId, setEditingId] = useState<number | null>(null);
    const { Option } = Select;
    const { adminSignUp } = useAuth();
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
        setIsTitle('Create User & Permissions')
    };

    // Edit record
    const editRecord = (record: User) => {
        setIsEditMode(true);
        form.setFieldsValue(record);
        setEditingId(record.id);
        setIsModalOpen(true);
        setIsTitle('Update User & Permissions')
    };

    // const handleOk = () => {
    //     setIsModalOpen(false);
    // };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleDeleteButton = async (record: User) => {
        if (record.status_labels?.name === 'Active') {
            const { error } = await UserService.deactivateStatus(record.id, record);

            if (error) throw error;
            message.success("Record deactivated successfully");
            await fetchData();
        } else if (record.status_labels?.name === 'Inactive') {
            const { error } = await UserService.activateStatus(record.id, record);

            if (error) throw error;
            message.success("Record activated successfully");
            await fetchData();
        }
    };

    // Fetch data from Supabase
    const fetchData = async () => {
        try {
            setLoading(true);
            const dataFetch = await UserService.getAllPosts();
            setData(dataFetch); // Works in React state  
        } catch (error) {
            message.error("error");
        } finally {
            setLoading(false);
        }
    };

    // Fetch data from Supabase
    const fetchDataDepartment = async () => {
        try {
            setLoading(true);
            const dataFetchDepartment = await DepartmentService.getAllPosts();
            setDataDepartment(dataFetchDepartment); // Works in React state
        } catch (error) {
            message.error("error");
        } finally {
            setLoading(false);
        }
    };

    // Fetch data from Supabase
    const fetchDataGroup = async () => {
        try {
            setLoading(true);
            const dataFetchGroup = await GroupService.getAllPosts();
            setDataGroup(dataFetchGroup); // Works in React state
        } catch (error) {
            message.error("error");
        } finally {
            setLoading(false);
        }
    };

    // Fetch data from Supabase
    const fetchDataOffice = async () => {
        try {
            setLoading(true);
            const dataFetchOffice = await OfficeService.getAllPosts();
            setDataOffice(dataFetchOffice); // Works in React state
        } catch (error) {
            message.error("error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDataDepartment();
        fetchDataGroup();
        fetchDataOffice();
        fetchData();
    }, []);

    const displayedData = useMemo(() => {
        const normalizedSearch = searchText.trim().toLowerCase();

        if (!normalizedSearch) {
            return data;
        }

        return data.filter((user) =>
            user.first_name?.toLowerCase().includes(normalizedSearch) ||
            user.middle_name?.toLowerCase().includes(normalizedSearch) ||
            user.last_name?.toLowerCase().includes(normalizedSearch) ||
            user.email?.toLowerCase().includes(normalizedSearch) ||
            user.phone?.includes(searchText.trim())
        );
    }, [data, searchText]);

    // Create or Update record
    const onFinish = async (event: any) => {
        // event.preventDefault(); // Prevents the default form submission
        try {
            const values = await form.validateFields();

            if (editingId) {
                // Update existing record 
                const { error } = await UserService.updatePost(editingId, values);
                if (error) throw message.error(error.message);
                message.success("Record updated successfully");
            } else {
                // Create new record
                setLoading(true);

                const { data, error } = await adminSignUp(values.email, values.password);
                setLoading(false);
                if (error) throw message.error(error.message);
                // Immediately sign out the user
                // await supabase.auth.signOut();
                try {
                    setLoading(true);
                    // Include your extra field
                    const allValues = {
                        ...values,
                        status_id: 1,
                        auth_id: data?.user?.id
                    };

                    const { error } = await UserService.createPost(allValues);
                    if (error) throw error;
                } catch (error) {
                    setLoading(false);
                    message.error("Error Registration");
                }
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
        "Name": true,
        "Email": true,
        "Phone": false,
        "Office": true,
        "Department": true,
        "Status": true,
        "Actions": true,
    });

    const columns: TableColumnsType<User> = [
        {
            title: "Name",
            dataIndex: "name",
            width: 260,
            render: (_, record) => (
                <div className="flex items-center">
                    <Avatar
                        src={"/img/default-avatar.png"}
                        size="small"
                        className="mr-3 border border-gray-200 dark:border-gray-600"
                    />
                    <div className="min-w-0">
                        <p className="m-0 truncate font-semibold text-gray-900 dark:text-gray-100">
                            {record.first_name} {record.middle_name} {record.last_name}
                        </p>
                        <p className="m-0 text-xs text-gray-500 dark:text-gray-400">
                            ID: {record.id}
                        </p>
                    </div>
                </div>
            ),
        },
        {
            title: "Email",
            dataIndex: "email",
            width: 300,
            render: (email) => (
                <div className="flex min-w-0 items-center">
                    <AiOutlineMail className="mr-2 shrink-0 text-gray-400" />
                    <a
                        href={`mailto:${email}?subject=Regarding Your Account`}
                        className="truncate text-blue-600 transition-colors duration-200 hover:text-blue-800 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
                        onClick={(e) => !email && e.preventDefault()}
                        title={email || 'No email provided'}
                    >
                        {email || <span className="text-gray-400">N/A</span>}
                    </a>
                </div>
            ),
        },
        {
            title: "Phone",
            dataIndex: "phone",
            width: 120,
            render: (phone) => (
                <div className="flex items-center">
                    <AiOutlinePhone className="text-gray-400 mr-2" />
                    <span>
                        {phone || <span>N/A</span>}
                    </span>
                </div>
            ),
        },
        {
            title: "Office",
            dataIndex: "office",
            width: 120,
            render: (_, record) => (
                <div className="flex items-center group">
                    <div className="p-1.5 mr-2 rounded-md bg-gray-100 group-hover:bg-blue-100 transition-colors">
                        <AiOutlineTeam className="text-gray-500 group-hover:text-blue-600 transition-colors" />
                    </div>
                    <span className="font-medium text-gray-700 truncate">
                        {record.office?.name || '—'}
                    </span>
                </div>
            )
        },
        {
            title: "Department",
            dataIndex: "department",
            width: 120,
            render: (_, record) => (
                <div className="flex items-center">
                    <AiOutlineTeam className="text-gray-400 mr-2" />
                    <span>
                        {record.departments?.department || 'N/A'}
                    </span>
                </div>
            ),
        },
        {
            title: "Status",
            dataIndex: "status",
            width: 100,
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
                        description="Are you sure to update this user?"
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
                        description={record.status_labels?.name === 'Active' ? "Are you sure to deactivate this user?" : "Are you sure to activate this user?"}
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

    const optionsOffice: CheckboxOptionType<any>[] = [
        { label: "Main Office", value: 1 },
        { label: "Branch Office", value: 2 },
    ];

    const options: CheckboxOptionType<any>[] = [
        { label: "Inventory", value: 1 },
        { label: "Budget Monitoring", value: 2 },
        { label: "Workflow", value: 3 },
        { label: "Admin Panel", value: 4 },
        { label: "Ticketing", value: 5 },
        { label: "Performance Report", value: 6 },
        { label: "Human Resource Management", value: 7 },
        { label: "Reports", value: 8 },
    ];

    const optionsPermission: CheckboxOptionType<any>[] = [
        { label: "Create", value: 1 },
        { label: "Update", value: 2 },
        { label: "Delete", value: 3 },
        { label: "View", value: 4 },
    ];

    const activeCount = data.filter((user) => user.status_labels?.name === 'Active').length;
    const inactiveCount = data.filter((user) => user.status_labels?.name === 'Inactive').length;

    return (
        <Card className="admin-users-page rounded-md border border-gray-200 shadow-sm" styles={{ body: { padding: 14 } }}>
            {/* Header Section */}
            <div className="mb-3 rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm">
                <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                    <div className="min-w-0">
                        <Breadcrumb
                            items={[
                                {
                                    href: "/admin/dashboard",
                                    title: <HomeOutlined className="text-gray-400" />,
                                },
                                {
                                    title: <span className="text-gray-500">Admin</span>,
                                },
                                {
                                    title: <span className="text-blue-600 font-medium">User Management</span>,
                                },
                            ]}
                            className="text-sm"
                        />
                        <Title level={3} className="!mb-1 !mt-2">
                            User Management
                        </Title>
                        <Text className="text-sm text-gray-500">
                            Manage account access, office assignments, departments, and module permissions.
                        </Text>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 xl:justify-end">
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
                            Add User
                        </Button>
                    </div>
                </div>
            </div>

            {/* User Creation/Edit Modal */}
            <Modal
                width={1100}
                title={
                    <div className="flex items-center gap-2">
                        <AiOutlineUser className="text-blue-500 text-xl" />
                        <span className="text-lg font-semibold">{isTitle}</span>
                    </div>
                }
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}
                centered
                destroyOnClose
                styles={{
                    header: { borderBottom: '1px solid #f0f0f0', padding: '16px 24px' },
                    body: { padding: '24px' }
                }}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    className="space-y-6"
                >
                    {/* Personal Information Section */}
                    <Card type="inner" title={
                        <div className="flex flex-wrap gap-2">
                            <AiOutlineInfoCircle className="text-blue-500 mt-1" />
                            <span>Personal Information</span>
                        </div>
                    }>
                        <Row gutter={16}>
                            <Col xs={24} sm={8}>
                                <Form.Item
                                    label={<span className="font-medium">First Name <span className="text-red-500">*</span></span>}
                                    name="first_name"
                                    rules={[{ required: true, message: "Required field" }]}
                                >
                                    <Input
                                        placeholder="John"
                                        prefix={<AiOutlineUser className="text-gray-400" />}
                                        className="h-10"
                                    />
                                </Form.Item>
                            </Col>

                            <Col xs={24} sm={8}>
                                <Form.Item
                                    label="Middle Name"
                                    name="middle_name"
                                >
                                    <Input
                                        placeholder="Michael"
                                        className="h-10"
                                    />
                                </Form.Item>
                            </Col>

                            <Col xs={24} sm={8}>
                                <Form.Item
                                    label={<span className="font-medium">Last Name <span className="text-red-500">*</span></span>}
                                    name="last_name"
                                    rules={[{ required: true, message: "Required field" }]}
                                >
                                    <Input
                                        placeholder="Doe"
                                        className="h-10"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>

                    {/* Contact Information Section */}
                    <Card type="inner" title={
                        <div className="flex flex-wrap gap-2">
                            <AiOutlineContacts className="text-blue-500 mt-1" />
                            <span>Contact Information</span>
                        </div>
                    }>
                        <Row gutter={16}>
                            <Col xs={24} sm={8}>
                                <Form.Item
                                    label={<span className="font-medium">Email <span className="text-red-500">*</span></span>}
                                    name="email"
                                    rules={[
                                        { required: true, message: "Required field" },
                                        { type: 'email', message: 'Invalid email format' }
                                    ]}
                                >
                                    <Input
                                        placeholder="john.doe@example.com"
                                        prefix={<AiOutlineMail className="text-gray-400" />}
                                        disabled={isEditMode}
                                        className="h-10"
                                    />
                                </Form.Item>
                            </Col>

                            <Col xs={24} sm={8}>
                                <Form.Item
                                    label={<span className="font-medium">Phone <span className="text-red-500">*</span></span>}
                                    name="phone"
                                    rules={[{ required: true, message: "Required field" }]}
                                >
                                    <Input
                                        type="tel"
                                        placeholder="+1 (555) 123-4567"
                                        prefix={<AiOutlinePhone className="text-gray-400" />}
                                        className="h-10"
                                    />
                                </Form.Item>
                            </Col>

                            <Col xs={24} sm={8}>
                                <Form.Item
                                    label={<span className="font-medium">Username <span className="text-red-500">*</span></span>}
                                    name="username"
                                    rules={[{ required: true, message: "Required field" }]}
                                >
                                    <Input
                                        placeholder="johndoe"
                                        prefix={<AiOutlineUser className="text-gray-400" />}
                                        className="h-10"
                                    />
                                </Form.Item>
                            </Col>

                            <Col xs={24} sm={8}>
                                <Form.Item
                                    label={<span className="font-medium">AB User ID <span className="text-red-500">*</span></span>}
                                    name="ab_user_id"
                                    rules={[{ required: true, message: "Required field" }]}
                                >
                                    <Input
                                        placeholder="123"
                                        prefix={<AiOutlineUser className="text-gray-400" />}
                                        className="h-10"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>

                    {/* Security Section */}
                    {!isEditMode && (
                        <Card type="inner" title={
                            <div className="flex flex-wrap gap-2">
                                <AiOutlineLock className="text-blue-500 mt-1" />
                                <span>Security</span>
                            </div>
                        }>
                            <Row gutter={16}>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        label={<span className="font-medium">Password <span className="text-red-500">*</span></span>}
                                        name="password"
                                        rules={[
                                            { required: true, message: "Required field" },
                                            { min: 8, message: "Minimum 8 characters" }
                                        ]}
                                        help="Minimum 8 characters with at least 1 number and special character"
                                    >
                                        <Input.Password
                                            placeholder="••••••••"
                                            className="h-10"
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card>
                    )}

                    {/* Organizational Information Section */}
                    <Card type="inner" title={
                        <div className="flex flex-wrap gap-2">
                            <AiOutlineTeam className="text-blue-500 mt-1" />
                            <span>Organizational Information</span>
                        </div>
                    }>
                        <Row gutter={16}>
                            <Col xs={24} sm={8}>
                                <Form.Item
                                    label={<span className="font-medium">Department <span className="text-red-500">*</span></span>}
                                    name="department_id"
                                    rules={[{ required: true, message: "Required field" }]}
                                >
                                    <Select
                                        placeholder="Select department"
                                        className="h-10"
                                        suffixIcon={<AiOutlineDown className="text-gray-400" />}
                                    >
                                        {dataDepartment.map((item: Department) => (
                                            <Option key={item.id} value={item.id}>
                                                {item.department}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>

                            <Col xs={24} sm={8}>
                                <Form.Item
                                    label={<span className="font-medium">Group <span className="text-red-500">*</span></span>}
                                    name="group_id"
                                    rules={[{ required: true, message: "Required field" }]}
                                >
                                    <Select
                                        placeholder="Select group"
                                        className="h-10"
                                        suffixIcon={<AiOutlineDown className="text-gray-400" />}
                                    >
                                        {dataGroup.map((item: Groups) => (
                                            <Option key={item.id} value={item.id}>
                                                {item.group}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>

                            <Col xs={24} sm={8}>
                                <Form.Item
                                    label={<span className="font-medium">Office <span className="text-red-500">*</span></span>}
                                    name="office_id"
                                    rules={[{ required: true, message: "Required field" }]}
                                >
                                    <Select
                                        placeholder="Select an office"
                                        showSearch
                                        optionFilterProp="label"
                                        className="h-10"
                                        style={{ width: '100%' }}
                                    >
                                        {dataOffice.map((item: Office) => (
                                            <Option key={item.id} value={item.id}>
                                                {item.name}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>

                    {/* Permissions Section */}
                    <Card type="inner" title={
                        <div className="flex flex-wrap gap-2">
                            <AiOutlineSafetyCertificate className="text-blue-500 mt-1" />
                            <span>Permissions</span>
                        </div>
                    }>
                        <Row gutter={16}>
                            <Col xs={24}>
                                <Form.Item
                                    label={<span className="font-medium">User Access <span className="text-red-500">*</span></span>}
                                    name="access"
                                    rules={[{ required: true, message: "Required field" }]}
                                >
                                    <Checkbox.Group
                                        options={options}
                                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
                                    />
                                </Form.Item>
                            </Col>

                            <Col xs={24}>
                                <Form.Item
                                    label={<span className="font-medium">Detailed Permissions <span className="text-red-500">*</span></span>}
                                    name="permissions"
                                    rules={[{ required: true, message: "Required field" }]}
                                >
                                    <Checkbox.Group
                                        options={optionsPermission}
                                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>

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
                            {isEditMode ? 'Update User' : 'Create User'}
                        </Button>
                    </div>
                </Form>
            </Modal>

            {/* Toolbar Section */}
            <div className="mb-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
                <Alert
                    message="User Management: View and manage all user accounts and permissions."
                    type="info"
                    showIcon
                    className="admin-users-compact-alert mb-3"
                />

                <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                    <Input.Search
                        allowClear
                        onChange={(e) => setSearchText(e.target.value)}
                        placeholder="Search users..."
                        className="w-full xl:max-w-lg"
                        size="middle"
                    />

                    <Space wrap>
                        <Button
                            onClick={handleRefetch}
                            icon={<FcRefresh className="text-blue-500" />}
                            className="flex items-center gap-2 hover:border-blue-500"
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
                                className="flex items-center gap-2 hover:border-blue-500"
                            >
                                Columns
                            </Button>
                        </Dropdown>

                        <PrintDropdownComponent
                            stateData={data}
                            buttonProps={{
                                className: "flex items-center gap-2 hover:border-blue-500",
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
                        tip="Loading user data..."
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
                <Table<User>
                    size="small"
                    columns={filteredColumns}
                    dataSource={displayedData}
                    className="admin-users-table overflow-hidden rounded-md border border-gray-200"
                    bordered={false}
                    scroll={{ x: "max-content" }}
                    rowKey="id"
                    pagination={{
                        showSizeChanger: true,
                        showQuickJumper: true,
                        pageSizeOptions: ['10', '20', '50', '100'],
                        defaultPageSize: 20,
                        className: "px-4 py-2",
                        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} users`,
                    }}
                    locale={{
                        emptyText: (
                            <div className="py-8 flex flex-col items-center">
                                <UserOutlined className="text-3xl text-gray-400 mb-2" />
                                <p className="text-gray-500 mb-4">No users found</p>
                                <Button
                                    type="primary"
                                    className="mt-2"
                                    onClick={() => handleTrack()}
                                    icon={<AiOutlinePlus />}
                                >
                                    Add First User
                                </Button>
                            </div>
                        )
                    }}
                />
            )}
        </Card>
    );
}
