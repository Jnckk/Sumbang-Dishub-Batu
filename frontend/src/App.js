import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Pelaporan from "./pages/Pelaporan";
import Footer from "./components/footer";
import Verifikasi from "./pages/Verifikasi";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Detail from "./pages/Detail";
import ManageUser from "./pages/ManageUser";
import Logout from "./pages/Logout";
import styles from "./App.module.css";

function App() {
  return (
    <Router>
      <div className={styles.root}>
        <div className={styles.mainContent}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/pelaporan" element={<Pelaporan />} />
            <Route path="/verifikasi" element={<Verifikasi />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/detail/:id" element={<Detail />} />
            <Route path="/manage-user" element={<ManageUser />} />
            <Route path="/logout" element={<Logout />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
