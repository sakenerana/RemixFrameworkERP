import { FileSearchOutlined, HomeOutlined, LoadingOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate, useSearchParams } from "@remix-run/react";
import {
    Alert,
    Breadcrumb,
    Card,
    Spin,
} from "antd";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "~/auth/AuthContext";

interface DataType {
    id: number;
    firstname: string;
    lastname: string;
    username: string;
    activities_count: number;
    workflows_breakdown: any[];
    userId?: number; // Optional property
}

export default function Assigned() {
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");
    const [data, setData] = useState<DataType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isUserID, setUserID] = useState<any>();
    const [isDepartmentID, setDepartmentID] = useState<any>();

    const { user, token } = useAuth();

    const navigate = useNavigate();

    const fetchData = async () => {
        const getABID = localStorage.getItem('ab_id');
        const getUsername = localStorage.getItem('username');

        try {
            setLoading(true);
            setError(null);

            const response = await axios.post<any>(
                '/api/user-activities',
                {
                    userid: Number(getABID),
                    username: getUsername
                },
            );

            // Filter data to only include items with ID 188
            const filteredData = response.data.data.filter((item: any) => item.id === Number(id));
            // console.log("FILTERED ID2", id);
            setData(filteredData); // Only stores data where ID = 188
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
            console.error('Failed to fetch data:', err);
        } finally {
            setLoading(false);
        }
    };

    useMemo(() => {
        setUserID(localStorage.getItem('userAuthID'));
        setDepartmentID(localStorage.getItem('userDept'));
    }, []);

    useEffect(() => {
        fetchData();
        // console.log("FILTERED ID", id);
    }, []); // Empty dependency array means this runs once on mount

    return (
        <div className="w-full px-6 py-4 rounded-lg shadow-sm">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <Breadcrumb
                        items={[
                            {
                                href: "/workflow",
                                title: <HomeOutlined className="text-gray-400" />,
                            },
                            {
                                title: <span className="text-gray-500">Workflow</span>,
                            },
                            {
                                title: <span className="text-blue-600 font-medium">Assigned</span>,
                            },
                        ]}
                        className="text-sm"
                    />
                </div>
            </div>

            {/* Toolbar Section */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
                <Alert
                    message="Review all users with assigned workflows. Monitor status and take action as needed."
                    type="info"
                    showIcon
                    className="w-full lg:w-auto"
                />
            </div>

            {/* Card Section */}
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Spin
                        size="large"
                        tip="Loading assigned workflows..."
                        indicator={<LoadingOutlined style={{ fontSize: 36 }} spin />}
                    />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data.length > 0 ? (
                        data.map((user) => (
                            <Card
                                key={user.id}
                                className="p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-center mb-4">
                                    <div className="bg-blue-100 p-3 rounded-full mr-4">
                                        <UserOutlined className="text-blue-600 text-lg" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium">{user.username}</h3>
                                        <p className="text-gray-500 text-sm">
                                            {user.firstname} {user.lastname}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <h4 className="font-medium border-b pb-2">
                                        Workflow Breakdown
                                    </h4>

                                    {Object.entries(user.workflows_breakdown).map(([workflow, count]) => (
                                        <div key={workflow} className="flex justify-between items-center">
                                            <span>{workflow}</span>
                                            <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded-full text-xs font-medium">
                                                {count} tasks
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        ))
                    ) : (
                        <div className="col-span-full py-12 flex flex-col items-center">
                            <FileSearchOutlined className="text-3xl mb-3 text-gray-400" />
                            <p className="text-gray-500 mb-2 text-base">No assigned workflows found</p>
                            <p className="text-gray-400 text-sm mb-4">
                                Create new assignments or check your filters
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}