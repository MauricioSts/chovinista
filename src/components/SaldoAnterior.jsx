import { ClockCounterClockwise } from "@phosphor-icons/react";
import { formatBRL } from "../utils/format";

function SaldoAnterior({ saldoAnterior, dataAnterior, mostrar }) {
  return (
    <section className="anterior-card" aria-labelledby="anterior-titulo">
      <span className="icone-tile icone-tile-solido">
        <ClockCounterClockwise size={20} />
      </span>
      <div className="anterior-texto">
        <h2 id="anterior-titulo" className="rotulo">
          Saldo anterior
        </h2>
        <span className="meta-texto">{dataAnterior ? `Em ${dataAnterior}` : "Sem registro"}</span>
      </div>
      <span className="anterior-valor num">{formatBRL(saldoAnterior, mostrar)}</span>
    </section>
  );
}

export default SaldoAnterior;
