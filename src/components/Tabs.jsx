import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

function Tabs({ children, tabs, activeTab, onTabChange }) {
  return (
    <div className="mt-4">
      {/* Navegação das abas */}
      <motion.div 
        className="nav nav-tabs justify-content-center"
        style={{ 
          borderBottom: "2px solid var(--border-color)",
          flexWrap: "wrap"
        }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {tabs.map((tab, index) => (
          <motion.button
            key={tab.id}
            className={`nav-link ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
            style={{
              backgroundColor: activeTab === tab.id ? "var(--accent-color)" : "transparent",
              color: activeTab === tab.id ? "white" : "var(--text-primary)",
              border: "none",
              borderBottom: activeTab === tab.id ? "2px solid var(--accent-color)" : "2px solid transparent",
              borderRadius: "8px 8px 0 0",
              margin: "0 5px",
              padding: "12px 20px",
              fontWeight: "bold",
              transition: "all 0.3s ease"
            }}
            whileHover={{ 
              scale: 1.05,
              backgroundColor: activeTab === tab.id ? "var(--accent-color)" : "var(--bg-secondary)"
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            {tab.icon && <span style={{ marginRight: "8px" }}>{tab.icon}</span>}
            {tab.label}
          </motion.button>
        ))}
      </motion.div>

      {/* Conteúdo das abas */}
      <motion.div 
        className="tab-content"
        style={{ 
          backgroundColor: "var(--card-bg)",
          borderRadius: "0 0 8px 8px",
          padding: "20px",
          minHeight: "400px"
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default Tabs;
