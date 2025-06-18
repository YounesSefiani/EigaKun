import React from "react";
import { useLoaderData, Link, Outlet } from "react-router-dom";
import Header from "../../../components/Header/Header";
import HeaderPhone from "../../../components/HeaderPhone/HeaderPhone";
import FooterPhone from "../../../components/FooterPhone/FooterPhone";
import EigaKunLogo from "../../../assets/EigaKunLogo.png";
import HorizontalScroll from "../../../components/HorizontalScroll/HorizontalScroll";
import "./PersonalitiesPage.css";

function PersonalitiesPage() {
  const personalities = useLoaderData();


  return (
    <>
      <Header />
      <HeaderPhone />
      <div className="personalitiesPage">
        <h2>Les personalities</h2>
        <div className="personalitiesContainer">
          <div className="personalitiesList">
            <HorizontalScroll>
            {personalities.map((personality) => (
              <div className="personalityCard" key={personality.id}>
                <Link to={`/personnalites/${personality.id}`}>
                  {personality.image_src ? (
                    <img src={personality.image_src} alt={personality.fullname} />
                  ) : (
                    <div className="posterPlaceholder">
                      <img src={EigaKunLogo} alt={personality.fullname} />
                    </div>
                  )}
                  <h3>{personality.fullname}</h3>
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

export default PersonalitiesPage;
