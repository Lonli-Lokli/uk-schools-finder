import { Select } from 'antd';
import { useUnit } from 'effector-react';
import { $dataSource, setDataSource } from './model';

export function DataSourceSelector() {
    const dataSource = useUnit($dataSource);
  
    return (
      <Select
        value={dataSource}
        onChange={setDataSource}
        style={{ width: 120 }}
        options={[
          { value: 'firebase', label: 'Firebase' },
          { value: 'supabase', label: 'Supabase' },
        ]}
      />
    );
  }