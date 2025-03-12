import React from "react";
import logo from "../images/Logo-dishub.webp";

const LandingPage = () => {

  return (
    <div>
      <div
        className="d-flex flex-column justify-content-start align-items-center"
        style={{ minHeight: "80vh", paddingTop: "5vh" }}
      >
        <img
          src={logo}
          alt="Dishub Logo"
          className="img-fluid"
          style={{ maxWidth: "40%", height: "auto" }}
        />
        <p
          style={{ fontSize: "2rem", fontWeight: "bold", textAlign: "center" }}
        >
          SUMBANG
        </p>
        <p
          style={{ fontSize: "2rem", fontWeight: "bold", textAlign: "center" }}
        >
          Sarana Prasarana Untuk Masyarakat Batu Gampang
        </p>
      </div>
    </div>
  );
};

export default LandingPage;
