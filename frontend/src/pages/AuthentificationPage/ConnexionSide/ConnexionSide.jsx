import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { AuthContext } from "../../../services/Context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import connexion from "../../../services/connexion";
import "./ConnexionSide.css";

const loginForm = {
  email: "",
  password: "",
};

function ConnexionSide({ setView }) {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [credentials, setCredentials] = useState(loginForm);
  const [showPassword, setShowPassword] = useState(false);

  const handleUser = (event) => {
    const { name, value } = event.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRequest = async (e) => {
    e.preventDefault();

    try {
      const response = await connexion.post(`/users/login`, credentials);

      const { user, token } = response.data;
      localStorage.setItem("authToken", token);
      localStorage.setItem("userId", user.id);
      login(user, token);
      navigate("/user");
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
      const message =
        error.response?.data?.message ||
        "Erreur de connexion, veuillez réessayer !";
      toast.error(message);
      setCredentials(loginForm);
    }
  };

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="connexionSide">
      <h2>Bienvenue !</h2>
      <form onSubmit={handleRequest}>
        <label htmlFor="email">Email
        <input
          type="email"
          id="email"
          name="email"
          value={credentials.email}
          onChange={handleUser}
          required
        />
        </label>
        <label htmlFor="password">
          Mot de passe
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            value={credentials.password}
            onChange={handleUser}
            required
          />
          <Link to="/forgot-password">Mot de passe oublié ?</Link>
        </label>
        <div className="btnSection">
        <button type="submit">Se connecter</button>
        <button type="button" onClick={handlePasswordToggle}>
          {showPassword ? "Cacher le mot de passe" : "Afficher le mot de passe"}
        </button>
        <button type="button" onClick={() => setView("initial")}>
          Retour
        </button>
      </div>
      </form>
      
      <ToastContainer />
    </div>
  );
}

ConnexionSide.propTypes = {
  setView: PropTypes.func.isRequired,
};

export default ConnexionSide;
