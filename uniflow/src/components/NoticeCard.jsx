import React from "react";
import "./noticeCard.css";

const formatDateTime = (value) => {
  if (!value) {
    return "";
  }

  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const NoticeCard = ({ notice, onView, onDelete, readOnly = false }) => {
  const { id, title, content, createdAt } = notice;

  return (
    <article className="notice-card" tabIndex={0}>
      <header className="notice-card__header">
        <h3 className="notice-card__title">{title}</h3>
        <time className="notice-card__timestamp" dateTime={createdAt}>
          {formatDateTime(createdAt)}
        </time>
      </header>
      <p className="notice-card__preview">{content}</p>
      {!readOnly && (
        <footer className="notice-card__actions">
          <button
            type="button"
            className="notice-card__btn notice-card__btn--view"
            onClick={() => onView(notice)}
          >
            View
          </button>
          <button
            type="button"
            className="notice-card__btn notice-card__btn--delete"
            onClick={() => onDelete(id)}
          >
            Delete
          </button>
        </footer>
      )}
    </article>
  );
};

export default NoticeCard;
