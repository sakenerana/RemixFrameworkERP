import { HomeOutlined, SettingOutlined, SmileOutlined } from "@ant-design/icons";
import { useNavigate } from "@remix-run/react";
import {
  Alert,
  Breadcrumb,
  Button,
  Checkbox,
  Dropdown,
  Input,
  MenuProps,
  Modal,
  Popconfirm,
  Space,
  Spin,
  Table,
  TableColumnsType,
  TableProps,
  Tag,
  Timeline,
} from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { AiFillProfile } from "react-icons/ai";
import { FcRefresh, FcSearch } from "react-icons/fc";
import PrintDropdownComponent from "~/components/print_dropdown";

interface DataType {
  id: number;
  title: string;
  body: string;
  userId?: number; // Optional property
}

export default function WorkflowTracker() {
  const [data, setData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRefetch = async () => {
    setLoading(true);
    await fetchData();
    setLoading(false);
  };

  const fetchData = async () => {
    try {
      const response = await axios
        .get<DataType[]>("https://jsonplaceholder.typicode.com/posts") // Specify response type
        .then((response) => {
          setData(response.data);
          setLoading(false);
        })
        .catch((error) => {
          setError(error.message);
          setLoading(false);
        });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // Empty dependency array means this runs once on mount

  const handleTrack = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // State for column visibility
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({
    "Name": true,
    "Product Key": true,
    "Actions": true,
  });

  const columns: TableColumnsType<DataType> = [
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
      title: "Actions",
      dataIndex: "actions",
      width: 160,
      fixed: "right",
      render: () => (
        <div className="flex">
          <Popconfirm
            title="Do you want to view?"
            description="Are you sure to view this workflows?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleTrack()}
          >
            <Tag
              className="cursor-pointer"
              icon={<AiFillProfile className="float-left mt-1 mr-1" />}
              color="#1677ff"
            >
              Track Workflow
            </Tag>
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

  const onChange: TableProps<DataType>["onChange"] = (
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
              href: "/workflow",
              title: <HomeOutlined />,
            },
            {
              title: "Tracker",
            },
          ]}
        />
      </div>
      <div className="flex justify-between">
        <Alert
          message="Note: This is the list of all requested workflows. Please check closely."
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
        <Table<DataType>
          size="small"
          columns={filteredColumns}
          dataSource={data}
          onChange={onChange}
          className="pt-5"
          bordered
          scroll={{ x: "max-content" }}
        />
      )}
      <Modal
        style={{ top: 20 }}
        title="Workflow Tracker"
        closable={{ "aria-label": "Custom Close Button" }}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer=""
      >
        {loading && <Spin></Spin>}
        {!loading && (
          <Timeline
            className="pt-4"
            items={[
              {
                color: "green",
                children: "Create a services site 2015-09-01",
              },
              {
                color: "green",
                children: "Create a services site 2015-09-01",
              },
              {
                color: "red",
                children: (
                  <>
                    <p>Solve initial network problems 1</p>
                    <p>Solve initial network problems 2</p>
                    <p>Solve initial network problems 3 2015-09-01</p>
                  </>
                ),
              },
              {
                children: (
                  <>
                    <p>Technical testing 1</p>
                    <p>Technical testing 2</p>
                    <p>Technical testing 3 2015-09-01</p>
                  </>
                ),
              },
              {
                color: "gray",
                children: (
                  <>
                    <p>Technical testing 1</p>
                    <p>Technical testing 2</p>
                    <p>Technical testing 3 2015-09-01</p>
                  </>
                ),
              },
              {
                color: "gray",
                children: (
                  <>
                    <p>Technical testing 1</p>
                    <p>Technical testing 2</p>
                    <p>Technical testing 3 2015-09-01</p>
                  </>
                ),
              },
              {
                color: "#00CCFF",
                dot: <SmileOutlined />,
                children: <p>Custom color testing</p>,
              },
            ]}
          />
        )}
      </Modal>
    </div>
  );
}
