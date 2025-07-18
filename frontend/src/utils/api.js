// Auth
export const loginUser = async (formData) => {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/users/login`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });
  const data = await response.json();
  return data;
};

export const logoutUser = async () => {
  const response = await fetch(
    `${process.env.REACT_APP_API_URL}/users/logout`,
    {
      method: "POST",
      credentials: "include",
    }
  );
  const result = await response.json();
  return { ok: response.ok, result };
};

// Role
export const getRole = async () => {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/users/role`, {
    method: "GET",
    credentials: "include",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });
  if (!response.ok) return null;
  const data = await response.json();
  if (data.success) return data.role;
  return null;
};

// Dashboard
export const getUsersDashboard = async () => {
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
  return data;
};

// Verifikasi
export const getVerifikasiStatus = async () => {
  const response = await fetch(
    `${process.env.REACT_APP_API_URL}/public/public-status`
  );
  if (!response.ok) return null;
  return await response.json();
};

// Pelaporan
export const sendPelaporan = async (formData) => {
  let permintaanValue = formData.permintaan === "Pengadaan" ? 1 : 2;
  const submitData = new FormData();
  Object.entries(formData).forEach(([key, value]) => {
    if (value) submitData.append(key, value);
  });
  submitData.set("permintaan", permintaanValue);
  const response = await fetch(
    `${process.env.REACT_APP_API_URL}/public/add-request`,
    {
      method: "POST",
      body: submitData,
    }
  );
  const result = await response.json();
  return { ok: response.ok, result };
};

// Detail
export const getDetail = async (id) => {
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
  return result;
};

export const updateStatus = async (id, status_id) => {
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
  return result;
};

// User Management
export const getUsers = async () => {
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
  return { ok: response.ok, result };
};

export const addUser = async (username, password, role_id) => {
  const response = await fetch(
    `${process.env.REACT_APP_API_URL}/auth/add-users`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify({ username, password, role_id }),
    }
  );
  const result = await response.json();
  return { ok: response.ok, result };
};

export const updateUser = async (id, newUsername, newPassword) => {
  const response = await fetch(
    `${process.env.REACT_APP_API_URL}/auth/update/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify({ newUsername, newPassword }),
    }
  );
  const result = await response.json();
  return { ok: response.ok, result };
};

export const deleteUser = async (id) => {
  const response = await fetch(
    `${process.env.REACT_APP_API_URL}/auth/delete-user/${id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }
  );
  const result = await response.json();
  return { ok: response.ok, result };
};
