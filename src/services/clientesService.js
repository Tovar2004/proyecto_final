// src/services/clientesService.js
import { db } from '../firebase/firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

export const obtenerClientes = async () => {
  const snapshot = await getDocs(collection(db, 'clientes'));
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const eliminarCliente = async (uid) => {
  await deleteDoc(doc(db, 'clientes', uid));
};