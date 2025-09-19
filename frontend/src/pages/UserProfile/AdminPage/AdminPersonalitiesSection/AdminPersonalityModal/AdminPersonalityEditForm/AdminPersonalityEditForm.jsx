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
  movies = [], // ← CORRECTION: Valeur par défaut
  series = [], // ← CORRECTION: Valeur par défaut
}) {
  const [personalityForm, setPersonalityForm] = useState({
    fullname: personality.fullname || "",
    birthdate: personality.birthdate || "",
    deathdate: personality.deathdate || "",
    image_src: personality.image_src || "",
    origin: personality.origin || "",
    profession: personality.profession || "",
    bio: personality.bio || "",
    movies: movies || [],
    series: series || [],
  });

  const { token } = useContext(AuthContext);

  const [image, setImage] = useState({
    url: personality.image_src || "",
    file: null,
  });

  
  // ← CORRECTION: Ajouter un useEffect pour récupérer la filmographie si pas de données
  useEffect(() => {
    const fetchFilmography = async () => {
      if ((!movies || movies.length === 0) && personality.id) {
        try {
          const response = await connexion.get(
            `/personalities/${personality.id}/filmography`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          setPersonalityForm((prev) => ({
            ...prev,
            movies: response.data.movies || [],
            series: response.data.series || [],
          }));
        } catch (error) {
          console.error(
            "Erreur lors de la récupération de la filmographie:",
            error
          );
        }
      }
    };

    fetchFilmography();
  }, [personality.id, token, movies, series]);

  const previewImage = (input, localPath) => {
    if (input.file) return URL.createObjectURL(input.file);
    if (input.url && input.url.startsWith("http")) return input.url;
    if (input.url)
      return `http://localhost:3994/src/assets/Personalities/${localPath}/${input.url}`;
    return "";
  };

  const handleChange = (e) => {
    setPersonalityForm({ ...personalityForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
    const formData = new FormData();
    formData.append("fullname", personalityForm.fullname);
    formData.append("birthdate", personalityForm.birthdate);
    formData.append("deathdate", personalityForm.deathdate);
    formData.append("image_src", image.file || image.url);
    formData.append("origin", personalityForm.origin);
    formData.append("profession", personalityForm.profession);
    formData.append("bio", personalityForm.bio);
    formData.append("movies", JSON.stringify(personalityForm.movies));
    formData.append("series", JSON.stringify(personalityForm.series));
    
    const response = await connexion.put(
      `/personalities/${personality.id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    if (response.data?.message) {
      toast.success(response.data.message);
    }
    const updatedPersonality = response.data.updatePersonality;
    onUpdate(updatedPersonality);
    } catch (error) {
      console.error("Error updating personality:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="adminPersonalityEditForm"
      encType="multipart/form-data"
    >
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
            Supprimer la personnalité
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
            src={previewImage(image, "Images")}
            alt={personalityForm.fullname}
            className="editPersonalityImage"
          />
          <label>
            <input
              type="url"
              name="image_src"
              value={image.url}
              onChange={(e) => setImage({ url: e.target.value, file: null })}
              placeholder="URL de l'image"
            />
            <input
              type="file"
              name="image_src"
              accept="image/*"
              onChange={(e) => setImage({ url: "", file: e.target.files[0] })}
            />
          </label>
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
            <label>
              <textarea
                name="bio"
                value={personalityForm.bio}
                onChange={handleChange}
              />
            </label>
          </div>
        </div>
      </div>
      <div className="editPersonalityFilmography">
        <h3>Filmographie de {personalityForm.fullname}</h3>
        <div className="editPersonalityMoviesSection">
          <h4>Films</h4>
          <div className="editPersonalityMoviesList">
            <HorizontalScroll>
              {/* ← CORRECTION: Utiliser personalityForm.movies au lieu de movies */}
              {personalityForm.movies && personalityForm.movies.length > 0 ? (
                personalityForm.movies.map((movie) => (
                  <div
                    className="editPersonalityMovieCard"
                    key={movie.movie_id}
                  >
                    <img src={movie.movie_poster} alt={movie.movie_title} />
                    <p>
                      {movie.movie_title} - (
                      {new Date(movie.movie_release_date).getFullYear()})
                    </p>
                    <label>
                    <p>
                      <strong>Rôle :</strong>
                    </p>
                    <input type="text" value={movie.role} />
                    </label>
                    <label>
                      <p><strong>Side :</strong></p>
                      <select value={movie.side}>
                        <option value="Acting">Acting</option>
                        <option value="Directing">Directing</option>
                      </select>
                    </label>
                  </div>
                ))
              ) : (
                <p>Aucun film pour le moment.</p>
              )}
            </HorizontalScroll>
          </div>
        </div>
        <div className="editPersonalitySeriesSection">
          <h4>Séries</h4>
          <div className="editPersonalitySeriesList">
            <HorizontalScroll>
              {/* ← CORRECTION: Utiliser personalityForm.series au lieu de series */}
              {personalityForm.series && personalityForm.series.length > 0 ? (
                personalityForm.series.map((serie) => (
                  <div
                    className="editPersonalitySerieCard"
                    key={serie.serie_id}
                  >
                    <img src={serie.serie_poster} alt={serie.serie_title} />
                    <p>
                      {serie.serie_title}
                      <br />({new Date(serie.serie_release_date).getFullYear()})
                      - ({new Date(serie.serie_ending_date).getFullYear()})
                    </p>
                    <p>
                      <strong>Rôle :</strong>
                      <br />
                      {serie.role}
                    </p>
                    <p>
                      <strong>Présence dans la série :</strong>
                      <br />
                      {serie.presence}
                    </p>
                  </div>
                ))
              ) : (
                <p>Aucune série pour le moment.</p>
              )}
            </HorizontalScroll>
          </div>
        </div>
      </div>
      <ToastContainer />
    </form>
  );
}

AdminPersonalityEditForm.propTypes = {
  personality: PropTypes.object.isRequired,
  movies: PropTypes.array, // ← CORRECTION: Enlevé .isRequired
  series: PropTypes.array, // ← CORRECTION: Enlevé .isRequired
  onUpdate: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default AdminPersonalityEditForm;
