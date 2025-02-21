import React, { useContext, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import connexion from "./connexion";
import { AuthContext } from "../context/AuthContext";

function UserLayout() {
  const { user, token, validateToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const [validationInProgress, setValidationInProgress] = useState(false);

  useEffect(() => {
    if (token && !user) {
      validateToken();
    }
  }, [token, user, validateToken]);

  const handleValidation = async () => {
    setValidationInProgress(true);
    try {
      const response = await connexion.post(`/user/validate/${token}`);

      if (response.status === 200) {
        await validateToken(); // Rafraîchir les infos de l'utilisateur
        navigate("/authentification"); // 🔹 Redirection vers la page de connexion
      } else {
        console.error("Erreur lors de la validation du compte");
      }
    } catch (error) {
      console.error("Erreur réseau :", error);
    } finally {
      setValidationInProgress(false);
    }
  };

  if (user && user.isValidated === 0) {
    return (
      <div>
        Votre compte n'est pas encore validé.{" "}
        <button
          type="button"
          onClick={handleValidation}
          disabled={validationInProgress}
        >
          {validationInProgress ? "Validation en cours..." : "Cliquez ici"}
        </button>
      </div>
    );
  }

  // if (user && user.role === "Admin") {
  //   navigate("/user/admin");
  // }

  return (
    <div className="user-layout">
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default UserLayout;
