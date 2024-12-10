import axios from "axios"

const api = axios.create({
    baseURL: "https://bfc0-2804-14c-5fd4-81cd-69c7-a3b6-c1a4-53c6.ngrok-free.app/api",
});

export default api;