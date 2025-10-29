import { createContext, useState, useContext } from "react";
import { obtenerTareasRequest, eliminarTareaRequest, crearTareaRequest, obtenerTareaRequest, actualizarTareaRequest } from "../api/tareas.api";
import parseErrors from "../utils/parseError";

const TareaContext = createContext();
export const useTareas = () => {
  const context = useContext(TareaContext);
  if (!context) {
    throw new Error("useTareas must be used within a TareaProvider");
  }
  return context;
}

export const TareaProvider = ({ children }) => {
  const [tareas, setTareas] = useState([]);
  const [errors, setError] = useState([]);
  const clearErrors = () => setError([]);

  const listarTareas = async () => {
    const response = await obtenerTareasRequest()
    setTareas(response.data);
  }

  const cargarTarea = async (id) => {
    clearErrors();
    const res = await obtenerTareaRequest(id);
    return res.data;
  }


  const crearTarea = async (tarea) => {
    clearErrors();
    try {
      const res = await crearTareaRequest(tarea);
      clearErrors();
      setTareas(prev => [...prev, res.data]);
      return res.data;
    } catch (error) {
      const errs = parseErrors(error);
      setError(errs);
    }
  }

  const eliminarTarea = async (id) => {
    const res = await eliminarTareaRequest(id);
    if (res.status === 204) {
      setTareas(prev => prev.filter(tarea => tarea.id !== id));
    }
  }

  const editarTarea = async (id, tarea) => {
    clearErrors();
    try {
      const res = await actualizarTareaRequest(id, tarea);
      clearErrors();
      setTareas(prev => prev.map(t => t.id === id ? res.data : t));
      return res.data;
    } catch (error) {
      const errs = parseErrors(error);
      setError(errs);
    }
  }

  return (
    <TareaContext.Provider value={{ tareas, listarTareas, eliminarTarea, crearTarea, cargarTarea, errors, editarTarea, clearErrors }}>
      {children}
    </TareaContext.Provider>
  );
};