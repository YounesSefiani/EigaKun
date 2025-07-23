import React, { useState } from "react";
import connexion from "../../../services/connexion";
import { ToastContainer, toast } from "react-toastify";
import ForgotPasswordImage from "../../../assets/ForgotPassword.png";
import "./ForgotPasswordPage.css";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await connexion.post("/users/forgot-password", { email });
      toast.success(
        "Un lien de réinitialisation a été envoyé à votre boite mail."
      );
    } catch (error) {
      console.error(error);
      toast.error("Un erreur s'est produite lors de l'envoi du lien.");
    }
  };
  return (
    <div className="forgotPasswordPage">
      <div className="forgotPasswordPageLeft">
        <img src={ForgotPasswordImage} alt="" />
      </div>
      <div className="forgotPasswordPageRight">
        <p>Aïe ! Toi, tu as oublié ton mot de passe, c'est ça ?</p>
        <p>N'aie aucune crainte ! Rien n'est perdu !</p>
        <p>
          Envoie-nous ton adresse mail et nous t'enverrons un lien pour créer un
          nouveau mot de passe !
        </p>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">
            Adresse mail
            <input type="email" name="email" value={email} placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
          </label>
          <button type="submit">Envoyer</button>
          <button type="button" onClick={() => window.location.href = "/authentification"}>Retour</button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

export default ForgotPasswordPage;
