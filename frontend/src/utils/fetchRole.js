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
      return null;
    }

    const data = await response.json();

    if (data.success) {
      return data.role;
    }

    return null;
  } catch (err) {
    console.error("Error saat fetch role:", err);
    return null;
  }
};

export default fetchRole;
