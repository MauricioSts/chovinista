function SaldoAnterior({ saldoAnterior, dataAnterior, mostrar }) {
  return (
    <div
      className="card shadow-sm border-0"
      style={{
        backgroundColor: "#f8bbd0", // 💗 Rosa claro
        borderRadius: "15px",
      }}
    >
      <div className="card-body text-center">
        <h5
          className="card-title mb-3"
          style={{ color: "#880e4f", fontWeight: "600" }}
        >
          Saldo Anterior
        </h5>

        {mostrar && (
          <h2 style={{ color: "#ad1457", fontWeight: "bold" }}>
            {Number(saldoAnterior || 0).toFixed(2)} R$
          </h2>
        )}

        <p className="mt-2" style={{ color: "#ad1457" }}>
          Última atualização: {dataAnterior || "-"}
        </p>
      </div>
    </div>
  );
}

export default SaldoAnterior;
