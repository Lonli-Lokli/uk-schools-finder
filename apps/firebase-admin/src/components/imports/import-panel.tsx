import { Tabs } from 'antd';
import { ImportFile } from './import-file';
import { createImportModel } from './model-factory';
import {
  importKS4Destinations,
  importKS4Results,
  importKS5Destinations,
  importKS5HEDestinations,
  importRegions,
  importSchools,
} from '@lonli-lokli/firebase/import';

export const importTabs = [
  {
    key: 'ks4-results',
    label: 'KS4 Results',
    model: createImportModel('ks4-results', importKS4Results),
    fileName: 'england_ks4provisional.csv',
    description: 'Import KS4 (GCSE) student results data.',
  },
  {
    key: 'ks4-destinations',
    label: 'KS4 Destinations',
    model: createImportModel('ks4-destinations', importKS4Destinations),
    fileName: 'england_ks4-pupdest.csv',
    description: 'Import KS4 (GCSE) student destinations data.',
  },

  {
    key: 'ks5-destinations',
    label: 'KS5 Destinations',
    model: createImportModel('ks5-destinations', importKS5Destinations),
    fileName: 'england_ks5-studest.csv',
    description: 'Import KS5 (A-Level) student destinations data.',
  },

  {
    key: 'ks5he-destinations',
    label: 'KS5 HE Destinations',
    model: createImportModel('ks5he-destinations', importKS5HEDestinations),
    fileName: 'england_ks5-studest-he.csv',
    description: 'Import KS5 (A-Level) student destinations data.',
  },

  {
    key: 'regions',
    label: 'Regions',
    model: createImportModel('regions', importRegions),
    fileName: 'england_regions.csv',
    description: 'Import regions data.',
  },
  {
    key: 'schools',
    label: 'Schools',
    model: createImportModel('schools', importSchools),
    fileName: 'england_schools.csv',
    description:
      'Import basic school information including URN, name, and location.',
  },
];

export function ImportPanel() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Data Import</h1>
      <Tabs defaultActiveKey="ks4-results">
        {importTabs.map((tab) => (
          <Tabs.TabPane key={tab.key} tab={tab.label}>
            <ImportFile
              title={`Import ${tab.label} Data`}
              model={tab.model}
              yearRequired={tab.key !== 'schools'}
              acceptedFileName={tab.fileName}
              description={tab.description}
            />
          </Tabs.TabPane>
        ))}
      </Tabs>
    </div>
  );
}
