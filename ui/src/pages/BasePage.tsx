import { Header, Layout } from '../components';

interface IProps {
  children: React.ReactNode;
}

function BasePage({ children }: IProps) {
  return (
    <Layout>
      <Header />
      {children}
    </Layout>
  );
}

export default BasePage;
