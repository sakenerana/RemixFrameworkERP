import { HomeOutlined, LoadingOutlined } from "@ant-design/icons";
import { useNavigate } from "@remix-run/react";
import {
  Breadcrumb,
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Row,
  Select,
  Space,
  Spin,
} from "antd";
import { useState } from "react";
import { AiOutlineArrowLeft, AiOutlineSend } from "react-icons/ai";
import { FcRefresh } from "react-icons/fc";
import { Link } from "react-router-dom";

interface DataType {
  id: number;
  title: string;
  body: string;
  userId?: number; // Optional property
}

export default function CreateTransactions() {
  const [data, setData] = useState<DataType[]>([]);
  const [form] = Form.useForm<DataType>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  return <div>Create Transactions</div>;
}
