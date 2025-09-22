import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../../../../services/Context/AuthContext";
import connexion from "../../../../../services/connexion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImagePortrait } from "@fortawesome/free-solid-svg-icons";
import "./AdminAddPersonality.css";

function AdminAddPersonality({ onClose, onPersonalityAdded }) {
  const { token } = useContext(AuthContext);

  const initialPersonality = {
    fullname: "",
    image_src: "",
    birthdate: "",
    deathdate: "",
    origin: "",
    profession: "",
    bio: "",
  };

  const [personality, setPersonality] = useState(initialPersonality);
  const [imageInput, setImageInput] = useState({ url: "", file: null });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const previewImage = (input, localPath) => {
    if (input.file) return URL.createObjectURL(input.file);
    if (input.url && input.url.startsWith("http")) return input.url;
    if (input.url)
      return `http://localhost:3994/src/assets/Personalities/${localPath}/${input.url}`;
    return "";
  };

  const handlePersonalityChange = (e) => {
    const { name, value } = e.target;
    setPersonality((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.type === "file" && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImageInput({ url: "", file });
    } else {
      const url = e.target.value;
      setImageInput({ url, file: null });
    }
  };

  const handlePersonalityAdd = async (event) => {
    event.preventDefault();
    setLoading(true);

    const personalityFormData = new FormData();
    personalityFormData.append("fullname", personality.fullname);
    personalityFormData.append("birthdate", personality.birthdate);
    if (personality.deathdate) {
      personalityFormData.append("deathdate", personality.deathdate);
    }
    personalityFormData.append("origin", personality.origin);
    personalityFormData.append("profession", personality.profession);
    personalityFormData.append("bio", personality.bio);
    if (imageInput.file) {
      personalityFormData.append("image_src", imageInput.file);
    } else if (imageInput.url) {
      personalityFormData.append("image_src", imageInput.url);
    }

    try {
      const response = await connexion.post(
        "/personalities",
        personalityFormData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data?.message) {
        toast.success(response.data.message);
      }
      setPersonality(initialPersonality);
      setImageInput({ url: "", file: null });
      if (onPersonalityAdded && response.data)
        onPersonalityAdded(response.data);
      if (onClose) onClose();
    } catch (error) {
      toast.error(
        "Une erreur s'est produite lors de l'ajout de la personnalité."
      );
      console.error("Error adding personality:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="adminAddPersonalityOverlay"></div>
      <div className="adminAddPersonalityModal">
        <form
          className="adminAddPersonalityForm"
          onSubmit={handlePersonalityAdd}
        >
          <div className="adminAddPersonalityTopInterface">
            <h2>Ajouter une personnalité</h2>
            <div className="addPersonalityButtons">
              <button type="submit" disabled={loading}>
                {loading ? "Ajout en cours..." : "Ajouter"}
              </button>
              <button type="button" onClick={onClose} disabled={loading}>
                Annuler
              </button>
            </div>
          </div>
          <div className="adminAddPersonalityTop">
            <label>
              <p>
                <strong>Nom complet</strong>
              </p>
              <input
                type="text"
                name="fullname"
                value={personality.fullname}
                placeHolder="Nom de la personnalité"
                required
                onChange={handlePersonalityChange}
              />
            </label>
          </div>
          <div className="adminAddPersonalityContent">
            <div className="adminAddPersonalityLeft">
              <label>
                <p>
                  <strong>Photo</strong>
                </p>
                {imageInput.file || imageInput.url ? (
                  <img
                    src={previewImage(imageInput, "Images")}
                    alt="Preview"
                    className="personalityImageAdd"
                  />
                ) : (
                  <div className="personalityImageAddPlaceHolder">
                    <FontAwesomeIcon icon={faImagePortrait} />
                    Aperçu de l'image
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <input
                  type="text"
                  placeholder="URL de l'image"
                  value={imageInput.url}
                  onChange={handleImageChange}
                />
              </label>
            </div>
            <div className="adminAddPersonalityRight">
              <div className="adminAddPersonalityInfos">
                <label>
                  <p>
                    <strong>Date de naissance</strong>
                  </p>
                  <input
                    type="date"
                    name="birthdate"
                    value={personality.birthdate}
                    onChange={handlePersonalityChange}
                    required
                  />
                </label>
                <label>
                  <p>
                    <strong>Date de décès</strong>
                  </p>
                  <input
                    type="date"
                    name="deathdate"
                    value={personality.deathdate}
                    onChange={handlePersonalityChange}
                  />
                </label>
                <label>
                  <p>
                    <strong>Origine(s)</strong>
                  </p>
                  <input
                    type="text"
                    name="origin"
                    value={personality.origin}
                    onChange={handlePersonalityChange}
                    placeholder="Origine(s) de la personnalité"
                    required
                  />
                </label>
                <label>
                  <p>
                    <strong>Profession(s)</strong>
                  </p>
                  <input
                    type="text"
                    name="profession"
                    value={personality.profession}
                    onChange={handlePersonalityChange}
                    placeholder="Profession(s) de la personnalité"
                    required
                  />
                </label>
              </div>
              <div className="adminAddPersonalityBio">
                <label>
                  <p>
                    <strong>Biographie</strong>
                  </p>
                  <textarea
                    name="bio"
                    value={personality.bio}
                    onChange={handlePersonalityChange}
                    placeholder="Biographie de la personnalité"
                  />
                </label>
              </div>
            </div>
          </div>
        </form>
      </div>
      <ToastContainer />
    </>
  );
}

export default AdminAddPersonality;
