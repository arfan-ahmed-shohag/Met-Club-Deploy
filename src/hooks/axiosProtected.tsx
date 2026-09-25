import axios from "axios";
import useLogout from "./useLogout";
import { useEffect } from "react";



const instance = axios.create({
    baseURL: "https://api.meteorologyclub.com/api/v1",
    withCredentials: true,
});

const useAxiosProtected = () => {

    const handleLogout = useLogout();

    useEffect(() => {
        const requestInterceptor = instance.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem("token");

                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }

                const isFormData = typeof FormData !== "undefined" && config.data instanceof FormData;
                if (isFormData) {
                    delete config.headers["Content-Type"];
                } else {
                    config.headers["Content-Type"] = "application/json"
                }

                return config;
            },
            (error) => Promise.reject(error)
        );

        const responseInterceptor = instance.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;


                const isRefreshRequest = originalRequest.url.includes("/auth/refresh-token");

                console.log(error.response?.status);
                if (error.response?.status === 401) {

                    if (isRefreshRequest) {
                        handleLogout()
                        return Promise.reject(error);
                    }

                    if (!originalRequest._retry) {
                        originalRequest._retry = true;

                        console.log(originalRequest._retry);


                        const response = await instance("/auth/refresh-token")

                        if (response.data.success) {
                            localStorage.setItem("token", response.data.data.accessToken);

                            originalRequest.headers.Authorization = `Bearer ${response.data.data.accessToken}`;

                            return instance(originalRequest);
                        }
                        else {
                            handleLogout();
                            return Promise.reject(error);
                        }
                    }
                }

                return Promise.reject(error);
            }
        );

        return () => {
            instance.interceptors.request.eject(requestInterceptor);
            instance.interceptors.response.eject(responseInterceptor);
        }
    }, [handleLogout])

    return instance;
};

export default useAxiosProtected;