const DIA = 86400000;
const MES = 30.44; // dias

function parseData(ddmmyyyy) {
  const [d, m, y] = (ddmmyyyy || "").split("/").map(Number);
  const data = new Date(y, m - 1, d);
  return isNaN(data.getTime()) ? null : data;
}

// Projeta o saldo no ritmo médio desde o primeiro lançamento.
// Metas = próximos múltiplos de R$ 1.000 que caem dentro de 1 ano a partir de hoje.
export function preverSaldo(historico, saldoAtual, hoje = new Date()) {
  const datas = historico.map((h) => parseData(h.data)).filter(Boolean);
  if (datas.length < 2) return null;

  const inicio = new Date(Math.min(...datas));
  const primeiro = historico
    .map((h) => ({ h, t: parseData(h.data)?.getTime() }))
    .filter((x) => x.t === inicio.getTime())
    .pop().h; // historico vem do mais novo pro mais antigo: o último do dia é o 1º lançado

  const dias = (hoje - inicio) / DIA;
  if (dias < 7) return null; // pouco tempo pra ter um ritmo confiável

  const porDia = (saldoAtual - primeiro.valor) / dias;
  const porMes = porDia * MES;
  const fimDoAno = new Date(hoje.getTime() + 365 * DIA);
  const emUmAno = saldoAtual + porDia * 365;

  const metas = [];
  if (porDia > 0) {
    let alvo = (Math.floor(saldoAtual / 1000) + 1) * 1000;
    while (alvo <= emUmAno) {
      const diasAte = Math.ceil((alvo - saldoAtual) / porDia);
      metas.push({ alvo, diasAte, data: new Date(hoje.getTime() + diasAte * DIA) });
      alvo += 1000;
    }
  }

  // Se nenhuma meta cabe no ano, diz quando a próxima chegaria
  let proximaForaDoAno = null;
  if (porDia > 0 && metas.length === 0) {
    const alvo = (Math.floor(saldoAtual / 1000) + 1) * 1000;
    const diasAte = Math.ceil((alvo - saldoAtual) / porDia);
    proximaForaDoAno = { alvo, diasAte, data: new Date(hoje.getTime() + diasAte * DIA) };
  }

  return { porMes, emUmAno, fimDoAno, metas, proximaForaDoAno };
}
