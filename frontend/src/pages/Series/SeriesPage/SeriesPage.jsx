import React from "react";
import { Link, useLoaderData } from "react-router-dom";
import HorizontalScroll from "../../../components/HorizontalScroll/HorizontalScroll";
import Carousel from "../../../components/Carousel/Carousel";
import Header from "../../../components/Header/Header";
import HeaderPhone from "../../../components/Header/HeaderPhone/HeaderPhone";
import FooterPhone from "../../../components/Header/FooterPhone/FooterPhone";
import "./SeriesPage.css";

function SeriesPage() {
  const series = useLoaderData();

  return (
    <>
      <Header />
      <HeaderPhone />
      <div className="seriesPage">
        <Carousel />
        <div className="seriesContainer">
          <div className="seriesList">
            <h3>Les séries</h3>
            <div className="seriesListContainer">
              <HorizontalScroll>
                {series.map((serie) => (
                  <div className="serieCard">
                    <Link key={serie.id} to={`/series/${serie.id}`}>
                      {serie.poster ? (
                        <img src={serie.poster} alt={serie.title} />
                      ) : (
                        <div className="serieCardFolder">
                          <p>{serie.title}</p>
                        </div>
                      )}
                    </Link>
                  </div>
                ))}
              </HorizontalScroll>
            </div>
          </div>
        </div>
      </div>
      <FooterPhone />
    </>
  );
}

export default SeriesPage;
