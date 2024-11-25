import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define types for user and onlineUsers state
interface OnlineUsersState {
  onlineUsers: { [key: string]: string }; // userId -> socketId mappings
}

interface AddUserPayload {
  userId: string;
  socketId: string;
}

interface RemoveUserPayload {
  userId: string;
}

interface UpdateUserStatusPayload {
  userId: string;
  status: string;
}

// Initial state
const initialState: OnlineUsersState = {
  onlineUsers: {},
};

// Online Users slice
const onlineUsersSlice = createSlice({
  name: "onlineUsers",
  initialState,
  reducers: {
    // Add a user to the online users object
    addUser: (state, action: PayloadAction<AddUserPayload>) => {
      const { userId, socketId } = action.payload;
      state.onlineUsers[userId] = socketId; // Add user to online users object
    },

    // Remove a user from the online users object
    removeUser: (state, action: PayloadAction<RemoveUserPayload>) => {
      const { userId } = action.payload;
      delete state.onlineUsers[userId]; // Remove user from online users object
    },

    // Update user status (optional, you can modify this as needed)
    updateUserStatus: (
      state,
      action: PayloadAction<UpdateUserStatusPayload>
    ) => {
      const { userId, status } = action.payload;
      // Here you could update user status if necessary
      console.log(`User ${userId} is now ${status}`);
    },
  },
});

// Selector to check if a user is online
export const isUserOnline = (
  state: { onlineUsers: OnlineUsersState },
  userId: string
): boolean => {
  return userId in state.onlineUsers.onlineUsers; // Check if user is in the online users object
};

// Actions
export const { addUser, removeUser, updateUserStatus } =
  onlineUsersSlice.actions;

// Reducer
export default onlineUsersSlice.reducer;
