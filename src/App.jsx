import { useState, useEffect } from "react";
import SaldoAtual from "./components/MoneyAtual";

import SaldoAnterior from "./components/SaldoAnterior";
import HistoricoDeValores from "./components/Historico";
import chovirico from "./assets/chovirico.png";
function App() {
  // Inicializar estados a partir do localStorage ou valores padrão
  const [saldoAtual, setSaldoAtual] = useState(
    () => parseFloat(localStorage.getItem("saldoAtual")) || 0
  );
  const [saldoAnterior, setSaldoAnterior] = useState(
    () => parseFloat(localStorage.getItem("saldoAnterior")) || 0
  );
  const [dataAtual, setDataAtual] = useState(
    () =>
      localStorage.getItem("dataAtual") ||
      new Date().toLocaleDateString("pt-BR")
  );
  const [dataAnterior, setDataAnterior] = useState(
    () => localStorage.getItem("dataAnterior") || ""
  );
  const [historico, setHistorico] = useState(() => {
    const stored = localStorage.getItem("historico");
    return stored ? JSON.parse(stored) : [];
  });
  const [mostrar, setMostrar] = useState(true);

  // Atualizar localStorage sempre que os estados mudarem
  useEffect(() => {
    localStorage.setItem("saldoAtual", saldoAtual);
    localStorage.setItem("saldoAnterior", saldoAnterior);
    localStorage.setItem("dataAtual", dataAtual);
    localStorage.setItem("dataAnterior", dataAnterior);
    localStorage.setItem("historico", JSON.stringify(historico));
  }, [saldoAtual, saldoAnterior, dataAtual, dataAnterior, historico]);

  return (
    <div className="container my-4">
      {/* Saudação + foto */}
      <div className="text-center mb-4">
        <h1>Olá, Miminha!</h1>
        <img
          src={chovirico} // Futuramente você colocará sua foto
          alt="Foto do usuário"
          className="rounded-circle border border-secondary"
          style={{ width: "120px", height: "120px", objectFit: "cover" }}
        />
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <SaldoAtual
            saldoAtual={saldoAtual}
            setSaldoAtual={setSaldoAtual}
            saldoAnterior={saldoAnterior}
            setSaldoAnterior={setSaldoAnterior}
            dataAtual={dataAtual}
            setDataAtual={setDataAtual}
            setDataAnterior={setDataAnterior}
            setHistorico={setHistorico}
            mostrar={mostrar}
            setMostrar={setMostrar}
          />
        </div>
        <div className="col-md-6 mb-3">
          <SaldoAnterior
            saldoAnterior={saldoAnterior}
            dataAnterior={dataAnterior}
            mostrar={mostrar}
          />
        </div>
      </div>

      <HistoricoDeValores historico={historico} mostrar={mostrar} />
      <footer className="mt-4 py-3 border-top bg-light text-center">
        <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center">
          <span className="text-muted">© 2025 Mimo Finanças</span>
          <span className="text-muted">V0.1</span>
          <span className="text-muted">
            Desenvolvido por{" "}
            <a
              href="https://github.com/MauricioSts"
              target="_blank"
              rel="noopener noreferrer"
            >
              Mauricio
            </a>
          </span>
        </div>
      </footer>
    </div>
  );
}

export default App;
