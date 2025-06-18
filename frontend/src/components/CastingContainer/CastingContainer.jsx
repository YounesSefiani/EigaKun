import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import HorizontalScroll from "../HorizontalScroll/HorizontalScroll";
import "./CastingContainer.css";

function CastingContainer({ casting }) {
  const realisation = casting.filter((cast) => cast.side === "Directing");
  const acting = casting.filter((cast) => cast.side === "Acting");

  return (
    <div className="casting">
      <div className="cast">
        <h3>Réalisation</h3>
        <ul>
          <HorizontalScroll>
          {realisation.map((cast) => (
            <li key={cast.id}>
              <Link to={`/personnalites/${cast.personality_id}`}>
                <img
                  src={cast.personality_image}
                  alt={cast.personality_fullname}
                />
                <h4>{cast.personality_fullname}</h4>
                <p>
                  <strong>{cast.role}</strong>
                </p>
              </Link>
            </li>
          ))}
          </HorizontalScroll>
        </ul>
      </div>
      <div className="cast">
        <h3>Acteurs & Actrices</h3>
        <ul>
          <HorizontalScroll>
          {acting.map((cast) => (
            <li key={cast.id}>
              <Link to={`/personnalites/${cast.personality_id}`}>
                <img
                  src={cast.personality_image}
                  alt={cast.personality_fullname}
                />
                <h4>{cast.personality_fullname}</h4>
                <p>
                  Role : <br />
                  <strong>{cast.role}</strong>
                </p>
                {cast.presence ? (
                  <p>
                    Présence : <br />
                    <strong>{cast.presence}</strong>
                  </p>
                ) : null}
              </Link>
            </li>
          ))}
          </HorizontalScroll>
        </ul>
      </div>
    </div>
  );
}

CastingContainer.propTypes = {
  casting: PropTypes.array.isRequired,
};

export default CastingContainer;
