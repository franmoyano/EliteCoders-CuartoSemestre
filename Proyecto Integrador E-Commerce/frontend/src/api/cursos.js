import api from "./axiosInstance";

export const getCursos = () => api.get('/cursos/');