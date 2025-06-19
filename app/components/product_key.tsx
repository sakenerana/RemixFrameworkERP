import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { GetRef, InputRef, TableProps } from 'antd';
import { Button, Form, Input, Popconfirm, Table } from 'antd';
import { License } from '~/types/license.type';

type FormInstance<T> = GetRef<typeof Form<T>>;

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface Item {
  key: string;
  product_key: string;
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
  product_key: string;
}

type ColumnTypes = Exclude<TableProps<DataType>['columns'], undefined>;

interface ProductKeyProps {
  onDataChange?: (data: DataType[]) => void;
  initialKeys?: any[];
  hasID?: any;
}

const ProductKey: React.FC<ProductKeyProps> = ({ onDataChange, initialKeys = [], hasID }) => {
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  // Use `initialKeys` to set the initial state
  const [keys, setKeys] = useState<License[]>(initialKeys);

  const [count, setCount] = useState(1);

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
    }
  }, [dataSource, onDataChange]);

  const handleDelete = (key: React.Key) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
  };

  const defaultColumns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string })[] = [
    {
      title: 'Product Key',
      dataIndex: 'product_key',
      width: '80%',
      editable: true,
    },
    {
      title: 'Action',
      dataIndex: 'actions',
      render: (_, record) =>
        dataSource.length >= 1 ? (
          <Popconfirm key={record.key} title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
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
      product_key: `Input Product Key ${count}`,
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

export default ProductKey;