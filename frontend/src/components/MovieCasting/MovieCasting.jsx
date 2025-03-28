import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import HorizontalScroll from "../HorizontalScroll/HorizontalScroll";
import "./MovieCasting.css";

function MovieCasting({ movieCasting }) {
  const realisation = movieCasting.filter(
    (cast) => cast.side === "Realisation",
  );
  const acting = movieCasting.filter((cast) => cast.side === "Acting");

  return (
    <div className="movieCasting">
      <h2>L'équipe du film</h2>
      <div className="castRealisation">
        <h3>Réalisation</h3>
        <HorizontalScroll
          itemWidth={150}
          containerWidth="80%"
          arrowColor="#ffb20c"
        >
          {realisation.map((cast) => (
            <li key={cast.id}>
              {" "}
              {/* Utilisez cast.id ici */}
              <Link to={`/personnalités/${cast.personalities_id}`}>
                <div className="castCard">
                  <img
                    className="castimg"
                    src={cast.personalities_image}
                    alt={cast.personalities_fullname}
                  />
                  <div className="castInfos">
                    <h4>{cast.personalities_fullname}</h4>
                    <p>{cast.role}</p>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </HorizontalScroll>
      </div>
      <div className="castActing">
        <h3>Casting</h3>
        <HorizontalScroll
          itemWidth={150}
          containerWidth="80%"
          arrowColor="#ffb20c"
        >
          {acting.map((cast) => (
            <li key={cast.id}>
              {" "}
              {/* Utilisez cast.id ici */}
              <Link to={`/personnalités/${cast.personalities_id}`}>
                <div className="castCard">
                  <img
                    className="castimg"
                    src={cast.personalities_image}
                    alt={cast.personalities_fullname}
                  />
                  <div className="castInfos">
                    <h4>{cast.personalities_fullname}</h4>
                    <p>{cast.role}</p>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </HorizontalScroll>
      </div>
    </div>
  );
}

MovieCasting.propTypes = {
  movieCasting: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      personalities_id: PropTypes.number.isRequired,
      personalities_fullname: PropTypes.string.isRequired,
      personalities_image: PropTypes.string.isRequired,
      role: PropTypes.string.isRequired,
      side: PropTypes.string.isRequired, // Assurez-vous que `side` est une propriété obligatoire
    }),
  ).isRequired,
};

export default MovieCasting;
