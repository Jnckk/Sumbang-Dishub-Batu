import React, { useEffect, useState } from "react";
import { Table, Button, Container, Card, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import styles from "../css/pages/Dashboard.module.css";

const Dashboard = () => {
  const [role, setRole] = useState(null);
  const [dataUsers, setDataUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/users/role`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );

        if (!response.ok) {
          console.error("Gagal mendapatkan role:", response.status);
          return;
        }

        const data = await response.json();

        if (data.success) {
          setRole(data.role);
        }
      } catch (err) {
        console.error("Error saat fetch role:", err);
      }
    };

    const fetchUsersDashboard = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/users/users-dashboard`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );

        const data = await response.json();

        if (data.success) {
          setDataUsers(data.data);

          if (data.newAccessToken) {
            localStorage.setItem("accessToken", data.newAccessToken);
          }
        } else {
          console.error("Gagal mengambil data dashboard:", data.message);
        }
      } catch (err) {
        console.error("Error saat fetch users-dashboard:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRole();
    fetchUsersDashboard();
  }, [navigate]);

  return (
    <>
      <Container className="mt-5">
        <h2 className="text-center mb-4">Dashboard</h2>

        {isLoading ? (
          <div className="text-center my-5">
            <Spinner animation="border" />
          </div>
        ) : (
          <>
            <div className={styles.tableContainer}>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th className={styles.dashboardId}>No</th>
                    <th className={styles.dashboardNama}>Nama</th>
                    <th className={styles.dashboardNohp}>No HP</th>
                    <th className={styles.dashboardLokasi}>Lokasi</th>
                    <th className={styles.dashboardDetail}>Detail</th>
                  </tr>
                </thead>
                <tbody>
                  {dataUsers.length > 0 ? (
                    dataUsers.map((item, index) => (
                      <tr key={item.id}>
                        <td className={styles.dashboardId}>{index + 1}</td>
                        <td className={styles.dashboardNama}>{item.nama}</td>
                        <td className={styles.dashboardNohp}>{item.no_hp}</td>
                        <td className={styles.dashboardLokasi}>
                          {item.lokasi}
                        </td>
                        <td className={styles.dashboardDetail}>
                          <Link to={`/detail/${item.id}`}>
                            <Button variant="info">Detail</Button>
                          </Link>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center">
                        Tidak ada data
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>

            <div className={styles.cardContainer}>
              {dataUsers.length > 0 ? (
                dataUsers.map((item, index) => (
                  <Card key={item.id} className="mb-3">
                    <Card.Body>
                      <div className={styles.cardText}>
                        <span className={styles.cardLabel}>No</span>
                        <span className={styles.cardValue}>: {index + 1}</span>
                      </div>
                      <div className={styles.cardText}>
                        <span className={styles.cardLabel}>Nama</span>
                        <span className={styles.cardValue}>: {item.nama}</span>
                      </div>
                      <div className={styles.cardText}>
                        <span className={styles.cardLabel}>No HP</span>
                        <span className={styles.cardValue}>: {item.no_hp}</span>
                      </div>
                      <div className={styles.cardText}>
                        <span className={styles.cardLabel}>Lokasi</span>
                        <span className={styles.cardValue}>
                          : {item.lokasi}
                        </span>
                      </div>
                      <Link
                        to={`/detail/${item.id}`}
                        className={styles.cardLink}
                      >
                        <Button variant="info">DETAIL</Button>
                      </Link>
                    </Card.Body>
                  </Card>
                ))
              ) : (
                <div className="text-center">Tidak ada data</div>
              )}
            </div>
          </>
        )}
      </Container>
    </>
  );
};

export default Dashboard;
