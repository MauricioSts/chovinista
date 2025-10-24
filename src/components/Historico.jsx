import { motion, AnimatePresence } from "framer-motion";

function HistoricoDeValores({ historico, mostrar, saldoAtual = 0 }) {
  // 🔹 Garante que o histórico está ordenado corretamente
  const dadosOrdenados = [...historico].sort(
    (a, b) => new Date(a.data) - new Date(b.data)
  );

  return (
    <AnimatePresence>
      {mostrar && (
        <motion.div 
          className="card mt-4 shadow-sm"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.5 }}
        >
          <div className="card-body">
            <motion.h5
              className="card-title text-center mb-3"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              style={{ color: "var(--accent-color)", fontWeight: "bold" }}
            >
              📈 Histórico de Valores
            </motion.h5>

            {/* 🔹 Resumo simples */}
            {historico.length > 0 && (
              <div className="row mb-4">
                <div className="col-12 col-md-6 mb-3">
                  <div 
                    className="card text-center"
                    style={{
                      background: "var(--card-bg)",
                      color: "var(--text-primary)",
                      borderRadius: "15px",
                      border: "1px solid var(--border-color)"
                    }}
                  >
                    <div className="card-body">
                      <h5 style={{ margin: 0, fontSize: "14px", color: "var(--text-secondary)" }}>Saldo Atual</h5>
                      <h3 style={{ margin: 0, fontWeight: "bold", color: "var(--accent-color)" }}>
                        R$ {saldoAtual.toFixed(2)}
                      </h3>
                    </div>
                  </div>
                </div>
                
                <div className="col-12 col-md-6 mb-3">
                  <div 
                    className="card text-center"
                    style={{
                      background: "var(--card-bg)",
                      color: "var(--text-primary)",
                      borderRadius: "15px",
                      border: "1px solid var(--border-color)"
                    }}
                  >
                    <div className="card-body">
                      <h5 style={{ margin: 0, fontSize: "14px", color: "var(--text-secondary)" }}>Total de Registros</h5>
                      <h3 style={{ margin: 0, fontWeight: "bold", color: "var(--accent-color)" }}>
                        {historico.length}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {historico.length === 0 && (
              <motion.p 
                className="text-center"
                style={{ color: "var(--text-muted)" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                Nenhum registro ainda.
              </motion.p>
            )}

            {/* 🔹 Tabela dos valores */}
            {historico.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="table-responsive"
              >
                <table 
                  className="table table-bordered table-hover"
                  style={{ 
                    backgroundColor: "var(--card-bg) !important",
                    color: "var(--text-primary) !important",
                    borderColor: "var(--border-color) !important",
                    boxShadow: "var(--shadow-lg)"
                  }}
                >
                  <thead style={{ 
                    backgroundColor: "var(--bg-tertiary) !important",
                    borderColor: "var(--border-color) !important"
                  }}>
                    <tr>
                      <th style={{ 
                        color: "var(--text-primary) !important", 
                        borderColor: "var(--border-color) !important",
                        backgroundColor: "var(--bg-tertiary) !important",
                        fontWeight: "bold",
                        fontSize: "14px"
                      }}>
                        Valor (R$)
                      </th>
                      <th style={{ 
                        color: "var(--text-primary) !important", 
                        borderColor: "var(--border-color) !important",
                        backgroundColor: "var(--bg-tertiary) !important",
                        fontWeight: "bold",
                        fontSize: "14px"
                      }}>
                        Data
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {historico.map((item, index) => (
                      <motion.tr 
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                        style={{ 
                          borderColor: "var(--border-color) !important",
                          backgroundColor: `${index % 2 === 0 ? "var(--card-bg)" : "var(--bg-secondary)"} !important`
                        }}
                      >
                        <td
                          style={{
                            color: `${item.valor >= 0 ? "var(--accent-color)" : "#ff6b6b"} !important`,
                            borderColor: "var(--border-color) !important",
                            backgroundColor: `${index % 2 === 0 ? "var(--card-bg)" : "var(--bg-secondary)"} !important`,
                            fontWeight: "bold",
                            fontSize: "14px"
                          }}
                        >
                          {item.valor.toFixed(2)}
                        </td>
                        <td style={{ 
                          borderColor: "var(--border-color) !important",
                          color: "var(--text-primary) !important",
                          backgroundColor: `${index % 2 === 0 ? "var(--card-bg)" : "var(--bg-secondary)"} !important`,
                          fontSize: "14px"
                        }}>
                          {item.data}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default HistoricoDeValores;
