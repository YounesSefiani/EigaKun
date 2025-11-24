import React, { useContext, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faStar,
  faEye,
  faTv,
  faList,
} from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "./UserInteractionsButtons.css";
import { FavoritesContext } from "../../services/Context/FavoritesContext";
import { AuthContext } from "../../services/Context/AuthContext";

function UserInteractionsButtons({
  favoriteId,
  favoriteType,
  isSerie,
  title,
  fullname,
}) {
  const { user } = useContext(AuthContext);
  const { favorites, updateFavorite, removeFavorite } =
    useContext(FavoritesContext);

  // Pour éviter les problèmes de typage (nombre vs string)
  const favId = String(favoriteId);

  // Statuts actuels pour cet item
  const itemStatuses = useMemo(
    () =>
      Array.isArray(favorites)
        ? favorites
            .filter(
              (fav) =>
                String(fav.favorite_id) === favId &&
                fav.favorite_type === favoriteType
            )
            .map((fav) => fav.status)
        : [],
    [favorites, favId, favoriteType]
  );

  // Pour affichage immédiat (optimiste)
  const [pending, setPending] = useState(null);

  const displayTitle = title || fullname || "";

  const handleClick = async (status) => {
    setPending(status); // désactive le bouton pendant l'action
    if (itemStatuses.includes(status)) {
      await removeFavorite(favoriteId, favoriteType, status);
      if (favoriteType === "movie") {
        if (status === "liked") {
          toast.success(`Vous n'aimez plus le film "${displayTitle}".`);
        } else if (status === "favorite") {
          toast.success(
            `Le film "${displayTitle}" ne fait plus partis de vos favoris.`
          );
        } else if (status === "seen") {
          toast.success(`Vous n'avez pas encore vu le film "${displayTitle}".`);
        } else if (status === "toWatch") {
          toast.success(
            `Vous ne prévoyez plus de regarder le film "${displayTitle}".`
          );
        }
      } else if (favoriteType === "serie") {
        if (status === "liked") {
          toast.success(`Vous n'aimez plus la série "${displayTitle}".`);
        } else if (status === "favorite") {
          toast.success(
            `La série "${displayTitle}" ne fait plus partis de vos favoris.`
          );
        } else if (status === "seen") {
          toast.success(
            `Vous n'avez pas encore vu la série "${displayTitle}".`
          );
        } else if (status === "toWatch") {
          toast.success(
            `Vous ne prévoyez plus de regarder la série "${displayTitle}".`
          );
        } else if (status === "isWatching") {
          toast.success(
            `Vous regardez actuellement la série "${displayTitle}".`
          );
        }
      } else if (favoriteType === "personality") {
        if (status === "liked") {
          toast.success(`Vous n'aimez plus la personnalité "${fullname}".`);
        } else if (status === "favorite") {
          toast.success(
            `La personnalité "${fullname}" ne fait plus partie de vos favoris.`
          );
        }
      }
    } else {
      await updateFavorite(favoriteId, favoriteType, status);
      if (favoriteType === "movie") {
        if (status === "liked") {
          toast.success(`Vous aimez le film "${displayTitle}".`);
        } else if (status === "favorite") {
          toast.success(
            `Le film "${displayTitle}" fait partie de vos favoris.`
          );
        } else if (status === "seen") {
          toast.success(`Vous avez vu le film "${displayTitle}".`);
        } else if (status === "toWatch") {
          toast.success(`Vous prévoyez de voir le film "${displayTitle}".`);
        }
      } else if (favoriteType === "serie") {
        if (status === "liked") {
          toast.success(`Vous aimez la série "${displayTitle}".`);
        } else if (status === "favorite") {
          toast.success(
            `La série "${displayTitle}" fait partie de vos favoris.`
          );
        } else if (status === "seen") {
          toast.success(`Vous avez vu la série "${displayTitle}".`);
        } else if (status === "toWatch") {
          toast.success(`Vous prévoyez de voir la série "${displayTitle}".`);
        } else if (status === "isWatching") {
          toast.success(
            `Vous regardez actuellement la série "${displayTitle}".`
          );
        }
      } else if (favoriteType === "personality") {
        if (status === "liked") {
          toast.success(`Vous aimez la personnalité "${fullname}".`);
        } else if (status === "favorite") {
          toast.success(
            `La personnalité "${fullname}" fait partie de vos favoris.`
          );
        }
      }
    }
    setPending(null);
  };

  if (!user) return null;

  return (
    <div className="userInteractionsButtons">
      <button
        type="button"
        className={itemStatuses.includes("liked") ? "active" : ""}
        onClick={() => handleClick("liked")}
        title="Aimé"
        disabled={pending === "liked"}
      >
        <FontAwesomeIcon icon={faHeart} />
      </button>
      <button
        type="button"
        className={itemStatuses.includes("favorite") ? "active" : ""}
        onClick={() => handleClick("favorite")}
        title="Favoris"
        disabled={pending === "favorite"}
      >
        <FontAwesomeIcon icon={faStar} />
      </button>
      {favoriteType === "movie" || favoriteType === "serie" ? (
          <>
            <button
              type="button"
              className={itemStatuses.includes("seen") ? "active" : ""}
              onClick={() => handleClick("seen")}
              title="Vu"
              disabled={pending === "seen"}
            >
              <FontAwesomeIcon icon={faEye} />
            </button>
            <button
              type="button"
              className={itemStatuses.includes("toWatch") ? "active" : ""}
              onClick={() => handleClick("toWatch")}
              title="À voir"
              disabled={pending === "toWatch"}
            >
              <FontAwesomeIcon icon={faList} />
            </button>
          </>
        ) : null}
      {isSerie && (
        <button
          type="button"
          className={itemStatuses.includes("isWatching") ? "active" : ""}
          onClick={() => handleClick("isWatching")}
          title="En cours de visionnage"
          disabled={pending === "isWatching"}
        >
          <FontAwesomeIcon icon={faTv} />
        </button>
      )}
      <ToastContainer />
    </div>
  );
}

export default UserInteractionsButtons;
