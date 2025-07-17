import { Container, Row, Col } from "react-bootstrap";
import styles from "../../styles/components/layout/footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.modernFooter}>
      <div className={styles.footerContent}>
        <Container>
          <Row className={styles.footerRow}>
            <Col lg={6} md={6} className={styles.footerSection}>
              <div className={styles.brandSection}>
                <h3 className={styles.brandTitle}>SUMBANG</h3>
                <p className={styles.brandDesc}>
                  Sarana Prasarana Untuk Masyarakat Batu Gampang
                </p>
                <div className={styles.brandHighlight}>
                  <span>Melayani dengan</span>
                  <span className={styles.heartIcon}>❤️</span>
                  <span>untuk Kota Batu</span>
                </div>
              </div>
            </Col>

            <Col lg={6} md={6} className={styles.footerSection}>
              <h4 className={styles.sectionTitle}>Kontak Kami</h4>
              <div className={styles.contactList}>
                <div className={styles.contactItem}>
                  <div className={styles.contactIcon}>
                    <i className="bi bi-envelope-fill"></i>
                  </div>
                  <div className={styles.contactInfo}>
                    <span className={styles.contactLabel}>Email</span>
                    <a
                      href="mailto:lalin.dishubkwb@gmail.com"
                      className={styles.contactLink}
                    >
                      lalin.dishubkwb@gmail.com
                    </a>
                  </div>
                </div>

                <div className={styles.contactItem}>
                  <div className={styles.contactIcon}>
                    <i className="bi bi-instagram"></i>
                  </div>
                  <div className={styles.contactInfo}>
                    <span className={styles.contactLabel}>Instagram</span>
                    <a
                      href="https://www.instagram.com/dishubkotabatu"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.contactLink}
                    >
                      @dishubkotabatu
                    </a>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <div className={styles.footerBottom}>
        <Container>
          <Row>
            <Col className={styles.copyRight}>
              <p>
                © 2024 Dinas Perhubungan Kota Batu.
                <span className={styles.separator}>|</span>
                All rights reserved.
              </p>
            </Col>
          </Row>
        </Container>
      </div>
    </footer>
  );
};

export default Footer;
