// C:\Users\PC\WCS\EigaKunFinal\frontend\src\components\Authentification\ResetPassword\ResetPassword.jsx

import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import connexion from "../../../services/connexion";
import eigaKunLogo from "../../../assets/EigaKunLogo.png";
import "react-toastify/dist/ReactToastify.css";
import "./ResetPassword.css";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const { token } = useParams(); // Assurez-vous que le routeur passe le token

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas !", {
        position: "top-right",
      });
      return;
    }

    try {
      await connexion.post("/users/reset-password", {
        token,
        newPassword: password,
      });
      toast.success("Votre mot de passe a bien été changé !", {
        position: "top-right",
      });
      setTimeout(() => {
        navigate("/authentification");
      }, 4000);
    } catch (error) {
      console.error(
        "Erreur lors de la réinitialisation du mot de passe:",
        error,
      );
    }
  };

  return (
    <div className="reset-password-page">
      <div className="resetTop">
        <img src={eigaKunLogo} alt="EigaKunLogo" className="logo" />
        <h2>Réinitialisation du mot de passe</h2>
        <p>
          Si tu es ici, c'est parce que tu as oublié ton mot de passe et que tu
          as demandé un lien pour changer le mot de passe.
          <br />
          Assure-toi à ce que ce nouveau mot de passe soit plus forte que
          l'ancienne, et que tu te souviennes de celui-ci cette fois.
          <br />
          Evite tout simplement les mots de passe trop classique, du genre
          "123456" ou ta date de naissance.
        </p>
      </div>
      <form className="reset-password-form" onSubmit={handleSubmit}>
        <input
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Nouveau mot de passe"
          required
        />
        <input
          type={showPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirmez le nouveau mot de passe"
          required
        />
        <button type="button" onClick={() => setShowPassword(!showPassword)}>
          {showPassword ? "Cacher le mot de passe" : "Afficher le mot de passe"}
        </button>
        <button type="submit">Réinitialiser le mot de passe</button>
      </form>
      <ToastContainer />
    </div>
  );
}

export default ResetPassword;
