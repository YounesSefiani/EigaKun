import React from "react";
import { useLocation } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "./Carousel.css"; // Import du CSS personnalisé

const slidesData = {
  films: [
    {
      id: "1",
      image:
        "https://image.tmdb.org/t/p/original/yglWkJOd1E2LpNgMd1yPdwKjOqZ.jpg",
      title: "Titre 1",
      logo: "https://image.tmdb.org/t/p/original/tJlfv0hlWBvMXgf8JKEmDc3j2IQ.png",
      text: "Millie Bobby Brown et Chris Pratt dans cette aventure signée Netflix.",
      subText: "Disponible sur Netflix",
    },
    {
      id: "2",
      image:
        "https://image.tmdb.org/t/p/original/qUc0Hol3eP74dbW4YyqT6oRLYgT.jpg",
      title: "Mickey 17",
      logo: "https://image.tmdb.org/t/p/original/ffJVoywEy5F838YkqBljNm0yyit.png",
      text: "Le nouveau film de Bong Joon-ho (Parasite).",
      subText: "Actuellement au cinéma",
    },
    {
      id: "3",
      image:
        "https://image.tmdb.org/t/p/original/z5gEVVNjvCbz3lT33fnQNYgQKak.jpg",
      title: "Until Dawn",
      logo: "",
      text: "L'adaptation du jeu vidéo éponyme.",
      subText: "Prochainement au cinéma",
    },
  ],
  series: [
    {
      id: "1",
      image:
        "https://image.tmdb.org/t/p/original/qHCpG49qxs4owLgmhh0T62ErUZv.jpg",
      title: "Daredevil : Born Again",
      logo: "https://image.tmdb.org/t/p/original/1emeUUplZL2ONAFq45In2zEoHuE.png",
      text: "Le Diable de Hell's Kitchen et le Caïd se retrouvent une nouvelle fois.",
      subText: "L'épisode 4 est enfin disponible sur Disney +.",
    },
    {
      id: "2",
      image:
        "https://image.tmdb.org/t/p/original/7dowXHcFccjmxf0YZYxDFkfVq65.jpg",
      title: "The Last Of Us - Saison 2",
      logo: "https://image.tmdb.org/t/p/original/msYtgZbEo8tAOJ37T50kgqulpKf.png",
      text: "Chaque choix implique un sacrifice.",
      subText: "The Last Of Us, la saison deux, le 14 Avril sur Max.",
    },
    {
      id: "3",
      image:
        "https://image.tmdb.org/t/p/original/w5OqrZKtmBQZFzSqogRYWmb3j8j.jpg",
      title: "Bref 2",
      logo: "https://image.tmdb.org/t/p/original/8Vzts6mBGbg9H35CDI2UGhzA3lu.png",
      text: "Bref, la saison deux est là.",
      subText: "Disponible sur Disney+",
    },
  ],
};

const getCategoryFromPath = (pathname) => {
  if (pathname.includes("films")) return "films";
  if (pathname.includes("series")) return "series";
  return "films"; // Valeur par défaut
};

function ImageTextCarousel() {
  const location = useLocation();
  const category = getCategoryFromPath(location.pathname);
  const slides = slidesData[category] || [];

  return (
    <div className="carousel-container">
      <Carousel
        showThumbs={false}
        showStatus={false}
        infiniteLoop
        autoPlay
        interval={4000}
        renderArrowPrev={(onClickHandler, hasPrev) =>
          hasPrev && (
            <button
              type="button"
              className="custom-arrow left"
              onClick={onClickHandler}
            >
              ❮
            </button>
          )
        }
        renderArrowNext={(onClickHandler, hasNext) =>
          hasNext && (
            <button
              type="button"
              className="custom-arrow right"
              onClick={onClickHandler}
            >
              ❯
            </button>
          )
        }
        renderIndicator={(onClickHandler, isSelected, index) => (
          <button
            type="button"
            className={`custom-dot ${isSelected ? "active" : ""}`}
            onClick={onClickHandler}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") onClickHandler();
            }}
            key={index}
            aria-label={`Go to slide ${index + 1}`}
          />
        )}
      >
        {slides.map((slide) => (
          <div key={slide.id} className="carousel-slide">
            <img
              src={slide.image}
              alt={slide.title}
              className="carousel-image"
            />
            <div className="carousel-text">
              {slide.logo ? (
                <img
                  src={slide.logo}
                  alt={slide.title}
                  className="carousel-logo"
                />
              ) : (
                <h2>{slide.title}</h2>
              )}
              <p>{slide.text}</p>
              <p>{slide.subText}</p>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
}

export default ImageTextCarousel;
