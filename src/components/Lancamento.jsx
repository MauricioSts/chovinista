import { useState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { Trash } from "@phosphor-icons/react";
import { formatBRL } from "../utils/format";

// Quanto arrastar pra esquerda até soltar e pedir a confirmação
const LIMIAR = 88;

// Cancelamento em duas etapas: 1) arrastar pro lado, 2) confirmar na própria linha
function Lancamento({ item, mostrar, onCancelar, delay = 0 }) {
  const [confirmando, setConfirmando] = useState(false);
  const x = useMotionValue(0);
  const fundoOpacity = useTransform(x, [-LIMIAR, -16, 0], [1, 0.4, 0]);
  const iconeScale = useTransform(x, [-LIMIAR - 20, -LIMIAR, -24], [1.15, 1, 0.7]);
  const [armado, setArmado] = useState(false);

  function pedirConfirmacao() {
    navigator.vibrate?.(12);
    setConfirmando(true);
  }

  return (
    <motion.li
      className={`lancamento ${confirmando ? "is-confirming" : ""}`}
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -48, transition: { duration: 0.2 } }}
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
                autoFocus
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
            className="lancamento-swipe"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {onCancelar && (
              <motion.div
                className={`lancamento-fundo ${armado ? "is-armed" : ""}`}
                style={{ opacity: fundoOpacity }}
                aria-hidden="true"
              >
                <motion.span style={{ scale: iconeScale }}>
                  <Trash size={18} />
                </motion.span>
                <span>{armado ? "Solte" : "Cancelar"}</span>
              </motion.div>
            )}

            <motion.div
              className="lancamento-view"
              style={{ x, touchAction: "pan-y" }}
              drag={onCancelar ? "x" : false}
              dragDirectionLock
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={{ left: 0.7, right: 0.05 }}
              dragSnapToOrigin
              onDrag={(_, info) => setArmado(info.offset.x <= -LIMIAR)}
              onDragEnd={(_, info) => {
                setArmado(false);
                if (info.offset.x <= -LIMIAR) pedirConfirmacao();
              }}
              tabIndex={onCancelar ? 0 : undefined}
              aria-label={
                onCancelar
                  ? `${formatBRL(item.valor, mostrar)} em ${item.data}. Arraste pra esquerda ou aperte Delete pra cancelar`
                  : undefined
              }
              onKeyDown={(e) => {
                if (onCancelar && (e.key === "Delete" || e.key === "Backspace")) {
                  e.preventDefault();
                  pedirConfirmacao();
                }
              }}
            >
              <span className="lancamento-valor num">
                {formatBRL(item.valor, mostrar)}
              </span>
              <span className="lancamento-data">{item.data}</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
}

export default Lancamento;
