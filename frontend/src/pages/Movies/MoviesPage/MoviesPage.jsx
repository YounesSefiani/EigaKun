import React, { useRef, useState, useEffect } from "react";
import { useLoaderData, Link, Outlet } from "react-router-dom";
import Header from "../../../components/Header/Header";
import HeaderPhone from "../../../components/HeaderPhone/HeaderPhone";
import FooterPhone from "../../../components/FooterPhone/FooterPhone";
import EigaKunLogo from "../../../assets/EigaKunLogo.png";
import "./MoviesPage.css";

function MoviesPage() {
  const movies = useLoaderData();
  const scrollContainerRef = useRef(null);
  const [disableLeft, setDisableLeft] = useState(true);
  const [disableRight, setDisableRight] = useState(false);
  const scrollIntervalRef = useRef(null);

  // Met à jour l'état des flèches
  const scroll = (direction) => {
    const scrollAmount = direction === "left" ? -300 : 300;
    scrollContainerRef.current.scrollBy({
      top: 0,
      left: scrollAmount,
      behavior: "smooth",
    });
  };

  const startScrolling = (direction) => {
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
    }
    scrollIntervalRef.current = setInterval(() => scroll(direction), 70); // Adjust interval time for smoother scrolling
  };

  const stopScrolling = () => {
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
    }
  };

  const handleScroll = () => {
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setDisableLeft(scrollLeft === 0);
    setDisableRight(scrollLeft + clientWidth >= scrollWidth);
  };

  const handleKeyDown = React.useCallback((e) => {
    if (e.key === "ArrowLeft") {
      scroll("left");
    } else if (e.key === "ArrowRight") {
      scroll("right");
    }
  }, []);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    scrollContainer.addEventListener("scroll", handleScroll);
    window.addEventListener("keydown", handleKeyDown);

    handleScroll();

    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <>
      <Header />
      <HeaderPhone />
      <div className="moviesPage">
        <h2>Les films</h2>
        <div className="moviesContainer">
          <button
            type="button"
            onClick={() => scroll("left")}
            className="scroll-btn left-btn"
            disabled={disableLeft}
            onMouseDown={() => startScrolling("left")}
            onMouseUp={stopScrolling}
            onMouseLeave={stopScrolling}
          >
            ←
          </button>{" "}
          <div className="moviesList" ref={scrollContainerRef}>
            {movies.map((film) => (
              <div className="movieCard" key={film.id}>
                <Link to={`/films/${film.id}`}>
                  {film.poster ? (
                    <img src={film.poster} alt={film.title} />
                  ) : (
                    <div className="posterPlaceholder">
                      <img src={EigaKunLogo} alt={film.title} />
                    </div>
                  )}
                  <h3>{film.title}</h3>
                </Link>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => scroll("right")}
            className="scroll-btn right-btn"
            disabled={disableRight}
            onMouseDown={() => startScrolling("right")}
            onMouseUp={stopScrolling}
            onMouseLeave={stopScrolling}
          >
            →
          </button>{" "}
        </div>
      </div>
      <Outlet />
      <FooterPhone />
    </>
  );
}

export default MoviesPage;
