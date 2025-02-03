import { Table } from 'antd';
import Link from 'next/link';
import { ClientTableWrapper } from './client-table-wrapper';
import { School } from '../../shapes';
import { getRatingColor } from './utils';

type SchoolsTableProps = {
  schools: School[];
  total: number;
  pageSize: number;
  currentPage: number;
  sortField?: string;
  sortOrder?: string;

};

// Server Component
export function SchoolsTable({
  schools,
  total,
  pageSize,
  currentPage,
  sortField,
  sortOrder,
}: SchoolsTableProps) {
  const columns = [
    {
      title: 'School Name',
      dataIndex: 'name',
      width: '40%',
      className: 'font-medium',
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
    {
      title: 'Distance',
      dataIndex: 'distance',
      width: '20%',
      render: (distance: number) => `${distance.toFixed(1)} mi`,
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow">
      <ClientTableWrapper
        columns={columns}
        dataSource={schools}
        pagination={{
          current: currentPage,
          pageSize,
          total,
          showSizeChanger: false,
        }}
        sortField={sortField}
        sortOrder={sortOrder}
      />
    </div>
  );
} 