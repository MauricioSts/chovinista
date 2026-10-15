const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

// Formata em reais; com mostrar=false devolve uma máscara no lugar do valor
export function formatBRL(valor, mostrar = true) {
  if (!mostrar) return "R$ ••••";
  return brl.format(Number(valor) || 0);
}

export function formatSigned(valor, mostrar = true) {
  if (!mostrar) return "••••";
  const n = Number(valor) || 0;
  return `${n >= 0 ? "+" : "−"}${brl.format(Math.abs(n))}`;
}
