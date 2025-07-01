import { MenuUnfoldOutlined } from "@ant-design/icons";
import {
  Alert,
  Card,
  Col,
  Flex,
  Progress,
  Row,
  Space,
  Spin,
  Statistic,
  TableColumnsType,
  TableProps,
  Tag,
} from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  FcDiploma1,
  FcInspection,
  FcMultipleDevices,
  FcNews,
  FcPackage,
} from "react-icons/fc";
import { RiCircleFill, RiPieChart2Fill } from "react-icons/ri";

interface DataType {
  id: number;
  title: string;
  body: string;
  userId?: number; // Optional property
}

export default function WorkflowDashboard() {
  const [data, setData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      <Alert
        message="You can see here all the status of overall inventory. Please check closely."
        type="info"
        showIcon
      />

      {/* THIS IS THE FIRST ROWN OF DASHBOARD */}
      <Row gutter={16} className="pt-5 pb-3">
        <Col span={24}>
          <div className="shadow-lg m-[-7px]">
            {loading && <Spin></Spin>}
            {!loading && (
              <Card
                title={
                  <div className="flex items-center">
                    <RiPieChart2Fill className="mr-2 text-green-500" /> {/* Your icon */}
                    Most Requested Workflows
                  </div>
                }
              >
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
            )}
          </div>
        </Col>
      </Row>

      {/* THIS IS THE SECOND ROW OF DASHBOARD */}
      <Row gutter={16} className="pt-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {data.map((data) => (
            <>
              {loading && <Spin></Spin>}
              {!loading && (
                <Card
                  className="rounded-md shadow-md overflow-hidden transition-transform duration-300 hover:scale-105"
                >
                  <div>
                    <h2 className="text-sm font-semibold mb-2"><RiCircleFill className="float-left text-[5px] text-green-500 mt-2 mr-2" /> {data.title}</h2>
                    <p className="flex flex-wrap justify-end text-lg text-green-600">
                      <FcInspection className="mt-1 mr-2" /> {data.userId}
                    </p>
                  </div>
                </Card>
              )}
            </>
          ))}
        </div>
      </Row>
    </div>
  );
}
