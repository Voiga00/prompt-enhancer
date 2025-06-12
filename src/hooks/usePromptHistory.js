import { useState, useEffect } from "react";

export const usePromptHistory = () => {
  const STORAGE_KEY = "prompt_history";
  const [prompts, setPrompts] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setPrompts(JSON.parse(stored));
      } catch {
        setPrompts([]);
      }
    }
  }, []);

  const addPrompt = (text) => {
    const updated = [text, ...prompts].slice(0, 10);
    setPrompts(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  return { prompts, addPrompt };
};
