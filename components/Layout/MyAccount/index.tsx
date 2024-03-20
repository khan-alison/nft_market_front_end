import PublicLayout from '@components//Layout/Public';
import Layout from './Private';

const MyAccountLayout = ({ children }: any) => {
  return (
    <PublicLayout>
      <Layout>{children}</Layout>
    </PublicLayout>
  );
};

export default MyAccountLayout;
