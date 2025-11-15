import React, { useState } from "react";
import PropTypes from "prop-types";
import ImageWithFallback from "../../../components/ImageWithFallback";
import { CATEGORY_OPTIONS } from "../../../types/canteen";
import { convertFileToDataUrl } from "../../../utils/canteenFormUtils";

const FoodFormFields = ({ values, errors, onChange }) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFieldChange = (event) => {
    const { name, value, type, checked } = event.target;
    const nextValue = type === "checkbox" ? checked : value;
    onChange(name, nextValue);
  };

  const handlePhotoUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const dataUrl = await convertFileToDataUrl(file);
      onChange("photoUrl", dataUrl);
    } catch (error) {
      // ignore conversion errors
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="food-form-grid">
      <label className={`food-form-field ${errors.name ? "food-form-field--error" : ""}`}>
        <span>Food Name</span>
        <input
          type="text"
          name="name"
          placeholder="Eg: Kottu Roti 🥘"
          value={values.name}
          onChange={handleFieldChange}
        />
        {errors.name && <p className="food-form-error">{errors.name}</p>}
      </label>

      <label className={`food-form-field ${errors.category ? "food-form-field--error" : ""}`}>
        <span>Category</span>
        <select name="category" value={values.category} onChange={handleFieldChange}>
          {CATEGORY_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {errors.category && <p className="food-form-error">{errors.category}</p>}
      </label>

      <label className={`food-form-field ${errors.priceLkr ? "food-form-field--error" : ""}`}>
        <span>Price (LKR)</span>
        <input
          type="number"
          min="0"
          step="1"
          name="priceLkr"
          placeholder="150"
          value={values.priceLkr}
          onChange={handleFieldChange}
        />
        {errors.priceLkr && <p className="food-form-error">{errors.priceLkr}</p>}
      </label>

      <label className={`food-form-field ${errors.quantity ? "food-form-field--error" : ""}`}>
        <span>Quantity Available</span>
        <input
          type="number"
          min="0"
          step="1"
          name="quantity"
          placeholder="50"
          value={values.quantity}
          onChange={handleFieldChange}
        />
        {errors.quantity && <p className="food-form-error">{errors.quantity}</p>}
      </label>

      <label className="food-form-field food-form-field--full">
        <span>Description</span>
        <textarea
          name="description"
          placeholder="Optional tasting notes"
          rows={3}
          value={values.description}
          onChange={handleFieldChange}
        />
      </label>

      <label className="food-form-toggle">
        <input
          type="checkbox"
          name="available"
          checked={values.available}
          onChange={handleFieldChange}
        />
        <span>Available for sale</span>
      </label>

      <div className={`food-form-photo ${errors.photoUrl ? "food-form-photo--error" : ""}`}>
        <div className="food-form-photo__preview">
          <ImageWithFallback src={values.photoUrl} alt={`${values.name || "Food"} preview`} />
        </div>
        <div className="food-form-photo__inputs">
          <label>
            <span>Photo URL</span>
            <input
              type="url"
              name="photoUrl"
              placeholder="https://..."
              value={values.photoUrl}
              onChange={handleFieldChange}
            />
          </label>
          <label className="food-form-upload">
            <span>Upload photo</span>
            <input type="file" accept="image/*" onChange={handlePhotoUpload} />
            {isUploading && <small>Uploading…</small>}
          </label>
          {errors.photoUrl && <p className="food-form-error">{errors.photoUrl}</p>}
        </div>
      </div>
    </div>
  );
};

FoodFormFields.propTypes = {
  values: PropTypes.shape({
    name: PropTypes.string,
    category: PropTypes.string,
    priceLkr: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    quantity: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    description: PropTypes.string,
    available: PropTypes.bool,
    photoUrl: PropTypes.string,
  }).isRequired,
  errors: PropTypes.objectOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default FoodFormFields;
