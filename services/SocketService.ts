import io from 'socket.io-client';

let socketIo: any;

export default class Socket {
  getInstance = (address: string) => {
    if (socketIo == null) {
      socketIo = io(`${process.env.NEXT_PUBLIC_APP_API}`, {
        secure: true,
        reconnection: true,
        rejectUnauthorized: false,
        transports: ['websocket'],
        query: {
          address,
        },
      });

      socketIo.on('connect', () => {
        console.log('connect=', 'connect');
      });
      socketIo.on('disconnect', () => {
        console.log('------------disconnect-socket------------');
      });
    }
    return socketIo;
  };

  removeInstance = () => {
    socketIo = null;
  };
}
