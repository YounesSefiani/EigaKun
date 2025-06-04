import React from "react";
import { Link } from "react-router-dom";
import EigaKunLogo from "../../assets/EigaKunLogo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFilm,
  faTv,
  faStar,
  faNewspaper,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import "./HeaderPhone.css";

function HeaderPhone() {
  return (
    <>
      <div className="headerPhone">
        <Link to="/"><img src={EigaKunLogo} alt="EigaKunLogo" /></Link>
        <input type="text" placeholder="Rechercher un film, une série..." />
        <button><FontAwesomeIcon icon={faUser} />Membre ?</button>
      </div>
      <div className="footerPhone">
        <ul>
          <li>
            <Link to="/films">
              <FontAwesomeIcon icon={faFilm} />
              Films
            </Link>
          </li>
          <li>
            <Link to="/series">
              <FontAwesomeIcon icon={faTv} />
              Séries
            </Link>
          </li>
          <li>
            <Link to="/personnalités">
              <FontAwesomeIcon icon={faStar} />
              Personnalités
            </Link>
          </li>
          <li>
            <Link to="/blog">
              <FontAwesomeIcon icon={faNewspaper} />
              Blog
            </Link>
          </li>
        </ul>
      </div>
      <FontAwesomeIcon />
    </>
  );
}

export default HeaderPhone;
