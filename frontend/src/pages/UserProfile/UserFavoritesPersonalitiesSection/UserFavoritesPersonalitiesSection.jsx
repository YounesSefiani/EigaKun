import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import connexion from "../../../services/connexion";
import { AuthContext } from "../../../services/Context/AuthContext";
import { Link } from "react-router-dom";
import "./UserFavoritesPersonalitiesSection.css";
import HorizontalScroll from "../../../components/HorizontalScroll/HorizontalScroll";

function UserFavoritesPersonalitiesSection({ setView }) {
  const { user, token, handleAuthError } = useContext(AuthContext);
  const [personalities, setPersonalities] = useState([]);

  useEffect(() => {
    if (!user || !token) return;
    connexion
      .get(`/userFavorites/${user.id}/personalities`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setPersonalities(res.data))
      .catch((error) => {
        if (!handleAuthError(error)) setPersonalities([]);
      });
  }, [user, token, handleAuthError]);

  if (!user || !token) {
    return (
      <div className="sessionExpired">
        <h2>Aouch !</h2>
        <p>Ta session a été expiré. Il faut te reconnecter.</p>
        <p>Pa de soucis, tu peux le faire <a href="/authentification">ici</a> !</p>
      </div>
    );
  }


  const likedPersonalities = personalities.filter(
    (personality) => personality.status === "liked"
  );
  const favoritesPersonalities = personalities.filter(
    (personality) => personality.status === "favorite"
  );

  return (
    <div className="userFavoritesPersonalitiesSection">
      <h2>Mes personnalités</h2>
      <button
        type="button"
        className="backBtn"
        onClick={() => setView("initial")}
      >
        Retour
      </button>
      {personalities.length === 0 && <p>Aucune personnalité favorite.</p>}
      <div className="userPersonalitiesList">
        <h3>Les personalities que j'aime</h3>
        <HorizontalScroll>
          {likedPersonalities.map((personality) => (
            <div
              className="userPersonalityCard"
              key={personality.personality_id}
            >
              <Link to={`/personnalites/${personality.personality_id}`}>
                <img
                  src={personality.personality_image}
                  alt={personality.personality_fullname}
                />
                <h3>{personality.personality_fullname}</h3>
              </Link>
            </div>
          ))}
        </HorizontalScroll>
      </div>
      <div className="userPersonalitiesList">
        <h3>Mes personnalités favorites</h3>
        <HorizontalScroll>
          {favoritesPersonalities.map((personality) => (
            <div
              className="userPersonalityCard"
              key={personality.personality_id}
            >
              <Link to={`/personnalites/${personality.personality_id}`}>
                <img
                  src={personality.personality_image}
                  alt={personality.personality_fullname}
                />
                <h3>{personality.personality_fullname}</h3>
              </Link>
            </div>
          ))}
        </HorizontalScroll>
      </div>
    </div>
  );
}

UserFavoritesPersonalitiesSection.propTypes = {
  setView: PropTypes.func.isRequired,
};

export default UserFavoritesPersonalitiesSection;
