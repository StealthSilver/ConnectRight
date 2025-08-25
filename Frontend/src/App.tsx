import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/landing";
import Authentication from "./pages/authentication";
import Signup from "./pages/Signup";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Authentication />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
