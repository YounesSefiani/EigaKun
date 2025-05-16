import React from "react";
import { useLoaderData } from "react-router-dom";
import Header from "../../../components/Header/Header";
import HeaderPhone from "../../../components/Header/HeaderPhone/HeaderPhone";
import FooterPhone from "../../../components/Header/FooterPhone/FooterPhone";
import Seasons from "../../../components/SeasonsContainer/SeasonsContainer";
import UserInteractionsButtons from "../../../components/UserInteractionsButtons/UserInteractionsButtons";
import SerieCasting from "../../../components/SerieCasting/SerieCasting";
import "./OneSeriePage.css";

function OneSerie() {
  const serie = useLoaderData();

  const formatDate = (date) => {
    const zero = (number) => (number < 10 ? `0${number}` : number);
    const d = new Date(date);
    const day = zero(d.getDate());
    const month = zero(d.getMonth() + 1);
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const debutDate = formatDate(serie.release_date);
  const endingDate = formatDate(serie.ending_date);

  return (
    <>
      <Header />
      <HeaderPhone />
      <div className="oneSeriePage">
        <div className="oneSerieHeader">
          <img
            className="oneSerieBackground"
            src={serie.background}
            alt={serie.title}
          />
          <div className="oneSerieHeaderContent">
            <div className="oneSeriePoster">
              <UserInteractionsButtons serie={serie} serieId={serie.id} />
              <img src={serie.poster} alt={serie.title} />
            </div>
            <div className="oneSerieHeaderInfos">
              {serie.logo ? (
                <img src={serie.logo} alt={serie.title} />
              ) : (
                <h3>{serie.title}</h3>
              )}
              <div className="oneSerieHeaderInfosContainer">
                <div className="oneSerieDetails">
                  <p>
                    <strong>Dates de diffusion :</strong>
                    <br /> {debutDate} - {endingDate}
                  </p>
                  <p>
                    <strong>Genres :</strong>
                    <br /> {serie.genre}
                  </p>
                  <p>
                    <strong>Themes :</strong>
                    <br /> {serie.theme}
                  </p>
                  <p>
                    <strong>Sortie :</strong>
                    <br /> {serie.screen}
                  </p>
                  <p>
                    <strong>Origine :</strong>
                    <br /> {serie.country}
                  </p>
                  {serie.universe ? (
                    <p>
                      <strong>Univers :</strong>
                      <br /> {serie.universe}
                    </p>
                  ) : null}
                  {serie.subUniverse ? (
                    <p>
                      <strong>Sous-Univers :</strong>
                      <br /> {serie.subUniverse}
                    </p>
                  ) : null}
                  {serie.streaming ? (
                    <p>
                      <strong>Disponible sur :</strong>
                      <br /> {serie.streaming}
                    </p>
                  ) : null}
                  {serie.original ? (
                    <p>
                      <strong>Une production exclusive de :</strong>
                      <br />
                      {serie.original}
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
        <div className="seasons">
          <Seasons seasons={serie.seasons} />
        </div>
        <div className="castingContainer">
          <SerieCasting serieCasting={serie.casting} />
        </div>
      </div>
      <FooterPhone />
    </>
  );
}

export default OneSerie;
