import React from "react";
import PropTypes from "prop-types";
import HorizontalScroll from "../HorizontalScroll/HorizontalScroll";
import Episodes from "../EpisodesContainer/EpisodesContainer";
import "./SeasonsContainer.css";

function Seasons({ seasons }) {
  const formatDate = (date) => {
    const zero = (number) => (number < 10 ? `0${number}` : number);
    const d = new Date(date);
    const day = zero(d.getDate());
    const month = zero(d.getMonth() + 1);
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <div className="seasonsContainer">
      <HorizontalScroll>
        {seasons.map((season) => (
          <li key={season.id}>
            <div className="seasonsList">
              <h2>Saison {season.season_number}</h2>
              <div className="seasonPoster">
                <img
                  src={season.poster}
                  alt={`Poster de la saison ${season.season_number}`}
                />
              </div>
              <div className="seasonDetails">
                <p>
                  Dates de diffusion :<br />{" "}
                  {formatDate(season.first_episode_date)} -{" "}
                  {formatDate(season.last_episode_date)}
                </p>
                <p>
                  Nombre d'épisodes :<br />
                  {season.episodes.length} épisodes
                </p>
              </div>
              <Episodes episodes={season.episodes} />
            </div>
          </li>
        ))}
      </HorizontalScroll>
    </div>
  );
}

Seasons.propTypes = {
  seasons: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      season_number: PropTypes.number.isRequired,
      poster: PropTypes.string,
      first_episode_date: PropTypes.string,
      last_episode_date: PropTypes.string,
      synopsis: PropTypes.string,
      episode: PropTypes.number.isRequired,
      episodes: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number.isRequired,
          episode_number: PropTypes.number.isRequired,
          title: PropTypes.string.isRequired,
          image: PropTypes.string,
          release_date: PropTypes.string,
          synopsis: PropTypes.string,
        }),
      ),
    }),
  ).isRequired,
};

export default Seasons;
