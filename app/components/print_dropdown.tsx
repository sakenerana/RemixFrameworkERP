import { Button, Dropdown, MenuProps } from "antd";
import type { ButtonProps } from "antd";
import { AiOutlineFileExcel } from "react-icons/ai";
import { FcExport } from "react-icons/fc";
import * as XLSX from 'xlsx';
import dayjs from "dayjs";

type ExportVariant = "default" | "workflow_assigned_like";
type WorkflowBreakdown = Record<string, unknown> | Array<Record<string, unknown>>;

interface ExportItem {
  id?: unknown;
  username?: unknown;
  firstname?: unknown;
  lastname?: unknown;
  activities_count?: unknown;
  workflows_breakdown?: unknown;
}

interface PrintDropdownProps {
  stateData?: unknown[];
  exportVariant?: ExportVariant;
  buttonProps?: ButtonProps;
}

const getString = (value: unknown) => String(value ?? "");
const getWorkflowBreakdown = (value: unknown): WorkflowBreakdown => {
  if (Array.isArray(value)) return value as Array<Record<string, unknown>>;
  if (typeof value === "object" && value !== null) return value as Record<string, unknown>;
  return {};
};

export default function PrintDropdownComponent({
  stateData = [],
  exportVariant = "default",
  buttonProps,
}: PrintDropdownProps) {

  // EXPORT TO EXCEL
  const exportToExcel = () => {
    const selectedData = (Array.isArray(stateData) ? stateData : []) as ExportItem[];

    if (exportVariant === "workflow_assigned_like") {
      const assignedDetails = selectedData.flatMap((user) => {
        const breakdown = getWorkflowBreakdown(user.workflows_breakdown);
        const profileRows = [
          { section: "User Profile", field: "User ID", value: user.id },
          { section: "User Profile", field: "Username", value: user.username },
          { section: "User Profile", field: "Full Name", value: `${getString(user.firstname)} ${getString(user.lastname)}`.trim() },
          { section: "User Profile", field: "Activities", value: user.activities_count },
        ];

        const workflowRows = Object.entries(breakdown).map(([workflow, count]) => ({
          section: "Workflow Breakdown",
          field: workflow,
          value: count,
        }));

        return [...profileRows, ...workflowRows, { section: "", field: "", value: "" }];
      });

      const userSummary = selectedData.map((user) => {
        const breakdown = getWorkflowBreakdown(user.workflows_breakdown);

        return {
        id: user.id,
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
        activities_count: user.activities_count,
          workflow_types: Object.keys(breakdown).length,
        };
      });

      const workflowBreakdown = selectedData.flatMap((user) => {
        const breakdown = getWorkflowBreakdown(user.workflows_breakdown);

        return Object.entries(breakdown).map(([workflow, count]) => ({
          user_id: user.id,
          username: user.username,
          workflow,
          tasks: count,
        }));
      });

      const wb = XLSX.utils.book_new();

      const assignedDetailsSheet = XLSX.utils.json_to_sheet(assignedDetails);
      XLSX.utils.book_append_sheet(wb, assignedDetailsSheet, "Assigned Details");

      const userSummarySheet = XLSX.utils.json_to_sheet(userSummary);
      XLSX.utils.book_append_sheet(wb, userSummarySheet, "User Summary");

      const workflowBreakdownSheet = XLSX.utils.json_to_sheet(workflowBreakdown);
      XLSX.utils.book_append_sheet(wb, workflowBreakdownSheet, "Workflow Breakdown");

      const dateString = dayjs().format("YYYY-MM-DD_HH-mm-ss");
      XLSX.writeFile(wb, `workflow-workflows-selected-${dateString}.xlsx`);
      return;
    }

    const usersSheetRows = selectedData.map((item) => {
      const breakdown = getWorkflowBreakdown(item.workflows_breakdown);

      return {
      id: item.id,
      username: item.username,
      firstname: item.firstname,
      lastname: item.lastname,
      activities_count: item.activities_count,
        workflow_types: Object.keys(breakdown).length,
      };
    });

    const workflowBreakdownRows = selectedData.flatMap((item) => {
      const breakdown = getWorkflowBreakdown(item.workflows_breakdown);

      if (Array.isArray(breakdown)) {
        return breakdown.map((entry, index) => ({
          user_id: item.id,
          username: item.username,
          workflow: getString(entry.workflow || entry.name || `Workflow ${index + 1}`),
          tasks: entry.count ?? entry.tasks ?? entry.value ?? 0,
        }));
      }

      return Object.entries(breakdown).map(([workflow, tasks]) => ({
        user_id: item.id,
        username: item.username,
        workflow,
        tasks,
      }));
    });

    const wb = XLSX.utils.book_new();

    const usersSheet = XLSX.utils.json_to_sheet(usersSheetRows);
    XLSX.utils.book_append_sheet(wb, usersSheet, "Users");

    const workflowBreakdownSheet = XLSX.utils.json_to_sheet(workflowBreakdownRows);
    XLSX.utils.book_append_sheet(wb, workflowBreakdownSheet, "Workflow Breakdown");

    XLSX.writeFile(wb, "rename_this_file.xlsx");
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
        <button
          type="button"
          className="flex flex-wrap w-full border-0 bg-transparent p-0 text-left cursor-pointer"
          onClick={exportToExcel}
        >
          <div className="pt-1 pr-2">
            <AiOutlineFileExcel className="text-green-500" />
          </div>
          <div>Excel</div>
        </button>
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

  return (
    <Dropdown menu={{ items }} placement="bottomLeft" trigger={["click"]}>
      <Button
        icon={<FcExport />}
        {...(buttonProps || {})}
      >
        Export
      </Button>
    </Dropdown>
  );
}
