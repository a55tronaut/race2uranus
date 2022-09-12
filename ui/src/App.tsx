import 'antd/dist/antd.css';
import { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Spin, Typography } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import styled from 'styled-components';

import GlobalStyle from './GlobalStyle';
import { DappProvider } from './providers';
import { WalletConnector } from './components';
import { AboutPage, LandingPage, LorePage, RacePage } from './pages';

function AppWrapper() {
  return (
    <DappProvider>
      <App />
      <WalletConnector />
    </DappProvider>
  );
}

function App() {
  return (
    <Suspense
      fallback={
        <LoaderWrapper>
          <Spin indicator={<LoadingOutlined style={{ fontSize: 72 }} spin />} />
        </LoaderWrapper>
      }
    >
      <GlobalStyle />
      <BrowserRouter>
        <Routes>
          <Route path="/race/:raceId" element={<RacePage />} />
          <Route path="/lore" element={<LorePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </Suspense>
  );
}

function NotFound() {
  return (
    <NotFoundWrapper>
      <Typography.Title className="message">Not found</Typography.Title>
    </NotFoundWrapper>
  );
}

const LoaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const NotFoundWrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 60px;
  .message {
    font-weight: 300;
  }
`;

export default AppWrapper;
