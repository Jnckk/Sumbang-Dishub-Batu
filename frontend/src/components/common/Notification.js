import { useState, useEffect } from "react";
import styles from "../../styles/components/common/Notification.module.css";

const Notification = ({
  message = "",
  type = "info",
  duration = 3000,
  onClose,
  show = false,
  position = "top-right",
  icon = true,
  closable = true,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [animationState, setAnimationState] = useState("hidden");

  useEffect(
    () => {
      if (show) {
        setIsVisible(true);
        setAnimationState("entering");

        const enteringTimer = setTimeout(() => {
          setAnimationState("visible");
        }, 600);

        if (duration > 0) {
          const hideTimer = setTimeout(() => {
            setAnimationState("exiting");

            setTimeout(() => {
              setIsVisible(false);
              setAnimationState("hidden");
              if (onClose) {
                onClose();
              }
            }, 400);
          }, duration + 600);

          return () => {
            clearTimeout(enteringTimer);
            clearTimeout(hideTimer);
          };
        }

        return () => clearTimeout(enteringTimer);
      } else {
        if (animationState !== "hidden") {
          setAnimationState("exiting");

          const exitTimer = setTimeout(() => {
            setIsVisible(false);
            setAnimationState("hidden");
          }, 400);

          return () => clearTimeout(exitTimer);
        }
      }
    },
    // eslint-disable-next-line
    [show, duration, onClose]
  );

  const handleClose = () => {
    setAnimationState("exiting");

    setTimeout(() => {
      setIsVisible(false);
      setAnimationState("hidden");
      if (onClose) {
        onClose();
      }
    }, 400);
  };

  const getIcon = () => {
    if (!icon) return null;

    switch (type) {
      case "success":
        return "✓";
      case "error":
        return "✕";
      case "warning":
        return "⚠";
      case "info":
      default:
        return "ℹ";
    }
  };

  if (!isVisible) return null;

  const getAnimationClass = () => {
    if (animationState === "entering") return styles.entering;
    if (animationState === "exiting") return styles.exiting;
    return "";
  };

  return (
    <div
      className={`${styles.notification} ${styles[type]} ${
        styles[position]
      } ${getAnimationClass()}`}
    >
      <div className={styles.content}>
        {icon && <span className={styles.icon}>{getIcon()}</span>}
        <span className={styles.message}>{message}</span>
        {closable && (
          <button
            className={styles.closeButton}
            onClick={handleClose}
            aria-label="Close notification"
          >
            ×
          </button>
        )}
      </div>
      {duration > 0 && animationState === "visible" && (
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ animationDuration: `${duration}ms` }}
          />
        </div>
      )}
    </div>
  );
};

export default Notification;
