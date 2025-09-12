import React, { useState } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faImage,
  faPanorama,
  faCopyright,
} from "@fortawesome/free-solid-svg-icons";
import AdminSerieEditForm from "./AdminSerieEditForm/AdminSerieEditForm";
import HorizontallScroll from "../../../../../components/HorizontalScroll/HorizontalScroll";
import "./AdminSerieModal.css";
import AdminSerieEpisodesContainer from "./AdminSerieEpisodesModal/AdminSerieEpisodesModal";

function AdminSerieModal({ serie, show, onClose, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);

  if (!show || !serie) return null;

  const casting = serie.casting || [];
  const directing = casting.filter((cast) => cast.side === "Directing");
  const acting = casting.filter((cast) => cast.side === "Acting");

  const seasons = serie.seasons || [];

  const formatDate = (date) => {
    const zeroPad = (number) => (number < 10 ? "0" : "") + number;
    const serieDate = new Date(date);
    const day = zeroPad(serieDate.getDate());
    const month = zeroPad(serieDate.getMonth() + 1);
    const year = serieDate.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Handler pour la mise à jour du serie (appelé à la soumission du formulaire d'édition)
  const handleUpdate = async (formData) => {
    // Appel du parent pour mettre à jour le serie (incluant le casting)
    await onUpdate(formData);
    setIsEditing(false);
  };

  return (
    <>
      <div className="adminSerieOverlay" onClick={onClose} />
      <div className="adminSerieModal">
        {!isEditing ? (
          <div className="adminSerie">
            <div className="adminSerieTop">
              <h2>{serie.title}</h2>
              <div>
                <button onClick={() => setIsEditing(true)}>Modifier</button>
                <button onClick={onClose}>Fermer</button>
              </div>
            </div>
            <div className="adminSerieContent">
              <div className="adminSerieLeft">
                <div>
                  <p>Affiche :</p>
                  {serie.poster ? (
                    <img
                      src={
                        serie.poster && serie.poster.startsWith("http")
                          ? serie.poster
                          : serie.poster
                          ? `http://localhost:3994/src/assets/Series/Posters/${serie.poster}`
                          : ""
                      }
                      className="adminSerieModalPoster"
                      alt={serie.title}
                    />
                  ) : (
                    <div className="adminSerieModalPosterHolder">
                      <FontAwesomeIcon icon={faImage} />
                      <p>Aucune affiche pour le moment.</p>
                    </div>
                  )}
                </div>
                <div>
                  <p>Logo de la série :</p>
                  {serie.logo ? (
                    <img
                      src={
                        serie.logo && serie.logo.startsWith("http")
                          ? serie.logo
                          : serie.logo
                          ? `http://localhost:3994/src/assets/Series/Logos/${serie.logo}`
                          : ""
                      }
                      className="adminSerieModalLogo"
                      alt={serie.title}
                    />
                  ) : (
                    <div className="adminSerieLogoHolder">
                      <FontAwesomeIcon icon={faCopyright} />
                      <p>Aucun logo pour le moment.</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="adminSerieRight">
                {serie.background ? (
                  <div className="adminSerieBackground">
                    <p>Affiche de fond :</p>

                    <img
                      src={
                        serie.background && serie.background.startsWith("http")
                          ? serie.background
                          : serie.background
                          ? `http://localhost:3994/src/assets/Series/Backgrounds/${serie.background}`
                          : ""
                      }
                      alt={serie.title}
                    />
                  </div>
                ) : (
                  <div className="adminSerieBackgroundHolder">
                    <FontAwesomeIcon icon={faPanorama} />
                    <p>Aucun arrière-plan pour le moment.</p>
                  </div>
                )}
                <div className="adminSerieInfos">
                  <p>
                    <strong>Date de début :</strong> <br />{" "}
                    {formatDate(serie.release_date)}
                  </p>
                  <p>
                    <strong>Date de fin :</strong> <br />{" "}
                    {formatDate(serie.ending_date)}
                  </p>
                  <p>
                    <strong>Statut :</strong> <br /> {serie.statut}
                  </p>
                  <p>
                    <strong>Saisons : </strong>
                    <br /> {serie.nbSeasons}
                  </p>
                  <p>
                    <strong>Episodes :</strong> <br /> {serie.nbEpisodesSerie}
                  </p>
                  <p>
                    <strong>Genre(s) :</strong> <br /> {serie.genre}
                  </p>
                  <p>
                    <strong>Thème(s) :</strong> <br /> {serie.theme}
                  </p>
                  <p>
                    <strong>Origine(s) :</strong> <br /> {serie.country}
                  </p>
                  <p>
                    <strong>Sortie :</strong> <br /> {serie.screen}
                  </p>
                  {serie.streaming ? (
                    <p>
                      <strong>Streaming :</strong> <br /> {serie.streaming}
                    </p>
                  ) : null}
                  {serie.universe ? (
                    <p>
                      <strong>Univers :</strong> <br /> {serie.universe}
                    </p>
                  ) : null}
                  {serie.subUniverse ? (
                    <p>
                      <strong>Sous-univers :</strong> <br /> {serie.subUniverse}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
            <div className="adminSerieSynopsisTrailer">
              <div className="adminSerieSynopsis">
                <h3>Synopsis</h3>
                <p>{serie.synopsis}</p>
              </div>
              <div className="adminSerieTrailer">
                <h3>Trailer</h3>
                {serie.trailer ? (
                  <iframe
                    src={serie.trailer}
                    title="trailer"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <p>Aucun trailer pour le moment.</p>
                )}
              </div>
            </div>
            <div className="adminSerieSeasons">
              <h3>Saisons du serie "{serie.title}"</h3>
              <div className="adminSerieSeasonsList">
                <HorizontallScroll>
                  {seasons.length > 0 ? (
                    seasons.map((season) => (
                      <div className="adminSerieSeasonCard" key={season.id}>
                        <h4>Saison {season.season_number}</h4>
                        <img
                          src={
                            season.season_poster &&
                            season.season_poster.startsWith("http")
                              ? season.season_poster
                              : season.season_poster
                              ? `http://localhost:3994/src/assets/Series/Seasons/Posters/${season.season_poster}`
                              : ""
                          }
                          alt={season.title}
                        />
                        <p>
                          <strong>Dates de diffusion :</strong>
                          <br /> {formatDate(season.first_episode_date)} -{" "}
                          {formatDate(season.last_episode_date)}
                        </p>
                        <p>
                          <strong>Nombre d'episodes :</strong>
                          <br />
                          {season.episodes_count}
                        </p>
                        <AdminSerieEpisodesContainer
                          episodes={season.episodes}
                          serieId={serie.id}
                          seasonId={season.id}
                        />
                      </div>
                    ))
                  ) : (
                    <p>Aucune saison pour le moment.</p>
                  )}
                </HorizontallScroll>
              </div>
            </div>
            <div className="adminSerieCasting">
              <h3>Casting du serie "{serie.title}"</h3>
              <div className="adminSerieCastingSection">
                <h3>Realisation</h3>
                <div className="adminSerieCastingList">
                  <HorizontallScroll>
                    {directing.length > 0 ? (
                      directing.map((direction) => (
                        <div
                          className="adminSerieCastingCard"
                          key={direction.id}
                        >
                          <img
                            src={direction.personality_image}
                            alt={direction.personality_fullname}
                          />
                          <p>{direction.personality_fullname}</p>
                          <p>
                            <strong>Role :</strong>
                            <br />
                            {direction.role}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p>Aucun réalisateur pour le moment.</p>
                    )}
                  </HorizontallScroll>
                </div>
              </div>
              <div className="adminSerieCastingSection">
                <h3>Acteurs et Actrices</h3>
                <div className="adminSerieCastingList">
                  <HorizontallScroll>
                    {acting.length > 0 ? (
                      acting.map((actor) => (
                        <div className="adminSerieCastingCard" key={actor.id}>
                          <img
                            src={actor.personality_image}
                            alt={actor.personality_fullname}
                          />
                          <p>{actor.personality_fullname}</p>
                          <p>
                            <strong>Role :</strong>
                            <br />
                            {actor.role}
                          </p>
                          <p>
                            <strong>Présence :</strong>
                            <br />
                            {actor.presence}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p>Aucun acteur pour le moment.</p>
                    )}
                  </HorizontallScroll>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <AdminSerieEditForm
            serie={serie}
            seasons={Array.isArray(serie.seasons) ? serie.seasons : []}
            onUpdate={handleUpdate}
            onCancel={() => setIsEditing(false)}
            onDelete={() => {
              if (typeof onDelete === "function") {
                onDelete(serie.id);
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

AdminSerieModal.propTypes = {
  serie: PropTypes.object,
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
};

export default AdminSerieModal;
