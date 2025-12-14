import axios from "axios";

const movieAxios = axios.create({
    baseURL: "https://api.themoviedb.org/3/",
    headers: {
        "Authorization": `Bearer ${import.meta.env.VITE_MOVIE_API_KEY}`,
        "accept": "application/json",
    },
});

movieAxios.interceptors.request.use((config) => {
    console.log("[ request ] : ", config);
    return config; 
}, (error) => {
    console.log("[ request error ] : ", error);
    return Promise.reject(error);
});

export default movieAxios;