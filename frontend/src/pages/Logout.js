import React, { useEffect } from "react";
import { Container, Spinner, Alert } from "react-bootstrap";

const Logout = () => {
  const [message, setMessage] = React.useState(null);

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

          setMessage({ type: "success", text: "Logout berhasil!" });

          setTimeout(() => {
            window.location.href = "/";
          }, 2000);
        } else {
          throw new Error(result.message || "Logout gagal.");
        }
      } catch (error) {
        setMessage({ type: "danger", text: error.message });
      }
    };

    logoutUser();
  }, []);

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <div className="text-center">
        <h2>Silahkan Login Terlebih Dahulu</h2>
        {message ? (
          <Alert variant={message.type} className="mt-3">
            {message.text}
          </Alert>
        ) : (
          <Spinner animation="border" className="mt-3" />
        )}
      </div>
    </Container>
  );
};

export default Logout;
