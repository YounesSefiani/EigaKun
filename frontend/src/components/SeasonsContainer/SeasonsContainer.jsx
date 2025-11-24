import React, { useRef, useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import HorizontalScroll from "../HorizontalScroll/HorizontalScroll";
import EpisodesContainer from "../EpisodesContainer/EpisodesContainer";
import "./SeasonsContainer.css";

function SeasonsContainer({ seasons }) {
  // const scrollContainerRef = useRef(null);
  // const scrollIntervalRef = useRef(null);
  // const [disableLeft, setDisableLeft] = useState(true);
  // const [disableRight, setDisableRight] = useState(false);

  // Format date utilitaire
  const formatDate = (date) => {
    const zero = (number) => (number < 10 ? `0${number}` : number);
    const d = new Date(date);
    return `${zero(d.getDate())}/${zero(d.getMonth() + 1)}/${d.getFullYear()}`;
  };

  // // Scroll functions
  // const scrollByAmount = 200;
  // const scrollInterval = 100;

  // const scroll = (direction) => {
  //   if (scrollContainerRef.current) {
  //     scrollContainerRef.current.scrollBy({
  //       left: direction * scrollByAmount,
  //       behavior: "auto",
  //     });
  //   }
  // };

  // const startScrolling = (direction) => {
  //   // Scroll immédiat
  //   scroll(direction);
  //   if (scrollIntervalRef.current) return;
  //   scrollIntervalRef.current = setInterval(
  //     () => scroll(direction),
  //     scrollInterval
  //   );
  // };

  // const stopScrolling = () => {
  //   clearInterval(scrollIntervalRef.current);
  //   scrollIntervalRef.current = null;
  // };

  // // Gérer l'état des boutons
  // const handleScroll = useCallback(() => {
  //   const el = scrollContainerRef.current;
  //   if (!el) return;
  //   setDisableLeft(el.scrollLeft === 0);
  //   setDisableRight(el.scrollLeft + el.clientWidth >= el.scrollWidth - 1);
  // }, []);

  // // Flèches clavier
  // const handleKeyDown = useCallback((e) => {
  //   if (e.key === "ArrowLeft") scroll(-1);
  //   if (e.key === "ArrowRight") scroll(1);
  // }, []);

  // useEffect(() => {
  //   const el = scrollContainerRef.current;
  //   if (!el) return;
  //   el.addEventListener("scroll", handleScroll);
  //   window.addEventListener("keydown", handleKeyDown);
  //   handleScroll();
  //   return () => {
  //     el.removeEventListener("scroll", handleScroll);
  //     window.removeEventListener("keydown", handleKeyDown);
  //   };
  // }, [handleScroll, handleKeyDown]);

  return (
    <div className="seasonsContainer">
      {seasons.length ? (
        <>
        <HorizontalScroll>
          <div className="seasonsList" >
            {seasons.map((season) => (
              <div className="seasonCard" key={season.id}>
                <h3>Saison {season.season_number}</h3>
                <img
                  src={
                    season.season_poster &&
                    season.season_poster.startsWith("http")
                      ? season.season_poster
                      : season.season_poster
                      ? `http://localhost:3994/src/assets/Series/Seasons/Posters/${season.season_poster}`
                      : ""
                  }
                  alt={`Poster de la saison ${season.season_number} de la série.`}
                />
                <p>
                  Dates de diffusion :<br />
                  <strong>
                    {formatDate(season.first_episode_date)} -{" "}
                    {formatDate(season.last_episode_date)}
                  </strong>
                </p>
                <p>
                  Nombre d'épisodes :<br />
                  <strong>{season.episodes.length} épisodes</strong>
                </p>
                <EpisodesContainer episodes={season.episodes} />
              </div>
            ))}
          </div>
        </HorizontalScroll>
        </>
      ) : (
        <p>Aucune saison renseignée pour le moment.</p>
      )}
    </div>
  );
}

SeasonsContainer.propTypes = {
  seasons: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      season_number: PropTypes.number.isRequired,
      poster: PropTypes.string,
      first_episode_date: PropTypes.string,
      last_episode_date: PropTypes.string,
      synopsis: PropTypes.string,
      episodes: PropTypes.array.isRequired,
    })
  ).isRequired,
};

export default SeasonsContainer;
