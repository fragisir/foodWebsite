import axios from 'axios';

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Important for cookies
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
    (config) => {
        // Token is automatically sent via cookies (HttpOnly)
        // But we also add it to headers as a fallback if cookies fail
        if (typeof window !== 'undefined') {
            try {
                const storage = localStorage.getItem('auth-storage');

                if (storage) {
                    const parsed = JSON.parse(storage);

                    const token = parsed.state?.token;

                    if (token) {
                        // Handle both AxiosHeaders and plain objects
                        if (config.headers && typeof config.headers.set === 'function') {
                            config.headers.set('Authorization', `Bearer ${token}`);
                        } else {
                            config.headers = config.headers || {};
                            config.headers['Authorization'] = `Bearer ${token}`;
                        }
                    }
                }
            } catch (error) {
                console.error('Error reading token from storage:', error);
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for handling errors
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Unauthorized - clear storage and redirect
            if (typeof window !== 'undefined') {
                console.log('401 Unauthorized - Clearing session and redirecting');
                localStorage.removeItem('auth-storage');
                window.location.href = '/';
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;
