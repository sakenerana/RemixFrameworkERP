import { CheckCircleOutlined, HomeOutlined, LoadingOutlined, SettingOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "@remix-run/react";
import {
  Alert,
  Breadcrumb,
  Button,
  Checkbox,
  Dropdown,
  Input,
  MenuProps,
  message,
  Popconfirm,
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
} from "react-icons/ai";
import { FcRefresh } from "react-icons/fc";
import PrintDropdownComponent from "~/components/print_dropdown";
import { AssetService } from "~/services/asset.service";
import { Asset } from "~/types/asset.type";

export default function AssetsRoute() {
  const [data, setData] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(false);

  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState<Asset[]>([]);

  const handleRefetch = async () => {
    setLoading(true);
    await fetchData();
    setLoading(false);
  };

  // const handleTrack = () => {
  //   setIsEditMode(false);
  //   setIsModalOpen(true);
  //   setEditingId(null);
  //   form.resetFields();
  //   setIsTitle('Create Asset')
  // };

  // // Edit record
  // const editRecord = (record: Asset) => {
  //   setIsEditMode(true);
  //   form.setFieldsValue(record);
  //   setEditingId(record.id);
  //   setIsModalOpen(true);
  //   setIsTitle('Update Asset')
  // };

  const handleDeactivateButton = async (record: Asset) => {
    const { error } = await AssetService.deactivateStatus(
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
      const dataFetch = await AssetService.getAllPosts();
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
    "Asset Name": true,
    "Device Image": false,
    "Asset Tag": true,
    "Serial": true,
    "Model": true,
    "Category": true,
    "Checked Out To": true,
    "Location": true,
    "Purchase Cost": false,
    "Current Value": false,
    "Accounting Code": false,
    "Installed": false,
    "Size": false,
    "Status": true,
    "Actions": true,
    "Checkout": true,
  });

  const columns: TableColumnsType<Asset> = [
    {
      title: "Asset Name",
      dataIndex: "name",
      width: 120,
    },
    {
      title: "Device Image",
      dataIndex: "device_image",
      width: 120,
    },
    {
      title: "Asset Tag",
      dataIndex: "asset_tag",
      width: 120,
    },
    {
      title: "Serial",
      dataIndex: "serial_no",
      width: 120,
    },
    {
      title: "Model",
      dataIndex: "model",
      width: 120,
    },
    {
      title: "Category",
      dataIndex: "category",
      width: 120,
    },
    {
      title: "Checked Out To",
      dataIndex: "checked_out_to",
      width: 120,
    },
    {
      title: "Location",
      dataIndex: "location",
      width: 120,
    },
    {
      title: "Purchase Cost",
      dataIndex: "purchase_cost",
      width: 120,
    },
    {
      title: "Current Value",
      dataIndex: "current_value",
      width: 120,
    },
    {
      title: "Accounting Code",
      dataIndex: "accounting_code",
      width: 120,
    },
    {
      title: "Installed",
      dataIndex: "installed",
      width: 120,
    },
    {
      title: "Size",
      dataIndex: "size",
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
      width: 190,
      fixed: "right",
      render: (_, record) => (
        <div className="flex">
          <Popconfirm
            title="Do you want to update?"
            description="Are you sure to update this asset?"
            okText="Yes"
            cancelText="No"
          // onConfirm={() => editRecord(record)}
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
            description="Are you sure to deactivate this asset?"
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
              description="Are you sure to checkin this asset?"
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
              description="Are you sure to checkout this asset?"
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

  const onChange: TableProps<Asset>["onChange"] = (
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
              title: "Assets",
            },
          ]}
        />
        <Space wrap>
          <Link to={"deleted-assets"}>
            <Button icon={<AiOutlineFileExclamation />} danger>
              Show Inactive Assets
            </Button>
          </Link>

          <Link to={"form-assets"}>
            <Button icon={<AiOutlinePlus />} type="primary">
              Create Asset
            </Button>
          </Link>
        </Space>
      </div>
      <div className="flex justify-between">
        <Alert
          message="Note: This is the list of all assets. Please check closely."
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
        <Table<Asset>
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
