import React, { useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faStar,
  faEye,
  faFilm,
  faTv,
} from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "@fortawesome/fontawesome-svg-core/styles.css";

import { AuthContext } from "../../context/AuthContext";
import "./UserInteractionsButtons.css";

function UserInteractionsButtons({
  movie,
  movieId,
  serie,
  serieId,
  personality,
  personalityId,
}) {
  const {
    user,
    userInteractions,
    likeMovie,
    favoriteMovie,
    watchedMovie,
    toWatchMovie,
    likeSeries,
    favoriteSerie,
    watchedSerie,
    toWatchSerie,
    isWatchingSerie,
    likePersonality,
    favoritePersonality,
    isInList,
    token,
  } = useContext(AuthContext);

  if (!user) return null;

  const isMovie = !!movieId;
  const isSerie = !!serieId;
  const isPersonality = !!personalityId;

  const item = movie || serie || personality;
  const itemId = movieId || serieId || personalityId || item?.id;
  const itemTitle =
    movie?.title || serie?.title || personality?.fullname || "ce contenu";
  let itemTypeLabel = "";

  if (isMovie) {
    itemTypeLabel = "le film";
  } else if (isSerie) {
    itemTypeLabel = "la série";
  } else if (isPersonality) {
    itemTypeLabel = "la personnalité";
  }

  const [isLiked, setIsLiked] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isWatched, setIsWatched] = useState(false);
  const [toWatch, setToWatch] = useState(false);
  const [isWatching, setIsWatching] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  let likeFn;
  let favoriteFn;
  let watchedFn;
  let toWatchFn;

  let likeList;
  let favList;
  let watchedList;
  let toWatchList;

  if (isMovie) {
    likeFn = likeMovie;
    favoriteFn = favoriteMovie;
    watchedFn = watchedMovie;
    toWatchFn = toWatchMovie;

    likeList = "likedMovies";
    favList = "favoritesMovies";
    watchedList = "seenMovies";
    toWatchList = "toWatchMovies";
  } else if (isSerie) {
    likeFn = likeSeries;
    favoriteFn = favoriteSerie;
    watchedFn = watchedSerie;
    toWatchFn = toWatchSerie;

    likeList = "likedSeries";
    favList = "favoritesSeries";
    watchedList = "seenSeries";
    toWatchList = "toWatchSeries";
  } else if (isPersonality) {
    likeFn = likePersonality;
    favoriteFn = favoritePersonality;

    likeList = "likedPersonalities";
    favList = "favoritesPersonalities";
  }

  useEffect(() => {
    setIsLiked(isInList(likeList, itemId));
    setIsFavorite(isInList(favList, itemId));
    if (isMovie || isSerie) {
      setIsWatched(isInList(watchedList, itemId));
      setToWatch(isInList(toWatchList, itemId));
    }
    if (isSerie) {
      setIsWatching(isInList("isWatchingSeries", itemId));
    }
  }, [userInteractions, itemId]);

  const handleAction = async (
    fn,
    currentState,
    setState,
    addedMsg,
    removedMsg,
  ) => {
    if (!user) return;
    setIsProcessing(true);
    try {
      const success = await fn(itemId);
      if (success) {
        const newState = !currentState;
        setState(newState);
        toast[newState ? "success" : "info"](newState ? addedMsg : removedMsg, {
          position: "top-right",
          autoClose: 3000,
        });
      }
      if (!token) {
        toast.error(
          "Votre temps de connexion a été expiré, veuillez vous reconnecter.",
          {
            position: "top-right",
            autoClose: 3000,
          },
        );
      }
    } catch (err) {
      console.error("Erreur lors de l'action :", err);
      toast.error("Une erreur est survenue.", { position: "top-right" });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="userInteractionsButtons">
      {(isMovie || isSerie || isPersonality) && (
        <>
          <button
            type="button"
            onClick={() =>
              handleAction(
                likeFn,
                isLiked,
                setIsLiked,
                `Vous aimez ${itemTypeLabel} "${itemTitle}" !`,
                `Vous n'aimez plus ${itemTypeLabel} "${itemTitle}".`,
              )
            }
            style={{ color: isLiked ? "red" : "#ffb20c" }}
            disabled={isProcessing}
            title={isLiked ? "Ne plus aimer" : "Aimer"}
          >
            <FontAwesomeIcon icon={faHeart} />
          </button>
          <button
            type="button"
            onClick={() =>
              handleAction(
                favoriteFn,
                isFavorite,
                setIsFavorite,
                `"${itemTitle}" est ajouté à vos favoris !`,
                `"${itemTitle}" retiré de vos favoris.`,
              )
            }
            style={{ color: isFavorite ? "red" : "#ffb20c" }}
            disabled={isProcessing}
            title={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
          >
            <FontAwesomeIcon icon={faStar} />
          </button>
        </>
      )}

      {(isMovie || isSerie) && (
        <>
          <button
            type="button"
            onClick={() =>
              handleAction(
                watchedFn,
                isWatched,
                setIsWatched,
                `Vous avez vu ${itemTypeLabel} "${itemTitle}".`,
                `Vous n'avez pas encore vu ${itemTypeLabel} "${itemTitle}".`,
              )
            }
            style={{ color: isWatched ? "red" : "#ffb20c" }}
            disabled={isProcessing}
            title={isWatched ? "Retirer de vus" : "Marquer comme vu"}
          >
            <FontAwesomeIcon icon={faEye} />
          </button>

          <button
            type="button"
            onClick={() =>
              handleAction(
                toWatchFn,
                toWatch,
                setToWatch,
                `Vous souhaitez regarder ${itemTypeLabel} "${itemTitle}".`,
                `${itemTypeLabel.charAt(0).toUpperCase() + itemTypeLabel.slice(1)} "${itemTitle}" retiré de votre liste à voir.`,
              )
            }
            style={{ color: toWatch ? "red" : "#ffb20c" }}
            disabled={isProcessing}
            title={
              toWatch
                ? "Retirer de la liste à voir"
                : "Ajouter à la liste à voir"
            }
          >
            <FontAwesomeIcon icon={faFilm} />
          </button>
        </>
      )}

      {isSerie && (
        <button
          type="button"
          onClick={() =>
            handleAction(
              isWatchingSerie,
              isWatching,
              setIsWatching,
              `Vous regardez actuellement la série "${itemTitle}".`,
              `Vous ne regardez plus la série "${itemTitle}".`,
            )
          }
          style={{ color: isWatching ? "red" : "#ffb20c" }}
          disabled={isProcessing}
          title={
            isWatching
              ? "Retirer des séries en cours"
              : "Marquer comme en cours"
          }
        >
          <FontAwesomeIcon icon={faTv} />
        </button>
      )}
      <ToastContainer />
    </div>
  );
}

UserInteractionsButtons.propTypes = {
  movie: PropTypes.shape({ id: PropTypes.number, title: PropTypes.string }),
  movieId: PropTypes.number,
  serie: PropTypes.shape({ id: PropTypes.number, title: PropTypes.string }),
  serieId: PropTypes.number,
  personality: PropTypes.shape({
    id: PropTypes.number,
    fullname: PropTypes.string,
  }),
  personalityId: PropTypes.number,
};

UserInteractionsButtons.defaultProps = {
  movie: null,
  movieId: null,
  serie: null,
  serieId: null,
  personality: null,
  personalityId: null,
};

export default UserInteractionsButtons;
