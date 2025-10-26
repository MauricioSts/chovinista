import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SaldoAtual from "./components/MoneyAtual";
import SaldoAnterior from "./components/SaldoAnterior";
import HistoricoDeValores from "./components/Historico";
import Estatisticas from "./components/Estatisticas";
import Tabs from "./components/Tabs";
import ThemeToggle from "./components/ThemeToggle";
import chovirico from "./assets/chovirico.png";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase/config";
import { Toaster, toast } from "react-hot-toast";
import { ThemeProvider } from "./contexts/ThemeContext";
import SplitText from "./components/SplitText";

function App() {
  const [saldoAtual, setSaldoAtual] = useState(0);
  const [saldoAnterior, setSaldoAnterior] = useState(0);
  const [dataAtual, setDataAtual] = useState("");
  const [dataAnterior, setDataAnterior] = useState("");
  const [historico, setHistorico] = useState([]);
  const [mostrar, setMostrar] = useState(true);
  const [carregando, setCarregando] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");

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
      <ThemeProvider>
        <motion.div
          className="d-flex flex-column align-items-center justify-content-center"
          style={{
            height: "100vh",
            backgroundColor: "var(--bg-primary)",
            overflow: "hidden",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.img
            src={chovirico}
            alt="Porquinho carregando..."
            style={{
              width: "140px",
              height: "140px",
              borderRadius: "50%",
              border: "4px solid var(--accent-light)",
              padding: "10px",
            }}
            animate={{
              rotate: [0, 10, 0, -10, 0],
              scale: [1, 1.05, 0.97, 1.05, 1],
            }}
            transition={{
              duration: 1.4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.p
            className="mt-4"
            style={{
              color: "var(--accent-color)",
              fontWeight: "bold",
              fontSize: "1.1rem",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Carregando seus dados, Miminha... 🐖
          </motion.p>
        </motion.div>
      </ThemeProvider>
    );
  }

  // 🔹 Resto do app
  return (
    <ThemeProvider>
      <motion.div
        className="container my-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Toaster position="top-center" />

        {/* Header com toggle de tema */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4">
          <motion.div
            className="text-center flex-grow-1 mb-3 mb-md-0"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h1
              style={{
                color: "var(--accent-color)",
                fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
              }}
            >
              <SplitText
                text="Olá miminha"
                className="text-2xl font-semibold text-center"
                delay={100}
                duration={0.6}
              />
            </h1>
            <h2 style={{ color: "var(--text-primary)", fontSize: "1.5rem" }}>
              Te amo muito, meu amor! 🐖
            </h2>
            <motion.img
              src={chovirico}
              alt="Foto do usuário"
              style={{
                width: "clamp(100px, 20vw, 140px)",
                height: "clamp(100px, 20vw, 140px)",
                borderRadius: "50%",
                border: "4px solid var(--accent-light)",
                padding: "10px",
              }}
              whileHover={{
                scale: 1.05,
                rotate: [0, -5, 5, 0],
                transition: { duration: 0.3 },
              }}
              whileTap={{ scale: 0.95 }}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.3 }}
          >
            <ThemeToggle />
          </motion.div>
        </div>

        {/* Sistema de Abas */}
        <Tabs
          tabs={[
            { id: "dashboard", label: "Dashboard", icon: "🏠" },
            { id: "historico", label: "Histórico", icon: "📊" },
            { id: "estatisticas", label: "Estatísticas", icon: "📈" },
          ]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        >
          {activeTab === "dashboard" && (
            <div>
              <motion.div
                className="row"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  className="col-md-6 mb-3"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                >
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
                </motion.div>
                <motion.div
                  className="col-md-6 mb-3"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <SaldoAnterior
                    saldoAnterior={saldoAnterior}
                    dataAnterior={dataAnterior}
                    mostrar={mostrar}
                  />
                </motion.div>
              </motion.div>
            </div>
          )}

          {activeTab === "historico" && (
            <HistoricoDeValores
              historico={historico}
              mostrar={mostrar}
              saldoAtual={saldoAtual}
            />
          )}

          {activeTab === "estatisticas" && (
            <Estatisticas
              historico={historico}
              saldoAtual={saldoAtual}
              mostrar={mostrar}
            />
          )}
        </Tabs>

        <motion.footer
          className="mt-4 py-3 border-top text-center"
          style={{ backgroundColor: "var(--footer-bg)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center">
            <span style={{ color: "var(--text-secondary)" }}>
              © 2025 Mimo Finanças
            </span>
            <span style={{ color: "var(--text-secondary)" }}>V0.2.0</span>
            <span style={{ color: "var(--text-secondary)" }}>
              Desenvolvido por{" "}
              <a
                href="https://github.com/MauricioSts"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--accent-color)", textDecoration: "none" }}
              >
                Mauricio
              </a>
            </span>
          </div>
        </motion.footer>
      </motion.div>
    </ThemeProvider>
  );
}

export default App;
