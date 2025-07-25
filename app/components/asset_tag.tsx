import React, { useContext, useEffect, useRef, useState } from 'react';
import type { GetRef, InputRef, TableProps } from 'antd';
import { Button, Form, Input, Popconfirm, Select, Table } from 'antd';
import { Asset } from '~/types/asset.type';

type FormInstance<T> = GetRef<typeof Form<T>>;

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface Item {
  key: string;
  id: number;
  asset_tag: string;
  serial: string;
  status_type: string;
}

interface EditableRowProps {
  index: number;
}

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  dataIndex: keyof Item;
  record: Item;
  handleSave: (record: Item) => void;
}

const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const form = useContext(EditableContext)!;

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();

      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[{ required: true, message: `${title} is required.` }]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingInlineEnd: 24 }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

interface DataType {
  key: React.Key;
  id: number;
  asset_tag: string;
  serial: string;
  status_type: string;
}

interface AssetTagProps {
  onDataChange?: (data: DataType[]) => void;
  initialKeys?: any[];
  hasID?: any;
}

type ColumnTypes = Exclude<TableProps<DataType>['columns'], undefined>;

const AssetTag: React.FC<AssetTagProps> = ({ onDataChange, initialKeys = [], hasID }) => {
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  // Use `initialKeys` to set the initial state
  const [keys, setKeys] = useState<Asset[]>(initialKeys);

  const [count, setCount] = useState(2);
  const { Option } = Select;

  const handleStatusChange = (value: string, key: React.Key) => {
    const newData = dataSource.map((item) =>
      item.key === key ? { ...item, status_type: value } : item
    );
    setDataSource(newData);
  };

  useEffect(() => {
    if (hasID && initialKeys) {
      setDataSource(initialKeys);
      // Set count to avoid key collisions when adding new rows
      if (initialKeys.length > 0) {
        const maxKey = Math.max(...initialKeys.map(item => Number(item.key)));
        setCount(maxKey + 1);
      }
    }
  }, [hasID, initialKeys]);

  // Add useEffect to notify parent when data changes
  useEffect(() => {
    if (onDataChange) {
      onDataChange(dataSource);
      // console.log("testing 2", dataSource)
    }
  }, [dataSource, onDataChange]);

  const handleDelete = (key: React.Key) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
  };

  const defaultColumns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string })[] = [
    {
      title: 'Asset Tag',
      dataIndex: 'asset_tag',
      width: '30%',
      editable: true,
    },
    {
      title: 'Serial',
      dataIndex: 'serial',
      editable: true,
    },
    {
      title: 'Status Type',
      dataIndex: 'status_type',
      editable: false,
      render: (_, record) => (
        <Select
          placeholder="Select Status"
          className="w-full"
          // defaultValue={record.status_type || "Ready to Deploy"}
          value={record.status_type} // Controlled component
          onChange={(value) => handleStatusChange(value, record.key)}
        >
          <Option value="Pending">Pending</Option>
          <Option value="Ready to Deploy">Ready to Deploy</Option>
          <Option value="Archived">Archived</Option>
          <Option value="Broken - Not Fixable">Broken - Not Fixable</Option>
          <Option value="Lost/Stolen">Lost/Stolen</Option>
          <Option value="Out for Repair">Out for Repair</Option>
        </Select>
      ),
    },
    {
      title: 'Action',
      dataIndex: 'actions',
      render: (_, record) =>
        dataSource.length >= 1 ? (
          <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className="bg-red-600 hover:bg-red-700 text-white font-medium px-3 py-1 rounded-md transition-colors duration-200"
            >
              Remove
            </button>
          </Popconfirm>
        ) : null,
    },
  ];

  const handleAdd = () => {
    const newData: DataType = {
      key: count,
      id: count,
      asset_tag: `Input Asset Tag ${count}`,
      serial: `Input Serial ${count}`,
      status_type: ``,
    };
    setDataSource([...dataSource, newData]);
    setCount(count + 1);
  };

  const handleSave = (row: DataType) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    console.log("testing 1", newData)
    setDataSource(newData);
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: DataType) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  return (
    <div>
      <Button onClick={handleAdd} type="primary" style={{ marginBottom: 16 }}>
        Add a row
      </Button>
      <Table<DataType>
        components={components}
        rowClassName={() => 'editable-row'}
        bordered
        dataSource={dataSource}
        columns={columns as ColumnTypes}
        pagination={false}
      />
    </div>
  );
};

export default AssetTag;