import { Layout, Menu, Typography } from 'antd';
import { DatabaseOutlined, SettingOutlined } from '@ant-design/icons';
import { SchoolsImportPanel } from '../components/schools-import';
import { SignIn } from '@lonli-lokli/sign-in';
import 'antd/dist/reset.css';

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

export function App() {
  return (
    <Layout className="min-h-screen">
      <Header className="flex items-center justify-between px-4 lg:px-6 bg-[#001529] fixed w-full z-10">
        <div className="text-white text-xl font-bold">Firebase Admin</div>
        <div className="text-white">
          <SignIn />
        </div>
      </Header>
      
      <Layout className="mt-16">
        <Sider 
          width={240}
          className="bg-white overflow-auto h-[calc(100vh-64px)] fixed left-0"
          breakpoint="lg"
          collapsedWidth="0"
          defaultCollapsed={false}
        >
          <Menu
            mode="inline"
            defaultSelectedKeys={['schools']}
            defaultOpenKeys={['data']}
            style={{ height: '100%', borderRight: 0 }}
          >
            <Menu.SubMenu 
              key="data" 
              icon={<DatabaseOutlined />} 
              title="Data Management"
            >
              <Menu.Item key="schools">Schools Import</Menu.Item>
            </Menu.SubMenu>
            <Menu.SubMenu 
              key="settings" 
              icon={<SettingOutlined />} 
              title="Settings"
            >
              <Menu.Item key="firebase">Firebase Config</Menu.Item>
            </Menu.SubMenu>
          </Menu>
        </Sider>
        
        <Layout className="ml-[240px] lg:ml-[240px] p-4 lg:p-6">
          <Content>
            <Title level={2} className="mb-6">Data Management</Title>
            <SchoolsImportPanel />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}

export default App;
