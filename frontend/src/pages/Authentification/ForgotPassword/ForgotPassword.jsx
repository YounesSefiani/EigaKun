import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import connexion from "../../../services/connexion";
import "react-toastify/dist/ReactToastify.css";
import "./ForgotPassword.css";

function forgotPassword() {
  const [mail, setMail] = useState("");
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await connexion.post("/users/forgot-password", { mail });
      toast.success(
        "Un mail vient de vous être envoyé avec un lien de changement de mot de passe !",
        {
          position: "top-right",
        },
      );
    } catch (error) {
      console.error(
        "Erreur lors de la demande de réinitialisation du mot de passe:",
        error,
      );
    }
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-left">
        <div className="cover">
          <h3>Mot de passe perdu ?</h3>
          <p>
            Pas de soucis, il suffit de taper ton adresse-mail, et nous
            t'envoyons un lien pour refaire ton mot de passe.
            <br /> <br />
            Assure-toi de bien avoir un compte avec l'adresse mail que tu as
            utilisé pour le créer.
          </p>
        </div>
      </div>
      <div className="forgot-password-right">
        <form className="forgot-password-form" onSubmit={handleSubmit}>
          <input
            type="email"
            value={mail}
            onChange={(e) => setMail(e.target.value)}
            placeholder="Entrez votre adresse e-mail"
            required
          />
          <button type="submit">Envoyer le lien de réinitialisation</button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

export default forgotPassword;
