import { motion, AnimatePresence } from "framer-motion";

function SaldoAnterior({ saldoAnterior, dataAnterior, mostrar }) {
  return (
    <motion.div 
      className="card shadow-sm border-0"
      style={{
        background: "linear-gradient(135deg, var(--accent-light) 0%, var(--accent-color) 100%)",
        color: "white",
        borderRadius: "20px",
        padding: "20px",
        boxShadow: "var(--shadow-lg)",
        border: "1px solid var(--accent-color)"
      }}
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="card-body p-0">
        <div className="text-center">
          <motion.h5
            className="card-title mb-3"
            style={{ color: "white", fontWeight: "600" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            Saldo Anterior
          </motion.h5>

          <AnimatePresence>
            {mostrar && (
              <motion.h2 
                style={{ color: "white", fontWeight: "bold" }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
              >
                {Number(saldoAnterior || 0).toFixed(2)} R$
              </motion.h2>
            )}
          </AnimatePresence>

          <motion.p 
            className="mt-2" 
            style={{ color: "rgba(255, 255, 255, 0.9)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            Última atualização: {dataAnterior || "-"}
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
}

export default SaldoAnterior;
