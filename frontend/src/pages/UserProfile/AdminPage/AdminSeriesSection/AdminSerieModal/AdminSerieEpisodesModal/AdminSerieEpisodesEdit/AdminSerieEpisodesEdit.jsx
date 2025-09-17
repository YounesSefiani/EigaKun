import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import { AuthContext } from "../../../../../../../services/Context/AuthContext";
import connexion from "../../../../../../../services/connexion";
import "./AdminSerieEpisodesEdit.css";

function AdminSerieEpisodesEdit({ episode, onUpdate, onCancel, onDelete }) {
  const [episodeForm, setEpisodeForm] = useState({
    title: episode.title || "",
    episode_number: episode.episode_number || "",
    release_date: episode.release_date || "",
    synopsis: episode.synopsis || "",
    image: episode.image || "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState({ url: episode.image || "", file: null });
  const { token } = useContext(AuthContext);

  // Gestion du changement de champ
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEpisodeForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (type, e) => {
    if (e.target.type === "file" && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (type === "image")
      setImage({ url: "", file });
    } else {
      const url = e.target.value;
      if (type === "image")
      setImage({ url, file: null });
    }
  };

    const previewImage = (input, localPath) => {
    if (input.file) return URL.createObjectURL(input.file);
    if (input.url && input.url.startsWith("http")) return input.url;
    if (input.url)
      return `http://localhost:3994/src/assets/Series/Episodes/${localPath}/${input.url}`;
    return "";
  };


  // Gestion de l'enregistrement
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("episode_number", episodeForm.episode_number);
      formData.append("title", episodeForm.title);
      formData.append("release_date", episodeForm.release_date);
      formData.append("synopsis", episodeForm.synopsis);
      if (image.file) {
        formData.append("image", image.file);
      } else if (image.url) {
        formData.append("image", image.url);
      }

      const response = await connexion.put(`/episodes/${episode.id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setLoading(false);
      if (typeof onUpdate === "function") {
        onUpdate(response.data.updateEpisode || { ...episode, ...episodeForm, image: image.file ? image.file.name : image.url });
      }
    } catch (err) {
      setLoading(false);
      setError("Erreur lors de la modification de l'épisode");
    }
  };

  // Gestion de l'annulation
  const handleCancel = () => {
    if (typeof onCancel === "function") {
      onCancel();
    }
  };

  // Gestion de la suppression
  const handleDelete = async () => {
    setError("");
    setLoading(true);
    try {
      await connexion.delete(`/episodes/${episode.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLoading(false);
      if (typeof onDelete === "function") {
        onDelete(episode.id);
      }
    } catch (err) {
      setLoading(false);
      setError("Erreur lors de la suppression de l'épisode");
    }
  };

  return (
    <form className="adminSerieEpisodesEdit" onSubmit={handleSubmit}>
      <h2>Modifier l'épisode</h2>
      {error && <p className="error">{error}</p>}
      <div className="episodeEdit">
      <div className="episodeEditLeft">
        <div className="episodeImagePreview">
          <p>L'image de l'épisode</p>
          <img
            src={previewImage(image, "Images")}
            alt="Aperçu de l'épisode"
          />
          </div>
        <label>
          Image (URL)
          <input
            type="text"
            name="image"
            value={image.url}
            onChange={(e) => handleImageChange("image", e)}
          />
        </label>
        <label>
          Image (Fichier)
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={(e) => handleImageChange("image", e)}
          />
        </label>
      </div>
      <div className="episodeEditRight">
        <label>
          Numéro d'épisode
          <input
            type="number"
            name="episode_number"
            value={episodeForm.episode_number}
            onChange={handleChange}
            min={1}
          />
        </label>
        <label>
          Titre
          <input
            type="text"
            name="title"
            value={episodeForm.title}
            onChange={handleChange}
          />
        </label>
        <label>
          Date de diffusion
          <input
            type="date"
            name="release_date"
            value={
              episodeForm.release_date
                ? episodeForm.release_date.slice(0, 10)
                : ""
            }
            onChange={handleChange}
          />
        </label>
        <label>
          Synopsis
          <textarea
            name="synopsis"
            value={episodeForm.synopsis}
            onChange={handleChange}
          />
        </label>
      <div className="editButtons">
        <button type="submit" disabled={loading}>
          Enregistrer
        </button>
        <button type="button" onClick={handleCancel}>
          Annuler
        </button>
        <button
          type="button"
          onClick={handleDelete}
          className="deleteBtn"
          disabled={loading}
        >
          Supprimer
        </button>
      </div>
      </div>
      </div>
    </form>
  );
}

AdminSerieEpisodesEdit.propTypes = {
  episode: PropTypes.object.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
};

export default AdminSerieEpisodesEdit;
