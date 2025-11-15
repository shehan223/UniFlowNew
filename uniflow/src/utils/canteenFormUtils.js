import { CATEGORY_OPTIONS } from "../types/canteen";
import { getPhotoPlaceholder } from "../store/canteenStore";

export const createEmptyFoodForm = () => ({
  name: "",
  category: CATEGORY_OPTIONS[0],
  priceLkr: "",
  quantity: "",
  description: "",
  available: true,
  photoUrl: "",
});

export const validateFoodForm = (values) => {
  const errors = {};

  if (!values.name?.trim()) {
    errors.name = "Food name is required.";
  }

  if (!CATEGORY_OPTIONS.includes(values.category)) {
    errors.category = "Please pick a valid category.";
  }

  const price = Number(values.priceLkr);
  if (Number.isNaN(price) || price <= 0) {
    errors.priceLkr = "Enter a positive price.";
  }

  const quantity = Number(values.quantity);
  if (!Number.isInteger(quantity) || quantity < 0) {
    errors.quantity = "Quantity must be zero or greater.";
  }

  if (!values.photoUrl?.trim()) {
    errors.photoUrl = "Please add a photo (upload or URL).";
  }

  return errors;
};

export const formatCurrency = (value) =>
  new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
  }).format(value);

export const ensurePhotoValue = (value, seed) => {
  if (value?.trim()) {
    return value.trim();
  }
  return getPhotoPlaceholder(seed);
};

export const convertFileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
