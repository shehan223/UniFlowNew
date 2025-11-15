import { useSyncExternalStore } from "react";
import placeholderPhoto from "../assets/food/placeholders/default.jpg";
import { FoodItem, FoodItemInput, FoodItemPatch } from "../types/canteen";

const normalizeBaseUrl = (value?: string) => {
  if (!value) return "";
  return value.endsWith("/") ? value.slice(0, -1) : value;
};

const API_BASE_URL =
  normalizeBaseUrl(process.env.REACT_APP_API_BASE_URL) || "http://localhost:5000";

const listeners = new Set<() => void>();
let cache: FoodItem[] = [];
let cacheSummary = {
  totalItems: 0,
  availableToday: 0,
  unavailable: 0,
  totalStock: 0,
};
let isFetching = false;

const buildSummary = (items: FoodItem[]) => {
  const totalItems = items.length;
  const availableToday = items.filter((item) => item.isToday && item.available).length;
  const unavailable = items.filter((item) => !item.available).length;
  const totalStock = items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    totalItems,
    availableToday,
    unavailable,
    totalStock,
  };
};

const notify = () => {
  listeners.forEach((listener) => listener());
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const getSnapshotRef = () => cache;

const fetchJSON = async <T>(
  path: string,
  options?: RequestInit,
): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Request failed");
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
};

const refreshItems = async () => {
  if (isFetching) return;
  try {
    isFetching = true;
    const items = await fetchJSON<FoodItem[]>("/api/canteen/items");
    cache = items;
    cacheSummary = buildSummary(items);
    notify();
  } catch (error) {
    console.error("Unable to load canteen items", error);
  } finally {
    isFetching = false;
  }
};

refreshItems().catch((error) => {
  console.error("Initial canteen sync failed", error);
});

export const syncCanteenItems = refreshItems;

export const getItems = (): FoodItem[] =>
  getSnapshotRef().map((item) => ({ ...item }));

export const addItem = async (input: FoodItemInput): Promise<FoodItem> => {
  const created = await fetchJSON<FoodItem>("/api/canteen/items", {
    method: "POST",
    body: JSON.stringify(input),
  });
  await refreshItems();
  return created;
};

export const updateItem = async (
  id: string,
  patch: FoodItemPatch,
): Promise<FoodItem> => {
  const updated = await fetchJSON<FoodItem>(`/api/canteen/items/${id}`, {
    method: "PUT",
    body: JSON.stringify(patch),
  });
  await refreshItems();
  return updated;
};

export const deleteItem = async (id: string) => {
  await fetchJSON(`/api/canteen/items/${id}`, { method: "DELETE" });
  await refreshItems();
};

export const toggleToday = async (id: string, isToday: boolean) => {
  await fetchJSON(`/api/canteen/items/${id}/today`, {
    method: "PATCH",
    body: JSON.stringify({ isToday }),
  });
  await refreshItems();
};

export const getSummary = () => cacheSummary;

export const useCanteenItems = () =>
  useSyncExternalStore(subscribe, getSnapshotRef, getSnapshotRef);

export const useCanteenSummary = () =>
  useSyncExternalStore(subscribe, getSummary, getSummary);

export const getFallbackThumbnail = () => placeholderPhoto;
export const getPhotoPlaceholder = (seed: string) =>
  `https://picsum.photos/seed/${seed || "canteen"}/600/450`;

export const resetStore = refreshItems;
