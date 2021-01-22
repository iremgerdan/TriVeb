import { Socket } from 'socket.io-client/build/socket';

declare global {
  interface Window {
    socket: Socket;
  }
}
