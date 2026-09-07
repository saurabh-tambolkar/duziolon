import axios from "axios";
import {getCookie} from "../../lib/getCookie"

export const apiClient = axios.create({
    // baseURL: "http://localhost:5000/api",
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    withCredentials:true,
})

apiClient.interceptors.request.use(
    (config) => {
        // const accessToken = document.cookie.split("=")[1];
        const accessToken =  getCookie("duziolon");
        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        // Handle request errors
        return Promise.reject(error);
    }
);



apiClient.interceptors.response.use(function(response){
    return response
},function (error){

    const originalRequest = error.config;
    console.log("hello user api")

    if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true

        return (async()=>{
            try{
                console.log("hello api")
                const refreshToken=localStorage.getItem('duziolonRefreshToken')
                console.log("token is ",refreshToken)
                const {data } = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/refresh-token/${refreshToken}`);
                // if(!success){
                //     console.log("Refresh token failed");
                // }
                console.log("data",data)
                document.cookie=`duziolon=${data.accessToken}; max-age=${60*60}; Path=/; Secure; SameSite=Strict;`
                
                // Retry the original request with the new token
                originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;
                return apiClient(originalRequest);
            }
            catch (refreshError) {
                console.error('Token refresh failed:', refreshError);
                document.cookie =
        "duziolon=; Max-Age=0; Path=/; SameSite=Strict";
                // setCurrentUser(null);
                localStorage.removeItem('duziolonRefreshToken');
                // Handle logout or redirect to login page
                
                //Handle logout or redirect to login page
                            
                return Promise.reject(refreshError);
            }
        })();
    }

    return Promise.reject(error);
})

export default apiClient;
