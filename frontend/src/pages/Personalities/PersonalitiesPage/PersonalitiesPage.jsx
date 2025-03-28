import React from "react";
import { useLoaderData, Link } from "react-router-dom";
import Header from "../../../components/Header/Header";
import HeaderPhone from "../../../components/Header/HeaderPhone/HeaderPhone";
import FooterPhone from "../../../components/Header/FooterPhone/FooterPhone";
import HorizontalScroll from "../../../components/HorizontalScroll/HorizontalScroll";
import "./PersonalitiesPage.css";

function PersonalitiesPage() {
  const personalities = useLoaderData();

  return (
    <>
      <Header />
      <HeaderPhone />
      <div className="personalitiesPage">
        <h3>Les Personnalités</h3>
        <div className="personalitiesContainer">
          <div className="personalitiesList">
            <div className="personalitiesListContainer">
              <HorizontalScroll>
                {personalities.map((personality) => (
                  <div className="personalityCard">
                    <Link
                      key={personality.id}
                      to={`/personnalités/${personality.id}`}
                    >
                      {personality.image_src ? (
                        <>
                          <img
                            src={personality.image_src}
                            alt={personality.name}
                          />
                          <p>{personality.fullname}</p>
                        </>
                      ) : (
                        <div className="personalityCardFolder">
                          <p>{personality.name}</p>
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

export default PersonalitiesPage;
