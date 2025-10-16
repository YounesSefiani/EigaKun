import React, { useState, useContext, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileImage,
  faPanorama,
  faCopyright,
  faFilm,
} from "@fortawesome/free-solid-svg-icons";
import connexion from "../../../../../services/connexion";
import { AuthContext } from "../../../../../services/Context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HorizontalScroll from "../../../../../components/HorizontalScroll/HorizontalScroll";
import "./AdminAddSerie.css";

function AdminAddSerie({ onClose, onSerieAdded }) {
  const { token } = useContext(AuthContext);

  // State principal de la série
  const initialSerie = {
    title: "",
    poster: "",
    background: "",
    logo: "",
    trailer: "",
    synopsis: "",
    genre: "",
    theme: "",
    release_date: "",
    ending_date: "",
    nbSeasons: "",
    // seasons: "",
    nbEpisodesSerie: "",
    // episodes: "",
    statut: "",
    screen: "",
    streaming: "",
    original: "",
    duration: "",
    country: "",
    universe: "",
    subUniverse: "",
  };
  const [serie, setSerie] = useState(initialSerie);

  // Images
  const [posterInput, setPosterInput] = useState({ url: "", file: null });
  const [backgroundInput, setBackgroundInput] = useState({
    url: "",
    file: null,
  });
  const [logoInput, setLogoInput] = useState({ url: "", file: null });

  // Casting local (avant POST)
  const [casting, setCasting] = useState([]);
  const directing = casting.filter((cast) => cast.side === "Directing");
  const acting = casting.filter((cast) => cast.side === "Acting");

  // Champs pour ajout membre
  const [personalities, setPersonalities] = useState([]);
  const [selectedPersonality, setSelectedPersonality] = useState("");
  const [role, setRole] = useState("");
  const [side, setSide] = useState("");
  const [presence, setPresence] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Récupération des personnalités
  useEffect(() => {
    const fetchPersonalities = async () => {
      try {
        const response = await connexion.get("/personalities");
        setPersonalities(response.data);
      } catch (err) {
        setError("Erreur lors du chargement des personnalités");
      }
    };
    fetchPersonalities();
  }, []);

  // Handlers génériques
  const handleSerieChange = (e) => {
    const { name, value } = e.target;
    setSerie((prev) => ({
      ...prev,
      [name]: value,
    }));
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

  // Ajout d'un membre au casting (local)
  const handleAddMember = () => {
    setError("");
    if (!selectedPersonality || !role || !side || !presence) {
      setError("Veuillez remplir tous les champs du membre à ajouter.");
      return;
    }
    const personality = personalities.find(
      (p) => p.id === parseInt(selectedPersonality, 10)
    );
    setCasting((prev) => [
      ...prev,
      {
        id: Date.now(), // temporaire, remplacé par l'id du backend après POST
        personality_id: personality.id,
        personality_fullname: personality.fullname,
        personality_image: personality.image_src,
        role,
        side,
        presence,
      },
    ]);
    setSelectedPersonality("");
    setRole("");
    setSide("");
    setPresence("");
  };

  // Suppression d'un membre du casting (local)
  const handleRemoveCasting = (castingId) => {
    setCasting((prev) => prev.filter((cast) => cast.id !== castingId));
  };

  // Modification du rôle d'un membre (local)
  const handleRoleChange = (castingId, newRole) => {
    setCasting((prev) =>
      prev.map((cast) =>
        cast.id === castingId ? { ...cast, role: newRole } : cast
      )
    );
  };

  // Modification du side d'un membre (local)
  const handleSideChange = (castingId, newSide) => {
    setCasting((prev) =>
      prev.map((cast) =>
        cast.id === castingId ? { ...cast, side: newSide } : cast
      )
    );
  };

  const handlePresenceChange = (castingId, newPresence) => {
    setCasting((prev) =>
      prev.map((cast) =>
        cast.id === castingId ? { ...cast, presence: newPresence } : cast
      )
    );
  };

  // Helpers d'affichage
  const previewImage = (input, localPath) => {
    if (input.file) return URL.createObjectURL(input.file);
    if (input.url && input.url.startsWith("http")) return input.url;
    if (input.url)
      return `http://localhost:3994/src/assets/Series/${localPath}/${input.url}`;
    return "";
  };

  // Soumission du formulaire principal
  const handleSerieAdd = async (event) => {
    event.preventDefault();
    setLoading(true);

    const serieFormData = new FormData();
    serieFormData.append("title", serie.title);
    if (posterInput.file) serieFormData.append("poster", posterInput.file);
    else if (posterInput.url) serieFormData.append("poster", posterInput.url);
    if (backgroundInput.file)
      serieFormData.append("background", backgroundInput.file);
    else if (backgroundInput.url)
      serieFormData.append("background", backgroundInput.url);
    if (logoInput.file) serieFormData.append("logo", logoInput.file);
    else if (logoInput.url) serieFormData.append("logo", logoInput.url);
    serieFormData.append("trailer", serie.trailer);
    serieFormData.append("synopsis", serie.synopsis);
    serieFormData.append("genre", serie.genre);
    serieFormData.append("theme", serie.theme);
    serieFormData.append("release_date", serie.release_date);
    serieFormData.append("ending_date", serie.ending_date);
    serieFormData.append("nbSeasons", serie.nbSeasons);
    // serieFormData.append("seasons", serie.seasons);
    serieFormData.append("nbEpisodesSerie", serie.nbEpisodesSerie);
    // serieFormData.append("episodes", serie.episodes);
    serieFormData.append("statut", serie.statut);
    serieFormData.append("screen", serie.screen);
    serieFormData.append("streaming", serie.streaming);
    serieFormData.append("original", serie.original);
    serieFormData.append("duration", serie.duration);
    serieFormData.append("country", serie.country);
    serieFormData.append("universe", serie.universe);
    serieFormData.append("subUniverse", serie.subUniverse);

    try {
      const response = await connexion.post("/series", serieFormData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const newSerie = response.data;
      // Ajout du casting si présent
      if (casting.length > 0 && newSerie.id) {
        console.log("Ajout du casting", casting);
        for (const member of casting) {
          await connexion.post(
            "/serieCasting",
            {
              serie_id: newSerie.id,
              personality_id: member.personality_id,
              role: member.role,
              side: member.side,
              presence: member.presence,
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }
      }
      toast.success("Série ajoutée avec succès !");
      setSerie(initialSerie);
      setPosterInput({ url: "", file: null });
      setBackgroundInput({ url: "", file: null });
      setLogoInput({ url: "", file: null });
      setCasting([]);
      if (onSerieAdded && response.data) onSerieAdded(response.data);
      setTimeout(() => {
        if (onClose) onClose();
        setLoading(false);
      }, 5000);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Erreur lors de l'ajout de la série"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="adminAddSerieOverlay"></div>
      <div className="adminAddSerieModal">
        <div className="adminAddSerieTopInterface">
          <h2>Ajouter une nouvelle série</h2>
        </div>
        <form className="addSerieForm" onSubmit={handleSerieAdd}>
          <div className="addSerieFormTop">
            <label htmlFor="title">
              <p>
                <strong>Titre</strong>
              </p>
              <input
                type="text"
                name="title"
                value={serie.title}
                onChange={handleSerieChange}
                placeholder="Titre de la série"
                required
              />
            </label>
            <div>
              <button type="submit" disabled={loading}>
                {loading ? "Ajout en cours..." : "Ajouter la série"}
              </button>
              <button type="button" onClick={onClose}>
                Retour
              </button>
            </div>
          </div>
          <div className="addSerieFormContent">
            <div className="addSerieFormLeft">
              <label>
                <p>
                  <strong>Affiche :</strong>
                </p>
                {posterInput.file || posterInput.url ? (
                  <img
                    src={previewImage(posterInput, "Posters")}
                    alt="Affiche de la série"
                    className="addSeriePoster"
                  />
                ) : (
                  <div className="addSeriePosterHolder">
                    <FontAwesomeIcon icon={faFileImage} />
                    <p>Ajoutez une affiche</p>
                  </div>
                )}
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
              <label>
                <p>
                  <strong>Logo :</strong>
                </p>
                {logoInput.file || logoInput.url ? (
                  <img
                    src={previewImage(logoInput, "Logos")}
                    alt="Logo de la série"
                    className="addSerieLogo"
                  />
                ) : (
                  <div className="addSerieLogoHolder">
                    <FontAwesomeIcon icon={faCopyright} />
                    <p>Ajoutez un logo</p>
                  </div>
                )}
                <input
                  type="text"
                  name="logoUrl"
                  placeholder="URL du logo"
                  value={logoInput.url}
                  onChange={(e) => handleImageChange("logo", e)}
                />
                <input
                  type="file"
                  name="logoFile"
                  accept="image/*"
                  onChange={(e) => handleImageChange("logo", e)}
                />
              </label>
            </div>
            <div className="addSerieFormRight">
              <label>
                <p>
                  <strong>Arrière-plan :</strong>
                </p>
                {backgroundInput.file || backgroundInput.url ? (
                  <img
                    src={previewImage(backgroundInput, "Backgrounds")}
                    alt="Arrière-plan de la série"
                    className="addSerieBackground"
                  />
                ) : (
                  <div className="addSerieBackgroundHolder">
                    <FontAwesomeIcon icon={faPanorama} />
                    <p>Ajoutez un arrière-plan</p>
                  </div>
                )}
                <input
                  type="text"
                  name="backgroundUrl"
                  placeholder="URL de l'arrière-plan"
                  value={backgroundInput.url}
                  onChange={(e) => handleImageChange("background", e)}
                />
                <input
                  type="file"
                  name="backgroundFile"
                  accept="image/*"
                  onChange={(e) => handleImageChange("background", e)}
                />
              </label>

              <div className="addSerieInfos">
                <label>
                  <p>
                    <strong>Date de sortie</strong>
                  </p>
                  <input
                    type="date"
                    name="release_date"
                    value={serie.release_date}
                    onChange={handleSerieChange}
                  />
                </label>
                <label>
                  <p>
                    <strong>Date de sortie</strong>
                  </p>
                  <input
                    type="date"
                    name="ending_date"
                    value={serie.ending_date}
                    onChange={handleSerieChange}
                  />
                </label>
                <label>
                  <p>
                    <strong>Saisons</strong>
                  </p>
                  <input
                    type="number"
                    name="nbSeasons"
                    placeholder="Nombre de saisons"
                    value={serie.nbSeasons}
                    onChange={handleSerieChange}
                  />
                </label>
                <label>
                  <p>
                    <strong>Episodes</strong>
                  </p>
                  <input
                    type="number"
                    name="nbEpisodesSerie"
                    placeholder="Nombre total d'épisodes"
                    value={serie.nbEpisodesSerie}
                    onChange={handleSerieChange}
                  />
                </label>
                <label>
                  <p>
                    <strong>Statut</strong>
                  </p>
                  <select
                    name="statut"
                    value={serie.statut}
                    onChange={handleSerieChange}
                  >
                    <option value="">-- Statut de la série --</option>
                    <option value="En cours">En cours</option>
                    <option value="Terminée">Terminée</option>
                    <option value="Fin de saison">Fin de saison</option>
                    <option value="Annulée">Annulée</option>
                  </select>
                </label>
                <label>
                  <p>
                    <strong>Genre</strong>
                  </p>
                  <input
                    type="text"
                    name="genre"
                    value={serie.genre}
                    onChange={handleSerieChange}
                    placeholder="Genre de la série"
                  />
                </label>
                <label>
                  <p>
                    <strong>Thème</strong>
                  </p>
                  <input
                    type="text"
                    name="theme"
                    value={serie.theme}
                    onChange={handleSerieChange}
                    placeholder="Thème de la série"
                  />
                </label>
                <label>
                  <p>
                    <strong>Origine</strong>
                  </p>
                  <input
                    type="text"
                    name="country"
                    value={serie.country}
                    onChange={handleSerieChange}
                    placeholder="Origine de la série"
                  />
                </label>
                <label>
                  <p>Sortie :</p>
                  <select
                    name="screen"
                    value={serie.screen}
                    onChange={handleSerieChange}
                  >
                    <option value="">Sortie sur :</option>
                    <option value="TV">TV</option>
                    <option value="Streaming">Streaming</option>
                  </select>
                </label>
                <label>
                  <p>
                    <strong>Streaming</strong>
                  </p>
                  <input
                    type="text"
                    name="streaming"
                    value={serie.streaming}
                    onChange={handleSerieChange}
                    placeholder="Plateforme de streaming"
                  />
                </label>
                <label>
                  <p>
                    <strong>Original</strong>
                  </p>
                  <input
                    type="text"
                    name="original"
                    value={serie.original}
                    onChange={handleSerieChange}
                    placeholder="Version originale"
                  />
                </label>
                <label>
                  <p>
                    <strong>Univers</strong>
                  </p>
                  <input
                    type="text"
                    name="universe"
                    value={serie.universe}
                    onChange={handleSerieChange}
                    placeholder="Univers de la série"
                  />
                </label>
                <label>
                  <p>
                    <strong>Sous-univers</strong>
                  </p>
                  <input
                    type="text"
                    name="subUniverse"
                    value={serie.subUniverse}
                    onChange={handleSerieChange}
                    placeholder="Sous-univers de la série"
                  />
                </label>
              </div>
            </div>
          </div>
          <div className="addSerieSynopsisTrailer">
            <label>
              <p>
                <strong>Synopsis</strong>
              </p>
              <textarea
                name="synopsis"
                value={serie.synopsis}
                onChange={handleSerieChange}
                placeholder="Synopsis de la série"
                required
              ></textarea>
            </label>
            <label>
              <p>
                <strong>Trailer</strong>
              </p>
              {serie.trailer ? (
                <iframe
                  src={serie.trailer}
                  title="trailer"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <div className="addSerieTrailerHolder">
                  <FontAwesomeIcon icon={faFilm} />
                  <p>Aucune bande-annonce pour le moment.</p>
                </div>
              )}
              <input
                type="url"
                name="trailer"
                value={serie.trailer}
                onChange={handleSerieChange}
                placeholder="URL du trailer"
              />
            </label>
          </div>

          {/* --- CASTING --- */}
          <div className="editSerieCasting">
            <h3>Casting de la série</h3>
            {/* Réalisation */}
            <div className="editSerieCastingSection">
              <h4>Réalisation</h4>
              <div className="editSerieCastingList">
                <HorizontalScroll>
                  {directing.length > 0 ? (
                    directing.map((direction) => (
                      <div className="editSerieCastingCard" key={direction.id}>
                        <img
                          src={direction.personality_image}
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
                        <label>
                          <strong>Présence :</strong>
                          <input
                            type="text"
                            value={direction.presence}
                            onChange={(e) =>
                              handlePresenceChange(direction.id, e.target.value)
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
                    ))
                  ) : (
                    <p>Aucun réalisateur pour le moment.</p>
                  )}
                </HorizontalScroll>
              </div>
            </div>
            {/* Acting */}
            <div className="editSerieCastingSection">
              <h4>Acteurs et actrices</h4>
              <div className="editSerieCastingList">
                <HorizontalScroll>
                  {acting.length > 0 ? (
                    acting.map((actor) => (
                      <div className="editSerieCastingCard" key={actor.id}>
                        <img
                          src={actor.personality_image}
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
                        <label>
                          <strong>Présence :</strong>
                          <input
                            type="text"
                            value={actor.presence}
                            onChange={(e) =>
                              handlePresenceChange(actor.id, e.target.value)
                            }
                          />
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
                  <option value="">-- Choisir un side --</option>
                  <option value="Directing">Directing</option>
                  <option value="Acting">Acting</option>
                </select>
              </label>
              <label>
                <p>
                  <strong>Présence :</strong>
                </p>
                <input
                  type="text"
                  value={presence}
                  onChange={(e) => setPresence(e.target.value)}
                />
              </label>
              <button
                type="button"
                onClick={handleAddMember}
                disabled={loading}
              >
                Ajouter
              </button>
              {error && <div className="error">{error}</div>}
            </div>
          </div>
          {/* --- FIN CASTING --- */}
        </form>
      </div>
    </>
  );
}

export default AdminAddSerie;
