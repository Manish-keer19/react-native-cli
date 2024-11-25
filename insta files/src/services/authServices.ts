// class AuthService {
//     // Define the types for the data parameter and return type
//     async Signup(data: object): Promise<any> {
//       try {
//         const res = await fetch("http://192.168.198.139:3000/api/v1/auth/signup", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(data), // Convert data to string
//         });

//         const result = await res.json(); // Rename to avoid conflict with the function argument `data`
//         console.log("Response data is ", result);

//         if (result.success) {
//           console.log("Signup completed");
//           return result;
//         }
//       } catch (error) {
//         console.error("Error:", error);
//         console.log("Could not signup, some error occurred");
//       }
//     }

//     // Define the types for the data parameter and return type
//     async generateOtp(data: object): Promise<any> {
//       try {
//         const res = await fetch("http://192.168.198.139:3000/api/v1/auth/generateOtp", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(data), // Convert data to string
//         });

//         const result = await res.json(); // Rename to avoid conflict with the function argument `data`
//         console.log("Response data is ", result);

//         if (result.success) {
//           console.log("OTP generated");
//           return result;
//         }
//       } catch (error) {
//         console.error("Error:", error);
//         console.log("Could not generate OTP, some error occurred");
//       }
//     }
//   }

//   // Export the AuthService instance
//   export const AuthServiceInstance = new AuthService();

import apiClient from "./apiClient";
class AuthService {
  // Define the types for the data parameter and return type
  async Signup(data: object): Promise<any> {
    try {
      const res = await apiClient.post("/auth/signup", data); // Using apiClient with base URL

      console.log("res sign up is", res.data);

      if (res.data.success) {
        console.log("Signup completed");
        return res.data;
      }
    } catch (error) {
      console.log("could not create signup:", error);
      console.log("Could not signup, some error occurred");
    }
  }

  // Define the types for the data parameter and return type
  async generateOtp(data: object): Promise<any> {
    try {
      const res = await apiClient.post("/auth/generateOtp", data); // Using apiClient with base URL
      console.log("res of generate otp is ", res.data);
      if (res.data.success) {
        console.log("OTP generated");
        return res.data;
      }
    } catch (error) {
      console.error("Error:", error);
      console.log("Could not generate OTP, some error occurred");
    }
  }

  async login(data: object) {
    console.log("data in login authservice", data);
    try {
      const res = await apiClient.post("/auth/login", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("res.data of login", res.data);
      if (res.data.success) {
        console.log("login completed");
        return res.data;
      } else {
        console.log("could not login", res.data.message);
      }
    } catch (error) {
      console.log("could not login", error);
    }
  }

  async checkIfUsernameAlreadyTaken(data: object) {
    console.log("data in isUsernameAlreadyTaken authservice", data);
    try {
      const res = await apiClient.post("/auth/isUsernameAlreadyTaken", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("res.data of useralready taken", res.data);
      if (res.data.success) {
        console.log("username is not taken");
        console.log("res message is ", res.data.message);
        return res.data;
      } else {
        console.log("username is taken", res.data.message);
      }
    } catch (error) {
      console.log("some error occured during isUsernameAlreadyTaken", error);
    }
  }


  async sendOtp(data: object): Promise<any> {
    try {
      const res = await apiClient.post("/auth/generateOtp", data); // Using apiClient with base URL
      console.log("res of generate otp is ", res.data);
      if (res.data.success) {
        console.log("OTP generated");
        return res.data;
      }
    } catch (error) {
      console.error("Error:", error);
      console.log("Could not generate OTP, some error occurred");
    }
  }
  async ResetPassword(data: object) {
    console.log("data in ResetPassword authservice", data);
    try {
      const res = await apiClient.post("/auth/resetPassword", data);

      console.log("res.data of ResetPassword", res.data);
      if (res.data.success) {
        console.log("ResetPassword completed");
        console.log("res message is ", res.data.message);
        return res.data;
      } else {
        console.log("could not ResetPassword", res.data.message);
      }
    } catch (error) {
      console.log("could not ResetPassword", error);
    }
  }
  async changePassword(data: object) {
    console.log("data in changePassword authservice", data);
    try {
      const res = await apiClient.post("/auth/changePassword", data);

      console.log("res.data of changePassword", res.data);
      if (res.data.success) {
        console.log("changePassword completed");
        console.log("res message is ", res.data.message);
        return res.data;
      } else {
        console.log("could not changePassword", res.data.message);
      }
    } catch (error) {
      console.log("could not changePassword", error);
    }
  }
}

// Export the AuthService instance
export const AuthServiceInstance = new AuthService();
