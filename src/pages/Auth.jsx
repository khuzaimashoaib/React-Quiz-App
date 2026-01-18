import supabase from "../supabaseClient";
import  { useState } from "react";

import "./Auth.css";

function Auth() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <>
      <div className="auth-container">
        <div className="auth-card">
          <h2 className="auth-title">{isLogin ? "Login" : "Create Account"}</h2>

          <form className="auth-form">
            <input type="email" placeholder="Email" className="auth-input" />

            <input
              type="password"
              placeholder="Password"
              className="auth-input"
            />

            {!isLogin && (
              <input
                type="text"
                placeholder="Full Name"
                className="auth-input"
              />
            )}

            <button className="auth-button">
              {isLogin ? "Login" : "Signup"}
            </button>
          </form>

          <p className="auth-toggle">
            {isLogin ? "Don’t have an account?" : "Already have an account?"}
            <span onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? " Signup" : " Login"}
            </span>
          </p>
        </div>
      </div>
    </>
  );
}

export default Auth;
