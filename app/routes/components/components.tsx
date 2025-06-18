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
  AiOutlineExport,
  AiOutlineFileExclamation,
  AiOutlineImport,
  AiOutlinePlus,
  AiOutlineSend,
} from "react-icons/ai";
import { FcRefresh, FcSearch } from "react-icons/fc";
import { Link } from "react-router-dom";
import PrintDropdownComponent from "~/components/print_dropdown";
import { ComponentService } from "~/services/component.service";
import { Component } from "~/types/component.type";

export default function ComponentsRoute() {
  const [data, setData] = useState<Component[]>([]);
  const [loading, setLoading] = useState(false);

  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState<Component[]>([]);

  const navigate = useNavigate();

  const handleRefetch = async () => {
    setLoading(true);
    await fetchData();
    setLoading(false);
  };

  // Edit record
  const editRecord = (record: Component) => {
    navigate(`form-component/${record.id}`);
  };

  const handleDeactivateButton = async (record: Component) => {
    const { error } = await ComponentService.deactivateStatus(
      record.id,
      record
    );

    if (error) throw message.error(error.message);
    message.success("Record deactivated successfully");
    fetchData();
  };

  // Fetch data from Supabase
  const fetchData = async () => {
    try {
      setLoading(true);
      const dataFetch = await ComponentService.getAllPosts();
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

  const handleCheckinButton = () => { };

  const handleCheckoutButton = () => { };

  // State for column visibility
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({
    "Name": true,
    "Asset Category": true,
    "Company": false,
    "Model No.": false,
    "Manufacturer": false,
    "Supplier": false,
    "Location": true,
    "Min. QTY": true,
    "Total": true,
    "Avail": false,
    "Checked Out": false,
    "Purchase Date": false,
    "Purchase Cost": true,
    "Order Number": false,
    "Notes": false,
    "Status": true,
    "Actions": true,
    "Checkout": true,
  });

  const columns: TableColumnsType<Component> = [
    {
      title: "Name",
      dataIndex: "name",
      width: 120,
      render: (text) => text || 'N/A'
    },
    {
      title: "Asset Category",
      dataIndex: "categories",
      width: 120,
      render: (categories) => categories?.name || 'N/A'
    },
    {
      title: "Company",
      dataIndex: "companies",
      width: 120,
      render: (companies) => companies?.name || 'N/A'
    },
    {
      title: "Model No.",
      dataIndex: "model_no",
      width: 120,
      render: (text) => text || 'N/A'
    },
    {
      title: "Manufacturer",
      dataIndex: "manufacturers",
      width: 120,
      render: (manufacturers) => manufacturers?.name || 'N/A'
    },
    {
      title: "Supplier",
      dataIndex: "suppliers",
      width: 120,
      render: (suppliers) => suppliers?.name || 'N/A'
    },
    {
      title: "Location",
      dataIndex: "locations",
      width: 120,
      render: (locations) => locations?.name || 'N/A'
    },
    {
      title: "Min. QTY",
      dataIndex: "min_qty",
      width: 120,
      render: (text) => text || 'N/A'
    },
    {
      title: "Total",
      dataIndex: "qty",
      width: 120,
      render: (text) => text || 'N/A'
    },
    {
      title: "Avail",
      dataIndex: "total",
      width: 120,
      render: (text) => text || 'N/A'
    },
    {
      title: "Checked Out",
      dataIndex: "checked_out",
      width: 120,
      render: (text) => text || 'N/A'
    },
    {
      title: "Purchase Date",
      dataIndex: "purchase_date",
      width: 120,
      render: (text) => text || 'N/A'
    },
    {
      title: "Purchase Cost",
      dataIndex: "purchase_cost",
      width: 120,
      render: (text) => text || 'N/A'
    },
    {
      title: "Order Number",
      dataIndex: "order_no",
      width: 120,
      render: (text) => text || 'N/A'
    },
    {
      title: "Notes",
      dataIndex: "notes",
      width: 120,
      render: (text) => text || 'N/A'
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
      width: 190,
      fixed: "right",
      render: (_, record) => (
        <div className="flex">
          <Popconfirm
            title="Do you want to update?"
            description="Are you sure to update this component?"
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
            title="Do you want to deactivate?"
            description="Are you sure to deactivate this component?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDeactivateButton(record)}
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
    {
      title: "Checkout",
      dataIndex: "checkout",
      width: 120,
      fixed: "right",
      render: (_, data) => (
        <div>
          {data.check_status == "checkin" ? (
            <Popconfirm
              title="Do you want to checkin?"
              description="Are you sure to checkin this request?"
              okText="Yes"
              cancelText="No"
              onConfirm={() => handleCheckinButton()}
            >
              <Tag
                className="cursor-pointer"
                icon={<AiOutlineImport className="float-left mt-1 mr-1" />}
                color="#108ee9"
              >
                {data.check_status}
              </Tag>
            </Popconfirm>
          ) : (
            <Popconfirm
              title="Do you want to checkout?"
              description="Are you sure to checkout this request?"
              okText="Yes"
              cancelText="No"
              onConfirm={() => handleCheckoutButton()}
            >
              <Tag
                className="cursor-pointer"
                icon={<AiOutlineExport className="float-left mt-1 mr-1" />}
                color="#f50"
              >
                {data.check_status}
              </Tag>
            </Popconfirm>
          )}
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
  const columnMenuItems: MenuProps['items'] = [
    {
      type: 'group',
      label: 'Select Column for Visibility',
      children: [
        // Split into two columns
        {
          key: 'column-group-1',
          style: { display: 'inline-block', width: '50%' },
          label: (
            <div>
              {Object.keys(columnVisibility)
                .slice(0, Math.ceil(Object.keys(columnVisibility).length / 2))
                .map(columnTitle => (
                  <div key={columnTitle} style={{ padding: '4px 0' }}>
                    <Checkbox
                      checked={columnVisibility[columnTitle]}
                      onChange={() => toggleColumn(columnTitle)}
                    >
                      {columnTitle}
                    </Checkbox>
                  </div>
                ))}
            </div>
          ),
        },
        {
          key: 'column-group-2',
          style: { display: 'inline-block', width: '50%' },
          label: (
            <div>
              {Object.keys(columnVisibility)
                .slice(Math.ceil(Object.keys(columnVisibility).length / 2))
                .map(columnTitle => (
                  <div key={columnTitle} style={{ padding: '4px 0' }}>
                    <Checkbox
                      checked={columnVisibility[columnTitle]}
                      onChange={() => toggleColumn(columnTitle)}
                    >
                      {columnTitle}
                    </Checkbox>
                  </div>
                ))}
            </div>
          ),
        },
      ],
    },
  ];

  // Filter columns based on visibility
  const filteredColumns = columns.filter(column =>
    column.title ? columnVisibility[column.title.toString()] : true
  );

  const onChange: TableProps<Component>["onChange"] = (
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
              title: "Components",
            },
          ]}
        />
        <Space wrap>
          <Link to={"deleted-components"}>
            <Button icon={<AiOutlineFileExclamation />} danger>
              Show Inactive Components
            </Button>
          </Link>

          <Link to={"form-component"}>
            <Button icon={<AiOutlinePlus />} type="primary">
              Create Component
            </Button>
          </Link>
        </Space>
      </div>
      <div className="flex justify-between">
        <Alert
          message="Note: This is the list of all technology components. Please check closely."
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
        <Table<Component>
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
