import React, { useState } from "react";
import Inscription from "../../components/Authentification/Inscription/Inscription";
import Connexion from "../../components/Authentification/Connexion/Connexion";
import "./AuthentificationPage.css";
import Header from "../../components/Header/Header";
import HeaderPhone from "../../components/Header/HeaderPhone/HeaderPhone";
import FooterPhone from "../../components/Header/FooterPhone/FooterPhone";

function Authentification() {
  const [view, setView] = useState("initial");

  return (
    <>
      <Header />
      <HeaderPhone />
      <div className="authentificationPage">
        <div className="asUsers">
          <h3>En tant qu'utilisateur.ice :</h3>
          <ul>
            <li>
              Tu peux ajouter des films, des séries et des personnalités dans
              tes favoris.
            </li>
            <li>
              Tu peux commenter les films, les séries et les personnalités.
            </li>
            <li>Tu peux jouer aux jeux de Eiga-Kun.</li>
            <li>
              Tu peux partager ton amour pour le septième art avec la
              communauté.
            </li>
          </ul>
        </div>
        {view === "initial" && (
          <div className="initialView">
            <h3> Rejoins la communauté de Eiga-Kun</h3>{" "}
            <div className="btnContainer">
              <p>Nouveau ? Rejoins-nous !</p>
              <button
                type="button"
                onClick={() => setView("signup")}
                className="authButton"
              >
                Inscription
              </button>
              <p>Déjà parmi nous ? Connecte-toi !</p>
              <button
                type="button"
                onClick={() => setView("login")}
                className="authButton"
              >
                Connexion
              </button>
            </div>
          </div>
        )}
        {view === "signup" && <Inscription setView={setView} />}
        {view === "login" && <Connexion setView={setView} />}
      </div>
      <FooterPhone />
    </>
  );
}

export default Authentification;
