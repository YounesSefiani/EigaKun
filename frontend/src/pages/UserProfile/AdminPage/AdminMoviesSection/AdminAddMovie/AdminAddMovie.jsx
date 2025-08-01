import React, { useState, useContext, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileImage, faPanorama } from "@fortawesome/free-solid-svg-icons";
import connexion from "../../../../../services/connexion";
import { AuthContext } from "../../../../../services/Context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HorizontalScroll from "../../../../../components/HorizontalScroll/HorizontalScroll";
import "./AdminAddMovie.css";

function AdminAddMovie({ onClose, onMovieAdded }) {
  const { token } = useContext(AuthContext);

  // State principal du film
  const initialMovie = {
    title: "",
    poster: "",
    background: "",
    logo: "",
    trailer: "",
    synopsis: "",
    genre: "",
    theme: "",
    release_date: "",
    screen: "",
    streaming: "",
    original: "",
    duration: "",
    country: "",
    universe: "",
    subUniverse: "",
  };
  const [movie, setMovie] = useState(initialMovie);

  // Images
  const [posterInput, setPosterInput] = useState({ url: "", file: null });
  const [backgroundInput, setBackgroundInput] = useState({ url: "", file: null });
  const [logoInput, setLogoInput] = useState({ url: "", file: null });

  // Casting local (avant POST)
  const [casting, setCasting] = useState([]);
  const directing = casting.filter((cast) => cast.side === "Directing");
  const acting = casting.filter((cast) => cast.side === "Acting");

  // Champs pour ajout membre
  const [personalities, setPersonalities] = useState([]);
  const [selectedPersonality, setSelectedPersonality] = useState("");
  const [role, setRole] = useState("");
  const [side, setSide] = useState("Directing");
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
  const handleMovieChange = (e) => {
    const { name, value } = e.target;
    setMovie((prev) => ({
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
    if (!selectedPersonality || !role || !side) {
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
      },
    ]);
    setSelectedPersonality("");
    setRole("");
    setSide("Directing");
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

  // Helpers d'affichage
  const previewImage = (input, localPath) => {
    if (input.file) return URL.createObjectURL(input.file);
    if (input.url && input.url.startsWith("http")) return input.url;
    if (input.url)
      return `http://localhost:3994/src/assets/Movies/${localPath}/${input.url}`;
    return "";
  };

  // Soumission du formulaire principal
  const handleMovieAdd = async (event) => {
    event.preventDefault();
    setLoading(true);

    const movieFormData = new FormData();
    movieFormData.append("title", movie.title);
    if (posterInput.file) movieFormData.append("poster", posterInput.file);
    else if (posterInput.url) movieFormData.append("poster", posterInput.url);
    if (backgroundInput.file) movieFormData.append("background", backgroundInput.file);
    else if (backgroundInput.url) movieFormData.append("background", backgroundInput.url);
    if (logoInput.file) movieFormData.append("logo", logoInput.file);
    else if (logoInput.url) movieFormData.append("logo", logoInput.url);
    movieFormData.append("trailer", movie.trailer);
    movieFormData.append("synopsis", movie.synopsis);
    movieFormData.append("genre", movie.genre);
    movieFormData.append("theme", movie.theme);
    movieFormData.append("release_date", movie.release_date);
    movieFormData.append("screen", movie.screen);
    movieFormData.append("streaming", movie.streaming);
    movieFormData.append("original", movie.original);
    movieFormData.append("duration", movie.duration);
    movieFormData.append("country", movie.country);
    movieFormData.append("universe", movie.universe);
    movieFormData.append("subUniverse", movie.subUniverse);

    try {
      const response = await connexion.post("/movies", movieFormData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const newMovie = response.data;
      // Ajout du casting si présent
      if (casting.length > 0 && newMovie.id) {
        for (const member of casting) {
          await connexion.post(
            "/movieCasting",
            {
              movie_id: newMovie.id,
              personality_id: member.personality_id,
              role: member.role,
              side: member.side,
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }
      }
      toast.success("Film ajouté avec succès !");
      setMovie(initialMovie);
      setPosterInput({ url: "", file: null });
      setBackgroundInput({ url: "", file: null });
      setLogoInput({ url: "", file: null });
      setCasting([]);
      if (onMovieAdded && response.data) onMovieAdded(response.data);
      if (onClose) onClose();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Erreur lors de l'ajout du film"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="adminAddMovieOverlay"></div>
      <div className="adminAddMovieModal">
        <h2>Ajouter un film</h2>
        <form className="adminAddMovieForm" onSubmit={handleMovieAdd}>
          <div className="adminAddMovieTop">
            <label htmlFor="title">
              <p><strong>Titre</strong></p>
              <input
                type="text"
                name="title"
                value={movie.title}
                onChange={handleMovieChange}
                placeholder="Titre du film"
                required
              />
            </label>
          </div>
          <div className="adminAddMovieContent">
            <div className="adminAddMovieLeft">
              <label>
                <p><strong>Affiche :</strong></p>
                {posterInput.file || posterInput.url ? (
                  <img
                    src={previewImage(posterInput, "Posters")}
                    alt="Affiche du film"
                    className="moviePosterAdd"
                  />
                ) : (
                  <div className="addMoviePoster">
                    <div className="addMoviePosterHolder">
                      <FontAwesomeIcon icon={faFileImage} />
                      <p>Ajoutez une affiche</p>
                    </div>
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
                <p><strong>Arrière-plan :</strong></p>
                {backgroundInput.file || backgroundInput.url ? (
                  <img
                    src={previewImage(backgroundInput, "Backgrounds")}
                    alt="Arrière-plan du film"
                    className="movieBackgroundAdd"
                  />
                ) : (
                  <div className="addMovieBackground">
                    <div className="addMovieBackgroundHolder">
                      <FontAwesomeIcon icon={faPanorama} />
                      <p>Ajoutez un arrière-plan</p>
                    </div>
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
            </div>
            <div className="adminAddMovieRight">
              <label>
                <p><strong>Logo :</strong></p>
                {logoInput.file || logoInput.url ? (
                  <img
                    src={previewImage(logoInput, "Logos")}
                    alt="Logo du film"
                    className="movieLogoAdd"
                  />
                ) : (
                  <div className="addMovieLogo">
                    <div className="addMovieLogoHolder">
                      <FontAwesomeIcon icon={faFileImage} />
                      <p>Ajoutez un logo</p>
                    </div>
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
              <div className="addMovieInfos">
                <label>
                  <p><strong>Date de sortie</strong></p>
                  <input
                    type="date"
                    name="release_date"
                    value={movie.release_date}
                    onChange={handleMovieChange}
                  />
                </label>
                <label>
                  <p><strong>Durée</strong></p>
                  <input
                    type="text"
                    name="duration"
                    value={movie.duration}
                    onChange={handleMovieChange}
                    placeholder="Durée du film"
                  />
                </label>
                <label>
                  <p><strong>Genre</strong></p>
                  <input
                    type="text"
                    name="genre"
                    value={movie.genre}
                    onChange={handleMovieChange}
                    placeholder="Genre du film"
                  />
                </label>
                <label>
                  <p><strong>Thème</strong></p>
                  <input
                    type="text"
                    name="theme"
                    value={movie.theme}
                    onChange={handleMovieChange}
                    placeholder="Thème du film"
                  />
                </label>
                <label>
                  <p><strong>Origine</strong></p>
                  <input
                    type="text"
                    name="country"
                    value={movie.country}
                    onChange={handleMovieChange}
                    placeholder="Origine du film"
                  />
                </label>
                <label>
                  <p><strong>Sortie</strong></p>
                  <input
                    type="text"
                    name="screen"
                    value={movie.screen}
                    onChange={handleMovieChange}
                    placeholder="Sortie du film"
                  />
                </label>
                <label>
                  <p><strong>Streaming</strong></p>
                  <input
                    type="text"
                    name="streaming"
                    value={movie.streaming}
                    onChange={handleMovieChange}
                    placeholder="Plateforme de streaming"
                  />
                </label>
                <label>
                  <p><strong>Original</strong></p>
                  <input
                    type="text"
                    name="original"
                    value={movie.original}
                    onChange={handleMovieChange}
                    placeholder="Version originale"
                  />
                </label>
                <label>
                  <p><strong>Univers</strong></p>
                  <input
                    type="text"
                    name="universe"
                    value={movie.universe}
                    onChange={handleMovieChange}
                    placeholder="Univers du film"
                  />
                </label>
                <label>
                  <p><strong>Sous-univers</strong></p>
                  <input
                    type="text"
                    name="subUniverse"
                    value={movie.subUniverse}
                    onChange={handleMovieChange}
                    placeholder="Sous-univers du film"
                  />
                </label>
              </div>
              <div className="addMovieSynopsisTrailer">
                <label>
                  <p><strong>Synopsis</strong></p>
                  <textarea
                    name="synopsis"
                    value={movie.synopsis}
                    onChange={handleMovieChange}
                    placeholder="Synopsis du film"
                    required
                  ></textarea>
                </label>
                <label>
                  <p><strong>Trailer</strong></p>
                  <input
                    type="text"
                    name="trailer"
                    value={movie.trailer}
                    onChange={handleMovieChange}
                    placeholder="URL du trailer"
                  />
                </label>
              </div>
            </div>
          </div>
          {/* --- CASTING --- */}
          <div className="editMovieCasting">
            <h3>Casting du film "{movie.title}"</h3>
            <div className="addMemberCasting">
              <div>
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
            {/* Réalisation */}
            <div className="editMovieCastingSection">
              <h4>Réalisation</h4>
              <div className="editMovieCastingList">
                <HorizontalScroll>
                  {directing.length > 0 ? (
                    directing.map((direction) => (
                      <div className="editMovieCastingCard" key={direction.id}>
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
                            <option value="Writing">Writing</option>
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
                    <p>Aucun réalisateur pour le moment.</p>
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
                            <option value="Writing">Writing</option>
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
                    <p>Aucun acteur pour le moment.</p>
                  )}
                </HorizontalScroll>
              </div>
            </div>
          </div>
          {/* --- FIN CASTING --- */}
          <div className="addMovieButtons">
            <button type="submit" disabled={loading}>
              {loading ? "Ajout en cours..." : "Ajouter le film"}
            </button>
            <button type="button" onClick={onClose}>
              Retour
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default AdminAddMovie;