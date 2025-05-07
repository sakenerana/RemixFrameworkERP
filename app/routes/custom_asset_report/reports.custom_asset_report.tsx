import { HomeOutlined } from "@ant-design/icons";
import {
  Alert,
  Breadcrumb,
  Checkbox,
  CheckboxProps,
  Col,
  Divider,
  Row,
} from "antd";
import { useState } from "react";

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
              title: "Assets",
            },
            {
              title: "Create New",
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
        <Col span={8}>test</Col>
        <Col span={8}>test</Col>
      </Row>
    </div>
  );
}
