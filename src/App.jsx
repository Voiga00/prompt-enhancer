import { Routes, Route } from "react-router-dom";
import { usePromptHistory } from "./hooks/usePromptHistory";
import PromptSidebar from "./routes/PromptSidebar";

import ApiKeyInput from "./routes/ApiKeyInput";
import PromptForm from "./routes/PromptForm";
import QuestionStep from "./routes/QuestionStep";
import FinalPrompt from "./routes/FinalPrompt";
import PromptPreview from "./routes/PromptPreview";

function Layout({ children, prompts, setSelectedIndex }) {
  const clearHistory = () => {
    localStorage.removeItem("prompt_history");
    window.location.reload();
  };

  return (
    <div style={styles.appLayout}>
      <PromptSidebar
        prompts={prompts}
        selectedIndex={null}  // można później śledzić
        onClear={clearHistory}
      />
      <main style={styles.mainContent}>{children}</main>
    </div>
  );
}

export default function App() {
  const { prompts, addPrompt } = usePromptHistory();

  return (
    <Routes>
      <Route path="/" element={<Layout prompts={prompts}><ApiKeyInput /></Layout>} />
      <Route path="/prompt-form" element={<Layout prompts={prompts}><PromptForm addPrompt={addPrompt} /></Layout>} />
      <Route path="/question/:id" element={<Layout prompts={prompts}><QuestionStep addPrompt={addPrompt} /></Layout>} />
      <Route path="/final-prompt" element={<Layout prompts={prompts}><FinalPrompt addPrompt={addPrompt} /></Layout>} />
      <Route path="/prompt/:id" element={<Layout prompts={prompts}><PromptPreview prompts={prompts} /></Layout>} />
    </Routes>
  );
}

const styles = {
  appLayout: {
    display: "flex",
    height: "100vh",
  },
  mainContent: {
    flex: 1,
    padding: "40px",
    backgroundColor: "#1e1e1e",
    overflowY: "auto",
  },
};
