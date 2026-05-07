// src/services/authService.js
import { auth, db } from '../firebase/firebase';
import { doc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  confirmPasswordReset,
  verifyPasswordResetCode
} from 'firebase/auth';


export const registrarCliente = async ({ nombre, apellido, telefono, correo, password }) => {
  const credencial = await createUserWithEmailAndPassword(auth, correo, password);
  const uid = credencial.user.uid;
  await setDoc(doc(db, 'clientes', uid), { nombre, apellido, telefono, correo });
  return uid;
};

export const iniciarSesion = async (correo, password) => {
  const credencial = await signInWithEmailAndPassword(auth, correo, password);
  return credencial.user;
};

export const cerrarSesion = () => signOut(auth);

export const recuperarPassword = async (correo) => {
  // Verificar en clientes
  const qClientes = query(collection(db, 'clientes'), where('correo', '==', correo));
  const snapClientes = await getDocs(qClientes);

  // Verificar en administradores
  const qAdmin = query(collection(db, 'administradores'), where('correo', '==', correo));
  const snapAdmin = await getDocs(qAdmin);

  if (snapClientes.empty && snapAdmin.empty) {
    throw new Error('No encontramos una cuenta con ese correo.');
  }

  const actionCodeSettings = {
    url: 'http://localhost:5173/restablecer',
    handleCodeInApp: true,
  };
  await sendPasswordResetEmail(auth, correo, actionCodeSettings);
};

export const verificarCodigo = async (oobCode) => {
  const correo = await verifyPasswordResetCode(auth, oobCode);
  return correo;
};

export const confirmarNuevaPassword = async (oobCode, nuevaPassword) => {
  await confirmPasswordReset(auth, oobCode, nuevaPassword);
};