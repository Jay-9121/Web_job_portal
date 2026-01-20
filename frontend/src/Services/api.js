import axios from "axios";

const ApiFormData = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "multipart/form-data"
  }
});

const Api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});


export const createUserApi = (data) =>
  Api.post("/api/user/register", data);

export const loginUserApi = (data) =>
  Api.post("/api/user/loginuser", data);

export const getUser = () =>
  Api.get("/api/user/getallusers");

export const getUserById = (id) =>
  Api.get(`/api/user/getUserByid/${id}`);

export const updateUserById = (id, data) =>
  Api.put(`/api/user/updateUserByid/${id}`, data);

export const deleteUserById = (id) =>
  Api.delete(`/api/user/deleteuser/${id}`);

const Config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`
  }
};

