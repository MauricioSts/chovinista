import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut } from "lucide-react";
import SaldoAtual from "./components/MoneyAtual";
import SaldoAnterior from "./components/SaldoAnterior";
import HistoricoDeValores from "./components/Historico";
import Estatisticas from "./components/Estatisticas";
import Tabs from "./components/Tabs";
import ThemeToggle from "./components/ThemeToggle";
import LoginScreen from "./components/LoginScreen";
import chovirico from "./assets/chovirico.png";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase/config";
import { Toaster, toast } from "react-hot-toast";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import SplitText from "./components/SplitText";

/* ─── Auth Guard ─── */
function AuthGuard() {
  const { user, loading: authLoading } = useAuth();

  if (authLoading) {
    return (
      <motion.div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "var(--bg-primary)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            border: "3px solid var(--border-color)",
            borderTopColor: "var(--accent-color)",
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  return <AppContent />;
}

/* ─── App Content (only renders when authenticated) ─── */
function AppContent() {
  const { logout } = useAuth();
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

  // 🔹 Tela de carregamento
  if (carregando) {
    return (
      <motion.div
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "var(--bg-primary)",
          overflow: "hidden",
          gap: "20px",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          style={{
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            background: "var(--accent-gradient-soft)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "2px solid var(--glass-border)",
            boxShadow: "var(--shadow-glow)",
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
        >
          <img
            src={chovirico}
            alt="Carregando..."
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        </motion.div>
        <motion.p
          style={{
            color: "var(--text-secondary)",
            fontFamily: "'Inter', sans-serif",
            fontWeight: 500,
            fontSize: "0.95rem",
          }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Carregando seus dados, Miminha... 🐖
        </motion.p>
      </motion.div>
    );
  }

  // 🔹 App
  return (
    <motion.div
      className="container"
      style={{ paddingTop: "20px", paddingBottom: "16px" }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "var(--card-bg-solid)",
            color: "var(--text-primary)",
            borderRadius: "var(--radius-full)",
            border: "1px solid var(--border-color)",
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.9rem",
            boxShadow: "var(--shadow-lg)",
          },
        }}
      />

      {/* ─────── Header ─────── */}
      <motion.header
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          marginBottom: "24px",
          position: "relative",
        }}
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        {/* Theme Toggle + Logout — top right */}
        <motion.div
          style={{
            position: "absolute",
            top: "0",
            right: "0",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.3 }}
        >
          <ThemeToggle />
          <motion.button
            onClick={logout}
            title="Sair"
            style={{
              background: "var(--card-bg)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              border: "1px solid var(--glass-border)",
              borderRadius: "50%",
              width: "28px",
              height: "28px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "var(--text-muted)",
              padding: 0,
            }}
            whileHover={{ scale: 1.1, color: "var(--accent-color)" }}
            whileTap={{ scale: 0.9 }}
          >
            <LogOut size={13} />
          </motion.button>
        </motion.div>

        {/* Avatar */}
        <motion.div
          style={{
            width: "clamp(80px, 18vw, 110px)",
            height: "clamp(80px, 18vw, 110px)",
            borderRadius: "50%",
            background: "var(--accent-gradient-soft)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "2px solid var(--glass-border)",
            boxShadow: "var(--shadow-glow)",
            marginBottom: "12px",
          }}
          whileHover={{
            scale: 1.05,
            rotate: [0, -5, 5, 0],
            transition: { duration: 0.3 },
          }}
          whileTap={{ scale: 0.95 }}
        >
          <img
            src={chovirico}
            alt="Foto do usuário"
            style={{
              width: "calc(100% - 12px)",
              height: "calc(100% - 12px)",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        </motion.div>

        {/* Greeting */}
        <h1
          style={{
            color: "var(--accent-color)",
            fontSize: "clamp(1.5rem, 5vw, 2.2rem)",
            marginBottom: "4px",
          }}
        >
          <SplitText
            text="Olá miminha"
            className="font-display"
            delay={100}
            duration={0.6}
          />
        </h1>
        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: "clamp(0.9rem, 2.5vw, 1.1rem)",
            fontWeight: 500,
            margin: 0,
          }}
        >
          Te amo muito, meu amor! 🐖
        </p>
      </motion.header>

      {/* ─────── Tabs + Content ─────── */}
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
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
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
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
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

      {/* ─────── Footer (desktop only) ─────── */}
      <motion.footer
        className="d-none d-md-block"
        style={{
          marginTop: "32px",
          padding: "20px 0",
          borderTop: "1px solid var(--border-color)",
          textAlign: "center",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.4 }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "var(--text-muted)",
            fontSize: "0.8rem",
            fontWeight: 500,
          }}
        >
          <span>© 2025 Mimo Finanças</span>
          <span>V0.2.0</span>
          <span>
            Desenvolvido por{" "}
            <a
              href="https://github.com/MauricioSts"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "var(--accent-color)",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              Mauricio
            </a>
          </span>
        </div>
      </motion.footer>
    </motion.div>
  );
}

/* ─── Root App ─── */
function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AuthGuard />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
