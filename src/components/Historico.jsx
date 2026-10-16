import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CaretDown, CalendarBlank, ListBullets, Wallet, Hash, PiggyBank } from "@phosphor-icons/react";
import Lancamento from "./Lancamento";
import { formatBRL, formatSigned } from "../utils/format";
import { agruparPorMes } from "../utils/meses";

const MESES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

const formatMesAno = (mesAno) => {
  const [mes, ano] = mesAno.split("/");
  return `${MESES[parseInt(mes, 10) - 1] || mes} ${ano}`;
};

function HistoricoDeValores({ historico, mostrar, saldoAtual, onCancelar }) {
  const [viewMode, setViewMode] = useState("monthly"); // "monthly" | "all"
  const historicoMensal = useMemo(() => agruparPorMes(historico), [historico]);

  return (
    <section aria-labelledby="historico-titulo">
      <div className="secao-cabeca">
        <span className="eyebrow">Linha do tempo</span>
        <h2 id="historico-titulo" className="secao-titulo">
          Histórico de valores
        </h2>
      </div>

      {historico.length === 0 ? (
        <div className="vazio">
          <span className="icone-tile icone-tile-lg">
            <PiggyBank size={28} />
          </span>
          <p className="vazio-titulo">Nenhum lançamento ainda</p>
          <p className="vazio-texto">Atualize o saldo no início e ele aparece aqui, mês a mês.</p>
        </div>
      ) : (
        <>
          <div className="segmented" role="tablist" aria-label="Agrupar por">
            {[
              ["monthly", "Mensal", CalendarBlank],
              ["all", "Todas", ListBullets],
            ].map(([id, label, Icon]) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={viewMode === id}
                className={viewMode === id ? "is-active" : ""}
                onClick={() => setViewMode(id)}
              >
                {viewMode === id && (
                  <motion.span
                    layoutId="segmented-pill"
                    className="segmented-pill"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                <Icon size={16} />
                <span>{label}</span>
              </button>
            ))}
          </div>

          <div className="mini-grid">
            <div className="mini-card">
              <span className="icone-tile">
                <Wallet size={20} />
              </span>
              <span className="rotulo">Saldo atual</span>
              <span className="mini-valor num">{formatBRL(saldoAtual, mostrar)}</span>
            </div>
            <div className="mini-card">
              <span className="icone-tile">
                <Hash size={20} />
              </span>
              <span className="rotulo">Registros</span>
              <span className="mini-valor num">{historico.length}</span>
            </div>
          </div>

          <p className="dica">Arraste um lançamento pro lado pra cancelar</p>

          <AnimatePresence mode="wait">
            {viewMode === "all" ? (
              <motion.ul
                key="all"
                className="lista"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
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
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
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
                    delay={i * 0.05}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </section>
  );
}

function MonthGroup({ group, label, mostrar, onCancelar, inicialAberto, delay }) {
  const [expanded, setExpanded] = useState(inicialAberto);
  const { fechamento, variacao } = group;
  const count = group.items.length;

  return (
    <motion.div
      className={`mes ${expanded ? "is-open" : ""}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
    >
      <button
        type="button"
        className="mes-header"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
      >
        <span className="icone-tile">
          <CalendarBlank size={20} />
        </span>
        <span className="mes-nome">
          {label}
          <span className="mes-count">
            {count} {count === 1 ? "operação" : "operações"}
          </span>
        </span>
        <span className="mes-valores">
          <span className="num">{formatBRL(fechamento, mostrar)}</span>
          <span className={`num mes-var ${variacao >= 0 ? "is-pos" : "is-neg"}`}>
            {formatSigned(variacao, mostrar)}
          </span>
        </span>
        <CaretDown className="mes-chevron" size={16} />
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            className="mes-corpo"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
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
    </motion.div>
  );
}

export default HistoricoDeValores;
