import React from "react";
import Footer from "./Footer";
import NavB from './NavBar';

function HomeLiveArt() {
  const styles = {
    homeContainer: {
      position: "relative",
      width: "100%",
      overflow: "hidden",
    },
    bannerContainer: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      height: "100vh",
      backgroundImage: `url('/images/banner-background.jpg')`, // Update with actual image path
      backgroundSize: "cover",
      backgroundPosition: "center",
      color: "white",
      padding: "0 20px",
    },
    leftContent: {
      display: "flex",
      flexDirection: "column",
      textAlign: "left",
      padding: "20px",
    },
    mainTitle: {
      fontSize: "4rem",
      fontWeight: "bold",
      marginBottom: "20px",
      textShadow: "2px 2px 10px rgba(0, 0, 0, 0.7)",
    },
    subtitle: {
      fontSize: "1.5rem",
      marginBottom: "30px",
      textShadow: "1px 1px 5px rgba(0, 0, 0, 0.5)",
    },
    button: {
      padding: "12px 30px",
      fontSize: "1.2rem",
      borderRadius: "30px",
      backgroundColor: "#ffc107",
      color: "#2c2c2c",
      border: "none",
      cursor: "pointer",
      transition: "all 0.3s ease-in-out",
      boxShadow: "0 3px 8px rgba(0, 0, 0, 0.3)",
    },
    buttonHover: {
      backgroundColor: "#f8b700",
    },
    rightContent: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flex: 1,
    },
    productImage: {
      maxWidth: "100%",
      height: "auto",
    },
    collectionInfo: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      textAlign: "center",
      padding: "20px",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      borderRadius: "10px",
    },
    collectionTitle: {
      fontSize: "2rem",
      fontWeight: "bold",
      color: "#ffc107",
    },
    collectionButton: {
      marginTop: "15px",
      padding: "12px 30px",
      backgroundColor: "#f8b700",
      color: "#2c2c2c",
      borderRadius: "30px",
      fontSize: "1rem",
    },
  };

  return (
    
        <div>
            <NavB />
        <div>
      <div style={styles.homeContainer}>
        {/* Banner Section */}
        <div style={styles.bannerContainer}>
          <div style={styles.leftContent}>
            <h1 style={styles.mainTitle}>Live Art Clothings</h1>
            <p style={styles.subtitle}>
              Discover our newest drop. Quality that elevates your style.
            </p>
            <button
              style={styles.button}
              onMouseOver={(e) =>
                (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)
              }
              onMouseOut={(e) => (e.target.style.backgroundColor = "#ffc107")}
            >
              Shop New
            </button>
          </div>
          <div style={styles.rightContent}>
            <img
              src="https://img.freepik.com/free-photo/girl-with-trendy-hairstyle-dressed-green-clothes-looks-away-poses-against-urban-grey-wall-considers-something_273609-54807.jpg?semt=ais_hybrid&w=740" // Replace with actual image path
              alt="Collection Model"
              style={styles.productImage}
            />
          </div>
        </div>

        {/* Collection Info */}
        <div style={styles.collectionInfo}>
          <h2 style={styles.collectionTitle}>LIVE ART CLOTHINGS PVT LTD</h2>
          <button style={styles.collectionButton}>Shop All</button>
        </div>
      </div>
      <Footer />
    </div>
    </div>
  );
}

export default HomeLiveArt;
