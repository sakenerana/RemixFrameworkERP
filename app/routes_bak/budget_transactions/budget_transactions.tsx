import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  HomeOutlined,
  InboxOutlined,
  LoadingOutlined,
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
import { useEffect, useMemo, useState } from "react";
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
  const [isUserID, setUserID] = useState<any>();
  const [isDepartmentID, setDepartmentID] = useState<any>();

  const navigate = useNavigate();

  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState<any[]>([]);

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

  useMemo(() => {
    setUserID(localStorage.getItem('userAuthID'));
    setDepartmentID(localStorage.getItem('userDept'));
  }, []);

  useEffect(() => {
    if (searchText.trim() === '') {
      fetchData();
    } else {
      const filtered = data.filter(data =>
        data.title?.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }, [searchText]); // Empty dependency array means this runs once on mount

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
    <div className="w-full px-6 py-4 rounded-lg shadow-sm">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <Breadcrumb
            items={[
              {
                href: "/budget",
                title: <HomeOutlined className="text-gray-400" />,
              },
              {
                title: <span>Budget</span>,
              },
              {
                title: <span className="text-blue-600 font-medium">Transactions</span>,
              },
            ]}
            className="text-sm"
          />
        </div>
        
      </div>

      {/* Toolbar Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6 rounded-lg">
        <Alert
          message="This is the list of all transactions. Please review carefully."
          type="info"
          showIcon
          className="w-full lg:w-auto"
        />

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto">
          <Input.Search
            allowClear
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search transactions..."
            className="w-full sm:w-64"
            size="middle"
          />

          <Space>
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
                className: "shadow-lg rounded-md min-w-[200px]"
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
            tip="Loading transactions..."
            indicator={<LoadingOutlined style={{ fontSize: 36 }} spin />}
          />
        </div>
      ) : (
        <Table<DataType>
          size="middle"
          columns={filteredColumns}
          dataSource={searchText ? filteredData : data}
          onChange={onChange}
          className="shadow-sm rounded-lg overflow-hidden"
          bordered
          scroll={{ x: "max-content" }}
          rowKey="id"
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            defaultPageSize: 20,
            className: "px-4 py-2",
            showTotal: (total) => `Total ${total} transactions`,
          }}
          locale={{
            emptyText: (
              <div className="py-8 flex flex-col items-center">
                <InboxOutlined className="text-3xl text-gray-400 mb-2" />
                <p className="text-gray-500 mb-4">No transactions found</p>
                {/* <Button
                  type="primary"
                  className="mt-2"
                  onClick={() => navigate('/transactions/new')}
                  icon={<AiOutlinePlus />}
                >
                  Create First Transaction
                </Button> */}
              </div>
            )
          }}
        />
      )}
    </div>
  );
}
