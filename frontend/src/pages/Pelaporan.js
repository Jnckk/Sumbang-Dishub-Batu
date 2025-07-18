import { useState } from "react";
import { Form, Container } from "react-bootstrap";
import Button from "../components/common/Button";
import Modal from "../components/common/Modal";
import Notification from "../components/common/Notification";
import styles from "../styles/pages/Pelaporan.module.css";
import { sendPelaporan } from "../utils/api";

const Pelaporan = () => {
  const [formData, setFormData] = useState({
    nama: "",
    alamat: "",
    no_whatsapp: "",
    no_hp: "",
    permintaan: "",
    detail_permintaan: "",
    lokasi: "",
    surat: null,
    foto: null,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [sameAsHP, setSameAsHP] = useState(true);
  const [sameAsAddress, setSameAsAddress] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "info",
  });

  const showNotification = (message, type = "info") => {
    setNotification({
      show: true,
      message,
      type,
    });
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "no_hp" && sameAsHP) {
      setFormData((prevData) => ({
        ...prevData,
        [name]: files ? files[0] : value,
        no_whatsapp: files ? files[0] : value,
      }));
    } else if (name === "alamat" && sameAsAddress) {
      setFormData((prevData) => ({
        ...prevData,
        [name]: files ? files[0] : value,
        lokasi: files ? files[0] : value,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: files ? files[0] : value,
      }));
    }

    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    }
  };

  const handleSameAsHPChange = (e) => {
    const isChecked = e.target.checked;
    setSameAsHP(isChecked);

    if (isChecked) {
      setFormData((prevData) => ({
        ...prevData,
        no_whatsapp: prevData.no_hp,
      }));
    }
  };

  const handleSameAsAddressChange = (e) => {
    const isChecked = e.target.checked;
    setSameAsAddress(isChecked);

    if (isChecked) {
      setFormData((prevData) => ({
        ...prevData,
        lokasi: prevData.alamat,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nama) newErrors.nama = "Nama tidak boleh kosong.";
    if (!formData.alamat) newErrors.alamat = "Alamat tidak boleh kosong.";
    if (!formData.no_hp) newErrors.no_hp = "No HP tidak boleh kosong.";
    if (!formData.no_whatsapp)
      newErrors.no_whatsapp = "No Whatsapp tidak boleh kosong.";
    if (!formData.permintaan) newErrors.permintaan = "Harap pilih permintaan.";
    if (!formData.detail_permintaan)
      newErrors.detail_permintaan = "Detail permintaan tidak boleh kosong.";
    if (!formData.lokasi) newErrors.lokasi = "Lokasi tidak boleh kosong.";

    if (!formData.surat) {
      newErrors.surat = "File surat wajib diunggah.";
    } else {
      const allowedPdf = ["application/pdf"];
      if (!allowedPdf.includes(formData.surat.type)) {
        newErrors.surat = "File surat harus dalam format PDF.";
      }
      if (formData.surat.size > 5 * 1024 * 1024) {
        newErrors.surat = "Ukuran file surat maksimal 5MB.";
      }
    }

    if (!formData.foto) {
      newErrors.foto = "Foto wajib diunggah.";
    } else {
      const allowedImages = ["image/jpeg", "image/png", "image/jpg"];
      if (!allowedImages.includes(formData.foto.type)) {
        newErrors.foto = "Foto harus dalam format JPG, JPEG, atau PNG.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleKirim = () => {
    const isValid = validateForm();
    if (isValid) {
      setShowModal(true);
    } else {
      showNotification(
        "Mohon lengkapi semua field yang wajib diisi!",
        "warning"
      );
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setShowModal(false);
      return;
    }
    setLoading(true);
    try {
      const { ok, result } = await sendPelaporan(formData);
      if (ok) {
        showNotification(
          "Pelaporan berhasil dikirim! Terima kasih atas laporan Anda.",
          "success"
        );
        setFormData({
          nama: "",
          alamat: "",
          no_whatsapp: "",
          no_hp: "",
          permintaan: "",
          detail_permintaan: "",
          lokasi: "",
          surat: null,
          foto: null,
        });
        setSameAsHP(true);
        setSameAsAddress(false);
      } else {
        throw new Error(result.message || "Gagal mengirim laporan.");
      }
    } catch (error) {
      showNotification(
        error.message || "Terjadi kesalahan saat mengirim laporan.",
        "error"
      );
    } finally {
      setLoading(false);
      setShowModal(false);
    }
  };

  return (
    <>
      <div className={styles.pelaporanContainer}>
        <Container>
          <div className={styles.headerSection}>
            <h1 className={styles.pageTitle}>Form Pelaporan SUMBANG</h1>
            <p className={styles.pageDescription}>
              Sampaikan keluhan, saran, atau permintaan Anda untuk sarana dan
              prasarana transportasi di Kota Batu dengan mudah dan cepat.
            </p>
          </div>

          <div className={styles.formContainer}>
            <Form onSubmit={(e) => e.preventDefault()}>
              {/* Data Pribadi */}
              <div className={styles.formSection}>
                <h3 className={styles.sectionTitle}>
                  <span className={styles.sectionIcon}>1</span>
                  Data Pribadi
                </h3>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Nama Lengkap</label>
                    <input
                      type="text"
                      name="nama"
                      className={styles.formControl}
                      placeholder="Masukkan nama lengkap"
                      value={formData.nama}
                      onChange={handleChange}
                    />
                    {errors.nama && (
                      <div className={styles.errorMessage}>
                        ⚠️ {errors.nama}
                      </div>
                    )}
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Alamat</label>
                    <input
                      type="text"
                      name="alamat"
                      className={styles.formControl}
                      placeholder="Masukkan alamat lengkap"
                      value={formData.alamat}
                      onChange={handleChange}
                    />
                    {errors.alamat && (
                      <div className={styles.errorMessage}>
                        ⚠️ {errors.alamat}
                      </div>
                    )}
                  </div>
                </div>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Nomor HP</label>
                    <input
                      type="tel"
                      name="no_hp"
                      className={styles.formControl}
                      placeholder="Contoh: 08123456789"
                      value={formData.no_hp}
                      onChange={handleChange}
                    />
                    {errors.no_hp && (
                      <div className={styles.errorMessage}>
                        ⚠️ {errors.no_hp}
                      </div>
                    )}
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Nomor WhatsApp</label>
                    <div className={styles.whatsappGroup}>
                      <input
                        type="tel"
                        name="no_whatsapp"
                        className={styles.formControl}
                        placeholder="Contoh: 08123456789"
                        value={formData.no_whatsapp}
                        onChange={handleChange}
                        disabled={sameAsHP}
                      />
                      <div className={styles.checkboxGroup}>
                        <label className={styles.checkboxLabel}>
                          <input
                            type="checkbox"
                            checked={sameAsHP}
                            onChange={handleSameAsHPChange}
                            className={styles.checkbox}
                          />
                          <span className={styles.checkboxText}>
                            Sama dengan No HP
                          </span>
                        </label>
                      </div>
                    </div>
                    {errors.no_whatsapp && (
                      <div className={styles.errorMessage}>
                        ⚠️ {errors.no_whatsapp}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Detail Permintaan */}
              <div className={styles.formSection}>
                <h3 className={styles.sectionTitle}>
                  <span className={styles.sectionIcon}>2</span>
                  Detail Permintaan
                </h3>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Jenis Permintaan</label>
                    <select
                      name="permintaan"
                      className={`${styles.formControl} ${styles.selectControl}`}
                      value={formData.permintaan}
                      onChange={handleChange}
                    >
                      <option value="">Pilih jenis permintaan</option>
                      <option value="Pengadaan">
                        Pengadaan Sarana/Prasarana
                      </option>
                      <option value="Perbaikan">
                        Perbaikan Sarana/Prasarana
                      </option>
                    </select>
                    {errors.permintaan && (
                      <div className={styles.errorMessage}>
                        ⚠️ {errors.permintaan}
                      </div>
                    )}
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Lokasi</label>
                    <div className={styles.locationGroup}>
                      <input
                        type="text"
                        name="lokasi"
                        className={styles.formControl}
                        placeholder="Contoh: Jl. Raya Batu No. 123"
                        value={formData.lokasi}
                        onChange={handleChange}
                        disabled={sameAsAddress}
                      />
                      <div className={styles.checkboxGroup}>
                        <label className={styles.checkboxLabel}>
                          <input
                            type="checkbox"
                            checked={sameAsAddress}
                            onChange={handleSameAsAddressChange}
                            className={styles.checkbox}
                          />
                          <span className={styles.checkboxText}>
                            Sama dengan Alamat
                          </span>
                        </label>
                      </div>
                    </div>
                    {errors.lokasi && (
                      <div className={styles.errorMessage}>
                        ⚠️ {errors.lokasi}
                      </div>
                    )}
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Detail Permintaan</label>
                  <textarea
                    name="detail_permintaan"
                    className={`${styles.formControl} ${styles.textareaControl}`}
                    placeholder="Jelaskan detail permintaan Anda secara lengkap..."
                    value={formData.detail_permintaan}
                    onChange={handleChange}
                  />
                  {errors.detail_permintaan && (
                    <div className={styles.errorMessage}>
                      ⚠️ {errors.detail_permintaan}
                    </div>
                  )}
                </div>
              </div>

              {/* Upload Dokumen */}
              <div className={styles.formSection}>
                <h3 className={styles.sectionTitle}>
                  <span className={styles.sectionIcon}>3</span>
                  Upload Dokumen
                </h3>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Surat Pengajuan</label>
                    <div className={styles.fileControl}>
                      <input
                        type="file"
                        name="surat"
                        accept=".pdf"
                        onChange={handleChange}
                      />
                      <div className={styles.fileControlContent}>
                        <div className={styles.fileIcon}>📄</div>
                        <div className={styles.fileText}>
                          {formData.surat
                            ? formData.surat.name
                            : "Pilih file PDF"}
                        </div>
                        <div className={styles.fileSubtext}>
                          Format: PDF, Maksimal 5MB
                        </div>
                      </div>
                    </div>
                    {errors.surat && (
                      <div className={styles.errorMessage}>
                        ⚠️ {errors.surat}
                      </div>
                    )}
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Foto Pendukung</label>
                    <div className={styles.fileControl}>
                      <input
                        type="file"
                        name="foto"
                        accept=".jpg,.jpeg,.png"
                        onChange={handleChange}
                      />
                      <div className={styles.fileControlContent}>
                        <div className={styles.fileIcon}>📸</div>
                        <div className={styles.fileText}>
                          {formData.foto ? formData.foto.name : "Pilih foto"}
                        </div>
                        <div className={styles.fileSubtext}>
                          Format: JPG, PNG, JPEG
                        </div>
                      </div>
                    </div>
                    {errors.foto && (
                      <div className={styles.errorMessage}>
                        ⚠️ {errors.foto}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "2rem",
                }}
              >
                <Button
                  variant="primary"
                  size="large"
                  onClick={handleKirim}
                  disabled={loading}
                  loading={loading}
                  icon={loading ? null : "📤"}
                >
                  {loading ? "Mengirim..." : "Kirim Pelaporan"}
                </Button>
              </div>
            </Form>
          </div>
        </Container>
      </div>

      {/* Modal Konfirmasi */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        title="Konfirmasi Pengiriman"
        titleIcon="📋"
        type="confirmation"
        showConfirmButton={true}
        showCancelButton={true}
        confirmText="Ya, Kirim Sekarang"
        cancelText="Periksa Kembali"
        onConfirm={handleSubmit}
        onCancel={() => setShowModal(false)}
        confirmIcon={loading ? null : "✅"}
        loading={loading}
        size="md"
        centered
      >
        <p>
          Pastikan semua data yang Anda masukkan sudah benar dan lengkap.
          Setelah dikirim, data tidak dapat diubah.
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
    </>
  );
};

export default Pelaporan;
