import React, { useState, useContext } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import connexion from "../../../../../../../services/connexion";
import { AuthContext } from "../../../../../../../services/Context/AuthContext";
import "./AdminSerieEpisodeAdd.css";

function AdminSerieEpisodesAdd({ seasonId, serieId, onAdd }) {
  const initialEpisode = useState({
    title: "",
    episode_number: "",
    release_date: "",
    synopsis: "",
    image: "",
  });
  const [episode, setEpisode] = useState(initialEpisode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { token } = useContext(AuthContext);
  const [image, setImage] = useState({ url: episode.image || "", file: null });

  const handleImageChange = (type, e) => {
    if (e.target.type === "file" && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImage({ url: "", file });
    } else {
      const url = e.target.value;
      setImage({ url, file: null });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEpisode((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const previewImage = (input, localPath) => {
    if (input.file) return URL.createObjectURL(input.file);
    if (input.url && input.url.startsWith("http")) return input.url;
    if (input.url)
      return `http://localhost:3994/src/assets/Series/Episodes/${localPath}/${input.url}`;
    return "";
  };

  const handleEpisodeAdd = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const episodeFormData = new FormData();
      episodeFormData.append("title", episode.title);
      episodeFormData.append("episode_number", episode.episode_number);
      episodeFormData.append("release_date", episode.release_date);
      episodeFormData.append("synopsis", episode.synopsis);
      episodeFormData.append("serie_id", serieId);
      episodeFormData.append("season_id", seasonId);
      if (image.file) {
        episodeFormData.append("image", image.file);
      } else if (image.url) {
        episodeFormData.append("image", image.url);
      }
      const response = await connexion.post(`/episodes`, episodeFormData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setLoading(false);
      if (typeof onAdd === "function") {
        onAdd(response.data.episodeDatas);
      }
      setEpisode(initialEpisode);
      setImage({ url: "", file: null });
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Erreur lors de l'ajout de l'épisode"
      );
      setLoading(false);
    }
  };

  return (
    <form className="adminSerieEpisodesAdd" onSubmit={handleEpisodeAdd}>
      <h2>Ajouter un épisode</h2>
      <div className="addEpisodeContent">
        {error && <p className="error">{error}</p>}
        <div className="addEpisodeLeft">
          <div className="episodeImagePreview">
            <p>L'image de l'épisode</p>
            {previewImage(image, "Images") ? (
              <img
                src={previewImage(image, "Images")}
                alt="Aperçu de l'épisode"
              />
            ) : (
              <div className="episodeImageHolder">
                <FontAwesomeIcon icon={faImage} />
                <p>Aperçu de l'épisode</p>
              </div>
            )}
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
            Image (fichier)
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={(e) => handleImageChange("image", e)}
            />
          </label>
        </div>
        <div className="addEpisodeRight">
          <label>
            Numéro d'épisode
            <input
              type="number"
              name="episode_number"
              value={episode.episode_number}
              onChange={handleChange}
              min={1}
              required
            />
          </label>
          <label>
            Titre
            <input
              type="text"
              name="title"
              value={episode.title}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Date de diffusion
            <input
              type="date"
              name="release_date"
              value={episode.release_date}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Synopsis
            <textarea
              name="synopsis"
              value={episode.synopsis}
              onChange={handleChange}
            />
          </label>
        </div>
      </div>
      <div className="addEpisodeModalButtons">
        <button type="submit" disabled={loading}>
          Ajouter
        </button>
        <button
          type="button"
          onClick={() => {
            setEpisode(initialEpisode);
            setImage({ url: "", file: null });
          }}
        >
          Annuler
        </button>
      </div>
      <ToastContainer />
    </form>
  );
}

AdminSerieEpisodesAdd.propTypes = {
  serieId: PropTypes.number.isRequired,
  seasonId: PropTypes.number.isRequired,
  onAdd: PropTypes.func.isRequired,
};

export default AdminSerieEpisodesAdd;
