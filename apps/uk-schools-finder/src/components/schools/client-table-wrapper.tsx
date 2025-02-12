'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { ConfigProvider } from 'antd';
import { TableOutlined } from '@ant-design/icons';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import type { TableProps, ColumnsType } from 'antd/es/table';
import {
  useMemo,
  useState,
  Fragment,
  useEffect,
  memo,
  useCallback,
} from 'react';
import {
  Col,
  Row,
  Table,
  Space,
  Button,
  Divider,
  Popover,
  Checkbox,
} from 'antd';

type ExtendedTableProps = TableProps<any> & {
  sortFields: {
    field: string;
    order: 'ascend' | 'descend';
  }[];
};

const defaultColumns = [
  'name',
  'type',
  'accreditationExpiryDate',
  'capacity',
  'boarders',
  'chNumber',
  'closeDate',
  'closeReason',
  'contact',
  'country',
  'establishmentAccredited',
  'establishmentNumber',
  'feheId',
  'gender',
  'officialSixthForm',
  'propsName',
  'senNoStat',
  'siteName',
  'specialClasses',
  'status',
  'trust',
  'type',
].map((key, idx) => ({
  key: key,
  title: key,
  dataIndex: key,
  hidden: idx > 5,
}));
// Minimal client component just for handling interactions
export function ClientTableWrapper({
  dataSource,
  pagination,
}: ExtendedTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  console.log(dataSource);

  const [columns, setColumns] = useState(defaultColumns);

  const handleTableChange = useCallback<
    NonNullable<TableProps<any>['onChange']>
  >(
    (pagination, filters, sorter) => {
      const params = new URLSearchParams(searchParams);

      if (pagination.current) {
        params.set('page', pagination.current.toString());
      }

      if (sorter && !Array.isArray(sorter)) {
        params.set('sort', sorter.field?.toString() ?? '');
        params.set('order', sorter.order || 'ascend');
      }

      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  const visibleColumns = useMemo(
    () => columns.filter((col) => !col.hidden),
    [columns]
  );

  return (
    <ConfigProvider>
      <Space size="large" direction="vertical" style={{ width: '100%' }}>
        <Row align="middle" justify="end">
          <Col>
            <PropertyFilter
              columns={columns}
              onChange={(newColumns: any) => setColumns(newColumns)}
            />
          </Col>
        </Row>
      </Space>
      <Table
        columns={visibleColumns}
        dataSource={dataSource}
        pagination={pagination}
        onChange={handleTableChange}
        rowKey="id"
        scroll={{ y: 'calc(100vh - 300px)' }}
      />
    </ConfigProvider>
  );
}

export interface PropertyFilterProps {
  columns: ColumnsType<any>;
  onChange: (columns: ColumnsType<any>) => void;
}

const PropertyFilter = memo((props: PropertyFilterProps) => {
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const [value, setValue] = useState<any[]>([]);

  const options = useMemo(() => {
    return (props.columns as any[]).map((column) => {
      return {
        value: column.key,
        label: column?.title,
      };
    });
  }, [props.columns]);

  useEffect(() => {
    const columns = (props.columns as any[]).filter((column) => {
      return value.includes(column.key);
    });

    props.onChange(columns);
  }, [props, value]);

  useEffect(() => {
    setChecked(true);
    setValue(options.map(({ value }) => value));
  }, [options, props]);

  const onChange = (event: CheckboxChangeEvent) => {
    setIndeterminate(false);
    setChecked(event.target.checked);
    setValue(event.target.checked ? options.map(({ value }) => value) : []);
  };

  const onSelect = (selected: any[]) => {
    setValue(selected);
    setChecked(selected.length === options.length);
    setIndeterminate(!!selected.length && selected.length < options.length);
  };

  const content = (
    <Fragment>
      <Checkbox
        indeterminate={indeterminate}
        onChange={onChange}
        checked={checked}
      >
        ALL
      </Checkbox>

      <Divider />

      <Checkbox.Group value={value} onChange={onSelect}>
        <Space direction="vertical">
          {options.map((option, index) => {
            return (
              <Checkbox key={`${option.value}#${index}`} value={option.value}>
                {option.label}
              </Checkbox>
            );
          })}
        </Space>
      </Checkbox.Group>
    </Fragment>
  );

  return (
    <Popover content={content} trigger="click" placement="bottomRight">
      <Button type="primary" icon={<TableOutlined />}>
        COLUMNS
      </Button>
    </Popover>
  );
});

PropertyFilter.displayName = 'PropertyFilter';
