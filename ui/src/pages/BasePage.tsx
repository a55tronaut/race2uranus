import { EnterRaceModal, Header, Layout } from '../components';

interface IProps {
  children: React.ReactNode;
}

function BasePage({ children }: IProps) {
  return (
    <Layout>
      <EnterRaceModal />
      <Header />
      {children}
    </Layout>
  );
}

export default BasePage;
