// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, deleteUser } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [rol, setRol] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const adminDoc = await getDoc(doc(db, "administradores", user.uid));
        if (adminDoc.exists()) {
          setRol("admin");
          setUsuario({ uid: user.uid, ...adminDoc.data() });
        } else {
          const clienteDoc = await getDoc(doc(db, "clientes", user.uid));
          if (clienteDoc.exists()) {
            setRol("cliente");
            setUsuario({ uid: user.uid, ...clienteDoc.data() });
          } else {
            try {
              await deleteUser(user);
            } catch {
              await auth.signOut();
            }
            setUsuario(null);
            setRol(null);
          }
        }
      } else {
        setUsuario(null);
        setRol(null);
      }
      setCargando(false);
    });
    return () => unsub();
  }, []);

  return (
    <AuthContext.Provider value={{ usuario, rol, cargando }}>
      {!cargando && children}
    </AuthContext.Provider>
  );
}
