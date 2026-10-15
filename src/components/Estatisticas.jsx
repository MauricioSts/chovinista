import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, BarChart3 } from "lucide-react";
import { formatBRL, formatSigned } from "../utils/format";

const MESES_CURTOS = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

function parseData(ddmmyyyy) {
  const [d, m, y] = (ddmmyyyy || "").split("/").map(Number);
  const data = new Date(y, m - 1, d);
  return isNaN(data.getTime()) ? null : data;
}

function Estatisticas({ historico, saldoAtual, mostrar }) {
  if (historico.length === 0) {
    return (
      <div className="vazio">
        <BarChart3 size={36} strokeWidth={1.5} />
        <p className="vazio-titulo">Sem dados pra comparar</p>
        <p className="vazio-texto">
          Depois de dois lançamentos dá pra ver quanto o porquinho cresceu.
        </p>
      </div>
    );
  }

  // historico vem do mais novo pro mais antigo
  const maisAntigo = historico[historico.length - 1];
  const valorInicial = maisAntigo.valor;
  const crescimento = saldoAtual - valorInicial;
  const percentual = valorInicial !== 0 ? (crescimento / valorInicial) * 100 : 0;
  const inicio = parseData(maisAntigo.data);
  const totalDias = inicio
    ? Math.max(0, Math.round((Date.now() - inicio.getTime()) / 86400000))
    : 0;
  const porDia = totalDias > 0 ? crescimento / totalDias : 0;
  const positivo = crescimento >= 0;
  const Seta = positivo ? ArrowUpRight : ArrowDownRight;

  // Último valor de cada mês, do mais antigo pro mais novo
  const grupos = {};
  historico.forEach((item) => {
    const parts = item.data.split("/");
    if (parts.length < 3) return;
    const key = `${parts[1]}/${parts[2]}`;
    if (!grupos[key]) {
      grupos[key] = {
        key,
        mes: parseInt(parts[1], 10),
        ano: parseInt(parts[2], 10),
        valor: item.valor,
      };
    }
  });
  const barras = Object.values(grupos).sort((a, b) => a.ano - b.ano || a.mes - b.mes);
  const maxVal = Math.max(...barras.map((b) => b.valor), 1);

  return (
    <section aria-labelledby="stats-titulo">
      <div className="secao-topo">
        <h2 id="stats-titulo" className="secao-titulo">
          Crescimento
        </h2>
      </div>

      <div className="stats-hero">
        <span className="eyebrow">Desde {maisAntigo.data}</span>
        <div className={`stats-percent num ${positivo ? "is-pos" : "is-neg"}`}>
          <Seta size={28} strokeWidth={2} />
          {mostrar
            ? `${positivo ? "+" : "−"}${Math.abs(percentual).toFixed(1).replace(".", ",")}%`
            : "••••"}
        </div>
        <p className="stats-sub num">
          {formatSigned(crescimento, mostrar)} em {totalDias}{" "}
          {totalDias === 1 ? "dia" : "dias"}
          {totalDias > 0 && ` · ${formatSigned(porDia, mostrar)}/dia`}
        </p>
      </div>

      <dl className="stats-grid">
        <div>
          <dt>Começou com</dt>
          <dd className="num">{formatBRL(valorInicial, mostrar)}</dd>
        </div>
        <div>
          <dt>Hoje</dt>
          <dd className="num">{formatBRL(saldoAtual, mostrar)}</dd>
        </div>
        <div>
          <dt>Lançamentos</dt>
          <dd className="num">{historico.length}</dd>
        </div>
        <div>
          <dt>Meses</dt>
          <dd className="num">{barras.length}</dd>
        </div>
      </dl>

      <div className="barras-card">
        <span className="eyebrow">Fim de cada mês</span>
        <div className="barras" role="list">
          {barras.map((bar, index) => {
            const altura = Math.max(8, (bar.valor / maxVal) * 100);
            const ultimo = index === barras.length - 1;
            return (
              <div
                key={bar.key}
                className="barra"
                role="listitem"
                aria-label={`${MESES_CURTOS[bar.mes - 1]} ${bar.ano}: ${formatBRL(bar.valor, mostrar)}`}
              >
                <motion.div
                  className={`barra-fill ${ultimo ? "is-last" : ""}`}
                  style={{ originY: 1, height: `${altura}%` }}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: 0.15 + index * 0.06, type: "spring", stiffness: 160, damping: 22 }}
                />
                <span className="barra-label">{MESES_CURTOS[bar.mes - 1]}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Estatisticas;
