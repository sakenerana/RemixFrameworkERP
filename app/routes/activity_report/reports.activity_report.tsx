import { HomeOutlined, SettingOutlined } from "@ant-design/icons";
import {
  Alert,
  Breadcrumb,
  Button,
  Checkbox,
  Dropdown,
  Input,
  MenuProps,
  message,
  Space,
  Spin,
  Table,
  TableColumnsType,
  TableProps,
} from "antd";
import { useEffect, useState } from "react";
import { FcSearch } from "react-icons/fc";
import PrintDropdownComponent from "~/components/print_dropdown";
import { ActivityReport } from "~/types/activity_report.type";

export default function ActivityReportRoutes() {
  const [data, setData] = useState<ActivityReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState<ActivityReport[]>([]);

  // Fetch data from Supabase
  const fetchData = async () => {
    try {
      setLoading(true);
      // const dataFetch = await AssetService.getAllPosts();
      setData([]); // Works in React state
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
        // const filtered = data.filter(data =>
        //   data.name?.toLowerCase().includes(searchText.toLowerCase())
        // );
        // setFilteredData(filtered);
      }
  
    }, [searchText]); // Empty dependency array means this runs once on mount

  // State for column visibility
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({
    "Date": true,
    "Created By": true,
    "Action Type": true,
    "Type": true,
    "Item": true,
    "To": true,
    "Notes": true,
  });

  const columns: TableColumnsType<ActivityReport> = [
    {
      title: "Date",
      dataIndex: "date",
      width: 120
    },
    {
      title: "Created By",
      dataIndex: "created_by",
      width: 120
    },
    {
      title: "Action Type",
      dataIndex: "action_type",
      width: 120
    },
    {
      title: "Type",
      dataIndex: "type",
      width: 120
    },
    {
      title: "Item",
      dataIndex: "item",
      width: 120
    },
    {
      title: "To",
      dataIndex: "to",
      width: 120
    },
    {
      title: "Notes",
      dataIndex: "notes",
      width: 120
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

  const onChange: TableProps<ActivityReport>["onChange"] = (
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
              title: "Reports",
            },
            {
              title: "Activity Report",
            },
          ]}
        />
      </div>
      <div className="flex justify-between">
        <Alert
          message="Note: This is the list of all activity report. Please check closely."
          type="info"
          showIcon
        />
        <Space direction="horizontal">
          <Space.Compact style={{ width: "100%" }}>
            <Input.Search onChange={(e) => setSearchText(e.target.value)} placeholder="Search" />
          </Space.Compact>
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
        <Table<ActivityReport>
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
