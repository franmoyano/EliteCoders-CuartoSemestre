import api from "./axiosInstance";

export const getCursos = () => api.get('/cursos/');

export const getCursoById = (id) => api.get(`/cursos/${id}/`)

export const getMisCursos = () => api.get('/mis-cursos/')

export const getCursoLecciones = (courseId) => api.get(`/cursos/${courseId}/lecciones/`)

export const uninscriptFromCourse = (courseId) => api.delete(`/cursos/${courseId}/desinscribir/`)