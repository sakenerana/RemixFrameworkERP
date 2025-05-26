import {
  CheckCircleOutlined,
  HomeOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { useNavigate } from "@remix-run/react";
import { User } from "@supabase/supabase-js";
import {
  Alert,
  Breadcrumb,
  Button,
  Col,
  Divider,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Row,
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
  AiOutlinePlus,
  AiOutlineSend,
} from "react-icons/ai";
import { FcRefresh, FcSearch } from "react-icons/fc";
import { Link } from "react-router-dom";
import PrintDropdownComponent from "~/components/print_dropdown";
import { GroupService } from "~/services/groups.service";
import { Groups } from "~/types/groups.type";

export default function GroupsRoutes() {
  const [data, setData] = useState<Groups[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm<Groups>();
  const [editingId, setEditingId] = useState<number | null>(null);

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
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleDeleteButton = async (record: Groups) => {
    if (record.status_labels.name === 'Active') {
      const { error } = await GroupService.deactivateStatus(record.id, record);

      if (error) throw error;
      message.success("Record deactivated successfully");
      fetchData();
    } else if (record.status_labels.name === 'Inactive') {
      const { error } = await GroupService.activateStatus(record.id, record);

      if (error) throw error;
      message.success("Record activated successfully");
      fetchData();
    }
  };

  // Fetch data from Supabase
  const fetchData = async () => {
    try {
      setLoading(true);
      const dataFetch = await GroupService.getAllPosts();
      setData(dataFetch); // Works in React state
    } catch (error) {
      message.error("error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // Empty dependency array means this runs once on mount

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
        const { error } = await GroupService.updatePost(editingId, values);

        if (error) throw error;
        message.success("Record updated successfully");
      } else {
        // Create new record
        setLoading(true);
        const { error } = await GroupService.createPost(allValues);

        if (error) throw error;
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

  // Edit record
  const editRecord = (record: Groups) => {
    form.setFieldsValue(record);
    setEditingId(record.id);
    setIsModalOpen(true);
    console.log("Record", record.id);
  };

  const columns: TableColumnsType<Groups> = [
    {
      title: "Group Name",
      dataIndex: "group",
      width: 120,
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
            description="Are you sure to update this group?"
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
            description="Are you sure to delete this group?"
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

  const onChange: TableProps<Groups>["onChange"] = (
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
              href: "/admin",
              title: <HomeOutlined />,
            },
            {
              title: "Admin",
            },
            {
              title: "Groups",
            },
          ]}
        />
        <Space wrap>
          <Button
            onClick={() => handleTrack()}
            icon={<AiOutlinePlus />}
            type="primary"
          >
            Create Group
          </Button>
        </Space>
        <Modal
          style={{ top: 20 }}
          width={420}
          title="Create Group"
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
                <Col xs={24} sm={24}>
                  <Form.Item
                    label="Group Name"
                    name="group"
                    rules={[
                      {
                        required: true,
                        message: "Please input group!",
                      },
                    ]}
                  >
                    <Input placeholder="Group Name" />
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
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Modal>
      </div>
      <div className="flex justify-between">
        <Alert
          message="Note: This is the list of all groups. Please check closely."
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
            <PrintDropdownComponent></PrintDropdownComponent>
          </Space>
        </Space>
      </div>
      {loading && <Spin></Spin>}
      {!loading && (
        <Table<Groups>
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
