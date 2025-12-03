import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../services/Context/AuthContext";
import { RatingsReviewsContext } from "../../services/Context/RatingsReviewsContext";
import { ToastContainer, toast } from "react-toastify";
import connexion from "../../services/connexion";
import { Rating, Star } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";
import PropTypes from "prop-types";
import "./UserRatingsReviews.css";

function UserRatingsReviews({ ratingReviewId, ratingReviewType }) {
  const { user, token } = useContext(AuthContext);
  const { ratingsReviewsData, refreshRatingsReviews } = useContext(
    RatingsReviewsContext
  );

  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [existingReview, setExistingReview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!user || !ratingsReviewsData) return;

    let foundReview = null;

    if (ratingReviewType === "movie") {
      foundReview = ratingsReviewsData.movies?.find(
        (review) => review.movie_id === ratingReviewId
      );
    } else if (ratingReviewType === "serie") {
      foundReview = ratingsReviewsData.series?.find(
        (review) => review.serie_id === ratingReviewId
      );
    } else if (ratingReviewType === "personality") {
      foundReview = ratingsReviewsData.personalities?.find(
        (review) => review.personality_id === ratingReviewId
      );
    }

    if (foundReview) {
      setExistingReview(foundReview);
      setRating(foundReview.rating || 0);
      setReviewText(foundReview.review || "");
      setIsEditing(true);
      console.log("✏️ Review existante trouvée:", foundReview);
    } else {
      setExistingReview(null);
      setRating(0);
      setReviewText("");
      setIsEditing(false);
      console.log("➕ Aucune review existante, mode création");
    }
  }, [user, ratingsReviewsData, ratingReviewId, ratingReviewType]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !token) {
      toast.error("Vous devez être connecté pour soumettre une review.");
      return;
    }

    if (!rating || rating === 0) {
      toast.dismiss("Veuillez donner une note avant de soumettre.");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      let endpoint = "";
      if (ratingReviewType === "movie") {
        endpoint = `/userReviews/users/${user.id}/movies/${ratingReviewId}`;
      } else if (ratingReviewType === "serie") {
        endpoint = `/userReviews/users/${user.id}/series/${ratingReviewId}`;
      } else if (ratingReviewType === "personality") {
        endpoint = `/userReviews/users/${user.id}/personalities/${ratingReviewId}`;
      }

      let response;
      if (isEditing) {
        console.log("✏️ Modification de la review existante");
        response = await connexion.put(
          endpoint,
          {
            review: reviewText || "",
            rating: rating,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success("Review modifiée avec succès ! ✅");
      } else {
        console.log("➕ Création d'une nouvelle review");
        response = await connexion.post(
          endpoint,
          {
            review: reviewText || "",
            rating: rating,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success("Review soumise avec succès ! ✅");
        setIsEditing(true);
      }

      await refreshRatingsReviews();

      console.log("✅ Opération réussie:", response.data);
    } catch (err) {
      console.error("❌ Erreur lors de la soumission:", err);

      if (err.response?.status === 409) {
        toast.error("Vous avez déjà fait une review pour cet élément.");
      } else if (err.response?.status === 401) {
        toast.error("Session expirée. Veuillez vous reconnecter.");
      } else if (err.response?.data?.error) {
        toast.error(err.response.data.error);
      } else {
        toast.error("Une erreur est survenue. Veuillez réessayer.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="userRatingReviews">
      {user ? (
        <form className="ratingForm" onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          {isEditing && existingReview && (
            <div className="edit-mode-info">
              Vous modifiez votre avis existant (créé le{" "}
              {new Date(existingReview.created_at).toLocaleDateString("fr-FR")})
            </div>
          )}
          <div className="rating-container">
            <Rating
              value={rating || 0}
              items={10}
              itemShapes={Star}
              onChange={setRating}
              style={{ maxWidth: "70%" }}
            />
            <p className="rating-display">Note actuelle : {rating}/10</p>
          </div>
          <label htmlFor="reviewText">
            <p>Votre critique (optionnel)</p>
            <textarea
              id="reviewText"
              name="reviewText"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Écrivez votre critique ici..."
              disabled={isSubmitting}
            />
          </label>
          <button
            type="submit"
            disabled={isSubmitting || !user || rating === 0}
          >
            {isSubmitting
              ? "Envoi en cours..."
              : isEditing
              ? "Modifier la review"
              : "Soumettre la review"}
          </button>
        </form>
      ) : (
        <div className="noUserContainer">
          <form className="ratingFormNoUser">
            <Rating
              value={rating || 0}
              items={10}
              itemShapes={Star}
              onChange={setRating}
              style={{ maxWidth: "50%" }}
            />
            <textarea
              id="reviewText"
              name="reviewText"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Écrivez votre critique ici..."
              disabled={isSubmitting}
            />
          </form>
          <p>
            Vous devez être connecté pour soumettre une note et une critique.
          </p>
        </div>
      )}
      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
}

UserRatingsReviews.propTypes = {
  ratingReviewId: PropTypes.number.isRequired,
  ratingReviewType: PropTypes.oneOf(["movie", "serie", "personality"])
    .isRequired,
  title: PropTypes.string,
  fullname: PropTypes.string,
};

export default UserRatingsReviews;
