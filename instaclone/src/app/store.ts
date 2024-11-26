import {configureStore} from '@reduxjs/toolkit';
import ProfileReducer from '../features/Profile/ProfileSlice'; // Correct import for the profile slice
import UserReducer from '../features/user/userSlice';
import onlineUsersReducer from '../features/socket/onlineUsersSlice';
import {socketMiddleware} from '../features/middleware/socketMiddleware';
export const store = configureStore({
  reducer: {
    Profile: ProfileReducer, // Correctly use the reducer name as "profile"
    User: UserReducer,
    onlineUsers: onlineUsersReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(socketMiddleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: { profile: ProfileState }
export type AppDispatch = typeof store.dispatch;
