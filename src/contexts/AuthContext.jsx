import { createContext, useContext, useState, useEffect } from "react";
import {
    onAuthStateChanged,
    signInWithPopup,
    signOut,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase/config";

const AuthContext = createContext();

// Only these emails can access the app
const ALLOWED_EMAILS = [
    "mauriciogear4@gmail.com",
    "hayssayasmin@gmail.com",
];

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [authError, setAuthError] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                if (ALLOWED_EMAILS.includes(firebaseUser.email)) {
                    setUser(firebaseUser);
                    setAuthError(null);
                } else {
                    // User is not in the whitelist — sign them out
                    signOut(auth);
                    setUser(null);
                    setAuthError("Acesso negado. Este email não tem permissão.");
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const loginWithGoogle = async () => {
        try {
            setAuthError(null);
            const result = await signInWithPopup(auth, googleProvider);
            if (!ALLOWED_EMAILS.includes(result.user.email)) {
                await signOut(auth);
                setAuthError("Acesso negado. Este email não tem permissão.");
            }
        } catch (error) {
            console.error("Erro no login:", error);
            if (error.code !== "auth/popup-closed-by-user") {
                setAuthError("Erro ao fazer login. Tente novamente.");
            }
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            setUser(null);
        } catch (error) {
            console.error("Erro ao sair:", error);
        }
    };

    return (
        <AuthContext.Provider
            value={{ user, loading, authError, loginWithGoogle, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
};
