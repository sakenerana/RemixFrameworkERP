import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  HomeOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { useNavigate } from "@remix-run/react";
import {
  Alert,
  Breadcrumb,
  Button,
  Checkbox,
  Dropdown,
  Input,
  MenuProps,
  Space,
  Spin,
  Table,
  TableColumnsType,
  TableProps,
  Tag,
} from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  AiOutlineCheckCircle,
  AiOutlineLike,
  AiOutlinePlus,
} from "react-icons/ai";
import { FcRefresh, FcSearch } from "react-icons/fc";
import { Link } from "react-router-dom";
import PrintDropdownComponent from "~/components/print_dropdown";

interface DataType {
  id: number;
  title: string;
  body: string;
  userId?: number; // Optional property
  amount: number;
}

export default function BudgetTransactions() {
  const [data, setData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // DUMMY DATA
  const value = 123412;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "PHP",
    }).format(amount);
  };

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

  // State for column visibility
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({
    "Process ID": true,
    "Date": true,
    "Transaction Type": true,
    "Status": true,
    "Amount": true,
  });

  const columns: TableColumnsType<DataType> = [
    {
      title: "Process ID",
      dataIndex: "process_id",
      width: 120,
      render: () => <div>123</div>,
    },
    {
      title: "Date",
      dataIndex: "date",
      width: 120,
      render: () => <div>test</div>,
    },
    {
      title: "Transaction Type",
      dataIndex: "transaction_type",
      width: 120,
      render: () => <div>Liquidation</div>,
    },
    {
      title: "Status",
      dataIndex: "status",
      width: 120,
      render: (_, value) => {
        if (value.id === 1) {
          return (
            <Tag color="#389e0d">
              <CheckCircleOutlined className="float-left mt-1 mr-1" /> End
            </Tag>
          );
        } else if (value.id === 2) {
          return (
            <Tag color="#f75b00">
              <ClockCircleOutlined className="float-left mt-1 mr-1" /> Pending
            </Tag>
          );
        } else if (value.id === 3) {
          return (
            <Tag color="#1677ff">
              <AiOutlineLike className="float-left mt-1 mr-1" /> Approved
            </Tag>
          );
        }
      },
    },
    {
      title: "Amount",
      dataIndex: "amount",
      width: 120,
      render: () => <div className="text-end">{formatCurrency(1241)}</div>,
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
              title: "Budget",
            },
            {
              title: "Transactions",
            },
          ]}
        />
      </div>
      <div className="flex justify-between">
        <Alert
          message="Note: This is the list of all transactions. Please check closely."
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
    </div>
  );
}
