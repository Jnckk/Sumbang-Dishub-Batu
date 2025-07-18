import { useState } from "react";
import { Form, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Button from "../components/common/Button";
import styles from "../styles/pages/Login.module.css";
import { loginUser } from "../utils/api";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const data = await loginUser(formData);
      if (!data.success) {
        setError(data.message);
        setIsLoading(false);
        return;
      }
      navigate("/dashboard");
    } catch (err) {
      setError("Gagal melakukan login.");
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <Container className={styles.container}>
        <Row className="justify-content-center">
          <Col lg={5} md={6} sm={8} xs={11}>
            <div className={styles.loginCard}>
              <div className={styles.headerSection}>
                <div className={styles.logoContainer}>
                  <div className={styles.logoIcon}>🔐</div>
                </div>
                <h2 className={styles.loginTitle}>Selamat Datang</h2>
                <p className={styles.loginSubtitle}>
                  Masuk ke dashboard SUMBANG untuk mengelola laporan
                </p>
              </div>

              {error && (
                <div className={styles.errorAlert}>
                  <span className={styles.errorIcon}>⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              <Form onSubmit={handleSubmit} className={styles.loginForm}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Username</label>
                  <div className={styles.inputWrapper}>
                    <div className={styles.inputIcon}>
                      <i className="bi bi-person-fill"></i>
                    </div>
                    <input
                      required
                      type="text"
                      placeholder="Masukkan username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      disabled={isLoading}
                      className={styles.formInput}
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Password</label>
                  <div className={styles.inputWrapper}>
                    <div className={styles.inputIcon}>
                      <i className="bi bi-lock-fill"></i>
                    </div>
                    <input
                      required
                      type="password"
                      placeholder="Masukkan password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      disabled={isLoading}
                      className={styles.formInput}
                    />
                  </div>
                </div>

                <div className={styles.buttonContainer}>
                  <Button
                    variant="primary"
                    size="large"
                    type="submit"
                    disabled={isLoading}
                    loading={isLoading}
                    icon={isLoading ? null : "🚀"}
                    style={{ width: "100%" }}
                  >
                    {isLoading ? "Sedang masuk..." : "Masuk ke Dashboard"}
                  </Button>
                </div>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
