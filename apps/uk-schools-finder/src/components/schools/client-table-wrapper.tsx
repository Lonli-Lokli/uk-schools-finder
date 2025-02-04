'use client';

import { Table, TableProps } from 'antd';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { getRatingColor } from './utils';
import { ConfigProvider } from 'antd';

type ExtendedTableProps = TableProps<any> & {
  sortFields: {
    field: string;
    order: 'ascend' | 'descend';
  }[];
};


// Minimal client component just for handling interactions
export function ClientTableWrapper({
  dataSource,
  pagination,
}: ExtendedTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const columns = [
    {
      title: 'School Name',
      dataIndex: 'name',
      width: '40%',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      width: '20%',
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      width: '20%',
      render: (rating: string) => (
        <span className={`font-medium ${getRatingColor(rating)}`}>
          {rating}
        </span>
      ),
    },
    // ... other columns
  ];

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
      params.set('sort', sorter.field?.toString() ?? '');
      params.set('order', sorter.order || 'ascend');
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <ConfigProvider>
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={pagination}
        onChange={handleTableChange}
        rowKey="id"
        scroll={{ y: 'calc(100vh - 300px)' }}
      />
    </ConfigProvider>
  );
} 