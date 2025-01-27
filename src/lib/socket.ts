import { io } from 'socket.io-client';

const SOCKET_URL = 'http://65.2.152.45/';

const socket = io(SOCKET_URL, {
  autoConnect: false,
});

export default socket;
