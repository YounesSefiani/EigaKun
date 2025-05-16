// AuthContext.jsx
import React, {
  createContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import PropTypes from "prop-types";
import connexion from "../services/connexion";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  // Initialize state for all user interactions
  const [userInteractions, setUserInteractions] = useState({
    likedMovies: [],
    favoriteMovies: [],
    seenMovies: [],
    toWatchMovies: [],
    likedSeries: [],
    favoriteSeries: [],
    seenSeries: [],
    toWatchSeries: [],
    isWatchingSeries: [],
    likedPersonalities: [],
    favoritePersonalities: [],
  });

  // Function to fetch all user interactions from the backend
  const fetchUserInteractions = useCallback(async (userId, authToken) => {
    if (!userId || !authToken) return;

    try {
      // Fetch all interactions in parallel for better performance
      const [
        likedMoviesRes,
        favoriteMoviesRes,
        seenMoviesRes,
        toWatchMoviesRes,
        likedSeriesRes,
        favoriteSeriesRes,
        seenSeriesRes,
        toWatchSeriesRes,
        isWatchingSeriesRes,
        likedPersonalitiesRes,
        favoritePersonalitiesRes,
      ] = await Promise.all([
        connexion.get(`/userLiked/${userId}/likedMovies`, {
          headers: { Authorization: `Bearer ${authToken}` },
        }),
        connexion.get(`/userFavorites/${userId}/favoritesMovies`, {
          headers: { Authorization: `Bearer ${authToken}` },
        }),
        connexion.get(`/userSeen/${userId}/seenMovies`, {
          headers: { Authorization: `Bearer ${authToken}` },
        }),
        connexion.get(`/userToWatch/${userId}/toWatchMovies`, {
          headers: { Authorization: `Bearer ${authToken}` },
        }),
        connexion
          .get(`/userLiked/${userId}/likedSeries`, {
            headers: { Authorization: `Bearer ${authToken}` },
          })
          .catch(() => ({ data: { likedSeries: [] } })),
        connexion
          .get(`/userFavorites/${userId}/favoritesSeries`, {
            headers: { Authorization: `Bearer ${authToken}` },
          })
          .catch(() => ({ data: { favoritesSeries: [] } })),
        connexion
          .get(`/userSeen/${userId}/seenSeries`, {
            headers: { Authorization: `Bearer ${authToken}` },
          })
          .catch(() => ({ data: { seenSeries: [] } })),
        connexion
          .get(`/userToWatch/${userId}/toWatchSeries`, {
            headers: { Authorization: `Bearer ${authToken}` },
          })
          .catch(() => ({ data: { toWatchSeries: [] } })),
        connexion
          .get(`/userIsWatchingSeries/${userId}/isWatchingSeries`, {
            headers: { Authorization: `Bearer ${authToken}` },
          })
          .catch(() => ({ data: { isWatchingSeries: [] } })),
        connexion
          .get(`/userLiked/${userId}/likedPersonalities`, {
            headers: { Authorization: `Bearer ${authToken}` },
          })
          .catch(() => ({ data: { likedPersonalities: [] } })),
        connexion
          .get(`/userFavorites/${userId}/favoritesPersonalities`, {
            headers: { Authorization: `Bearer ${authToken}` },
          })
          .catch(() => ({ data: { favoritesPersonalities: [] } })),
      ]);

      // Process response data based on your API structure
      const likedMoviesData = likedMoviesRes.data?.likedMovies || [];
      const favoriteMoviesData = favoriteMoviesRes.data?.favoritesMovies || [];
      const seenMoviesData = seenMoviesRes.data?.seenMovies || [];
      const toWatchMoviesData = toWatchMoviesRes.data?.toWatchMovies || [];
      const likedSeriesData = likedSeriesRes.data?.likedSeries || [];
      const favoriteSeriesData = favoriteSeriesRes.data?.favoritesSeries || [];
      const seenSeriesData = seenSeriesRes.data?.seenSeries || [];
      const toWatchSeriesData = toWatchSeriesRes.data?.toWatchSeries || [];
      const isWatchingSeriesData =
        isWatchingSeriesRes.data?.isWatchingSeries || [];
      const likedPersonalitiesData =
        likedPersonalitiesRes.data?.likedPersonalities || [];
      const favoritePersonalitiesData =
        favoritePersonalitiesRes.data?.favoritesPersonalities || [];

      // Update state with all interactions
      setUserInteractions({
        likedMovies: likedMoviesData,
        favoritesMovies: favoriteMoviesData,
        seenMovies: seenMoviesData,
        toWatchMovies: toWatchMoviesData,
        likedSeries: likedSeriesData,
        favoritesSeries: favoriteSeriesData,
        seenSeries: seenSeriesData,
        toWatchSeries: toWatchSeriesData,
        isWatchingSeries: isWatchingSeriesData,
        likedPersonalities: likedPersonalitiesData,
        favoritesPersonalities: favoritePersonalitiesData,
      });
    } catch (error) {
      console.error("Error fetching user interactions:", error);
    }
  }, []);

  // Check for existing token and user data on app load
  useEffect(() => {
    const savedToken = localStorage.getItem("authToken");
    const savedUserId = localStorage.getItem("userId");

    if (savedToken) {
      try {
        // Decode the JWT token to get user data
        const decodedToken = JSON.parse(atob(savedToken.split(".")[1]));

        // Check if token is expired
        if (decodedToken.exp * 1000 < Date.now()) {
          logout(); // Token expired, log out
        } else {
          // Valid token, restore user session
          setUser({
            id: decodedToken.sub || savedUserId,
            mail: decodedToken.mail,
            pseudo: decodedToken.pseudo,
            avatar: decodedToken.avatar,
            role: decodedToken.role,
            isVerified: decodedToken.isVerified,
          });
          setToken(savedToken);

          // Fetch user interactions with the valid token
          fetchUserInteractions(decodedToken.sub || savedUserId, savedToken);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        localStorage.removeItem("authToken");
      }
    }
    setLoading(false);
  }, [fetchUserInteractions]);

  // Generic function to handle movie interactions (like, favorite, seen, to watch)
  const updateMovieInteraction = useCallback(
    async (type, movieId, action = "toggle") => {
      if (!user || !token) {
        console.error("User not logged in");
        return false;
      }

      // Maps interaction types to their state keys and API endpoints
      const interactionMap = {
        like: { stateKey: "likedMovies", endpoint: "userLikedMovies" },
        favorite: {
          stateKey: "favoritesMovies",
          endpoint: "userFavoritesMovies",
        },
        seen: { stateKey: "seenMovies", endpoint: "userSeenMovies" },
        toWatch: { stateKey: "toWatchMovies", endpoint: "userToWatchMovies" },
      };

      const { stateKey, endpoint } = interactionMap[type];

      try {
        const isAlreadyInteracted = userInteractions[stateKey].some(
          (movie) =>
            movie.id === Number(movieId) || movie.movie_id === Number(movieId),
        );

        // If action is "toggle", we'll check the current state
        // Otherwise, use the explicit action ("add" or "remove")
        const shouldRemove =
          action === "toggle" ? isAlreadyInteracted : action === "remove";

        if (shouldRemove) {
          // Remove interaction
          await connexion.delete(`/${endpoint}/${user.id}/${movieId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          // Update local state
          setUserInteractions((prev) => ({
            ...prev,
            [stateKey]: prev[stateKey].filter(
              (movie) =>
                movie.id !== Number(movieId) &&
                movie.movie_id !== Number(movieId),
            ),
          }));
        } else {
          // Add interaction
          await connexion.post(
            `/${endpoint}/${user.id}/${movieId}`,
            {},
            { headers: { Authorization: `Bearer ${token}` } },
          );

          // Fetch movie data to add to state
          try {
            const movieData = await connexion.get(`/movies/${movieId}`);
            setUserInteractions((prev) => ({
              ...prev,
              [stateKey]: [
                ...prev[stateKey],
                {
                  id: Number(movieId),
                  movie_id: Number(movieId),
                  ...movieData.data,
                },
              ],
            }));
          } catch (fetchError) {
            // If we can't fetch movie details, at least update the interaction
            setUserInteractions((prev) => ({
              ...prev,
              [stateKey]: [
                ...prev[stateKey],
                { id: Number(movieId), movie_id: Number(movieId) },
              ],
            }));
          }
        }
        return true;
      } catch (error) {
        console.error(`Error updating ${type} interaction:`, error);
        return false;
      }
    },
    [user, token, userInteractions],
  );

  // Generic function to handle series interactions
  const updateSeriesInteraction = useCallback(
    async (type, serieId, action = "toggle") => {
      if (!user || !token) {
        console.error("User not logged in");
        return false;
      }

      const interactionMap = {
        like: { stateKey: "likedSeries", endpoint: "userLikedSeries" },
        favorite: {
          stateKey: "favoritesSeries",
          endpoint: "userFavoritesSeries",
        },
        seen: { stateKey: "seenSeries", endpoint: "userSeenSeries" },
        toWatch: { stateKey: "toWatchSeries", endpoint: "userToWatchSeries" },
        isWatching: {
          stateKey: "isWatchingSeries",
          endpoint: "userIsWatchingSeries",
        },
      };

      const { stateKey, endpoint } = interactionMap[type];

      try {
        const isAlreadyInteracted = userInteractions[stateKey].some(
          (series) =>
            series.id === Number(serieId) ||
            series.serie_id === Number(serieId),
        );

        const shouldRemove =
          action === "toggle" ? isAlreadyInteracted : action === "remove";

        if (shouldRemove) {
          await connexion.delete(`/${endpoint}/${user.id}/${serieId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          setUserInteractions((prev) => ({
            ...prev,
            [stateKey]: prev[stateKey].filter(
              (series) =>
                series.id !== Number(serieId) &&
                series.serie_id !== Number(serieId),
            ),
          }));
        } else {
          await connexion.post(
            `/${endpoint}/${user.id}/${serieId}`,
            {},
            { headers: { Authorization: `Bearer ${token}` } },
          );

          try {
            const seriesData = await connexion.get(`/series/${serieId}`);
            setUserInteractions((prev) => ({
              ...prev,
              [stateKey]: [
                ...prev[stateKey],
                {
                  id: Number(serieId),
                  serie_id: Number(serieId),
                  ...seriesData.data,
                },
              ],
            }));
          } catch (fetchError) {
            setUserInteractions((prev) => ({
              ...prev,
              [stateKey]: [
                ...prev[stateKey],
                { id: Number(serieId), serie_id: Number(serieId) },
              ],
            }));
          }
        }
        return true;
      } catch (error) {
        console.error(`Error updating ${type} interaction for series:`, error);
        return false;
      }
    },
    [user, token, userInteractions],
  );

  // Generic function to handle personality interactions
  const updatePersonalityInteraction = useCallback(
    async (type, personalityId, action = "toggle") => {
      if (!user || !token) {
        console.error("User not logged in");
        return false;
      }

      const interactionMap = {
        like: {
          stateKey: "likedPersonalities",
          endpoint: "userLikedPersonalities",
        },
        favorite: {
          stateKey: "favoritesPersonalities",
          endpoint: "userFavoritesPersonalities",
        },
      };

      const { stateKey, endpoint } = interactionMap[type];

      try {
        const isAlreadyInteracted = userInteractions[stateKey].some(
          (personality) =>
            personality.id === Number(personalityId) ||
            personality.personality_id === Number(personalityId),
        );

        const shouldRemove =
          action === "toggle" ? isAlreadyInteracted : action === "remove";

        if (shouldRemove) {
          await connexion.delete(`/${endpoint}/${user.id}/${personalityId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          setUserInteractions((prev) => ({
            ...prev,
            [stateKey]: prev[stateKey].filter(
              (personality) =>
                personality.id !== Number(personalityId) &&
                personality.personality_id !== Number(personalityId),
            ),
          }));
        } else {
          await connexion.post(
            `/${endpoint}/${user.id}/${personalityId}`,
            {},
            { headers: { Authorization: `Bearer ${token}` } },
          );

          try {
            const personalityData = await connexion.get(
              `/personalities/${personalityId}`,
            );
            setUserInteractions((prev) => ({
              ...prev,
              [stateKey]: [
                ...prev[stateKey],
                {
                  id: Number(personalityId),
                  personality_id: Number(personalityId),
                  ...personalityData.data,
                },
              ],
            }));
          } catch (fetchError) {
            setUserInteractions((prev) => ({
              ...prev,
              [stateKey]: [
                ...prev[stateKey],
                {
                  id: Number(personalityId),
                  personality_id: Number(personalityId),
                },
              ],
            }));
          }
        }
        return true;
      } catch (error) {
        console.error(
          `Error updating ${type} interaction for personality:`,
          error,
        );
        return false;
      }
    },
    [user, token, userInteractions],
  );

  // Create specific functions for each interaction type
  const likeMovie = useCallback(
    (movieId) => updateMovieInteraction("like", movieId),
    [updateMovieInteraction],
  );

  const favoriteMovie = useCallback(
    (movieId) => updateMovieInteraction("favorite", movieId),
    [updateMovieInteraction],
  );

  const watchedMovie = useCallback(
    (movieId) => updateMovieInteraction("seen", movieId),
    [updateMovieInteraction],
  );

  const toWatchMovie = useCallback(
    (movieId) => updateMovieInteraction("toWatch", movieId),
    [updateMovieInteraction],
  );

  const likeSeries = useCallback(
    (serieId) => updateSeriesInteraction("like", serieId),
    [updateSeriesInteraction],
  );

  const favoriteSerie = useCallback(
    (serieId) => updateSeriesInteraction("favorite", serieId),
    [updateSeriesInteraction],
  );

  const watchedSerie = useCallback(
    (serieId) => updateSeriesInteraction("seen", serieId),
    [updateSeriesInteraction],
  );

  const toWatchSerie = useCallback(
    (serieId) => updateSeriesInteraction("toWatch", serieId),
    [updateSeriesInteraction],
  );

  const isWatchingSerie = useCallback(
    (serieId) => updateSeriesInteraction("isWatching", serieId),
    [updateSeriesInteraction],
  );

  const likePersonality = useCallback(
    (personalityId) => updatePersonalityInteraction("like", personalityId),
    [updatePersonalityInteraction],
  );

  const favoritePersonality = useCallback(
    (personalityId) => updatePersonalityInteraction("favorite", personalityId),
    [updatePersonalityInteraction],
  );

  // Check if an item is in a specific interaction list
  const isInList = useCallback(
    (type, itemId) => {
      // Map the type to the appropriate state key
      let stateKey = null;

      if (type.includes("Movie")) {
        stateKey = type;
      } else if (type.includes("Series")) {
        stateKey = type;
      } else if (type.includes("Personalities")) {
        stateKey = type;
      }

      // If no valid state key was found or the interaction list doesn't exist
      if (!stateKey || !userInteractions[stateKey]) {
        return false;
      }

      // Check if the item exists in the interaction list
      return userInteractions[stateKey].some(
        (item) =>
          item.id === Number(itemId) ||
          item.movie_id === Number(itemId) ||
          item.serie_id === Number(itemId) ||
          item.personality_id === Number(itemId),
      );
    },
    [userInteractions],
  );

  // Login function
  const login = useCallback(
    (userData, tokenData) => {
      setUser({ ...userData, isVerified: userData.isVerified });
      setToken(tokenData);
      localStorage.setItem("authToken", tokenData);
      localStorage.setItem("userId", userData.id);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("avatar", userData.avatar);

      // Fetch user interactions after login
      fetchUserInteractions(userData.id, tokenData);
    },
    [fetchUserInteractions],
  );

  // Update user function
  const updateUser = useCallback((updatedUser, newToken) => {
    setUser(updatedUser);
    if (newToken) setToken(newToken);

    try {
      if (newToken) localStorage.setItem("authToken", newToken);
      localStorage.setItem("userId", updatedUser.id);
      localStorage.setItem("avatar", updatedUser.avatar);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (error) {
      console.error("Error updating localStorage:", error);
    }
  }, []);

  // Logout function
  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setUserInteractions({
      likedMovies: [],
      favoriteMovies: [],
      seenMovies: [],
      toWatchMovies: [],
      likedSeries: [],
      favoriteSeries: [],
      seenSeries: [],
      toWatchSeries: [],
      isWatchingSeries: [],
      likedPersonalities: [],
      favoritePersonalities: [],
    });
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("user");
    localStorage.removeItem("avatar");
    window.location.href = "/";
  }, []);

  // Token validation function
  const validateToken = useCallback(async () => {
    try {
      const savedToken = localStorage.getItem("authToken");
      const savedUserId = localStorage.getItem("userId");

      if (savedToken && savedUserId) {
        const response = await connexion.get(`/users/${savedUserId}`, {
          headers: {
            Authorization: `Bearer ${savedToken}`,
          },
        });

        if (response.status === 200) {
          login(response.data, savedToken);
          return true;
        }
        logout();
        return false;
      }
      console.error("Token or userId not found in localStorage");
      return false;
    } catch (error) {
      console.error("Error validating token:", error);
      logout();
      return false;
    }
  }, [login, logout]);

  // Create context value with memoization to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      user,
      token,
      login,
      updateUser,
      logout,
      loading,
      validateToken,
      msg,
      setMsg,
      userInteractions,
      // Movie interactions
      likeMovie,
      favoriteMovie,
      watchedMovie,
      toWatchMovie,
      // Series interactions
      likeSeries,
      favoriteSerie,
      watchedSerie,
      toWatchSerie,
      isWatchingSerie,
      // Personality interactions
      likePersonality,
      favoritePersonality,
      // Helper functions
      isInList,
      fetchUserInteractions,
    }),
    [
      user,
      token,
      login,
      updateUser,
      logout,
      loading,
      validateToken,
      msg,
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
      fetchUserInteractions,
    ],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;
