import React, { useCallback, useEffect, useState } from "react";
import NaviBar from "../components/NaviBar";
import SideBar from "../components/SideBar";
import NoticeCard from "../components/NoticeCard";
import "./studentHostelView.css";

const STORAGE_KEY = "warden-notices";
const STORAGE_EVENT = "warden-notices-update";

const StudentHostelView = () => {
  const [notices, setNotices] = useState([]);

  const loadNotices = useCallback(() => {
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (!cached) {
        setNotices([]);
        return;
      }
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed)) {
        const sorted = [...parsed].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setNotices(sorted);
      } else {
        setNotices([]);
      }
    } catch (error) {
      setNotices([]);
    }
  }, []);

  useEffect(() => {
    loadNotices();
  }, [loadNotices]);

  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key && event.key !== STORAGE_KEY) {
        return;
      }
      loadNotices();
    };

    const handleCustomEvent = () => loadNotices();

    window.addEventListener("storage", handleStorage);
    window.addEventListener(STORAGE_EVENT, handleCustomEvent);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(STORAGE_EVENT, handleCustomEvent);
    };
  }, [loadNotices]);

  return (
    <>
      <NaviBar />
      <div className="student-hostel">
        <SideBar activePath="/student" />
        <main className="student-hostel__content">
          <header className="student-hostel__header">
            <h2>Hostel Notices</h2>
            <p>Stay updated with the latest announcements from the warden.</p>
          </header>

          {notices.length === 0 ? (
            <div className="student-hostel__empty">
              <h3>No notices available</h3>
              <p>Check back later for updates from the hostel warden.</p>
            </div>
          ) : (
            <section className="student-hostel__list">
              {notices.map((notice) => (
                <NoticeCard key={notice.id} notice={notice} readOnly />
              ))}
            </section>
          )}
        </main>
      </div>
    </>
  );
};

export default StudentHostelView;
