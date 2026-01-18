import { Route, Routes } from "react-router-dom";
import "./App.css";
import supabase from "./supabaseClient";
import Auth from "./pages/auth";
import Quiz from "./pages/Quiz";
import Result from "./pages/Result";

console.log(supabase);

function App() {
  return (
    <Routes>
      <Route path="/" element={<Auth />}></Route>
      <Route path="/quiz" element={<Quiz />}></Route>
      <Route path="/result" element={<Result />}></Route>
    </Routes>
  );
}
export default App;
