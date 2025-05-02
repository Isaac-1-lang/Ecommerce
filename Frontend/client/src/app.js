import axios from "axios";


const API = axios.create({
    baseURL:"http://localhost:5000/api",
});



export const getAllProducts = () => API.get("/products");



export const addProducts = (productData) => API.post("/products",productData);