import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleLeft } from "@fortawesome/free-solid-svg-icons";
import connexion from "../../../services/connexion";
import { AuthContext } from "../../../context/AuthContext";
import HorizontalScroll from "../../../components/HorizontalScroll/HorizontalScroll";
import "./FavoritesPersonalities.css";

function FavoritesPersonalities({ setView }) {
  const { user } = useContext(AuthContext); // Récupérer l'utilisateur
  const [likedPersonalities, setLikedPersonalities] = useState([]); // Initialiser avec useState([])
  const [favoritesPersonalities, setFavoritesPersonalities] = useState([]);
  useEffect(() => {
    const fetchFavoritePersonalities = async () => {
      if (!user || !user.id) {
        console.error("User is not available");
        return;
      }

      const token = localStorage.getItem("authToken");

      if (!token) {
        console.error("Token is missing");
        return;
      }

      try {
        const [likedPersonalitiesResponse, favoritePersonalitiesResponse] =
          await Promise.all([
            connexion.get(`/userLiked/${user.id}/likedPersonalities`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }),
            connexion.get(`/userFavorites/${user.id}/favoritesPersonalities`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }),
          ]);

        // Vérifier la structure des données avant de les déstructurer
        const likedPersonalitiesData =
          likedPersonalitiesResponse.data?.likedPersonalities || {};
        const favoritesPersonalitiesData =
          favoritePersonalitiesResponse.data?.favoritesPersonalities || {};

        if (Array.isArray(likedPersonalitiesData)) {
          setLikedPersonalities(likedPersonalitiesData);
        } else {
          console.error("No liked personalities found in the response.");
        }

        if (Array.isArray(favoritesPersonalitiesData)) {
          setFavoritesPersonalities(favoritesPersonalitiesData);
        } else {
          console.error("No favorites personalities found in the response.");
        }
      } catch (error) {
        console.error("Error fetching favorites personalities:", error);
      }
    };

    fetchFavoritePersonalities();
  }, [user]);

  return (
    <div className="favoritesPersonalitiesContainer">
      <button
        type="button"
        className="backBtn"
        onClick={() => setView("initial")}
      >
        <FontAwesomeIcon icon={faCircleLeft} />
      </button>
      <div className="userPersonalities">
        <h3>Les personnalités que j'aime</h3>

        {likedPersonalities.length > 0 ? (
          <div className="userPersonalitiesList">
            <HorizontalScroll>
              {likedPersonalities.map((personality) => (
                <div
                  className="userPersonalityCard"
                  key={personality.personality_id}
                >
                  <Link to={`/personnalités/${personality.personality_id}`}>
                    {personality.personality_image ? (
                      <>
                        <img
                          src={personality.personality_image}
                          alt={personality.personality_fullname}
                        />
                        <p>{personality.personality_fullname}</p>
                      </>
                    ) : (
                      <div className="personalityCardFolder">
                        <p>{personality.personality_fullname}</p>
                      </div>
                    )}
                  </Link>
                </div>
              ))}
            </HorizontalScroll>
          </div>
        ) : (
          <div className="personalitiesBlank">
            <p>Aucune personnalité aimée pour le moment</p>
          </div>
        )}
      </div>
      <div className="userPersonalities">
        <h3>Mes personnalités favorites</h3>

        {favoritesPersonalities.length > 0 ? (
          <div className="userPersonalitiesList">
            <HorizontalScroll>
              {favoritesPersonalities.map((personality) => (
                <div
                  className="userPersonalityCard"
                  key={personality.personality_id}
                >
                  <Link to={`/personnalités/${personality.personality_id}`}>
                    {personality.personality_image ? (
                      <>
                        <img
                          src={personality.personality_image}
                          alt={personality.personality_fullname}
                        />
                        <p>{personality.personality_fullname}</p>
                      </>
                    ) : (
                      <div className="personalityCardFolder">
                        <p>{personality.personality_fullname}</p>
                      </div>
                    )}
                  </Link>
                </div>
              ))}
            </HorizontalScroll>
          </div>
        ) : (
          <div className="personalitiesBlank">
            <p>Aucune personnalité favorite pour le moment</p>
          </div>
        )}
      </div>
      <FontAwesomeIcon />
    </div>
  );
}

FavoritesPersonalities.propTypes = {
  setView: PropTypes.func.isRequired,
};

export default FavoritesPersonalities;
