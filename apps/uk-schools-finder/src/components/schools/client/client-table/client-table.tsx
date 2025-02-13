'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { ConfigProvider } from 'antd';
import { TableOutlined } from '@ant-design/icons';
import type { TableProps } from 'antd/es/table';
import { useMemo, useCallback, FC } from 'react';
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
import { SchoolDm, SchoolFilters } from '@lonli-lokli/shapes';
import { useUnit } from 'effector-react';
import { $viewModel, columnVisibilityChanged, selectAllClicked } from './model';
type ExtendedTableProps = {
  schools: SchoolDm[];
  currentPage: number;
  total: number;
  pageSize: number;
  sortFields: {
    field: string;
    order: 'ascend' | 'descend';
  }[];
  filters: SchoolFilters;
};

const scrollStyles = { y: 'calc(100vh - 300px)' };

// Minimal client component just for handling interactions
export function ClientTable({
  schools,
  currentPage,
  total,
  pageSize,
  sortFields,
  filters,
}: ExtendedTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { columns } = useUnit($viewModel);

  console.log('RERENDER', columns);
  const handleTableChange = useCallback<
    NonNullable<TableProps<SchoolDm>['onChange']>
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

  const pagination = useMemo(
    () => ({
      current: currentPage,
      pageSize,
      total,
      showSizeChanger: false,
    }),
    [currentPage, pageSize, total]
  );

  return (
    <ConfigProvider>
      <Space size="large" direction="vertical" style={{ width: '100%' }}>
        <Row align="middle" justify="end">
          <Col>
            <PropertyFilter />
          </Col>
        </Row>
      </Space>
      <Table
        size="small"
        columns={visibleColumns}
        dataSource={schools}
        pagination={pagination}
        onChange={handleTableChange}
        rowKey="id"
        scroll={scrollStyles}
      />
    </ConfigProvider>
  );
}

const onSelectAllClicked = () => {
  selectAllClicked();
};

const PropertyFilter: FC = () => {
  const { allColumnState, columns } = useUnit($viewModel);
  const content = (
    <div className="max-h-[60vh] overflow-auto">
      <Checkbox
        indeterminate={allColumnState === 'indeterminate'}
        onChange={onSelectAllClicked}
        checked={
          allColumnState === 'indeterminate'
            ? undefined
            : allColumnState === 'checked'
        }
      >
        ALL
      </Checkbox>

      <Divider />

      <Space direction="vertical">
        {columns.map((option, index) => {
          return (
            <Checkbox
              key={`${index}`}
              checked={!option.hidden}
              onChange={(e) => {
                columnVisibilityChanged({
                  column: option,
                  checked: e.target.checked,
                });
              }}
            >
              {option.title?.toString()}
            </Checkbox>
          );
        })}
      </Space>
    </div>
  );

  return (
    <Popover
      content={content}
      trigger="click"
      placement="bottomRight"
      styles={{
        root: { maxWidth: '300px' },
      }}
    >
      <Button type="primary" icon={<TableOutlined />}>
        COLUMNS
      </Button>
    </Popover>
  );
};
