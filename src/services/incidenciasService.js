import { db } from '../firebase/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, Timestamp, getDocs, orderBy, query } from 'firebase/firestore';

export const crearIncidencia = async (datos) => {
  const incidencia = {
    ...datos,
    estado: 'pendiente',
    fecha: Timestamp.now(),
  };
  const docRef = await addDoc(collection(db, 'incidencias'), incidencia);
  return docRef.id;
};

export const obtenerIncidencias = async () => {
  const q = query(collection(db, 'incidencias'), orderBy('fecha', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const actualizarEstado = async (id, nuevoEstado) => {
  const ref = doc(db, 'incidencias', id);
  await updateDoc(ref, { estado: nuevoEstado });
};

export const eliminarIncidencia = async (id) => {
  await deleteDoc(doc(db, 'incidencias', id));
};

export const actualizarPrioridad = async (id, prioridad) => {
  const ref = doc(db, 'incidencias', id);
  await updateDoc(ref, { prioridad });
};