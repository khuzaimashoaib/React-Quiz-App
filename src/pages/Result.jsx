import React, { useEffect, useState } from "react";
import "./Result.css";
import { useNavigate } from "react-router-dom";
import supabase from "../supabaseClient";

function Result() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchResult();
  }, []);

  async function fetchResult() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      navigate("/");
      return;
    }
    const { data, error } = await supabase
      .from("quiz_results")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();
    if (!error) {
      setResult(data);
    }

    setLoading(false);
  }
  if (loading) return <p className="loading">Loading result...</p>;
  if (!result) return <p>No result found</p>;

  const percentage = Math.round((result.score / result.total) * 100);

  let message = "";
  let statusClass = "";

  if (percentage >= 80) {
    message = "Excellent work!";
    statusClass = "pass";
  } else if (percentage >= 50) {
    message = "Good effort!";
    statusClass = "good";
  } else {
    message = "Needs improvement.";
    statusClass = "fail";
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/");
  }

  function handleRetakeQuiz() {
    navigate("/quiz"); // apna quiz route yahan confirm kar lena
  }

  return (
    <>
      <div className="result-container">
        <div className="result_container_inner">
          <div className="result-card">
            {/* Header */}
            <h2 className="result-title">Quiz Completed 🎉</h2>
            <p className="result-subtitle">Here is your performance summary</p>
          </div>

          {/* Status */}
          <div className={`result-status ${statusClass}`}>{message}</div>

          {/* Details */}
          <div className="result-details">
            <div>
              <span>Total Questions: </span>
              <strong>{result.total}</strong>
            </div>
            <div>
              <span>Correct Answers: </span>
              <strong>{result.score}</strong>
            </div>
            <div>
              <span>Wrong Answers: </span>
              <strong>{result.total - result.score}</strong>
            </div>
          </div>

          {/* Actions */}
          <div className="result-actions">
            <button className="btn secondary" onClick={handleRetakeQuiz}>
              Retake Quiz
            </button>
            <button className="btn primary" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Result;
