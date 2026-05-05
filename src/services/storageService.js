// src/services/storageService.js
import { storage } from '../firebase/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const subirImagen = async (archivo, carpeta = 'incidencias') => {
  const nombreArchivo = `${carpeta}/${Date.now()}_${archivo.name}`;
  const storageRef = ref(storage, nombreArchivo);
  const snapshot = await uploadBytes(storageRef, archivo);
  const url = await getDownloadURL(snapshot.ref);
  return url;
};