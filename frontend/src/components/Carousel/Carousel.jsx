import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "./Carousel.css"; // Import du CSS personnalisé

const slides = [
  {
    id: "slide1",
    image:
      "https://image.tmdb.org/t/p/original/yglWkJOd1E2LpNgMd1yPdwKjOqZ.jpg",
    title: "Titre 1",
    logo: "https://image.tmdb.org/t/p/original/tJlfv0hlWBvMXgf8JKEmDc3j2IQ.png",
    text: "Millie Bobby Brown et Chris Pratt dans cette aventure signée Netflix. Disponible sur Netflix.",
  },
  {
    id: "slide2",
    image:
      "https://image.tmdb.org/t/p/original/qUc0Hol3eP74dbW4YyqT6oRLYgT.jpg",
    title: "Mickey 17",
    logo: "https://image.tmdb.org/t/p/original/ffJVoywEy5F838YkqBljNm0yyit.png",
    text: "Le nouveau film de Bong Joon-ho (Parasite), maintenant au cinéma.",
  },
  {
    id: "slide3",
    image:
      "https://image.tmdb.org/t/p/original/z5gEVVNjvCbz3lT33fnQNYgQKak.jpg",
    title: "Until Dawn",
    logo: "",
    text: "L'adaptation du jeu vidéo éponyme, prochainement au cinéma.",
  },
];

function ImageTextCarousel() {
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
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
}

export default ImageTextCarousel;
