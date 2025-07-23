import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import EigaKunLogo from "../../../assets/EigaKunLogo.png";
import ValidationSuccess from "../../../assets/ValidationSuccess.jpg";
import axios from "axios";
import "./ValidationPage.css";

function ValidationPage() {
  const { token } = useParams();
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const handleValidate = async () => {
    setStatus("loading");
    setMessage("");
    try {
      const res = await axios.get(
        `http://localhost:3994/api/users/validate/${token}`
      );
      setStatus("success");
      setMessage(res.data.message || "Votre compte a bien été validé !");
    } catch (err) {
      setStatus("error");
      setMessage(
        err.response?.data?.message ||
          "Erreur lors de la validation du compte."
      );
    }
  };

  return (
    <div className="validationPage">
      <div className="validationPageLeft">
        {status === "idle" && (
          <img
            src={EigaKunLogo}
            alt="Logo Eiga-Kun"
            className="validationProcessing"
          />
        )}
        {status === "success" && (
          <img
            src={ValidationSuccess}
            alt="Logo Eiga-Kun"
            className="validationSuccess"
          />
        )}
        {status === "error" && (
          <img
            src={EigaKunLogo}
            alt="Logo Eiga-Kun"
            className="validationLogo"
          />
        )}
      </div>
      <div className="validationPageRight">
                <h2>Validation du compte</h2>
        <p>
          Cliquez sur le bouton pour valider votre inscription.
          <br />
          Ce lien est à usage unique.
        </p>
        {status === "idle" && (
          <button className="validateBtn" onClick={handleValidate}>
            Valider mon compte
          </button>
        )}
        {status === "loading" && <p>Validation en cours...</p>}
        {(status === "error") && (
          <button className="validateBtn" onClick={handleValidate}>
            Réessayer
          </button>
        )}

        {status === "success" && (
          <>
            <p className="success">{message}</p>
            <button type="button">
            <Link to="/authentification" className="link-auth">
              Se connecter
            </Link>
            </button>
          </>
        )}
        {status === "error" && <p className="error">{message}</p>}
        {status === "idle" && (
          <p className="info">En attente de validation...</p>
        )}
        {status === "loading" && (
          <p className="info">Veuillez patienter...</p>
        )}
      </div>
    </div>
  );
}

export default ValidationPage;
