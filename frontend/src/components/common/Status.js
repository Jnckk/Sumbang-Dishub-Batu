import styles from "../../styles/components/common/Status.module.css";

const Status = ({
  status,
  variant = "default",
  size = "medium",
  className = "",
}) => {
  const getStatusVariant = (statusText) => {
    const normalizedStatus = statusText.toLowerCase().replace(/\s+/g, "");

    switch (normalizedStatus) {
      case "pending":
      case "menunggu":
      case "diajukan":
        return "pending";
      case "diproses":
      case "proses":
      case "sedangdiproses":
      case "onprocess":
        return "processing";
      case "selesai":
      case "berhasil":
      case "sukses":
      case "completed":
      case "done":
        return "success";
      case "ditolak":
      case "gagal":
      case "rejected":
        return "rejected";
      case "revisi":
      case "perlurevisi":
        return "revision";
      case "verified":
      case "terverifikasi":
      case "verification":
        return "verified";
      case "approved":
      case "disetujui":
        return "approved";
      case "onhold":
      case "tertunda":
        return "onhold";
      default:
        return "default";
    }
  };

  const statusVariant =
    variant === "default" ? getStatusVariant(status) : variant;

  const getStatusClasses = () => {
    const classes = [styles.status];

    classes.push(
      styles[
        `status${
          statusVariant.charAt(0).toUpperCase() + statusVariant.slice(1)
        }`
      ]
    );
    classes.push(styles[`size${size.charAt(0).toUpperCase() + size.slice(1)}`]);

    if (className) classes.push(className);

    return classes.join(" ");
  };

  const getStatusIcon = () => {
    switch (statusVariant) {
      case "pending":
        return "⏳";
      case "processing":
        return "⚙️";
      case "success":
        return "✅";
      case "rejected":
        return "❌";
      case "revision":
        return "📝";
      case "verified":
        return "✓";
      case "approved":
        return "✅";
      case "onhold":
        return "⏸️";
      default:
        return "📄";
    }
  };

  return (
    <span className={getStatusClasses()}>
      <span className={styles.statusIcon}>{getStatusIcon()}</span>
      <span className={styles.statusText}>{status}</span>
    </span>
  );
};

export default Status;
