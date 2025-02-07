import { Tabs, Space } from 'antd';
import { ImportFile } from './import-file';
import { createImportModel } from './model-factory';
import { DataSourceSelector } from './data-source-selector';
import { ks4DestinationsParser, ks4ResultsParser, ks5DestinationsParser, ks5HEDestinationsParser, regionsParser, schoolsParser } from '@lonli-lokli/data-parsers';
import { transformKS4Destinations, transformKS4Results, transformKS5Destinations, transformKS5HEDestinations, transformQuadrants, transformRegions, transformSchools } from '@lonli-lokli/data-transformers';
import { uploadKS4Destinations, uploadKS4Results, uploadKS5Destinations, uploadKS5HEDestinations, uploadQuadrants, uploadRegions, uploadSchools } from '@lonli-lokli/firebase/import';

export const importTabs = [
  {
    key: 'ks4-results',
    label: 'KS4 Results',
    yearRequired: true,
    model: createImportModel('ks4-results', {
      parse: ks4ResultsParser,
      transform: transformKS4Results,
      upload: {
        'firebase': uploadKS4Results,
        'supabase': null!
      }
    }),
    fileName: 'england_ks4provisional.csv',
    description: 'Import KS4 (GCSE) student results data.',
  },
  {
    key: 'ks4-destinations',
    label: 'KS4 Destinations',
    yearRequired: true,
    model: createImportModel('ks4-destinations', {
        parse: ks4DestinationsParser,
        transform: transformKS4Destinations,
      upload: {
        'firebase': uploadKS4Destinations,
        'supabase': null!
      }
    }),
    fileName: 'england_ks4-pupdest.csv',
    description: 'Import KS4 (GCSE) student destinations data.',

  },

  {
    key: 'ks5-destinations',
    label: 'KS5 Destinations',
    yearRequired: true,
    model: createImportModel('ks5-destinations', {
      parse: ks5DestinationsParser,
      transform: transformKS5Destinations,
      upload: {
        'firebase': uploadKS5Destinations,
        'supabase': null!
      }
    }),
    fileName: 'england_ks5-studest.csv',
    description: 'Import KS5 (A-Level) student destinations data.',

  },

  {
    key: 'ks5he-destinations',
    label: 'KS5 HE Destinations',
    yearRequired: true,
    model: createImportModel('ks5he-destinations', {
      parse: ks5HEDestinationsParser,
      transform: transformKS5HEDestinations,
      upload: {
        'firebase': uploadKS5HEDestinations,
        'supabase': null!
      }
    }),
    fileName: 'england_ks5-studest-he.csv',
    description: 'Import KS5 (A-Level) student destinations data.',

  },

  {
    key: 'regions',
    label: 'Regions',
    yearRequired: true,
    model: createImportModel('regions', {
      parse: regionsParser,
      transform: transformRegions,
      upload: {
        'firebase': uploadRegions,
        'supabase': null!
      }
    }),
    fileName: 'england_regions.csv',
    description: 'Import regions data.',

  },
  {
    key: 'schools',
    label: 'Schools',
    yearRequired: false,
    model: createImportModel('schools', {
      parse: schoolsParser,
      transform: transformSchools,
      upload: {
        'firebase': uploadSchools,
        'supabase': null!
      }
    }),
    fileName: 'school-data.csv',
    description:

      'Import basic school information including URN, name, and location.',
  },
  {
    key: 'quadrants',
    label: 'Quadrants',
    yearRequired: false,
    model: createImportModel('quadrants', {
      parse: schoolsParser,
      transform: transformQuadrants,
      upload: {
        'firebase': uploadQuadrants,
        'supabase': null!
      }
    }),
    fileName: 'school-data.csv',
    description: 'Import quadrants data.',

  },
];

export function ImportPanel() {
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

      <Tabs defaultActiveKey="ks4-results">
        {importTabs.map((tab) => (
          <Tabs.TabPane key={tab.key} tab={tab.label}>
            <ImportFile
              title={`Import ${tab.label} Data`}
              model={tab.model}
              yearRequired={tab.yearRequired}
              acceptedFileName={tab.fileName}
              description={tab.description}
            />
          </Tabs.TabPane>
        ))}
      </Tabs>
    </div>
  );
}
