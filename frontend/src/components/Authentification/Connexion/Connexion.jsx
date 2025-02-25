import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleLeft } from "@fortawesome/free-solid-svg-icons";
import connexion from "../../../services/connexion";
import { AuthContext } from "../../../context/AuthContext";
import "react-toastify/dist/ReactToastify.css";
import "./Connexion.css";

const initialCredentials = {
  mail: "",
  password: "",
};

function Connexion({ setView }) {
  const [credentials, setCredentials] = useState(initialCredentials);
  const { login } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

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
      const response = await connexion.post(`/login`, credentials);

      const { user, token } = response.data;
      localStorage.setItem("authToken", token);
      localStorage.setItem("userId", user.id);
      login(user, token);
      navigate("/user/profile");
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
      const message =
        error.response?.data?.message ||
        "Erreur de connexion, veuillez réessayer !";
      toast.error(message);
      setCredentials(initialCredentials);
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="connexion">
      <form onSubmit={handleRequest} className="connexionForm">
        <label className="connexionLabel" aria-label="email">
          <input
            className="connexionInput"
            type="email"
            name="mail"
            placeholder="Adresse Mail"
            required
            value={credentials.mail}
            onChange={handleUser}
          />
        </label>

        <label className="connexionLabel" aria-label="password">
          <input
            className="connexionInput"
            type={showPassword ? "text" : "password"}
            required
            name="password"
            placeholder="Mot de passe"
            value={credentials.password}
            onChange={handleUser}
          />
          <p>
            <Link to="/forgot-password"> Mot de passe oublié ?</Link>
          </p>
        </label>
        <button
          type="button"
          className={`passwordButton ${showPassword ? "active" : ""}`}
          onClick={handleTogglePassword}
        >
          {showPassword
            ? "Masquer le mot de passe"
            : "Afficher le mot de passe"}
        </button>
        <button type="submit" className="connexionButton">
          Connexion
        </button>
      </form>
      <button
        type="button"
        className="loginBackButton"
        onClick={() => {
          setView("initial");
          setCredentials(initialCredentials);
        }}
      >
        <FontAwesomeIcon icon={faCircleLeft} />
      </button>

      <ToastContainer />
    </div>
  );
}

Connexion.propTypes = {
  setView: PropTypes.func.isRequired,
};

export default Connexion;
