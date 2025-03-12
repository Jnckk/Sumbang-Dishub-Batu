import React, { useEffect, useState } from "react";
import {
  Table,
  Container,
  Button,
  Modal,
  Spinner,
  Form,
  Card,
} from "react-bootstrap";

const ManageUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [updating, setUpdating] = useState(false);

  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState("1");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
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
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setShowMessageModal(true);
  };

  const handleAddUser = async () => {
    if (!newUsername || !newPassword) {
      showMessage("Username dan password tidak boleh kosong!");
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
        showMessage("User berhasil ditambahkan!");
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
      showMessage(error.message);
    } finally {
      setAdding(false);
    }
  };

  const handleEditUser = async () => {
    if (!selectedUser) return;

    if (!newUsername && !newPassword) {
      showMessage("Harap isi setidaknya username atau password baru!");
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
        showMessage("User berhasil diperbarui!");
        fetchUsers();
        setShowEditModal(false);
        setNewUsername("");
        setNewPassword("");
      } else {
        throw new Error(result.message || "Gagal memperbarui user.");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      showMessage(error.message);
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
        showMessage("User berhasil dihapus!");
        setUsers(users.filter((user) => user.id !== selectedUser.id));
        setShowDeleteModal(false);
      } else {
        throw new Error(result.message || "Gagal menghapus user.");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      showMessage(error.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <Container className="mt-5">
        <div className="d-flex justify-content-between mb-3">
          <h2>Manage Users</h2>
          <Button variant="primary" onClick={() => setShowAddModal(true)}>
            Add User
          </Button>
        </div>

        {loading ? (
          <div className="text-center">
            <Spinner animation="border" />
          </div>
        ) : (
          <>
            <Table striped bordered hover className="d-none d-md-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Role</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.username}</td>
                      <td>{user.role === 1 ? "SuperAdmin" : "Admin"}</td>
                      <td>
                        <Button
                          variant="warning"
                          className="me-2"
                          onClick={() => {
                            setSelectedUser(user);
                            setShowEditModal(true);
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => {
                            setSelectedUser(user);
                            setShowDeleteModal(true);
                          }}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">
                      Tidak ada pengguna.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>

            <div className="d-block d-md-none">
              {users.length > 0 ? (
                users.map((user) => (
                  <Card key={user.id} className="mb-3 shadow-sm">
                    <Card.Body>
                      <Card.Body>
                        <Card.Title className="fw-bold">
                          {user.username}
                        </Card.Title>
                        <div>
                          <Table borderless size="sm" className="m-0">
                            <tbody>
                              <tr>
                                <td className="fw-bold">ID</td>
                                <td>:</td>
                                <td>{user.id}</td>
                              </tr>
                              <tr>
                                <td className="fw-bold">Role</td>
                                <td>:</td>
                                <td>
                                  {user.role === 1 ? "SuperAdmin" : "Admin"}
                                </td>
                              </tr>
                            </tbody>
                          </Table>
                        </div>
                      </Card.Body>

                      <div className="d-flex">
                        <Button
                          variant="warning"
                          className="me-2"
                          onClick={() => {
                            setSelectedUser(user);
                            setShowEditModal(true);
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => {
                            setSelectedUser(user);
                            setShowDeleteModal(true);
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                ))
              ) : (
                <p className="text-center">Tidak ada pengguna.</p>
              )}
            </div>
          </>
        )}

        <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Add User</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="Enter username"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter password"
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
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
              Batal
            </Button>
            <Button variant="primary" onClick={handleAddUser} disabled={adding}>
              {adding ? "Adding..." : "Add"}
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit User</Modal.Title>
          </Modal.Header>
          <Modal.Body>
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
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Batal
            </Button>
            <Button
              variant="warning"
              onClick={handleEditUser}
              disabled={updating}
            >
              {updating ? "Updating..." : "Update"}
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Deletion</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              Apakah Anda yakin ingin menghapus pengguna{" "}
              <strong>{selectedUser?.username}</strong>?
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowDeleteModal(false)}
              disabled={deleting}
            >
              Batal
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteUser}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Hapus"}
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal
          show={showMessageModal}
          onHide={() => setShowMessageModal(false)}
        >
          <Modal.Header closeButton>
            <Modal.Title>Pesan</Modal.Title>
          </Modal.Header>
          <Modal.Body>{message}</Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowMessageModal(false)}
            >
              OK
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
};

export default ManageUser;
