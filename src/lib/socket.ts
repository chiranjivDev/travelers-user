import { io } from 'socket.io-client';

const SOCKET_URL =
  'https://dimensions-democrats-involvement-jerusalem.trycloudflare.com/';

const socket = io(SOCKET_URL, {
  autoConnect: false,
});

export default socket;
