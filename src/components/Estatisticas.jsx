import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, Calendar, DollarSign, Percent } from "lucide-react";

function Estatisticas({ historico, saldoAtual, mostrar }) {
  if (!mostrar) return null;

  // Calcular estatísticas
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
        crescimentoMedio: 0
      };
    }

    // Ordenar histórico por data
    const historicoOrdenado = [...historico].sort((a, b) => new Date(a.data) - new Date(b.data));
    
    const ultimaData = historicoOrdenado[historicoOrdenado.length - 1].data;
    const dataAtual = new Date().toLocaleDateString("pt-BR"); // Data de hoje
    const valorInicial = historicoOrdenado[historicoOrdenado.length - 1].valor; // ÚLTIMO do histórico
    const valorAtual = saldoAtual; // Saldo atual
    
    const crescimento = valorAtual - valorInicial;
    const crescimentoPercentual = valorInicial !== 0 ? (crescimento / valorInicial) * 100 : 0;
    
    // Debug para verificar os valores
    console.log("🔍 Debug Estatísticas:");
    console.log("Valor inicial (último do histórico):", valorInicial);
    console.log("Valor atual (saldoAtual):", valorAtual);
    console.log("Crescimento:", crescimento);
    console.log("Percentual:", crescimentoPercentual);
    
    // Calcular dias entre última data do histórico e hoje
    const dataInicial = new Date(ultimaData.split('/').reverse().join('-'));
    const dataFinal = new Date(); // Data de hoje
    
    // Garantir que as datas são válidas
    if (isNaN(dataInicial.getTime()) || isNaN(dataFinal.getTime())) {
      return {
        ultimaData,
        dataAtual: new Date().toLocaleDateString("pt-BR"),
        valorInicial,
        valorAtual,
        crescimento,
        crescimentoPercentual,
        totalDias: 0,
        crescimentoMedio: 0
      };
    }
    
    const diffTime = Math.abs(dataFinal - dataInicial);
    const totalDias = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Crescimento médio por dia
    const crescimentoMedio = totalDias > 0 ? crescimento / totalDias : 0;

    return {
      ultimaData,
      dataAtual,
      valorInicial,
      valorAtual,
      crescimento,
      crescimentoPercentual,
      totalDias,
      crescimentoMedio
    };
  };

  const stats = calcularEstatisticas();

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
              className="card-title text-center mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              style={{ color: "var(--accent-color)", fontWeight: "bold" }}
            >
              📊 Análise de Crescimento
            </motion.h5>

            <div className="row justify-content-center">
              {/* Período */}
              <motion.div 
                className="col-12 col-md-6 mb-3"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <div className="card h-100" style={{ backgroundColor: "var(--bg-secondary)" }}>
                  <div className="card-body text-center">
                    <Calendar size={32} style={{ color: "var(--accent-color)", marginBottom: "10px" }} />
                    <h6 style={{ color: "var(--text-primary)", fontWeight: "bold" }}>Período</h6>
                    <p style={{ color: "var(--text-secondary)", margin: "5px 0" }}>
                      <strong>Último:</strong> {stats.ultimaData}
                    </p>
                    <p style={{ color: "var(--text-secondary)", margin: "5px 0" }}>
                      <strong>Hoje:</strong> {stats.dataAtual}
                    </p>
                    <p style={{ color: "var(--accent-color)", fontWeight: "bold", margin: "10px 0 0 0" }}>
                      {stats.totalDias} dias
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Valores */}
              <motion.div 
                className="col-12 col-md-6 mb-3"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <div className="card h-100" style={{ backgroundColor: "var(--bg-secondary)" }}>
                  <div className="card-body text-center">
                    <DollarSign size={32} style={{ color: "var(--accent-color)", marginBottom: "10px" }} />
                    <h6 style={{ color: "var(--text-primary)", fontWeight: "bold" }}>Valores</h6>
                    <p style={{ color: "var(--text-secondary)", margin: "5px 0" }}>
                      <strong>Inicial:</strong> R$ {stats.valorInicial.toFixed(2)}
                    </p>
                    <p style={{ color: "var(--text-secondary)", margin: "5px 0" }}>
                      <strong>Atual:</strong> R$ {stats.valorAtual.toFixed(2)}
                    </p>
                    <p style={{ 
                      color: stats.crescimento >= 0 ? "var(--accent-color)" : "#ff6b6b", 
                      fontWeight: "bold", 
                      margin: "10px 0 0 0",
                      fontSize: "18px"
                    }}>
                      {stats.crescimento >= 0 ? "+" : ""}R$ {stats.crescimento.toFixed(2)}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Crescimento Percentual */}
            <motion.div 
              className="row"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <div className="col-12">
                <div className="card" style={{ backgroundColor: "var(--bg-secondary)" }}>
                  <div className="card-body text-center">
                    <TrendingUp size={40} style={{ color: "var(--accent-color)", marginBottom: "15px" }} />
                    <h4 style={{ color: "var(--text-primary)", fontWeight: "bold", marginBottom: "10px" }}>
                      Crescimento Total
                    </h4>
                    <motion.div
                      style={{
                        fontSize: "48px",
                        fontWeight: "bold",
                        color: stats.crescimentoPercentual >= 0 ? "var(--accent-color)" : "#ff6b6b",
                        marginBottom: "10px"
                      }}
                      initial={{ scale: 0.5 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.6, duration: 0.5, type: "spring" }}
                    >
                      {stats.crescimentoPercentual >= 0 ? "+" : ""}{stats.crescimentoPercentual.toFixed(2)}%
                    </motion.div>
                    <p style={{ color: "var(--text-secondary)", margin: "0" }}>
                      Crescimento médio: {stats.crescimentoMedio >= 0 ? "+" : ""}R$ {stats.crescimentoMedio.toFixed(2)}/dia
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Gráfico de Barras Simples */}
            {historico.length > 0 && (
              <motion.div 
                className="mt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <h6 style={{ color: "var(--text-primary)", textAlign: "center", marginBottom: "20px" }}>
                  Evolução do Crescimento
                </h6>
                <div style={{ 
                  display: "flex", 
                  alignItems: "end", 
                  justifyContent: "center", 
                  height: "100px",
                  gap: "5px",
                  overflowX: "auto",
                  padding: "0 10px"
                }}>
                  {historico.slice(0, 10).map((item, index) => {
                    const altura = Math.max(10, (item.valor / Math.max(...historico.map(h => h.valor))) * 80);
                    return (
                      <motion.div
                        key={index}
                        style={{
                          width: "20px",
                          height: `${altura}px`,
                          backgroundColor: "var(--accent-color)",
                          borderRadius: "2px 2px 0 0",
                          opacity: 0.8
                        }}
                        initial={{ height: 0 }}
                        animate={{ height: `${altura}px` }}
                        transition={{ delay: 0.7 + (index * 0.1), duration: 0.3 }}
                        whileHover={{ 
                          opacity: 1,
                          scale: 1.1,
                          transition: { duration: 0.2 }
                        }}
                        title={`R$ ${item.valor.toFixed(2)} - ${item.data}`}
                      />
                    );
                  })}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Estatisticas;
