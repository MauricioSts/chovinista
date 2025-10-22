import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

function SaldoAtual({
  saldoAtual,
  setSaldoAtual,
  saldoAnterior,
  setSaldoAnterior,
  dataAtual,
  setDataAtual,
  setDataAnterior,
  setHistorico,
  mostrar,
  setMostrar,
}) {
  const [novoValor, setNovoValor] = useState("");

  function handleAtualizar() {
    if (!novoValor) return toast.error("Digite um valor válido 🐖");
    const novoValorNumerico = parseFloat(novoValor);
    if (isNaN(novoValorNumerico)) return alert("Valor inválido!");

    const valorAntigo = saldoAtual;

    const dataAntiga = dataAtual;

    setSaldoAnterior(saldoAtual);
    setSaldoAtual(novoValorNumerico);
    const novaData = new Date().toLocaleDateString("pt-BR");
    setDataAnterior(dataAtual);
    setDataAtual(novaData);

    setHistorico((prev) => [
      { valor: novoValorNumerico, data: novaData },
      ...prev,
    ]);

    setNovoValor("");
  }

  const alternarVisibilidade = () => {
    setMostrar(!mostrar);
  };
  const crescimento = saldoAnterior
    ? (((saldoAtual - saldoAnterior) / saldoAnterior) * 100).toFixed(2)
    : "0.00";

  const cresceu = parseFloat(crescimento) < 0 ? "diminuiu" : "cresceu";

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h5 className="card-title">
          Saldo Atual{" "}
          <button
            className="btn"
            style={{ backgroundColor: "#F4C2C2", border: "none" }}
            onClick={alternarVisibilidade}
          >
            {mostrar ? <Eye size={20} /> : <EyeOff size={20} />}
          </button>
        </h5>
        {mostrar && (
          <h2 style={{ color: " #e91e63" }}>{saldoAtual.toFixed(2)} R$</h2>
        )}

        <p className="mb-1">Última atualização: {dataAtual}</p>
        {mostrar && (
          <p className="mb-3">
            <span style={{ color: "#e91e63", fontWeight: "bold" }}>
              {cresceu} {Math.abs(crescimento)}%
            </span>{" "}
            em relação ao valor anterior
          </p>
        )}

        <div className="input-group mb-3">
          <input
            type="number"
            className="form-control"
            placeholder="Novo valor"
            value={novoValor}
            onChange={(e) => setNovoValor(e.target.value)}
          />
          <button
            className="btn"
            style={{ backgroundColor: "#F4C2C2", border: "none" }}
            onClick={handleAtualizar}
          >
            Atualizar
          </button>
        </div>
      </div>
    </div>
  );
}

export default SaldoAtual;
