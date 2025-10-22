import { useState, useEffect } from "react";
import SaldoAtual from "./components/MoneyAtual";
import SaldoAnterior from "./components/SaldoAnterior";
import HistoricoDeValores from "./components/Historico";
import chovirico from "./assets/chovirico.png";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase/config";
import { Toaster, toast } from "react-hot-toast";

function App() {
  const [saldoAtual, setSaldoAtual] = useState(0);
  const [saldoAnterior, setSaldoAnterior] = useState(0);
  const [dataAtual, setDataAtual] = useState("");
  const [dataAnterior, setDataAnterior] = useState("");
  const [historico, setHistorico] = useState([]);
  const [mostrar, setMostrar] = useState(true);
  const [carregando, setCarregando] = useState(true);

  // 🔹 Carregar dados do Firestore
  useEffect(() => {
    async function carregarDados() {
      try {
        const docRef = doc(db, "financeiro", "dados");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setSaldoAtual(Number(data.saldoAtual) || 0);
          setSaldoAnterior(Number(data.saldoAnterior) || 0);
          setDataAtual(data.dataAtual || "");
          setDataAnterior(data.dataAnterior || "");
          setHistorico(data.historico || []);
          console.log("✅ Dados carregados do Firestore!");
        } else {
          console.log("Nenhum dado encontrado no Firestore.");
        }
      } catch (error) {
        console.error("❌ Erro ao carregar dados:", error);
      } finally {
        setCarregando(false);
      }
    }

    carregarDados();
  }, []);

  // 🔹 Salvar no Firestore
  useEffect(() => {
    if (carregando) return;

    async function salvarDados() {
      try {
        const docRef = doc(db, "financeiro", "dados");
        await setDoc(
          docRef,
          {
            saldoAtual,
            saldoAnterior,
            dataAtual,
            dataAnterior,
            historico,
          },
          { merge: true }
        );
        toast.success("Dados atualizados 🐖");
      } catch (error) {
        console.error("❌ Erro ao salvar no Firestore:", error);
      }
    }

    salvarDados();
  }, [
    saldoAtual,
    saldoAnterior,
    dataAtual,
    dataAnterior,
    historico,
    carregando,
  ]);

  // 🔹 Tela de carregamento personalizada (porquinho elástico)
  if (carregando) {
    return (
      <div
        className="d-flex flex-column align-items-center justify-content-center"
        style={{
          height: "100vh",
          backgroundColor: "#fff",
          overflow: "hidden",
        }}
      >
        <img
          src={chovirico}
          alt="Porquinho carregando..."
          style={{
            width: "140px",
            height: "140px",
            borderRadius: "50%",
            border: "4px solid #f8bbd0",
            padding: "10px",
            animation: "elasticSpin 1.4s ease-in-out infinite",
          }}
        />
        <p
          className="mt-4"
          style={{
            color: "#e91e63",
            fontWeight: "bold",
            fontSize: "1.1rem",
          }}
        >
          Carregando seus dados, Miminha... 🐖
        </p>

        {/* 🔸 Animação CSS embutida */}
        <style>
          {`
            @keyframes elasticSpin {
              0% { transform: rotate(0deg) scale(1); }
              25% { transform: rotate(10deg) scale(1.05); }
              50% { transform: rotate(0deg) scale(0.97); }
              75% { transform: rotate(-10deg) scale(1.05); }
              100% { transform: rotate(0deg) scale(1); }
            }
          `}
        </style>
      </div>
    );
  }

  // 🔹 Resto do app
  return (
    <div className="container my-4">
      <Toaster position="top-center" />
      <div className="text-center mb-4">
        <h1 style={{ color: "#e91e63" }}>
          <span style={{ color: "#000" }}>Olá,</span> Miminha!
        </h1>
        <img
          src={chovirico}
          alt="Foto do usuário"
          style={{
            width: "140px",
            height: "140px",
            borderRadius: "50%",
            border: "4px solid #f8bbd0",
            padding: "10px",
          }}
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

      <HistoricoDeValores
        historico={historico}
        mostrar={mostrar}
        saldoAtual={saldoAtual}
      />

      <footer className="mt-4 py-3 border-top bg-light text-center">
        <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center">
          <span className="text-muted">© 2025 Mimo Finanças</span>
          <span className="text-muted">V0.2.0</span>
          <span className="text-muted">
            Desenvolvido por{" "}
            <a
              href="https://github.com/MauricioSts"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#e91e63", textDecoration: "none" }}
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
