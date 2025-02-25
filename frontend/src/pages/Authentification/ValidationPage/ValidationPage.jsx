import React, { useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import connexion from "../../../services/connexion";

function ValidationPage() {
  const { token } = useParams(); // Récupère le token depuis l'URL
  const navigate = useNavigate();
  const { updateUser } = useContext(AuthContext);
  const [message, setMessage] = useState(
    "Cliquez sur le bouton pour valider votre compte.",
  );
  const [loading, setLoading] = useState(false);

  const handleValidation = async () => {
    setLoading(true);
    try {
      const response = await connexion.get(
        `/user/validate/${token}`,
        {}, // Pas de corps de requête nécessaire ici, sauf si l'API en demande un
        { withCredentials: true }, // Si vous utilisez des cookies ou une authentification par session
      );

      // Vérifiez le code de statut pour valider la réussite
      if (response.status === 200) {
        await updateUser(); // Met à jour les données utilisateur
        setMessage(
          "Votre compte a été validé avec succès ! Redirection en cours...",
        );
        setTimeout(() => navigate("/authentification"), 3000);
      } else {
        setMessage("Échec de la validation. Le lien est peut-être expiré.");
      }
    } catch (error) {
      console.error("Erreur lors de la validation :", error);
      setMessage("Erreur serveur. Réessayez plus tard.");
    } finally {
      setLoading(false); // Assurez-vous que l'état `loading` est réinitialisé
    }
  };

  return (
    <div className="validation-container">
      <h2>Validation du compte</h2>
      <p>{message}</p>
      {!loading && (
        <button
          type="button"
          onClick={handleValidation}
          className="validate-button"
        >
          Confirmer mon compte
        </button>
      )}
      {loading && <p>Validation en cours...</p>}
    </div>
  );
}

export default ValidationPage;
