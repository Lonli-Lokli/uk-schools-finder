'use client';

import { Button, Select, Space, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useUnit } from 'effector-react';
import {
  $filters,
  $selectedColumn,
  columnSelected,
  filterAdded,
  filterChanged,
  filterRemoved,
  operatorChanged,
  type FilterOperation,
} from './model';
import { columnFilters, type ColumnFilter } from './column-filters';

export function SchoolFilter() {
  const selectedColumn = useUnit($selectedColumn);
  const filters = useUnit($filters);

  return (
    <Space direction="vertical" className="w-full">
      <Space>
        <Select
          style={{ width: 200 }}
          placeholder="Select column to filter"
          value={selectedColumn}
          onChange={columnSelected}
          options={columnFilters.map(col => ({
            label: col.title,
            value: col.key,
          }))}
        />
        <Button 
          icon={<PlusOutlined />}
          onClick={() => filterAdded()}
          disabled={!selectedColumn}
        >
          Add Filter
        </Button>
      </Space>

      <Space direction="vertical" className="w-full">
        {filters.map((filter, index) => {
          const column = columnFilters.find(c => c.key === filter.column);
          if (!column) return null;

          return (
            <Tag
              key={index}
              closable
              onClose={() => filterRemoved(index)}
              className="p-2"
            >
              <Space>
                <span>{column.title}</span>
                <Select
                  style={{ width: 120 }}
                  value={filter.operator}
                  onChange={(op: FilterOperation['operator']) => 
                    operatorChanged({ index, operator: op })}
                  options={column.operators.map(op => ({
                    label: op.charAt(0).toUpperCase() + op.slice(1),
                    value: op,
                  }))}
                />
                {column.filterType === 'select' ? (
                  <Select
                    mode={filter.operator === 'in' ? 'multiple' : undefined}
                    style={{ width: 200 }}
                    value={filter.value}
                    onChange={(value) => filterChanged({ index, value })}
                    options={column.options}
                  />
                ) : (
                  <Select
                    showSearch
                    style={{ width: 200 }}
                    value={filter.value as string}
                    onChange={(value) => filterChanged({ index, value })}
                  />
                )}
              </Space>
            </Tag>
          );
        })}
      </Space>
    </Space>
  );
}
