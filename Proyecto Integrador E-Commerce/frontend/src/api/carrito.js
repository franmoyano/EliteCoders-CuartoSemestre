import api from './axiosInstance';

/**
 * Obtiene el carrito activo del usuario.
 * Si no existe, se crea automáticamente.
 */
export const getCarrito = () => api.get('/carrito/');

/**
 * Agrega un curso al carrito.
 * @param {number} carritoId - ID del carrito activo
 * @param {number} cursoId - ID del curso a agregar
 */
export const agregarCursoCarrito = (carritoId, cursoId) =>
  api.post(`/carrito/${carritoId}/agregar/`, { curso_id: cursoId });

/**
 * Quita un curso del carrito.
 * @param {number} carritoId - ID del carrito activo
 * @param {number} cursoId - ID del curso a quitar
 */
export const quitarCursoCarrito = (carritoId, cursoId) =>
  api.post(`/carrito/${carritoId}/quitar/`, { curso_id: cursoId });

/**
 * Vacía todo el carrito.
 * @param {number} carritoId - ID del carrito activo
 */
export const vaciarCarrito = (carritoId) =>
  api.post(`/carrito/${carritoId}/vaciar/`);

/**
 * Hace checkout del carrito: crea el pedido e inscribe al usuario en los cursos.
 * @param {number} carritoId - ID del carrito activo
 */
export const checkoutCarrito = (carritoId) =>
  api.post(`/carrito/${carritoId}/checkout/`);
