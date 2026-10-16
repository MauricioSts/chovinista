// "DD/MM/YYYY" -> número comparável (YYYYMMDD); data inválida vai pro começo
function chaveData(ddmmyyyy) {
  const [d, m, y] = (ddmmyyyy || "").split("/").map(Number);
  if (!d || !m || !y) return 0;
  return y * 10000 + m * 100 + d;
}

// Agrupa o histórico por mês, do mais novo pro mais antigo.
// Cada grupo tem `items` (mais novo primeiro, como na tela), `fechamento`
// (último valor do mês) e `variacao` = fechamento − fechamento do último mês
// anterior que tem registro (0 de base no primeiro mês do histórico).
export function agruparPorMes(historico) {
  // Ordem crescente por data; no mesmo dia vale a ordem de lançamento
  // (o array vem do mais novo pro mais antigo, então índice maior = mais antigo)
  const crescente = historico
    .map((item, index) => ({ item, index, chave: chaveData(item.data) }))
    .sort((a, b) => a.chave - b.chave || b.index - a.index)
    .map(({ item }) => item);

  const grupos = [];
  crescente.forEach((item) => {
    const parts = item.data.split("/");
    const mesAno = parts.length >= 3 ? `${parts[1]}/${parts[2]}` : item.data;
    const atual = grupos[grupos.length - 1];
    if (atual && atual.mesAno === mesAno) atual.items.push(item);
    else grupos.push({ mesAno, items: [item] });
  });

  let fechamentoAnterior = 0;
  grupos.forEach((g) => {
    g.fechamento = g.items[g.items.length - 1].valor;
    g.variacao = g.fechamento - fechamentoAnterior;
    fechamentoAnterior = g.fechamento;
    g.items.reverse();
  });

  return grupos.reverse();
}
