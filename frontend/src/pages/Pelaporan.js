import React, { useState } from "react";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Spinner,
  Modal,
} from "react-bootstrap";
import MainNavbar from "../components/mainNavbar";

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
  const [message, setMessage] = useState({ type: "", text: "" });
  const [showModal, setShowModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }));

    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
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
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setShowModal(false);
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    let permintaanValue = formData.permintaan === "Pengadaan" ? 1 : 2;

    const submitData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) submitData.append(key, value);
    });

    submitData.set("permintaan", permintaanValue);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/public/add-request`,
        {
          method: "POST",
          body: submitData,
        }
      );

      const result = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: "Pelaporan berhasil dikirim!" });
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
      } else {
        throw new Error(result.message || "Gagal mengirim laporan.");
      }
    } catch (error) {
      setMessage({ type: "danger", text: error.message });
    } finally {
      setLoading(false);
      setShowModal(false);
      setShowMessageModal(true);
    }
  };

  return (
    <>
      <MainNavbar />
      <Container className="mt-5">
        <div className="text-center mb-4">
          <h2>Form Pelaporan SUMBANG</h2>
        </div>

        <Form onSubmit={(e) => e.preventDefault()}>
          <Row>
            <Col md={6}>
              <Form.Group controlId="formNama">
                <Form.Label>Nama</Form.Label>
                <Form.Control
                  type="text"
                  name="nama"
                  placeholder="Masukkan nama"
                  value={formData.nama}
                  onChange={handleChange}
                />
                {errors.nama && (
                  <div className="text-danger">{errors.nama}</div>
                )}
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="formAlamat">
                <Form.Label>Alamat</Form.Label>
                <Form.Control
                  type="text"
                  name="alamat"
                  placeholder="Masukkan alamat"
                  value={formData.alamat}
                  onChange={handleChange}
                />
                {errors.alamat && (
                  <div className="text-danger">{errors.alamat}</div>
                )}
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <Form.Group controlId="formno_hp">
                <Form.Label>No HP</Form.Label>
                <Form.Control
                  type="number"
                  name="no_hp"
                  placeholder="Masukkan nomor HP"
                  value={formData.no_hp}
                  onChange={handleChange}
                />
                {errors.no_hp && (
                  <div className="text-danger">{errors.no_hp}</div>
                )}
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="formno_whatsapp">
                <Form.Label>No Whatsapp</Form.Label>
                <Form.Control
                  type="number"
                  name="no_whatsapp"
                  placeholder="Masukkan nomor Whatsapp"
                  value={formData.no_whatsapp}
                  onChange={handleChange}
                />
                {errors.no_whatsapp && (
                  <div className="text-danger">{errors.no_whatsapp}</div>
                )}
              </Form.Group>
            </Col>
          </Row>

          <Form.Group controlId="formPermintaan">
            <Form.Label>Permintaan</Form.Label>
            <Form.Control
              as="select"
              name="permintaan"
              value={formData.permintaan}
              onChange={handleChange}
            >
              <option value="">Pilih Permintaan</option>
              <option value="Pengadaan">Pengadaan</option>
              <option value="Perbaikan">Perbaikan</option>
            </Form.Control>
            {errors.permintaan && (
              <div className="text-danger">{errors.permintaan}</div>
            )}
          </Form.Group>

          <Form.Group controlId="formdetail_permintaan">
            <Form.Label>Detail Permintaan</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Masukkan detail permintaan"
              name="detail_permintaan"
              value={formData.detail_permintaan}
              onChange={handleChange}
              required
            />
            {errors.detail_permintaan && (
              <div className="text-danger">{errors.detail_permintaan}</div>
            )}
          </Form.Group>

          <Form.Group controlId="formLokasi">
            <Form.Label>Lokasi</Form.Label>
            <Form.Control
              type="text"
              name="lokasi"
              placeholder="Masukkan lokasi"
              value={formData.lokasi}
              onChange={handleChange}
              required
            />
            {errors.permintaan && (
              <div className="text-danger">{errors.lokasi}</div>
            )}
          </Form.Group>

          <Form.Group controlId="formsurat">
            <Form.Label>File Surat Pengajuan (PDF, max 5MB)</Form.Label>
            <Form.Control
              type="file"
              name="surat"
              accept=".pdf"
              onChange={handleChange}
            />
            {errors.surat && <div className="text-danger">{errors.surat}</div>}
          </Form.Group>

          <Form.Group controlId="formFoto">
            <Form.Label>Foto (JPG, PNG, JPEG)</Form.Label>
            <Form.Control
              type="file"
              name="foto"
              accept=".jpg,.jpeg,.png"
              onChange={handleChange}
            />
            {errors.foto && <div className="text-danger">{errors.foto}</div>}
          </Form.Group>

          <Button variant="primary" className="mt-3" onClick={handleKirim}>
            Kirim
          </Button>
        </Form>
      </Container>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Konfirmasi Pengiriman</Modal.Title>
        </Modal.Header>
        <Modal.Body>Apakah data yang Anda masukkan sudah sesuai?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Batal
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : "Sesuai"}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showMessageModal}
        onHide={() => setShowMessageModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {message.type === "success" ? "Berhasil" : "Gagal"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {message.type === "success" ? (
            <p className="text-success">{message.text}</p>
          ) : (
            <p className="text-danger">{message.text}</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowMessageModal(false)}
          >
            Tutup
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Pelaporan;
