import { useState, useEffect } from "react";
import clsx from "clsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faXmark,
  faSearch,
  faUserGroup,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./Customers.module.css";
import { api } from "../../utils/api";

export default function Customers() {
  const [data, setData] = useState([]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 10;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCustomers = async (page = 1, search = "") => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post("/users/list-customers", {
        page: page,
        limit: itemsPerPage,
        search: encodeURIComponent(search),
      });
      setData(response.data.data || []);
      setTotalPages(Math.ceil(response?.data?.total / itemsPerPage));
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers(currentPage, searchQuery);
  }, [currentPage, searchQuery]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const confirmDelete = (id) => {
    setItemToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      const response = await api.post(`/users/delete-user`,{id:itemToDelete});
      if (response?.data?.status) {
        setShowDeleteModal(false);
        setItemToDelete(null);
        fetchCustomers(currentPage, searchQuery);
      } else {
        throw new Error(response.data.message || "Failed to delete users");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Server Error");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Customers</h1>
          <div className={styles.searchAndAdd}>
            <div className={styles.searchContainer}>
              <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Search Customers..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
          </div>
        </div>

        {isLoading ? (
          ""
        ) : data.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyStateIcon}>
              <FontAwesomeIcon icon={faUserGroup} size="3x" />
            </div>
            <h3 className={styles.emptyStateTitle}>No Customers Found</h3>
            <p className={styles.emptyStateDescription}>
              {searchQuery
                ? "No customers match your search criteria. Try a different search."
                : "You don't have any customers yet. They will appear here once registered."}
            </p>
            {searchQuery && (
              <button
                className={styles.emptyStateAction}
                onClick={() => setSearchQuery("")}
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr style={{ textAlign: "center" }}>
                  <th className={styles.th}>SL</th>
                  <th className={styles.th}>Profile</th>
                  <th className={styles.th}>Name</th>
                  <th className={styles.th}>Email</th>
                  <th className={styles.th}>Phone</th>
                  <th className={styles.th}>Created At</th>
                  <th className={styles.th}>Manage</th>
                </tr>
              </thead>
              <tbody>
                {data?.map((item, index) => (
                  <tr key={item.id} className={styles.tr}>
                    <td className={styles.td}>
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className={styles.td}>
                      {item.profile && (
                        <img
                          style={{ width: 80, height: 80 }}
                          src={item.profile}
                        />
                      )}
                    </td>
                    <td className={styles.td}>{item.full_name}</td>

                    <td className={styles.td}>{item.email}</td>
                    <td className={styles.td}>{item.phone}</td>
                    <td className={styles.td}>
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>

                    <td className={styles.td}>
                      <button
                        className={clsx(
                          styles.actionButton,
                          styles.deleteButton
                        )}
                        onClick={(e) => {
      e.stopPropagation(); 
      confirmDelete(item._id);
    }}
                        aria-label="Delete"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                        <span className={styles.tooltip}>Delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button
              className={styles.pageButton}
              disabled={currentPage === 1 || isLoading}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </button>
            <span className={styles.pageInfo}>
              Page {currentPage} of {totalPages}
            </span>
            <button
              className={styles.pageButton}
              disabled={currentPage === totalPages || isLoading}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {showDeleteModal && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowDeleteModal(false)}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.header}>
              <h2 className={styles.modalTitle}>Confirm Deletion</h2>
              <button
                className={styles.closeButton}
                onClick={() => setShowDeleteModal(false)}
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>
            <div className={styles.modalContent}>
              <p>
                Are you sure you want to delete this item? This action cannot be
                undone.
              </p>
            </div>
            <div className={styles.modalActions}>
              <button
                className={styles.cancelButton}
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className={clsx(
                  styles.confirmButton,
                  styles.deleteConfirmButton
                )}
                onClick={handleDelete}
                disabled={isLoading}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
