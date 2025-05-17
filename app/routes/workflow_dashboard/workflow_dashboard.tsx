import { Alert, Card, Col, Flex, Progress, Row, Statistic, Table, TableColumnsType, TableProps, Tag } from "antd";
import { FcDiploma1, FcMultipleDevices, FcNews, FcPackage } from "react-icons/fc";

interface DataType {
    key: React.Key;
    date: string;
    name: string;
    created_by: string;
    action: string;
    item: string;
}

export default function WorkflowDashboard() {

    const columns: TableColumnsType<DataType> = [
        {
            title: 'Date',
            dataIndex: 'date',
        },
        {
            title: 'Created By',
            dataIndex: 'created_by',
        },
        {
            title: 'Action',
            dataIndex: 'action',
        },
        {
            title: 'Item',
            dataIndex: 'item',
        },
    ];

    const data: DataType[] = [
        {
            key: '1',
            date: 'test',
            name: 'John Brown',
            created_by: 'test',
            action: 'test',
            item: 'test',
        },
        {
            key: '2',
            date: 'test',
            name: 'John Brown',
            created_by: 'test',
            action: 'test',
            item: 'test',
        },
        {
            key: '3',
            date: 'test',
            name: 'John Brown',
            created_by: 'test',
            action: 'test',
            item: 'test',
        },
        {
            key: '4',
            date: 'test',
            name: 'John Brown',
            created_by: 'test',
            action: 'test',
            item: 'test',
        },
    ];

    const onChange: TableProps<DataType>['onChange'] = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };

    return (
        <div>
            <Alert message="You can see here all the status of overall inventory. Please check closely." type="info" showIcon />

            {/* THIS IS THE FIRST ROWN OF DASHBOARD */}

            <Row gutter={16} className="pt-5">
                <Col span={4}>
                    <div className="shadow-md">
                        <Card variant="borderless">
                            <Statistic
                                title="Assets"
                                value={1}
                                precision={0}
                                valueStyle={{ color: '#3f8600' }}
                                prefix={<FcPackage />}
                                suffix=""
                            />
                        </Card>
                    </div>
                </Col>
                <Col span={4}>
                    <div className="shadow-md">
                        <Card variant="borderless">
                            <Statistic
                                title="Licenses"
                                value={1}
                                precision={0}
                                valueStyle={{ color: '#cf1322' }}
                                prefix={<FcDiploma1 />}
                                suffix=""
                            />
                        </Card>
                    </div>
                </Col>
                <Col span={4}>
                    <div className="shadow-md">
                        <Card variant="borderless">
                            <Statistic
                                title="Accessories"
                                value={1}
                                precision={0}
                                valueStyle={{ color: '#cf1322' }}
                                prefix={<FcMultipleDevices />}
                                suffix=""
                            />
                        </Card>
                    </div>
                </Col>
                <Col span={4}>
                    <div className="shadow-md">
                        <Card variant="borderless">
                            <Statistic
                                title="Consumables"
                                value={9}
                                precision={0}
                                valueStyle={{ color: '#cf1322' }}
                                prefix={<FcNews />}
                                suffix=""
                            />
                        </Card>
                    </div>
                </Col>
            </Row>

            {/* THIS IS THE SECOND ROW OF DASHBOARD */}

            <Row gutter={16} className="pt-5">
                <Col span={14}>
                    <div className="shadow-md">
                        <Card variant="borderless">
                            <Table<DataType> bordered size={"small"} columns={columns} dataSource={data} onChange={onChange} />
                        </Card>
                    </div>
                </Col>
                <Col span={10}>
                    <div className="shadow-md">
                        <Card title='Assets by Status' variant="borderless">
                            <Flex gap="4px 0" wrap>
                                <Tag color="#87d068">Ready to Deploy</Tag>
                                <Tag color="#f50">Pending</Tag>
                                <Tag color="#b602f7">Archived</Tag>
                                <Tag color="#079feb">Users</Tag>
                            </Flex>
                            <Flex gap="small" vertical>
                                <Progress percent={30} />
                                <Progress percent={50} status="active" />
                                <Progress percent={70} status="exception" />
                                <Progress percent={100} />
                                <Progress percent={50} showInfo={false} />
                            </Flex>
                        </Card>
                    </div>
                </Col>
            </Row>
        </div>
    );
}