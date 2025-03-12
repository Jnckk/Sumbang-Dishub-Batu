import React, { useState, useEffect } from "react";
import {
  Table,
  Container,
  Row,
  Col,
  Button,
  Modal,
  Spinner,
} from "react-bootstrap";
import { useParams } from "react-router-dom";
import styles from "../css/pages/Detail.module.css";

const Detail = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [isAuthenticated] = useState(true);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const fetchDetail = async () => {
    setPageLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/users/detail/${id}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      const result = await response.json();

      if (result.success) {
        setData(result.data);

        if (result.newAccessToken) {
          localStorage.setItem("accessToken", result.newAccessToken);
        }
      } else {
        console.error("Gagal mengambil detail:", result.message);
      }
    } catch (err) {
      console.error("Error saat fetch detail:", err);
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const handleStatusChange = async (status_id) => {
    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/users/edit-status/${id}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify({ status_id }),
        }
      );

      const result = await response.json();

      if (result.success) {
        setModalMessage("Status berhasil diperbarui!");
        fetchDetail();
      } else {
        setModalMessage("Gagal memperbarui status.");
      }
    } catch (err) {
      setModalMessage("Terjadi kesalahan saat memperbarui status.");
    } finally {
      setLoading(false);
      setShowModal(true);
    }
  };

  if (!isAuthenticated) {
    return (
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <div className="text-center">
          <h2>Silahkan Login Terlebih Dahulu</h2>
        </div>
      </Container>
    );
  }

  if (pageLoading) {
    return (
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <>
      <Container className="mt-5">
        <h2 className="mb-4">Detail Pelaporan</h2>
        <Row>
          <Col md={8}>
            <Table striped bordered hover className={styles.tableCustom}>
              <tbody>
                <tr>
                  <td className={styles.colNama}>Nama</td>
                  <td>{data.nama}</td>
                </tr>
                <tr>
                  <td>Alamat</td>
                  <td>{data.alamat}</td>
                </tr>
                <tr>
                  <td>No HP</td>
                  <td>{data.no_hp}</td>
                </tr>
                <tr>
                  <td>No Whatsapp</td>
                  <td>
                    <a
                      href={data.no_whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Go To Whatsapp
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>Permintaan</td>
                  <td>{data.permintaan}</td>
                </tr>
                <tr>
                  <td>Detail Permintaan</td>
                  <td>{data.detail_permintaan}</td>
                </tr>
                <tr>
                  <td>Lokasi</td>
                  <td>{data.lokasi}</td>
                </tr>
                <tr>
                  <td>Status</td>
                  <td>{data.status}</td>
                </tr>
                <tr>
                  <td>Surat</td>
                  <td>
                    {data.surat ? (
                      <a
                        href={data.surat}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary"
                        style={{
                          textDecoration: "underline",
                          fontWeight: "bold",
                        }}
                      >
                        Lihat Surat
                      </a>
                    ) : (
                      "Tidak ada surat"
                    )}
                  </td>
                </tr>
              </tbody>
            </Table>
          </Col>
          <Col
            md={4}
            className="d-flex justify-content-center align-items-center"
          >
            {data.foto ? (
              <div className={styles.imageContainer}>
                <img
                  src={data.foto}
                  alt="Detail"
                  style={{
                    maxWidth: "100%",
                    height: "auto",
                    border: "5px solid #272a2f",
                  }}
                />
              </div>
            ) : (
              <p>No image available</p>
            )}
          </Col>
        </Row>

        <Row className="mt-0">
          <Col className="d-flex gap-2 justify-content-start flex-wrap">
            {data.status === "Verification" && (
              <>
                <Button
                  variant="success"
                  onClick={() => handleStatusChange(3)}
                  disabled={loading}
                >
                  {loading ? (
                    <Spinner size="sm" animation="border" />
                  ) : (
                    "Approve"
                  )}
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleStatusChange(2)}
                  disabled={loading}
                >
                  {loading ? (
                    <Spinner size="sm" animation="border" />
                  ) : (
                    "Reject"
                  )}
                </Button>
              </>
            )}

            {data.status === "Approved" && (
              <>
                <Button
                  variant="warning"
                  onClick={() => handleStatusChange(4)}
                  disabled={loading}
                >
                  {loading ? <Spinner size="sm" animation="border" /> : "Hold"}
                </Button>
                <Button
                  variant="primary"
                  onClick={() => handleStatusChange(5)}
                  disabled={loading}
                >
                  {loading ? (
                    <Spinner size="sm" animation="border" />
                  ) : (
                    "Process"
                  )}
                </Button>
              </>
            )}

            {(data.status === "On Hold" || data.status === "On Process") && (
              <Button
                variant="secondary"
                onClick={() => handleStatusChange(6)}
                disabled={loading}
              >
                {loading ? <Spinner size="sm" animation="border" /> : "Done"}
              </Button>
            )}
          </Col>
        </Row>
      </Container>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Notifikasi</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Tutup
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Detail;
