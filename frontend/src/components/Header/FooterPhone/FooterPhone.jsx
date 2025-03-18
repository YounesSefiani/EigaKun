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
    <div className="footerPhone">
      <ul>
        <Link to="/films">
          <li>
            <FontAwesomeIcon icon={faFilm} />
            Films
          </li>
        </Link>
        <Link to="/series">
          <li>
            <FontAwesomeIcon icon={faTv} />
            Séries
          </li>
        </Link>
        <Link to="/personnalites">
          <li>
            <FontAwesomeIcon icon={faStar} />
            Personnalités
          </li>
        </Link>
        <Link to="/blog">
          <li>
            <FontAwesomeIcon icon={faNewspaper} />
            Blog
          </li>
        </Link>
        <FontAwesomeIcon />
      </ul>
    </div>
  );
}

export default FooterPhone;
