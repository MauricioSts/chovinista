import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { formatBRL } from "../utils/format";

// Linha de um lançamento com cancelamento em dois toques (sem modal)
function Lancamento({ item, mostrar, onCancelar, delay = 0 }) {
  const [confirmando, setConfirmando] = useState(false);

  return (
    <motion.li
      className={`lancamento ${confirmando ? "is-confirming" : ""}`}
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -24, transition: { duration: 0.2 } }}
      transition={{ delay, duration: 0.25 }}
    >
      <AnimatePresence mode="wait" initial={false}>
        {confirmando ? (
          <motion.div
            key="confirm"
            className="lancamento-confirm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <span className="lancamento-pergunta">
              Cancelar {formatBRL(item.valor, mostrar)}?
            </span>
            <div className="lancamento-acoes">
              <button
                type="button"
                className="btn-text"
                onClick={() => setConfirmando(false)}
              >
                Manter
              </button>
              <button
                type="button"
                className="btn-danger"
                onClick={() => onCancelar(item)}
              >
                Cancelar
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="view"
            className="lancamento-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <span className="lancamento-valor num">
              {formatBRL(item.valor, mostrar)}
            </span>
            <span className="lancamento-data">{item.data}</span>
            {onCancelar && (
              <button
                type="button"
                className="icon-btn icon-btn-sm"
                aria-label={`Cancelar lançamento de ${item.data}`}
                onClick={() => setConfirmando(true)}
              >
                <X size={16} strokeWidth={1.75} />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
}

export default Lancamento;
