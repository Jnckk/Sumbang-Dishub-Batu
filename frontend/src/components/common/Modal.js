import { Modal as BootstrapModal } from "react-bootstrap";
import Button from "./Button";
import styles from "../../styles/components/common/Modal.module.css";

const Modal = ({
  show,
  onHide,
  title,
  children,
  size = "md",
  centered = true,
  type = "default",
  confirmText = "Konfirmasi",
  cancelText = "Batal",
  onConfirm,
  onCancel,
  confirmVariant = "primary",
  cancelVariant = "secondary",
  confirmSize = "medium",
  cancelSize = "medium",
  showConfirmButton = false,
  showCancelButton = false,
  showCloseButton = true,
  loading = false,
  confirmIcon,
  cancelIcon,
  titleIcon,
  footerContent,
  headerContent,
  className = "",
  backdrop = true,
  keyboard = true,
  ...props
}) => {
  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      onHide();
    }
  };

  const getModalClassName = () => {
    const classes = [styles.modernModal];

    if (type === "success") classes.push(styles.successModal);
    if (type === "error") classes.push(styles.errorModal);
    if (type === "warning") classes.push(styles.warningModal);
    if (type === "info") classes.push(styles.infoModal);
    if (type === "confirmation") classes.push(styles.confirmationModal);

    if (className) classes.push(className);

    return classes.join(" ");
  };

  const renderTitle = () => {
    if (!title) return null;

    return (
      <BootstrapModal.Title className={styles.modalTitle}>
        {titleIcon && <span className={styles.titleIcon}>{titleIcon}</span>}
        {title}
      </BootstrapModal.Title>
    );
  };

  const renderFooter = () => {
    if (footerContent) {
      return footerContent;
    }

    if (!showConfirmButton && !showCancelButton) {
      return null;
    }

    return (
      <div className={styles.modalFooter}>
        {showCancelButton && (
          <Button
            variant={cancelVariant}
            size={cancelSize}
            onClick={handleCancel}
            icon={cancelIcon}
            disabled={loading}
          >
            {cancelText}
          </Button>
        )}
        {showConfirmButton && (
          <Button
            variant={confirmVariant}
            size={confirmSize}
            onClick={handleConfirm}
            icon={confirmIcon}
            loading={loading}
            disabled={loading}
          >
            {confirmText}
          </Button>
        )}
      </div>
    );
  };

  return (
    <BootstrapModal
      show={show}
      onHide={onHide}
      size={size}
      centered={centered}
      className={getModalClassName()}
      backdrop={backdrop}
      keyboard={keyboard}
      {...props}
    >
      {(title || headerContent || showCloseButton) && (
        <BootstrapModal.Header
          closeButton={showCloseButton}
          className={styles.modalHeader}
        >
          {headerContent || renderTitle()}
        </BootstrapModal.Header>
      )}

      <BootstrapModal.Body className={styles.modalBody}>
        {children}
      </BootstrapModal.Body>

      {(showConfirmButton || showCancelButton || footerContent) && (
        <BootstrapModal.Footer className={styles.modalFooterContainer}>
          {renderFooter()}
        </BootstrapModal.Footer>
      )}
    </BootstrapModal>
  );
};

export default Modal;
