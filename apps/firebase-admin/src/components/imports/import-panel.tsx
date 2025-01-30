import { Tabs } from 'antd';
import { RegionsImport } from './regions';
import { KS5DestinationsImport } from './ks5-destinations';
import { SchoolsImport } from './schools';
import { KS5HEDestinationsImport } from './ks5he-destinations/ui';
import { KS4ResultsImport } from './ks4-results';
import { KS4DestinationsImport } from './ks4-destinations';

const { TabPane } = Tabs;

export function ImportPanel() {
  return (
    <Tabs defaultActiveKey="schools">
      <TabPane tab="Schools" key="schools">
        <SchoolsImport />
      </TabPane>
      <TabPane tab="Regions" key="regions">
        <RegionsImport />
      </TabPane>
      <TabPane tab="KS5 Destinations" key="ks5">
        <KS5DestinationsImport />
      </TabPane>
      <TabPane tab="KS5 HE Destinations" key="ks5he">
        <KS5HEDestinationsImport />
      </TabPane>
      <TabPane tab="KS4 Results" key="ks4">
        <KS4ResultsImport />
      </TabPane>
      <TabPane tab="KS4 Destinations" key="ks4dest">
        <KS4DestinationsImport />
      </TabPane>
    </Tabs>
  );
} 