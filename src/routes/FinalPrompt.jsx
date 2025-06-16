import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { optimizePrompt, generateImageFromPrompt } from "../services/openai";
import { usePromptHistory } from "../hooks/usePromptHistory";

export default function FinalPrompt() {
  const { apiKey, promptData } = useAppContext();
  const [finalPrompt, setFinalPrompt] = useState("");
  const [loadingPrompt, setLoadingPrompt] = useState(true);
  const [saved, setSaved] = useState(false);
  const [imgUrl, setImgUrl] = useState("");
  const [loadingImg, setLoadingImg] = useState(false);
  const [errorImg, setErrorImg] = useState("");
  const { addPrompt } = usePromptHistory();

  useEffect(() => {
    const gen = async () => {
      if (!promptData || !promptData.prompt || !apiKey) {
        setFinalPrompt("❌ Brakuje danych do wygenerowania prompta.");
        setLoadingPrompt(false);
        return;
      }
      try {
        const opt = await optimizePrompt(apiKey, promptData);
        setFinalPrompt(opt);
      } catch (e) {
        console.error(e);
        setFinalPrompt("❌ Błąd generując prompt");
      } finally {
        setLoadingPrompt(false);
      }
    };
    gen();
  }, [apiKey, promptData]);

  const handleSave = () => {
    if (finalPrompt.trim()) {
      addPrompt(finalPrompt.trim());
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const handleGenerate = async () => {
    setErrorImg("");
    setLoadingImg(true);
    try {
      const url = await generateImageFromPrompt(apiKey, finalPrompt);
      setImgUrl(url);
    } catch (e) {
      console.error(e);
      setErrorImg("❌ Błąd generowania obrazu.");
    } finally {
      setLoadingImg(false);
    }
  };

  return (
    <div>
      <h1>🧠 Finalny prompt</h1>

      {loadingPrompt ? (
        <p>⏳ Generowanie prompta...</p>
      ) : (
        <>
          <pre style={styles.output}>{finalPrompt}</pre>
          <button onClick={handleSave} style={styles.button}>
            💾 Zapisz prompt
          </button>
          {saved && <p style={{ color: "limegreen", marginTop: "10px" }}>✔️ Zapisano!</p>}

          <div style={{ marginTop: "30px" }}>
            <button onClick={handleGenerate} style={styles.button} disabled={loadingImg || loadingPrompt}>
              🖼️ Wygeneruj obrazek
            </button>
            {loadingImg && <p>⏳ Generowanie obrazka...</p>}
            {errorImg && <p style={{ color: "crimson" }}>{errorImg}</p>}
            {imgUrl && (
              <img
                src={imgUrl}
                alt="Generated"
                style={{ display: "block", marginTop: "20px", maxWidth: "100%", borderRadius: "8px" }}
              />
            )}
          </div>
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
    marginTop: "12px",
    padding: "10px 20px",
    fontSize: "1rem",
    backgroundColor: "#444",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};
