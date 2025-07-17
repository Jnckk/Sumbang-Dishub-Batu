import { useEffect, useState, useCallback } from "react";
import { Container, Form } from "react-bootstrap";
import Button from "../components/common/Button";
import Modal from "../components/common/Modal";
import Table from "../components/common/Table";
import Spinner from "../components/common/Spinner";
import Notification from "../components/common/Notification";
import styles from "../styles/pages/ManageUser.module.css";

const ManageUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [updating, setUpdating] = useState(false);

  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "info",
  });

  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState("1");
  const [adding, setAdding] = useState(false);

  const showNotification = (message, type = "info") => {
    setNotification({
      show: true,
      message,
      type,
    });
  };

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/auth/list-users`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      const result = await response.json();

      if (response.ok) {
        setUsers(result.users);
      } else {
        throw new Error(result.message || "Gagal mengambil data pengguna.");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      showNotification("Gagal memuat data pengguna", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleAddUser = async () => {
    if (!newUsername || !newPassword) {
      showNotification("Username dan password tidak boleh kosong!", "warning");
      return;
    }

    setAdding(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/auth/add-users`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify({
            username: newUsername,
            password: newPassword,
            role_id: parseInt(newRole, 10),
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        showNotification("User berhasil ditambahkan!", "success");
        fetchUsers();
        setShowAddModal(false);
        setNewUsername("");
        setNewPassword("");
        setNewRole("1");
      } else {
        throw new Error(result.message || "Gagal menambahkan user.");
      }
    } catch (error) {
      console.error("Error adding user:", error);
      showNotification(error.message, "error");
    } finally {
      setAdding(false);
    }
  };

  const handleEditUser = async () => {
    if (!selectedUser) return;

    if (!newUsername && !newPassword) {
      showNotification(
        "Harap isi setidaknya username atau password baru!",
        "warning"
      );
      return;
    }

    setUpdating(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/auth/update/${selectedUser.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify({
            newUsername: newUsername || undefined,
            newPassword: newPassword || undefined,
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        showNotification("User berhasil diperbarui!", "success");
        fetchUsers();
        setShowEditModal(false);
        setNewUsername("");
        setNewPassword("");
      } else {
        throw new Error(result.message || "Gagal memperbarui user.");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      showNotification(error.message, "error");
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    setDeleting(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/auth/delete-user/${selectedUser.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      const result = await response.json();

      if (response.ok) {
        showNotification("User berhasil dihapus!", "success");
        setUsers(users.filter((user) => user.id !== selectedUser.id));
        setShowDeleteModal(false);
      } else {
        throw new Error(result.message || "Gagal menghapus user.");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      showNotification(error.message, "error");
    } finally {
      setDeleting(false);
    }
  };

  const tableData = users.map((user) => ({
    id: user.id,
    username: user.username,
    role: user.role === 1 ? "SuperAdmin" : "Admin",
    actions: (
      <div className={styles.actionButtons}>
        <Button
          variant="warning"
          size="small"
          icon="✏️"
          onClick={() => {
            setSelectedUser(user);
            setNewUsername("");
            setNewPassword("");
            setShowEditModal(true);
          }}
        >
          Edit
        </Button>
        <Button
          variant="danger"
          size="small"
          icon="🗑️"
          onClick={() => {
            setSelectedUser(user);
            setShowDeleteModal(true);
          }}
        >
          Hapus
        </Button>
      </div>
    ),
  }));

  const tableColumns = [
    {
      key: "id",
      header: "ID",
      width: "35%",
      align: "left",
    },
    {
      key: "username",
      header: "Username",
      width: "25%",
      align: "left",
      render: (item) => <strong>{item.username}</strong>,
    },
    {
      key: "role",
      header: "Role",
      width: "15%",
      align: "center",
      render: (item) => <span className={styles.roleTag}>{item.role}</span>,
    },
    {
      key: "actions",
      header: "Aksi",
      width: "25%",
      align: "center",
      render: (item) => item.actions,
    },
  ];

  return (
    <div className={styles.manageUserContainer}>
      <Container className={styles.container}>
        <div className={styles.headerSection}>
          <h1 className={styles.pageTitle}>Kelola Pengguna</h1>
          <p className={styles.pageDescription}>
            Manajemen pengguna sistem SUMBANG
          </p>
        </div>

        <div className={styles.tableSection}>
          <div className={styles.tableSectionHeader}>
            <div className={styles.tableTitle}>
              <h2>Daftar Pengguna</h2>
            </div>
            <div className={styles.tableActions}>
              <Button
                variant="primary"
                icon="➕"
                onClick={() => {
                  setNewUsername("");
                  setNewPassword("");
                  setNewRole("1");
                  setShowAddModal(true);
                }}
              >
                Tambah Pengguna
              </Button>
            </div>
          </div>

          <div className={styles.contentSection}>
            {loading ? (
              <Spinner
                size="large"
                text="Memuat data pengguna..."
                centered={true}
              />
            ) : (
              <Table
                columns={tableColumns}
                data={tableData}
                hover={true}
                responsive={true}
                noDataMessage="Tidak ada pengguna"
                noDataIcon="👥"
              />
            )}
          </div>
        </div>
      </Container>

      <Modal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        title="Tambah Pengguna"
        showConfirmButton={true}
        showCancelButton={true}
        confirmText="Tambah"
        cancelText="Batal"
        onConfirm={handleAddUser}
        onCancel={() => setShowAddModal(false)}
        loading={adding}
      >
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder="Masukkan username"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Masukkan password"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Role</Form.Label>
            <Form.Select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
            >
              <option value="1">SuperAdmin</option>
              <option value="2">Admin</option>
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal>

      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        title="Edit Pengguna"
        showConfirmButton={true}
        showCancelButton={true}
        confirmText="Update"
        cancelText="Batal"
        confirmVariant="warning"
        onConfirm={handleEditUser}
        onCancel={() => setShowEditModal(false)}
        loading={updating}
      >
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Username Baru</Form.Label>
            <Form.Control
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder="Masukkan username baru"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password Baru</Form.Label>
            <Form.Control
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Masukkan password baru"
            />
          </Form.Group>
        </Form>
      </Modal>

      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        title="Konfirmasi Hapus"
        type="confirmation"
        showConfirmButton={true}
        showCancelButton={true}
        confirmText="Hapus"
        cancelText="Batal"
        confirmVariant="danger"
        onConfirm={handleDeleteUser}
        onCancel={() => setShowDeleteModal(false)}
        loading={deleting}
      >
        <p>
          Apakah Anda yakin ingin menghapus pengguna{" "}
          <strong>{selectedUser?.username}</strong>?
        </p>
      </Modal>

      {/* Notification */}
      <Notification
        message={notification.message}
        type={notification.type}
        show={notification.show}
        onClose={() => setNotification((prev) => ({ ...prev, show: false }))}
        duration={4000}
        position="top-right"
      />
    </div>
  );
};

export default ManageUser;
