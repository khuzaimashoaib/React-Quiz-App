import { useEffect, useState } from "react";
import "./Result.css";
import { useNavigate } from "react-router-dom";
import supabase from "../supabaseClient";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogTitle,
} from "@mui/material";

function Result() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState(null);

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
  if (loading)
    return (
      <div className="loader-center">
        <CircularProgress size={50} />
      </div>
    );
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

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirmAction = async () => {
    setOpen(false);
    if (dialogAction === "logout") {
      await supabase.auth.signOut();
      navigate("/");
    } else if (dialogAction === "retake") {
      navigate("/quiz");
    }
  };

  async function handleLogout() {
    setDialogAction("logout");
    setOpen(true);
  }

  function handleRetakeQuiz() {
    setDialogAction("retake");
    setOpen(true);
  }

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
      >
        <DialogTitle
          id="alert-dialog-title"
          sx={{
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "1.3rem",
          }}
        >
          {dialogAction === "logout"
            ? "Are you sure you want to logout?"
            : "Do you want to retake the quiz?"}
        </DialogTitle>

        <DialogActions sx={{ justifyContent: "center", gap: 2 }}>
          <Button
            onClick={handleClose}
            sx={{ color: "#555", borderColor: "#aaa" }}
          >
            Cancel
          </Button>
          <Button onClick={handleConfirmAction}>
            {dialogAction === "logout" ? "Logout" : "Retake"}
          </Button>
        </DialogActions>
      </Dialog>
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
