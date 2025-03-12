import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Pelaporan from "./pages/Pelaporan";
import Footer from "./components/footer";
import Verifikasi from "./pages/Verifikasi";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Detail from "./pages/Detail";
import ManageUser from "./pages/ManageUser";
import Logout from "./pages/Logout";
import MainNavbar from "./components/navigationbar";
import fetchRole from "./utils/fetchRole";
import styles from "./App.module.css";

const AppContent = () => {
  const location = useLocation();
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const pagesNeedRole = ["/dashboard", "/manage-user", "/logout"];

    const isDetailPage = location.pathname.startsWith("/detail/");

    if (pagesNeedRole.includes(location.pathname) || isDetailPage) {
      setIsLoading(true);
      const fetchUserRole = async () => {
        const userRole = await fetchRole();
        setRole(userRole);
        setIsLoading(false);
      };
      fetchUserRole();
    }
  }, [location.pathname]);

  return (
    <div className={styles.root}>
      <MainNavbar role={role} />
      <div className={styles.mainContent}>
        {isLoading ? (
          <p className="text-center mt-5">Loading...</p>
        ) : (
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/pelaporan" element={<Pelaporan />} />
            <Route path="/verifikasi" element={<Verifikasi />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard role={role} />} />
            <Route path="/detail/:id" element={<Detail />} />
            <Route path="/manage-user" element={<ManageUser />} />
            <Route path="/logout" element={<Logout />} />
          </Routes>
        )}
      </div>
      <Footer />
    </div>
  );
};

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
