import { Table as BootstrapTable } from "react-bootstrap";
import styles from "../../styles/components/common/Table.module.css";

const Table = ({
  columns = [],
  data = [],
  loading = false,
  noDataMessage = "Tidak ada data ditemukan",
  noDataIcon = "📄",
  className = "",
  responsive = true,
  striped = false,
  hover = true,
  bordered = false,
  size = "default",
}) => {
  const tableClasses = [styles.modernTable, "table", className]
    .filter(Boolean)
    .join(" ");

  const renderDesktopTable = () => (
    <div className={styles.desktopTable}>
      <BootstrapTable
        className={tableClasses}
        striped={striped}
        hover={hover}
        bordered={bordered}
        size={size === "small" ? "sm" : undefined}
      >
        <thead style={{ backgroundColor: "#007bff", color: "white" }}>
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                className={column.className || ""}
                style={{
                  color: "white",
                  backgroundColor: "#007bff",
                  width: column.width || "auto",
                  textAlign: column.headerAlign || "center",
                  ...column.headerStyle,
                }}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item, rowIndex) => (
              <tr key={rowIndex} className={styles.tableRow}>
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className={column.cellClassName || ""}
                    style={{
                      textAlign: column.align || "left",
                      ...column.cellStyle,
                    }}
                  >
                    {column.render
                      ? column.render(item, rowIndex)
                      : item[column.key]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className={styles.noData}>
                <div className={styles.noDataContent}>
                  <span className={styles.noDataIcon}>{noDataIcon}</span>
                  <span>{noDataMessage}</span>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </BootstrapTable>
    </div>
  );

  const renderMobileCards = () => (
    <div className={styles.mobileCards}>
      {data.length > 0 ? (
        data.map((item, index) => (
          <div key={index} className={styles.mobileCard}>
            <div className={styles.cardHeader}>
              <div className={styles.cardNumber}>#{index + 1}</div>
              {columns.find((col) => col.key === "status") && (
                <div className={styles.cardStatus}>
                  {columns
                    .find((col) => col.key === "status")
                    .render(item, index)}
                </div>
              )}
            </div>
            <div className={styles.cardBody}>
              {columns
                .filter((col) => col.key !== "status" && col.key !== "number")
                .map((column, colIndex) => (
                  <div key={colIndex} className={styles.cardRow}>
                    <span className={styles.cardLabel}>{column.header}</span>
                    <span className={styles.cardSeparator}>:</span>
                    <span className={styles.cardValue}>
                      {column.render
                        ? column.render(item, index)
                        : item[column.key]}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        ))
      ) : (
        <div className={styles.noDataMobile}>
          <div className={styles.noDataContent}>
            <span className={styles.noDataIcon}>{noDataIcon}</span>
            <span>{noDataMessage}</span>
          </div>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p className={styles.loadingText}>Memuat data...</p>
      </div>
    );
  }

  return (
    <div className={styles.tableContainer}>
      {renderDesktopTable()}
      {renderMobileCards()}
    </div>
  );
};

export default Table;
