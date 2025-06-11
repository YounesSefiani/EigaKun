import React from "react";
import { Link } from "react-router-dom";
import EigaKunLogo from "../../assets/EigaKunLogo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import "./HeaderPhone.css";

function HeaderPhone() {
  return (
    <>
      <header className="headerPhone">
        <Link to="/"><img src={EigaKunLogo} alt="EigaKunLogo" /></Link>
        <input type="text" placeholder="Rechercher un film, une série..." />
        <button><FontAwesomeIcon icon={faUser} />Membre ?</button>
      </header>
      <FontAwesomeIcon />
    </>
  );
}

export default HeaderPhone;
