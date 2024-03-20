import React, { ReactNode, useEffect } from 'react';
import classNames from 'classnames';
import { useAppDispatch, useAppSelector } from 'hooks/useStore';
import selectedAddress from 'redux/address/selector';
import { handleAddKyc } from 'redux/kyc/slice';
import showMessage from '../Message';
import TYPE_CONSTANTS from 'constants/type';

type KycButtonProps = {
  className?: string | undefined;
  text: ReactNode;
  refetch?: Function;
};

function KycButton({ text, className, refetch, ...props }: KycButtonProps) {
  const { address } = useAppSelector(selectedAddress.getAddress);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const blockpass = new window.BlockpassKYCConnect(
      process.env.NEXT_PUBLIC_APP_CLIENT_ID, // service client_id from the admin console
      {
        refId: address, // assign the local user_id of the connected user
      },
    );

    blockpass.startKYCConnect();

    blockpass.on('KYCConnectSuccess', (data: any) => {
      //add code that will trigger when data have been sent.
      showMessage(TYPE_CONSTANTS.MESSAGE.SUCCESS, 'message.S1');
      dispatch(
        handleAddKyc({
          address,
          showPopupKycAgain: true,
        }),
      );
      refetch && refetch();
    });
  }, [address]);

  return (
    <button id='blockpass-kyc-connect' className={classNames('button', className)}>
      {text}
    </button>
  );
}

export default KycButton;
