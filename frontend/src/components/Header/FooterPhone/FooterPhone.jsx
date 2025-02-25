import React from "react";
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
        <li>
          <FontAwesomeIcon icon={faFilm} />
          Films
        </li>
        <li>
          <FontAwesomeIcon icon={faTv} />
          Séries
        </li>
        <li>
          <FontAwesomeIcon icon={faStar} />
          Personnalités
        </li>
        <li>
          <FontAwesomeIcon icon={faNewspaper} />
          Blog
        </li>
        <FontAwesomeIcon />
      </ul>
    </div>
  );
}

export default FooterPhone;
