import { useMsalAuth } from "../services/useMsalAuth.js";
import "../styles/Login.css";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { signIn, user } = useMsalAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="login-bg">
      <div className="login-card">
        <h2>Iniciar sesión con Entra ID</h2>
        <button className="login-btn" onClick={signIn}>
          Iniciar sesión
        </button>
      </div>
    </div>
  );
}
