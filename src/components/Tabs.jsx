import { motion, AnimatePresence } from "framer-motion";
import { Home, Clock, BarChart3 } from "lucide-react";

const iconMap = {
  dashboard: Home,
  historico: Clock,
  estatisticas: BarChart3,
};

// Mobile-first: barra fixa embaixo (alcance do polegar); vira barra de topo no desktop
function Tabs({ children, tabs, activeTab, onTabChange }) {
  return (
    <>
      <nav className="tabbar" aria-label="Seções">
        {tabs.map((tab) => {
          const Icon = iconMap[tab.id];
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              className={`tabbar-item ${isActive ? "is-active" : ""}`}
              onClick={() => onTabChange(tab.id)}
              aria-current={isActive ? "page" : undefined}
            >
              {isActive && (
                <motion.span
                  layoutId="tab-pill"
                  className="tabbar-pill"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              <Icon size={20} strokeWidth={isActive ? 2 : 1.75} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      <main id="conteudo" className="conteudo">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </>
  );
}

export default Tabs;
