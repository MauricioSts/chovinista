import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  Calendar,
  DollarSign,
  Activity,
} from "lucide-react";

function Estatisticas({ historico, saldoAtual, mostrar }) {
  if (!mostrar) return null;

  const calcularEstatisticas = () => {
    if (historico.length === 0) {
      return {
        primeiraData: "N/A",
        dataAtual: "N/A",
        valorInicial: 0,
        valorAtual: saldoAtual,
        crescimento: 0,
        crescimentoPercentual: 0,
        totalDias: 0,
        crescimentoMedio: 0,
      };
    }

    const historicoOrdenado = [...historico].sort(
      (a, b) => new Date(a.data) - new Date(b.data)
    );

    const ultimaData = historicoOrdenado[historicoOrdenado.length - 1].data;
    const dataAtual = new Date().toLocaleDateString("pt-BR");
    const valorInicial =
      historicoOrdenado[historicoOrdenado.length - 1].valor;
    const valorAtual = saldoAtual;

    const crescimento = valorAtual - valorInicial;
    const crescimentoPercentual =
      valorInicial !== 0 ? (crescimento / valorInicial) * 100 : 0;

    const dataInicial = new Date(
      ultimaData.split("/").reverse().join("-")
    );
    const dataFinal = new Date();

    if (isNaN(dataInicial.getTime()) || isNaN(dataFinal.getTime())) {
      return {
        ultimaData,
        dataAtual: new Date().toLocaleDateString("pt-BR"),
        valorInicial,
        valorAtual,
        crescimento,
        crescimentoPercentual,
        totalDias: 0,
        crescimentoMedio: 0,
      };
    }

    const diffTime = Math.abs(dataFinal - dataInicial);
    const totalDias = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const crescimentoMedio = totalDias > 0 ? crescimento / totalDias : 0;

    return {
      ultimaData,
      dataAtual,
      valorInicial,
      valorAtual,
      crescimento,
      crescimentoPercentual,
      totalDias,
      crescimentoMedio,
    };
  };

  const stats = calcularEstatisticas();
  const isPositive = stats.crescimentoPercentual >= 0;

  return (
    <AnimatePresence>
      {mostrar && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
        >
          {/* Section Title */}
          <motion.h5
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              color: "var(--accent-color)",
              fontWeight: 700,
              fontSize: "1.1rem",
              textAlign: "center",
              marginBottom: "20px",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            📊 Análise de Crescimento
          </motion.h5>

          {/* Big Percentage Hero */}
          <motion.div
            className="glass-card"
            style={{
              padding: "28px 20px",
              textAlign: "center",
              marginBottom: "16px",
              position: "relative",
              overflow: "hidden",
            }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            {/* Background glow */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "200px",
                height: "200px",
                borderRadius: "50%",
                background: isPositive
                  ? "rgba(16, 185, 129, 0.06)"
                  : "rgba(239, 68, 68, 0.06)",
                filter: "blur(40px)",
                pointerEvents: "none",
              }}
            />

            <div style={{ position: "relative", zIndex: 1 }}>
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "16px",
                  background: isPositive
                    ? "rgba(16, 185, 129, 0.1)"
                    : "rgba(239, 68, 68, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                }}
              >
                <TrendingUp
                  size={28}
                  style={{
                    color: isPositive ? "#10b981" : "#ef4444",
                    transform: isPositive ? "none" : "rotate(180deg)",
                  }}
                />
              </div>

              <div
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  color: "var(--text-muted)",
                  marginBottom: "8px",
                }}
              >
                Crescimento Total
              </div>

              <motion.div
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "clamp(2.5rem, 8vw, 3.5rem)",
                  fontWeight: 800,
                  color: isPositive ? "#10b981" : "#ef4444",
                  lineHeight: 1,
                  marginBottom: "8px",
                }}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, duration: 0.4, type: "spring" }}
              >
                {isPositive ? "+" : ""}
                {stats.crescimentoPercentual.toFixed(2)}%
              </motion.div>

              <div
                style={{
                  fontSize: "0.85rem",
                  color: "var(--text-secondary)",
                  fontWeight: 500,
                }}
              >
                {stats.crescimentoMedio >= 0 ? "+" : ""}R${" "}
                {stats.crescimentoMedio.toFixed(2)}/dia
              </div>
            </div>
          </motion.div>

          {/* Stat Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
              marginBottom: "16px",
            }}
          >
            {/* Período */}
            <motion.div
              className="stat-card"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="stat-icon">
                <Calendar
                  size={20}
                  style={{ color: "var(--accent-color)" }}
                />
              </div>
              <div className="stat-label">Período</div>
              <div className="stat-value" style={{ fontSize: "1.3rem" }}>
                {stats.totalDias}
                <span
                  style={{
                    fontSize: "0.7rem",
                    color: "var(--text-muted)",
                    marginLeft: "4px",
                    fontWeight: 500,
                  }}
                >
                  dias
                </span>
              </div>
            </motion.div>

            {/* Crescimento R$ */}
            <motion.div
              className="stat-card"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <div className="stat-icon">
                <DollarSign
                  size={20}
                  style={{ color: "var(--accent-color)" }}
                />
              </div>
              <div className="stat-label">Variação</div>
              <div
                className="stat-value"
                style={{
                  fontSize: "1.1rem",
                  color: isPositive ? "#10b981" : "#ef4444",
                }}
              >
                {isPositive ? "+" : ""}R$ {stats.crescimento.toFixed(2)}
              </div>
            </motion.div>

            {/* Valor Inicial */}
            <motion.div
              className="stat-card"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="stat-icon">
                <Activity
                  size={20}
                  style={{ color: "var(--accent-color)" }}
                />
              </div>
              <div className="stat-label">V. Inicial</div>
              <div className="stat-value" style={{ fontSize: "1rem" }}>
                R$ {stats.valorInicial.toFixed(2)}
              </div>
            </motion.div>

            {/* Valor Atual */}
            <motion.div
              className="stat-card"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <div className="stat-icon">
                <DollarSign
                  size={20}
                  style={{ color: "var(--accent-color)" }}
                />
              </div>
              <div className="stat-label">V. Atual</div>
              <div className="stat-value" style={{ fontSize: "1rem" }}>
                R$ {stats.valorAtual.toFixed(2)}
              </div>
            </motion.div>
          </div>

          {/* Mini Bar Chart — Monthly */}
          {historico.length > 0 && (() => {
            const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
            // Group by month, keep last value per month
            const groups = {};
            historico.forEach((item) => {
              const parts = item.data.split("/");
              if (parts.length < 3) return;
              const key = `${parts[1]}/${parts[2]}`; // MM/YYYY
              // Always keep the most recent value (first in array since historico is newest-first)
              if (!groups[key]) {
                groups[key] = { mes: parseInt(parts[1], 10), ano: parseInt(parts[2], 10), valor: item.valor, key };
              }
            });
            // Sort oldest → newest (left → right)
            const barrasMensais = Object.values(groups).sort((a, b) => a.ano - b.ano || a.mes - b.mes);
            const maxVal = Math.max(...barrasMensais.map((b) => b.valor), 1);

            return (
              <motion.div
                className="glass-card"
                style={{ padding: "20px" }}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
              >
                <div
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    color: "var(--text-muted)",
                    textAlign: "center",
                    marginBottom: "16px",
                  }}
                >
                  Evolução Mensal
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "end",
                    justifyContent: "center",
                    height: "100px",
                    gap: "6px",
                    overflowX: "auto",
                    padding: "0 4px",
                  }}
                >
                  {barrasMensais.map((bar, index) => {
                    const altura = Math.max(10, (bar.valor / maxVal) * 80);
                    return (
                      <div
                        key={bar.key}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: "4px",
                          flex: "1 1 0",
                          minWidth: "28px",
                          maxWidth: "48px",
                        }}
                      >
                        <motion.div
                          style={{
                            width: "100%",
                            height: `${altura}px`,
                            background: "var(--accent-gradient)",
                            borderRadius: "6px 6px 2px 2px",
                            opacity: 0.85,
                            cursor: "pointer",
                          }}
                          initial={{ height: 0 }}
                          animate={{ height: `${altura}px` }}
                          transition={{
                            delay: 0.5 + index * 0.08,
                            duration: 0.35,
                          }}
                          whileHover={{
                            opacity: 1,
                            scale: 1.08,
                            transition: { duration: 0.15 },
                          }}
                          title={`R$ ${bar.valor.toFixed(2)} — ${monthNames[bar.mes - 1]} ${bar.ano}`}
                        />
                        <span
                          style={{
                            fontSize: "0.6rem",
                            fontWeight: 600,
                            color: "var(--text-muted)",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {monthNames[bar.mes - 1]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })()}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Estatisticas;
