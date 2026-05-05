// src/services/emailService.js
import emailjs from '@emailjs/browser';

const SERVICE_ID = 'service_yg3k96d';  
const TEMPLATE_REPORTE_ID = 'template_l5jb8qm'; 
const TEMPLATE_ESTADO_ID = 'template_w180pob';  
const PUBLIC_KEY = '6FHxKpSscv5sPcERE';  

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