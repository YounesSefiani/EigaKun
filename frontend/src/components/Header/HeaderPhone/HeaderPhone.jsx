import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import EigaKunLogo from "../../../assets/EigaKunLogo.png";
import "./HeaderPhone.css";

function HeaderPhone() {
  const { user, logout } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  return (
    <div className="headerPhone">
      <Link to="/">
        <img src={EigaKunLogo} alt="Logo Eiga-Kun" />
      </Link>
      <div className="headerContainer">
        <input type="text" placeholder="Rechercher un film, une série..." />
        {user ? (
          <div className="headerDropdown">
            <button type="button" onClick={toggleDropdown}>
              {user.pseudo}
            </button>
            {dropdownOpen && (
              <div className={`dropdownContent ${dropdownOpen ? "open" : ""}`}>
                <button type="button" onClick={() => {}}>
                  <Link to="/user/profile">Profil</Link>
                </button>
                <button type="button" onClick={logout}>
                  Deconnexion
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="headerDropdown">
            <button type="button" onClick={() => {}}>
              <Link to="/authentification">Membre ?</Link>
            </button>
            {/* {dropdownOpen && (
              <div className="dropdownContent">
                <button type="button" onClick={logout}>
                  Deconnexion
                </button>
              </div>
            )} */}
          </div>
        )}
      </div>
    </div>
  );
}

export default HeaderPhone;
