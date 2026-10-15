import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useMotionValue, useSpring } from "motion/react";
import { Eye, EyeOff, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { formatBRL, formatSigned } from "../utils/format";

const numero = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

// Valor que sobe até o saldo com mola, já no formato pt-BR
function AnimatedBRL({ valor }) {
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

  return (
    <>
      <span className="saldo-moeda">R$</span>
      <span ref={ref}>{numero.format(0)}</span>
    </>
  );
}

function SaldoAtual({
  saldoAtual,
  saldoAnterior,
  dataAtual,
  dataAnterior,
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
  const Seta = cresceu ? ArrowUpRight : ArrowDownRight;

  return (
    <section className="saldo-card" aria-labelledby="saldo-titulo">
      <div className="saldo-topo">
        <h2 id="saldo-titulo" className="eyebrow">
          Saldo de hoje
        </h2>
        <button
          type="button"
          className="icon-btn"
          onClick={() => setMostrar(!mostrar)}
          aria-label={mostrar ? "Esconder valores" : "Mostrar valores"}
          aria-pressed={!mostrar}
        >
          {mostrar ? (
            <Eye size={18} strokeWidth={1.75} />
          ) : (
            <EyeOff size={18} strokeWidth={1.75} />
          )}
        </button>
      </div>

      <div className="saldo-valor num" aria-live="polite">
        {mostrar ? (
          <AnimatedBRL valor={saldoAtual} />
        ) : (
          <>
            <span className="saldo-moeda">R$</span>••••
          </>
        )}
      </div>

      <div className="saldo-meta">
        {saldoAnterior > 0 && (
          <motion.span
            className={`delta ${cresceu ? "is-pos" : "is-neg"}`}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Seta size={14} strokeWidth={2} />
            <span className="num">
              {formatSigned(diferenca, mostrar)}
              {percentual && mostrar && ` · ${percentual}%`}
            </span>
          </motion.span>
        )}
        {dataAtual && <span className="saldo-data">em {dataAtual}</span>}
      </div>

      <dl className="saldo-anterior">
        <dt>Antes</dt>
        <dd>
          <span className="num">{formatBRL(saldoAnterior, mostrar)}</span>
          {dataAnterior && <span className="saldo-data"> · {dataAnterior}</span>}
        </dd>
      </dl>

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
            placeholder="Novo saldo"
            value={novoValor}
            onChange={(e) => {
              setNovoValor(e.target.value);
              if (erro) setErro("");
            }}
            aria-invalid={!!erro}
            aria-describedby={erro ? "novo-valor-erro" : undefined}
          />
        </div>
        <motion.button
          type="submit"
          className="btn-primary"
          whileTap={{ scale: 0.97 }}
        >
          Atualizar
        </motion.button>
        {erro && (
          <p id="novo-valor-erro" className="campo-erro" role="alert">
            {erro}
          </p>
        )}
      </form>
    </section>
  );
}

export default SaldoAtual;
