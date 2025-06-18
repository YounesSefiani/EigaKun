import React from "react";
import { useLoaderData } from "react-router-dom";
import Header from "../../../components/Header/Header";
import HeaderPhone from "../../../components/HeaderPhone/HeaderPhone";
import FooterPhone from "../../../components/FooterPhone/FooterPhone";
import SeasonsContainer from "../../../components/SeasonsContainer/SeasonsContainer";
import EigaKunLogo from "../../../assets/EigaKunLogo.png";
import CastingContainer from "../../../components/CastingContainer/CastingContainer";
import "./OneSeriePage.css";

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
    <>
      <Header />
      <HeaderPhone />
      <div className="oneSeriePage">
        <div className="oneSerieHeader">
          <div className="oneSerieBackground">
            {serie.background ? (
              <img
                src={serie.background}
                alt={`Background de la série ${serie.title}`}
              />
            ) : (
              <div className="oneSerieBackgroundFolder" />
            )}
          </div>
          <div className="oneSerieHeaderContent">
            <div className="oneSeriePoster">
              {serie.poster ? (
                <img src={serie.poster} alt={serie.title} />
              ) : (
                <div className="oneSeriePosterFolder">
                  <img src={EigaKunLogo} alt={serie.title} />
                </div>
              )}
            </div>
            <div className="oneSerieHeaderLeftSide">
              {serie.logo ? (
                <img src={serie.logo} alt={serie.title} />
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
                    Nombre total d'épisodes : <br />
                    <strong>{serie.episodes}</strong>
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
          <h4>Casting de la série "{serie.title}"</h4>
        <CastingContainer casting={serie.casting} />
        </div>
        <div className="reviewsAndTrailer">
          <div className="reviews">
            <h4>Reviews</h4>
          </div>
          <div className="trailer">
            <h4>Trailer de la série "{serie.title}"</h4>
            <iframe src={serie.trailer} title={`Trailer de ${serie.title}`} />
          </div>
        </div>
        <div className="seasonsSection">
          <h3>Les saisons de la série "{serie.title}"</h3>
          <SeasonsContainer seasons={serie.seasons} />
        </div>
      </div>
      <FooterPhone />
    </>
  );
}

export default OneSeriePage;
