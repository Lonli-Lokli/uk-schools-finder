'use client';

import { Table, TableProps } from 'antd';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

// Minimal client component just for handling interactions
export function ClientTableWrapper({
  columns,
  dataSource,
  pagination,
  sortField,
  sortOrder,
}: TableProps<any> & {
  sortField?: string;
  sortOrder?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleTableChange: TableProps<any>['onChange'] = (
    pagination,
    filters,
    sorter
  ) => {
    const params = new URLSearchParams(searchParams);
    
    if (pagination.current) {
      params.set('page', pagination.current.toString());
    }

    if (sorter && !Array.isArray(sorter)) {
      params.set('sort', sorter.field.toString());
      params.set('order', sorter.order || 'ascend');
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      pagination={pagination}
      onChange={handleTableChange}
      rowKey="id"
      scroll={{ y: 'calc(100vh - 300px)' }}
    />
  );
} 