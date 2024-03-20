import { GetServerSideProps } from 'next';

import withServerSideProps from 'hoc/withServerSideProps';
import { useEffect } from 'react';
const Home = () => {
  useEffect(() => {
    const blockpass = new window.BlockpassKYCConnect(
      'brillianzekoios_25f70', // service client_id from the admin console
      {
        refId: new Date().getTime(), // assign the local user_id of the connected user
      },
    );

    blockpass.startKYCConnect();

    blockpass.on('KYCConnectSuccess', (data: any) => {
      //add code that will trigger when data have been sent.
      console.log('kyc success');
      console.log('data :>> ', data);
    });
  }, []);
  return (
    <div>
      {/* <div className='home-page'> */}
      <button id='blockpass-kyc-connect' style={{ color: 'skyblue' }}>
        Verify with Blockpass
      </button>
      {/* </div> */}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = withServerSideProps((context: any) => context);

export default Home;
