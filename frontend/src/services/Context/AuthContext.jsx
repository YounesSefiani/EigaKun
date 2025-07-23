import React, {
  createContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import PropTypes from "prop-types";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);

  const login = useCallback((userData, tokenData) => {
    setUser(userData);
    setToken(tokenData);
    setSessionExpired(false);
    localStorage.setItem("authToken", tokenData);
    localStorage.setItem("userId", userData.id);
    localStorage.setItem("user", JSON.stringify(userData));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.clear();
  }, []);

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

  // NE PAS déconnecter ici, juste signaler l'expiration
  const handleTokenExpired = useCallback(() => {
    setSessionExpired(true);
    setUser(null);
    setToken(null);
    localStorage.clear();

    setTimeout(() => {
      logout();
    }, 5000);
  }, [setSessionExpired, logout]);

  const handleAuthError = useCallback(
    (error) => {
      if (
        error?.response &&
        (error.response.status === 401 || error.response.status === 403)
      ) {
        handleTokenExpired();
      }
      return false;
    },
    [handleTokenExpired]
  );

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("authToken");
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
    setIsLoading(false);
  }, []);

  const contextValue = useMemo(
    () => ({
      user,
      token,
      isLoading,
      login,
      logout,
      updateUser,
      handleAuthError,
      sessionExpired,
      setSessionExpired,
      handleTokenExpired,
    }),
    [
      user,
      token,
      isLoading,
      login,
      logout,
      updateUser,
      handleAuthError,
      sessionExpired,
      handleTokenExpired,
    ]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;
