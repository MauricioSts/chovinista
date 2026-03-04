import { motion, AnimatePresence } from "framer-motion";
import { TrendingDown, TrendingUp } from "lucide-react";

function SaldoAnterior({ saldoAnterior, dataAnterior, mostrar }) {
  return (
    <motion.div
      style={{
        background: "var(--accent-gradient)",
        borderRadius: "var(--radius-lg)",
        padding: "24px",
        color: "white",
        position: "relative",
        overflow: "hidden",
        boxShadow: "var(--shadow-glow)",
      }}
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Decorative circles */}
      <div
        style={{
          position: "absolute",
          top: "-30px",
          right: "-20px",
          width: "100px",
          height: "100px",
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.1)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-20px",
          left: "-10px",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.06)",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", zIndex: 1 }}>
        <motion.div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "12px",
          }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: "rgba(255, 255, 255, 0.18)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TrendingDown size={18} />
          </div>
          <span
            style={{
              fontSize: "0.75rem",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              opacity: 0.85,
            }}
          >
            Saldo Anterior
          </span>
        </motion.div>

        <AnimatePresence>
          {mostrar && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
            >
              <div
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "clamp(1.6rem, 5vw, 2.2rem)",
                  fontWeight: 800,
                  lineHeight: 1.1,
                  display: "flex",
                  alignItems: "baseline",
                  gap: "6px",
                }}
              >
                <span style={{ fontSize: "0.6em", fontWeight: 600, opacity: 0.7 }}>
                  R$
                </span>
                {Number(saldoAnterior || 0).toFixed(2)}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.p
          style={{
            color: "rgba(255, 255, 255, 0.7)",
            fontSize: "0.8rem",
            marginTop: "10px",
            marginBottom: "0",
            fontWeight: 500,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          Última atualização: {dataAnterior || "—"}
        </motion.p>
      </div>
    </motion.div>
  );
}

export default SaldoAnterior;
