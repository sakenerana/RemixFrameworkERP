import { ReloadOutlined, SettingOutlined } from "@ant-design/icons";
import { Alert, Button, Dropdown, Input, Space } from "antd";
import type { MenuProps } from "antd";
import type { ReactNode } from "react";

interface DataTableToolbarProps {
  alertClassName?: string;
  alertMessage?: ReactNode;
  className?: string;
  columnMenuItems?: MenuProps["items"];
  columnsLabel?: string;
  columnsMenuClassName?: string;
  compactActions?: boolean;
  exportNode?: ReactNode;
  framed?: boolean;
  leadingControls?: ReactNode;
  onRefresh?: () => void;
  onSearchChange?: (value: string) => void;
  refreshLabel?: string;
  refreshLoading?: boolean;
  searchClassName?: string;
  searchPlaceholder?: string;
  searchSize?: "large" | "middle" | "small";
}

export function DataTableToolbar({
  alertClassName = "",
  alertMessage,
  className = "",
  columnMenuItems,
  columnsLabel = "Columns",
  columnsMenuClassName = "min-w-[200px] rounded-md py-2 shadow-lg",
  compactActions = false,
  exportNode,
  framed = true,
  leadingControls,
  onRefresh,
  onSearchChange,
  refreshLabel = "Refresh",
  refreshLoading = false,
  searchClassName = "w-full xl:max-w-lg",
  searchPlaceholder,
  searchSize = "middle",
}: DataTableToolbarProps) {
  const actionButtons = (
    <>
      {onRefresh && (
        <Button
          onClick={onRefresh}
          icon={<ReloadOutlined />}
          loading={refreshLoading}
          className={compactActions ? "min-w-[112px]" : "flex items-center gap-2 hover:border-blue-500"}
        >
          {refreshLabel}
        </Button>
      )}

      {columnMenuItems && (
        <Dropdown
          menu={{
            items: columnMenuItems,
            className: columnsMenuClassName,
          }}
          placement="bottomRight"
          trigger={["click"]}
        >
          <Button
            icon={<SettingOutlined />}
            className={compactActions ? "min-w-[112px]" : "flex items-center gap-2 hover:border-blue-500"}
          >
            {columnsLabel}
          </Button>
        </Dropdown>
      )}
    </>
  );

  const controls = (
    <div className={`flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between ${className}`}>
      <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center xl:w-auto">
        {leadingControls}
        {searchPlaceholder && onSearchChange && (
          <Input.Search
            allowClear
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={searchPlaceholder}
            className={searchClassName}
            size={searchSize}
          />
        )}
      </div>

      <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
        {compactActions ? (
          <Space.Compact className="w-full sm:w-auto">{actionButtons}</Space.Compact>
        ) : (
          <Space wrap>{actionButtons}</Space>
        )}
        {exportNode && <div className="w-full sm:w-auto">{exportNode}</div>}
      </div>
    </div>
  );

  if (!framed) {
    return controls;
  }

  return (
    <div className="data-table-toolbar rounded-lg border border-gray-200 bg-gray-50 p-3">
      {alertMessage && (
        <Alert
          message={alertMessage}
          type="info"
          showIcon
          className={`mb-3 ${alertClassName}`}
        />
      )}
      {controls}
    </div>
  );
}
