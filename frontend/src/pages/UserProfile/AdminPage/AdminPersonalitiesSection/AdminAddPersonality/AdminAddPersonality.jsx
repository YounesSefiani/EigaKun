import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../../../../services/Context/AuthContext";
import connexion from "../../../../../services/connexion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImagePortrait } from "@fortawesome/free-solid-svg-icons";
import "./AdminAddPersonality.css";
import HorizontalScroll from "../../../../../components/HorizontalScroll/HorizontalScroll";

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
    movies: [],
    series: [],
  };
  const [moviesList, setMoviesList] = useState([]);
  const [seriesList, setSeriesList] = useState([]);
  const [movie, setMovie] = useState([]);
  const [serie, setSerie] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState("");
  const [selectedSerie, setSelectedSerie] = useState("");
  // Etats distincts pour éviter le couplage Films/Séries
  const [movieRole, setMovieRole] = useState("");
  const [movieSide, setMovieSide] = useState("");
  const [serieRole, setSerieRole] = useState("");
  const [serieSide, setSerieSide] = useState("");
  const [seriePresence, setSeriePresence] = useState("");
  const [personality, setPersonality] = useState(initialPersonality);
  const [imageInput, setImageInput] = useState({ url: "", file: null });
  const [, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const getMovieCastingId = (m) => m?.movie_casting_id ?? m?.id ?? m?.movie_id;
  const getSerieCastingId = (s) => s?.serie_casting_id ?? s?.id ?? s?.serie_id;

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
      const newPersonality = response.data;

      await Promise.all(
        (personality.movies || []).map((m) =>
          connexion.post(
            "/movieCasting",
            {
              movie_id: m.movie_id,
              personality_id: newPersonality.id,
              role: m.role || "",
              side: m.side || "",
            },
            { headers: { Authorization: `Bearer ${token}` } }
          )
        )
      );

      await Promise.all(
        (personality.series || []).map((s) =>
          connexion.post(
            "/serieCasting",
            {
              serie_id: s.serie_id,
              personality_id: newPersonality.id,
              role: s.role || "",
              side: s.side || "",
              presence: s.presence || "",
            },
            { headers: { Authorization: `Bearer ${token}` } }
          )
        )
      );
      if (response.data?.message) {
        toast.success(response.data.message);
      }
      setPersonality(initialPersonality);
      setImageInput({ url: "", file: null });
      setMovie([]);
      setSerie([]);
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

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await connexion.get("/movies");
        setMoviesList(response.data);
      } catch (err) {
        setError("Erreur lors du chargement des films");
      } finally {
        setError("");
      }
    };

    const fetchSeries = async () => {
      try {
        const response = await connexion.get("/series");
        setSeriesList(response.data);
      } catch (err) {
        setError("Erreur lors du chargement des séries");
      } finally {
        setError("");
      }
    };
    fetchMovies();
    fetchSeries();
  }, []);

  const handleAddMovie = () => {
    if (!selectedMovie) return;
    const movie = moviesList.find((m) => m.id === Number(selectedMovie));
    if (!movie) return;

    setPersonality((prev) => ({
      ...prev,
      movies: [
        ...prev.movies,
        {
          id: Date.now(), // id temporaire pour l'UI
          movie_id: movie.id,
          movie_title: movie.title,
          movie_release_date: movie.release_date,
          movie_poster: movie.poster,
          role: movieRole, // ou movieRole si tu as séparé les états
          side: movieSide, // ou movieSide
        },
      ],
    }));
    setSelectedMovie("");
    setMovieRole(""); // ou setMovieRole("")
    setMovieSide(""); // ou setMovieSide("")
  };
  const handleRemoveMovie = (castingId) => {
    setPersonality((prev) => ({
      ...prev,
      movies: prev.movies.filter((m) => getMovieCastingId(m) !== castingId),
    }));
  };

  const updateLocalMovie = (castingId, field, value) => {
    setPersonality((prev) => ({
      ...prev,
      movies: prev.movies.map((m) =>
        getMovieCastingId(m) === castingId ? { ...m, [field]: value } : m
      ),
    }));
  };

  const handleAddSerie = () => {
    if (!selectedSerie) return;
    const serie = seriesList.find((s) => s.id === Number(selectedSerie));
    if (!serie) return;

    setPersonality((prev) => ({
      ...prev,
      series: [
        ...prev.series,
        {
          id: Date.now(), // id temporaire pour l'UI
          serie_id: serie.id,
          serie_title: serie.title,
          serie_release_date: serie.release_date,
          serie_ending_date: serie.ending_date,
          serie_poster: serie.poster,
          role: serieRole,
          side: serieSide,
          presence: seriePresence,
        },
      ],
    }));
    setSelectedSerie("");
    setSerie("");
    setSerieSide("");
    setSeriePresence("");
  };

  const updateLocalSerie = (castingId, field, value) => {
    setPersonality((prev) => ({
      ...prev,
      series: prev.series.map((s) =>
        getSerieCastingId(s) === castingId ? { ...s, [field]: value } : s
      ),
    }));
  };

  const handleRemoveSerie = (castingId) => {
    setPersonality((prev) => ({
      ...prev,
      series: prev.series.filter((m) => getSerieCastingId(m) !== castingId),
    }));
  };

  const onlyYear = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    return `${year}`;
  };

  return (
    <>
      <div className="addPersonalityOverlay"></div>
      <div className="addPersonalityModal">
        <form
          className="addPersonalityForm"
          onSubmit={handlePersonalityAdd}
        >
          <div className="addPersonalityTopInterface">
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
          <div className="addPersonalityTop">
            <label>
              <p>
                <strong>Nom complet</strong>
              </p>
              <input
                type="text"
                name="fullname"
                value={personality.fullname}
                placeholder="Nom de la personnalité"
                required
                onChange={handlePersonalityChange}
              />
            </label>
          </div>
          <div className="addPersonalityContent">
            <div className="addPersonalityLeft">
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
            <div className="addPersonalityRight">
              <div className="addPersonalityInfos">
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
              <div className="addPersonalityBio">
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
          <div className="addPersonalityFilmography">
            <h3>Filmographie</h3>
            <div className="addPersonalityMoviesSection">
              <h4>Films</h4>
              <div className="addPersonalityMoviesList">
                {personality.movies.length ? (
                  <HorizontalScroll>
                    {personality.movies.map((movie) => {
                      const cid = getMovieCastingId(movie);
                      return (
                        <div className="addPersonalityMovieCard" key={cid}>
                          <img
                            src={
                              movie.movie_poster &&
                              movie.movie_poster.startsWith("http")
                                ? movie.movie_poster
                                : movie.movie_poster
                                ? `http://localhost:3994/src/assets/Movies/Posters/${movie.movie_poster}`
                                : ""
                            }
                            alt={movie.movie_title}
                          />
                          <p>
                            {movie.movie_title} - (
                            {onlyYear(movie.movie_release_date)})
                          </p>
                          <label>
                            <p>
                              <strong>Rôle</strong>
                            </p>
                            <input
                              type="text"
                              value={movie.role || ""}
                              onChange={(e) =>
                                updateLocalMovie(cid, "role", e.target.value)
                              }
                            />
                          </label>
                          <label>
                            <p>
                              <strong>Side</strong>
                            </p>
                            <input
                              type="text"
                              value={movie.side || ""}
                              onChange={(e) =>
                                updateLocalMovie(cid, "side", e.target.value)
                              }
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() =>
                              handleRemoveMovie(getMovieCastingId(movie))
                            }
                          >
                            Retirer ce film
                          </button>
                        </div>
                      );
                    })}
                  </HorizontalScroll>
                ) : (
                  <p>Aucun film pour le moment.</p>
                )}
              </div>
              <div className="addMovieFilmography">
                <label>
                  <p>
                    <strong>Ajouter un film</strong>
                  </p>
                  <select
                    value={selectedMovie}
                    onChange={(e) => setSelectedMovie(e.target.value)}
                  >
                    <option value="">-- Sélectionner un film --</option>
                    {moviesList.map((movie) => (
                      <option key={movie.id} value={movie.id}>
                        <img src={movie.poster} alt={movie.title} />
                        {movie.title}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  <p>
                    <strong>Rôle</strong>
                  </p>
                  <input
                    type="text"
                    value={movieRole}
                    placeholder="Rôle dans le film"
                    onChange={(e) => setMovieRole(e.target.value)}
                  />
                </label>
                <label>
                  <p>
                    <strong>Side</strong>
                  </p>
                  <select
                    value={movieSide}
                    onChange={(e) => setMovieSide(e.target.value)}
                  >
                    <option value="">-- Side --</option>
                    <option value="Acting">Acting</option>
                    <option value="Directing">Directing</option>
                  </select>
                </label>
                <button
                  type="button"
                  onClick={handleAddMovie}
                  disabled={!selectedMovie}
                >
                  Ajouter
                </button>
              </div>
            </div>
            <div className="addPersonalitySeriesSection">
              <h4>Séries</h4>
              <div className="addPersonalitySeriesList">
                {personality.series.length ? (
                  <HorizontalScroll>
                  {personality.series.map((serie) => {
                    const cid = getSerieCastingId(serie);
                    return (
                      <div className="addPersonalitySerieCard" key={cid}>
                        <img
                          src={
                            serie.serie_poster &&
                            serie.serie_poster.startsWith("http")
                              ? serie.serie_poster
                              : serie.serie_poster
                              ? `http://localhost:3994/src/assets/Series/Posters/${serie.serie_poster}`
                              : ""
                          }
                          alt={serie.serie_title}
                        />
                        <p>
                          {serie.serie_title} - (
                          {onlyYear(serie.serie_release_date)})
                        </p>
                        <label>
                          <p>
                            <strong>Rôle</strong>
                          </p>
                          <input
                            type="text"
                            value={serie.role || ""}
                            onChange={(e) =>
                              updateLocalSerie(cid, "role", e.target.value)
                            }
                          />
                        </label>
                        <label>
                          <p>
                            <strong>Side</strong>
                          </p>
                          <input
                            type="text"
                            value={serie.side || ""}
                            onChange={(e) =>
                              updateLocalSerie(cid, "side", e.target.value)
                            }
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() =>
                            handleRemoveSerie(getSerieCastingId(serie))
                          }
                        >
                          Retirer cette série
                        </button>
                      </div>
                    );
                  })}
                  </HorizontalScroll>
                ) : (
                  <p>Aucune série pour le moment.</p>
                )}
              </div>
              <div className="addSerieFilmography">
                <label>
                  <p>
                    <strong>Ajouter une série</strong>
                  </p>
                  <select
                    value={selectedSerie}
                    onChange={(e) => setSelectedSerie(e.target.value)}
                  >
                    <option value="">-- Sélectionner une série --</option>
                    {seriesList.map((serie) => (
                      <option key={serie.id} value={serie.id}>
                        <img src={serie.poster} alt={serie.title} />
                        {serie.title}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  <p>
                    <strong>Rôle</strong>
                  </p>
                  <input
                    type="text"
                    value={serieRole}
                    placeholder="Rôle dans la série"
                    onChange={(e) => setSerieRole(e.target.value)}
                  />
                </label>
                <label>
                  <p>
                    <strong>Side</strong>
                  </p>
                  <select
                    value={serieSide}
                    onChange={(e) => setSerieSide(e.target.value)}
                  >
                    <option value="">-- Side --</option>
                    <option value="Acting">Acting</option>
                    <option value="Directing">Directing</option>
                  </select>
                </label>
                <label>
                  <p>
                    <strong>Présence</strong>
                  </p>
                  <input
                    type="text"
                    value={seriePresence}
                    placeholder="Présence dans la série (ex : S1 à S3, ou 1x10)"
                    onChange={(e) => setSeriePresence(e.target.value)}
                  />
                </label>
                <button
                  type="button"
                  onClick={handleAddSerie}
                  disabled={!selectedSerie}
                >
                  Ajouter
                </button>
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
