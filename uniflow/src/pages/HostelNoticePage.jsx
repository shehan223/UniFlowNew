import React, { useEffect, useMemo, useState } from "react";
import NaviBar from "../components/NaviBar";
import NoticeCard from "../components/NoticeCard";
import "./hostelNoticePage.css";
import { useNavigate } from "react-router-dom";

const seedNotices = [
  {
    id: "seed-1",
    title: "Water Supply Maintenance",
    content:
      "Water will be off tomorrow from 9 AM to 2 PM. Please store sufficient water in advance and avoid unnecessary usage during the maintenance window.",
    createdAt: "2024-08-20T07:30:00.000Z",
  },
  {
    id: "seed-2",
    title: "Mess Timing Update",
    content:
      "New mess timings effective immediately: Breakfast 7-9 AM, Lunch 12-2 PM, Dinner 7-9 PM. Kindly be on time to avoid inconvenience.",
    createdAt: "2024-08-19T10:00:00.000Z",
  },
];

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

const createNotice = (title, content) => ({
  id: `notice-${Date.now()}-${Math.random().toString(16).slice(2)}`,
  title: title.trim(),
  content: content.trim(),
  createdAt: new Date().toISOString(),
});

const STORAGE_KEY = "warden-notices";
const STORAGE_EVENT = "warden-notices-update";

const HostelNoticePage = () => {
  const navigate = useNavigate();
  const [notices, setNotices] = useState(() => {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length) {
          return parsed;
        }
        return parsed ?? seedNotices;
      } catch (error) {
        return seedNotices;
      }
    }
    return seedNotices;
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [formValues, setFormValues] = useState({ title: "", content: "" });
  const [authorized, setAuthorized] = useState(false);

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

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notices));
    window.dispatchEvent(new CustomEvent(STORAGE_EVENT, { detail: notices }));
  }, [notices]);

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

  const handleCreateNotice = (event) => {
    event.preventDefault();
    const { title, content } = formValues;

    if (!title.trim() || !content.trim()) {
      return;
    }

    setNotices((prev) => [createNotice(title, content), ...prev]);
    setShowAddForm(false);
  };

  const handleDeleteNotice = (id) => {
    setNotices((prev) => prev.filter((notice) => notice.id !== id));
    if (selectedNotice?.id === id) {
      setSelectedNotice(null);
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
            {sortedNotices.length === 0 ? (
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
