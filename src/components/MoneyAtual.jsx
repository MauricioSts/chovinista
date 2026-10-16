import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMotionValue, useSpring } from "motion/react";
import { Eye, EyeSlash, TrendUp, TrendDown, ArrowRight } from "@phosphor-icons/react";
import { formatSigned } from "../utils/format";

const numero = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

// Valor que sobe até o saldo com mola, já no formato pt-BR
function AnimatedValor({ valor }) {
  const ref = useRef(null);
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { damping: 30, stiffness: 120 });

  useEffect(() => {
    mv.set(valor);
  }, [valor, mv]);

  useEffect(
    () =>
      spring.on("change", (v) => {
        if (ref.current) ref.current.textContent = numero.format(v);
      }),
    [spring]
  );

  return <span ref={ref}>{numero.format(0)}</span>;
}

function SaldoAtual({
  saldoAtual,
  saldoAnterior,
  dataAtual,
  onAtualizar,
  mostrar,
  setMostrar,
}) {
  const [novoValor, setNovoValor] = useState("");
  const [erro, setErro] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const n = parseFloat(String(novoValor).replace(",", "."));
    if (!novoValor || isNaN(n)) {
      setErro("Digite um valor, tipo 1250,40");
      return;
    }
    setErro("");
    onAtualizar(n);
    setNovoValor("");
  }

  const diferenca = saldoAtual - saldoAnterior;
  const percentual = saldoAnterior
    ? ((diferenca / saldoAnterior) * 100).toFixed(1).replace(".", ",")
    : null;
  const cresceu = diferenca >= 0;
  const Tendencia = cresceu ? TrendUp : TrendDown;

  return (
    <section className="bezel" aria-labelledby="saldo-titulo">
      <div className="bezel-core saldo-card">
        <div className="card-topo">
          <h2 id="saldo-titulo" className="rotulo">
            Saldo atual
          </h2>
          <motion.button
            type="button"
            className="olho"
            onClick={() => setMostrar(!mostrar)}
            aria-label={mostrar ? "Esconder valores" : "Mostrar valores"}
            aria-pressed={!mostrar}
            whileTap={{ scale: 0.9 }}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={mostrar ? "on" : "off"}
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                {mostrar ? <Eye size={20} /> : <EyeSlash size={20} />}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </div>

        <div className="saldo-valor num" aria-live="polite">
          <span className="saldo-moeda">R$</span>
          {mostrar ? <AnimatedValor valor={saldoAtual} /> : "••••"}
        </div>

        <div className="saldo-meta">
          {saldoAnterior > 0 && (
            <motion.span
              className={`badge ${cresceu ? "is-pos" : "is-neg"}`}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Tendencia size={14} weight="bold" />
              <span className="num">
                {formatSigned(diferenca, mostrar)}
                {percentual && mostrar && ` · ${percentual}%`}
              </span>
            </motion.span>
          )}
          {dataAtual && <span className="meta-texto">Atualizado em {dataAtual}</span>}
        </div>

        <form className="saldo-form" onSubmit={handleSubmit} noValidate>
          <label htmlFor="novo-valor" className="sr-only">
            Novo saldo
          </label>
          <div className={`campo ${erro ? "has-error" : ""}`}>
            <span className="campo-prefixo">R$</span>
            <input
              id="novo-valor"
              type="text"
              inputMode="decimal"
              autoComplete="off"
              placeholder="Novo valor"
              value={novoValor}
              onChange={(e) => {
                setNovoValor(e.target.value);
                if (erro) setErro("");
              }}
              aria-invalid={!!erro}
              aria-describedby={erro ? "novo-valor-erro" : undefined}
            />
          </div>
          {erro && (
            <p id="novo-valor-erro" className="campo-erro" role="alert">
              {erro}
            </p>
          )}
          <motion.button type="submit" className="btn-primary" whileTap={{ scale: 0.98 }}>
            Atualizar saldo
            <span className="btn-icone">
              <ArrowRight size={16} weight="bold" />
            </span>
          </motion.button>
        </form>
      </div>
    </section>
  );
}

export default SaldoAtual;
