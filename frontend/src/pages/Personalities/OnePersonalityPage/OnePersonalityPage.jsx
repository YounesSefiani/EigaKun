import React from "react";
import { Link, useLoaderData } from "react-router-dom";
import Header from "../../../components/Header/Header";
import HeaderPhone from "../../../components/Header/HeaderPhone/HeaderPhone";
import FooterPhone from "../../../components/Header/FooterPhone/FooterPhone";
import HorizontalScroll from "../../../components/HorizontalScroll/HorizontalScroll";
import "./OnePersonalityPage.css";

function OnePersonalityPage() {
  const { personality, movies, series } = useLoaderData();

  const formatDate = (date) => {
    const zero = (number) => (number < 10 ? `0${number}` : number);
    const d = new Date(date);
    const day = zero(d.getDate());
    const month = zero(d.getMonth() + 1);
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const birthDate = formatDate(personality.birthdate);
  const deathDate = formatDate(personality.deathdate);

  const onlyYear = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    return `${year}`;
  };

  return (
    <>
      <Header />
      <HeaderPhone />
      <div className="onePersonalityPage">
        <div className="onePersonalityHeader">
          <div className="onePersonalityPicture">
            <img src={personality.image_src} alt={personality.fullName} />
          </div>
          <div className="onePersonalityContent">
            <h2>{personality.fullname}</h2>
            <div className="onePersonalityDetails">
              <p>Date de naissance : {birthDate}</p>
              {personality.deathDate ? <p>Date de décés: {deathDate}</p> : null}
              <p>Origine : {personality.origin}</p>
              <p>Profession: {personality.profession}</p>
            </div>
            <div className="onePersonalityBio">
              <h3>Biographie</h3>
              <p>{personality.bio}</p>
            </div>
          </div>
        </div>
        <div className="filmography">
          <h3>Filmographie de {personality.fullname}</h3>
          <div className="filmographyContainer">
            <h4>Les films</h4>
            <div className="filmoMoviesList">
              <HorizontalScroll>
                {movies.length > 0 ? (
                  <ul>
                    {movies.map((movie) => (
                      <div className="filmographyCard" key={movie.id}>
                        <Link to={`/films/${movie.id}`}>
                          <p>
                            {movie.title} - ({onlyYear(movie.release_date)})
                          </p>
                          <img src={movie.poster} alt={movie.title} />
                          <p>
                            {" "}
                            Rôle :<br /> {movie.role}
                          </p>
                        </Link>
                      </div>
                    ))}
                  </ul>
                ) : (
                  <div className="filmographyNone">
                    <p>Aucun film à ce jour.</p>
                  </div>
                )}
              </HorizontalScroll>
            </div>
          </div>
          <div className="filmographyContainer">
            <h4>Les séries</h4>
            <div className="filmoSeriesList">
              <HorizontalScroll>
                {series.length > 0 ? (
                  <ul>
                    {series.map((serie) => (
                      <div className="filmographyCard" key={serie.id}>
                        <Link to={`/series/${serie.id}`}>
                          <p>
                            {serie.title}
                            <br />({onlyYear(serie.release_date)} -{" "}
                            {onlyYear(serie.ending_date)})
                          </p>
                          <img src={serie.poster} alt={serie.title} />
                          <p>
                            {" "}
                            Rôle :<br /> {serie.role}
                          </p>
                          <p>
                            Présence :<br /> {serie.presence}
                          </p>
                        </Link>
                      </div>
                    ))}
                  </ul>
                ) : (
                  <div className="filmographyNone">
                    <p>Aucune série à ce jour.</p>
                  </div>
                )}
              </HorizontalScroll>
            </div>
          </div>
        </div>
      </div>
      <FooterPhone />
    </>
  );
}

export default OnePersonalityPage;
