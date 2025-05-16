import { HomeOutlined } from "@ant-design/icons";
import {
  Alert,
  Breadcrumb,
  Checkbox,
  CheckboxProps,
  Col,
  Divider,
  Form,
  Row,
  Select,
} from "antd";
import { useState } from "react";
import { CustomAsset } from "~/types/custom_asset.type";

const CheckboxGroup = Checkbox.Group;
const options = [
  { label: "ID", value: 1 },
  { label: "Company", value: 2 },
  { label: "Asset Tag", value: 3 },
  { label: "Asset Name", value: 4 },
  { label: "Manufacturer", value: 5 },
  { label: "Asset Models", value: 6 },
  { label: "Category", value: 7 },
  { label: "Serial", value: 8 },
  { label: "Purchase Date", value: 9 },
  { label: "Purchase Cost", value: 10 },
  { label: "EOL Date", value: 11 },
  { label: "Warranty", value: 12 },
  { label: "Depreciation", value: 13 },
  { label: "Order Number", value: 14 },
  { label: "Suppliers", value: 15 },
  { label: "Location", value: 16 },
  { label: "Status", value: 17 },
  { label: "Checkout Date", value: 18 },
  { label: "Last Checkin Date", value: 19 },
  { label: "Expected Checkin Date", value: 20 },
  { label: "Created At", value: 21 },
  { label: "Updated At", value: 22 },
  { label: "Deleted", value: 23 },
  { label: "Last Audit", value: 24 },
  { label: "Next Audit Date", value: 25 },
  { label: "Notes", value: 26 },
  { label: "Assigned To", value: 27 },
  { label: "Username", value: 28 },
  { label: "Employee Number", value: 29 },
  { label: "Manager", value: 30 },
  { label: "Department", value: 31 },
  { label: "Title", value: 32 },
  { label: "Phone", value: 33 },
  { label: "Address", value: 34 },
  { label: "City", value: 35 },
  { label: "State", value: 36 },
  { label: "Country", value: 37 },
  { label: "Zip", value: 38 },
];
const plainOptions = [
  "ID",
  "Company",
  "Asset Tag",
  "Asset Name",
  "Manufacturer",
  "Asset Models",
  "Category",
  "Serial",
  "Purchase Date",
  "Purchase Cost",
  "EOL Date",
  "Warranty",
  "Depreciation",
  "Order Number",
  "Suppliers",
  "Location",
  "Status",
  "Checkout Date",
  "Last Checkin Date",
  "Expected Checkin Date",
  "Created At",
  "Updated At",
  "Deleted",
  "Last Audit",
  "Next Audit Date",
  "Notes",
  "Assigned To",
  "Username",
  "Employee Number",
  "Manager",
  "Department",
  "Title",
  "Phone",
  "Address",
  "City",
  "State",
  "Country",
  "Zip",
];
const defaultCheckedList = [""];

export default function CustomAssetReportRoutes() {
  const [checkedList, setCheckedList] = useState<string[]>(defaultCheckedList);
  //   const [newArrayCheckbox, setnewArrayCheckbox] = useState<number[]>([]);

  const checkAll = plainOptions.length === checkedList.length;
  const indeterminate =
    checkedList.length > 0 && checkedList.length < plainOptions.length;

  const onChange = (list: string[]) => {
    setCheckedList(list);
  };

  const onCheckAllChange: CheckboxProps["onChange"] = (e) => {
    for (let i = 0; i < options.length; i++) {
      // setnewArrayCheckbox(options[i].value);
      // console.log("Checkbox!", e.target.checked ? options[i].value : [])
      // console.log("test", newArrayCheckbox)
    }
    setCheckedList(e.target.checked ? plainOptions : []);
  };

  return (
    <div>
      <div className="flex pb-5 justify-between">
        <Breadcrumb
          items={[
            {
              href: "/main/dashboard",
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
        <Col span={8}>
          <Checkbox
            indeterminate={indeterminate}
            onChange={onCheckAllChange}
            checked={checkAll}
          >
            Select all
          </Checkbox>
          <Divider />
          <CheckboxGroup
            className="flex flex-col"
            options={plainOptions}
            value={checkedList}
            onChange={onChange}
          />
        </Col>
        <Col span={16}>
          <p>
            Select the fields you would like to include in your custom report,
            and click Generate. The file (custom-asset-report-YYYY-mm-dd.csv)
            will download automatically, and you can open it in Excel. If you
            would like to export only certain assets, use the options below to
            fine-tune your results.
          </p>
          <Form
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            autoComplete="off"
            labelAlign="right"
          ></Form>
          <Form.Item<CustomAsset>
            label="Company"
            name="company_name"
            rules={[{ required: true, message: "Please select company!" }]}
          >
            <Select
              showSearch
              placeholder="Select Company"
              optionFilterProp="label"
              options={[
                {
                  value: "jack",
                  label: "Jack",
                },
                {
                  value: "lucy",
                  label: "Lucy",
                },
                {
                  value: "tom",
                  label: "Tom",
                },
              ]}
            />
          </Form.Item>
          <Form.Item<CustomAsset>
            label="Location"
            name="location"
            rules={[{ required: true, message: "Please select location!" }]}
          >
            <Select
              showSearch
              placeholder="Select a location"
              optionFilterProp="label"
              options={[
                {
                  value: "jack",
                  label: "Jack",
                },
                {
                  value: "lucy",
                  label: "Lucy",
                },
                {
                  value: "tom",
                  label: "Tom",
                },
              ]}
            />
          </Form.Item>
          <Form.Item<CustomAsset>
            label="Default Location"
            name="default_location"
            rules={[{ required: true, message: "Please select location!" }]}
          >
            <Select
              showSearch
              placeholder="Select a location"
              optionFilterProp="label"
              options={[
                {
                  value: "jack",
                  label: "Jack",
                },
                {
                  value: "lucy",
                  label: "Lucy",
                },
                {
                  value: "tom",
                  label: "Tom",
                },
              ]}
            />
          </Form.Item>
          <Form.Item<CustomAsset>
            label="Department"
            name="department"
            rules={[{ required: true, message: "Please select department!" }]}
          >
            <Select
              showSearch
              placeholder="Select a department"
              optionFilterProp="label"
              options={[
                {
                  value: "jack",
                  label: "Jack",
                },
                {
                  value: "lucy",
                  label: "Lucy",
                },
                {
                  value: "tom",
                  label: "Tom",
                },
              ]}
            />
          </Form.Item>
          <Form.Item<CustomAsset>
            label="Supplier"
            name="supplier"
            rules={[{ required: true, message: "Please select supplier!" }]}
          >
            <Select
              showSearch
              placeholder="Select a supplier"
              optionFilterProp="label"
              options={[
                {
                  value: "jack",
                  label: "Jack",
                },
                {
                  value: "lucy",
                  label: "Lucy",
                },
                {
                  value: "tom",
                  label: "Tom",
                },
              ]}
            />
          </Form.Item>
          <Form.Item<CustomAsset>
            label="Model"
            name="model"
            rules={[{ required: true, message: "Please select model!" }]}
          >
            <Select
              showSearch
              placeholder="Select a model"
              optionFilterProp="label"
              options={[
                {
                  value: "jack",
                  label: "Jack",
                },
                {
                  value: "lucy",
                  label: "Lucy",
                },
                {
                  value: "tom",
                  label: "Tom",
                },
              ]}
            />
          </Form.Item>
          <Form.Item<CustomAsset>
            label="Manufacturer"
            name="manufacturer"
            rules={[{ required: true, message: "Please select manufacturer!" }]}
          >
            <Select
              showSearch
              placeholder="Select a manufacturer"
              optionFilterProp="label"
              options={[
                {
                  value: "jack",
                  label: "Jack",
                },
                {
                  value: "lucy",
                  label: "Lucy",
                },
                {
                  value: "tom",
                  label: "Tom",
                },
              ]}
            />
          </Form.Item>
          <Form.Item<CustomAsset>
            label="Category"
            name="category"
            rules={[{ required: true, message: "Please select category!" }]}
          >
            <Select
              showSearch
              placeholder="Select a category"
              optionFilterProp="label"
              options={[
                {
                  value: "jack",
                  label: "Jack",
                },
                {
                  value: "lucy",
                  label: "Lucy",
                },
                {
                  value: "tom",
                  label: "Tom",
                },
              ]}
            />
          </Form.Item>
          <Form.Item<CustomAsset>
            label="Status"
            name="status"
            rules={[{ required: true, message: "Please select status!" }]}
          >
            <Select
              showSearch
              placeholder="Select a status"
              optionFilterProp="label"
              options={[
                {
                  value: "jack",
                  label: "Jack",
                },
                {
                  value: "lucy",
                  label: "Lucy",
                },
                {
                  value: "tom",
                  label: "Tom",
                },
              ]}
            />
          </Form.Item>
        </Col>
      </Row>
    </div>
  );
}
