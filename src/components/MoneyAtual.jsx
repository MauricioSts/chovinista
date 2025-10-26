import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import CountUp from './CountUp'
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

    const valorAntigo = saldoAtual;

    const dataAntiga = dataAtual;

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

  const cresceu = parseFloat(crescimento) < 0 ? "diminuiu" : "cresceu";

  return (
    <motion.div 
      className="card shadow-sm border-0"
      style={{
        backgroundColor: "var(--card-bg)",
        borderRadius: "20px",
        padding: "20px",
        boxShadow: "var(--shadow-lg)",
        border: "1px solid var(--border-color)"
      }}
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="card-body p-0">
        <motion.h5 
          className="card-title d-flex flex-column flex-md-row justify-content-between align-items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <span className="mb-2 mb-md-0" style={{ color: "var(--text-primary)" }}>Saldo Atual</span>
          <motion.button
            className="btn"
            style={{ 
              backgroundColor: "var(--accent-light)", 
              border: "none",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
            onClick={alternarVisibilidade}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <motion.div
              animate={{ rotate: mostrar ? 0 : 180 }}
              transition={{ duration: 0.3 }}
            >
              {mostrar ? <Eye size={20} /> : <EyeOff size={20} />}
            </motion.div>
          </motion.button>
        </motion.h5>
        
        <AnimatePresence>
          {mostrar && (
            <div>
              <motion.h2 
                style={{ color: "var(--accent-color)" }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
              >
                <h1><CountUp
                  from={0}
                  to={saldoAtual.toFixed(2)}
                  separator=","
                  direction="up"
                  duration={1}
                  className="count-up-text"
                /> <span style={{ color: "var(--accent-color)" }} fontWeight="bold"> R$</span></h1>
              </motion.h2>
              {dataAtual && (
                <motion.p
                  style={{ 
                    color: "var(--text-secondary)", 
                    fontSize: "0.9rem",
                    marginTop: "5px",
                    marginBottom: "0"
                  }}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  Última atualização: {dataAtual}
                </motion.p>
              )}
            </div>
          )}
        </AnimatePresence>

        <motion.div 
          className="d-flex flex-column flex-md-row gap-2 mb-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <input
            type="number"
            className="form-control flex-grow-1"
            placeholder="Novo valor"
            value={novoValor}
            onChange={(e) => setNovoValor(e.target.value)}
            style={{ 
              color: "var(--text-primary)",
              backgroundColor: "var(--input-bg)",
              border: "1px solid var(--border-color)"
            }}
          />
          <motion.button
            className="btn"
            style={{ 
              backgroundColor: "var(--accent-color)", 
              border: "none",
              color: "white",
              fontWeight: "bold",
              minWidth: "120px"
            }}
            onClick={handleAtualizar}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            Atualizar
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default SaldoAtual;
