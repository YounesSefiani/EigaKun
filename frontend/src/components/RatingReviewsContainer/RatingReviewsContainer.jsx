import React, { useState, useEffect } from "react";
import connexion from "../../services/connexion";
import { Rating, Star } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";
import PropTypes from "prop-types";
import ReviewsModal from "./ReviewsModal/ReviewsModal";
import "./RatingReviewsContainer.css";

function RatingReviewsContainer({ ratingReviewId, ratingReviewType, title }) {
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // ✅ État du modal

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        setIsLoading(true);
        setError(null);

        let endpoint = "";
        if (ratingReviewType === "movie") {
          endpoint = `/movies/${ratingReviewId}`;
        } else if (ratingReviewType === "serie") {
          endpoint = `/series/${ratingReviewId}`;
        } else if (ratingReviewType === "personality") {
          endpoint = `/personalities/${ratingReviewId}`;
        }

        const response = await connexion.get(endpoint);
        const data = response.data;

        setAverageRating(data.averageRating || 0);
        setTotalReviews(data.totalReviews || 0);
      } catch (err) {
        console.error("❌ Erreur lors du chargement des ratings:", err);
        setError("Impossible de charger les notes");
        setAverageRating(0);
        setTotalReviews(0);
      } finally {
        setIsLoading(false);
      }
    };

    if (ratingReviewId && ratingReviewType) {
      fetchRatings();
    }
  }, [ratingReviewId, ratingReviewType]);

  if (isLoading) {
    return (
      <div className="ratingReviewsContainer loading">
        <p>⏳ Chargement des notes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ratingReviewsContainer error">
        <p>❌ {error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="ratingReviewsContainer">
        <div className="ratingDisplay">
          <Rating
            value={averageRating}
            items={10}
            itemShapes={Star}
            readOnly
            style={{ maxWidth: "80%" }}
          />
          <div className="ratingInfo">
            <span className="averageRating">
              {averageRating > 0 ? averageRating.toFixed(1) : "N/A"} / 10
            </span>
          </div>
        </div>
        {/* ✅ Bouton pour ouvrir le modal */}
        {totalReviews > 0 && (
          <button
            className="view-all-reviews-btn"
            onClick={() => setIsModalOpen(true)}
          >
            Voir toutes les critiques ({totalReviews})
          </button>
        )}
      </div>

      {/* ✅ Modal */}
      <ReviewsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        ratingReviewId={ratingReviewId}
        ratingReviewType={"movie"}
        title={title}
      />
    </>
  );
}

RatingReviewsContainer.propTypes = {
  ratingReviewId: PropTypes.number.isRequired,
  ratingReviewType: PropTypes.oneOf(["movie", "serie", "personality"])
    .isRequired,
  title: PropTypes.string.isRequired,
};

export default RatingReviewsContainer;
