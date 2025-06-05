import { CheckCircleOutlined, HomeOutlined, LoadingOutlined, SettingOutlined } from "@ant-design/icons";
import { useNavigate } from "@remix-run/react";
import {
  Alert,
  Breadcrumb,
  Button,
  Checkbox,
  Col,
  Divider,
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
  TableProps,
  Tag,
} from "antd";
import { useEffect, useState } from "react";
import {
  AiOutlineCloseCircle,
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlineFileExclamation,
  AiOutlinePhone,
  AiOutlinePlus,
  AiOutlineSend,
} from "react-icons/ai";
import { FcRefresh, FcSearch } from "react-icons/fc";
import { Link } from "react-router-dom";
import PrintDropdownComponent from "~/components/print_dropdown";
import { SupplierService } from "~/services/supplier.service";
import { Supplier } from "~/types/supplier.type";


export default function SuppliersRoutes() {
  const [data, setData] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(true);
  const [isTitle, setIsTitle] = useState('');
  const [form] = Form.useForm<Supplier>();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState<Supplier[]>([]);

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
    setIsTitle('Create Supplier')
  };

  // Edit record
  const editRecord = (record: Supplier) => {
    setIsEditMode(true);
    form.setFieldsValue(record);
    setEditingId(record.id);
    setIsModalOpen(true);
    setIsTitle('Update Supplier')
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleDeleteButton = async (record: Supplier) => {
    if (record.status_labels.name === 'Active') {
      const { error } = await SupplierService.deactivateStatus(
        record.id,
        record
      );

      if (error) throw message.error(error.message);
      message.success("Record deactivated successfully");
      fetchData();
    } else if (record.status_labels.name === 'Inactive') {
      const { error } = await SupplierService.activateStatus(
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
      const dataFetch = await SupplierService.getAllPosts();
      setData(dataFetch); // Works in React state
    } catch (error) {
      message.error("error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchText.trim() === '') {
      fetchData();
    } else {
      const filtered = data.filter(data =>
        data.name?.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredData(filtered);
    }

  }, [searchText]); // Empty dependency array means this runs once on mount

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
        const { error } = await SupplierService.updatePost(editingId, values);

        if (error) throw message.error(error.message);
        message.success("Record updated successfully");
      } else {
        // Create new record
        setLoading(true);
        const { error } = await SupplierService.createPost(allValues);

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
    "Name": true,
    "Product Key": false,
    "Expiration Date": true,
    "Licensed to Email": true,
    "Licensed to Name": true,
    "Manufacturer": true,
    "Min QTY": true,
    "Total": true,
    "Avail": false,
    "Status": true,
    "Actions": true,
  });

  const columns: TableColumnsType<Supplier> = [
    {
      title: "Name",
      dataIndex: "name",
      width: 120,
    },
    {
      title: "Product Key",
      dataIndex: "product_key",
      width: 120,
    },
    {
      title: "Expiration Date",
      dataIndex: "expiration_date",
      width: 120,
    },
    {
      title: "Licensed to Email",
      dataIndex: "licensed_to_email",
      width: 120,
    },
    {
      title: "Licensed to Name",
      dataIndex: "licensed_to_name",
      width: 120,
    },
    {
      title: "Manufacturer",
      dataIndex: "manufacturer",
      width: 120,
    },
    {
      title: "Min QTY",
      dataIndex: "min_qty",
      width: 120,
    },
    {
      title: "Total",
      dataIndex: "total",
      width: 120,
    },
    {
      title: "Avail",
      dataIndex: "avail",
      width: 120,
    },
    {
      title: "Status",
      dataIndex: "status",
      width: 120,
      render: (_, record) => {
        if (record.id === 1) {
          return (
            <Tag color="green">
              <CheckCircleOutlined className="float-left mt-1 mr-1" /> Active
            </Tag>
          );
        } else if (record.id === 2) {
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
            description="Are you sure to update this department?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => editRecord(record)}
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
            title="Do you want to delete?"
            description="Are you sure to delete this supplier?"
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

  const onChange: TableProps<Supplier>["onChange"] = (
    pagination,
    filters,
    sorter,
    extra
  ) => {
    console.log("params", pagination, filters, sorter, extra);
  };

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
              title: "Settings",
            },
            {
              title: "Suppliers",
            },
          ]}
        />
        <Space wrap>
          <Link to={"deleted-supplier"}>
            <Button icon={<AiOutlineFileExclamation />} type="primary" danger>
              Show Deleted Suppliers
            </Button>
          </Link>

          <Button onClick={() => handleTrack()} icon={<AiOutlinePlus />} type="primary">
            Create Supplier
          </Button>
          <Modal
            style={{ top: 20 }}
            width={700}
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
                      <Input
                        type="number"
                        prefix={<AiOutlinePhone />}
                        placeholder="Phone"
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
        </Space>
      </div>
      <div className="flex justify-between">
        <Alert
          message="Note: This is the list of all suppliers. Please check closely."
          type="info"
          showIcon
        />
        <Space direction="horizontal">
          <Space.Compact style={{ width: "100%" }}>
            <Input.Search onChange={(e) => setSearchText(e.target.value)} placeholder="Search" />
          </Space.Compact>
          <Space wrap>
            <Button onClick={handleRefetch} icon={<FcRefresh />} type="default">
              Refresh
            </Button>
          </Space>
          <Space wrap>
            <Dropdown
              menu={{ items: columnMenuItems }}
              placement="bottomRight"
              trigger={['click']}
            >
              <Button icon={<SettingOutlined />}>Columns</Button>
            </Dropdown>
            <PrintDropdownComponent stateData={data}></PrintDropdownComponent>
          </Space>
        </Space>
      </div>
      {loading && <Spin></Spin>}
      {!loading && (
        <Table<Supplier>
          size="small"
          columns={filteredColumns}
          dataSource={searchText ? filteredData : data}
          onChange={onChange}
          className="pt-5"
          bordered
          scroll={{ x: "max-content" }}
        />
      )}
    </div>
  );
}
