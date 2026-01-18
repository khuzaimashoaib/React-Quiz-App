import "./Quiz.css";

function Quiz() {
  return (
    <>
    <div className="quiz-container">
      <div className="quiz-card">
        {/* Header */}
        <div className="quiz-header">
          <h2>Frontend Development Quiz</h2>
          <span className="quiz-progress">Question 1 of 10</span>
        </div>

        {/* Question */}
        <div className="quiz-question">What does CSS stand for?</div>

        {/* Options */}
        <div className="quiz-options">
          <label className="quiz-option">
            <input type="radio" name="option" />
            Cascading Style Sheets
          </label>

          <label className="quiz-option">
            <input type="radio" name="option" />
            Computer Style System
          </label>

          <label className="quiz-option">
            <input type="radio" name="option" />
            Creative Styling Source
          </label>

          <label className="quiz-option">
            <input type="radio" name="option" />
            Colorful Style Syntax
          </label>
        </div>

        {/* Footer */}
        <div className="quiz-footer">
          <button className="quiz-btn secondary">Previous</button>
          <button className="quiz-btn primary">Next</button>
        </div>
      </div>
    </div>
    </>
  );
}
export default Quiz;
