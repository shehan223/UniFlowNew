import React from "react";
import PropTypes from "prop-types";
import { AlertTriangle, CheckCircle2, Info } from "lucide-react";
import "./toast.css";

const ICONS = {
  success: CheckCircle2,
  info: Info,
  warning: AlertTriangle,
  error: AlertTriangle,
};

const ToastViewport = ({ toasts, onDismiss }) => {
  if (!toasts.length) {
    return null;
  }

  return (
    <div className="toast-viewport" role="region" aria-live="polite" aria-label="Notifications">
      {toasts.map((toast) => {
        const Icon = ICONS[toast.type] ?? Info;
        return (
          <div key={toast.id} className={`toast toast--${toast.type}`} role="status">
            <div className="toast__icon">
              <Icon size={20} strokeWidth={2.5} />
            </div>
            <div className="toast__body">
              <p className="toast__title">{toast.title}</p>
              {toast.message && <p className="toast__message">{toast.message}</p>}
            </div>
            <button type="button" className="toast__close" aria-label="Dismiss notification" onClick={() => onDismiss(toast.id)}>
              ×
            </button>
          </div>
        );
      })}
    </div>
  );
};

ToastViewport.propTypes = {
  toasts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      message: PropTypes.string,
      type: PropTypes.oneOf(["success", "info", "warning", "error"]).isRequired,
    }),
  ).isRequired,
  onDismiss: PropTypes.func.isRequired,
};

export default ToastViewport;
