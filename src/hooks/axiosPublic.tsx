import axios from "axios";

const instance = axios.create({
    baseURL: "https://api.meteorologyclub.com/api/v1",
    withCredentials: true,
});

const axiosPublic = () => {
    return instance
}

export default axiosPublic;