import { combineReducers } from 'redux';
import authReducer from '../app/signup/redux/authSlice';
import userReducer from '../app/admin/users/redux/userSlice';
import adminReducer from '../app/admin/login/redux/adminLoginSlice';
import packagesReducer from '../app/sender/dashboard/redux/packagesSlice';
import tripsReducer from '../app/traveler/redux/tripsSlice';
import adminpackagesReducer from '../app/admin/packages/redux/packagesSlice';
import orderReducer from '../app/sender/dashboard/redux/orderSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  packages: packagesReducer,
  trips: tripsReducer,
  users: userReducer,
  admin: adminReducer,
  adminpackages: adminpackagesReducer,
  order: orderReducer, // orders
});

export default rootReducer;
