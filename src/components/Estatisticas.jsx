import { useState } from "react";
import { motion } from "framer-motion";
import {
  TrendUp,
  TrendDown,
  CalendarBlank,
  CurrencyCircleDollar,
  Coins,
  Wallet,
  ChartBar,
  Flag,
  Target,
} from "@phosphor-icons/react";
import { formatBRL, formatSigned } from "../utils/format";
import { preverSaldo, ritmoMensal } from "../utils/previsao";

const MESES_CURTOS = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
const CHAVE_POR_MES = "chovinista:porMes";

function parseData(ddmmyyyy) {
  const [d, m, y] = (ddmmyyyy || "").split("/").map(Number);
  const data = new Date(y, m - 1, d);
  return isNaN(data.getTime()) ? null : data;
}

function lerPorMes() {
  try {
    return localStorage.getItem(CHAVE_POR_MES) || "";
  } catch {
    return "";
  }
}

const entrada = (i) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: 0.05 + i * 0.06, duration: 0.5, ease: [0.32, 0.72, 0, 1] },
});

function Estatisticas({ historico, saldoAtual, mostrar }) {
  if (historico.length === 0) {
    return (
      <div className="vazio">
        <span className="icone-tile icone-tile-lg">
          <ChartBar size={28} />
        </span>
        <p className="vazio-titulo">Sem dados pra comparar</p>
        <p className="vazio-texto">Depois de dois lançamentos dá pra ver quanto o porquinho cresceu.</p>
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
  const Tendencia = positivo ? TrendUp : TrendDown;

  // Último valor de cada mês, do mais antigo pro mais novo
  const grupos = {};
  historico.forEach((item) => {
    const parts = item.data.split("/");
    if (parts.length < 3) return;
    const key = `${parts[1]}/${parts[2]}`;
    if (!grupos[key]) {
      grupos[key] = { key, mes: parseInt(parts[1], 10), ano: parseInt(parts[2], 10), valor: item.valor };
    }
  });
  const barras = Object.values(grupos).sort((a, b) => a.ano - b.ano || a.mes - b.mes);
  const maxVal = Math.max(...barras.map((b) => b.valor), 1);

  const cards = [
    { Icon: CalendarBlank, rotulo: "Período", valor: `${totalDias} ${totalDias === 1 ? "dia" : "dias"}` },
    {
      Icon: CurrencyCircleDollar,
      rotulo: "Variação",
      valor: formatSigned(crescimento, mostrar),
      tom: positivo ? "is-pos" : "is-neg",
    },
    { Icon: Coins, rotulo: "Valor inicial", valor: formatBRL(valorInicial, mostrar) },
    { Icon: Wallet, rotulo: "Valor atual", valor: formatBRL(saldoAtual, mostrar) },
  ];

  return (
    <section aria-labelledby="stats-titulo">
      <div className="secao-cabeca">
        <span className="eyebrow">Desde {maisAntigo.data}</span>
        <h2 id="stats-titulo" className="secao-titulo">
          Análise de crescimento
        </h2>
      </div>

      <motion.div className="bezel" {...entrada(0)}>
        <div className="bezel-core stats-hero">
          <span className={`icone-tile icone-tile-lg ${positivo ? "is-pos" : "is-neg"}`}>
            <Tendencia size={28} />
          </span>
          <span className="rotulo">Crescimento total</span>
          <div className={`stats-percent num ${positivo ? "is-pos" : "is-neg"}`}>
            {mostrar
              ? `${positivo ? "+" : "−"}${Math.abs(percentual).toFixed(1).replace(".", ",")}%`
              : "••••"}
          </div>
          <p className="meta-texto num">{formatSigned(porDia, mostrar)} por dia</p>
        </div>
      </motion.div>

      <div className="mini-grid">
        {cards.map(({ Icon, rotulo, valor, tom }, i) => (
          <motion.div key={rotulo} className="mini-card" {...entrada(i + 1)}>
            <span className="icone-tile">
              <Icon size={20} />
            </span>
            <span className="rotulo">{rotulo}</span>
            <span className={`mini-valor num ${tom || ""}`}>{valor}</span>
          </motion.div>
        ))}
      </div>

      <motion.div {...entrada(5)}>
        <Previsao historico={historico} saldoAtual={saldoAtual} mostrar={mostrar} />
      </motion.div>

      <motion.div className="bezel" {...entrada(6)}>
        <div className="bezel-core barras-card">
          <span className="rotulo">Evolução mensal</span>
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
                    transition={{ delay: 0.4 + index * 0.06, type: "spring", stiffness: 160, damping: 22 }}
                  />
                  <span className="barra-label">{MESES_CURTOS[bar.mes - 1]}</span>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function Previsao({ historico, saldoAtual, mostrar }) {
  const [texto, setTexto] = useState(lerPorMes);
  const ritmo = ritmoMensal(historico, saldoAtual);

  function mudar(valor) {
    setTexto(valor);
    try {
      localStorage.setItem(CHAVE_POR_MES, valor);
    } catch {
      /* sem storage: vale só nesta sessão */
    }
  }

  const bruto = String(texto);
  const digitado = parseFloat(bruto.includes(",") ? bruto.replace(/\./g, "").replace(",", ".") : bruto);
  const porMes = texto ? digitado : ritmo;
  const previsao = porMes > 0 ? preverSaldo(saldoAtual, porMes) : null;
  const ritmoTexto = ritmo > 0 ? formatBRL(ritmo, true) : null;

  return (
    <div className="bezel">
      <div className="bezel-core previsao-card">
        <div className="card-topo">
          <span className="rotulo">Previsão · 1 ano</span>
          <span className="icone-tile icone-tile-sm">
            <Target size={18} />
          </span>
        </div>

        <label htmlFor="por-mes" className="previsao-pergunta">
          Quanto você vai guardar por mês?
        </label>
        <div className="campo">
          <span className="campo-prefixo">R$</span>
          <input
            id="por-mes"
            type="text"
            inputMode="decimal"
            autoComplete="off"
            placeholder={ritmoTexto ? ritmoTexto.replace("R$", "").trim() : "200,00"}
            value={texto}
            onChange={(e) => mudar(e.target.value)}
          />
          {texto && (
            <button type="button" className="campo-limpar" onClick={() => mudar("")}>
              Limpar
            </button>
          )}
        </div>
        <p className="meta-texto previsao-hint">
          {ritmoTexto
            ? texto
              ? `Seu ritmo até agora é ${ritmoTexto}/mês.`
              : `Vazio = seu ritmo até agora (${ritmoTexto}/mês).`
            : "Digite um valor pra ver quando chega em cada mil."}
        </p>

        {previsao && (
          <>
            {previsao.metas.length > 0 ? (
              <ol className="previsao-metas">
                {previsao.metas.map((m) => (
                  <li key={m.alvo}>
                    <Flag size={18} />
                    <span className="num previsao-alvo">{formatBRL(m.alvo, mostrar)}</span>
                    <span className="previsao-quando">
                      {MESES_CURTOS[m.data.getMonth()]}/{m.data.getFullYear()}
                      <span className="previsao-dias num">
                        {m.diasAte <= 45
                          ? `${m.diasAte} ${m.diasAte === 1 ? "dia" : "dias"}`
                          : `~${Math.round(m.diasAte / 30.44)} meses`}
                      </span>
                    </span>
                  </li>
                ))}
              </ol>
            ) : (
              previsao.proximaForaDoAno && (
                <p className="previsao-nota">
                  Nesse ritmo, {formatBRL(previsao.proximaForaDoAno.alvo, mostrar)} só em{" "}
                  {MESES_CURTOS[previsao.proximaForaDoAno.data.getMonth()]}/
                  {previsao.proximaForaDoAno.data.getFullYear()}.
                </p>
              )
            )}
            <p className="previsao-final">
              <span>Em {previsao.fimDoAno.toLocaleDateString("pt-BR")}</span>
              <strong className="num">~{formatBRL(previsao.emUmAno, mostrar)}</strong>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default Estatisticas;
