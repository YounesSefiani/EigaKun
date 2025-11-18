import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import connexion from "../../../services/connexion";
import { AuthContext } from "../../../services/Context/AuthContext";
import { Link } from "react-router-dom";
import "./UserFavoritesSeriesSection.css";
import HorizontalScroll from "../../../components/HorizontalScroll/HorizontalScroll";

function UserFavoritesSeriesSection({ setView }) {
  const { user, token, handleAuthError } = useContext(AuthContext);
  const [series, setSeries] = useState([]);

  const likedSeries = series.filter((serie) => serie.status === "liked");
  const favoritesSeries = series.filter((serie) => serie.status === "favorite");
  const seenSeries = series.filter((serie) => serie.status === "seen");
  const toWatchSeries = series.filter((serie) => serie.status === "toWatch");
  const isWatchingSeries = series.filter(
    (serie) => serie.status === "isWatching"
  );
  useEffect(() => {
    if (!user || !token) return;
    connexion
      .get(`/userFavorites/${user.id}/series`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      })
      .then((res) => setSeries(res.data))
      .catch((error) => {
        if (!handleAuthError(error)) {
          setSeries([]);
        }
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


  return (
    <div className="userFavoritesSeriesSection">
      <h2>Mes series</h2>
      <button
        type="button"
        className="backBtn"
        onClick={() => {
          setView("initial");
        }}
      >
        Retour
      </button>
      {series.length === 0 && <p>Aucun film favori.</p>}
      <div className="userSeriesList">
        <h3>Les series que j'ai aimés</h3>
        <HorizontalScroll>
          {likedSeries.map((serie) => (
            <div className="userSerieCard" key={serie.serie_id}>
              <Link to={`/series/${serie.serie_id}`}>
                            <img
              src={
                serie.serie_poster && serie.serie_poster.startsWith("http")
                  ? serie.serie_poster
                  : serie.serie_poster
                  ? `http://localhost:3994/src/assets/Series/Posters/${serie.serie_poster}`
                  : ""
              }
              alt={serie.title}
            />
                <h3>{serie.serie_title}</h3>
              </Link>
            </div>
          ))}
        </HorizontalScroll>
      </div>
      <div className="userSeriesList">
        <h3>Mes series favoris</h3>
        <HorizontalScroll>
          {favoritesSeries.map((serie) => (
            <div className="userSerieCard" key={serie.serie_id}>
              <Link to={`/series/${serie.serie_id}`}>
                            <img
              src={
                serie.serie_poster && serie.serie_poster.startsWith("http")
                  ? serie.serie_poster
                  : serie.serie_poster
                  ? `http://localhost:3994/src/assets/Series/Posters/${serie.serie_poster}`
                  : ""
              }
              alt={serie.title}
            />
                <h3>{serie.serie_title}</h3>
              </Link>
            </div>
          ))}
        </HorizontalScroll>
      </div>
      <div className="userSeriesList">
        <h3>Les series que j'ai vus</h3>
        <HorizontalScroll>
          {seenSeries.map((serie) => (
            <div className="userSerieCard" key={serie.serie_id}>
              <Link to={`/series/${serie.serie_id}`}>
                            <img
              src={
                serie.serie_poster && serie.serie_poster.startsWith("http")
                  ? serie.serie_poster
                  : serie.serie_poster
                  ? `http://localhost:3994/src/assets/Series/Posters/${serie.serie_poster}`
                  : ""
              }
              alt={serie.title}
            />
                <h3>{serie.serie_title}</h3>
              </Link>
            </div>
          ))}
        </HorizontalScroll>
      </div>
      <div className="userSeriesList">
        <h3>Les series à voir</h3>
        <HorizontalScroll>
          {toWatchSeries.map((serie) => (
            <div className="userSerieCard" key={serie.serie_id}>
              <Link to={`/series/${serie.serie_id}`}>
                            <img
              src={
                serie.serie_poster && serie.serie_poster.startsWith("http")
                  ? serie.serie_poster
                  : serie.serie_poster
                  ? `http://localhost:3994/src/assets/Series/Posters/${serie.serie_poster}`
                  : ""
              }
              alt={serie.title}
            />
                <h3>{serie.serie_title}</h3>
              </Link>
            </div>
          ))}
        </HorizontalScroll>
      </div>
      <div className="userSeriesList">
        <h3>Les series que je regarde</h3>
        <HorizontalScroll>
          {isWatchingSeries.map((serie) => (
            <div className="userSerieCard" key={serie.serie_id}>
              <Link to={`/series/${serie.serie_id}`}>
                            <img
              src={
                serie.serie_poster && serie.serie_poster.startsWith("http")
                  ? serie.serie_poster
                  : serie.serie_poster
                  ? `http://localhost:3994/src/assets/Series/Posters/${serie.serie_poster}`
                  : ""
              }
              alt={serie.title}
            />
                <h3>{serie.serie_title}</h3>
              </Link>
            </div>
          ))}
        </HorizontalScroll>
      </div>
    </div>
  );
}

UserFavoritesSeriesSection.propTypes = {
  setView: PropTypes.func.isRequired,
};

export default UserFavoritesSeriesSection;
