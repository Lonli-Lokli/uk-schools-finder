import { Tabs, Space } from 'antd';
import { ImportFile } from './import-file';
import { DataSourceSelector } from './data-source-selector';
import { useNavigate, useParams } from 'react-router-dom';
import { importTabs } from './import-tabs';

export function ImportPanel() {
  const navigate = useNavigate();
  const { type = 'ks4-results' } = useParams();
  return (
    <div className="p-4">
      <Space direction="vertical" size="large" className="w-full">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Data Import</h1>
          <Space>
            <span>Data Source:</span>
            <DataSourceSelector />
          </Space>
        </div>
      </Space>

      <Tabs 
        activeKey={type}
        onChange={(key) => navigate(`/imports/${key}`)}
      >
        {importTabs.map((tab) => (
          <Tabs.TabPane key={tab.key} tab={tab.label}>
            {tab.key === type && (
              <ImportFile
                title={`Import ${tab.label} Data`}
                model={tab.model}
                yearRequired={tab.yearRequired}
                acceptedFileName={tab.fileName}
                description={tab.description}
              />
            )}
          </Tabs.TabPane>
        ))}
      </Tabs>
    </div>
  );
}
