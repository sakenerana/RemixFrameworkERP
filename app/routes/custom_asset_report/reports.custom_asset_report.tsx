import { HomeOutlined, LoadingOutlined } from "@ant-design/icons";
import {
  Alert,
  Breadcrumb,
  Button,
  Checkbox,
  CheckboxProps,
  Col,
  Divider,
  Form,
  message,
  Row,
  Select,
} from "antd";
import { useEffect, useMemo, useState } from "react";
import { AiOutlineSave, AiOutlineSend } from "react-icons/ai";
import { AssetService } from "~/services/asset.service";
import { AssetModelService } from "~/services/asset_model.service";
import { CategoryService } from "~/services/category.service";
import { CompanyService } from "~/services/company.service";
import { LocationService } from "~/services/location.service";
import { ManufacturerService } from "~/services/manufacturer.service";
import { SupplierService } from "~/services/supplier.service";
import { AssetModel } from "~/types/asset_model.tpye";
import { Category } from "~/types/category.type";
import { Company } from "~/types/company.type";
import { CustomAsset } from "~/types/custom_asset.type";
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
  { label: "ID", value: "id" },
  { label: "Asset Tag", value: "asset_tag" },
  { label: "Asset Name", value: "name" },
  { label: "Manufacturer", value: "manufacturer_id" },
  { label: "Asset Models", value: "asset_model" },
  { label: "Category", value: "category_id" },
  { label: "Serial", value: "order_no" },
  { label: "Purchase Date", value: "purchase_date" },
  { label: "Purchase Cost", value: "purchase_cost" },
  { label: "Depreciation", value: "depreciation_id" },
  { label: "Suppliers", value: "supplier_id" },
  { label: "Location", value: "location_id" },
  { label: "Status", value: "status_id" },
  { label: "Checkout Date", value: "date_created" },
  { label: "Created At", value: "created_at" },
  { label: "Notes", value: "notes" },
  { label: "Assigned To", value: "checkedout_to" },
  { label: "Username", value: "username" },
  { label: "Department", value: "department_id" },
  { label: "Phone", value: "phone" },
  { label: "Address", value: "address" },
  { label: "City", value: "city" },
  { label: "State", value: "state" },
  { label: "Country", value: "country" },
  { label: "Zip", value: "zip" },
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
      const dataFetchGroup = await CategoryService.getAllPostsByConsumables(isDepartmentID);
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
      console.log("finish1", allValues)
      // Create new record
      setLoading(true);
      const dataFetch = await AssetService.getAllPostsReport(allValues);
      setData(dataFetch);
      console.log("value", dataFetch)

      // if (dataFetch[0]) {
      //   exportToExcel(dataFetch);
      //   message.success("Record generated successfully");
      // } else {
      //   message.error("No Record Yet.");
      // }

      // if (!dataFetch) throw message.error("Error: No Record");

      // setLoading(false);
      // form.resetFields();
    } catch (error) {
      message.error("Error");
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
  const exportToExcel = (data: any) => {
    const dateString = getFormattedDate();
    const ws = XLSX.utils.json_to_sheet(data); //data []
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, `custom-asset-report-${dateString}.xlsx`);
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
              title: "Custom Asset Report",
            },
          ]}
        />
      </div>
      <Alert
        message="You can see here all the custom asset report. Please generate your own customize report."
        type="info"
        showIcon
      />

      <Row gutter={16} className="pt-5">
        <Col span={8} className="border border-gray-200 p-5">
          <Checkbox
            indeterminate={indeterminate}
            onChange={onCheckAllChange}
            checked={checkAll}
          >
            Select all columns
          </Checkbox>
          <Divider />
          <CheckboxGroup
            options={options}
            value={checkedList}
            onChange={onChange}
            style={{ display: 'flex', flexDirection: 'column' }}
          />
        </Col>
        <Col span={16} className="border border-gray-200 p-5">
          <p className="p-2">
            Select the fields you would like to include in your custom report,
            and click Generate. The file (custom-asset-report-YYYY-mm-dd.csv)
            will download automatically, and you can open it in Excel. If you
            would like to export only certain assets, use the options below to
            fine-tune your results.
          </p>
          <Form
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 16 }}
            autoComplete="off"
            labelAlign="right"
            className="mt-5"
            form={form}
            onFinish={onFinish}
          >

            {/* <Form.Item<CustomAsset>
              label="Company"
              name="company_id"
              rules={[{ required: true, message: "Please select company!" }]}
            >
              <Select
                showSearch
                placeholder="Select Company"
                optionFilterProp="children"
                filterOption={(input, option) => {
                  if (!option || !option.children) return false;
                  return String(option.children).toLowerCase().includes(input.toLowerCase());
                }}
              >
                {dataCompany.map((item: Company) => (
                  <Option key={item.id} value={item.id}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </Form.Item> */}
            <Form.Item<CustomAsset>
              label="Location"
              name="location_id"
              rules={[{ required: true, message: "Please select location!" }]}
            >
              <Select
                showSearch
                placeholder="Select Location"
                optionFilterProp="children"
                filterOption={(input, option) => {
                  if (!option || !option.children) return false;
                  return String(option.children).toLowerCase().includes(input.toLowerCase());
                }}
              >
                {dataLocation.map((item: Location) => (
                  <Option key={item.id} value={item.id}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item<CustomAsset>
              label="Model"
              name="asset_model_id"
              rules={[{ required: true, message: "Please select model!" }]}
            >
              <Select
                showSearch
                placeholder="Select Asset Model"
                optionFilterProp="children"
                filterOption={(input, option) => {
                  if (!option || !option.children) return false;
                  return String(option.children).toLowerCase().includes(input.toLowerCase());
                }}
              >
                {dataAssetModel.map((item: AssetModel) => (
                  <Option key={item.id} value={item.id}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item<CustomAsset>
              label="Supplier"
              name="supplier_id"
              rules={[{ required: true, message: "Please select supplier!" }]}
            >
              <Select
                showSearch
                placeholder="Select Supplier"
                optionFilterProp="children"
                filterOption={(input, option) => {
                  if (!option || !option.children) return false;
                  return String(option.children).toLowerCase().includes(input.toLowerCase());
                }}
              >
                {dataSupplier.map((item: Supplier) => (
                  <Option key={item.id} value={item.id}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item<CustomAsset>
              label="Manufacturer"
              name="manufacturer_id"
              rules={[{ required: true, message: "Please select manufacturer!" }]}
            >
              <Select
                showSearch
                placeholder="Select Manufacturer"
                optionFilterProp="children"
                filterOption={(input, option) => {
                  if (!option || !option.children) return false;
                  return String(option.children).toLowerCase().includes(input.toLowerCase());
                }}
              >
                {dataManufacturer.map((item: Manufacturer) => (
                  <Option key={item.id} value={item.id}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item<CustomAsset>
              label="Category"
              name="category_id"
              rules={[{ required: true, message: "Please select category!" }]}
            >
              <Select
                showSearch
                placeholder="Select Category"
                optionFilterProp="children"
                filterOption={(input, option) => {
                  if (!option || !option.children) return false;
                  return String(option.children).toLowerCase().includes(input.toLowerCase());
                }}
              >
                {dataCategory.map((item: Category) => (
                  <Option key={item.id} value={item.id}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item<CustomAsset>
              label="Status"
              name="status_id"
              rules={[{ required: true, message: "Please select status!" }]}
            >
              <Select
                showSearch
                placeholder="Select a status"
                optionFilterProp="label"
                options={[
                  {
                    value: "1",
                    label: "Active",
                  },
                  {
                    value: "2",
                    label: "Inactive",
                  },
                ]}
              />
            </Form.Item>

            <Form.Item className="flex flex-wrap justify-center">
              <Button
                type="primary"
                htmlType="submit"
                icon={
                  <>
                    {loading && <LoadingOutlined className="animate-spin" />}
                    {!loading && <AiOutlineSave />}
                  </>
                }
                className="w-full sm:w-auto"
                size="large"
              >
                <p>Generate</p>
              </Button>
            </Form.Item>

          </Form>

        </Col>
      </Row>
    </div>
  );
}
