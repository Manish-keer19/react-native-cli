// // import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// // import AsyncStorage from "@react-native-async-storage/async-storage";
// // import { useDispatch } from "react-redux";
// // import { useEffect } from "react";

// // // Define the user state interface with proper types
// // interface UserState {
// //   user: object | null;
// //   token: string | null;
// // }

// // const initialState: UserState = {
// //   user: null,
// //   token: null,
// // };

// // const userSlice = createSlice({
// //   name: "User",
// //   initialState,
// //   reducers: {
// //     // Set user action
// //     setUser: (state, action: PayloadAction<object | null>) => {
// //       state.user = action.payload;
// //       console.log("userdata in userslice ", state.user);

// //       // Save user data to AsyncStorage
// //       AsyncStorage.setItem("userData", JSON.stringify(state.user))
// //         .then(() => {
// //           console.log("User saved successfully in AsyncStorage");
// //         })
// //         .catch((error) => {
// //           console.error(
// //             "Could not save the user data into AsyncStorage",
// //             error
// //           );
// //         });
// //     },

// //     setToken: (state, action: PayloadAction<string | null>) => {
// //       state.token = action.payload;
// //       console.log("token in userslice ", state.token);

// //       // Save token to AsyncStorage
// //       AsyncStorage.setItem("token", JSON.stringify(state.token))
// //         .then(() => {
// //           console.log("Token saved successfully in AsyncStorage");
// //         })
// //         .catch((error) => {
// //           console.error("Could not save the token into AsyncStorage", error);
// //         });
// //     },
// //     loadtokendata: (state, action: PayloadAction<string | null>) => {
// //       state.token = action.payload;
// //     },
// //     // Load user data action
// //     loadUserdata: (state, action: PayloadAction<object | null>) => {
// //       state.user = action.payload; // Load the user data
// //     },
// //   },
// // });

// // // Action creators generated from the slice
// // export const { setUser, loadUserdata } = userSlice.actions;

// // // Function to load user data from AsyncStorage
// // const loadUserdataFromStorage = async () => {
// //   try {
// //     const userData = await AsyncStorage.getItem("userData");
// //     return userData != null ? JSON.parse(userData) : null;
// //   } catch (error) {
// //     console.error("Error loading user data: ", error);
// //     return null;
// //   }
// // };

// // // Custom hook to load profile data on component mount
// // export const useLoadUserData = () => {
// //   const dispatch = useDispatch();

// //   useEffect(() => {
// //     const loadData = async () => {
// //       const user = await loadUserdataFromStorage();
// //       if (user) {
// //         dispatch(loadUserdata(user)); // Dispatch loaded user data to Redux
// //       }
// //     };

// //     loadData();
// //   }, [dispatch]); // Ensure dispatch is included in the dependency array
// // };

// // export default userSlice.reducer;

// import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useDispatch } from "react-redux";
// import { useEffect } from "react";

// // Define the user state interface with proper types
// interface UserState {
//   user: object | null;
//   token: string | null;
// }

// const initialState: UserState = {
//   user: null,
//   token: null,
// };

// const userSlice = createSlice({
//   name: "User",
//   initialState,
//   reducers: {
//     // Set user action
//     setUser: (state, action: PayloadAction<object | null>) => {
//       state.user = action.payload;
//       console.log("userdata in userslice ", state.user);

//       // Save user data to AsyncStorage
//       AsyncStorage.setItem("userData", JSON.stringify(state.user))
//         .then(() => {
//           console.log("User saved successfully in AsyncStorage");
//         })
//         .catch((error) => {
//           console.error(
//             "Could not save the user data into AsyncStorage",
//             error
//           );
//         });
//     },

//     setToken: (state, action: PayloadAction<string | null>) => {
//       state.token = action.payload;
//       console.log("token in userslice ", state.token);

//       // Save token to AsyncStorage
//       AsyncStorage.setItem("token", JSON.stringify(state.token))
//         .then(() => {
//           console.log("Token saved successfully in AsyncStorage");
//         })
//         .catch((error) => {
//           console.error("Could not save the token into AsyncStorage", error);
//         });
//     },
//     loadTokenData: (state, action: PayloadAction<string | null>) => {
//       state.token = action.payload;
//       console.log("token is in loadtokendata ", state.token);
//     },
//     // Load user data action
//     loadUserdata: (state, action: PayloadAction<object | null>) => {
//       state.user = action.payload; // Load the user data
//       console.log("user is  in Loadeduerdata ", state.user);
//     },
//   },
// });

// // Action creators generated from the slice
// export const { setUser, setToken, loadUserdata, loadTokenData } =
//   userSlice.actions;

// // Function to load user data and token from AsyncStorage
// const loadUserDataFromStorage = async () => {
//   try {
//     const userData = await AsyncStorage.getItem("userData");
//     const tokenData = await AsyncStorage.getItem("token");

//     return {
//       user: userData != null ? JSON.parse(userData) : null,
//       token: tokenData != null ? JSON.parse(tokenData) : null,
//     };
//   } catch (error) {
//     console.error("Error loading user data: ", error);
//     return { user: null, token: null };
//   }
// };

// // Custom hook to load profile data and token on component mount
// export const useLoadUserData = () => {
//   const dispatch = useDispatch();

//   useEffect(() => {
//     const loadData = async () => {
//       const { user, token } = await loadUserDataFromStorage();
//       if (user) {
//         dispatch(loadUserdata(user)); // Dispatch loaded user data to Redux
//       }
//       if (token) {
//         dispatch(loadTokenData(token)); // Dispatch loaded token to Redux
//       }
//     };

//     loadData();
//   }, [dispatch]); // Ensure dispatch is included in the dependency array
// };

// // // Function to remove userData from AsyncStorage
// // const removeUserData = async () => {
// //   try {
// //     await AsyncStorage.removeItem('userData');

// //     console.log("userData removed successfully");
// //   } catch (error) {
// //     console.error("Error removing userData:", error);
// //   }
// // };

// // // Call the function whenever you need to remove userData
// // removeUserData();

// export default userSlice.reducer;

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { clearProfileData } from "../Profile/ProfileSlice";

// Define the user state interface with proper types

interface UserState {
  user: object | null;
  token: string | null;
}

const initialState: UserState = {
  user: null,
  token: null,
};

const userSlice = createSlice({
  name: "User",
  initialState,
  reducers: {
    // Set user action
    setUser: (state, action: PayloadAction<object | null>) => {
      state.user = action.payload;
      console.log("userdata in userslice ", state.user);

      // Save user data to AsyncStorage
      AsyncStorage.setItem("userData", JSON.stringify(state.user))
        .then(() => {
          console.log("User saved successfully in AsyncStorage");
        })
        .catch((error) => {
          console.error(
            "Could not save the user data into AsyncStorage",
            error
          );
        });
    },

    setToken: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;
      console.log("token in userslice ", state.token);

      // Save token to AsyncStorage
      AsyncStorage.setItem("token", JSON.stringify(state.token))
        .then(() => {
          console.log("Token saved successfully in AsyncStorage");
        })
        .catch((error) => {
          console.error("Could not save the token into AsyncStorage", error);
        });
    },

    loadTokenData: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;
      console.log("token is in loadtokendata ", state.token);
    },

    // Load user data action
    loadUserdata: (state, action: PayloadAction<object | null>) => {
      state.user = action.payload; // Load the user data
      console.log("user is  in Loadeduerdata ", state.user);
    },

    // Logout action
    logout: (state) => {
      state.user = null; // Clear user data
      state.token = null; // Clear token
      console.log("User logged out and state cleared.");

      // Clear user data and token from AsyncStorage
      AsyncStorage.removeItem("userData")
        .then(() => {
          console.log("token removed succefully from AsyncStorage");
        })
        .catch((error) => {
          console.error("Could not remove userData from AsyncStorage", error);
        });
      AsyncStorage.removeItem("token")
        .then(() => {
          console.log("userdata removed succefully from AsyncStorage");
        })
        .catch((error) => {
          console.error("Could not remove token from AsyncStorage", error);
        });
    },
  },
});

// Action creators generated from the slice
export const { setUser, setToken, loadUserdata, loadTokenData, logout } =
  userSlice.actions;

// Function to load user data and token from AsyncStorage
const loadUserDataFromStorage = async () => {
  try {
    const userData = await AsyncStorage.getItem("userData");
    const tokenData = await AsyncStorage.getItem("token");

    return {
      user: userData != null ? JSON.parse(userData) : null,
      token: tokenData != null ? JSON.parse(tokenData) : null,
    };
  } catch (error) {
    console.error("Error loading user data: ", error);
    return { user: null, token: null };
  }
};

// Custom hook to load profile data and token on component mount
export const useLoadUserData = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const loadData = async () => {
      const { user, token } = await loadUserDataFromStorage();
      if (user) {
        dispatch(loadUserdata(user)); // Dispatch loaded user data to Redux
      }
      if (token) {
        dispatch(loadTokenData(token)); // Dispatch loaded token to Redux
      }
    };

    loadData();
  }, [dispatch]); // Ensure dispatch is included in the dependency array
};

export default userSlice.reducer;
