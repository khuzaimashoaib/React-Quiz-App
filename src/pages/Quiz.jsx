import { useEffect, useState } from "react";
import "./Quiz.css";
import supabase from "../supabaseClient";

const TOTAL_QUESTIONS = 10;

function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    fetchQuestions();
  }, []);

  async function fetchQuestions() {
    const { data, error } = await supabase
      .from("questions")
      .select("*")
      .order("id", "RANDOM()")
      .limit(TOTAL_QUESTIONS);

    console.log(data);

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
  function handleNext() {
    if (selectedOption?.is_correct) {
      setScore((prev) => prev + 1);
    }

    if (currentIndex < TOTAL_QUESTIONS - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      console.log(
        "Quiz Finished",
        score + (selectedOption?.is_correct ? 1 : 0),
      );
    }
  }

  return (
    <>
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
            <button className="quiz-btn secondary">Previous</button>
            <button
              className="quiz-btn primary"
              onClick={handleNext}
              // disabled={
              //   !selectedOption}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
export default Quiz;
