import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleLeft } from "@fortawesome/free-solid-svg-icons";
import connexion from "../../../services/connexion";
import { AuthContext } from "../../../context/AuthContext";
import HorizontalScroll from "../../../components/HorizontalScroll/HorizontalScroll";
import "./FavoritesSeries.css";

function FavoritesSeries({ setView }) {
  const { user } = useContext(AuthContext); // Récupérer l'utilisateur
  const [likedSeries, setLikedSeries] = useState([]); // Initialiser avec useState([])
  const [favoritesSeries, setFavoritesSeries] = useState([]);
  const [seenSeries, setSeenSeries] = useState([]);
  const [toWatchSeries, setToWatchSeries] = useState([]);
  const [isWatchingSeries, setIsWatchingSeries] = useState([]);
  useEffect(() => {
    const fetchFavoriteSeries = async () => {
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
        const [
          likedSeriesResponse,
          favoriteSeriesResponse,
          seenSeriesResponse,
          toWatchSeriesResponse,
          isWatchingSeriesResponse,
        ] = await Promise.all([
          connexion.get(`/userLiked/${user.id}/likedSeries`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          connexion.get(`/userFavorites/${user.id}/favoritesSeries`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          connexion.get(`/userSeen/${user.id}/seenSeries`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          connexion.get(`/userToWatch/${user.id}/toWatchSeries`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          connexion.get(`/userIsWatchingSeries/${user.id}/isWatchingSeries`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        // Vérifier la structure des données avant de les déstructurer
        const likedSeriesData = likedSeriesResponse.data?.likedSeries || {};
        const favoritesSeriesData =
          favoriteSeriesResponse.data?.favoritesSeries || {};
        const seenSeriesData = seenSeriesResponse.data?.seenSeries || {};
        const toWatchSeriesData =
          toWatchSeriesResponse.data?.toWatchSeries || {};
        const isWatchingSeriesData =
          isWatchingSeriesResponse.data?.isWatchingSeries || {};

        if (Array.isArray(likedSeriesData)) {
          setLikedSeries(likedSeriesData);
        } else {
          console.error("No liked series found in the response.");
        }

        if (Array.isArray(favoritesSeriesData)) {
          setFavoritesSeries(favoritesSeriesData);
        } else {
          console.error("No favorite series found in the response.");
        }

        if (Array.isArray(seenSeriesData)) {
          setSeenSeries(seenSeriesData);
        } else {
          console.error("No seen series found in the response.");
        }

        if (Array.isArray(toWatchSeriesData)) {
          setToWatchSeries(toWatchSeriesData);
        } else {
          console.error("No series to watch found in the response.");
        }

        if (Array.isArray(isWatchingSeriesData)) {
          setIsWatchingSeries(isWatchingSeriesData);
        } else {
          console.error("No series to watch found in the response.");
        }
      } catch (error) {
        console.error("Error fetching favorite series:", error);
      }
    };

    fetchFavoriteSeries();
  }, [user]);

  return (
    <div className="favoritesSeriesContainer">
      <button
        type="button"
        className="backBtn"
        onClick={() => setView("initial")}
      >
        <FontAwesomeIcon icon={faCircleLeft} />
      </button>
      <div className="userSeries">
        <h3>Les series que j'aime</h3>

        {likedSeries.length > 0 ? (
          <div className="userSeriesList">
            <HorizontalScroll>
              {likedSeries.map((serie) => (
                <div className="userSerieCard" key={serie.serie_id}>
                  <Link to={`/series/${serie.serie_id}`}>
                    {serie.serie_poster ? (
                      <>
                        <img src={serie.serie_poster} alt={serie.serie_title} />
                        <p>{serie.serie_title}</p>
                      </>
                    ) : (
                      <div className="serieCardFolder">
                        <p>{serie.serie_title}</p>
                      </div>
                    )}
                  </Link>
                </div>
              ))}
            </HorizontalScroll>
          </div>
        ) : (
          <div className="seriesBlank">
            <p>Aucune serie aimée pour le moment</p>
          </div>
        )}
      </div>

      <div className="userSeries">
        <h3>Les series favorites</h3>

        {favoritesSeries.length > 0 ? (
          <div className="userSeriesList">
            <HorizontalScroll>
              {favoritesSeries.map((serie) => (
                <div className="userSerieCard" key={serie.serie_id}>
                  <Link to={`/series/${serie.serie_id}`}>
                    {serie.serie_poster ? (
                      <>
                        <img src={serie.serie_poster} alt={serie.serie_title} />
                        <p>{serie.serie_title}</p>
                      </>
                    ) : (
                      <div className="serieCardFolder">
                        <p>{serie.serie_title}</p>
                      </div>
                    )}
                  </Link>
                </div>
              ))}
            </HorizontalScroll>
          </div>
        ) : (
          <div className="seriesBlank">
            <p>Aucune serie favorite pour le moment</p>
          </div>
        )}
      </div>

      <div className="userSeries">
        <h3>Les series vues</h3>

        {seenSeries.length > 0 ? (
          <div className="userSeriesList">
            <HorizontalScroll>
              {seenSeries.map((serie) => (
                <div className="userSerieCard" key={serie.serie_id}>
                  <Link to={`/series/${serie.serie_id}`}>
                    {serie.serie_poster ? (
                      <>
                        <img src={serie.serie_poster} alt={serie.serie_title} />
                        <p>{serie.serie_title}</p>
                      </>
                    ) : (
                      <div className="serieCardFolder">
                        <p>{serie.serie_title}</p>
                      </div>
                    )}
                  </Link>
                </div>
              ))}
            </HorizontalScroll>
          </div>
        ) : (
          <div className="seriesBlank">
            <p>Aucune serie vue pour le moment</p>
          </div>
        )}
      </div>
      <div className="userSeries">
        <h3>Les series à voir</h3>
        {toWatchSeries.length > 0 ? (
          <div className="userSeriesList">
            <HorizontalScroll>
              {toWatchSeries.map((serie) => (
                <div className="userSerieCard" key={serie.serie_id}>
                  <Link to={`/series/${serie.serie_id}`}>
                    {serie.serie_poster ? (
                      <>
                        <img src={serie.serie_poster} alt={serie.serie_title} />
                        <p>{serie.serie_title}</p>
                      </>
                    ) : (
                      <div className="serieCardFolder">
                        <p>{serie.serie_title}</p>
                      </div>
                    )}
                  </Link>
                </div>
              ))}
            </HorizontalScroll>
          </div>
        ) : (
          <div className="seriesBlank">
            <p>Aucune serie à voir pour le moment</p>
          </div>
        )}
      </div>
      <div className="userSeries">
        <h3>Les series en cours de visionnage</h3>
        {isWatchingSeries.length > 0 ? (
          <div className="userSeriesList">
            <HorizontalScroll>
              {isWatchingSeries.map((serie) => (
                <div className="userSerieCard" key={serie.serie_id}>
                  <Link to={`/series/${serie.serie_id}`}>
                    {serie.serie_poster ? (
                      <>
                        <img src={serie.serie_poster} alt={serie.serie_title} />
                        <p>{serie.serie_title}</p>
                      </>
                    ) : (
                      <div className="serieCardFolder">
                        <p>{serie.serie_title}</p>
                      </div>
                    )}
                  </Link>
                </div>
              ))}
            </HorizontalScroll>
          </div>
        ) : (
          <div className="seriesBlank">
            <p>Aucune serie en cours de visionnage pour le moment</p>
          </div>
        )}
      </div>
      <FontAwesomeIcon />
    </div>
  );
}

FavoritesSeries.propTypes = {
  setView: PropTypes.func.isRequired,
};

export default FavoritesSeries;
