import { HomeOutlined, LoadingOutlined } from "@ant-design/icons";
import { useNavigate } from "@remix-run/react";
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
  InputNumber,
  message,
  Modal,
  Popconfirm,
  Row,
  Select,
  Space,
  Table,
  TableColumnsType,
  TableProps,
  Tag,
} from "antd";
import { useState } from "react";
import {
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlinePhone,
  AiOutlinePlus,
  AiOutlineSend,
  AiOutlineUserDelete,
} from "react-icons/ai";
import { FcRefresh, FcSearch } from "react-icons/fc";
import { Link } from "react-router-dom";
import PrintDropdownComponent from "~/components/print_dropdown";
import { User } from "~/types/user.type";

export default function UsersRoutes() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm<User>();

  const data: User[] = [
    // {
    //   key: "1",
    //   first_name: "John Brown",
    //   middle_name: "Black",
    //   last_name: "Gray",
    //   email: "test",
    //   phone_no: "09553713233",
    //   department: "test",
    //   group: "test",
    //   actions: "test",
    // },
  ];

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
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleUpdateButton = () => {
    navigate("update-user");
  };

  const handleDeleteButton = () => {};

  const columns: TableColumnsType<User> = [
    {
      title: "Name",
      dataIndex: "name",
      width: 120,
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
    },
    {
      title: "Actions",
      dataIndex: "actions",
      width: 120,
      fixed: "right",
      render: () => (
        <div className="flex">
          <Popconfirm
            title="Do you want to update?"
            description="Are you sure to update this user?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleUpdateButton()}
          >
            <Tag
              className="cursor-pointer"
              icon={<AiOutlineEdit className="float-left mt-1 mr-1" />}
              color="#f7b63e"
            >
              Update
            </Tag>
          </Popconfirm>
          <Popconfirm
            title="Do you want to deactivate?"
            description="Are you sure to deactivate this user?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDeleteButton()}
          >
            <Tag
              className="cursor-pointer"
              icon={<AiOutlineDelete className="float-left mt-1 mr-1" />}
              color="#f50"
            >
              Deactivate
            </Tag>
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
    console.log("params", pagination, filters, sorter, extra);
  };

  const onFinish = (values: User) => {
    setLoading(true);
    console.log("Form values:", values);
    // Simulate API call
    setTimeout(() => {
      message.success("Form submitted successfully!");
      setLoading(false);
    }, 1500);
  };

  const onChangeAccess: GetProp<typeof Checkbox.Group, "onChange"> = (
    checkedValues
  ) => {
    console.log("checked = ", checkedValues);
  };

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
          <Link to={"deleted-user"}>
            <Button icon={<AiOutlineUserDelete />} type="primary" danger>
              Show Inactive Users
            </Button>
          </Link>
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
          width={700}
          title="Create User & Permissions"
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

                <Col xs={24} sm={12}>
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
                    <Input placeholder="Email" />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
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
                    <Input.Password placeholder="Password" />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
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
                    <Input type="number" prefix={<AiOutlinePhone />} placeholder="Phone" />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Department"
                    name="department"
                    rules={[
                      {
                        required: true,
                        message: "Please select department type!",
                      },
                    ]}
                  >
                    <Select
                      placeholder="Select department"
                      options={[
                        { value: 1, label: "Jack" },
                        { value: 2, label: "Lucy" },
                        { value: 3, label: "yiminghe" },
                      ]}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Group"
                    name="group"
                    rules={[
                      {
                        required: true,
                        message: "Please select group type!",
                      },
                    ]}
                  >
                    <Select
                      placeholder="Select group"
                      options={[
                        { value: "user", label: "User" },
                        { value: "admin", label: "Admin" },
                      ]}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Divider />
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
                  Submit
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
            <Button icon={<FcRefresh />} type="default">
              Refresh
            </Button>
          </Space>
          <Space wrap>
            <PrintDropdownComponent></PrintDropdownComponent>
          </Space>
        </Space>
      </div>
      <Table<User>
        size="small"
        columns={columns}
        dataSource={data}
        onChange={onChange}
        className="pt-5"
        bordered
      />
    </div>
  );
}
