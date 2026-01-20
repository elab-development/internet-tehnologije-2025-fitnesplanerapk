import axios from "axios";

const axiosClient = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
   
});


axiosClient.interceptors.request.use((config)=>{
    const token=localStorage.getItem("ACCESS_TOKEN")
    //config.headers.Authorization='Bearer ${token}'
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
})

axiosClient.interceptors.response.use((response)=>{
  return response;  
}, (error)=>{
    try{
        const {response}=error;
        if(response.status===403){
            localStorage.removeItem('ACCESS_TOKEN');
        }
    }
    catch(e){
        console.log(e);
    }

    throw error;
})

export default axiosClient;
// import axios from "axios";

// const axiosClient = axios.create({
//   baseURL: "http://127.0.0.1:8000/api", // Laravel backend
//   // važno ako koristimo cookies ili token u budućnosti
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// axiosClient.interceptors.request.use((config) => {
//   const token = localStorage.getItem("ACCESS_TOKEN"); // obrati pažnju na getItem, ne get
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// axiosClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     const response = error.response;
//     if (response && response.status === 403) {
//       localStorage.removeItem("ACCESS_TOKEN");
//     }
//     throw error;
//   }
// );

// export default axiosClient;
