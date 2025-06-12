import { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import { useParams, useNavigate } from "react-router-dom";

export default function QuestionStep() {
  const { promptData, setPromptData } = useAppContext();
  const { id } = useParams();
  const navigate = useNavigate();

  const questionIndex = parseInt(id, 10) - 1;
  const totalQuestions = promptData.questions.length;

  const [answer, setAnswer] = useState("");


  useEffect(() => {
    const currentAnswers = promptData.answers || [];
    setAnswer(currentAnswers[questionIndex] || "");
  }, [id]);

  const handleNext = () => {
    const updatedAnswers = [...(promptData.answers || [])];
    updatedAnswers[questionIndex] = answer;
    setPromptData({ ...promptData, answers: updatedAnswers });

    if (questionIndex + 1 < totalQuestions) {
      navigate(`/question/${questionIndex + 2}`);
    } else {
      navigate("/final-prompt");
    }
  };

  return (
    <div className="container">
      <h2>
        Pytanie {questionIndex + 1} z {totalQuestions}
      </h2>
      <p>{promptData.questions[questionIndex]}</p>
      <textarea
        rows="4"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Twoja odpowiedź..."
      />
      <br />
      <button onClick={handleNext} disabled={!answer.trim()}>
        {questionIndex + 1 < totalQuestions ? "Dalej" : "Zakończ"}
      </button>
    </div>
  );
}
