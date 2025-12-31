import axios from 'axios';

const axiosInstance = axios.create({ baseURL: "http://localhost:4000" });

axiosInstance.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);



export default axiosInstance;

export const endpoints = {
    auth: {
        login: '/api/auth/login',
        register: '/api/auth/register',
        current: '/api/auth/current'
    }
}
