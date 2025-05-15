import { Button, Dropdown, MenuProps } from "antd";
import { AiFillFilePdf, AiFillFileWord, AiOutlineFileExcel } from "react-icons/ai";
import { FcExport } from "react-icons/fc";

const items: MenuProps['items'] = [
  {
    key: '1',
    label: (
      <a className="flex" target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
        <div className="pt-1 pr-2">
          <AiFillFilePdf className="text-red-500" />
        </div>
        <div>PDF</div>
      </a>
    ),
  },
  {
    key: '2',
    label: (
      <a className="flex" target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
        <div className="pt-1 pr-2">
          <AiOutlineFileExcel className="text-green-500" />
        </div>
        <div>Excel</div>
      </a>
    ),
  },
  {
    key: '3',
    label: (
      <a className="flex" target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
        <div className="pt-1 pr-2">
          <AiFillFileWord className="text-blue-500" />
        </div>
        <div>Word</div>
      </a>
    ),
  },
];

export default function PrintDropdownComponent() {
  return (
    <Dropdown menu={{ items }} placement="bottomLeft">
      <Button icon={<FcExport />}>Export</Button>
    </Dropdown>
  );
}
