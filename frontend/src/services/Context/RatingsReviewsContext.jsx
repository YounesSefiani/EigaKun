import React, { createContext, useState, useEffect, useContext } from "react";
import connexion from "../connexion";
import { AuthContext } from "./AuthContext";

export const RatingsReviewsContext = createContext();

function splitRatingsReviewsByType(ratingsReviews) {
  return {
    movies: ratingsReviews.filter(rr => rr.movie_id !== null),
    series: ratingsReviews.filter(rr => rr.serie_id !== null),
    personalities: ratingsReviews.filter(rr => rr.personality_id !== null),
  };
}

export function RatingsReviewsProvider({ children}) {
  const { user, token } = useContext(AuthContext);
  const [ratingsReviews, setRatingsReviews] = useState([]);
  const [ratingsReviewsData, setRatingsReviewsData] = useState({
    movies: [],
    series: [],
    personalities: [],
  });

  useEffect(() => {
    const storedData = localStorage.getItem("ratingsReviewsData");
    const storedRaw = localStorage.getItem("ratingsReviews");
    
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setRatingsReviewsData(parsedData);
      } catch {
        setRatingsReviewsData({ movies: [], series: [], personalities: [] });
      }
    }
    
    if (storedRaw) {
      try {
        const parsed = JSON.parse(storedRaw);
        setRatingsReviews(Array.isArray(parsed) ? parsed : []);
      } catch {
        setRatingsReviews([]);
      }
    }
  }, []);

  useEffect(() => {
    if (token && user?.id) {
      connexion
        .get(`/userReviews/users/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          console.log("📊 Données reçues de l'API:", res.data);
          
          const dataToStore = {
            movies: res.data.movies || [],
            series: res.data.series || [],
            personalities: res.data.personalities || [],
          };
          
          // Stocke les données complètes
          setRatingsReviewsData(dataToStore);
          localStorage.setItem("ratingsReviewsData", JSON.stringify(dataToStore));

          // Stocke aussi rawRatingReviews pour compatibilité
        //   const raw = res.data.rawRatingReviews || [];
        //   setRatingsReviews(Array.isArray(raw) ? raw : []);
        //   localStorage.setItem("ratingsReviews", JSON.stringify(raw));
          
          console.log("💾 Données stockées dans localStorage");
          console.log("🎬 Movies:", res.data.movies);
          console.log("📺 Series:", res.data.series);
          console.log("👤 Personalities:", res.data.personalities);
        })
        .catch(err => {
          console.error("❌ Erreur lors de la récupération des reviews:", err);
        });
    }
  }, [token, user]);

  const refreshRatingsReviews = async () => {
    if (!token || !user?.id) return;
    const res = await connexion.get(`/userReviews/users/${user.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    console.log("🔄 Rafraîchissement des données:", res.data);
    
    const dataToStore = {
      movies: res.data.movies || [],
      series: res.data.series || [],
      personalities: res.data.personalities || [],
    };
    
    setRatingsReviewsData(dataToStore);
    localStorage.setItem("ratingsReviewsData", JSON.stringify(dataToStore));
    
    // const raw = res.data.rawRatingReviews || [];
    // setRatingsReviews(Array.isArray(raw) ? raw : []);
    // localStorage.setItem("ratingsReviews", JSON.stringify(raw));
  };

  const updateRatingReview = async (
    itemId,
    ratingReviewType,
    review,
    rating
  ) => {
    if (!token) return;
    await connexion.post(
      "/userReviews",
      {
        itemId,
        ratingReviewType,
        review,
        rating,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    await refreshRatingsReviews();
  };

  const ratesReviewsByType = splitRatingsReviewsByType(ratingsReviews);

  return (
    <RatingsReviewsContext.Provider
      value={{
        user,
        // ratingsReviews,
        ratingsReviewsData,
        splitRatingsReviewsByType,
        ratesReviewsByType,
        updateRatingReview,
        refreshRatingsReviews,
      }}
    >
      {children}
    </RatingsReviewsContext.Provider>
  );
}
