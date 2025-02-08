import { Card, Button, Alert, message } from 'antd';
import { initializeClientSupabase } from '@lonli-lokli/supabase/setup-client';
import { useUnit } from 'effector-react';
import { $dataSource } from '../imports/model';

const { supabase } = initializeClientSupabase();
export function SchemaPanel() {
  const dataSource = useUnit($dataSource);

  const handleCreateSchema = async () => {
    if (dataSource !== 'supabase') {
      return;
    }

    try {
      const { error } = await supabase.rpc('create_import_tables');
      if (error) throw error;

      message.success('Schema created successfully');
    } catch (error) {
      message.error(
        error instanceof Error ? error.message : 'Failed to create schema'
      );
    }
  };

  return (
    <Card title="Schema Management">
      {dataSource === 'supabase' ? (
        <div>
          <p className="mb-4">
            Create or update the database schema for Supabase tables. This will:
          </p>
          <ul className="list-disc ml-6 mb-4">
            <li>Create all necessary tables if they don't exist</li>
            <li>Add spatial support for location data</li>
            <li>Set up foreign key relationships</li>
            <li>Create necessary indexes</li>
          </ul>
          <Button type="primary" onClick={handleCreateSchema}>
            Create/Update Schema
          </Button>
        </div>
      ) : (
        <Alert
          message="Schema management is only available for Supabase"
          type="info"
          showIcon
        />
      )}
    </Card>
  );
}
