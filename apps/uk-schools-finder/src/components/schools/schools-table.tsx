import { SchoolDm } from '@lonli-lokli/shapes';
import { ClientTableWrapper } from './client-table-wrapper';

type SchoolsTableProps = {
  schools: SchoolDm[];
  total: number;
  pageSize: number;
  currentPage: number;
  sortFields: {
    field: string;
    order: 'ascend' | 'descend';
  }[];
};


export function SchoolsTable({
  schools,
  total,
  pageSize,
  currentPage,
  sortFields,

}: SchoolsTableProps) {
  return (
    <div className="bg-white rounded-lg shadow">
      <ClientTableWrapper
        dataSource={schools}
        pagination={{
          current: currentPage,
          pageSize,
          total,
          showSizeChanger: false,
        }}
        sortFields={sortFields}
      />
    </div>
  );
} 