import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faImage,
  faPanorama,
  faCopyright,
  faFilm,
} from "@fortawesome/free-solid-svg-icons";
import connexion from "../../../../../../services/connexion";
import HorizontalScroll from "../../../../../../components/HorizontalScroll/HorizontalScroll";
import { AuthContext } from "../../../../../../services/Context/AuthContext";
import "./AdminMovieEditForm.css";

function AdminMovieEditForm({ movie, onUpdate, onCancel, onDelete }) {
  // State principal du formulaire film
  const [form, setForm] = useState({
    title: movie.title || "",
    release_date: movie.release_date || "",
    duration: movie.duration || "",
    genre: movie.genre || "",
    theme: movie.theme || "",
    country: movie.country || "",
    screen: movie.screen || "",
    streaming: movie.streaming || "",
    universe: movie.universe || "",
    subUniverse: movie.subUniverse || "",
    synopsis: movie.synopsis || "",
    trailer: movie.trailer || "",
    casting: movie.casting || [],
  });

  const { token } = useContext(AuthContext);

  // Images
  const [posterInput, setPosterInput] = useState({
    url: movie.poster || "",
    file: null,
  });
  const [backgroundInput, setBackgroundInput] = useState({
    url: movie.background || "",
    file: null,
  });
  const [logoInput, setLogoInput] = useState({
    url: movie.logo || "",
    file: null,
  });

  // Casting
  const casting = form.casting || [];
  const directing = casting.filter((cast) => cast.side === "Directing");
  const acting = casting.filter((cast) => cast.side === "Acting");

  // Champs pour ajout membre
  const [personalities, setPersonalities] = useState([]);
  const [selectedPersonality, setSelectedPersonality] = useState("");
  const [role, setRole] = useState("");
  const [side, setSide] = useState("Directing");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Récupération des personnalités
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

  // Handlers génériques
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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

  // Ajout d'un membre au casting
  const handleAddMember = async () => {
    setError("");
    if (!selectedPersonality || !role || !side) {
      setError("Veuillez remplir tous les champs du membre à ajouter.");
      return;
    }
    try {
      const personality = personalities.find(
        (p) => p.id === parseInt(selectedPersonality, 10)
      );
      const response = await connexion.post(
        "/movieCasting",
        {
          movie_id: movie.id,
          personality_id: personality.id,
          role,
          side,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Ajout local dans le state pour affichage immédiat
      setForm((prevForm) => ({
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
            movie_id: movie.id,
          },
        ],
      }));
      setRole("");
      setSide("Directing");
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
      await connexion.delete(`/movieCasting/${castingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setForm((prevForm) => ({
        ...prevForm,
        casting: prevForm.casting.filter((cast) => cast.id !== castingId),
      }));
    } catch (err) {
      setError("Erreur lors de la suppression du membre du casting");
    }
  };

  // Modification du rôle d'un membre
  const handleRoleChange = async (castingId, newRole) => {
    setForm((prevForm) => ({
      ...prevForm,
      casting: prevForm.casting.map((cast) =>
        cast.id === castingId ? { ...cast, role: newRole } : cast
      ),
    }));
    try {
      await connexion.put(
        `/movieCasting/${castingId}`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      setError("Erreur lors de la modification du rôle");
    }
  };

  // Modification du side d'un membre
  const handleSideChange = async (castingId, newSide) => {
    setForm((prevForm) => ({
      ...prevForm,
      casting: prevForm.casting.map((cast) =>
        cast.id === castingId ? { ...cast, side: newSide } : cast
      ),
    }));
    try {
      await connexion.put(
        `/movieCasting/${castingId}`,
        { side: newSide },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      setError("Erreur lors de la modification du side");
    }
  };

  // Soumission du formulaire principal
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key === "casting") {
        data.append("casting", JSON.stringify(value));
      } else {
        data.append(key, value ?? "");
      }
    });
    if (posterInput.file) data.append("poster", posterInput.file);
    else if (posterInput.url) data.append("poster", posterInput.url);
    if (backgroundInput.file) data.append("background", backgroundInput.file);
    else if (backgroundInput.url)
      data.append("background", backgroundInput.url);
    if (logoInput.file) data.append("logo", logoInput.file);
    else if (logoInput.url) data.append("logo", logoInput.url);
    onUpdate(data);
  };

  // Helpers d'affichage
  const previewImage = (input, localPath) => {
    if (input.file) return URL.createObjectURL(input.file);
    if (input.url && input.url.startsWith("http")) return input.url;
    if (input.url)
      return `http://localhost:3994/src/assets/Movies/${localPath}/${input.url}`;
    return "";
  };
  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toISOString().slice(0, 10);
  };
  const formatDuration = (duration) => {
    if (!duration) return "";
    const [hh, mm] = duration.split(":");
    return `${parseInt(hh, 10)}:${mm}`;
  };

  const handleDeleteMovie = () => {
    if (window.confirm("Supprimer ce film ?")) {
      if (onDelete) onDelete();
    }
  };

  return (
    <form
      className="editMovieForm"
      onSubmit={handleSubmit}
      encType="multipart/form-data"
    >
      <div className="editMovieFormTop">
        <label>
          <p>
            <strong>Titre :</strong>
          </p>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />
        </label>
        <div>
          <button type="submit">Enregistrer</button>
          <button type="button" onClick={handleDeleteMovie}>
            Supprimer le film
          </button>
          <button type="button" onClick={onCancel}>
            Annuler
          </button>
        </div>
      </div>
      <div className="editMovieFormContent">
        <div className="editMovieFormLeft">
          <div>
            <p>
              <strong>Affiche :</strong>
            </p>
            {posterInput.url || posterInput.file ? (
              <img
                src={previewImage(posterInput, "Posters")}
                className="editMoviePoster"
                alt="Affiche du film"
              />
            ) : (
              <div className="editMoviePosterHolder">
                <FontAwesomeIcon icon={faImage} />
                <p>Aucune affiche pour le moment.</p>
              </div>
            )}
            <label>
              <input
                type="text"
                name="posterUrl"
                placeholder="URL de l'affiche"
                value={posterInput.url}
                onChange={(e) => handleImageChange("poster", e)}
              />
              <input
                type="file"
                name="posterFile"
                accept="image/*"
                onChange={(e) => handleImageChange("poster", e)}
              />
            </label>
          </div>
          <div>
            <p>
              <strong>Logo :</strong>
            </p>
            {logoInput.url || logoInput.file ? (
              <img
                src={previewImage(logoInput, "Logos")}
                className="editMovieLogo"
                alt="Logo du film"
              />
            ) : (
              <div className="editMovieLogoHolder">
                <FontAwesomeIcon icon={faCopyright} />
                <p>Aucun logo pour le moment.</p>
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
        <div className="editMovieFormRight">
          <div>
            <p>
              <strong>Background :</strong>
            </p>
            {backgroundInput.url || backgroundInput.file ? (
              <img
                src={previewImage(backgroundInput, "Backgrounds")}
                className="editMovieBackground"
                alt="Background du film"
              />
            ) : (
              <div className="editMovieBackgroundHolder">
                <FontAwesomeIcon icon={faPanorama} />
                <p>Aucun background pour le moment.</p>
              </div>
            )}
            <label>
              <input
                type="text"
                name="background"
                placeholder="URL du background"
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
          <div className="editMovieInfos">
            <label>
              <p>
                <strong>Date de sortie :</strong>
              </p>
              <input
                type="date"
                name="release_date"
                value={formatDate(form.release_date)}
                onChange={handleChange}
              />
            </label>
            <label>
              <p>
                <strong>Durée :</strong>
              </p>
              <input
                type="text"
                name="duration"
                placeholder="hh:mm:ss"
                value={formatDuration(form.duration)}
                onChange={handleChange}
              />
            </label>
            <label>
              <p>
                <strong>Genre(s) :</strong>
              </p>
              <input
                type="text"
                name="genre"
                placeholder="Genre(s) (séparés par des virgules)"
                value={form.genre}
                onChange={handleChange}
              />
            </label>
            <label>
              <p>
                <strong>Thème(s) :</strong>
              </p>
              <input
                type="text"
                name="theme"
                placeholder="Thème(s) (séparés par des virgules)"
                value={form.theme}
                onChange={handleChange}
              />
            </label>
            <label>
              <p>
                <strong>Origine(s) :</strong>
              </p>
              <input
                type="text"
                name="country"
                placeholder="Origine(s) (séparées par des virgules)"
                value={form.country}
                onChange={handleChange}
              />
            </label>
            <label>
              <p>
                <strong>Sortie :</strong>
              </p>
              <select name="screen" value={form.screen} onChange={handleChange}>
                <option value="Cinema">Cinéma</option>
                <option value="Streaming">Streaming</option>
              </select>
            </label>
            <label>
              <p>
                <strong>Streaming :</strong>
              </p>
              <input
                type="text"
                name="streaming"
                placeholder="Plateforme de streaming"
                value={form.streaming}
                onChange={handleChange}
              />
            </label>
            <label>
              <p>
                <strong>Univers :</strong>
              </p>
              <input
                type="text"
                name="universe"
                placeholder="Univers"
                value={form.universe}
                onChange={handleChange}
              />
            </label>
            <label>
              <p>
                <strong>Sous-univers :</strong>
              </p>
              <input
                type="text"
                name="subUniverse"
                placeholder="Sous-univers"
                value={form.subUniverse}
                onChange={handleChange}
              />
            </label>
          </div>
        </div>
      </div>
      <div className="editMovieSynopsisTrailer">
        <label>
          <p>
            <strong>Synopsis</strong>
          </p>
          <textarea
            type="text"
            name="synopsis"
            placeholder="Synopsis"
            value={form.synopsis}
            onChange={handleChange}
          />
        </label>
        <label>
          <p>
            <strong>Trailer</strong>
          </p>
          {form.trailer ? (
            <iframe
              src={form.trailer}
              title="trailer"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : (
            <div className="editMovieTrailerHolder">
              <FontAwesomeIcon icon={faFilm} />
              <p>Aucun trailer pour le moment.</p>
            </div>
          )}
          <input
            type="text"
            name="trailer"
            placeholder="URL du trailer"
            value={form.trailer}
            onChange={handleChange}
          />
        </label>
      </div>

      <div className="editMovieCasting">
        <h3>Casting du film "{form.title}"</h3>
        <div className="addMemberCasting">
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
              <option value="Directing">Directing</option>
              <option value="Acting">Acting</option>
            </select>
          </label>
          <button type="button" onClick={handleAddMember} disabled={loading}>
            Ajouter
          </button>
          {error && <div className="error">{error}</div>}
        </div>
        <div className="editMovieCastingSection">
          <h4>Réalisation</h4>
          <div className="editMovieCastingList">
            <HorizontalScroll>
              {directing.length > 0 ? (
                directing.map((direction) => (
                  <div className="editMovieCastingCard" key={direction.id}>
                    <img
                      src={
                        direction.personality_image &&
                        direction.personality_image.startsWith("http")
                          ? direction.personality_image
                          : direction.personality_image
                          ? `http://localhost:3994/src/assets/Personalities/Images/${direction.personality_image}`
                          : ""
                      }
                      alt={direction.personality_fullname}
                    />
                    <p>{direction.personality_fullname}</p>
                    <label>
                      <strong>Rôle :</strong>
                      <input
                        type="text"
                        value={direction.role}
                        onChange={(e) =>
                          handleRoleChange(direction.id, e.target.value)
                        }
                      />
                    </label>
                    <label>
                      <strong>Side :</strong>
                      <select
                        value={direction.side}
                        onChange={(e) =>
                          handleSideChange(direction.id, e.target.value)
                        }
                      >
                        <option value="Directing">Directing</option>
                        <option value="Acting">Acting</option>
                      </select>
                    </label>
                    <button
                      type="button"
                      onClick={() => handleRemoveCasting(direction.id)}
                    >
                      Supprimer
                    </button>
                  </div>
                ))
              ) : (
                <p>Aucun membre de la direction du film pour le moment.</p>
              )}
            </HorizontalScroll>
          </div>
        </div>
        {/* Acting */}
        <div className="editMovieCastingSection">
          <h4>Acteurs et actrices</h4>
          <div className="editMovieCastingList">
            <HorizontalScroll>
              {acting.length > 0 ? (
                acting.map((actor) => (
                  <div className="editMovieCastingCard" key={actor.id}>
                    <img
                      src={
                        actor.personality_image &&
                        actor.personality_image.startsWith("http")
                          ? actor.personality_image
                          : actor.personality_image
                          ? `http://localhost:3994/src/assets/Personalities/Images/${actor.personality_image}`
                          : ""
                      }
                      alt={actor.personality_fullname}
                    />
                    <p>{actor.personality_fullname}</p>
                    <label>
                      <strong>Rôle :</strong>
                      <input
                        type="text"
                        value={actor.role}
                        onChange={(e) =>
                          handleRoleChange(actor.id, e.target.value)
                        }
                      />
                    </label>
                    <label>
                      <strong>Side :</strong>
                      <select
                        value={actor.side}
                        onChange={(e) =>
                          handleSideChange(actor.id, e.target.value)
                        }
                      >
                        <option value="Directing">Directing</option>
                        <option value="Acting">Acting</option>
                      </select>
                    </label>
                    <button
                      type="button"
                      onClick={() => handleRemoveCasting(actor.id)}
                    >
                      Supprimer
                    </button>
                  </div>
                ))
              ) : (
                <p>Aucun acteur ni actrice pour le moment.</p>
              )}
            </HorizontalScroll>
          </div>
        </div>
      </div>
    </form>
  );
}

AdminMovieEditForm.propTypes = {
  movie: PropTypes.object.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
};

export default AdminMovieEditForm;
