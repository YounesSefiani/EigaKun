import React from "react";
import { Link, useLoaderData } from "react-router-dom";
import HorizontalScroll from "../../../components/HorizontalScroll/HorizontalScroll";
import UserInteractionsButtons from "../../../components/UserInteractionsButtons/UserInteractionsButtons";
import "./OnePersonalityPage.css";

function OnePersonalityPage() {
  const { personality, movies, series } = useLoaderData();

  console.log(movies);

  const formatDate = (date) => {
    const zero = (number) => (number < 10 ? `0${number}` : number);
    const d = new Date(date);
    const day = zero(d.getDate());
    const month = zero(d.getMonth() + 1);
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const onlyYear = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    return `${year}`;
  };

  return (
    <div className="onePersonalityPage">
      <div className="onePersonalityHeader">
        <div className="onePersonalityPicture">
          <UserInteractionsButtons
            favoriteId={personality.id}
            favoriteType="personality"
            fullname={personality.fullname}
          />
          <img
            src={
              personality.image_src && personality.image_src.startsWith("http")
                ? personality.image_src
                : personality.image_src
                ? `http://localhost:3994/src/assets/Personalities/Images/${personality.image_src}`
                : ""
            }
            alt={personality.fullName}
          />
        </div>
        <div className="onePersonalityRightSide">
          <h2>{personality.fullname}</h2>
          <div className="onePersonalityInfos">
            <p>
              {" "}
              Date de naissance :{" "}
              <strong>{formatDate(personality.birthdate)}</strong>
            </p>
            {personality.deathDate ? (
              <p>
                {" "}
                Date de mort : <strong>{personality.deathdate}</strong>
              </p>
            ) : null}
            <p>
              {" "}
              Origine : <strong>{personality.origin}</strong>
            </p>
            <p>
              {" "}
              Profession : <strong>{personality.profession}</strong>
            </p>
          </div>
          <div className="onePersonalityBio">
            <p>{personality.bio}</p>
          </div>
        </div>
      </div>
      <div className="filmography">
        <h3>Filmographie de {personality.fullname}</h3>
        <div className="movieGraphy">
          <h4>Films</h4>
          <div className="movieGraphyList">
            {movies.length > 0 ? (
              movies.map((movie) => (
                <HorizontalScroll>
                  <div className="movieGraphyCard" key={movie.movie_id}>
                    <Link to={`/films/${movie.movie_id}`}>
                      <p>
                        {movie.movie_title} <br /> (
                        {onlyYear(movie.movie_release_date)})
                      </p>
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
                        Rôle: <br />
                        <strong>{movie.role}</strong>
                      </p>
                    </Link>
                  </div>
                </HorizontalScroll>
              ))
            ) : (
              <p>Aucun film pour le moment.</p>
            )}
          </div>
        </div>
        <div className="serieGraphy">
          <h4>Séries</h4>
          <div className="serieGraphyList">
            {series.length > 0 ? (
              series.map((serie) => (
                <HorizontalScroll>
                  <div className="serieGraphyCard" key={serie.serie_id}>
                    <Link to={`/series/${serie.serie_id}`}>
                      <p>
                        {serie.serie_title} <br /> (
                        {onlyYear(serie.serie_release_date)} -
                        {onlyYear(serie.serie_ending_date)})
                      </p>
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
                        Rôle : <br />
                        <strong>{serie.role}</strong>
                      </p>
                      <p>
                        Présence : <br /> <strong>{serie.presence}</strong>{" "}
                      </p>
                    </Link>
                  </div>
                </HorizontalScroll>
              ))
            ) : (
              <p>Aucune série pour le moment.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OnePersonalityPage;
