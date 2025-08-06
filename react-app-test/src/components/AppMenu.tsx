import { Menu } from 'antd';
import { 
  AppstoreOutlined, 
  MailOutlined,
  TableOutlined,
  PieChartOutlined,
  BarChartOutlined, 
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Link } from 'react-router-dom';

type MenuItem = Required<MenuProps>['items'][number];

// 创建菜单项
function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return { key, icon, children, label } as MenuItem;
}

const items: MenuItem[] = [
  getItem(<Link to="/GetPost">GetPost</Link>, 'GetPost', <MailOutlined />),
  getItem('Picture', 'picture', <AppstoreOutlined />, [
    getItem(<Link to="/draw-picture">表格</Link>, 'draw1', <TableOutlined />),
    getItem(<Link to="/draw-picture2">电影信息</Link>, 'draw2', <BarChartOutlined />),
    getItem(<Link to="/draw-picture3">导演统计</Link>, 'draw3', <PieChartOutlined />),
  ])
];

const AppMenu = () => {
  return (
    <Menu
      theme="dark"
      mode="inline"
      defaultSelectedKeys={['page1']}
      items={items}
      style={{ height: '100%' }}
    />
  );
};

export default AppMenu;

