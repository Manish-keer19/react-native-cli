import axios from 'axios';

// export const BASE_URL = "http://192.168.67.139:3000";
// export const BASE_URL = "http://192.168.70.139:3000";
// export const BASE_URL = "http://192.168.31.139:3000";
// export const BASE_URL = "http://192.168.167.139:3000";
// export const BASE_URL = "http://192.168.105.139:3000";
// export const BASE_URL = "http://192.168.237.139:3000";
// export const BASE_URL = "http://192.168.237.139:3000";
// export const BASE_URL = "http://192.168.34.139:3000";
// export const BASE_URL = "http://192.168.120.139:3000";
// export const BASE_URL = "http://192.168.207.139:3000";
// export const BASE_URL = "http://192.168.141.139:3000";
// export const BASE_URL = "http://192.168.242.139:3000";
// export const BASE_URL = "http://192.168.137.139:3000";
// export const BASE_URL = 'http://192.168.102.139:3000';
// export const BASE_URL = 'http://192.168.45.139:3000';
// export const BASE_URL = 'http://192.168.124.139:3000';
export const BASE_URL = 'https://backend-insta-9x07.onrender.com';
// Create an Axios instance
const apiClient = axios.create({
  // baseURL: "http://192.168.158.139:3000/api/v1", // Set the base URL on68.45.139:3000/api/v1", // Set the base URL once here
  // baseURL: "http://192.168.158.139:3000/api/v1", // Set the base URL on68.45.139:3000/api/v1", // Set the base URL once here
  // baseURL: "http://192.168.207.139:3000/api/v1", // Set the base URL once here
  // baseURL: "http://192.168.207.139:3000/api/v1", // Set the base URL once here
  // baseURL: "http://192.168.136.139:3000/api/v1", // Set the base URL once here
  // baseURL: "http://192.168.126.139:3000/api/v1", // Set the base URL once here
  // baseURL: "http://192.168.5.139:3000/api/v1", // Set the base URL once here
  // baseURL: "http://192.168.14.139:3000/api/v1", // Set the base URL once here
  // baseURL: "http://192.168.137.1:3000/api/v1", // Set the base URL once here
  // baseURL: "http://192.168.81.139:3000/api/v1", // Set the base URL once here
  baseURL: `${BASE_URL}/api/v1`, // Set the base URL once here
  headers: {
    'Content-Type': 'application/json', // Set default headers if needed
  },
});

export default apiClient;
