import React, { useCallback, useEffect, useMemo, useState } from "react";
import NaviBar from "../components/NaviBar";
import NoticeCard from "../components/NoticeCard";
import "./hostelNoticePage.css";
import { useNavigate } from "react-router-dom";

const formatDateTime = (value) => {
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const normalizeNotice = (notice = {}) => ({
  id: notice.id || notice._id,
  title: notice.title,
  content: notice.content,
  createdAt: notice.createdAt,
});

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

const HostelNoticePage = () => {
  const navigate = useNavigate();
  const [notices, setNotices] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [formValues, setFormValues] = useState({ title: "", content: "" });
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const email = localStorage.getItem("email");
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    const role = localStorage.getItem("role");
    if (
      email === "skavinda742@gmail.com" &&
      isAuthenticated &&
      role === "warden"
    ) {
      setAuthorized(true);
    } else {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  const fetchNotices = useCallback(async () => {
    if (!authorized) {
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE_URL}/api/notices`);
      if (!response.ok) {
        throw new Error("Failed to load notices");
      }
      const data = await response.json();
      setNotices(data.map(normalizeNotice));
    } catch (err) {
      setError(err.message || "Unable to load notices");
    } finally {
      setLoading(false);
    }
  }, [authorized]);

  useEffect(() => {
    fetchNotices();
  }, [fetchNotices]);

  const sortedNotices = useMemo(
    () =>
      [...notices].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    [notices]
  );

  const openAddNotice = () => {
    setFormValues({ title: "", content: "" });
    setShowAddForm(true);
  };

  const closeAddNotice = () => {
    setShowAddForm(false);
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateNotice = async (event) => {
    event.preventDefault();
    const { title, content } = formValues;

    if (!title.trim() || !content.trim()) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/notices`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });
      if (!response.ok) {
        throw new Error("Unable to save notice");
      }
      const created = await response.json();
      setNotices((prev) => [normalizeNotice(created), ...prev]);
      setShowAddForm(false);
    } catch (err) {
      setError(err.message || "Unable to save notice");
    }
  };

  const handleDeleteNotice = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/notices/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Unable to delete notice");
      }
      setNotices((prev) => prev.filter((notice) => notice.id !== id));
      if (selectedNotice?.id === id) {
        setSelectedNotice(null);
      }
    } catch (err) {
      setError(err.message || "Unable to delete notice");
    }
  };

  if (!authorized) {
    return null;
  }

  return (
    <>
      <NaviBar />
      <div className="warden-notice">
        <main className="warden-notice__panel notice-page__content">
          <header className="notice-page__header">
            <div>
              <p className="notice-page__subtitle">Hostel Management System</p>
              <h1 className="notice-page__title">Notice Board</h1>
            </div>
            <button
              type="button"
              className="notice-page__add-btn"
              onClick={openAddNotice}
            >
              <span aria-hidden="true">+</span>
              <span className="sr-only">Add Notice</span>
            </button>
          </header>

          <section className="notice-page__list">
            {loading ? (
              <div className="notice-page__empty">
                <h2>Loading notices...</h2>
                <p>Please wait while we fetch the latest updates.</p>
              </div>
            ) : error ? (
              <div className="notice-page__empty">
                <h2>Unable to load notices</h2>
                <p>{error}</p>
                <button
                  type="button"
                  className="notice-form__btn notice-form__btn--save"
                  onClick={fetchNotices}
                >
                  Retry
                </button>
              </div>
            ) : sortedNotices.length === 0 ? (
              <div className="notice-page__empty">
                <h2>No notices yet</h2>
                <p>
                  Add your first notice to keep the hostel community informed.
                </p>
              </div>
            ) : (
              sortedNotices.map((notice) => (
                <NoticeCard
                  key={notice.id}
                  notice={notice}
                  onView={setSelectedNotice}
                  onDelete={handleDeleteNotice}
                />
              ))
            )}
          </section>
        </main>
      </div>

      {showAddForm && (
        <div
          className="notice-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-notice-title"
        >
          <div className="notice-modal__panel">
            <header className="notice-modal__header">
              <h2 id="add-notice-title">Add New Notice</h2>
              <button
                type="button"
                className="notice-modal__close"
                onClick={closeAddNotice}
                aria-label="Close add notice form"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </header>
            <form className="notice-form" onSubmit={handleCreateNotice}>
              <label className="notice-form__field">
                <span>Notice Title</span>
                <input
                  type="text"
                  name="title"
                  value={formValues.title}
                  onChange={handleFormChange}
                  placeholder="Enter notice title"
                  required
                />
              </label>
              <label className="notice-form__field">
                <span>Notice Content</span>
                <textarea
                  name="content"
                  value={formValues.content}
                  onChange={handleFormChange}
                  placeholder="Type your notice details..."
                  rows={6}
                  required
                />
              </label>
              <div className="notice-form__actions">
                <button
                  type="submit"
                  className="notice-form__btn notice-form__btn--save"
                >
                  Save Notice
                </button>
                <button
                  type="button"
                  className="notice-form__btn notice-form__btn--cancel"
                  onClick={closeAddNotice}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedNotice && (
        <div
          className="notice-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="view-notice-title"
        >
          <div className="notice-modal__panel notice-modal__panel--view">
            <header className="notice-modal__header">
              <div>
                <p className="notice-modal__timestamp">
                  {formatDateTime(selectedNotice.createdAt)}
                </p>
                <h2 id="view-notice-title">{selectedNotice.title}</h2>
              </div>
              <button
                type="button"
                className="notice-modal__close"
                onClick={() => setSelectedNotice(null)}
                aria-label="Close notice view"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </header>
            <div className="notice-modal__body">
              <p>{selectedNotice.content}</p>
            </div>
            <footer className="notice-modal__footer">
              <button
                type="button"
                className="notice-form__btn notice-form__btn--cancel"
                onClick={() => setSelectedNotice(null)}
              >
                Close
              </button>
            </footer>
          </div>
        </div>
      )}
    </>
  );
};

export default HostelNoticePage;
