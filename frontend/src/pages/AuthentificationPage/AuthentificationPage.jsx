import React, { useState } from "react";
import InscriptionSide from "./InscriptionSide/InscriptionSide";
import ConnexionSide from "./ConnexionSide/ConnexionSide";
import EigaKunLogo from "../../assets/EigaKunLogo.png";
import "./AuthentificationPage.css";

function AuthentificationPage() {
  const [view, setView] = useState("initial");
  return (
      <div className="authentificationPage">
        <div className="authentificationPageLeft">
          <h2>Pourquoi rejoindre <img src={EigaKunLogo} alt="EigaKunLogo" /> ?</h2>
          <h3>C'est simple ! Avec Eiga-kun, tu pourras :</h3>
          <ul>
            <li>&#x1F496; Ajouter tes films, séries et personnalités dans tes favoris. &#x1F496;</li>
            <li>&#127902; Faire une liste des films & séries que tu as regardés ou que tu prévois de les regarder. &#127902;</li>
            <li>&#128221; Partager tes avis et tes notes sur les films et séries et personnalités. &#128221;</li>
            <li>&#9995; Et pourquoi pas nous recommander quelques films, séries et / ou personnalités à ajouter. &#9995;</li>
          </ul>
          <p>Bref !<br /> En quelques mots, tu pourras t'exprimer et partager ta passion qu'est le septième art.</p>
        </div>
        <div className="authentificationPageRight">
          {view === "initial" && (
            <>
              <h2>Bienvenue dans l'univers de Eiga-Kun !</h2>
              <div className="toSign">
                <div>
                  <p>Tu veux te joindre à nous ?</p>
                  <button
                    type="button"
                    onClick={() => {
                      setView("inscription");
                    }}
                  >
                    S'inscrire
                  </button>
                </div>
                <div>
                  <p>Tu as déjà un compte ?</p>
                  <button type="button" onClick={() => setView("connexion")}>Se connecter</button>
                </div>
              </div>
            </>
          )}
          {view === "inscription" && <InscriptionSide setView={setView} />}
          {view === "connexion" && <ConnexionSide setView={setView} />}
        </div>
      </div>
  );
}

export default AuthentificationPage;
