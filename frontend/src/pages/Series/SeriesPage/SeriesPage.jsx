import React from "react";
import { useLoaderData, Link, Outlet } from "react-router-dom";
import Header from "../../../components/Header/Header";
import HeaderPhone from "../../../components/HeaderPhone/HeaderPhone";
import FooterPhone from "../../../components/FooterPhone/FooterPhone";
import EigaKunLogo from "../../../assets/EigaKunLogo.png";
import HorizontalScroll from "../../../components/HorizontalScroll/HorizontalScroll";
import "./SeriesPage.css";

function SeriesPage() {
  const series = useLoaderData();

  return (
    <>
      <Header />
      <HeaderPhone />
      <div className="seriesPage">
        <h2>Les series</h2>
        <div className="seriesContainer">
          <div className="seriesList">
            <HorizontalScroll>
              {series.map((serie) => (
                <div className="serieCard" key={serie.id}>
                  <Link to={`/series/${serie.id}`}>
                    {serie.poster ? (
                      <img src={serie.poster} alt={serie.title} />
                    ) : (
                      <div className="posterPlaceholder">
                        <img src={EigaKunLogo} alt={serie.title} />
                      </div>
                    )}
                    <h3>{serie.title}</h3>
                  </Link>
                </div>
              ))}
            </HorizontalScroll>
          </div>
        </div>
      </div>
      <Outlet />
      <FooterPhone />
    </>
  );
}

export default SeriesPage;
