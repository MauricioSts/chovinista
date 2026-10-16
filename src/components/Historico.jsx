import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, PiggyBank } from "lucide-react";
import Lancamento from "./Lancamento";
import { formatBRL, formatSigned } from "../utils/format";
import { agruparPorMes } from "../utils/meses";

const MESES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

function HistoricoDeValores({ historico, mostrar, onCancelar }) {
  const [viewMode, setViewMode] = useState("monthly"); // "monthly" | "all"

  const historicoMensal = useMemo(() => agruparPorMes(historico), [historico]);

  const formatMesAno = (mesAno) => {
    const [mes, ano] = mesAno.split("/");
    return `${MESES[parseInt(mes, 10) - 1] || mes} ${ano}`;
  };

  if (historico.length === 0) {
    return (
      <div className="vazio">
        <PiggyBank size={36} strokeWidth={1.5} />
        <p className="vazio-titulo">Nenhum lançamento ainda</p>
        <p className="vazio-texto">
          Atualize o saldo no início e ele aparece aqui, mês a mês.
        </p>
      </div>
    );
  }

  return (
    <section aria-labelledby="historico-titulo">
      <div className="secao-topo">
        <h2 id="historico-titulo" className="secao-titulo">
          Histórico
        </h2>
        <div className="segmented" role="tablist" aria-label="Agrupar por">
          {[
            ["monthly", "Por mês"],
            ["all", "Tudo"],
          ].map(([id, label]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={viewMode === id}
              className={viewMode === id ? "is-active" : ""}
              onClick={() => setViewMode(id)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <p className="secao-sub">
        {historico.length}{" "}
        {historico.length === 1 ? "lançamento" : "lançamentos"} · toque no ✕
        para cancelar um
      </p>

      <AnimatePresence mode="wait">
        {viewMode === "all" ? (
          <motion.ul
            key="all"
            className="lista"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <AnimatePresence initial={false}>
              {historico.map((item, index) => (
                <Lancamento
                  key={item.id || `${item.data}-${item.valor}-${index}`}
                  item={item}
                  mostrar={mostrar}
                  onCancelar={onCancelar}
                  delay={Math.min(index * 0.03, 0.3)}
                />
              ))}
            </AnimatePresence>
          </motion.ul>
        ) : (
          <motion.div
            key="monthly"
            className="meses"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {historicoMensal.map((group, i) => (
              <MonthGroup
                key={group.mesAno}
                group={group}
                label={formatMesAno(group.mesAno)}
                mostrar={mostrar}
                onCancelar={onCancelar}
                inicialAberto={i === 0}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function MonthGroup({ group, label, mostrar, onCancelar, inicialAberto }) {
  const [expanded, setExpanded] = useState(inicialAberto);

  const { fechamento, variacao } = group;
  const count = group.items.length;

  return (
    <div className={`mes ${expanded ? "is-open" : ""}`}>
      <button
        type="button"
        className="mes-header"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
      >
        <span className="mes-nome">
          {label}
          <span className="mes-count">
            {count} {count === 1 ? "lançamento" : "lançamentos"}
          </span>
        </span>
        <span className="mes-valores">
          <span className="num">{formatBRL(fechamento, mostrar)}</span>
          <span className={`num mes-var ${variacao >= 0 ? "is-pos" : "is-neg"}`}>
            {formatSigned(variacao, mostrar)}
          </span>
        </span>
        <ChevronDown className="mes-chevron" size={18} strokeWidth={1.75} />
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            className="mes-corpo"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <ul className="lista lista-flat">
              <AnimatePresence initial={false}>
                {group.items.map((item, index) => (
                  <Lancamento
                    key={item.id || `${item.data}-${item.valor}-${index}`}
                    item={item}
                    mostrar={mostrar}
                    onCancelar={onCancelar}
                  />
                ))}
              </AnimatePresence>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default HistoricoDeValores;
