import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import connexion from "../../../../../../services/connexion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faImage,
  faPanorama,
  faCopyright,
  faFilm,
} from "@fortawesome/free-solid-svg-icons";
import "./AdminSerieEditForm.css";
import { AuthContext } from "../../../../../../services/Context/AuthContext";
import AdminSerieSeasonsEdit from "../AdminSerieSeasons/AdminSerieSeasonsEdit/AdminSerieSeasonsEdit";

function AdminSerieEditForm({ serie, seasons, onUpdate, onCancel, onDelete }) {
  const [serieForm, setSerieForm] = useState({
    title: serie.title || "",
    release_date: serie.release_date || "",
    ending_date: serie.ending_date || "",
    screen: serie.screen || "",
    statut: serie.statut || "",
    country: serie.country || "",
    streaming: serie.streaming || "",
    original: serie.original || "",
    genre: serie.genre || "",
    theme: serie.theme || "",
    universe: serie.universe || "",
    subUniverse: serie.subUniverse || "",
    synopsis: serie.synopsis || "",
    trailer: serie.trailer || "",
    nbSeasons: serie.nbSeasons || "",
    nbEpisodesSerie: serie.nbEpisodesSerie || "",
    casting: serie.casting || [],
  });

  const { token } = useContext(AuthContext);

  const [posterInput, setPosterInput] = useState({
    url: serie.poster || "",
    file: null,
  });

  const [backgroundInput, setBackgroundInput] = useState({
    url: serie.background || "",
    file: null,
  });

  const [logoInput, setLogoInput] = useState({
    url: serie.logo || "",
    file: null,
  });

  const handleSerieChange = (e) => {
    setSerieForm({
      ...serieForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (type, e) => {
    if (e.target.type === "file" && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (type === "poster") setPosterInput({ url: "", file });
      if (type === "background") setBackgroundInput({ url: "", file });
      if (type === "logo") setLogoInput({ url: "", file });
    } else {
      const url = e.target.value;
      if (type === "poster") setPosterInput({ url, file: null });
      if (type === "background") setBackgroundInput({ url, file: null });
      if (type === "logo") setLogoInput({ url, file: null });
    }
  };

  const handleSerieSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(serieForm).forEach(([key, value]) => {
      if (key === "casting") data.append("casting", JSON.stringify(value));
      else data.append(key, value ?? "");
    });
    if (posterInput.file) data.append("poster", posterInput.file);
    else if (posterInput.url) data.append("poster", posterInput.url);
    if (backgroundInput.file) data.append("background", backgroundInput.file);
    else if (backgroundInput.url)
      data.append("background", backgroundInput.url);
    if (logoInput.file) data.append("logo", logoInput.file);
    else if (logoInput.url) data.append("logo", logoInput.url);
    onUpdate(data);
    try {
      const response = await connexion.put(`/series/${serie.id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      if (typeof onUpdate === "function") onUpdate(response.data.updateSerie);
    } catch (err) {
      console.error(err);
      toast.error("Une erreur s'est produite lors de la mise à jour.");
    }
  };

  const previewImage = (input, localPath) => {
    if (input.file) return URL.createObjectURL(input.file);
    if (input.url && input.url.startsWith("http")) return input.url;
    if (input.url)
      return `http://localhost:3994/src/assets/Series/${localPath}/${input.url}`;
    return "";
  };

  const casting = serieForm.casting || [];
  const directing = casting.filter((cast) => cast.side === "Directing");
  const acting = casting.filter((cast) => cast.side === "Acting");

  // Champs pour ajout membre
  const [personalities, setPersonalities] = useState([]);
  const [selectedPersonality, setSelectedPersonality] = useState("");
  const [role, setRole] = useState("");
  const [side, setSide] = useState("");
  const [presence, setPresence] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const handleCastingChange = async (castingId, changes) => {
    setSerieForm((prevForm) => ({
      ...prevForm,
      casting: prevForm.casting.map((cast) =>
        cast.id === castingId ? { ...cast, ...changes } : cast
      ),
    }));
    try {
      await connexion.put(`/serieCasting/${castingId}`, changes, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      setError("Erreur lors de la modification du rôle");
    }
  };

  const handleAddMember = async () => {
    setError("");
    if (!selectedPersonality || !role || !side || !presence) {
      setError("Veuillez remplir tous les champs du membre à ajouter.");
      return;
    }
    try {
      const personality = personalities.find(
        (p) => p.id === parseInt(selectedPersonality, 10)
      );
      const response = await connexion.post(
        "/serieCasting",
        {
          serie_id: serie.id,
          personality_id: personality.id,
          role,
          side,
          presence,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Ajout local dans le state pour affichage immédiat
      setSerieForm((prevForm) => ({
        ...prevForm,
        casting: [
          ...prevForm.casting,
          {
            id: response.data.id || Date.now(),
            personality_id: personality.id,
            personality_fullname: personality.fullname,
            personality_image: personality.image_src,
            role,
            side,
            presence,
            serie_id: serie.id,
          },
        ],
      }));
      setRole("");
      setSide("");
      setPresence("");
      setSelectedPersonality("");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Erreur lors de l'ajout du membre au casting"
      );
    }
  };

  // Suppression d'un membre du casting
  const handleRemoveCasting = async (castingId) => {
    try {
      await connexion.delete(`/serieCasting/${castingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSerieForm((prevForm) => ({
        ...prevForm,
        casting: prevForm.casting.filter((cast) => cast.id !== castingId),
      }));
    } catch (err) {
      setError("Erreur lors de la suppression du membre du casting");
    }
  };

  useEffect(() => {
    const fetchPersonalities = async () => {
      try {
        const response = await connexion.get("/personalities");
        setPersonalities(response.data);
      } catch (err) {
        setError("Erreur lors du chargement des personnalités");
      } finally {
        setLoading(false);
      }
    };
    fetchPersonalities();
  }, []);

  const handleDeleteSerie = () => {
    if (window.confirm("Supprimer cette série ?")) {
      if (onDelete) onDelete();
    }
  };

  return (
    <form
      className="editSerieForm"
      onSubmit={handleSerieSubmit}
      encType="multipart/form-data"
    >
      <div className="editSerieFormTop">
        <label>
          <h3>Titre de la série</h3>
          <input
            type="text"
            name="title"
            value={serieForm.title}
            onChange={handleSerieChange}
          />
        </label>
        <div>
          <button type="submit">Enregistrer</button>
          <button type="button" onClick={handleDeleteSerie}>
            Supprimer le film
          </button>
          <button type="button" onClick={onCancel}>
            Annuler
          </button>
        </div>
      </div>
      <div className="editSerieFormContent">
        <div className="editSerieFormLeft">
          <div>
            <p>Affiche de la série</p>
            {serie.poster ? (
              <img
                src={previewImage(posterInput, "Posters")}
                alt={serie.title}
                className="editSeriePoster"
              />
            ) : (
              <div className="editSeriePosterHolder">
                <FontAwesomeIcon icon={faImage} />
                <p>Aucune affiche de la série pour le moment.</p>
              </div>
            )}
            <label>
              <input
                type="text"
                name="poster"
                placeholder="URL de l'affiche"
                value={posterInput.url}
                onChange={(e) => handleImageChange("poster", e)}
              />
              <input
                type="file"
                name="poster"
                accept="image/*"
                onChange={(e) => handleImageChange("poster", e)}
              />
            </label>
          </div>
          <div>
            <p>Logo de la série</p>
            {serie.logo ? (
              <img
                src={previewImage(logoInput, "Logos")}
                alt={serie.title}
                className="editSerieLogo"
              />
            ) : (
              <div className="editSerieLogoHolder">
                <FontAwesomeIcon icon={faCopyright} />
                <p>Aucun logo de la série pour le moment.</p>
              </div>
            )}
            <label>
              <input
                type="text"
                name="logo"
                placeholder="URL du logo"
                value={logoInput.url}
                onChange={(e) => handleImageChange("logo", e)}
              />
              <input
                type="file"
                name="logo"
                accept="image/*"
                onChange={(e) => handleImageChange("logo", e)}
              />
            </label>
          </div>
        </div>
        <div className="editSerieFormRight">
          <div>
            <p> Arrière-plan de la série</p>
            {serie.background ? (
              <img
                src={previewImage(backgroundInput, "Backgrounds")}
                alt={serie.title}
                className="editSerieBackground"
              />
            ) : (
              <div className="editSerieBackgroundHolder">
                <FontAwesomeIcon icon={faPanorama} />
                <p>Aucun arrière-plan de la série pour le moment.</p>
              </div>
            )}
            <label>
              <input
                type="text"
                name="background"
                placeholder="URL de l'arrière-plan"
                value={backgroundInput.url}
                onChange={(e) => handleImageChange("background", e)}
              />
              <input
                type="file"
                name="background"
                accept="image/*"
                onChange={(e) => handleImageChange("background", e)}
              />
            </label>
          </div>
          <div className="editSerieInfos">
            <label>
              <p>Date de début de diffusion</p>
              <input
                type="date"
                name="release_date"
                value={serieForm.release_date}
                onChange={handleSerieChange}
              />
            </label>
            <label>
              <p>Date de fin de diffusion</p>
              <input
                type="date"
                name="ending_date"
                value={serieForm.ending_date}
                onChange={handleSerieChange}
              />
            </label>
            <label>
              <p>Nombre de saison(s)</p>
              <input
                type="number"
                name="nbSeasons"
                value={serieForm.nbSeasons}
                onChange={handleSerieChange}
              />
            </label>
            <label>
              <p>Nombre d'épisode(s)</p>
              <input
                type="number"
                name="nbEpisodesSerie"
                value={serieForm.nbEpisodesSerie}
                onChange={handleSerieChange}
              />
            </label>
            <label>
              <p>Sortie</p>
              <select
                name="screen"
                value={serieForm.screen}
                onChange={handleSerieChange}
              >
                <option value="" selected={serieForm.screen}></option>
                <option value="TV">TV</option>
                <option value="Streaming">Streaming</option>
              </select>
            </label>
            <label>
              <p>Original</p>
              <input
                type="text"
                name="original"
                value={serieForm.original}
                onChange={handleSerieChange}
              />
            </label>
            <label>
              <p>Streaming</p>
              <input
                type="text"
                name="streaming"
                value={serieForm.streaming}
                onChange={handleSerieChange}
              />
            </label>
            <label>
              <p>Statut</p>
              <select
                name="statut"
                value={serieForm.statut}
                onChange={handleSerieChange}
              >
                <option value="">{serieForm.statut}</option>
                <option value="En cours">En cours</option>
                <option value="Terminee">Terminée</option>
                <option value="Fin de saison">Fin de saison</option>
                <option value="Annulee">Annulée</option>
              </select>
            </label>
            <label>
              <p>Genre(s)</p>
              <input
                type="text"
                name="genre"
                value={serieForm.genre}
                onChange={handleSerieChange}
              />
            </label>
            <label>
              <p>Thème(s)</p>
              <input
                type="text"
                name="theme"
                value={serieForm.theme}
                onChange={handleSerieChange}
              />
            </label>
            <label>
              <p>Univers</p>
              <input
                type="text"
                name="universe"
                value={serieForm.universe}
                onChange={handleSerieChange}
              />
            </label>
            <label>
              <p>Sous-univers</p>
              <input
                type="text"
                name="subUniverse"
                value={serieForm.subUniverse}
                onChange={handleSerieChange}
              />
            </label>
          </div>
        </div>
      </div>
      <div className="editSerieSynopsisTrailer">
        <label>
          <p>Synopsis</p>
          <textarea
            name="synopsis"
            value={serieForm.synopsis}
            placeholder="Synopsis de la série"
            onChange={handleSerieChange}
          />
        </label>
        <label>
          <p>Bande-annonce :</p>
          {serieForm.trailer ? (
            <iframe
              title="Trailer de la série"
              src={serieForm.trailer}
              allowFullScreen
            ></iframe>
          ) : (
            <div className="editSerieTrailerHolder">
              <FontAwesomeIcon icon={faFilm} />
              <p>Aucune bande-annonce pour le moment.</p>
            </div>
          )}
          <input
            type="url"
            name="trailer"
            value={serieForm.trailer}
            onChange={handleSerieChange}
          />
        </label>
      </div>
      <AdminSerieSeasonsEdit
        serie={serie}
        seasons={Array.isArray(seasons) ? seasons : []}
      />
      <div className="editSerieCasting">
        <h3>Casting de la série</h3>

        <div className="editSerieCastingSection">
          <h4>Direction</h4>

          <div className="editSerieCastingList">
            {directing.map((direction) => (
              <div key={direction.id} className="editSerieCastingCard">
                <img
                  src={direction.personality_image && direction.personality_image.startsWith("http")
                    ? direction.personality_image
                    : direction.personality_image
                    ? `http://localhost:3994/src/assets/Personalities/Images/${direction.personality_image}`
                    : ""
                  }
                  alt={direction.personality_fullname}
                />
                <p>{direction.personality_fullname}</p>
                <label>
                  <p>Rôle :</p>
                  <input
                    type="text"
                    value={direction.role}
                    onChange={(e) =>
                      handleCastingChange(direction.id, {
                        role: e.target.value,
                      })
                    }
                  />
                </label>
                <label>
                  <p>Side :</p>
                  <select
                    value={direction.side}
                    onChange={(e) =>
                      handleCastingChange(direction.id, {
                        side: e.target.value,
                      })
                    }
                  >
                    <option value="Acting">Acting</option>
                    <option value="Directing">Directing</option>
                  </select>
                </label>
                <label>
                  <p>Présence :</p>
                  <input
                    type="text"
                    value={direction.presence}
                    onChange={(e) =>
                      handleCastingChange(direction.id, {
                        presence: e.target.value,
                      })
                    }
                  />
                </label>
                <button
                  type="button"
                  onClick={() => handleRemoveCasting(direction.id)}
                >
                  Supprimer
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="editSerieCastingSection">
          <h4>Acteurs & Actrices</h4>
          <div className="editSerieCastingList">
            {acting.map((acting) => (
              <div key={acting.id} className="editSerieCastingCard">
                <img
                  src={acting.personality_image && acting.personality_image.startsWith("http")
                    ? acting.personality_image
                    : acting.personality_image
                    ? `http://localhost:3994/src/assets/Personalities/Images/${acting.personality_image}`
                    : ""
                  }
                  alt={acting.personality_fullname}
                />
                <p>{acting.personality_fullname}</p>
                <label>
                  <p>Role :</p>
                  <input
                    type="text"
                    value={acting.role}
                    onChange={(e) =>
                      handleCastingChange(acting.id, { role: e.target.value })
                    }
                  />
                </label>
                <label>
                  <p>Side :</p>
                  <select
                    value={acting.side}
                    onChange={(e) =>
                      handleCastingChange(acting.id, { side: e.target.value })
                    }
                  >
                    <option value="Acting">Acting</option>
                    <option value="Directing">Directing</option>
                  </select>
                </label>
                <label>
                  <p>Présence :</p>
                  <input
                    type="text"
                    value={acting.presence}
                    onChange={(e) =>
                      handleCastingChange(acting.id, {
                        presence: e.target.value,
                      })
                    }
                  />
                </label>
                <button
                  type="button"
                  onClick={() => handleRemoveCasting(acting.id)}
                >
                  Supprimer
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="addMemberCasting">
          <h4>Ajouter un membre au casting</h4>
          <label>
            <p>
              <strong>Personnalité :</strong>
            </p>
            <select
              value={selectedPersonality}
              onChange={(e) => setSelectedPersonality(e.target.value)}
            >
              <option value="">Choisir une personnalité</option>
              {personalities.map((personality) => (
                <option key={personality.id} value={personality.id}>
                  {personality.fullname}
                </option>
              ))}
            </select>
          </label>
          <label>
            <p>
              <strong>Rôle :</strong>
            </p>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
          </label>
          <label>
            <p>
              <strong>Side :</strong>
            </p>
            <select value={side} onChange={(e) => setSide(e.target.value)}>
              <option value="">Choisir un side</option>
              <option value="Directing">Directing</option>
              <option value="Acting">Acting</option>
            </select>
          </label>
          <label>
            <p>
              <strong>Présence</strong>
            </p>
            <input
              type="text"
              value={presence}
              onChange={(e) => setPresence(e.target.value)}
            />
          </label>
          <button type="button" onClick={handleAddMember} disabled={loading}>
            Ajouter
          </button>
          {error && <div className="error">{error}</div>}
        </div>
      </div>
      <ToastContainer />
    </form>
  );
}

AdminSerieEditForm.propTypes = {
  serie: PropTypes.object.isRequired,
  seasons: PropTypes.object.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default AdminSerieEditForm;
