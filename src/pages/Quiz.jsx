import { useEffect, useState } from "react";
import "./Quiz.css";
import supabase from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

const TOTAL_QUESTIONS = 10;

function Quiz() {
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, []);

  async function fetchQuestions() {
    const { data, error } = await supabase.rpc("get_random_questions", {
      question_limit: TOTAL_QUESTIONS,
    });

    console.log("Fetched questions:", data);
    console.log("Number of questions:", data?.length);

    if (!error) {
      setQuestions(data);
    }
  }
  useEffect(() => {
    if (questions.length > 0) {
      fetchOptions();
    }
  }, [currentIndex, questions]);

  async function fetchOptions() {
    const { data } = await supabase
      .from("options")
      .select("*")
      .eq("question_id", questions[currentIndex].id);

    setOptions(data);
    setSelectedOption(null);
  }
  function handleOptionChange(option) {
    setSelectedOption(option);
  }
  async function handleNext() {
    if (isSubmitting) return;
    console.log("hit");

    let newScore = score;

    if (selectedOption?.is_correct) {
      newScore += 1;
      setScore(newScore);
    }

    if (currentIndex < TOTAL_QUESTIONS - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsSubmitting(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      await supabase.from("quiz_results").insert({
        user_id: user.id,
        score: newScore,
        total: TOTAL_QUESTIONS,
      });

      navigate("/result");
    }
  }

  return (
    <>
    <Header />
      <div className="quiz-container">
        <div className="quiz-card">
          {/* Header */}
          <div className="quiz-header">
            <h2>Frontend Development Quiz</h2>
            <span className="quiz-progress">
              Question {currentIndex + 1} of {TOTAL_QUESTIONS}
            </span>
          </div>

          {/* Question */}
          <div className="quiz-question">
            {questions[currentIndex]?.question}
          </div>

          {/* Options */}
          <div className="quiz-options">
            {options.map((opt) => (
              <label className="quiz-option" key={opt.id}>
                <input
                  type="radio"
                  name="option"
                  checked={selectedOption?.id === opt.id}
                  onChange={() => handleOptionChange(opt)}
                />
                {opt.option_text}
              </label>
            ))}
          </div>

          {/* Footer */}
          <div className="quiz-footer">
            <button
              className="quiz-btn primary"
              onClick={handleNext}
              disabled={
                !selectedOption
                ||
                isSubmitting
              }
            >
              {isSubmitting ? "Submitting..." : "Next"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
export default Quiz;
