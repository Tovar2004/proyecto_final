// src/services/emailService.js
import emailjs from '@emailjs/browser';

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_REPORTE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_REPORTE_ID;
const TEMPLATE_ESTADO_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ESTADO_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export const enviarCorreoReporte = async (datosIncidencia) => {
  const templateParams = {
    nombre: datosIncidencia.nombre,
    apellido: datosIncidencia.apellido,
    correo: datosIncidencia.correo,
    categoria: datosIncidencia.categoria,
    descripcion: datosIncidencia.descripcion,
    direccion: datosIncidencia.direccion,
    estado: 'Pendiente',
    fecha: new Date().toLocaleDateString('es-CO', {
      year: 'numeric', month: 'long', day: 'numeric', hour: "2-digit",
        minute: "2-digit",
    }),
  };

  await emailjs.send(SERVICE_ID, TEMPLATE_REPORTE_ID, templateParams, PUBLIC_KEY);
};

export const enviarCorreoCambioEstado = async (datosIncidencia, nuevoEstado) => {
  const templateParams = {
    nombre: datosIncidencia.nombre,
    apellido: datosIncidencia.apellido,
    correo: datosIncidencia.correo,
    categoria: datosIncidencia.categoria,
    descripcion: datosIncidencia.descripcion,
    direccion: datosIncidencia.direccion,
    estado: nuevoEstado,
    fecha: new Date().toLocaleDateString('es-CO', {
      year: 'numeric', month: 'long', day: 'numeric',hour: "2-digit",
        minute: "2-digit",
    }),
  };

  await emailjs.send(SERVICE_ID, TEMPLATE_ESTADO_ID, templateParams, PUBLIC_KEY);
};