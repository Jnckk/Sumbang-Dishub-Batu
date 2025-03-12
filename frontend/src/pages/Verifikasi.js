import React, { useEffect, useState } from "react";
import { Container, Table, Card, Form, Spinner } from "react-bootstrap";
import styles from "../css/pages/Verifikasi.module.css";

const Verifikasi = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const API_URL = process.env.REACT_APP_API_URL + "/public/public-status";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(API_URL);
        const result = await response.json();
        if (result.success) {
          setData(result.data);
        }
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [API_URL]);

  const filteredData = data.filter((item) =>
    Object.values(item).some((value) =>
      String(value).toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <>
      <Container className="mt-5">
        <div className="text-center mb-4">
          <h2>Status Pelaporan SUMBANG</h2>
        </div>

        <div className={`mb-4 d-flex justify-content-center`}>
          <Form.Group controlId="search" className="w-100 w-md-40">
            <Form.Control
              type="text"
              placeholder="Cari berdasarkan nama, permintaan, lokasi, status, atau tanggal"
              className={styles.searchInput}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Form.Group>
        </div>

        {loading ? (
          <div className="text-center">
            <Spinner animation="border" />
          </div>
        ) : (
          <>
            <div className="d-none d-md-block">
              <Table striped bordered hover className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.colId}>ID</th>
                    <th className={styles.colNama}>Nama</th>
                    <th className={styles.colPermintaan}>Permintaan</th>
                    <th className={styles.colLokasi}>Lokasi</th>
                    <th className={styles.colDate}>Date</th>
                    <th className={styles.colStatus}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.length > 0 ? (
                    filteredData.map((item, index) => {
                      const statusClass =
                        styles[`status${item.status.replace(/\s+/g, "")}`];
                      return (
                        <tr key={index}>
                          <td className={styles.colId}>{index + 1}</td>
                          <td className={styles.colNama}>{item.nama}</td>
                          <td className={styles.colPermintaan}>
                            {item.permintaan}
                          </td>
                          <td className={styles.colLokasi}>{item.lokasi}</td>
                          <td className={styles.colDate}>{item.date}</td>
                          <td className={`${styles.colStatus} ${statusClass}`}>
                            {item.status}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center">
                        Tidak ada data ditemukan
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </>
        )}

        <div className="d-block d-md-none">
          {filteredData.length > 0 ? (
            filteredData.map((item, index) => {
              const statusClass =
                styles[`status${item.status.replace(/\s+/g, "")}`];

              return (
                <Card
                  className="mb-3 shadow-sm"
                  key={index}
                  style={{ border: "1px solid #ddd", borderRadius: "8px" }}
                >
                  <Card.Body>
                    <Table borderless size="sm" className={styles.mobileTable}>
                      <tbody>
                        <tr>
                          <td className="fw-bold">ID</td>
                          <td>:</td>
                          <td>{index + 1}</td>
                        </tr>
                        <tr>
                          <td className="fw-bold">Nama</td>
                          <td>:</td>
                          <td>{item.nama}</td>
                        </tr>
                        <tr>
                          <td className="fw-bold">Permintaan</td>
                          <td>:</td>
                          <td>{item.permintaan}</td>
                        </tr>
                        <tr>
                          <td className="fw-bold">Lokasi</td>
                          <td>:</td>
                          <td>{item.lokasi}</td>
                        </tr>
                        <tr>
                          <td className="fw-bold">Date</td>
                          <td>:</td>
                          <td>{item.date}</td>
                        </tr>
                        <tr>
                          <td className="fw-bold">Status</td>
                          <td>:</td>
                          <td className={statusClass}>{item.status}</td>
                        </tr>
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              );
            })
          ) : (
            <p className="text-center">Tidak ada data ditemukan</p>
          )}
        </div>
      </Container>
    </>
  );
};

export default Verifikasi;
