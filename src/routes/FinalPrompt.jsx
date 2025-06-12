import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { optimizePrompt } from "../services/openai";
import { usePromptHistory } from "../hooks/usePromptHistory";

export default function FinalPrompt() {
  const { apiKey, promptData } = useAppContext();
  const [finalPrompt, setFinalPrompt] = useState("");
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const { addPrompt } = usePromptHistory();

  useEffect(() => {
    const generate = async () => {
      if (!promptData || !promptData.prompt || !apiKey) {
        setFinalPrompt("❌ Brakuje danych do wygenerowania prompta.");
        setLoading(false);
        return;
      }

      try {
        const optimized = await optimizePrompt(apiKey, promptData);
        setFinalPrompt(optimized);
      } catch (err) {
        console.error("Błąd przy generowaniu prompta:", err);
        setFinalPrompt("❌ Błąd podczas generowania prompta.");
      } finally {
        setLoading(false);
      }
    };

    generate();
  }, [apiKey, promptData]);

  const handleSave = () => {
    if (finalPrompt.trim()) {
      addPrompt(finalPrompt.trim());
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  return (
    <div>
      <h1>🧠 Finalny prompt</h1>

      {loading ? (
        <p>⏳ Generowanie prompta...</p>
      ) : (
        <>
          <pre style={styles.output}>{finalPrompt}</pre>
          <button onClick={handleSave} style={styles.button}>
            💾 Zapisz prompt
          </button>
          {saved && <p style={{ color: "limegreen", marginTop: "10px" }}>✔️ Zapisano!</p>}
        </>
      )}
    </div>
  );
}

const styles = {
  output: {
    background: "#2a2a2a",
    color: "#ccc",
    padding: "20px",
    borderRadius: "8px",
    whiteSpace: "pre-wrap",
    fontSize: "1rem",
  },
  button: {
    marginTop: "20px",
    padding: "10px 20px",
    fontSize: "1rem",
    backgroundColor: "#444",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};
