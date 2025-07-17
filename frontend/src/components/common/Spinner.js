import styles from "../../styles/components/common/Spinner.module.css";

const Spinner = ({
  size = "medium",
  variant = "primary",
  text = "",
  centered = false,
  overlay = false,
  className = "",
}) => {
  const spinnerClasses = [
    styles.spinner,
    styles[size],
    styles[variant],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const containerClasses = [
    styles.spinnerContainer,
    centered && styles.centered,
    overlay && styles.overlay,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={containerClasses}>
      <div className={spinnerClasses}>
        <div className={styles.spinnerRing}>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
      {text && <p className={styles.spinnerText}>{text}</p>}
    </div>
  );
};

export default Spinner;
