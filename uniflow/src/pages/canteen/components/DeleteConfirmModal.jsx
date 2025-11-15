import React from "react";
import PropTypes from "prop-types";
import "./canteenModals.css";

const DeleteConfirmModal = ({ itemName, onCancel, onConfirm }) => (
  <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Confirm delete">
    <div className="modal-card">
      <h3>Delete {itemName}?</h3>
      <p>This will remove the item from your inventory and today&apos;s menu.</p>
      <div className="modal-actions">
        <button type="button" className="btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="button" className="btn-danger" onClick={onConfirm}>
          Delete
        </button>
      </div>
    </div>
  </div>
);

DeleteConfirmModal.propTypes = {
  itemName: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export default DeleteConfirmModal;
