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
          {realisation.length ? (
            <HorizontalScroll>
              {realisation.map((cast) => (
                <li key={cast.id}>
                  <Link to={`/personnalites/${cast.personality_id}`}>
                    <img
                      src={
                        cast.personality_image &&
                        cast.personality_image.startsWith("http")
                          ? cast.personality_image
                          : cast.personality_image
                          ? `http://localhost:3994/src/assets/Personalities/Images/${cast.personality_image}`
                          : ""
                      }
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
          ) : (
            <p>Aucun membre de la réalisation renseigné pour cette œuvre pour le moment.</p>
          )}
        </ul>
      </div>
      <div className="cast">
        <h3>Acteurs & Actrices</h3>
        <ul>
          {acting.length ? (
          <HorizontalScroll>
            {acting.map((cast) => (
              <li key={cast.id}>
                <Link to={`/personnalites/${cast.personality_id}`}>
                  <img
                    src={
                      cast.personality_image &&
                      cast.personality_image.startsWith("http")
                        ? cast.personality_image
                        : cast.personality_image
                        ? `http://localhost:3994/src/assets/Personalities/Images/${cast.personality_image}`
                        : ""
                    }
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
          ) : (
            <p>Aucun acteur ou actrice renseigné pour cette œuvre pour le moment.</p>
          )}
        </ul>
      </div>
    </div>
  );
}

CastingContainer.propTypes = {
  casting: PropTypes.array.isRequired,
};

export default CastingContainer;
