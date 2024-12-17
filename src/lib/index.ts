import axios from "axios";

export const { VITE_PUBLIC_BASE_URL } = import.meta.env

export const requester = axios.create({
    baseURL: `${VITE_PUBLIC_BASE_URL}`,
    headers: {
        'Content-Type': 'application/json'
    }
});
