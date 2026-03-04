import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Wallet, Hash, List, CalendarDays } from "lucide-react";

function HistoricoDeValores({ historico, mostrar, saldoAtual = 0 }) {
  const [viewMode, setViewMode] = useState("monthly"); // "monthly" | "all"

  // Group history by month (MM/YYYY)
  const historicoMensal = useMemo(() => {
    if (historico.length === 0) return [];

    const groups = {};
    historico.forEach((item) => {
      // data is in "DD/MM/YYYY" format
      const parts = item.data.split("/");
      const mesAno = parts.length >= 3 ? `${parts[1]}/${parts[2]}` : item.data;
      if (!groups[mesAno]) {
        groups[mesAno] = { mesAno, items: [], total: 0, count: 0 };
      }
      groups[mesAno].items.push(item);
      groups[mesAno].total = item.valor; // último valor registrado no mês
      groups[mesAno].count += 1;
    });

    // Sort by date descending (most recent month first)
    return Object.values(groups).sort((a, b) => {
      const [mA, yA] = a.mesAno.split("/").map(Number);
      const [mB, yB] = b.mesAno.split("/").map(Number);
      return yB - yA || mB - mA;
    });
  }, [historico]);

  const monthNames = [
    "", "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
  ];

  const formatMesAno = (mesAno) => {
    const [mes, ano] = mesAno.split("/");
    const mesNum = parseInt(mes, 10);
    return `${monthNames[mesNum] || mes} ${ano}`;
  };

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
              marginBottom: "16px",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            📈 Histórico de Valores
          </motion.h5>

          {/* View Mode Toggle */}
          {historico.length > 0 && (
            <motion.div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "8px",
                marginBottom: "20px",
              }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
            >
              <motion.button
                onClick={() => setViewMode("monthly")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 16px",
                  borderRadius: "var(--radius-full)",
                  border: "1px solid var(--glass-border)",
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: "0.8rem",
                  cursor: "pointer",
                  transition: "all 0.25s ease",
                  background:
                    viewMode === "monthly"
                      ? "var(--accent-gradient)"
                      : "var(--card-bg)",
                  color:
                    viewMode === "monthly"
                      ? "white"
                      : "var(--text-secondary)",
                  boxShadow:
                    viewMode === "monthly" ? "var(--shadow-glow)" : "none",
                  backdropFilter:
                    viewMode === "monthly" ? "none" : "blur(12px)",
                  WebkitBackdropFilter:
                    viewMode === "monthly" ? "none" : "blur(12px)",
                }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <CalendarDays size={14} />
                Mensal
              </motion.button>

              <motion.button
                onClick={() => setViewMode("all")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 16px",
                  borderRadius: "var(--radius-full)",
                  border: "1px solid var(--glass-border)",
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: "0.8rem",
                  cursor: "pointer",
                  transition: "all 0.25s ease",
                  background:
                    viewMode === "all"
                      ? "var(--accent-gradient)"
                      : "var(--card-bg)",
                  color: viewMode === "all" ? "white" : "var(--text-secondary)",
                  boxShadow:
                    viewMode === "all" ? "var(--shadow-glow)" : "none",
                  backdropFilter: viewMode === "all" ? "none" : "blur(12px)",
                  WebkitBackdropFilter:
                    viewMode === "all" ? "none" : "blur(12px)",
                }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <List size={14} />
                Todas
              </motion.button>
            </motion.div>
          )}

          {/* Summary Cards */}
          {historico.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
                marginBottom: "20px",
              }}
            >
              <motion.div
                className="stat-card"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="stat-icon">
                  <Wallet
                    size={20}
                    style={{ color: "var(--accent-color)" }}
                  />
                </div>
                <div className="stat-label">Saldo Atual</div>
                <div className="stat-value">R$ {saldoAtual.toFixed(2)}</div>
              </motion.div>

              <motion.div
                className="stat-card"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <div className="stat-icon">
                  <Hash
                    size={20}
                    style={{ color: "var(--accent-color)" }}
                  />
                </div>
                <div className="stat-label">Registros</div>
                <div className="stat-value">{historico.length}</div>
              </motion.div>
            </div>
          )}

          {/* Empty state */}
          {historico.length === 0 && (
            <motion.div
              style={{
                textAlign: "center",
                padding: "40px 20px",
                color: "var(--text-muted)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Clock
                size={40}
                style={{ opacity: 0.3, marginBottom: "12px" }}
              />
              <p style={{ fontWeight: 500, margin: 0 }}>
                Nenhum registro ainda.
              </p>
            </motion.div>
          )}

          {/* ─── ALL OPERATIONS ─── */}
          <AnimatePresence mode="wait">
            {viewMode === "all" && historico.length > 0 && (
              <motion.div
                key="all"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                {historico.map((item, index) => (
                  <motion.div
                    key={`all-${index}`}
                    className="history-item"
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: Math.min(index * 0.04, 0.4),
                      duration: 0.25,
                    }}
                  >
                    <div className="history-dot" />
                    <div style={{ flex: 1 }}>
                      <div className="history-value">
                        R$ {item.valor.toFixed(2)}
                      </div>
                    </div>
                    <div className="history-date">{item.data}</div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* ─── MONTHLY VIEW ─── */}
            {viewMode === "monthly" && historico.length > 0 && (
              <motion.div
                key="monthly"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                {historicoMensal.map((group, gIndex) => (
                  <MonthGroup
                    key={group.mesAno}
                    group={group}
                    label={formatMesAno(group.mesAno)}
                    delay={gIndex * 0.06}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── Month Group Accordion ─── */
function MonthGroup({ group, label, delay }) {
  const [expanded, setExpanded] = useState(false);

  // Calculate variation within the month
  const firstItem = group.items[group.items.length - 1];
  const lastItem = group.items[0];
  const variation = lastItem.valor - firstItem.valor;
  const isPositive = variation >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
    >
      {/* Month Header */}
      <motion.button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "16px",
          background: "var(--card-bg)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid var(--glass-border)",
          borderRadius: expanded
            ? "var(--radius-md) var(--radius-md) 0 0"
            : "var(--radius-md)",
          cursor: "pointer",
          fontFamily: "'Inter', sans-serif",
          color: "var(--text-primary)",
          transition: "all 0.25s ease",
        }}
        whileTap={{ scale: 0.99 }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "12px",
            background: "var(--accent-gradient-soft)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <CalendarDays
            size={18}
            style={{ color: "var(--accent-color)" }}
          />
        </div>

        <div style={{ flex: 1, textAlign: "left" }}>
          <div
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: "0.95rem",
              marginBottom: "2px",
            }}
          >
            {label}
          </div>
          <div
            style={{
              fontSize: "0.75rem",
              color: "var(--text-muted)",
              fontWeight: 500,
            }}
          >
            {group.count} {group.count === 1 ? "operação" : "operações"}
          </div>
        </div>

        <div style={{ textAlign: "right" }}>
          <div
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: "0.95rem",
              color: "var(--accent-color)",
            }}
          >
            R$ {lastItem.valor.toFixed(2)}
          </div>
          {group.count > 1 && (
            <div
              style={{
                fontSize: "0.7rem",
                fontWeight: 600,
                color: isPositive ? "#10b981" : "#ef4444",
              }}
            >
              {isPositive ? "+" : ""}
              {variation.toFixed(2)}
            </div>
          )}
        </div>

        <motion.div
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          style={{
            color: "var(--text-muted)",
            fontSize: "1.2rem",
            lineHeight: 1,
          }}
        >
          ▾
        </motion.div>
      </motion.button>

      {/* Expanded Items */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              overflow: "hidden",
              background: "var(--bg-secondary)",
              border: "1px solid var(--glass-border)",
              borderTop: "none",
              borderRadius: "0 0 var(--radius-md) var(--radius-md)",
            }}
          >
            <div
              style={{
                padding: "8px",
                display: "flex",
                flexDirection: "column",
                gap: "4px",
              }}
            >
              {group.items.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03, duration: 0.2 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "10px 12px",
                    borderRadius: "10px",
                    transition: "background 0.2s",
                  }}
                >
                  <div
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: "var(--accent-gradient)",
                      flexShrink: 0,
                    }}
                  />
                  <div
                    style={{
                      flex: 1,
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontWeight: 600,
                      fontSize: "0.9rem",
                      color: "var(--accent-color)",
                    }}
                  >
                    R$ {item.valor.toFixed(2)}
                  </div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--text-muted)",
                      fontWeight: 500,
                    }}
                  >
                    {item.data}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default HistoricoDeValores;
