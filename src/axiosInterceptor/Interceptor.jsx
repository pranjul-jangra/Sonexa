import axios from 'axios';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext'; // Adjust path accordingly

const axiosInterceptor = () => {
    const { token, setToken, setUser, setProfileLoading } = useContext(UserContext);

    const axiosInstance = axios.create({
        baseURL: import.meta.env.VITE_SERVER_URL,
        withCredentials: true,
    });

    // Request interceptor
    axiosInstance.interceptors.request.use((config) => {
        if (
            !config.url.includes('/register') &&
            !config.url.includes('/login') &&
            !config.url.includes('/refresh') &&
            token
        ) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
        (error) => Promise.reject(error)
    );

    // Response interceptor
    axiosInstance.interceptors.response.use(
        // Set profile loader to false if the response is getted successfully
        (response) => {
            setProfileLoading(false);
            return response;
        },

        async (error) => {
            const originalRequest = error.config;

            // set the profile loader to false after the interceptor has retried request or no user found
            if (error.response?.status !== 401 || originalRequest._retried) setProfileLoading(false);

            if (error.response?.status === 401 && !originalRequest._retried) {
                originalRequest._retried = true;

                try {
                    const res = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/admin/refresh`, {}, { withCredentials: true });
                    const newToken = res.data?.newToken;
                    const newUser = res.data?.newUser;

                    if (newToken) {
                        setToken(newToken);
                        setUser(newUser || null);

                        originalRequest.headers.Authorization = `Bearer ${newToken}`;
                        return axios(originalRequest);
                    } else {
                        throw new Error('No access token received');
                    }

                } catch (refreshError) {
                    setToken(null);
                    // Set profile loading to false if token refreshment fails
                    setProfileLoading(false);
                    return Promise.reject(refreshError);
                }
            }
            return Promise.reject(error);
        }
    );
    return axiosInstance;
};

export default axiosInterceptor;
