import React, { useState, useEffect, useCallback } from "react";
import connexion from "../../../services/connexion";
import { Rating, Star } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";
import PropTypes from "prop-types";
import "./ReviewsModal.css";

function ReviewsModal({
  isOpen,
  onClose,
  ratingReviewId,
  ratingReviewType,
  title,
  fullname,
}) {
  const [reviews, setReviews] = useState([]);
  const [itemTitle, setItemTitle] = useState(title || fullname || "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReviews = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // ✅ Construire l'endpoint selon le type
      let endpoint = "";
      if (ratingReviewType === "movie") {
        endpoint = `/userReviews/movies/${ratingReviewId}`;
      } else if (ratingReviewType === "serie") {
        endpoint = `/userReviews/series/${ratingReviewId}`;
      } else if (ratingReviewType === "personality") {
        endpoint = `/userReviews/personalities/${ratingReviewId}`;
      }

      const response = await connexion.get(endpoint);
      setReviews(response.data);

      if (response.data && response.data.length > 0) {
        const firstReview = response.data[0];

        if (ratingReviewType === "movie" && firstReview.movie_title) {
          setItemTitle(firstReview.movie_title);
        } else if (ratingReviewType === "serie" && firstReview.serie_title) {
          setItemTitle(firstReview.serie_title);
        } else if (
          ratingReviewType === "personality" &&
          firstReview.personality_fullname
        ) {
          setItemTitle(firstReview.personality_fullname);
        }
      }

      console.log("📝 Reviews récupérées:", response.data);
    } catch (err) {
      console.error("❌ Erreur lors du chargement des reviews:", err);
      if (err.response?.status === 404) {
        setReviews([]);
        setError("Aucune review pour le moment");
      } else {
        setError("Erreur lors du chargement des reviews");
      }
    } finally {
      setIsLoading(false);
    }
  }, [ratingReviewId, ratingReviewType]);

  const getReviewTypeText = () => {
    switch (ratingReviewType) {
      case "movie":
        return "Reviews pour le film";
      case "serie":
        return "Reviews pour la série";
      case "personality":
        return "Reviews pour";
      default:
        return "Reviews pour";
    }
  };

  useEffect(() => {
    if (isOpen && ratingReviewId && ratingReviewType) {
      fetchReviews();
    }
  }, [fetchReviews, isOpen, ratingReviewId, ratingReviewType]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // ✅ Fermer le modal en cliquant sur le backdrop
  const handleBackdropClick = (e) => {
    if (e.target.className === "modal-backdrop") {
      onClose();
    }
  };

  // ✅ Fermer avec la touche Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // ✅ Bloquer le scroll du body quand le modal est ouvert
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div className="reviews-modal-overlay"></div>
      <div className="reviews-modal-backdrop" onClick={handleBackdropClick}>
        <div className="reviews-modal-content">
          {/* Header */}
          <div className="reviews-modal-header">
            <h2>
              {getReviewTypeText()}
              {itemTitle && ` "${itemTitle}"`}
            </h2>
            <button className="modal-close" onClick={onClose}>
              ✕
            </button>
          </div>

          {/* Body */}
          <div className="reviews-modal-body">
            {isLoading && (
              <div className="modal-loading">
                <p>⏳ Chargement des reviews...</p>
              </div>
            )}

            {error && !isLoading && (
              <div className="modal-error">
                <p>{error}</p>
              </div>
            )}

            {!isLoading && !error && reviews.length === 0 && (
              <div className="modal-empty">
                <p>
                  Aucune review pour le moment. Soyez le premier à en écrire une
                  ! 📝
                </p>
              </div>
            )}

            {!isLoading && reviews.length > 0 && (
              <div className="reviews-list">
                {reviews.map((review) => (
                  <div key={review.id} className="review-card">
                    {/* Header de la review */}
                    <div className="review-card-left">
                      {/* Avatar de l'utilisateur */}
                      {review.user_avatar ? (
                        <img
                          src={`http://localhost:3994/src/assets/Users/Avatars/${review.user_avatar}`}
                          alt={review.user_username}
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "flex";
                          }}
                        />
                      ) : (
                        <div
                          className="review-avatar-placeholder"
                          style={{
                            display: review.user_avatar ? "none" : "flex",
                          }}
                        >
                          {review.user_username?.charAt(0).toUpperCase() || "?"}
                        </div>
                      )}
                      <p>{review.user_username}</p>
                    </div>
                    <div className="review-card-right">
                      {/* Note avec étoiles */}
                      <div className="review-rating-display">
                        <Rating
                          value={review.rating || 0}
                          items={10}
                          itemShapes={Star}
                          readOnly
                          style={{ width: "60%" }}
                        />
                        <p>{review.rating}/10</p>
                      </div>
                      <div className="review-text">
                        <p>{review.review || "Pas de commentaire écrit."}</p>
                        <p className="review-date">
                          Ecrit le {formatDate(review.created_at)}
                          {review.updated_at &&
                            review.updated_at !== review.created_at && (
                              <span>
                                {" "}
                                (modifié le {formatDate(review.updated_at)})
                              </span>
                            )}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
        </div>
      </div>
    </>
  );
}

ReviewsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  ratingReviewId: PropTypes.number.isRequired,
  ratingReviewType: PropTypes.oneOf(["movie", "serie", "personality"])
    .isRequired,
  title: PropTypes.string.isRequired,
};

export default ReviewsModal;
