import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import EigaKunLogo from "../../assets/EigaKunLogo.png";
import "./Header.css";

function Header() {
  const { user, logout } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  return (
    <div className="header">
      <Link to="/">
        <img src={EigaKunLogo} alt="EigaKunLogo" className="logo" />
      </Link>
      <ul>
        <li>
          <Link to="/movies">Films</Link>
        </li>
        <li>
          <Link to="/series">Séries</Link>
        </li>
        <li>
          <Link to="/blog">Blog</Link>
        </li>
        <li>
          <input type="text" placeholder="Rechercher..." />
        </li>
        <li>
          {user ? (
            <div className="dropdown">
              <button
                type="button"
                onClick={toggleDropdown}
                className="dropbtn"
              >
                {user.pseudo}
              </button>
              {dropdownOpen && (
                <div className="dropdown-content">
                  <button type="button" onClick={() => {}}>
                    <Link to="/user/profile">Profil</Link>
                  </button>
                  <button type="button" onClick={logout}>
                    Déconnexion
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/authentification">Membre ?</Link>
          )}
        </li>
      </ul>
    </div>
  );
}

export default Header;
