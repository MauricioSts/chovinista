import { motion, AnimatePresence } from "framer-motion";
import { Home, Clock, BarChart3 } from "lucide-react";

const iconMap = {
  dashboard: Home,
  historico: Clock,
  estatisticas: BarChart3,
};

function Tabs({ children, tabs, activeTab, onTabChange }) {
  return (
    <div>
      {/* Desktop Tab Bar (hidden on mobile) */}
      <motion.div
        className="d-none d-md-flex justify-content-center gap-2 mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {tabs.map((tab) => {
          const Icon = iconMap[tab.id];
          const isActive = activeTab === tab.id;
          return (
            <motion.button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              style={{
                background: isActive
                  ? "var(--accent-gradient)"
                  : "var(--card-bg)",
                backdropFilter: isActive ? "none" : "blur(12px)",
                WebkitBackdropFilter: isActive ? "none" : "blur(12px)",
                color: isActive ? "white" : "var(--text-secondary)",
                border: isActive
                  ? "none"
                  : "1px solid var(--glass-border)",
                borderRadius: "var(--radius-full)",
                padding: "10px 24px",
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                fontSize: "0.9rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                boxShadow: isActive ? "var(--shadow-glow)" : "none",
                transition: "all 0.3s ease",
              }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              {Icon && <Icon size={16} />}
              {tab.label}
            </motion.button>
          );
        })}
      </motion.div>

      {/* Tab Content */}
      <motion.div
        style={{
          minHeight: "300px",
          paddingBottom: "100px", /* Space for bottom nav on mobile */
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Mobile Bottom Nav (visible only on mobile) */}
      <div className="bottom-nav d-md-none">
        {tabs.map((tab) => {
          const Icon = iconMap[tab.id];
          const isActive = activeTab === tab.id;
          return (
            <motion.button
              key={tab.id}
              className={`bottom-nav-item ${isActive ? "active" : ""}`}
              onClick={() => onTabChange(tab.id)}
              whileTap={{ scale: 0.9 }}
            >
              <span className="nav-icon">
                {Icon && (
                  <Icon
                    size={22}
                    strokeWidth={isActive ? 2.5 : 1.8}
                  />
                )}
              </span>
              <span>{tab.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

export default Tabs;
