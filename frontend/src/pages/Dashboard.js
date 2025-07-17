import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Table from "../components/common/Table";
import Button from "../components/common/Button";
import Spinner from "../components/common/Spinner";
import styles from "../styles/pages/Dashboard.module.css";

const Dashboard = () => {
  const [dataUsers, setDataUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
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

    fetchUsersDashboard();
  }, [navigate]);

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
      width: "25%",
      align: "left",
      className: styles.thNama,
      cellClassName: styles.tdNama,
    },
    {
      key: "no_hp",
      header: "No HP",
      width: "20%",
      align: "left",
      className: styles.thNoHp,
      cellClassName: styles.tdNoHp,
    },
    {
      key: "lokasi",
      header: "Lokasi",
      width: "32%",
      align: "left",
      className: styles.thLokasi,
      cellClassName: styles.tdLokasi,
    },
    {
      key: "detail",
      header: "Detail",
      width: "15%",
      align: "center",
      className: styles.thDetail,
      cellClassName: styles.tdDetail,
      render: (item) => (
        <div className={styles.detailButtonContainer}>
          <Link to={`/detail/${item.id}`} style={{ textDecoration: "none" }}>
            <Button variant="primary" size="small" icon="👁️">
              Detail
            </Button>
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div className={styles.dashboardContainer}>
      <Container fluid className={styles.container}>
        <div className={styles.headerSection}>
          <h1 className={styles.pageTitle}>Dashboard SUMBANG</h1>
          <p className={styles.pageDescription}>
            Kelola dan pantau semua laporan masyarakat dalam satu tempat
          </p>
        </div>

        {isLoading ? (
          <Spinner
            size="large"
            text="Memuat data dashboard..."
            centered={true}
          />
        ) : (
          <div className={styles.tableSection}>
            <Table
              columns={tableColumns}
              data={dataUsers}
              loading={isLoading}
              noDataMessage="Belum ada laporan yang masuk"
              noDataIcon="📋"
              hover={true}
              responsive={true}
            />
          </div>
        )}
      </Container>
    </div>
  );
};

export default Dashboard;
