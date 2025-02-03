// import { io } from 'socket.io-client';

// const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL;

// // Function to get token safely from localStorage
// const getTokenFromLocalStorage = () => {
//   let token = null;
//   try {
//     const userFromLocalStorage = localStorage.getItem('user');
//     if (userFromLocalStorage) {
//       const user = JSON.parse(userFromLocalStorage);
//       token = user?.access_token || null;
//       console.log('token from socket: ', token);
//     }
//   } catch (error) {
//     console.error('Error parsing user from localStorage:', error);
//   }
//   return token;
// };

// // Function to establish the socket connection
// const socketConnection = () => {
//   const token = getTokenFromLocalStorage();

//   console.log('token from localStorage:', token);
//   if (!token) {
//     console.error('No token available. Cannot establish socket connection.');
//     return null;
//   }

//   const socket = io(SOCKET_URL, {
//     extraHeaders: {
//       authorization: `bearer ${token}`,
//     },
//   });

//   // Handle connection errors
//   socket.on('connect_error', (error) => {
//     console.error('Socket connection error:', error);
//   });

//   socket.on('connect', () => {
//     console.log('Socket connected successfully!');
//   });

//   return socket;
// };

// export default socketConnection;

import { io } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL;

let socketInstance = null; // Store the socket instance globally

// Function to get token safely from localStorage
const getTokenFromLocalStorage = () => {
  let token = null;
  try {
    const userFromLocalStorage = localStorage.getItem('user');
    if (userFromLocalStorage) {
      const user = JSON.parse(userFromLocalStorage);
      token = user?.access_token || null;
      console.log('Token from socket:', token);
    }
  } catch (error) {
    console.error('Error parsing user from localStorage:', error);
  }
  return token;
};

// Function to establish and store the socket connection
const socketConnection = () => {
  if (!socketInstance) {
    const token = getTokenFromLocalStorage();

    if (!token) {
      console.error('No token available. Cannot establish socket connection.');
      return null;
    }

    socketInstance = io(SOCKET_URL, {
      extraHeaders: {
        authorization: `bearer ${token}`,
      },
    });

    socketInstance.on('connect', () => {
      console.log('Socket connected successfully!');
    });

    socketInstance.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
  }

  return socketInstance;
};

// Function to get the existing socket instance
export const getSocket = () => socketInstance;

export default socketConnection;
