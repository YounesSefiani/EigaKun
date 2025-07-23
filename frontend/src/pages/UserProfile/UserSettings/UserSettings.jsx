import React, { useContext, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import connexion from "../../../services/connexion";
import PropTypes from "prop-types";
import { AuthContext } from "../../../services/Context/AuthContext";
import "./UserSettings.css";

function ProfileSettings({ setView }) {
  const { user, token, updateUser } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    username: user.username || "",
    email: user.email || "",
    avatar: user.avatar || "",
    currentPassword: "",
    password: "",
  });

  const handleChange = (event) => {
    const { name, files, value } = event.target;

    if (name === "avatar" && files && files.length > 0) {
      setFormData({
        ...formData,
        [name]: files[0],
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);

   if (formData.password && !formData.currentPassword) {
  toast.error("Si vous voulez changer le mot de passe, veuillez taper le mot de passe actuel");
  setIsUpdating(false);
  setFormData((prev) => ({
    ...prev,
    password: "",
  }));
  return;
}

    const data = new FormData();
    if (formData.username !== user.username)
      data.append("username", formData.username);
    if (formData.email !== user.email) data.append("email", formData.email);
    if (formData.avatar !== user.avatar) data.append("avatar", formData.avatar);
    if (formData.password) {
      data.append("currentPassword", formData.currentPassword);
      data.append("password", formData.password);
    }

    try {
      const response = await connexion.put(`/users/${user.id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const newToken =
        response.headers.authorization ||
        response.headers.Authorization ||
        response.data.token ||
        token;
      const updatedUser = response.data.user || user;
      await updateUser(updatedUser, newToken);
      toast.success("Les informations ont été mises à jour avec succès.");
      setTimeout(() => setView("initial"), 5000);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Erreur lors de la mise à jour du profil.");
    } finally {
      setIsUpdating(false);
      setFormData({
        username: user.username || "",
        email: user.email || "",
        avatar: user.avatar || "",
        currentPassword: "",
        password: "",
      });
    }
  };

    if (!user || !token) {
      return null;
  }


  return (
    <div className="userSettings">
      <h3>Paramètres de mon compte</h3>
      <form onSubmit={handleSubmit}>
        <label>
          Pseudo
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            disabled={isUpdating}
          />
        </label>
        <label>
          Email
          <input
            type="email"
            name="email"
            value={formData.email}
            disabled={true}
          />
        </label>
        <label>
          Avatar
          <input
            type="file"
            accept="image/*"
            name="avatar"
            onChange={handleChange}
          />
        </label>
        <label>
          Mot de passe actuel:
          <input
            type={showPassword ? "text" : "password"}
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
          />
        </label>

        <label>
          Nouveau mot de passe:
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </label>

        <div className="settingsbtns">
          <button type="submit" disabled={isUpdating}>
            {isUpdating ? "Mise à jour..." : "Mettre à jour"}
          </button>
          <button type="button" onClick={() => setShowPassword(!showPassword)}>
            {showPassword
              ? "Masquer le mot de passe"
              : "Afficher le mot de passe"}
          </button>
          <button type="button" onClick={() => setView("initial")}>
            Retour
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
}

ProfileSettings.propTypes = {
  setView: PropTypes.func.isRequired,
};

export default ProfileSettings;
