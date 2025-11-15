export type Category = "Main Course" | "Drinks" | "Snacks" | "Dessert" | "Breakfast";

export type FoodItem = {
  id: string;
  name: string;
  category: Category;
  priceLkr: number;
  quantity: number;
  description?: string;
  photoUrl: string;
  available: boolean;
  isToday: boolean;
  createdAt: string;
  updatedAt: string;
  emoji?: string;
};

export type FoodItemInput = Omit<FoodItem, "id" | "createdAt" | "updatedAt">;
export type FoodItemPatch = Partial<Omit<FoodItem, "id" | "createdAt">>;

export const CATEGORY_OPTIONS: Category[] = [
  "Main Course",
  "Drinks",
  "Snacks",
  "Dessert",
  "Breakfast",
];
