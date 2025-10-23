import api from "./axiosInstance";

export const getCursos = () => api.get('/cursos/');

export const getCursoById = (id) => api.get(`/cursos/${id}/`)