import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { LogOut } from "lucide-react";
import SaldoAtual from "./components/MoneyAtual";
import Lancamento from "./components/Lancamento";
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

const novoId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

/* ─── Auth Guard ─── */
function AuthGuard() {
  const { user, loading: authLoading } = useAuth();

  if (authLoading) return <TelaCarregando />;
  if (!user) return <LoginScreen />;
  return <AppContent />;
}

function TelaCarregando({ texto }) {
  return (
    <div className="carregando" role="status">
      <motion.img
        src={chovirico}
        alt=""
        className="avatar avatar-lg"
        animate={{ rotate: [0, 8, 0, -8, 0], scale: [1, 1.04, 0.98, 1.04, 1] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
      />
      {texto && <p>{texto}</p>}
    </div>
  );
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

  // O toast de "Desfazer" é criado antes do novo estado existir; o ref dá a versão atual
  const historicoRef = useRef(historico);
  useEffect(() => {
    historicoRef.current = historico;
  }, [historico]);

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
          // Lançamentos antigos não tinham id; ganham um para poderem ser cancelados
          setHistorico(
            (data.historico || []).map((h) => (h.id ? h : { ...h, id: novoId() }))
          );
        }
      } catch (error) {
        console.error("❌ Erro ao carregar dados:", error);
        toast.error("Não consegui carregar os dados. Recarregue a página.");
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
      } catch (error) {
        console.error("❌ Erro ao salvar no Firestore:", error);
        toast.error("Não consegui salvar. Confira a internet e tente de novo.");
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

  function cancelarLancamento(item) {
    const atual = historicoRef.current;
    const index = atual.findIndex((h) => h === item || (item.id && h.id === item.id));
    if (index === -1) return;

    const restante = atual.filter((_, i) => i !== index);
    setHistorico(restante);

    // Cancelar um dos dois mais recentes muda o saldo atual/anterior
    if (index <= 1) {
      setSaldoAtual(restante[0]?.valor ?? 0);
      setDataAtual(restante[0]?.data ?? "");
      setSaldoAnterior(restante[1]?.valor ?? 0);
      setDataAnterior(restante[1]?.data ?? "");
    }

    toast.success("Lançamento cancelado");
  }

  function atualizarSaldo(valor) {
    const data = new Date().toLocaleDateString("pt-BR");
    const item = { id: novoId(), valor, data };

    setSaldoAnterior(saldoAtual);
    setSaldoAtual(valor);
    setDataAnterior(dataAtual);
    setDataAtual(data);
    setHistorico((prev) => [item, ...prev]);

    toast(
      (t) => (
        <span className="toast-desfazer">
          Saldo atualizado
          <button
            type="button"
            onClick={() => {
              toast.dismiss(t.id);
              cancelarLancamento(item);
            }}
          >
            Desfazer
          </button>
        </span>
      ),
      { duration: 6000 }
    );
  }

  if (carregando) return <TelaCarregando texto="Contando as moedinhas…" />;

  const recentes = historico.slice(0, 3);

  return (
    <div className="app">
      <a href="#conteudo" className="skip-link">
        Pular para o conteúdo
      </a>
      <Toaster
        position="top-center"
        containerStyle={{ top: "calc(12px + env(safe-area-inset-top))" }}
        toastOptions={{ className: "toast" }}
      />

      {/* ─────── Header ─────── */}
      <motion.header
        className="topo"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <img src={chovirico} alt="Porquinho" className="avatar" />
        <div className="topo-texto">
          <SplitText
            text="Olá, miminha"
            tag="h1"
            className="topo-titulo"
            textAlign="left"
            delay={45}
            duration={0.5}
            from={{ opacity: 0, y: 16 }}
          />
          <p className="topo-sub">Te amo muito, meu amor 🐖</p>
        </div>
        <div className="topo-acoes">
          <ThemeToggle />
          <button type="button" className="icon-btn" onClick={logout} aria-label="Sair">
            <LogOut size={18} strokeWidth={1.75} />
          </button>
        </div>
      </motion.header>

      {/* ─────── Tabs + Content ─────── */}
      <Tabs
        tabs={[
          { id: "dashboard", label: "Início" },
          { id: "historico", label: "Histórico" },
          { id: "estatisticas", label: "Crescimento" },
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      >
        {activeTab === "dashboard" && (
          <div className="pilha">
            <SaldoAtual
              saldoAtual={saldoAtual}
              saldoAnterior={saldoAnterior}
              dataAtual={dataAtual}
              dataAnterior={dataAnterior}
              onAtualizar={atualizarSaldo}
              mostrar={mostrar}
              setMostrar={setMostrar}
            />

            {recentes.length > 0 && (
              <section aria-labelledby="recentes-titulo">
                <div className="secao-topo">
                  <h2 id="recentes-titulo" className="secao-titulo">
                    Últimos lançamentos
                  </h2>
                  <button
                    type="button"
                    className="btn-text"
                    onClick={() => setActiveTab("historico")}
                  >
                    Ver tudo
                  </button>
                </div>
                <ul className="lista">
                  {recentes.map((item) => (
                    <Lancamento
                      key={item.id}
                      item={item}
                      mostrar={mostrar}
                      onCancelar={cancelarLancamento}
                    />
                  ))}
                </ul>
              </section>
            )}
          </div>
        )}

        {activeTab === "historico" && (
          <HistoricoDeValores
            historico={historico}
            mostrar={mostrar}
            onCancelar={cancelarLancamento}
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

      <footer className="rodape">
        <span>Mimo Finanças · v0.3.0</span>
        <span>
          Feito por{" "}
          <a href="https://github.com/MauricioSts" target="_blank" rel="noopener noreferrer">
            Mauricio
          </a>
        </span>
      </footer>
    </div>
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
