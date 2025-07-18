import React, { useEffect, useState } from "react";
import { Container, Form } from "react-bootstrap";
import Status from "../components/common/Status";
import Table from "../components/common/Table";
import Spinner from "../components/common/Spinner";
import styles from "../styles/pages/Verifikasi.module.css";
import { getVerifikasiStatus } from "../utils/api";

const Verifikasi = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getVerifikasiStatus();
        if (result && result.success) {
          setData(result.data);
        }
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredData = data.filter((item) =>
    Object.values(item).some((value) =>
      String(value).toLowerCase().includes(search.toLowerCase())
    )
  );

  const tableColumns = [
    {
      key: "number",
      header: "No",
      width: "8%",
      align: "center",
      className: styles.thId,
      cellClassName: styles.tdId,
      render: (item, index) => index + 1,
    },
    {
      key: "nama",
      header: "Nama",
      width: "18%",
      align: "left",
      className: styles.thNama,
      cellClassName: styles.tdNama,
    },
    {
      key: "permintaan",
      header: "Permintaan",
      width: "20%",
      align: "left",
      className: styles.thPermintaan,
      cellClassName: styles.tdPermintaan,
    },
    {
      key: "lokasi",
      header: "Lokasi",
      width: "25%",
      align: "left",
      className: styles.thLokasi,
      cellClassName: styles.tdLokasi,
    },
    {
      key: "date",
      header: "Tanggal",
      width: "15%",
      align: "center",
      className: styles.thDate,
      cellClassName: styles.tdDate,
    },
    {
      key: "status",
      header: "Status",
      width: "14%",
      align: "center",
      className: styles.thStatus,
      cellClassName: styles.tdStatus,
      render: (item) => <Status status={item.status} size="small" />,
    },
  ];

  return (
    <div className={styles.verifikasiContainer}>
      <Container fluid className={styles.container}>
        <div className={styles.headerSection}>
          <h1 className={styles.pageTitle}>Status Pelaporan SUMBANG</h1>
          <p className={styles.pageDescription}>
            Pantau perkembangan dan status laporan Anda secara real-time
          </p>
        </div>

        <div className={styles.tableSection}>
          <div className={styles.tableSectionHeader}>
            <div className={styles.searchSection}>
              <div className={styles.searchContainer}>
                <div className={styles.searchIcon}>🔍</div>
                <Form.Control
                  type="text"
                  placeholder="Cari berdasarkan nama, permintaan, lokasi, atau status..."
                  className={styles.searchInput}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className={styles.contentSection}>
            {loading ? (
              <Spinner size="large" text="Memuat data..." centered={true} />
            ) : (
              <Table
                columns={tableColumns}
                data={filteredData}
                loading={loading}
                noDataMessage="Tidak ada data ditemukan"
                noDataIcon="📄"
                hover={true}
                responsive={true}
              />
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Verifikasi;
