import { motion, AnimatePresence } from "framer-motion";
import { House, ClockCounterClockwise, ChartBar } from "@phosphor-icons/react";

const iconMap = {
  dashboard: House,
  historico: ClockCounterClockwise,
  estatisticas: ChartBar,
};

// Mobile-first: ilha flutuante embaixo (alcance do polegar); no desktop sobe pro topo
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
              <Icon size={22} weight={isActive ? "fill" : "light"} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      <main id="conteudo" className="conteudo">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </>
  );
}

export default Tabs;
