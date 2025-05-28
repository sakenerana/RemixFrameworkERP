import { Button, Dropdown, MenuProps } from "antd";
import { AiFillFilePdf, AiFillFileWord, AiOutlineFileExcel } from "react-icons/ai";
import { FcExport } from "react-icons/fc";
import { Document, Packer, Paragraph, TextRun } from 'docx';
import * as XLSX from 'xlsx';

export default function PrintDropdownComponent() {

  // EXPORT TO EXCEL
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet([]); //data []
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "rename_this_file.xlsx");
  };

  // EXPORT TO WORD
  const exportToWord = async () => {
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: "Report",
                bold: true,
                size: 28,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: JSON.stringify([], null, 2), //data []
                size: 24,
              }),
            ],
          }),
        ],
      }],
    });

    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'rename_this_file.docx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const items: MenuProps['items'] = [
    // {
    //   key: '1',
    //   label: (
    //     <a className="flex" target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
    //       <div className="pt-1 pr-2">
    //         <AiFillFilePdf className="text-red-500" />
    //       </div>
    //       <div>PDF</div>
    //     </a>
    //   ),
    // },
    {
      key: '2',
      label: (
        <a className="flex flex-wrap" onClick={exportToExcel}>
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
        <a className="flex flex-wrap" onClick={exportToWord}>
          <div className="pt-1 pr-2">
            <AiFillFileWord className="text-blue-500" />
          </div>
          <div>Word</div>
        </a>
      ),
    },
  ];

  return (
    <Dropdown menu={{ items }} placement="bottomLeft">
      <Button icon={<FcExport />}>Export</Button>
    </Dropdown>
  );
}
