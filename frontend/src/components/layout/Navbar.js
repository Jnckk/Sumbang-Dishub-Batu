import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "../../styles/components/layout/navbar.module.css";
import { getRole } from "../../utils/api";

const MainNavbar = () => {
  const location = useLocation();
  const [role, setRole] = useState(null);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const roleData = await getRole();
        setRole(roleData);
      } catch (err) {
        console.error("Error saat fetch role:", err);
      }
    };
    if (location.pathname === "/dashboard") {
      fetchRole();
    }
  }, [location.pathname]);

  return (
    <nav className={styles.customNavbar}>
      <div className={styles.navContainer}>
        <Link to="/" className={styles.navbarBrand}>
          Dinas Perhubungan Kota Batu
        </Link>

        {/* Menu untuk halaman utama */}
        {["/", "/pelaporan", "/verifikasi", "/login"].includes(
          location.pathname
        ) && (
          <>
            {/* Desktop Menu */}
            <div className={styles.desktopMenu}>
              <Link
                to="/"
                className={`${styles.navLink} ${
                  location.pathname === "/" ? styles.active : ""
                }`}
              >
                Home
              </Link>
              <Link
                to="/pelaporan"
                className={`${styles.navLink} ${
                  location.pathname === "/pelaporan" ? styles.active : ""
                }`}
              >
                Lapor
              </Link>
              <Link
                to="/verifikasi"
                className={`${styles.navLink} ${
                  location.pathname === "/verifikasi" ? styles.active : ""
                }`}
              >
                Status
              </Link>
              <Link
                to="/login"
                className={`${styles.navLink} ${
                  location.pathname === "/login" ? styles.active : ""
                }`}
              >
                Login
              </Link>
            </div>

            {/* Mobile Menu */}
            <div className={styles.mobileMenu}>
              <Link
                to="/"
                className={`${styles.mobileNavLink} ${
                  location.pathname === "/" ? styles.active : ""
                }`}
              >
                Home
              </Link>
              <Link
                to="/pelaporan"
                className={`${styles.mobileNavLink} ${
                  location.pathname === "/pelaporan" ? styles.active : ""
                }`}
              >
                Lapor
              </Link>
              <Link
                to="/verifikasi"
                className={`${styles.mobileNavLink} ${
                  location.pathname === "/verifikasi" ? styles.active : ""
                }`}
              >
                Status
              </Link>
              <Link
                to="/login"
                className={`${styles.mobileNavLink} ${
                  location.pathname === "/login" ? styles.active : ""
                }`}
              >
                Login
              </Link>
            </div>
          </>
        )}

        {/* Menu untuk halaman admin */}
        {(location.pathname.startsWith("/detail/") ||
          location.pathname === "/manage-user" ||
          location.pathname === "/dashboard") && (
          <>
            {/* Desktop Admin Menu */}
            <div className={styles.desktopMenu}>
              {location.pathname.startsWith("/detail/") && (
                <Link to="/dashboard" className={styles.navLink}>
                  Dashboard
                </Link>
              )}

              {location.pathname === "/manage-user" && (
                <>
                  <Link to="/dashboard" className={styles.navLink}>
                    Dashboard
                  </Link>
                  <Link to="/logout" className={styles.navLink}>
                    Logout
                  </Link>
                </>
              )}

              {location.pathname === "/dashboard" && role === 1 && (
                <>
                  <Link to="/manage-user" className={styles.navLink}>
                    Manage User
                  </Link>
                  <Link to="/logout" className={styles.navLink}>
                    Logout
                  </Link>
                </>
              )}

              {location.pathname === "/dashboard" && role === 2 && (
                <Link to="/logout" className={styles.navLink}>
                  Logout
                </Link>
              )}
            </div>

            {/* Mobile Admin Menu */}
            <div className={styles.mobileMenu}>
              {location.pathname.startsWith("/detail/") && (
                <Link to="/dashboard" className={styles.mobileNavLink}>
                  Dashboard
                </Link>
              )}

              {location.pathname === "/manage-user" && (
                <>
                  <Link to="/dashboard" className={styles.mobileNavLink}>
                    Dashboard
                  </Link>
                  <Link to="/logout" className={styles.mobileNavLink}>
                    Logout
                  </Link>
                </>
              )}

              {location.pathname === "/dashboard" && role === 1 && (
                <>
                  <Link to="/manage-user" className={styles.mobileNavLink}>
                    Manage User
                  </Link>
                  <Link to="/logout" className={styles.mobileNavLink}>
                    Logout
                  </Link>
                </>
              )}

              {location.pathname === "/dashboard" && role === 2 && (
                <Link to="/logout" className={styles.mobileNavLink}>
                  Logout
                </Link>
              )}
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default MainNavbar;
