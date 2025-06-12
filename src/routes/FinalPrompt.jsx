import { useAppContext } from "../context/AppContext";
import { useEffect, useState } from "react";
import { optimizePrompt } from "../services/openai";

export default function FinalPrompt() {
  const { promptData, apiKey } = useAppContext();
  const [optimizedPrompt, setOptimizedPrompt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOptimized = async () => {
      try {
        const result = await optimizePrompt(apiKey, promptData);
        setOptimizedPrompt(result);
      } catch (err) {
        console.error(err);
        setOptimizedPrompt(" Błąd podczas generowania prompta.");
      } finally {
        setLoading(false);
      }
    };
    fetchOptimized();
  }, [apiKey, promptData]);

  return (
    <div className="container">
      <h2> Gotowy Prompt</h2>
      {loading ? (
        <p>Optymalizuję prompt... </p>
      ) : (
        <pre>{optimizedPrompt}</pre>
      )}
    </div>
  );
}
