import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import styles from "../css/components/footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.customFooter}>
      <Container>
        <Row>
          <Col md={6} className={styles.textCenter}>
            <h4>About Us</h4>
            <p>sarana prasarana untuk masyarakat batu gampang.</p>
          </Col>
          <Col md={6} className={styles.textCenter}>
            <h4>Contact</h4>
            <p>
              <i className={`bi bi-envelope ${styles.contactIcon}`}></i>
              Email:{" "}
              <a
                href="mailto:lalin.dishubkwb@gmail.com"
                className={styles.whiteLink}
              >
                lalin.dishubkwb@gmail.com
              </a>
            </p>
            <p>
              <i className={`bi bi-instagram ${styles.contactIcon}`}></i>
              Instagram:{" "}
              <a
                href="https://www.instagram.com/dishubkotabatu"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.whiteLink}
              >
                @dishubkotabatu
              </a>
            </p>
          </Col>
        </Row>
        <Row>
          <Col className={styles.textCenter}>
            <p>&copy; 2024 Dinas Perhubungan Kota Batu.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;