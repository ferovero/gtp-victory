import axios from "axios";
// console.log("AXIOS BASE URL :: ", process.env.NEXT_PUBLIC_SERVER_BASE_URL);
const options = {
    baseURL: process.env.NEXT_PUBLIC_SERVER_BASE_URL,
    withCredentials: true,
    // timeout: 10000,
};
const API = axios.create(options);
export const APIRefresh = axios.create(options);
APIRefresh.interceptors.response.use((response) => response);
API.interceptors.response.use(
    (response) => {
        return response.data;
    },
    async (error) => {
        const data = error?.response?.data;
        const status = error?.response?.status;
        // console.log(data?.errorCode);
        // 'UNAUTHORIZED_ERROR
        if (data?.errorCode === 'NEED_TO_REFRESH_TOKEN' && +status === 401) {
            try {
                await APIRefresh.get("/auth/refresh");
                return API(error.config);
            } catch (error) {
                console.log(error);
            }
        };
        return Promise.reject({
            ...data
        });
    }
);

export default API;