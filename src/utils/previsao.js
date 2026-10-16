const DIA = 86400000;
const MES = 30.44; // dias

function parseData(ddmmyyyy) {
  const [d, m, y] = (ddmmyyyy || "").split("/").map(Number);
  const data = new Date(y, m - 1, d);
  return isNaN(data.getTime()) ? null : data;
}

// Quanto ela guardou por mês, em média, desde o primeiro lançamento (null se não dá pra saber)
export function ritmoMensal(historico, saldoAtual, hoje = new Date()) {
  const comData = historico
    .map((h) => ({ h, t: parseData(h.data)?.getTime() }))
    .filter((x) => x.t);
  if (comData.length < 2) return null;

  const tInicio = Math.min(...comData.map((x) => x.t));
  // historico vem do mais novo pro mais antigo: o último do dia é o 1º lançado
  const primeiro = comData.filter((x) => x.t === tInicio).pop().h;
  const dias = (hoje.getTime() - tInicio) / DIA;
  if (dias < 7) return null;

  return ((saldoAtual - primeiro.valor) / dias) * MES;
}

// Projeta 1 ano a partir de hoje guardando `porMes` por mês.
// Metas = próximos múltiplos de R$ 1.000 que caem dentro desse ano.
export function preverSaldo(saldoAtual, porMes, hoje = new Date()) {
  const porDia = porMes / MES;
  const fimDoAno = new Date(hoje.getTime() + 365 * DIA);
  const emUmAno = saldoAtual + porDia * 365;

  const metas = [];
  let proximaForaDoAno = null;
  if (porDia > 0) {
    let alvo = (Math.floor(saldoAtual / 1000) + 1) * 1000;
    while (alvo <= emUmAno) {
      const diasAte = Math.ceil((alvo - saldoAtual) / porDia);
      metas.push({ alvo, diasAte, data: new Date(hoje.getTime() + diasAte * DIA) });
      alvo += 1000;
    }
    // Se nenhuma meta cabe no ano, diz quando a próxima chegaria
    if (metas.length === 0) {
      const diasAte = Math.ceil((alvo - saldoAtual) / porDia);
      proximaForaDoAno = { alvo, diasAte, data: new Date(hoje.getTime() + diasAte * DIA) };
    }
  }

  return { porMes, emUmAno, fimDoAno, metas, proximaForaDoAno };
}
