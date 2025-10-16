function SaldoAnterior({ saldoAnterior, dataAnterior }) {
  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h5 className="card-title">Saldo Anterior</h5>
        <h2 className="text-secondary">{saldoAnterior.toFixed(2)} R$</h2>
        <p>Última atualização: {dataAnterior || "-"}</p>
      </div>
    </div>
  );
}

export default SaldoAnterior;
