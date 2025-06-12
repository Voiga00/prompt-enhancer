import { useParams } from "react-router-dom";

export default function PromptPreview({ prompts }) {
  const { id } = useParams();
  const idx = parseInt(id, 10);
  const prompt = prompts[idx];

  if (prompt === undefined) {
    return <p>❌ Nie znaleziono prompta o ID {id}</p>;
  }

  return (
    <div>
      <h2>📄 Podgląd Promptu {idx + 1}</h2>
      <pre style={{
        background: "#2a2a2a",
        color: "#ccc",
        padding: "20px",
        borderRadius: "8px",
        whiteSpace: "pre-wrap"
      }}>
        {prompt}
      </pre>
    </div>
  );
}
