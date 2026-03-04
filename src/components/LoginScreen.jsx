import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import chovirico from "../assets/chovirico.png";

function LoginScreen() {
    const { loginWithGoogle, authError } = useAuth();

    return (
        <motion.div
            style={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "var(--bg-primary)",
                padding: "24px",
                position: "relative",
                overflow: "hidden",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
        >
            {/* Background blobs */}
            <div
                style={{
                    position: "absolute",
                    top: "-100px",
                    right: "-80px",
                    width: "300px",
                    height: "300px",
                    borderRadius: "50%",
                    background: "var(--accent-gradient)",
                    opacity: 0.06,
                    filter: "blur(60px)",
                    pointerEvents: "none",
                }}
            />
            <div
                style={{
                    position: "absolute",
                    bottom: "-80px",
                    left: "-60px",
                    width: "250px",
                    height: "250px",
                    borderRadius: "50%",
                    background: "var(--accent-gradient)",
                    opacity: 0.04,
                    filter: "blur(60px)",
                    pointerEvents: "none",
                }}
            />

            {/* Card */}
            <motion.div
                style={{
                    background: "var(--card-bg)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    border: "1px solid var(--glass-border)",
                    borderRadius: "var(--radius-xl)",
                    padding: "40px 32px",
                    maxWidth: "380px",
                    width: "100%",
                    textAlign: "center",
                    boxShadow: "var(--shadow-xl)",
                    position: "relative",
                    zIndex: 1,
                }}
                initial={{ opacity: 0, y: 24, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
            >
                {/* Avatar */}
                <motion.div
                    style={{
                        width: "100px",
                        height: "100px",
                        borderRadius: "50%",
                        background: "var(--accent-gradient-soft)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 20px",
                        border: "2px solid var(--glass-border)",
                        boxShadow: "var(--shadow-glow)",
                    }}
                    animate={{
                        rotate: [0, 5, 0, -5, 0],
                        scale: [1, 1.03, 0.98, 1.03, 1],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                >
                    <img
                        src={chovirico}
                        alt="Chovinista"
                        style={{
                            width: "72px",
                            height: "72px",
                            borderRadius: "50%",
                            objectFit: "cover",
                        }}
                    />
                </motion.div>

                {/* Title */}
                <h1
                    style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        color: "var(--accent-color)",
                        fontSize: "1.8rem",
                        fontWeight: 800,
                        marginBottom: "6px",
                        letterSpacing: "-0.02em",
                    }}
                >
                    Chovinista
                </h1>
                <p
                    style={{
                        color: "var(--text-secondary)",
                        fontSize: "0.9rem",
                        fontWeight: 500,
                        marginBottom: "28px",
                    }}
                >
                    Faça login para continuar 🐖
                </p>

                {/* Error */}
                {authError && (
                    <motion.div
                        style={{
                            background: "rgba(239, 68, 68, 0.1)",
                            border: "1px solid rgba(239, 68, 68, 0.2)",
                            borderRadius: "var(--radius-md)",
                            padding: "12px 16px",
                            marginBottom: "20px",
                            color: "#ef4444",
                            fontSize: "0.85rem",
                            fontWeight: 600,
                        }}
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {authError}
                    </motion.div>
                )}

                {/* Google Login Button */}
                <motion.button
                    onClick={loginWithGoogle}
                    style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "10px",
                        padding: "14px 24px",
                        borderRadius: "var(--radius-full)",
                        border: "1px solid var(--border-color)",
                        background: "var(--card-bg-solid)",
                        color: "var(--text-primary)",
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 600,
                        fontSize: "0.95rem",
                        cursor: "pointer",
                        boxShadow: "var(--shadow-sm)",
                        transition: "all 0.25s ease",
                    }}
                    whileHover={{ scale: 1.02, boxShadow: "var(--shadow)" }}
                    whileTap={{ scale: 0.98 }}
                >
                    <svg width="18" height="18" viewBox="0 0 48 48">
                        <path
                            fill="#EA4335"
                            d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                        />
                        <path
                            fill="#4285F4"
                            d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                        />
                        <path
                            fill="#FBBC05"
                            d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                        />
                        <path
                            fill="#34A853"
                            d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                        />
                    </svg>
                    Entrar com Google
                </motion.button>
            </motion.div>

            {/* Footer */}
            <motion.p
                style={{
                    color: "var(--text-muted)",
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    marginTop: "24px",
                    position: "relative",
                    zIndex: 1,
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
            >
                © 2025 Mimo Finanças — Acesso restrito
            </motion.p>
        </motion.div>
    );
}

export default LoginScreen;
