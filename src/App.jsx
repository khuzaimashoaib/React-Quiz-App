import { Route, Routes } from "react-router-dom";
import "./index.css";
import supabase from "./supabaseClient";
import Auth from "./pages/auth";
import Quiz from "./pages/Quiz";
import Result from "./pages/Result";
import ProtectedRoute from "./components/ProtectedRoutes";

// console.log(supabase);

function App() {
  return (
    <Routes>
      <Route path="/" element={<Auth />}></Route>
      <Route
        path="/quiz"
        element={
          <ProtectedRoute>
            <Quiz />
          </ProtectedRoute>
        }
      ></Route>
      <Route
        path="/result"
        element={
          <ProtectedRoute>
            <Result />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
export default App;
