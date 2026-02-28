import axios, { AxiosInstance } from 'axios';

// central axios instance that components/services can share
// configure the baseURL via Vite environment variable so it can be changed
// per-environment without touching code.
//
// NOTE: VITE_ prefix is required for Vite to expose the variable to the
// browser. You can define it in a `.env` file at the project root:
//
//    VITE_API_BASE_URL=http://localhost:4000
//
// or override it when starting the dev server:
//
//    VITE_API_BASE_URL=https://api.myserver.com pnpm dev

const baseURL = import.meta.env.VITE_API_BASE_URL || '';

const api: AxiosInstance = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// optional: interceptors for logging / auth can be added here

export default api;
