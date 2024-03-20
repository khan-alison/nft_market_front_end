import { useEffect } from 'react';
import { isArray } from 'lodash';

import Socket from 'services/SocketService';
import { useAppSelector } from './useStore';
import selectedAddress from 'redux/address/selector';

export const useSocket = ({
  event,
  handleEvent,
  dependences,
  nonAuthen,
}: {
  event: string | string[];
  handleEvent: any;
  dependences?: any;
  nonAuthen?: boolean;
}) => {
  const { address } = useAppSelector(selectedAddress.getAddress);
  const socketIo = new Socket();

  useEffect(() => {
    if (address) {
      socketIo.removeInstance();
    }
  }, [address]);

  useEffect(() => {
    const socketInstance = socketIo.getInstance(address);
    if (address || nonAuthen) {
      if (typeof event === 'string') {
        socketInstance.on(event, handleEvent);
      } else if (isArray(event)) {
        event.forEach((e: string) => {
          socketInstance.on(e, handleEvent);
        });
      }
    }
    return () => {
      if (address || nonAuthen) {
        if (typeof event === 'string') {
          socketInstance.off(event, handleEvent);
        } else if (isArray(event)) {
          event.forEach((e: string) => {
            socketInstance.off(e, handleEvent);
          });
        }
      }
    };
  }, [address, ...(dependences || [])]);
};
