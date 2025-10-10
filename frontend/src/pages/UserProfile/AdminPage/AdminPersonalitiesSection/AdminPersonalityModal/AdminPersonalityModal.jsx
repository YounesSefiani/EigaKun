import React, { useState } from "react";
import PropTypes from "prop-types";
import HorizontallScroll from "../../../../../components/HorizontalScroll/HorizontalScroll";
import AdminPersonalityEditForm from "./AdminPersonalityEditForm/AdminPersonalityEditForm";
import "./AdminPersonalityModal.css";

function AdminPersonalityModal({
  personality,
  show,
  onClose,
  onUpdate,
  onDelete,
}) {
  const [isEditing, setIsEditing] = useState(false);

  if (!show || !personality) return null;

  // Si les données viennent du endpoint filmography, la structure est différente
  const personalityData = personality.personality || personality;
  const movies = personality.movies || [];
  const series = personality.series || [];

  const formatDate = (date) => {
    const zeroPad = (number) => (number < 10 ? "0" : "") + number;
    const personalityDate = new Date(date);
    const day = zeroPad(personalityDate.getDate());
    const month = zeroPad(personalityDate.getMonth() + 1);
    const year = personalityDate.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const calculateAge = (birthdate) => {
    const today = new Date();
    const birthDate = new Date(birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const onlyYear = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    return `${year}`;
  };

  const handleUpdate = async (formData) => {
    // Appel du parent pour mettre à jour le film (incluant le casting)
    await onUpdate(formData);
    setIsEditing(false);
  };

  return (
    <>
      <div className="adminPersonalityOverlay" onClick={onClose} />
      <div className="adminPersonalityModal">
        {!isEditing ? (
          <div className="adminPersonality">
            <div className="adminPersonalityTop">
              <h2>{personalityData.fullname}</h2>
              <div>
                <button onClick={() => setIsEditing(true)}>Modifier</button>
                <button onClick={onClose}>Fermer</button>
              </div>
            </div>
            <div className="adminPersonalityContent">
              <div className="adminPersonalityLeft">
                <p>Photo :</p>
                <img
                  src={
                    personalityData.image_src &&
                    personalityData.image_src.startsWith("http")
                      ? personalityData.image_src
                      : personalityData.image_src
                      ? `http://localhost:3994/src/assets/Personalities/Images/${personalityData.image_src}`
                      : ""
                  }
                  className="adminPersonalityPoster"
                  alt={personalityData.fullname}
                />
              </div>
              <div className="adminPersonalityRight">
                <div className="adminPersonalityInfos">
                  <p>
                    <strong>Date de naissance :</strong> <br />{" "}
                    {formatDate(personalityData.birthdate)} (
                    {calculateAge(personalityData.birthdate)} ans)
                  </p>
                  {personalityData.deathdate && (
                    <p>
                      <strong>Date de décès :</strong> <br />{" "}
                      {formatDate(personalityData.deathdate)}
                    </p>
                  )}
                  <p>
                    <strong>Origine :</strong> <br /> {personalityData.origin}
                  </p>
                  <p>
                    <strong>Profession :</strong> <br />{" "}
                    {personalityData.profession}
                  </p>
                </div>
                <div className="adminPersonalityBio">
                  <h3>Biographie</h3>
                  <p>{personalityData.bio}</p>
                </div>
              </div>
            </div>
            <div className="adminPersonalityFilmography">
              <h3>Filmographie de {personalityData.fullname}</h3>
              <div className="adminPersonalityMoviesSection">
                <h3>Films</h3>
                <div className="adminPersonalityMoviesList">
                  <HorizontallScroll>
                    {movies.length > 0 ? (
                      movies.map((movie) => (
                        <div
                          className="adminPersonalityMovieCard"
                          key={movie.movie_id}
                        >
                          <img
                            src={movie.movie_poster && movie.movie_poster.startsWith("http")
                              ? movie.movie_poster
                              : movie.movie_poster
                              ? `http://localhost:3994/src/assets/Movies/Posters/${movie.movie_poster}`
                              : ""}
                            alt={movie.movie_title}
                          />
                          <p>
                            {movie.movie_title} - (
                            {onlyYear(movie.movie_release_date)})
                          </p>
                          <p>
                            <strong>Rôle :</strong>
                            <br />
                            {movie.role}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p>Aucun film pour le moment.</p>
                    )}
                  </HorizontallScroll>
                </div>
              </div>
              <div className="adminPersonalitySeriesSection">
                <h3>Séries</h3>
                <div className="adminPersonalitySeriesList">
                  <HorizontallScroll>
                    {series.length > 0 ? (
                      series.map((serie) => (
                        <div
                          className="adminPersonalitySerieCard"
                          key={serie.serie_id}
                        >
                          <img
                            src={serie.serie_poster && serie.serie_poster.startsWith("http")
                              ? serie.serie_poster
                              : serie.serie_poster
                              ? `http://localhost:3994/src/assets/Series/Posters/${serie.serie_poster}`
                              : ""}
                            alt={serie.serie_title}
                          />
                          <p>
                            {serie.serie_title}
                            <br />({onlyYear(serie.serie_release_date)}) - (
                            {onlyYear(serie.serie_ending_date)})
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
                  </HorizontallScroll>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <AdminPersonalityEditForm
          key={personalityData.id}
            personality={personalityData}
            movies={movies}
            series={series}
            onUpdate={handleUpdate}
            onCancel={() => setIsEditing(false)}
            onDelete={() => {
              if (typeof onDelete === "function") {
                onDelete(personalityData.id);
              }
              setIsEditing(false);
              onClose();
            }}
          />
        )}
      </div>
    </>
  );
}

AdminPersonalityModal.propTypes = {
  personality: PropTypes.object,
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
};

export default AdminPersonalityModal;
