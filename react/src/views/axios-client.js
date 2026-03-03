

// const axiosClient = axios.create({
//     baseURL: 'http://127.0.0.1:8000/api',
   
// });

// const axiosClient = axios.create({
//     baseURL: 'http://127.0.0.1:8000/api',
//     withCredentials: true,
//     headers: {
//         'Content-Type': 'application/json',
//         'Accept': 'application/json',
//     },
// });
// axiosClient.interceptors.request.use((config)=>{
//     const token=localStorage.getItem("ACCESS_TOKEN")
    
//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
// })

// axiosClient.interceptors.response.use((response)=>{
//   return response;  
// }, (error)=>{
//     try{
//         const {response}=error;
//         if(response.status===401){
//             localStorage.removeItem('ACCESS_TOKEN');
//         }
//     }
//     catch(e){
//         console.log(e);
//     }

//     throw error;
// })

// export default axiosClient;

// src/axios-client.js (or wherever it lives)
// src/axios-client.js
import axios from "axios";

const axiosClient = axios.create({
  baseURL: '/api',   // ← this is key! Vite proxy will forward /api → laravel-app:8000
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("ACCESS_TOKEN");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("ACCESS_TOKEN");
      // Optional: redirect to login
      // window.location.href = '/login';
    }
    throw error;
  }
);

export default axiosClient;