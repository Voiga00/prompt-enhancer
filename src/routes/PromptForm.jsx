import { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { generateQuestions, generatePreviewPrompt } from "../services/openai.js";

export default function PromptForm() {
  const { apiKey, setPromptData } = useAppContext();
  const navigate = useNavigate();

  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("");
  const [mood, setMood] = useState("");
  const [length, setLength] = useState("");
  const [temperature, setTemperature] = useState(0.7);
  const [medium, setMedium] = useState("");
  const [composition, setComposition] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  const applyPreset = (preset) => {
    switch (preset) {
      case "Ghibli":
        setPrompt("Wioska na wzgórzu w stylu ghibili");
        setStyle("Anime");
        setMood("Dreamy");
        setMedium("Watercolor illustration");
        setComposition("Wide landscape");
        setLength("medium");
        setTemperature(0.6);
        break;
      case "Sci-Fi Character":
        setPrompt("futurystyczny wojownik z kataną i świecącymi oczami");
        setStyle("Cyberpunk");
        setMood("Epic");
        setMedium("3D render");
        setComposition("Full body");
        setLength("long");
        setTemperature(0.8);
        break;
      case "Dark Fantasy":
        setPrompt("nieumarły czarodziej w starożytnych ruinach z świecącymi runami");
        setStyle("Realistic");
        setMood("Dark");
        setMedium("Oil painting");
        setComposition("Portrait");
        setLength("long");
        setTemperature(0.65);
        break;
      case "Post-Apocalypse":
        setPrompt("opuszczone miasto porośnięte roślinnością, jedyny ocalały");
        setStyle("Realistic");
        setMood("Epic");
        setMedium("Digital art");
        setComposition("Wide landscape");
        setLength("medium");
        setTemperature(0.7);
        break;
      case "Nature Spirit":
        setPrompt("starożytny strażnik lasu, otoczony świecącymi roślinam");
        setStyle("Fantasy");
        setMood("Dreamy");
        setMedium("Watercolor illustration");
        setComposition("Full body");
        setLength("medium");
        setTemperature(0.6);
        break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const promptData = {
      prompt, style, mood, length, temperature, showPreview, medium, composition
    };
    setLoading(true);
    try {
      const questions = await generateQuestions(apiKey, promptData);
      setPromptData({ ...promptData, questions });
      navigate("/question/1");
    } catch (error) {
      alert("Wystąpił błąd podczas generowania pytań.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!showPreview) {
      setPreview("");
      return;
    }

    const timeout = setTimeout(async () => {
      if (!prompt) {
        setPreview("");
        return;
      }

      try {
        const previewText = await generatePreviewPrompt(apiKey, {
          prompt, style, mood, length, temperature, medium, composition
        });
        setPreview(previewText);
      } catch (err) {
        setPreview(" Nie udało się wygenerować podglądu prompta.");
      }
    }, 800);

    return () => clearTimeout(timeout);
  }, [prompt, style, mood, length, temperature, showPreview, medium, composition]);

  return (
    <div className="container">
      <h1> Uzupełnij prompt</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <textarea
            rows="4"
            cols="50"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Wpisz swój prompt..."
            required
          />
        </div>

        <div>
          <label>Preset prompta: </label>
          <select onChange={(e) => applyPreset(e.target.value)} defaultValue="">
            <option value="">-- Wybierz preset --</option>
            <option value="Ghibli"> Ghibli</option>
            <option value="Sci-Fi Character"> Sci-Fi Character</option>
            <option value="Dark Fantasy"> Dark Fantasy</option>
            <option value="Post-Apocalypse"> Post-Apocalypse</option>
            <option value="Nature Spirit"> Nature Spirit</option>
          </select>
        </div>

        <div>
          <label>Styl: </label>
          <select value={style} onChange={(e) => setStyle(e.target.value)}>
            <option value="">-- Brak --</option>
            <option>Realistic</option>
            <option>Anime</option>
            <option>Cyberpunk</option>
            <option>Fantasy</option>
          </select>
        </div>
        <div>
          <label>Medium: </label>
          <select value={medium} onChange={(e) => setMedium(e.target.value)}>
            <option value="">-- Brak --</option>
            <option>Digital art</option>
            <option>Watercolor illustration</option>
            <option>Oil painting</option>
            <option>Sketch</option>
            <option>3D render</option>
            <option>Comic style</option>
          </select>
        </div>
        <div>
          <label>Kompozycja: </label>
          <select value={composition} onChange={(e) => setComposition(e.target.value)}>
            <option value="">-- Brak --</option>
            <option>Portrait</option>
            <option>Full body</option>
            <option>Side view</option>
            <option>From behind</option>
            <option>Dutch angle</option>
            <option>Wide landscape</option>
          </select>
        </div>
        <div>
          <label>Nastrój: </label>
          <select value={mood} onChange={(e) => setMood(e.target.value)}>
            <option value="">-- Brak --</option>
            <option>Epic</option>
            <option>Dark</option>
            <option>Dreamy</option>
          </select>
        </div>
        <div>
          <label>Długość prompta: </label>
          <select value={length} onChange={(e) => setLength(e.target.value)}>
            <option value="">-- Brak --</option>
            <option value="short">Krótki</option>
            <option value="medium">Średni</option>
            <option value="long">Długi</option>
          </select>
        </div>
        <div>
          <label>Temperatura modelu: {temperature}</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={temperature}
            onChange={(e) => setTemperature(parseFloat(e.target.value))}
          />
        </div>
        <div>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Generowanie pytań..." : "Dalej"}
        </button>
      </form>

      {preview && (
        <div style={{
          marginTop: '30px',
          background: '#2a2a2a',
          padding: '20px',
          borderRadius: '8px',
          color: '#ccc'
        }}>
          <h3 style={{ color: '#fff' }}>🔎 Wersja angielska (preview):</h3>
          <pre>{preview}</pre>
        </div>
      )}
    </div>
  );
}
