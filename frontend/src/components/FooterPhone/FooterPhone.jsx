import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFilm,
  faTv,
  faStar,
  faNewspaper,
} from "@fortawesome/free-solid-svg-icons";
import "./FooterPhone.css";

function FooterPhone() {
  return (
    <footer className="footerPhone">
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
      <FontAwesomeIcon />
    </footer>
  );
}

export default FooterPhone;
