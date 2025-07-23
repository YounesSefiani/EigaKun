import React, { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import connexion from "../../../services/connexion";
import "./InscriptionSide.css";

function InscriptionSide({ setView }) {
  const [user, setUser] = useState({
    username: "",
    email: "",
    birthdate: "",
    avatar: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  const navigate = useNavigate();
  const handleSubmit = (event) => {
    const { name, files, value } = event.target;

    if (name === "avatar" && files.length > 0) {
      setUser((prevUser) => ({
        ...prevUser,
        [name]: files[0],
      }));
    } else {
      setUser((prevUser) => ({
        ...prevUser,
        [name]: value,
      }));
    }
  };

  const handleInscription = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("username", user.username);
    formData.append("email", user.email);
    formData.append("birthdate", user.birthdate);
    formData.append("avatar", user.avatar);
    formData.append("password", user.password);
    formData.append("confirmPassword", user.confirmPassword);

    try {
      const response = await connexion.post("/users", formData);
      console.log(response.data);
      navigate("/authentification");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="inscriptionSide">
      <h2>Inscription</h2>
      <form onSubmit={handleInscription}>
        <label htmlFor="username">
          Nom d'utilisateur :
          <input
            type="text"
            id="username"
            name="username"
            value={user.username}
            required
            onChange={handleSubmit}
          />
        </label>
        <label htmlFor="email">
          Email :
          <input
            type="email"
            id="email"
            name="email"
            value={user.email}
            required
            onChange={handleSubmit}
          />
        </label>
        <label htmlFor="birthdate">
          Date de naissance :
          <input
            type="date"
            id="birthdate"
            name="birthdate"
            value={user.birthdate}
            required
            onChange={handleSubmit}
          />
        </label>
        <label htmlFor="avatar">
          Avatar :
          <input
            type="file"
            id="avatar"
            name="avatar"
            accept="image/*"
            onChange={handleSubmit}
          />
        </label>
        <label htmlFor="password">
          Mot de passe :
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            value={user.password}
            required
            onChange={handleSubmit}
          />
        </label>
        <label htmlFor="confirmPassword">
          Confirmer le mot de passe :
          <input
            type={showPassword ? "text" : "password"}
            id="confirmPassword"
            name="confirmPassword"
            value={user.confirmPassword}
            required
            onChange={handleSubmit}
          />
        </label>
        <div className="buttonSection">
          <button type="submit">S'inscrire</button>
          <button type="button" onClick={handlePasswordToggle}>
            {showPassword ? "Cacher le mot de passe" : "Voir le mot de passe"}
          </button>
          <button type="button" onClick={() => setView("initial")}>
            Retour
          </button>
        </div>
      </form>
    </div>
  );
}

InscriptionSide.propTypes = {
  setView: PropTypes.func.isRequired,
};

export default InscriptionSide;
