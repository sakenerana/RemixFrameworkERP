import { HomeOutlined } from "@ant-design/icons";
import {
  Alert,
  Breadcrumb,
  Button,
  Card,
  Checkbox,
  Col,
  Divider,
  Form,
  message,
  Row,
  Select,
} from "antd";
import { useEffect, useMemo, useState } from "react";
import { AiOutlineDown, AiOutlineFileExcel } from "react-icons/ai";
import { AssetService } from "~/services/asset.service";
import { AssetModelService } from "~/services/asset_model.service";
import { CategoryService } from "~/services/category.service";
import { LocationService } from "~/services/location.service";
import { ManufacturerService } from "~/services/manufacturer.service";
import { SupplierService } from "~/services/supplier.service";
import { AssetModel } from "~/types/asset_model.tpye";
import { Category } from "~/types/category.type";
import { Location } from "~/types/location.type";
import { Manufacturer } from "~/types/manufacturer.type";
import { Supplier } from "~/types/supplier.type";
import * as XLSX from 'xlsx';

type CheckboxOption = {
  label: string;
  value: string;
};

const CheckboxGroup = Checkbox.Group;

const options: CheckboxOption[] = [
  { label: "ID", value: "asset_id" },
  { label: "Created At", value: "created_at" },
  { label: "Asset Name", value: "asset_name" },
  { label: "Order No", value: "order_no" },
  { label: "Purchase Date", value: "purchase_date" },
  { label: "Purchase Cost", value: "purchase_cost" },
  { label: "Quantity", value: "qty" },
  { label: "Min. Quantity", value: "min_qty" },
  { label: "Notes", value: "asset_notes" },
  { label: "Status", value: "asset_status" },
  { label: "User ID", value: "user_id" },
  { label: "User Firstname", value: "user_fname" },
  { label: "User Middlename", value: "user_mname" },
  { label: "User Lastname", value: "user_lname" },
  { label: "User Email", value: "user_email" },
  { label: "Department ID", value: "department_id" },
  { label: "Department", value: "department_name" },
  { label: "Model ID", value: "model_id" },
  { label: "Model", value: "model" },
  { label: "Location ID", value: "location_id" },
  { label: "Location Name", value: "location_name" },
  { label: "Supplier ID", value: "supplier_id" },
  { label: "Manufacturer ID", value: "manufacturer_id" },
  { label: "Category ID", value: "category_id" },
];

export default function CustomAssetReportRoutes() {
  const [checkedList, setCheckedList] = useState<string[]>([]);
  const [indeterminate, setIndeterminate] = useState<boolean>(false);
  const [checkAll, setCheckAll] = useState<boolean>(false);

  const [form] = Form.useForm<any>();
  const [data, setData] = useState<any[]>([]);
  const [isUserID, setUserID] = useState<any>();
  const [isDepartmentID, setDepartmentID] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [dataCategory, setDataCategory] = useState<Category[]>([]);
  const [dataManufacturer, setDataManufacturer] = useState<Manufacturer[]>([]);
  const [dataSupplier, setDataSupplier] = useState<Supplier[]>([]);
  const [dataLocation, setDataLocation] = useState<Location[]>([]);
  const [dataAssetModel, setDataAssetModel] = useState<AssetModel[]>([]);
  const { Option } = Select;

  const onChange = (list: string[]) => {
    setCheckedList(list);
    setIndeterminate(!!list.length && list.length < options.length);
    setCheckAll(list.length === options.length);
  };

  const onCheckAllChange = (e: { target: { checked: boolean } }) => {
    const allValues = options.map(option => option.value);
    setCheckedList(e.target.checked ? allValues : []);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  };

  // Fetch data from Supabase
  const fetchDataCategory = async () => {
    try {
      setLoading(true);
      const dataFetchGroup = await CategoryService.getAllPosts(isDepartmentID);
      setDataCategory(dataFetchGroup); // Works in React state
    } catch (error) {
      message.error("error");
    } finally {
      setLoading(false);
    }
  };

  // Fetch data from Supabase
  const fetchDataManufacturer = async () => {
    try {
      setLoading(true);
      const dataFetchManufacturer = await ManufacturerService.getAllPosts(isDepartmentID);
      setDataManufacturer(dataFetchManufacturer); // Works in React state
    } catch (error) {
      message.error("error");
    } finally {
      setLoading(false);
    }
  };

  // Fetch data from Supabase
  const fetchDataSupplier = async () => {
    try {
      setLoading(true);
      const dataFetchSupplier = await SupplierService.getAllPosts(isDepartmentID);
      setDataSupplier(dataFetchSupplier); // Works in React state
    } catch (error) {
      message.error("error");
    } finally {
      setLoading(false);
    }
  };

  // Fetch data from Supabase
  const fetchDataLocation = async () => {
    try {
      setLoading(true);
      const dataFetchLocation = await LocationService.getAllPosts(isDepartmentID);
      setDataLocation(dataFetchLocation); // Works in React state
    } catch (error) {
      message.error("error");
    } finally {
      setLoading(false);
    }
  };

  // Fetch data from Supabase
  const fetchDataAssetModel = async () => {
    try {
      setLoading(true);
      const dataFetchAssetModel = await AssetModelService.getAllPosts(isDepartmentID);
      setDataAssetModel(dataFetchAssetModel); // Works in React state
    } catch (error) {
      message.error("error");
    } finally {
      setLoading(false);
    }
  };

  useMemo(() => {
    setUserID(localStorage.getItem('userAuthID'));
    setDepartmentID(localStorage.getItem('userDept'));
  }, []);

  useEffect(() => {
    fetchDataCategory();
    fetchDataManufacturer();
    fetchDataSupplier();
    fetchDataLocation();
    fetchDataAssetModel();
  }, []); // Empty dependency array means this runs once on mount

  // Create or Update record
  const onFinish = async () => {
    try {

      const values = await form.validateFields();

      // Include your extra field
      const allValues = {
        ...values,
        status_id: Number(values.status_id),
        department_id: Number(isDepartmentID),
        check_list: checkedList
      };

      // Create new record
      setLoading(true);
      const dataFetch = await AssetService.getAllPostsReport(allValues);
      setData(dataFetch);

      if (dataFetch[0]) {
        exportToExcel(dataFetch, checkedList);
        message.success("Record generated successfully");
      } else {
        message.error("No Record Yet.");
      }

      if (!dataFetch) throw message.error("Error: No Record");

      setLoading(false);
      // form.resetFields();
    } catch (error) {
      message.error("Error: Data Not Found");
      setLoading(false);
    }
  };

  // Function to generate formatted date string
  const getFormattedDate = (): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(now.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  // EXPORT TO EXCEL
  // const exportToExcel = (data: any) => {
  //   const dateString = getFormattedDate();
  //   const ws = XLSX.utils.json_to_sheet(data); //data []
  //   const wb = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  //   XLSX.writeFile(wb, `custom-asset-report-${dateString}.xlsx`);
  // };
  const exportToExcel = (data: any[], checkedList: any[]) => {
    const dateString = getFormattedDate();
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();

    // Get all headers
    const headers = Object.keys(data[0] || {});
    // Initialize !cols
    ws['!cols'] = ws['!cols'] || [];
    const cols = ws['!cols'] as XLSX.ColInfo[];

    if (checkedList?.length) {
      headers.forEach((header, index) => {
        // Hide column if it's NOT in the visibleColumns list
        if (!checkedList.includes(header)) {
          cols[index] = cols[index] || {};
          cols[index].hidden = true;
        }
      });
    }

    XLSX.utils.book_append_sheet(wb, ws, "Asset");
    XLSX.writeFile(wb, `custom-asset-report-${dateString}.xlsx`);
  };

  return (
    <div className="w-full px-4">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 py-2">
        <Breadcrumb
          items={[
            {
              href: "/inventory",
              title: <HomeOutlined className="text-gray-500" />,
            },
            {
              title: <span className="text-gray-500">Reports</span>,
            },
            {
              title: <span className="text-blue-600 font-medium">Custom Asset Report</span>,
            },
          ]}
          className="text-sm"
        />
      </div>

      {/* Information Alert */}
      <Alert
        message="Custom Asset Report Generation"
        description="Select your report criteria and columns below to generate a customized asset report. The file will download automatically in CSV format."
        type="info"
        showIcon
        className="mb-6"
      />

      <Row gutter={[24, 24]} className="pt-4">
        {/* Column Selection Panel */}
        <Col xs={24} md={8}>
          <Card
            title="Report Columns"
            bordered={false}
            className="shadow-sm h-full"
            headStyle={{ borderBottom: '1px solid #f0f0f0' }}
          >
            <div className="space-y-4">
              <Checkbox
                indeterminate={indeterminate}
                onChange={onCheckAllChange}
                checked={checkAll}
                className="font-medium"
              >
                Select all columns
              </Checkbox>
              <Divider className="my-3" />
              <CheckboxGroup
                options={options}
                value={checkedList}
                onChange={onChange}
                className="grid gap-3"
              />
            </div>
          </Card>
        </Col>

        {/* Report Configuration Panel */}
        <Col xs={24} md={16}>
          <Card
            title="Report Configuration"
            bordered={false}
            className="shadow-sm"
            headStyle={{ borderBottom: '1px solid #f0f0f0' }}
          >
            <p className="mb-6">
              Select the fields to include in your custom report and configure the filters below.
              The file (custom-asset-report-YYYY-mm-dd.csv) will download automatically when generated.
            </p>

            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              className="report-form"
            >
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label={<span className="font-medium">Location <span className="text-red-500">*</span></span>}
                    name="location_id"
                    rules={[{ required: true, message: "Please select location!" }]}
                  >
                    <Select
                      showSearch
                      placeholder="Select Location"
                      optionFilterProp="children"
                      className="w-full"
                      suffixIcon={<AiOutlineDown className="text-gray-400" />}
                      filterOption={(input, option) =>
                        String(option?.children).toLowerCase().includes(input.toLowerCase())
                      }
                    >
                      {dataLocation.map((item: Location) => (
                        <Option key={item.id} value={item.id}>
                          {item.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label={<span className="font-medium">Asset Model <span className="text-red-500">*</span></span>}
                    name="asset_model_id"
                    rules={[{ required: true, message: "Please select model!" }]}
                  >
                    <Select
                      showSearch
                      placeholder="Select Asset Model"
                      optionFilterProp="children"
                      className="w-full"
                      suffixIcon={<AiOutlineDown className="text-gray-400" />}
                      filterOption={(input, option) =>
                        String(option?.children).toLowerCase().includes(input.toLowerCase())
                      }
                    >
                      {dataAssetModel.map((item: AssetModel) => (
                        <Option key={item.id} value={item.id}>
                          {item.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label={<span className="font-medium">Supplier <span className="text-red-500">*</span></span>}
                    name="supplier_id"
                    rules={[{ required: true, message: "Please select supplier!" }]}
                  >
                    <Select
                      showSearch
                      placeholder="Select Supplier"
                      optionFilterProp="children"
                      className="w-full"
                      suffixIcon={<AiOutlineDown className="text-gray-400" />}
                      filterOption={(input, option) =>
                        String(option?.children).toLowerCase().includes(input.toLowerCase())
                      }
                    >
                      {dataSupplier.map((item: Supplier) => (
                        <Option key={item.id} value={item.id}>
                          {item.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label={<span className="font-medium">Manufacturer <span className="text-red-500">*</span></span>}
                    name="manufacturer_id"
                    rules={[{ required: true, message: "Please select manufacturer!" }]}
                  >
                    <Select
                      showSearch
                      placeholder="Select Manufacturer"
                      optionFilterProp="children"
                      className="w-full"
                      suffixIcon={<AiOutlineDown className="text-gray-400" />}
                      filterOption={(input, option) =>
                        String(option?.children).toLowerCase().includes(input.toLowerCase())
                      }
                    >
                      {dataManufacturer.map((item: Manufacturer) => (
                        <Option key={item.id} value={item.id}>
                          {item.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label={<span className="font-medium">Category <span className="text-red-500">*</span></span>}
                    name="category_id"
                    rules={[{ required: true, message: "Please select category!" }]}
                  >
                    <Select
                      showSearch
                      placeholder="Select Category"
                      optionFilterProp="children"
                      className="w-full"
                      suffixIcon={<AiOutlineDown className="text-gray-400" />}
                      filterOption={(input, option) =>
                        String(option?.children).toLowerCase().includes(input.toLowerCase())
                      }
                    >
                      {dataCategory.map((item: Category) => (
                        <Option key={item.id} value={item.id}>
                          {item.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label={<span className="font-medium">Status <span className="text-red-500">*</span></span>}
                    name="status_id"
                    rules={[{ required: true, message: "Please select status!" }]}
                  >
                    <Select
                      placeholder="Select status"
                      className="w-full"
                      suffixIcon={<AiOutlineDown className="text-gray-400" />}
                    >
                      <Option value="1">Active</Option>
                      <Option value="2">Inactive</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <div className="flex justify-center mt-8 pt-6 border-t border-gray-100">
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  className="w-full sm:w-auto h-11 px-8 bg-blue-600 hover:bg-blue-700"
                  loading={loading}
                  icon={!loading && <AiOutlineFileExcel />}
                >
                  Generate Report
                </Button>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
