import { Button, Dropdown, MenuProps } from "antd";
import { AiOutlineFileExcel } from "react-icons/ai";
import { FcExport } from "react-icons/fc";
import { AlignmentType, BorderStyle, Document, Packer, Paragraph, Table, TableCell, TableRow, TextRun, WidthType } from 'docx';
import * as XLSX from 'xlsx';
import { useEffect } from "react";

export default function PrintDropdownComponent(stateData: any) {

  // EXPORT TO EXCEL
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(stateData.stateData); //data []
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "rename_this_file.xlsx");
  };

  // EXPORT TO WORD
  const exportToWord = async () => {
  // Create table rows from data
  const tableRows = stateData.stateData.stateData.map((item: any) => {
    return new TableRow({
      children: [
        new TableCell({
          children: [new Paragraph(item.id.toString())]
        }),
        new TableCell({
          children: [new Paragraph(item.first_name + item.middle_name + item.last_name)]
        }),
        new TableCell({
          children: [new Paragraph(item.email)]
        })
      ]
    });
  });

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
          alignment: AlignmentType.CENTER
        }),
        // Add some space between title and table
        new Paragraph({
          children: [new TextRun("")],
          spacing: { after: 200 }
        }),
        // Create the table
        new Table({
          width: {
            size: 100,
            type: WidthType.PERCENTAGE,
          },
          rows: [
            // Table header row
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph("ID")],
                  shading: {
                    fill: "DDDDDD"
                  }
                }),
                new TableCell({
                  children: [new Paragraph("Name")],
                  shading: {
                    fill: "DDDDDD"
                  }
                }),
                new TableCell({
                  children: [new Paragraph("Email")],
                  shading: {
                    fill: "DDDDDD"
                  }
                })
              ]
            }),
            // Add data rows
            ...tableRows
          ],
          borders: {
            top: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
            bottom: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
            left: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
            right: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
            insideHorizontal: { style: BorderStyle.SINGLE, size: 2, color: "AAAAAA" },
            insideVertical: { style: BorderStyle.SINGLE, size: 2, color: "AAAAAA" }
          }
        })
      ]
    }]
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'report.docx';
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
    // {
    //   key: '3',
    //   label: (
    //     <a className="flex flex-wrap" onClick={exportToWord}>
    //       <div className="pt-1 pr-2">
    //         <AiFillFileWord className="text-blue-500" />
    //       </div>
    //       <div>Word</div>
    //     </a>
    //   ),
    // },
  ];

  useEffect(() => {
  }, []); // Empty dependency array means this runs once on mount

  return (
    <Dropdown menu={{ items }} placement="bottomLeft">
      <Button icon={<FcExport />}>Export</Button>
    </Dropdown>
  );
}
