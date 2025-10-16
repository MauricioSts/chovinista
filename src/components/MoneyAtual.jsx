import { useState } from "react";

function SaldoAtual({
  saldoAtual,
  setSaldoAtual,
  saldoAnterior,
  setSaldoAnterior,
  dataAtual,
  setDataAtual,
  setDataAnterior,
  setHistorico,
}) {
  const [novoValor, setNovoValor] = useState("");

  function handleAtualizar() {
    if (!novoValor) return alert("Digite um valor válido");
    const novoValorNumerico = parseFloat(novoValor);
    if (isNaN(novoValorNumerico)) return alert("Valor inválido!");

    const valorAntigo = saldoAtual;
    const dataAntiga = dataAtual;

    setSaldoAnterior(saldoAtual);
    setSaldoAtual(novoValorNumerico);
    const novaData = new Date().toLocaleDateString("pt-BR");
    setDataAnterior(dataAtual);
    setDataAtual(novaData);

    setHistorico((prev) => [{ valor: valorAntigo, data: dataAntiga }, ...prev]);

    setNovoValor("");
  }

  const crescimento = saldoAnterior
    ? (((saldoAtual - saldoAnterior) / saldoAnterior) * 100).toFixed(2)
    : "0.00";

  const cresceu = parseFloat(crescimento) < 0 ? "diminuiu" : "cresceu";

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h5 className="card-title">Saldo Atual</h5>
        <h2 className="text-primary">{saldoAtual.toFixed(2)} R$</h2>
        <p className="mb-1">Última atualização: {dataAtual}</p>
        <p className="mb-3">
          {cresceu} {Math.abs(crescimento)}% em relação ao valor anterior
        </p>

        <div className="input-group mb-3">
          <input
            type="number"
            className="form-control"
            placeholder="Novo valor"
            value={novoValor}
            onChange={(e) => setNovoValor(e.target.value)}
          />
          <button className="btn btn-primary" onClick={handleAtualizar}>
            Atualizar
          </button>
        </div>
      </div>
     
    </div>
  );
}

export default SaldoAtual;
