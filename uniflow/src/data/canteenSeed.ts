import { FoodItem } from "../types/canteen";

import riceCurryImg from "../assets/food/rice-curry.jpg";
import kottuRotiImg from "../assets/food/kottu-roti.jpg";
import friedRiceImg from "../assets/food/fried-rice.jpg";
import stringHoppersImg from "../assets/food/string-hoppers.jpg";
import hoppersImg from "../assets/food/hoppers.jpg";
import chickenCurryImg from "../assets/food/chicken-curry.jpg";
import dhalCurryImg from "../assets/food/dhal-curry.jpg";
import vegRotiImg from "../assets/food/veg-roti.jpg";
import fishBunImg from "../assets/food/fish-bun.jpg";
import cutletsImg from "../assets/food/cutlets.jpg";
import watalappanImg from "../assets/food/watalappan.jpg";
import curdTreacleImg from "../assets/food/curd-treacle.jpg";
import iceCreamImg from "../assets/food/ice-cream.jpg";
import teaImg from "../assets/food/tea.jpg";
import coffeeImg from "../assets/food/coffee.jpg";
import icedMiloImg from "../assets/food/iced-milo.jpg";
import limeJuiceImg from "../assets/food/lime-juice.jpg";
import orangeJuiceImg from "../assets/food/orange-juice.jpg";
import eggRotiImg from "../assets/food/egg-roti.jpg";
import vegNoodlesImg from "../assets/food/veg-noodles.jpg";

type SeedItem = Omit<FoodItem, "createdAt" | "updatedAt">;

const seedItems: SeedItem[] = [
  {
    id: "rice-curry",
    name: "Rice & Curry 🍛",
    category: "Main Course",
    priceLkr: 150,
    quantity: 120,
    description: "Steamed rice with dhal, sambol, and seasonal vegetables.",
    photoUrl: riceCurryImg,
    available: true,
    isToday: true,
    emoji: "🍛",
  },
  {
    id: "kottu-roti",
    name: "Kottu Roti 🥘",
    category: "Main Course",
    priceLkr: 200,
    quantity: 80,
    description: "Chopped roti stir-fried with vegetables and egg.",
    photoUrl: kottuRotiImg,
    available: true,
    isToday: true,
    emoji: "🥘",
  },
  {
    id: "fried-rice",
    name: "Fried Rice 🍚",
    category: "Main Course",
    priceLkr: 220,
    quantity: 65,
    description: "Fragrant fried rice with carrots, peas, and egg ribbons.",
    photoUrl: friedRiceImg,
    available: true,
    isToday: false,
    emoji: "🍚",
  },
  {
    id: "string-hoppers",
    name: "String Hoppers 🍥",
    category: "Breakfast",
    priceLkr: 120,
    quantity: 100,
    description: "Fresh idiyappam served with coconut sambol.",
    photoUrl: stringHoppersImg,
    available: true,
    isToday: true,
    emoji: "🍥",
  },
  {
    id: "hoppers",
    name: "Hoppers 🥞",
    category: "Breakfast",
    priceLkr: 100,
    quantity: 90,
    description: "Crispy bowl-shaped hoppers with lunu miris.",
    photoUrl: hoppersImg,
    available: true,
    isToday: false,
    emoji: "🥞",
  },
  {
    id: "chicken-curry",
    name: "Chicken Curry 🍗",
    category: "Main Course",
    priceLkr: 250,
    quantity: 70,
    description: "Slow-cooked chicken curry with roasted spices.",
    photoUrl: chickenCurryImg,
    available: true,
    isToday: true,
    emoji: "🍗",
  },
  {
    id: "dhal-curry",
    name: "Dhal Curry 🥣",
    category: "Main Course",
    priceLkr: 90,
    quantity: 110,
    description: "Creamy red lentils tempered with mustard and curry leaves.",
    photoUrl: dhalCurryImg,
    available: true,
    isToday: false,
    emoji: "🥣",
  },
  {
    id: "veg-roti",
    name: "Veg Roti 🫓",
    category: "Snacks",
    priceLkr: 80,
    quantity: 150,
    description: "Spiced coconut filling wrapped in soft roti.",
    photoUrl: vegRotiImg,
    available: true,
    isToday: true,
    emoji: "🫓",
  },
  {
    id: "fish-bun",
    name: "Fish Bun 🐟",
    category: "Snacks",
    priceLkr: 70,
    quantity: 140,
    description: "Classic bakery bun stuffed with spicy fish mix.",
    photoUrl: fishBunImg,
    available: true,
    isToday: false,
    emoji: "🐟",
  },
  {
    id: "cutlets",
    name: "Cutlets 🟠",
    category: "Snacks",
    priceLkr: 60,
    quantity: 160,
    description: "Crunchy breadcrumbed fish and potato balls.",
    photoUrl: cutletsImg,
    available: true,
    isToday: true,
    emoji: "🟠",
  },
  {
    id: "watalappan",
    name: "Watalappan 🍮",
    category: "Dessert",
    priceLkr: 140,
    quantity: 60,
    description: "Coconut custard pudding with jaggery and nuts.",
    photoUrl: watalappanImg,
    available: true,
    isToday: false,
    emoji: "🍮",
  },
  {
    id: "curd-treacle",
    name: "Curd & Treacle 🥛",
    category: "Dessert",
    priceLkr: 160,
    quantity: 45,
    description: "Buffalo curd topped with sweet kithul treacle.",
    photoUrl: curdTreacleImg,
    available: true,
    isToday: true,
    emoji: "🥛",
  },
  {
    id: "ice-cream",
    name: "Ice Cream 🍦",
    category: "Dessert",
    priceLkr: 180,
    quantity: 75,
    description: "Vanilla ice cream cups with chocolate drizzle.",
    photoUrl: iceCreamImg,
    available: true,
    isToday: false,
    emoji: "🍦",
  },
  {
    id: "tea",
    name: "Tea ☕",
    category: "Drinks",
    priceLkr: 40,
    quantity: 200,
    description: "Plain black tea with optional milk and sugar.",
    photoUrl: teaImg,
    available: true,
    isToday: true,
    emoji: "☕",
  },
  {
    id: "coffee",
    name: "Coffee ☕",
    category: "Drinks",
    priceLkr: 60,
    quantity: 120,
    description: "Freshly brewed Ceylon coffee.",
    photoUrl: coffeeImg,
    available: true,
    isToday: false,
    emoji: "☕",
  },
  {
    id: "iced-milo",
    name: "Iced Milo 🧋",
    category: "Drinks",
    priceLkr: 120,
    quantity: 90,
    description: "Chilled Milo with condensed milk and ice.",
    photoUrl: icedMiloImg,
    available: true,
    isToday: true,
    emoji: "🧋",
  },
  {
    id: "lime-juice",
    name: "Lime Juice 🍋",
    category: "Drinks",
    priceLkr: 90,
    quantity: 100,
    description: "Fresh lime cooler with honey and mint.",
    photoUrl: limeJuiceImg,
    available: true,
    isToday: false,
    emoji: "🍋",
  },
  {
    id: "orange-juice",
    name: "Orange Juice 🍊",
    category: "Drinks",
    priceLkr: 110,
    quantity: 85,
    description: "Freshly squeezed oranges served chilled.",
    photoUrl: orangeJuiceImg,
    available: true,
    isToday: false,
    emoji: "🍊",
  },
  {
    id: "egg-roti",
    name: "Egg Roti 🥚",
    category: "Snacks",
    priceLkr: 90,
    quantity: 130,
    description: "Pan-roasted roti with seasoned egg filling.",
    photoUrl: eggRotiImg,
    available: true,
    isToday: false,
    emoji: "🥚",
  },
  {
    id: "veg-noodles",
    name: "Veg Fried Noodles 🍜",
    category: "Main Course",
    priceLkr: 210,
    quantity: 70,
    description: "Wok-tossed noodles with crunchy vegetables.",
    photoUrl: vegNoodlesImg,
    available: true,
    isToday: true,
    emoji: "🍜",
  },
];

export const buildSeedItems = (): FoodItem[] => {
  const now = Date.now();

  return seedItems.map((item, index) => {
    const createdTime = new Date(now - index * 60000).toISOString();
    return {
      ...item,
      createdAt: createdTime,
      updatedAt: createdTime,
    };
  });
};
