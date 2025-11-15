import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckSquare,
  Eye,
  Filter,
  PencilLine,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import CanteenLayout from "../../components/CanteenLayout";
import ImageWithFallback from "../../components/ImageWithFallback";
import FoodFormFields from "./components/FoodFormFields";
import DeleteConfirmModal from "./components/DeleteConfirmModal";
import {
  addItem,
  deleteItem,
  toggleToday,
  updateItem,
  useCanteenItems,
  useCanteenSummary,
} from "../../store/canteenStore";
import {
  createEmptyFoodForm,
  ensurePhotoValue,
  formatCurrency,
  validateFoodForm,
} from "../../utils/canteenFormUtils";
import { logoutCanteenAdmin } from "../../canteenAuth";
import clearUserSession from "../../utils/clearUserSession";
import { useToast } from "../../context/ToastContext";
import "./canteen.css";

const mapItemToForm = (item) => ({
  name: item.name,
  category: item.category,
  priceLkr: String(item.priceLkr),
  quantity: String(item.quantity),
  description: item.description || "",
  available: item.available,
  photoUrl: item.photoUrl,
});

const AddItemModal = ({ values, errors, onChange, onSubmit, onClose }) => (
  <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Add new food item">
    <div className="modal-card modal-card--wide">
      <div className="modal-card__top">
        <div>
          <h3>Add New Food Item</h3>
          <p>Fill out the details below to publish a new dish.</p>
        </div>
        <button type="button" className="modal-card__close" onClick={onClose} aria-label="Close">
          <X size={22} />
        </button>
      </div>
      <FoodFormFields values={values} errors={errors} onChange={onChange} />
      <div className="modal-actions">
        <button type="button" className="btn-secondary" onClick={onClose}>
          Cancel
        </button>
        <button type="button" className="btn-primary" onClick={onSubmit}>
          Add Item
        </button>
      </div>
    </div>
  </div>
);

const InventoryCard = ({
  item,
  onPreview,
  onEdit,
  onDelete,
  isEditing,
  editValues,
  editErrors,
  onFieldChange,
  onCancelEdit,
  onSaveEdit,
}) => (
  <article className={`inventory-card ${!item.available ? "inventory-card--muted" : ""}`}>
    <div className="inventory-card__main">
      <div className="inventory-card__thumb">
        <ImageWithFallback src={item.photoUrl} alt={`${item.name} photo`} />
        {item.emoji && <span className="inventory-card__emoji">{item.emoji}</span>}
      </div>
      <div className="inventory-card__content">
        <div className="inventory-card__title-row">
          <div>
            <span className="inventory-card__category">{item.category}</span>
            <h3>{item.name}</h3>
          </div>
          <button
            type="button"
            className="icon-button"
            aria-label={`Preview ${item.name}`}
            onClick={() => onPreview(item.photoUrl)}
          >
            <Eye size={18} />
          </button>
        </div>
        {item.description && <p className="inventory-card__description">{item.description}</p>}
        <div className="inventory-card__meta">
          <span className="inventory-card__price">{formatCurrency(item.priceLkr)}</span>
          <span className="inventory-card__stock">{item.quantity} available</span>
          <span className={`status-pill ${item.available ? "status-pill--on" : "status-pill--off"}`}>
            {item.available ? "Available" : "Unavailable"}
          </span>
        </div>
        <div className="inventory-card__actions">
          <button type="button" className="ghost-btn" onClick={() => onEdit(item)}>
            <PencilLine size={16} />
            Edit
          </button>
          <button type="button" className="ghost-btn ghost-btn--danger" onClick={() => onDelete(item)}>
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>
    </div>
    {isEditing && (
      <div className="inventory-card__editor">
        <FoodFormFields values={editValues} errors={editErrors} onChange={onFieldChange} />
        <div className="inventory-card__editor-actions">
          <button type="button" className="btn-secondary" onClick={onCancelEdit}>
            Cancel
          </button>
          <button type="button" className="btn-primary" onClick={onSaveEdit}>
            Save changes
          </button>
        </div>
      </div>
    )}
  </article>
);

const AdminCanteen = () => {
  const items = useCanteenItems();
  const summary = useCanteenSummary();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addFormValues, setAddFormValues] = useState(createEmptyFoodForm());
  const [addErrors, setAddErrors] = useState({});
  const [editingItemId, setEditingItemId] = useState(null);
  const [editValues, setEditValues] = useState(createEmptyFoodForm());
  const [editErrors, setEditErrors] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsBootstrapping(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const filteredItems = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return items
      .filter((item) => {
        const matchesCategory = categoryFilter === "All" || item.category === categoryFilter;
        const matchesQuery =
          !query ||
          item.name.toLowerCase().includes(query) ||
          (item.description || "").toLowerCase().includes(query);
        return matchesCategory && matchesQuery;
      })
      .sort((a, b) => new Date(b.updatedAt).valueOf() - new Date(a.updatedAt).valueOf());
  }, [items, searchTerm, categoryFilter]);

  const sortedForToday = useMemo(() => {
    return [...items].sort((a, b) => {
      if (a.category === b.category) {
        return a.name.localeCompare(b.name);
      }
      return a.category.localeCompare(b.category);
    });
  }, [items]);

  const selectedToday = items.filter((item) => item.isToday).length;

  const handleToggleToday = async (itemId, nextValue) => {
    try {
      await toggleToday(itemId, nextValue);
      addToast({
        type: "success",
        title: nextValue ? "Added to today's menu" : "Removed from today's menu",
      });
    } catch (error) {
      addToast({
        type: "error",
        title: "Unable to update menu",
        message: error.message,
      });
    }
  };

  const handleClearToday = async () => {
    try {
      await Promise.all(
        items.filter((item) => item.isToday).map((item) => toggleToday(item.id, false)),
      );
      addToast({
        type: "info",
        title: "Cleared today's menu",
        message: "All items were deselected.",
      });
    } catch (error) {
      addToast({
        type: "error",
        title: "Unable to clear",
        message: error.message,
      });
    }
  };

  const handleAddFieldChange = (name, value) => {
    setAddFormValues((prev) => ({ ...prev, [name]: value }));
    setAddErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleEditFieldChange = (name, value) => {
    setEditValues((prev) => ({ ...prev, [name]: value }));
    setEditErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleAddSubmit = async () => {
    const errors = validateFoodForm(addFormValues);
    setAddErrors(errors);
    if (Object.keys(errors).length) {
      return;
    }

    const payload = {
      name: addFormValues.name.trim(),
      category: addFormValues.category,
      priceLkr: Number(addFormValues.priceLkr),
      quantity: Number(addFormValues.quantity),
      description: addFormValues.description.trim(),
      available: addFormValues.available,
      photoUrl: ensurePhotoValue(addFormValues.photoUrl, addFormValues.name),
      isToday: false,
    };

    try {
      await addItem(payload);
      addToast({ type: "success", title: "Item added" });
      setAddFormValues(createEmptyFoodForm());
      setAddErrors({});
      setIsAddModalOpen(false);
    } catch (error) {
      addToast({ type: "error", title: "Unable to add item", message: error.message });
    }
  };

  const handleEditSubmit = async () => {
    const errors = validateFoodForm(editValues);
    setEditErrors(errors);
    if (Object.keys(errors).length) return;

    const payload = {
      name: editValues.name.trim(),
      category: editValues.category,
      priceLkr: Number(editValues.priceLkr),
      quantity: Number(editValues.quantity),
      description: editValues.description.trim(),
      available: editValues.available,
      photoUrl: ensurePhotoValue(editValues.photoUrl, editValues.name),
    };

    try {
      await updateItem(editingItemId, payload);
      addToast({ type: "success", title: "Item updated" });
      setEditingItemId(null);
      setEditErrors({});
    } catch (error) {
      addToast({ type: "error", title: "Unable to update item", message: error.message });
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteItem(deleteTarget.id);
      addToast({ type: "info", title: "Item deleted" });
    } catch (error) {
      addToast({ type: "error", title: "Unable to delete item", message: error.message });
    } finally {
      setDeleteTarget(null);
    }
  };

  const handlePreview = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleAdminLogout = () => {
    logoutCanteenAdmin();
    clearUserSession();
    window.dispatchEvent(new Event("storage"));
    addToast({ type: "info", title: "Logged out" });
    navigate("/login", { replace: true });
  };

  return (
    <CanteenLayout activePath="/canteen-admin">
      <section className="canteen-admin">
        <header className="canteen-admin__header">
          <div>
            <p className="eyebrow">Canteen Management System</p>
            <h1>Inventory & Menu Builder</h1>
            <p>Update your daily menu, manage pricing, and keep quantities accurate.</p>
          </div>
          <div className="canteen-admin__actions">
            <button type="button" className="btn-secondary" onClick={handleAdminLogout}>
              Log out
            </button>
            <button
              type="button"
              className="btn-primary"
              onClick={() => {
                setAddFormValues(createEmptyFoodForm());
                setAddErrors({});
                setIsAddModalOpen(true);
              }}
            >
              <Plus size={16} />
              Add New Item
            </button>
          </div>
        </header>

        <div className="canteen-grid">
          <section className="inventory-pane">
            <div className="inventory-filters">
              <div className="input-with-icon">
                <Search size={16} />
                <input
                  type="search"
                  placeholder="Search food items..."
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                />
              </div>
              <div className="input-with-icon">
                <Filter size={16} />
                <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
                  <option value="All">All categories</option>
                  <option value="Main Course">Main Course</option>
                  <option value="Drinks">Drinks</option>
                  <option value="Snacks">Snacks</option>
                  <option value="Dessert">Dessert</option>
                  <option value="Breakfast">Breakfast</option>
                </select>
              </div>
            </div>

            <div className="summary-strip">
              <div>
                <p>Total Items</p>
                <strong>{summary.totalItems}</strong>
              </div>
              <div>
                <p>Available Today</p>
                <strong>{summary.availableToday}</strong>
              </div>
              <div>
                <p>Unavailable</p>
                <strong>{summary.unavailable}</strong>
              </div>
              <div>
                <p>Total Stock</p>
                <strong>{summary.totalStock}</strong>
              </div>
            </div>

            <div className="inventory-list">
              {isBootstrapping && (
                <>
                  {Array.from({ length: 2 }).map((_, index) => (
                    <div key={index} className="inventory-skeleton" aria-hidden="true">
                      <div className="skeleton-thumb" />
                      <div className="skeleton-lines">
                        <div />
                        <div />
                        <div />
                      </div>
                    </div>
                  ))}
                </>
              )}
              {!isBootstrapping && filteredItems.length === 0 && (
                <div className="empty-state">
                  <p>No items match your filters.</p>
                  <button type="button" onClick={() => setCategoryFilter("All")} className="ghost-btn">
                    Reset filters
                  </button>
                </div>
              )}
              {!isBootstrapping &&
                filteredItems.map((item) => (
                  <InventoryCard
                    key={item.id}
                    item={item}
                    onPreview={handlePreview}
                    onEdit={(current) => {
                      setEditingItemId(current.id);
                      setEditValues(mapItemToForm(current));
                      setEditErrors({});
                    }}
                    onDelete={setDeleteTarget}
                    isEditing={editingItemId === item.id}
                    editValues={editValues}
                    editErrors={editErrors}
                    onFieldChange={handleEditFieldChange}
                    onCancelEdit={() => setEditingItemId(null)}
                    onSaveEdit={handleEditSubmit}
                  />
                ))}
            </div>
          </section>

          <section className="today-pane">
            <div className="today-pane__header">
              <div>
                <p className="eyebrow">Today&apos;s Menu</p>
                <h2>Select items to serve</h2>
              </div>
              <div className="today-pane__actions">
                <span className="selected-counter">
                  <CheckSquare size={16} />
                  Selected: <strong>{selectedToday}</strong>
                </span>
                <button
                  type="button"
                  className="ghost-btn"
                  onClick={handleClearToday}
                  disabled={selectedToday === 0}
                >
                  Clear all
                </button>
              </div>
            </div>
            <ul className="today-list">
              {sortedForToday.map((item) => (
                <li key={item.id}>
                  <label className="today-item">
                    <input
                      type="checkbox"
                      checked={item.isToday}
                      onChange={(event) => handleToggleToday(item.id, event.target.checked)}
                    />
                    <ImageWithFallback
                      src={item.photoUrl}
                      alt={`${item.name} thumbnail`}
                      className="today-item__thumb"
                    />
                    <div className="today-item__info">
                      <p>{item.name}</p>
                      <span>{formatCurrency(item.priceLkr)}</span>
                    </div>
                  </label>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </section>

      {isAddModalOpen && (
        <AddItemModal
          values={addFormValues}
          errors={addErrors}
          onChange={handleAddFieldChange}
          onSubmit={handleAddSubmit}
          onClose={() => setIsAddModalOpen(false)}
        />
      )}

      {deleteTarget && (
        <DeleteConfirmModal
          itemName={deleteTarget.name}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}
    </CanteenLayout>
  );
};

export default AdminCanteen;
