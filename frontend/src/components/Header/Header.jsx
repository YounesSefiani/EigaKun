import React from "react";
import { Link } from "react-router-dom";
import EigaKunLogo from "../../assets/EigaKunLogo.png";
import "./Header.css";

function Header() {
  return (
    <div className="header">
      <Link to="/">
        <img src={EigaKunLogo} alt="EigaKunLogo" />
      </Link>
      <ul>
        <li>
          <Link to="/films">Films</Link>
        </li>
        <li>
          <Link to="/series">Séries</Link>
        </li>
        <li>
          <Link to="/personnalités">Personnalités</Link>
        </li>
        <li>
          <Link to="/blog">Blog</Link>
        </li>
      </ul>
      <input type="text" placeholder="Rechercher un film, une série..." />
      <button className="dropbtn">
        <Link to="/authentification">Membre ?</Link>
      </button>
    </div>
  );
}

export default Header;
