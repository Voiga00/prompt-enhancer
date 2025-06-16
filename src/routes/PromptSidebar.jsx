import React from "react";
import { Link, useNavigate } from "react-router-dom";

const PromptSidebar = ({ prompts, selectedIndex, onClear }) => {
  const navigate = useNavigate();

  return (
    <div style={styles.sidebar}>
      <Link to="/prompt-form" style={styles.logo}>Prompt Enhancer</Link>
      <div style={styles.historyHeader}>📜 Historia Promptów</div>
      <ul style={styles.historyList}>
        {prompts.length === 0 && <li style={{ color: "#888" }}>Brak historii</li>}
        {prompts.map((text, index) => (
          <li key={index}>
            <button
              onClick={() => navigate(`/prompt/${index}`)}
              style={{
                ...styles.button,
                background: selectedIndex === index ? "#444" : "transparent"
              }}
              title={text}
            >
              Prompt {index + 1}
            </button>
          </li>
        ))}
      </ul>
      {prompts.length > 0 && (
        <button onClick={onClear} style={styles.clearButton}>
          🧹 Wyczyść historię
        </button>
      )}
    </div>
  );
};

const styles = {
  sidebar: {
    backgroundColor: "#2d2d2d",
    width: "220px",
    padding: "20px",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    color: "#fff",
  },
  logo: {
    fontSize: "1.4rem",
    fontWeight: "bold",
    color: "#ccc",
    textDecoration: "none",
    marginBottom: "20px",
    display: "block",
  },
  historyHeader: {
    fontSize: "1rem",
    marginBottom: "10px",
  },
  historyList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    fontSize: "0.9rem",
    color: "#ccc",
    flex: 1,
    overflowY: "auto"
  },
  button: {
    display: "block",
    width: "100%",
    textAlign: "left",
    padding: "8px 10px",
    marginBottom: "6px",
    color: "#ccc",
    border: "none",
    cursor: "pointer",
    borderRadius: "4px"
  },
  clearButton: {
    marginTop: "10px",
    background: "#551010",
    color: "#fff",
    padding: "8px 12px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  }
};

export default PromptSidebar;
