import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { generatePreviewPrompt, generateImageFromPrompt } from "../services/openai";
import { usePromptHistory } from "../hooks/usePromptHistory";

export default function FinalPrompt() {
  const { apiKey, promptData } = useAppContext();
  const { prompt, style, mood, length, temperature, medium, composition, answers } = promptData;
  const [finalPrompt, setFinalPrompt] = useState("");
  const [loadingPrompt, setLoadingPrompt] = useState(true);
  const [saved, setSaved] = useState(false);
  const { addPrompt } = usePromptHistory();

  useEffect(() => {
    const generate = async () => {
      if (!prompt || !apiKey || !answers?.length) {
        setFinalPrompt("❌ Brakuje danych lub brak odpowiedzi na pytania.");
        setLoadingPrompt(false);
        return;
      }
      try {
        const output = await generatePreviewPrompt(apiKey, { prompt, style, mood, length, temperature, medium, composition, answers });
        setFinalPrompt(output);
      } catch (err) {
        console.error(err);
        setFinalPrompt("❌ Błąd podczas generowania prompta.");
      } finally {
        setLoadingPrompt(false);
      }
    };

    generate();
  }, [apiKey, prompt, style, mood, length, temperature, medium, composition, answers]);

  const handleSave = () => {
    if (finalPrompt.trim()) {
      addPrompt(finalPrompt.trim());
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const [imgUrl, setImgUrl] = useState("");
  const [loadingImg, setLoadingImg] = useState(false);
  const [errorImg, setErrorImg] = useState("");

  const handleGenerate = async () => {
    setErrorImg("");
    setLoadingImg(true);
    try {
      const url = await generateImageFromPrompt(apiKey, finalPrompt);
      setImgUrl(url);
    } catch (err) {
      console.error(err);
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
          <button onClick={handleSave} style={styles.button}>💾 Zapisz prompt</button>
          {saved && <p style={{ color: "limegreen", marginTop: "10px" }}>✔️ Zapisano!</p>}

          <div style={{ marginTop: "20px" }}>
            <button onClick={handleGenerate} style={styles.button} disabled={loadingImg}>🖼️ Wygeneruj obrazek</button>
            {loadingImg && <p>⏳ Generowanie obrazu...</p>}
            {errorImg && <p style={{ color: "crimson" }}>{errorImg}</p>}
            {imgUrl && <img src={imgUrl} alt="Generated" style={{ maxWidth: "100%", borderRadius: "8px", marginTop: "15px" }} />}
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
