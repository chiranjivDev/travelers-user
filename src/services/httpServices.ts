import axios from 'axios';
import store from '../store/store';

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {},
});
console.log('base url', process.env.BASE_URL);

// Function to refresh access token
const refreshAccessToken = async () => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}auth/refresh`,
      {},
      { withCredentials: true }
    );
    const newAccessToken = response.data.access_token;

    if (newAccessToken) {
      // Update localStorage
      const userFromLocalStorage = localStorage.getItem('user');
      if (userFromLocalStorage) {
        const user = JSON.parse(userFromLocalStorage);
        user.access_token = newAccessToken;
        localStorage.setItem('user', JSON.stringify(user));
      }

      return newAccessToken;
    }
  } catch (error) {
    console.error('Failed to refresh access token', error);
    return null;
  }
};

// Add request interceptor to include auth token
axiosInstance.interceptors.request.use(
  (config) => {
    // Retrieve the user object from localStorage
    const userFromLocalStorage = localStorage.getItem('user');

    if (userFromLocalStorage) {
      try {
        // Parse the user object
        const user = JSON.parse(userFromLocalStorage);

        // Extract the access_token
        const token = user?.access_token;

        // If token exists, set it in the Authorization header
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
      } catch (error) {
        console.error('Error parsing user object from localStorage:', error);
      }
    }

    // Uncomment this part if you want to use the token from Redux instead of localStorage
    // const tokenFromRedux = store.getState().auth.token;
    // console.log('Token from Redux:', tokenFromRedux);

    // If you later want to use Redux, you can replace this with the Redux token check
    // else if (tokenFromRedux) {
    //   config.headers['Authorization'] = `Bearer ${tokenFromRedux}`;
    // }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to refresh token on 401
axiosInstance.interceptors.response.use(
  (response) => response, // Pass successful responses
  async (error) => {
    if (error.response?.status === 401) {
      console.log('Access token expired, attempting to refresh...');
      const newAccessToken = await refreshAccessToken();
      if (newAccessToken) {
        error.config.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return axiosInstance.request(error.config); // Retry the failed request
      } else {
        console.error('Failed to refresh token, logging out...');
        localStorage.removeItem('user'); // Clear storage
        window.location.href = '/login'; // Redirect to login page
      }
    }
    return Promise.reject(error);
  }
);

// for admin (will refactor later)
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const { admin } = store.getState();

//     const token = admin?.user?.access_token;

//     if (token) {
//       config.headers['Authorization'] = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// updated implementation with refresh token handling ======================================>
// import axios from 'axios';

// const axiosInstance = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL,
// });

// // Function to refresh the token
// const refreshAccessToken = async () => {
//   try {
//     const userFromLocalStorage = localStorage.getItem('user');
//     if (!userFromLocalStorage) throw new Error('No user found in localStorage');

//     const user = JSON.parse(userFromLocalStorage);
//     const refreshToken = user?.refresh_token;

//     if (!refreshToken) throw new Error('No refresh token available');

//     const response = await axios.post(
//       `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
//       {
//         refresh_token: refreshToken,
//       }
//     );

//     const newTokens = response.data;
//     localStorage.setItem('user', JSON.stringify(newTokens));

//     return newTokens.access_token;
//   } catch (error) {
//     console.error('Error refreshing token:', error);
//     localStorage.removeItem('user');
//     window.location.href = '/login'; // Redirect to login
//     return null;
//   }
// };

// // Add request interceptor
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const userFromLocalStorage = localStorage.getItem('user');
//     if (userFromLocalStorage) {
//       const user = JSON.parse(userFromLocalStorage);
//       const token = user?.access_token;
//       if (token) {
//         config.headers['Authorization'] = `Bearer ${token}`;
//       }
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Add response interceptor to handle token expiration
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       const newAccessToken = await refreshAccessToken();
//       if (newAccessToken) {
//         axios.defaults.headers.common['Authorization'] =
//           `Bearer ${newAccessToken}`;
//         originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
//         return axiosInstance(originalRequest);
//       }
//     }
//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;
