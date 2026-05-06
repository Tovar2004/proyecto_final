// src/services/authService.js
import { auth, db } from '../firebase/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  confirmPasswordReset,
  verifyPasswordResetCode
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

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