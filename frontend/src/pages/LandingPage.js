import logo from "../assets/images/Logo-dishub.webp";
import styles from "../styles/pages/LandingPage.module.css";

const LandingPage = () => {
  return (
    <div className="pageContainer">
      <div className={styles.heroSection}>
        <div className="contentWrapper">
          <div className={styles.logoContainer}>
            <img src={logo} alt="Dishub Logo" className={styles.logo} />
          </div>
          <div className={styles.titleContainer}>
            <h1 className={styles.mainTitle}>SUMBANG</h1>
            <p className={styles.subtitle}>
              Sarana Prasarana Untuk Masyarakat Batu Gampang
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
