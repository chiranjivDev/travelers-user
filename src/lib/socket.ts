import { io } from 'socket.io-client';

const SOCKET_URL = 'https://delivery-package.onrender.com/';

const socket = io(SOCKET_URL, {
  autoConnect: false,
});

export default socket;
