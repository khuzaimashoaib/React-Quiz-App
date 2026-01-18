import React from 'react';
import './Result.css';

function Result() {
  return (
    <>
     <div className="result-container">
      <div className="result-card">
        {/* Header */}
        <h2 className="result-title">Quiz Completed 🎉</h2>
        <p className="result-subtitle">
          Here is your performance summary
        </p>

        {/* Score Circle */}
        <div className="score-circle">
          <span className="score">7</span>
          <span className="total">/10</span>
        </div>

        {/* Status */}
        <div className="result-status pass">
          Passed
        </div>

        {/* Details */}
        <div className="result-details">
          <div>
            <span>Total Questions</span>
            <strong>10</strong>
          </div>
          <div>
            <span>Correct Answers</span>
            <strong>7</strong>
          </div>
          <div>
            <span>Wrong Answers</span>
            <strong>3</strong>
          </div>
        </div>

        {/* Actions */}
        <div className="result-actions">
          <button className="btn secondary">Retake Quiz</button>
          <button className="btn primary">Logout</button>
        </div>
      </div>
    </div>
    </>
  );
}

export default Result;