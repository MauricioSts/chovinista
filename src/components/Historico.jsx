function HistoricoDeValores({ historico, mostrar }) {
  return (
    <div className="card mt-4 shadow-sm">
      <div className="card-body">
        <h5 className="card-title">Histórico de Valores</h5>

        {historico.length === 0 ? (
          <p>Nenhum registro ainda.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered table-striped table-hover">
              <thead className="table-light">
                <tr>
                  <th>Valor (R$)</th>
                  <th>Data</th>
                </tr>
              </thead>
              {mostrar && (
                <tbody>
                  {historico.map((item, index) => (
                    <tr key={index}>
                      <td
                        className={
                          item.valor >= 0 ? "text-success" : "text-danger"
                        }
                      >
                        {item.valor.toFixed(2)}
                      </td>
                      <td>{item.data}</td>
                    </tr>
                  ))}
                </tbody>
              )}
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default HistoricoDeValores;
