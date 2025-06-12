import { Routes, Route, Link } from "react-router-dom";
import ApiKeyInput from "./routes/ApiKeyInput";
import PromptForm from "./routes/PromptForm";
import QuestionStep from "./routes/QuestionStep";
import FinalPrompt from "./routes/FinalPrompt";

function Sidebar() {
  return (
    <div className="sidebar">
      <Link to="/" style={styles.logo}>Prompt Enhancer</Link>
      <div style={styles.historyHeader}>Historia Promptów</div>
      <ul style={styles.historyList}>
        <li>prompt 1</li>
        <li>prompt 2</li>
        <li>prompt 3</li>
      </ul>
    </div>
  );
}

function Layout({ children }) {
  return (
    <div className="app-layout" style={styles.appLayout}>
      <Sidebar />
      <main className="main-content" style={styles.mainContent}>{children}</main>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout><ApiKeyInput /></Layout>} />
      <Route path="/prompt-form" element={<Layout><PromptForm /></Layout>} />
      <Route path="/question/:id" element={<Layout><QuestionStep /></Layout>} />
      <Route path="/final-prompt" element={<Layout><FinalPrompt /></Layout>} />
    </Routes>
  );
}

const styles = {
  appLayout: {
    display: "flex",
    height: "100vh",
  },
  logo: {
    fontSize: "1.4rem",
    fontWeight: "bold",
    color: "#ccc",
    textDecoration: "none",
    marginBottom: "20px",
    display: "block",
  },
  sidebar: {
    backgroundColor: "#2d2d2d",
    width: "220px",
    padding: "20px",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    color: "#fff",
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
  },
  mainContent: {
    flex: 1,
    padding: "40px",
    backgroundColor: "#1e1e1e",
    overflowY: "auto",
  },
};
