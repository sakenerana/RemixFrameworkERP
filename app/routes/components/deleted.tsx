import { CheckCircleOutlined, HomeOutlined, SettingOutlined } from "@ant-design/icons";
import { Link } from "@remix-run/react";
import { Alert, Breadcrumb, Button, Checkbox, Dropdown, Input, MenuProps, message, Popconfirm, Space, Spin, Table, TableColumnsType, TableProps, Tag } from "antd";
import { useEffect, useState } from "react";
import { AiOutlineCloseCircle, AiOutlineDelete, AiOutlineEdit, AiOutlineRollback } from "react-icons/ai";
import { FcRefresh } from "react-icons/fc";
import PrintDropdownComponent from "~/components/print_dropdown";
import { ComponentService } from "~/services/component.service";
import { Component } from "~/types/component.type";

export default function DeletedComponents() {
    const [data, setData] = useState<Component[]>([]);
    const [loading, setLoading] = useState(false);

    const [searchText, setSearchText] = useState('');
    const [filteredData, setFilteredData] = useState<Component[]>([]);

    const handleRefetch = async () => {
        setLoading(true);
        await fetchData();
        setLoading(false);
    };

    const handleActivateButton = async (record: Component) => {
        const { error } = await ComponentService.activateStatus(
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
            const dataFetch = await ComponentService.getAllPostsInactive();
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

    // State for column visibility
    const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({
        "Name": true,
        "Image": true,
        "URL": true,
        "Address": true,
        "City": true,
        "State": true,
        "Postal Code": false,
        "Country": false,
        "Phone": false,
        "Fax": false,
        "Notes": false,
        "Status": true,
        "Actions": true,
    });

    const columns: TableColumnsType<Component> = [
        {
            title: "Name",
            dataIndex: "name",
            width: 120,
        },
        {
            title: "Image",
            dataIndex: "image",
            width: 120,
        },
        {
            title: "URL",
            dataIndex: "url",
            width: 120,
        },
        {
            title: "Address",
            dataIndex: "address",
            width: 120,
        },
        {
            title: "City",
            dataIndex: "city",
            width: 120,
        },
        {
            title: "State",
            dataIndex: "state",
            width: 120,
        },
        {
            title: "Postal Code",
            dataIndex: "postal_code",
            width: 120,
        },
        {
            title: "Country",
            dataIndex: "country",
            width: 120,
        },
        {
            title: "Phone",
            dataIndex: "phone",
            width: 120,
        },
        {
            title: "Fax",
            dataIndex: "fax",
            width: 120,
        },
        {
            title: "Notes",
            dataIndex: "notes",
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
                        title="Do you want to activate?"
                        description="Are you sure to activate this component?"
                        okText="Yes"
                        cancelText="No"
                        onConfirm={() => handleActivateButton(record)}
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
                            title: "Settings",
                        },
                        {
                            title: "Components",
                        },
                        {
                            title: "Inactive",
                        },
                    ]}
                />
                <Link to={'/inventory/components'}>
                    <Button icon={<AiOutlineRollback />}>Back</Button>
                </Link>
            </div>
            <div className="flex justify-between">
                <Alert
                    message="Note: This is the list of all inactive components. Please check closely."
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