import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleLeft } from "@fortawesome/free-solid-svg-icons";
import connexion from "../../../services/connexion";
import "react-toastify/dist/ReactToastify.css";
import "./Inscription.css";

function Inscription({ setView }) {
  const [user, setUser] = useState({
    pseudo: "",
    mail: "",
    birthdate: "",
    avatar: "",
    password: "",
    passwordConfirmation: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const navigate = useNavigate();

  const handleUser = (event) => {
    const { name, files, value } = event.target;

    if (name === "avatar" && files && files.length > 0) {
      setUser((prevState) => ({
        ...prevState,
        [name]: files[0],
      }));
    } else {
      setUser((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const postUser = async (event) => {
    event.preventDefault();

    const form = new FormData();
    form.append("pseudo", user.pseudo);
    form.append("mail", user.mail);
    form.append("birthdate", user.birthdate);
    form.append("avatar", user.avatar);
    form.append("password", user.password);
    form.append("passwordConfirmation", user.passwordConfirmation);

    let hasErrors = false;

    if (user.password !== user.passwordConfirmation) {
      toast.error("Les mots de passe ne correspondent pas !", {
        position: "top-right",
      });
      hasErrors = true;
    }

    if (user.password.length < 8) {
      toast.error("Le mot de passe doit faire 8 caractères minimum !", {
        position: "top-right",
      });
      hasErrors = true;
    }

    const currentDate = new Date();
    const sixTeen = new Date(
      currentDate.getFullYear() - 18,
      currentDate.getMonth(),
      currentDate.getDate(),
    );

    const userBirthdate = new Date(user.birthdate);

    if (userBirthdate > sixTeen) {
      toast.error("Vous devez avoir 16 ans ou plus pour vous inscrire !", {
        position: "top-right",
      });
      hasErrors = true;
    }

    if (hasErrors) {
      return;
    }

    try {
      await connexion.post("/users", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success(
        "Un e-mail de validation a été envoyé. Veuillez vérifier votre boîte de réception.",
      );
      setTimeout(() => {
        navigate("/");
      }, 4000);
    } catch (error) {
      console.error("Erreur lors de l'envoi de la requête :", error);
      toast.error("Erreur lors de l'envoi de la requête.");
    }
  };

  return (
    <div className="inscription">
      <form onSubmit={postUser} className="inscriptionForm">
        <label className="inscriptionLabel" aria-label="pseudo">
          <input
            className="inscriptionInput"
            type="text"
            name="pseudo"
            placeholder="Pseudo"
            required
            value={user.pseudo}
            onChange={handleUser}
          />
        </label>
        <label className="inscriptionLabel" aria-label="email">
          <input
            className="inscriptionInput"
            type="email"
            name="mail"
            placeholder="Adresse Mail"
            required
            value={user.mail}
            onChange={handleUser}
          />
        </label>
        <label className="inscriptionLabel" aria-label="birthdate">
          <input
            className="inscriptionInput"
            type="date"
            name="birthdate"
            required
            value={user.birthdate}
            onChange={handleUser}
          />
        </label>
        <label className="inscriptionLabel" htmlFor="avatar">
          Avatar
          <input
            className="inscriptionInput"
            type="file"
            accept="image/*"
            name="avatar"
            id="avatar"
            onChange={handleUser}
          />
        </label>
        <label className="inscriptionLabel" aria-label="password">
          <input
            className="inscriptionInput"
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Mot de passe"
            required
            value={user.password}
            onChange={handleUser}
          />
        </label>
        <label className="inscriptionLabel" aria-label="passwordConfirmation">
          <input
            className="inscriptionInput"
            type={showPassword ? "text" : "password"}
            name="passwordConfirmation"
            placeholder="Confirmation du mot de passe"
            required
            value={user.passwordConfirmation}
            onChange={handleUser}
          />
        </label>
        <button
          type="button"
          className={`passwordButton ${showPassword ? "active" : ""}`}
          onClick={handleTogglePassword}
        >
          <span className={showPassword ? "hideText" : "showText"}>
            {showPassword
              ? "Masquer le mot de passe"
              : "Afficher le mot de passe"}
          </span>
        </button>
        <button type="submit" className="inscriptionButton">
          Inscription
        </button>
      </form>
      <button
        type="button"
        className="inscriptionBackButton"
        onClick={() => {
          // Réinitialise le formulaire
          setUser({
            pseudo: "",
            mail: "",
            birthdate: "",
            avatar: "",
            password: "",
            passwordConfirmation: "",
          });
          setView("initial");
        }}
      >
        <FontAwesomeIcon icon={faCircleLeft} />
      </button>

      <ToastContainer />
    </div>
  );
}

Inscription.propTypes = {
  setView: PropTypes.func.isRequired,
};

export default Inscription;
