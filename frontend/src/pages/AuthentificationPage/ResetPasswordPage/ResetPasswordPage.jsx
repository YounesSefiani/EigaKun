import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import connexion from "../../../services/connexion";
import { ToastContainer, toast } from "react-toastify";
import ResetPasswordImage from "../../../assets/ResetPassword.jpg";
import "./ResetPasswordPage.css";

function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const { token } = useParams();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Les mots de passe ne se correspondent pas !", {
        position: "top-right",
      });
      return;
    }


    try {
      await connexion.post("/users/reset-password-confirm", {
        token,
        newPassword: password,
      });
      toast.success("Mot de passe réinitialisé avec succès.", {
        position: "top-right",
      });
      setTimeout(() => {
        navigate("/authentification");
      }, 5000);
    } catch (error) {
      console.error(
        "Erreur lors de la réinitialisation du mot de passe.",
        error
      );
    } finally {
      setPassword("");
      setConfirmPassword("");
    }
  };

      const handlePasswordToggle = () => {
      setShowPassword(!showPassword);
    };


  return (
    <div className="resetPasswordPage">
      <div className="resetPasswordPageLeft">
        <img src={ResetPasswordImage} alt="" />
      </div>
      <div className="resetPasswordPageRight">
        <h2>Bien le bonjour !</h2>
        <p>
          Apparemment, tu as perdu ton mot de passe et tu demandes d'en créer un
          autre. <br />
          Et bien, te voilà au bon endroit ! <br />
          Il suffit de taper un nouveau mot de passe et le tour est joué !
        </p>
        <form onSubmit={handleSubmit}>
          <input type={showPassword ? "text" : "password"} placeholder="Nouveau mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Confirmer le nouveau mot de passe"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button type="submit">Valider</button>
          <button
            type="button"
            onClick={handlePasswordToggle}
          >
            {showPassword
              ? "Cacher le mot de passe"
              : "Afficher le mot de passe"}
          </button>
        </form>
        <p>
          PS : Evite juste les mots de passe simples du genre "12345", ta date
          de naissance ou juste "motdepasse".
          <br />
          Simple rappel !
        </p>
      </div>
      <ToastContainer />
    </div>
  );
}

export default ResetPasswordPage;
