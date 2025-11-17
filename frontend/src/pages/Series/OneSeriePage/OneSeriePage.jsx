import React from "react";
import { useLoaderData } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faYoutube } from "@fortawesome/free-brands-svg-icons";
import SeasonsContainer from "../../../components/SeasonsContainer/SeasonsContainer";
import EigaKunLogo from "../../../assets/EigaKunLogo.png";
import CastingContainer from "../../../components/CastingContainer/CastingContainer";
import "./OneSeriePage.css";
import UserInteractionsButtons from "../../../components/UserInteractionsButtons/UserInteractionsButtons";

function OneSeriePage() {
  const serie = useLoaderData();

  const formatDate = (date) => {
    const zeroPad = (number) => (number < 10 ? "0" : "") + number;
    const serieDate = new Date(date);
    const day = zeroPad(serieDate.getDate());
    const month = zeroPad(serieDate.getMonth() + 1);
    const year = serieDate.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="oneSeriePage">
      <div className="oneSerieHeader">
        {serie.background ? (
          <img
            src={
              serie.background && serie.background.startsWith("http")
                ? serie.background
                : serie.background
                ? `http://localhost:3994/src/assets/Series/Backgrounds/${serie.background}`
                : ""
            }
            className="oneSerieBackground"
            alt={`Background de la série ${serie.title}`}
          />
        ) : (
          <div className="oneSerieBackgroundFolder" />
        )}
        <div className="oneSerieHeaderContent">
          <div className="oneSerieHeaderContentLeft">
            <UserInteractionsButtons
              favoriteId={serie.id}
              favoriteType="serie"
              isSerie={true}
              title={serie.title}
            />
            {serie.poster ? (
              <img
                src={
                  serie.poster && serie.poster.startsWith("http")
                    ? serie.poster
                    : serie.poster
                    ? `http://localhost:3994/src/assets/Series/Posters/${serie.poster}`
                    : ""
                }
                alt={serie.title}
                className="oneSeriePoster"
              />
            ) : (
              <div className="oneSeriePosterPlaceholder">
                <img src={EigaKunLogo} alt={serie.title} />
                <p>Aucune affiche pour le moment.</p>
              </div>
            )}
          </div>
          <div className="oneSerieHeaderContentRight">
            {serie.logo ? (
              <img
                src={
                  serie.logo && serie.logo.startsWith("http")
                    ? serie.logo
                    : serie.logo
                    ? `http://localhost:3994/src/assets/Series/Logos/${serie.logo}`
                    : ""
                }
                alt={serie.title}
                className="oneSerieLogo"
              />
            ) : (
              <h4>{serie.title}</h4>
            )}
            <div className="oneSerieDetails">
              <div className="oneSerieInfos">
                <p>
                  Dates de diffusion : <br />
                  <strong>
                    {formatDate(serie.release_date)} -{" "}
                    {formatDate(serie.ending_date)}
                  </strong>
                </p>
                <p>
                  Nombre de saisons : <br />
                  <strong>{serie.nbSeasons}</strong>
                </p>
                <p>
                  Nombre total d'épisodes : <br />
                  <strong>{serie.nbEpisodesSerie}</strong>
                </p>
                <p>
                  Genre(s) : <br />
                  <strong>{serie.genre}</strong>
                </p>
                <p>
                  Thème(s) : <br />
                  <strong>{serie.theme}</strong>
                </p>
                <p>
                  Sortie : <br />
                  <strong>{serie.screen}</strong>
                </p>
                <p>
                  Statut : <br />
                  <strong>{serie.statut}</strong>
                </p>
                {serie.original ? (
                  <p>
                    Original: <br />
                    <strong>{serie.original}</strong>
                  </p>
                ) : null}
                {serie.streaming ? (
                  <p>
                    Streaming : <br />
                    <strong>{serie.streaming}</strong>
                  </p>
                ) : null}
                {serie.universe ? (
                  <p>
                    Univers : <br />
                    <strong>{serie.universe}</strong>
                  </p>
                ) : null}
                {serie.subUniverse ? (
                  <p>
                    Sous-univers : <br />
                    <strong>{serie.subUniverse}</strong>
                  </p>
                ) : null}
              </div>
              <div className="oneSerieSynopsis">
                <p>{serie.synopsis}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="castingSection">
        <h3>Casting de la série "{serie.title}"</h3>
        <CastingContainer casting={serie.casting} />
      </div>
      <div className="serieReviewsAndTrailer">
        <div className="serieReviews">
          <h4>Reviews</h4>
        </div>
        <div className="serieTrailer">
          <h4>Trailer de la série "{serie.title}"</h4>
          {serie.trailer ? (
            <iframe src={serie.trailer} title={`Trailer de ${serie.title}`} />
          ) : (
            <div className="oneSerieTrailerPlaceholder">
              <FontAwesomeIcon icon={faYoutube} />
              <p>Aucun trailer disponible pour le moment.</p>
            </div>
          )}
        </div>
      </div>
      <div className="seasonsSection">
        <h3>Les saisons de la série "{serie.title}"</h3>
        <SeasonsContainer seasons={serie.seasons} />
      </div>
    </div>
  );
}

export default OneSeriePage;
