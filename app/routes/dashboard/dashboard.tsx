import { Alert, Card, Col, Row, Statistic, TableColumnsType, TableProps, Table } from "antd";
import { FcDiploma1, FcMultipleDevices, FcMultipleSmartphones, FcNews, FcPackage, FcPortraitMode } from "react-icons/fc";

interface DataType {
    key: React.Key;
    name: string;
    created_by: string;
    math: number;
    english: number;
  }

export default function DashboardRoutes() {
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
          sorter: {
            compare: (a, b) => a.math - b.math,
            multiple: 2,
          },
        },
        {
          title: 'English Score',
          dataIndex: 'english',
          sorter: {
            compare: (a, b) => a.english - b.english,
            multiple: 1,
          },
        },
      ];

    const data: DataType[] = [
        {
          key: '1',
          name: 'John Brown',
          chinese: 98,
          math: 60,
          english: 70,
        },
        {
          key: '2',
          name: 'Jim Green',
          chinese: 98,
          math: 66,
          english: 89,
        },
        {
          key: '3',
          name: 'Joe Black',
          chinese: 98,
          math: 90,
          english: 70,
        },
        {
          key: '4',
          name: 'Jim Red',
          chinese: 88,
          math: 99,
          english: 89,
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
                                value={11.28}
                                precision={2}
                                valueStyle={{ color: '#3f8600' }}
                                prefix={<FcPackage />}
                                suffix="%"
                            />
                        </Card>
                    </div>
                </Col>
                <Col span={4}>
                    <div className="shadow-md">
                        <Card variant="borderless">
                            <Statistic
                                title="Licenses"
                                value={9.3}
                                precision={2}
                                valueStyle={{ color: '#cf1322' }}
                                prefix={<FcDiploma1 />}
                                suffix="%"
                            />
                        </Card>
                    </div>
                </Col>
                <Col span={4}>
                    <div className="shadow-md">
                        <Card variant="borderless">
                            <Statistic
                                title="Accessories"
                                value={9.3}
                                precision={2}
                                valueStyle={{ color: '#cf1322' }}
                                prefix={<FcMultipleDevices />}
                                suffix="%"
                            />
                        </Card>
                    </div>
                </Col>
                <Col span={4}>
                    <div className="shadow-md">
                        <Card variant="borderless">
                            <Statistic
                                title="Consumables"
                                value={9.3}
                                precision={2}
                                valueStyle={{ color: '#cf1322' }}
                                prefix={<FcNews />}
                                suffix="%"
                            />
                        </Card>
                    </div>
                </Col>
                <Col span={4}>
                    <div className="shadow-md">
                        <Card variant="borderless">
                            <Statistic
                                title="Components"
                                value={9.3}
                                precision={2}
                                valueStyle={{ color: '#cf1322' }}
                                prefix={<FcMultipleSmartphones />}
                                suffix="%"
                            />
                        </Card>
                    </div>
                </Col>
                <Col span={4}>
                    <div className="shadow-md">
                        <Card variant="borderless">
                            <Statistic
                                title="Users"
                                value={9.3}
                                precision={2}
                                valueStyle={{ color: '#cf1322' }}
                                prefix={<FcPortraitMode />}
                                suffix="%"
                            />
                        </Card>
                    </div>
                </Col>
            </Row>

            {/* THIS IS THE SECOND ROWN OF DASHBOARD */}

            <Row gutter={16} className="pt-5">
                <Col span={14}>
                    <div className="shadow-md">
                        <Card variant="borderless">
                            <Table<DataType> columns={columns} dataSource={data} onChange={onChange} />
                        </Card>
                    </div>
                </Col>
                <Col span={10}>
                    <div className="shadow-md">
                        <Card variant="borderless">
                            <Statistic
                                title="Licenses"
                                value={9.3}
                                precision={2}
                                valueStyle={{ color: '#cf1322' }}
                                prefix={<FcDiploma1 />}
                                suffix="%"
                            />
                        </Card>
                    </div>
                </Col>
            </Row>
        </div>


    );
}