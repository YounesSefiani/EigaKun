import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import "./HorizontalScroll.css";

function HorizontalScroll({ children }) {
  const scrollContainerRef = useRef(null);
  const [disableLeft, setDisableLeft] = useState(true);
  const [disableRight, setDisableRight] = useState(false);
  const scrollIntervalRef = useRef(null);

  const scroll = (direction) => {
    const scrollAmount = direction === "left" ? -30 : 30;
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
    scrollIntervalRef.current = setInterval(() => scroll(direction), 50); // Adjust interval time for smoother scrolling
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
    <div className="horizontal-scroll-container">
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
      </button>
      <div className="scroll-container" ref={scrollContainerRef}>
        <div className="scroll-content">{children}</div>
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
      </button>
    </div>
  );
}

HorizontalScroll.propTypes = {
  children: PropTypes.node.isRequired,
};

export default HorizontalScroll;
