import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, ArrowUpRight } from "lucide-react";
import toast from "react-hot-toast";
import CountUp from "./CountUp";

function SaldoAtual({
  saldoAtual,
  setSaldoAtual,
  saldoAnterior,
  setSaldoAnterior,
  dataAtual,
  setDataAtual,
  setDataAnterior,
  setHistorico,
  mostrar,
  setMostrar,
}) {
  const [novoValor, setNovoValor] = useState("");

  function handleAtualizar() {
    if (!novoValor) return toast.error("Digite um valor válido 🐖");
    const novoValorNumerico = parseFloat(novoValor);
    if (isNaN(novoValorNumerico)) return alert("Valor inválido!");

    setSaldoAnterior(saldoAtual);
    setSaldoAtual(novoValorNumerico);
    const novaData = new Date().toLocaleDateString("pt-BR");
    setDataAnterior(dataAtual);
    setDataAtual(novaData);

    setHistorico((prev) => [
      { valor: novoValorNumerico, data: novaData },
      ...prev,
    ]);

    setNovoValor("");
  }

  const alternarVisibilidade = () => {
    setMostrar(!mostrar);
  };

  const crescimento = saldoAnterior
    ? (((saldoAtual - saldoAnterior) / saldoAnterior) * 100).toFixed(2)
    : "0.00";

  const cresceu = parseFloat(crescimento) >= 0;

  return (
    <motion.div
      className="glass-card"
      style={{
        padding: "24px",
        position: "relative",
        overflow: "hidden",
      }}
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Decorative gradient blob */}
      <div
        style={{
          position: "absolute",
          top: "-40px",
          right: "-40px",
          width: "120px",
          height: "120px",
          borderRadius: "50%",
          background: "var(--accent-gradient)",
          opacity: 0.08,
          filter: "blur(30px)",
          pointerEvents: "none",
        }}
      />

      {/* Title row */}
      <motion.div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div>
          <span
            style={{
              fontSize: "0.75rem",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: "var(--text-muted)",
            }}
          >
            Saldo Atual
          </span>
        </div>
        <motion.button
          onClick={alternarVisibilidade}
          style={{
            background: "var(--accent-gradient-soft)",
            border: "1px solid var(--glass-border)",
            borderRadius: "50%",
            width: "38px",
            height: "38px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: "var(--accent-color)",
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <motion.div
            animate={{ rotate: mostrar ? 0 : 180 }}
            transition={{ duration: 0.3 }}
          >
            {mostrar ? <Eye size={18} /> : <EyeOff size={18} />}
          </motion.div>
        </motion.button>
      </motion.div>

      {/* Saldo display */}
      <AnimatePresence>
        {mostrar && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            style={{ marginBottom: "8px" }}
          >
            <div
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "clamp(2rem, 7vw, 2.8rem)",
                fontWeight: 800,
                color: "var(--accent-color)",
                lineHeight: 1.1,
                display: "flex",
                alignItems: "baseline",
                gap: "6px",
              }}
            >
              <span style={{ fontSize: "0.6em", fontWeight: 600, opacity: 0.7 }}>
                R$
              </span>
              <CountUp
                from={0}
                to={saldoAtual.toFixed(2)}
                separator=","
                direction="up"
                duration={1}
                className="count-up-text"
              />
            </div>

            {/* Growth badge */}
            {saldoAnterior > 0 && (
              <motion.div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  marginTop: "8px",
                  padding: "4px 10px",
                  borderRadius: "var(--radius-full)",
                  background: cresceu
                    ? "rgba(16, 185, 129, 0.1)"
                    : "rgba(239, 68, 68, 0.1)",
                  color: cresceu ? "#10b981" : "#ef4444",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                }}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <ArrowUpRight
                  size={14}
                  style={{
                    transform: cresceu ? "none" : "rotate(90deg)",
                  }}
                />
                {cresceu ? "+" : ""}
                {crescimento}%
              </motion.div>
            )}

            {dataAtual && (
              <motion.p
                style={{
                  color: "var(--text-muted)",
                  fontSize: "0.8rem",
                  marginTop: "8px",
                  marginBottom: "0",
                  fontWeight: 500,
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 }}
              >
                Última atualização: {dataAtual}
              </motion.p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input + Button */}
      <motion.div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          marginTop: "16px",
        }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        <input
          type="number"
          className="form-control"
          placeholder="Novo valor"
          value={novoValor}
          onChange={(e) => setNovoValor(e.target.value)}
        />
        <motion.button
          className="btn"
          style={{
            background: "var(--accent-gradient)",
            color: "white",
            fontWeight: 700,
            boxShadow: "var(--shadow-glow)",
            width: "100%",
          }}
          onClick={handleAtualizar}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
        >
          Atualizar Saldo
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

export default SaldoAtual;
