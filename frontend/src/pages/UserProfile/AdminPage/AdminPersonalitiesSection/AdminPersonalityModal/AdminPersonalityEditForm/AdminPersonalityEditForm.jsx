import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import connexion from "../../../../../../services/connexion";
import HorizontalScroll from "../../../../../../components/HorizontalScroll/HorizontalScroll";
import { AuthContext } from "../../../../../../services/Context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AdminPersonalityEditForm.css";

function AdminPersonalityEditForm({
  personality,
  onUpdate,
  onCancel,
  onDelete,
  movies = [],
  series = [],
}) {
  const [personalityForm, setPersonalityForm] = useState({
    fullname: "",
    birthdate: "",
    deathdate: "",
    image_src: "",
    origin: "",
    profession: "",
    bio: "",
    movies: [],
    series: [],
  });

  const { token } = useContext(AuthContext);

  const [moviesList, setMoviesList] = useState([]);
  const [seriesList, setSeriesList] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState("");
  const [selectedSerie, setSelectedSerie] = useState("");
  // Pour la zone Films
  const [movieRole, setMovieRole] = useState("");
  const [movieSide, setMovieSide] = useState("");

  // Pour la zone Séries
  const [serieRole, setSerieRole] = useState("");
  const [serieSide, setSerieSide] = useState("");
  const [seriePresence, setSeriePresence] = useState("");
  const [image, setImage] = useState({ url: "", file: null });
  const [error, setError] = useState("");

  /* ---------- Helpers IDs (casting pivot) ---------- */
  const getMovieCastingId = (m) => m?.movie_casting_id ?? m?.id ?? m?.movie_id;
  const getSerieCastingId = (s) => s?.serie_casting_id ?? s?.id ?? s?.serie_id;

  /* ---------- Init quand la personnalité change ---------- */
  useEffect(() => {
    setPersonalityForm({
      fullname: personality.fullname || "",
      birthdate: personality.birthdate || "",
      deathdate: personality.deathdate || "",
      image_src: personality.image_src || "",
      origin: personality.origin || "",
      profession: personality.profession || "",
      bio: personality.bio || "",
      movies: movies.length ? movies : personality.movies || [],
      series: series.length ? series : personality.series || [],
    });
    setImage({ url: personality.image_src || "", file: null });
    setError("");
  }, [
    personality.id,
    movies,
    series,
    personality.fullname,
    personality.birthdate,
    personality.deathdate,
    personality.image_src,
    personality.origin,
    personality.profession,
    personality.bio,
    personality.movies,
    personality.series,
  ]);

  /* ---------- Fetch filmographie si vide ---------- */
  useEffect(() => {
    const needFetch =
      personality.id &&
      (!personalityForm.movies.length || !personalityForm.series.length) &&
      (!movies.length || !series.length);
    if (!needFetch) return;

    const fetchFilmography = async () => {
      try {
        const { data } = await connexion.get(
          `/personalities/${personality.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setPersonalityForm((prev) => ({
          ...prev,
          movies: data.movies || prev.movies,
          series: data.series || prev.series,
        }));
      } catch (e) {
        console.error("Erreur filmographie:", e);
      }
    };
    fetchFilmography();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [personality.id]);

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

  /* ---------- Preview image ---------- */
  const previewImage = () => {
    if (image.file) return URL.createObjectURL(image.file);
    if (image.url?.startsWith("http")) return image.url;
    if (image.url)
      return `http://localhost:3994/src/assets/Personalities/Images/${image.url}`;
    return "";
  };

  /* ---------- Form fields change ---------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPersonalityForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddMovie = async () => {
    if (!selectedMovie) return;
    try {
      const movie = moviesList.find((m) => m.id === parseInt(selectedMovie));
      if (!movie) {
        toast.error("Film non trouvé");
        return;
      }
      const response = await connexion.post(
        `/movieCasting`,
        {
          movie_id: movie.id,
          personality_id: personality.id,
          role: movieRole,
          side: movieSide,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPersonalityForm((prev) => ({
        ...prev,
        movies: [
          ...prev.movies,
          {
            id: response.data.id,
            movie_casting_id: response.data.id,
            movie_id: movie.id,
            movie_title: movie.title,
            movie_release_date: movie.release_date,
            movie_poster: movie.poster,
            role: movieRole,
            side: movieSide,
          },
        ],
      }));
      setSelectedMovie("");
      setMovieRole("");
      setMovieSide("");
    } catch (err) {
      setError("Erreur lors de l'ajout du film");
      console.error(err);
    }
  };

  /* ---------- Mise à jour locale film ---------- */
  const updateLocalMovie = (castingId, field, value) => {
    setPersonalityForm((prev) => ({
      ...prev,
      movies: prev.movies.map((m) =>
        getMovieCastingId(m) === castingId ? { ...m, [field]: value } : m
      ),
    }));
  };

  const handleAddSerie = async () => {
    if (!selectedSerie) return;
    try {
      const serie = seriesList.find((m) => m.id === parseInt(selectedSerie));
      if (!serie) {
        toast.error("Série non trouvée");
        return;
      }
      const response = await connexion.post(
        `/serieCasting`,
        {
          serie_id: serie.id,
          personality_id: personality.id,
          role: serieRole,
          side: serieSide,
          presence: seriePresence,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPersonalityForm((prev) => ({
        ...prev,
        series: [
          ...prev.series,
          {
            id: response.data.id,
            serie_casting_id: response.data.id,
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
      setSerieRole("");
      setSerieSide("");
      setSeriePresence("");
    } catch (err) {
      setError("Erreur lors de l'ajout de la serie");
      console.error(err);
    }
  };

  /* ---------- Mise à jour locale série ---------- */
  const updateLocalSerie = (castingId, field, value) => {
    setPersonalityForm((prev) => ({
      ...prev,
      series: prev.series.map((s) =>
        getSerieCastingId(s) === castingId ? { ...s, [field]: value } : s
      ),
    }));
  };

  /* ---------- Envoi API film ---------- */
  const pushMovieCasting = async (castingId) => {
    const movie = personalityForm.movies.find(
      (m) => getMovieCastingId(m) === castingId
    );
    const pivotId = movie?.movie_casting_id;
    if (!movie || !pivotId) {
      toast.error("ID casting film manquant");
      return;
    }
    try {
      await connexion.put(
        `/movieCasting/${pivotId}`,
        { role: movie.role, side: movie.side },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Casting film mis à jour");
    } catch {
      toast.error("Erreur update casting film");
    }
  };

  const handleRemoveMovie = async (castingId) => {
    try {
      await connexion.delete(`/movieCasting/${castingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPersonalityForm((prev) => ({
        ...prev,
        movies: prev.movies.filter((m) => getMovieCastingId(m) !== castingId),
      }));
    } catch (err) {
      setError("Erreur lors de la suppression du membre du casting");
      console.error(err);
    }
  };

  /* ---------- Envoi API série ---------- */
  const pushSerieCasting = async (castingId) => {
    const serie = personalityForm.series.find(
      (s) => getSerieCastingId(s) === castingId
    );
    const pivotId = serie?.serie_casting_id;
    if (!serie || !pivotId) {
      toast.error("ID casting série manquant");
      return;
    }
    try {
      await connexion.put(
        `/serieCasting/${pivotId}`,
        {
          role: serie.role,
          side: serie.side,
          presence: serie.presence,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Casting série mis à jour");
    } catch {
      toast.error("Erreur update casting série");
    }
  };

  const handleRemoveSerie = async (castingId) => {
    try {
      await connexion.delete(`/serieCasting/${castingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPersonalityForm((prev) => ({
        ...prev,
        series: prev.series.filter((s) => getSerieCastingId(s) !== castingId),
      }));
    } catch (err) {
      setError("Erreur lors de la suppression du membre du casting");
      console.error(err);
    }
  };

  /* ---------- Submit personnalité ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("fullname", personalityForm.fullname);
      formData.append("birthdate", personalityForm.birthdate);
      formData.append("deathdate", personalityForm.deathdate);
      formData.append("origin", personalityForm.origin);
      formData.append("profession", personalityForm.profession);
      formData.append("bio", personalityForm.bio);
      formData.append("movies", JSON.stringify(personalityForm.movies));
      formData.append("series", JSON.stringify(personalityForm.series));
      if (image.file) formData.append("image_src", image.file);
      else if (image.url) formData.append("image_src", image.url);

      const { data } = await connexion.put(
        `/personalities/${personality.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success(data?.message || "Personnalité mise à jour");
      onUpdate(data.updatePersonality);
    } catch (err) {
      console.error(err);
      toast.error("Erreur sauvegarde personnalité");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="editPersonalityForm">
      <div className="editPersonalityFormTop">
        <label>
          <p>
            <strong>Nom complet</strong>
          </p>
          <input
            type="text"
            name="fullname"
            value={personalityForm.fullname}
            onChange={handleChange}
          />
        </label>
        <div>
          <button type="submit">Enregistrer</button>
          <button type="button" onClick={onDelete}>
            Supprimer
          </button>
          <button type="button" onClick={onCancel}>
            Annuler
          </button>
        </div>
      </div>
      <div className="editPersonalityFormContent">
        <div className="editPersonalityFormLeft">
          <p>
            <strong>Image :</strong>
          </p>
          <img
            src={previewImage()}
            alt={personalityForm.fullname}
            className="editPersonalityImage"
          />
          <input
            type="text"
            value={image.url}
            placeholder="URL de l'image"
            onChange={(e) => setImage({ url: e.target.value, file: null })}
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage({ url: "", file: e.target.files[0] })}
          />
        </div>
        <div className="editPersonalityFormRight">
          <div className="editPersonalityInfos">
            <label>
              <p>
                <strong>Date de naissance</strong>
              </p>
              <input
                type="date"
                name="birthdate"
                value={personalityForm.birthdate}
                onChange={handleChange}
              />
            </label>
            <label>
              <p>
                <strong>Date de décès</strong>
              </p>
              <input
                type="date"
                name="deathdate"
                value={personalityForm.deathdate}
                onChange={handleChange}
              />
            </label>
            <label>
              <p>
                <strong>Origine</strong>
              </p>
              <input
                type="text"
                name="origin"
                value={personalityForm.origin}
                onChange={handleChange}
              />
            </label>
            <label>
              <p>
                <strong>Profession</strong>
              </p>
              <input
                type="text"
                name="profession"
                value={personalityForm.profession}
                onChange={handleChange}
              />
            </label>
          </div>
          <div className="editPersonalityBio">
            <p>
              <strong>Biographie</strong>
            </p>
            <textarea
              name="bio"
              value={personalityForm.bio}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
      <div className="editPersonalityFilmography">
        <h3>Filmographie de {personalityForm.fullname}</h3>
        <div className="editPersonalityMoviesSection">
          <h4>Films</h4>
          <HorizontalScroll>
            {personalityForm.movies.length ? (
              personalityForm.movies.map((movie) => {
                const cid = getMovieCastingId(movie);
                return (
                  <div className="editPersonalityMovieCard" key={cid}>
                    <img src={movie.movie_poster} alt={movie.movie_title} />
                    <p>
                      {movie.movie_title} (
                      {new Date(movie.movie_release_date).getFullYear()})
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
                      <select
                        value={movie.side || "Acting"}
                        onChange={(e) =>
                          updateLocalMovie(cid, "side", e.target.value)
                        }
                      >
                        <option value="Acting">Acting</option>
                        <option value="Directing">Directing</option>
                      </select>
                    </label>
                    <button
                      type="button"
                      onClick={() => pushMovieCasting(cid)}
                      disabled={!movie.movie_casting_id}
                      title={
                        movie.movie_casting_id
                          ? ""
                          : "ID pivot manquant (ajoute-le côté backend SELECT)"
                      }
                    >
                      Mettre à jour
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveMovie(cid)}
                      disabled={!movie.movie_casting_id}
                      title={
                        movie.movie_casting_id
                          ? ""
                          : "ID pivot manquant (impossible de supprimer)"
                      }
                    >
                      Supprimer
                    </button>
                  </div>
                );
              })
            ) : (
              <p>Aucun film pour le moment.</p>
            )}
          </HorizontalScroll>
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
        <div className="editPersonalitySeriesSection">
          <h4>Séries</h4>
          <HorizontalScroll>
            {personalityForm.series.length ? (
              personalityForm.series.map((serie) => {
                const cid = getSerieCastingId(serie);
                return (
                  <div className="editPersonalitySerieCard" key={cid}>
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
                      {serie.serie_title}
                      <br />({new Date(serie.serie_release_date).getFullYear()})
                      {serie.serie_ending_date &&
                        " - (" +
                          new Date(serie.serie_ending_date).getFullYear() +
                          ")"}
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
                        <strong>Présence</strong>
                      </p>
                      <input
                        type="text"
                        value={serie.presence || ""}
                        onChange={(e) =>
                          updateLocalSerie(cid, "presence", e.target.value)
                        }
                      />
                    </label>
                    {"side" in serie && (
                      <label>
                        <p>
                          <strong>Side</strong>
                        </p>
                        <select
                          value={serie.side || "Acting"}
                          onChange={(e) =>
                            updateLocalSerie(cid, "side", e.target.value)
                          }
                        >
                          <option value="Acting">Acting</option>
                          <option value="Directing">Directing</option>
                        </select>
                      </label>
                    )}
                    <button
                      type="button"
                      onClick={() => pushSerieCasting(cid)}
                      disabled={!serie.serie_casting_id}
                      title={
                        serie.serie_casting_id
                          ? ""
                          : "ID pivot manquant (ajoute-le côté backend SELECT)"
                      }
                    >
                      Mettre à jour
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveSerie(cid)}
                      disabled={!serie.serie_casting_id}
                      title={
                        serie.serie_casting_id
                          ? ""
                          : "ID pivot manquant (impossible de supprimer)"
                      }
                    >
                      Supprimer
                    </button>
                  </div>
                );
              })
            ) : (
              <p>Aucune série pour le moment.</p>
            )}
          </HorizontalScroll>
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
                placeholder="Présence dans la série (ex : Saison 1 à 3, ou 1x10 (Saison 1, épisode 10))"
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
      {error && <p className="formError">{error}</p>}
      <ToastContainer />
    </form>
  );
}

AdminPersonalityEditForm.propTypes = {
  personality: PropTypes.object.isRequired,
  movies: PropTypes.array,
  series: PropTypes.array,
  onUpdate: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default AdminPersonalityEditForm;
