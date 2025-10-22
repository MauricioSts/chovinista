import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

function HistoricoDeValores({ historico, mostrar }) {
  if (!mostrar) return null;

  // 🔹 Garante que o histórico está ordenado corretamente
  const dadosOrdenados = [...historico].sort(
    (a, b) => new Date(a.data) - new Date(b.data)
  );

  return (
    <div className="card mt-4 shadow-sm">
      <div className="card-body">
        <motion.h5
          className="card-title text-center mb-3"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ color: "#e91e63", fontWeight: "bold" }}
        >
          📈 Histórico de Valores
        </motion.h5>

        {/* 🔹 Gráfico estilizado crescente */}
        {historico.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-4"
            style={{ width: "100%", height: "420px" }}
          >
            <ResponsiveContainer>
              <LineChart data={dadosOrdenados}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="data"
                  tick={{ fontSize: 12 }}
                  stroke="#555"
                  tickMargin={8}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickFormatter={(v) => `R$${v}`}
                  stroke="#555"
                  domain={[300, 1000]} // 🔹 Força o gráfico a começar em R$300 e ir até R$1000
                  ticks={[300, 400, 500, 600, 700, 800, 900, 1000]} // valores exatos
                />
                <Tooltip
                  formatter={(v) => `R$ ${v.toFixed(2)}`}
                  labelFormatter={(label) => `Data: ${label}`}
                />
                <Line
                  type="linear" // 🔹 Garante formato de reta (como na imagem)
                  dataKey="valor"
                  stroke="#e91e63"
                  strokeWidth={3}
                  dot={{
                    r: 5,
                    fill: "#fff",
                    stroke: "#e91e63",
                    strokeWidth: 2,
                  }}
                  activeDot={{ r: 7 }}
                  isAnimationActive={true}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        ) : (
          <p className="text-center text-muted">Nenhum registro ainda.</p>
        )}

        {/* 🔹 Tabela dos valores */}
        {historico.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="table-responsive"
          >
            <table className="table table-bordered table-striped table-hover">
              <thead className="table-light">
                <tr>
                  <th>Valor (R$)</th>
                  <th>Data</th>
                </tr>
              </thead>
              <tbody>
                {historico.map((item, index) => (
                  <tr key={index}>
                    <td
                      className={
                        item.valor >= 0 ? "text-success" : "text-danger"
                      }
                    >
                      {item.valor.toFixed(2)}
                    </td>
                    <td>{item.data}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default HistoricoDeValores;
