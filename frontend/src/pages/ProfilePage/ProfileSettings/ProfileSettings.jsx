import React, { useContext, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import PropTypes from "prop-types";
import { AuthContext } from "../../../context/AuthContext";
import "./ProfileSettings.css";

function ProfileSettings({ setView }) {
  const { user, token, updateUser } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updated, setUpdated] = useState(false);
  const [formData, setFormData] = useState({
    pseudo: user.pseudo || "",
    mail: user.mail || "",
    avatar: user.avatar || "",
    currentPassword: "",
    password: "",
  });

  // const handleChange = (e) => {
  //   setFormData({
  //     ...formData,
  //     [e.target.name]: e.target.value,
  //   });
  // };

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

  useEffect(() => {
    if (updated) {
      setView("initial");
    }
  }, [updated]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);

    const data = new FormData();
    if (formData.pseudo !== user.pseudo) data.append("pseudo", formData.pseudo);
    if (formData.mail !== user.mail) data.append("mail", formData.mail);
    if (formData.avatar !== user.avatar) data.append("avatar", formData.avatar);
    if (formData.password) {
      data.append("currentPassword", formData.currentPassword);
      data.append("password", formData.password);
    }

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/${user.id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      const newToken =
        response.headers.authorization ||
        response.headers.Authorization ||
        response.data.token ||
        token;
      const updatedUser = response.data.user || user;
      await updateUser(updatedUser, newToken);
      toast.success("Les informations ont été mises à jour avec succès.");
      setTimeout(() => setView("initial"), 5000);
      setUpdated(true);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Erreur lors de la mise à jour du profil.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="profileSettings">
      <h3>Paramètres de mon compte</h3>
      <form onSubmit={handleSubmit} className="profileEdit">
        <label>
          Pseudo
          <input
            type="text"
            name="pseudo"
            value={formData.pseudo}
            onChange={handleChange}
            disabled={isUpdating}
          />
        </label>
        <label>
          Email
          <input
            type="email"
            name="mail"
            value={formData.mail}
            onChange={handleChange}
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
