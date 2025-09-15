import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import connexion from "../../../../../../../services/connexion";
import { AuthContext } from "../../../../../../../services/Context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AdminSerieSeasonsEdit.css";

function AdminSerieSeasonsEdit({ serie, seasons = [], onSeasonsUpdate }) {
  const [localSeasons, setLocalSeasons] = useState(seasons);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [newSeason, setNewSeason] = useState({
    season_number: "",
    season_poster: "",
    first_episode_date: "",
    last_episode_date: "",
    nbEpisodesSeason: "",
    synopsis: "",
  });

  const { token } = useContext(AuthContext) || {};

  const [seasonPoster, setSeasonPoster] = useState({ url: "", file: null });

  const handleImageChange = (type, e) => {
    if (e.target.type === "file" && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSeasonPoster({ url: "", file });
    } else {
      const url = e.target.value;
      setSeasonPoster({ url, file: null });
    }
  };

  useEffect(() => {
    setLocalSeasons(seasons);
  }, [seasons]);

  const handleAddSeason = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("season_number", newSeason.season_number);
    formData.append("first_episode_date", newSeason.first_episode_date);
    formData.append("last_episode_date", newSeason.last_episode_date);
    formData.append("nbEpisodesSeason", newSeason.nbEpisodesSeason);
    formData.append("serie_id", serie.id);
    formData.append("synopsis", newSeason.synopsis);
    if (seasonPoster.file) formData.append("season_poster", seasonPoster.file);
    else if (seasonPoster.url)
      formData.append("season_poster", seasonPoster.url);

    try {
      const response = await connexion.post(`/seasons`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.data?.id?.success === false) {
        toast.error(
          response.data.id.message || "Erreur lors de la création de la saison"
        );
        setLoading(false);
        return;
      }
      const newSeasonId = response.data.id?.id || response.data.id;
      if (newSeasonId) {
        const seasonResponse = await connexion.get(`/seasons/${newSeasonId}`);
        const createdSeason = seasonResponse.data;
        setLocalSeasons((prev) => [...prev, createdSeason]);
        if (onSeasonsUpdate) onSeasonsUpdate([...localSeasons, createdSeason]);
        setNewSeason({
          season_number: "",
          season_poster: "",
          first_episode_date: "",
          last_episode_date: "",
          nbEpisodesSeason: "",
          synopsis: "",
        });
        toast.success(response.data.id.message || "Saison créée avec succès !");
      }
    } catch (err) {
      toast.error("Erreur lors de la création de la saison");
    }
    setLoading(false);
  };

  const handleEditSeason = async (seasonId, updatedFields) => {
    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      Object.entries(updatedFields).forEach(([key, value]) => {
        if (key === "season_poster" && value) {
          formData.append("season_poster", value);
        } else {
          formData.append(key, value);
        }
      });
      formData.append("id", seasonId);
      const response = await connexion.put(`/seasons/${seasonId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.data?.message) {
        toast.success(response.data.message);
      }
      const updatedSeason = response.data.updateSeason;
      setLocalSeasons((prev) =>
        prev.map((s) => (s.id === seasonId ? updatedSeason : s))
      );
      if (onSeasonsUpdate)
        onSeasonsUpdate(
          localSeasons.map((s) => (s.id === seasonId ? updatedSeason : s))
        );
    } catch (err) {
      toast.error("Erreur lors de la modification de la saison");
    }
    setLoading(false);
  };

  const handleDeleteSeason = async (seasonId) => {
    setLoading(true);
    setError("");
    try {
      await connexion.delete(`/seasons/${seasonId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLocalSeasons((prev) => prev.filter((s) => s.id !== seasonId));
      if (onSeasonsUpdate)
        onSeasonsUpdate(localSeasons.filter((s) => s.id !== seasonId));
      toast.success("Saison supprimée");
    } catch (err) {
      toast.error("Erreur lors de la suppression de la saison");
    }
    setLoading(false);
  };

  const handleSeasonFieldChange = (index, field, value) => {
    setLocalSeasons((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleNewSeasonFieldChange = (field, value) => {
    setNewSeason((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="adminSerieSeasonsEdit">
      <h3>Gestion des saisons</h3>
      {loading && <p>Chargement...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div className="adminSeasonsEditList">
        {localSeasons.length > 0 ? (
          localSeasons.map((season, idx) => (
            <div key={season.id || idx} className="seasonEditCard">
              <h4>Saison {season.season_number}</h4>
              {typeof season.season_poster === "object" &&
              season.season_poster ? (
                <img
                  src={URL.createObjectURL(season.season_poster)}
                  alt={`Saison ${season.season_number}`}
                />
              ) : season.season_poster ? (
                <img
                  src={
                    season.season_poster.startsWith("http")
                      ? season.season_poster
                      : `http://localhost:3994/src/assets/Series/Seasons/Posters/${season.season_poster}`
                  }
                  alt={`Saison ${season.season_number}`}
                />
              ) : (
                <span>Aucune affiche</span>
              )}
              <label>
                <h3>Numéro de saison</h3>
              <input
                type="number"
                value={season.season_number}
                onChange={(e) =>
                  handleSeasonFieldChange(idx, "season_number", e.target.value)
                }
                placeholder="Numéro de saison"
              />
              </label>
              <label>
                <h3>Date du premier épisode</h3>
              <input
                type="date"
                value={
                  season.first_episode_date
                    ? season.first_episode_date.slice(0, 10)
                    : ""
                }
                onChange={(e) =>
                  handleSeasonFieldChange(
                    idx,
                    "first_episode_date",
                    e.target.value
                  )
                }
                placeholder="Date de début"
              />
              </label>
              <label>
                <h3>Date du dernier épisode</h3>
              <input
                type="date"
                value={
                  season.last_episode_date
                    ? season.last_episode_date.slice(0, 10)
                    : ""
                }
                onChange={(e) =>
                  handleSeasonFieldChange(
                    idx,
                    "last_episode_date",
                    e.target.value
                  )
                }
                placeholder="Date de fin"
              />
              </label>
              <label>
                <h3>Nombre d'épisodes</h3>
              <input
                type="number"
                value={season.nbEpisodesSeason}
                onChange={(e) =>
                  handleSeasonFieldChange(
                    idx,
                    "nbEpisodesSeason",
                    e.target.value
                  )
                }
                placeholder="Nombre d'épisodes"
              />
              </label>
              <label>
                <h3>Poster (URL)</h3>
              <input
                type="text"
                value={
                  typeof season.season_poster === "string"
                    ? season.season_poster
                    : ""
                }
                onChange={(e) =>
                  handleSeasonFieldChange(idx, "season_poster", e.target.value)
                }
                placeholder="URL affiche saison"
              />
              </label>
              <label>
                <h3>Poster (Fichier)</h3>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleSeasonFieldChange(
                    idx,
                    "season_poster",
                    e.target.files[0]
                  )
                }
              />
              </label>
              <button
                type="button"
                onClick={() => handleEditSeason(season.id, localSeasons[idx])}
                disabled={loading}
              >
                Enregistrer
              </button>
              <button
                type="button"
                onClick={() => handleDeleteSeason(season.id)}
                disabled={loading}
              >
                Supprimer
              </button>
            </div>
          ))
        ) : (
          <p>Aucune saison trouvée.</p>
        )}
      </div>
      <div className="addSeasonForm">
        <h3>Ajouter une saison</h3>
        <div encType="multipart/form-data">
        <label>
          <h4>Numéro de saison</h4>
          <input
            type="number"
            value={newSeason.season_number}
            onChange={(e) =>
              handleNewSeasonFieldChange("season_number", e.target.value)
            }
            placeholder="Numéro de saison"
          />
          </label>
          <label>
          <h4>Date du premier épisode</h4>
          <input
            type="date"
            value={newSeason.first_episode_date}
            onChange={(e) =>
              handleNewSeasonFieldChange("first_episode_date", e.target.value)
            }
          />
          </label>
          <label>
          <h4>Date du dernier épisode</h4>
          <input
            type="date"
            value={newSeason.last_episode_date}
            onChange={(e) =>
              handleNewSeasonFieldChange("last_episode_date", e.target.value)
            }
            placeholder="Date de fin"
          />
          </label>
          <label>
          <h4>Nombre d'épisodes</h4>
          <input
            type="number"
            value={newSeason.nbEpisodesSeason}
            onChange={(e) =>
              handleNewSeasonFieldChange("nbEpisodesSeason", e.target.value)
            }
            placeholder="Nombre d'épisodes"
          />
          </label>
          <label>
          <h4>Poster (URL)</h4>
          <input
            type="text"
            name="seasonPosterUrl"
            value={seasonPoster.url}
            onChange={(e) => handleImageChange("season_poster", e)}
            placeholder="URL affiche saison"
          />
          </label>
          <label>
          <h4>Poster (Fichier)</h4>
          <input
            type="file"
            name="seasonPosterFile"
            accept="image/*"
            onChange={(e) => handleImageChange("season_poster", e)}
          />
          </label>
          <button type="button" disabled={loading} onClick={handleAddSeason}>
            Ajouter
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

AdminSerieSeasonsEdit.propTypes = {
  serie: PropTypes.object.isRequired,
  onSeasonsUpdate: PropTypes.func,
};

export default AdminSerieSeasonsEdit;
