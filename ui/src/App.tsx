import 'antd/dist/antd.css';
import { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Spin, notification } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import styled from 'styled-components';

import GlobalStyle from './GlobalStyle';
import { DappProvider } from './providers';
import { NotFound, WalletConnector } from './components';
import { AboutPage, LandingPage, LeaderboardPage, LorePage, RacePage } from './pages';

notification.config({ duration: 15 });

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
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </Suspense>
  );
}

const LoaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

export default AppWrapper;
