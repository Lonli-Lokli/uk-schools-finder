import { Layout, Menu } from 'antd';
import { DatabaseOutlined, SettingOutlined } from '@ant-design/icons';
import { ImportPanel } from '../components/imports/import-panel';
import { SchemaPanel } from '../components/schema/schema-panel';
import { SignIn } from '@lonli-lokli/sign-in';
import { useNavigate, useLocation, Routes, Route, Navigate } from 'react-router-dom';
import 'antd/dist/reset.css';

const { Header, Content, Sider } = Layout;

type MenuItem = 'imports' | 'schema' | 'firebase';

export function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedKey = location.pathname.split('/')[1] || 'imports';

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
            selectedKeys={[selectedKey]}
            defaultOpenKeys={['data']}
            onSelect={({ key }) => navigate(`/${key}`)}
            style={{ height: '100%', borderRight: 0 }}
          >
            <Menu.SubMenu
              key="data"
              icon={<DatabaseOutlined />}
              title="Data Management"
            >
              <Menu.Item key="imports">Data Import</Menu.Item>
              <Menu.Item key="schema">Schema Creation</Menu.Item>
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
            <Routes>
              <Route path="/" element={<Navigate to="/imports/ks4-results" replace />} />
              <Route path="/imports" element={<Navigate to="/imports/ks4-results" replace />} />
              <Route path="/imports/:type/*" element={<ImportPanel />} />
              <Route path="/schema" element={<SchemaPanel />} />
              <Route path="*" element={<Navigate to="/imports/ks4-results" replace />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}

export default App;
