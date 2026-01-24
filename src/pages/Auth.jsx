import supabase from "../supabaseClient";
import { useEffect, useState } from "react";
import "./Auth.css";
import { useNavigate } from "react-router-dom";
import { CircularProgress, Alert, Snackbar } from "@mui/material";

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMsg, setSnackMsg] = useState("");
  const [snackType, setSnackType] = useState("success");

  const navigate = useNavigate();
  const showSnackbar = (message, type = "success") => {
    setSnackMsg(message);
    setSnackType(type);
    setSnackOpen(true);
  };

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        navigate("/quiz");
      }
    });
  }, []);

  const handleLogin = async () => {
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      showSnackbar(error.message, "error");
      return;
    }

    showSnackbar("Login successful!", "success");
    setTimeout(() => navigate("/quiz"), 2000);
  };

  const handleSignup = async () => {
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: username } },
    });

    if (error) {
      setLoading(false);
      showSnackbar(error.message, "error");
      return;
    }

    const { error: profileError } = await supabase.from("profiles").insert({
      id: data.user.id,
      name: username,
    });

    setLoading(false);

    if (profileError) {
      showSnackbar(profileError.message, "error");
      return;
    }

    showSnackbar("Account created successfully!", "success");
    setTimeout(() => navigate("/quiz"), 2000);
  };
  const handleAuth = async (e) => {
    e.preventDefault();

    if (!isLogin && !username.trim()) {
      showSnackbar("Username is required for signup", "warning");
      return;
    }

    if (!email.trim() || !password.trim()) {
      showSnackbar("Email and password are required", "warning");
      return;
    }
    if (password.length < 6) {
      showSnackbar("Password must be at least 6 characters", "error");
      return;
    }

    setLoading(true);
    if (isLogin) {
      handleLogin();
    } else {
      handleSignup();
    }

    // if (isLogin) {
    //   // LOGIN
    //   const { error } = await supabase.auth.signInWithPassword({
    //     email,
    //     password,
    //   });

    //   if (error) {
    //     showSnackbar(error.message, "error");
    //     setLoading(false);
    //     return;
    //   }

    //   setLoading(false);
    //   showSnackbar("Login successful!", "success");
    //   setTimeout(() => navigate("/quiz"), 2000);
    // }
    // // Signup flow
    // else {
    //   const { data, error } = await supabase.auth.signUp({
    //     email,
    //     password,
    //     options: {
    //       data: { display_name: username },
    //     },
    //   });

    //   if (error) {
    //     setLoading(false);
    //     showSnackbar(error.message, "warning");
    //     return;
    //   }
    //   showSnackbar("Account created successfully!", "success");

    //   setTimeout(() => {
    //     navigate("/quiz");
    //   }, 2000);
    //   const { error: profileError } = await supabase.from("profiles").insert({
    //     id: data.user.id,
    //     name: username,
    //   });

    //   setLoading(false);

    //   if (profileError) {
    //     showSnackbar(profileError.message, "error");
    //   } else {
    //     navigate("/quiz");
    //   }
    // }
  };

  return (
    <>
      <Snackbar
        open={snackOpen}
        autoHideDuration={2000} // 3 seconds
        onClose={() => {
          setSnackOpen(false);
          setSnackMsg("");
        }}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackOpen(false)}
          severity={snackType}
          sx={{ width: "100%" }}
        >
          {snackMsg}
        </Alert>
      </Snackbar>
      <div className="auth-container">
        <h1 className="auth-welcome">Welcome to the Quiz App</h1>

        <div className="auth-card">
          <h2 className="auth-title">{isLogin ? "Login" : "Create Account"}</h2>

          <form className="auth-form" onSubmit={handleAuth}>
            {!isLogin && (
              <input
                type="text"
                placeholder="Full Name"
                className="auth-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            )}
            <input
              type="email"
              placeholder="Email"
              className="auth-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="auth-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button className="auth-button" disabled={loading}>
              {loading ? (
                <CircularProgress enableTrackSlot size="20px" color="#e3f2fd" />
              ) : isLogin ? (
                "Login"
              ) : (
                "Signup"
              )}
            </button>
          </form>

          <p className="auth-toggle">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <span
              onClick={() => {
                setIsLogin(!isLogin);
                setSnackOpen(false);
                setSnackMsg("");
              }}
              className="auth-toggle-link"
            >
              {isLogin ? " Signup" : " Login"}
            </span>
          </p>
        </div>
      </div>
    </>
  );
}

export default Auth;
