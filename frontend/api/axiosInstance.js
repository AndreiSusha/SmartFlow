import axios from "axios";


const api = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_BASE_URL
})

export default api;