import React, { useEffect } from "react";
import { Container } from "react-bootstrap";
import Spinner from "../components/common/Spinner";
import styles from "../styles/pages/Logout.module.css";

const Logout = () => {
  const [message, setMessage] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [countdown, setCountdown] = React.useState(3);

  useEffect(() => {
    const logoutUser = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/users/logout`,
          {
            method: "POST",
            credentials: "include",
          }
        );

        const result = await response.json();

        if (response.ok) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");

          setMessage(
            "Logout berhasil! Anda akan diarahkan ke halaman utama..."
          );
          setIsSuccess(true);
          setIsLoading(false);

          const redirectTimer = setTimeout(() => {
            window.location.href = "/";
          }, 3000);

          const countdownTimer = setInterval(() => {
            setCountdown((prev) => {
              if (prev <= 1) {
                clearInterval(countdownTimer);
                return 0;
              }
              return prev - 1;
            });
          }, 1000);

          return () => {
            clearTimeout(redirectTimer);
            clearInterval(countdownTimer);
          };
        } else {
          throw new Error(result.message || "Logout gagal.");
        }
      } catch (error) {
        setMessage(error.message);
        setIsSuccess(false);
        setIsLoading(false);
      }
    };

    logoutUser();
  }, []);

  return (
    <div className={styles.logoutContainer}>
      <Container className={styles.container}>
        <div className={styles.logoutCard}>
          <div className={styles.iconContainer}>
            <div className={styles.logoutIcon}>
              {isLoading ? "👋" : isSuccess ? "✅" : "❌"}
            </div>
          </div>

          <h1 className={styles.logoutTitle}>
            {isLoading
              ? "Sedang Logout..."
              : isSuccess
              ? "Logout Berhasil!"
              : "Logout Gagal!"}
          </h1>

          <p className={styles.logoutDescription}>
            {isLoading
              ? "Tunggu sebentar, kami sedang memproses logout Anda"
              : message}
          </p>

          {isLoading && (
            <Spinner
              size="medium"
              text="Memproses logout..."
              variant="primary"
            />
          )}

          {!isLoading && !isSuccess && (
            <div className={styles.errorActions}>
              <button
                className={styles.retryButton}
                onClick={() => (window.location.href = "/")}
              >
                Kembali ke Beranda
              </button>
            </div>
          )}

          {isSuccess && (
            <div className={styles.successMessage}>
              <p className={styles.redirectText}>
                Mengarahkan dalam {countdown} detik...
              </p>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default Logout;
