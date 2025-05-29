import {
  CheckCircleOutlined,
  HomeOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import {
  Alert,
  Breadcrumb,
  Button,
  Checkbox,
  CheckboxOptionType,
  Col,
  Divider,
  Form,
  GetProp,
  Input,
  message,
  Modal,
  Popconfirm,
  Radio,
  Row,
  Select,
  Space,
  Spin,
  Table,
  TableColumnsType,
  TableProps,
  Tag,
} from "antd";
import { useEffect, useState } from "react";
import {
  AiOutlineCloseCircle,
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlineMail,
  AiOutlinePhone,
  AiOutlinePlus,
  AiOutlineSend,
  AiOutlineUser,
} from "react-icons/ai";
import { FcRefresh, FcSearch } from "react-icons/fc";
import { useAuth } from "~/auth/AuthContext";
import PrintDropdownComponent from "~/components/print_dropdown";
import { supabase } from "~/lib/supabase";
import { DepartmentService } from "~/services/department.service";
import { GroupService } from "~/services/groups.service";
import { UserService } from "~/services/user.service";
import { Department } from "~/types/department.type";
import { Groups } from "~/types/groups.type";
import { User } from "~/types/user.type";

export default function UsersRoutes() {
  const [data, setData] = useState<User[]>([]);
  const [dataDepartment, setDataDepartment] = useState<Department[]>([]);
  const [dataGroup, setDataGroup] = useState<Groups[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(true);
  const [isTitle, setIsTitle] = useState('');
  const [form] = Form.useForm<User>();
  const [editingId, setEditingId] = useState<number | null>(null);
  const { Option } = Select;
  const { signUp } = useAuth();

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

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleDeleteButton = async (record: User) => {
    if (record.status_labels.name === 'Active') {
      const { error } = await UserService.deactivateStatus(record.id, record);

      if (error) throw error;
      message.success("Record deactivated successfully");
      fetchData();
    } else if (record.status_labels.name === 'Inactive') {
      const { error } = await UserService.activateStatus(record.id, record);

      if (error) throw error;
      message.success("Record activated successfully");
      fetchData();
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

  useEffect(() => {
    fetchData();
    fetchDataDepartment();
    fetchDataGroup();
  }, []); // Empty dependency array means this runs once on mount

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

        const { data, error } = await signUp(values.email, values.password);
        setLoading(false);
        console.log("DATA PLEASE", data)
        if (error) throw message.error(error.message);

        try {
          setLoading(true);
          // Include your extra field
          const allValues = {
            ...values,
            status_id: 1,
            auth_id: data?.user?.id
          };
          console.log("DATA PLEASE 2 PLEASE 2", data)
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

  const columns: TableColumnsType<User> = [
    {
      title: "Name",
      dataIndex: "name",
      width: 120,
      render: (_, record) => (
        <p>{record.first_name} {record.middle_name} {record.last_name}</p>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      width: 120,
    },
    {
      title: "Phone",
      dataIndex: "phone",
      width: 120,
    },
    {
      title: "Department",
      dataIndex: "department",
      width: 120,
      render: (_, record) => (
        <>
          <p>{record.departments.department}</p>
        </>
      )
    },
    {
      title: "Status",
      dataIndex: "status",
      width: 120,
      render: (_, record) => {
        if (record.status_labels.name === 'Active') {
          return (
            <Tag color="green">
              <CheckCircleOutlined className="float-left mt-1 mr-1" /> Active
            </Tag>
          );
        } else if (record.status_labels.name === 'Inactive') {
          return (
            <Tag color="red">
              <AiOutlineCloseCircle className="float-left mt-1 mr-1" /> Inactive
            </Tag>
          );
        }
      },
    },
    {
      title: "Actions",
      dataIndex: "actions",
      width: 120,
      fixed: "right",
      render: (_, record) => (
        <div className="flex">
          <Popconfirm
            title="Do you want to update?"
            description="Are you sure to update this user?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => editRecord(record)}
          >
            <Tag
              className="cursor-pointer"
              icon={<AiOutlineEdit className="float-left mt-1 mr-1" />}
              color="#f7b63e"
            >
              Profile
            </Tag>
          </Popconfirm>
          <Popconfirm
            title="Do you want to deactivate?"
            description="Are you sure to deactivate this user?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDeleteButton(record)}
          >
            {record.status_labels.name === 'Active' && (
              <Tag
                className="cursor-pointer"
                icon={<AiOutlineDelete className="float-left mt-1 mr-1" />}
                color="#f50"
              >
                Deactivate
              </Tag>
            )}
            {record.status_labels.name === 'Inactive' && (
              <Tag
                className="cursor-pointer"
                icon={<AiOutlineDelete className="float-left mt-1 mr-1" />}
                color="#1677ff"
              >
                Activate
              </Tag>
            )}
          </Popconfirm>
        </div>
      ),
    },
  ];

  const onChange: TableProps<User>["onChange"] = (
    pagination,
    filters,
    sorter,
    extra
  ) => {
    // console.log("params", pagination, filters, sorter, extra);
  };

  const onChangeAccess: GetProp<typeof Checkbox.Group, "onChange"> = (
    checkedValues
  ) => {
    // console.log("checked = ", checkedValues);
  };

  const optionsOffice: CheckboxOptionType<any>[] = [
    { label: "Main Office", value: 1 },
    { label: "Branch Office", value: 2 },
  ];

  const options: CheckboxOptionType<any>[] = [
    { label: "Inventory Management", value: 1 },
    { label: "Budget Tracker", value: 2 },
    { label: "Workflow Tracker", value: 3 },
    { label: "Admin Panel", value: 4 },
  ];

  const optionsPermission: CheckboxOptionType<any>[] = [
    { label: "Create", value: 1 },
    { label: "Update", value: 2 },
    { label: "Delete", value: 3 },
    { label: "View", value: 4 },
  ];

  return (
    <div>
      <div className="flex pb-5 justify-between">
        <Breadcrumb
          items={[
            {
              href: "/inventory",
              title: <HomeOutlined />,
            },
            {
              title: "Admin",
            },
            {
              title: "Users",
            },
          ]}
        />
        <Space wrap>
          {/* <Link to={"deleted-user"}>
            <Button icon={<AiOutlineUserDelete />} type="primary" danger>
              Show Inactive Users
            </Button>
          </Link> */}
          <Button
            onClick={() => handleTrack()}
            icon={<AiOutlinePlus />}
            type="primary"
          >
            Create User
          </Button>
        </Space>
        <Modal
          style={{ top: 20 }}
          width={900}
          title={isTitle}
          closable={{ "aria-label": "Custom Close Button" }}
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          footer=""
        >
          <div>
            <Form
              className="mt-5"
              form={form}
              layout="vertical"
              onFinish={onFinish}
              initialValues={{
                notification: true,
                interests: ["sports", "music"],
              }}
            >
              <Row gutter={24}>
                <Col xs={24} sm={8}>
                  <Form.Item
                    label="First Name"
                    name="first_name"
                    rules={[
                      {
                        required: true,
                        message: "Please input account first name!",
                      },
                    ]}
                  >
                    <Input placeholder="First Name" />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={8}>
                  <Form.Item
                    label="Middle Name"
                    name="middle_name"
                  // rules={[
                  //   {
                  //     required: true,
                  //     message: "Please input middle name!",
                  //   },
                  // ]}
                  >
                    <Input placeholder="Middle Name" />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={8}>
                  <Form.Item
                    label="Last Name"
                    name="last_name"
                    rules={[
                      {
                        required: true,
                        message: "Please input last name!",
                      },
                    ]}
                  >
                    <Input placeholder="Last Name" />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={8}>
                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      {
                        required: true,
                        message: "Please input email!",
                      },
                    ]}
                  >
                    <Input prefix={<AiOutlineMail />} disabled={isEditMode} placeholder="Email" />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={8}>
                  <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: "Please input password!",
                      },
                    ]}
                  >
                    <Input.Password disabled={isEditMode} placeholder="Password" />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={8}>
                  <Form.Item
                    label="Phone No."
                    name="phone"
                    rules={[
                      {
                        required: true,
                        message: "Please input phone number!",
                      },
                    ]}
                  >
                    <Input
                      type="number"
                      prefix={<AiOutlinePhone />}
                      placeholder="Phone"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={8}>
                  <Form.Item
                    label="Username"
                    name="username"
                    rules={[
                      {
                        required: true,
                        message: "Please select username!",
                      },
                    ]}
                  >
                    <Input
                      prefix={<AiOutlineUser />}
                      placeholder="Username"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={8}>
                  <Form.Item
                    label="Department"
                    name="department_id"
                    rules={[
                      {
                        required: true,
                        message: "Please select department type!",
                      },
                    ]}
                  >
                    <Select placeholder="Select department">
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
                    label="Group"
                    name="group_id"
                    rules={[
                      {
                        required: true,
                        message: "Please select group type!",
                      },
                    ]}
                  >
                    <Select placeholder="Select group">
                      {dataGroup.map((item: Groups) => (
                        <Option key={item.id} value={item.id}>
                          {item.group}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Divider />
              <Row gutter={24}>
                <Col xs={24} sm={24}>
                  <Form.Item
                    label="Office"
                    name="office_id"
                    rules={[
                      {
                        required: true,
                        message: "Please select branch office!",
                      },
                    ]}
                  >
                    <Radio.Group
                      options={optionsOffice}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col xs={24} sm={24}>
                  <Form.Item
                    label="User Access"
                    name="access"
                    rules={[
                      {
                        required: true,
                        message: "Please select user access!",
                      },
                    ]}
                  >
                    <Checkbox.Group
                      options={options}
                      onChange={onChangeAccess}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={24}>
                <Col xs={24} sm={24}>
                  <Form.Item
                    label="Permission"
                    name="permissions"
                    rules={[
                      {
                        required: true,
                        message: "Please select user access!",
                      },
                    ]}
                  >
                    <Checkbox.Group
                      options={optionsPermission}
                      onChange={onChangeAccess}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Divider />

              <Form.Item className="flex flex-wrap justify-end">
                <Button
                  onClick={onReset}
                  type="default"
                  //   loading={loading}
                  className="w-full sm:w-auto mr-4"
                  size="large"
                >
                  Reset
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={
                    <>
                      {loading && <LoadingOutlined className="animate-spin" />}
                      {!loading && <AiOutlineSend />}
                    </>
                  }
                  //   loading={loading}
                  className="w-full sm:w-auto"
                  size="large"
                >
                  {isEditMode && <p>Update</p>}
                  {!isEditMode && <p>Submit</p>}
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Modal>
      </div>
      <div className="flex justify-between">
        <Alert
          message="Note: This is the list of all users. Please check closely."
          type="info"
          showIcon
        />
        <Space direction="horizontal">
          <Space.Compact style={{ width: "100%" }}>
            <Input placeholder="Search" />
            <Button icon={<FcSearch />} type="default">
              Search
            </Button>
          </Space.Compact>
          <Space wrap>
            <Button onClick={handleRefetch} icon={<FcRefresh />} type="default">
              Refresh
            </Button>
          </Space>
          <Space wrap>
            <PrintDropdownComponent stateData={data}></PrintDropdownComponent>
          </Space>
        </Space>
      </div>
      {loading && <Spin></Spin>}
      {!loading && (
        <Table<User>
          size="small"
          columns={columns}
          dataSource={data}
          onChange={onChange}
          className="pt-5"
          bordered
          scroll={{ x: "max-content" }}
        />
      )}

    </div>
  );
}
