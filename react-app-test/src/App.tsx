import { Layout } from 'antd';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppMenu from './components/AppMenu';
import GetPost from './pages/GetPost';
import DrawPicture from './pages/DrawPicture';
import DrawPicture2 from './pages/DrawPicture2';
import DrawPicture3 from './pages/DrawPicture3';
// import React from 'react';

const { Header, Content, Sider } = Layout;

const App = () => {
  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider>
          <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)' }} />
          <AppMenu />
        </Sider>
        <Layout>
          <Header style={{ padding: 0 }} />
          <Content style={{ margin: '24px 16px 0' }}>
            <Routes>
              <Route path="/GetPost" element={<GetPost />} />
              <Route path="/draw-picture" element={<DrawPicture />} />
              <Route path="/draw-picture2" element={<DrawPicture2 />} />
              <Route path="/draw-picture3" element={<DrawPicture3 />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
};

export default App;
