"use client";
import React, { useState } from "react";
import { use } from "react";
import Link from "next/link";
import HeaderNav from "@/app/components/common/HeaderNav";
import Footer from "@/app/components/common/Footer";
import DynamicFilters from "../DynamicFilters";
import SortDropdown from "@/app/SortDropdown";
import ProductCard from "@/app/ProductCard";
import { filtersConfig } from "../filtersConfig";

import {
  Heart,
  MapPin,
  Building2,
  Star as StarIcon,
  MessageSquare,
  Share2,
  ShoppingCart,
  Check,
} from "lucide-react";

const mockProducts = [
  // Рестораны
  {
    id: 101,
    title: "Пицца Маргарита",
    price: "650 ₽",
    location: "Москва",
    image: "/main/catalog/id1.jpg",
    isFavorite: false,
    company: "Italo Food",
    category: "restaurant",
    rating: 4.7,
    reviews: 112,
    tags: ["Популярное", "В наличии"],
  },
  {
    id: 101,
    title: "Пицца Маргарита",
    price: "650 ₽",
    location: "Москва",
    image: "/main/catalog/id2.jpg",
    isFavorite: false,
    company: "Italo Food",
    category: "restaurant",
    rating: 4.7,
    reviews: 112,
    tags: ["Популярное", "В наличии"],
  },
  {
    id: 101,
    title: "Пицца Маргарита",
    price: "650 ₽",
    location: "Москва",
    image: "/main/catalog/id5.jpg",
    isFavorite: false,
    company: "Italo Food",
    category: "restaurant",
    rating: 4.7,
    reviews: 112,
    tags: ["Популярное", "В наличии"],
  },
  {
    id: 101,
    title: "Пицца Маргарита",
    price: "650 ₽",
    location: "Москва",
    image: "/main/catalog/id6.jpg",
    isFavorite: false,
    company: "Italo Food",
    category: "restaurant",
    rating: 4.7,
    reviews: 112,
    tags: ["Популярное", "В наличии"],
  },
  {
    id: 101,
    title: "Пицца Маргарита",
    price: "650 ₽",
    location: "Москва",
    image: "/main/catalog/id7.jpg",
    isFavorite: false,
    company: "Italo Food",
    category: "restaurant",
    rating: 4.7,
    reviews: 112,
    tags: ["Популярное", "В наличии"],
  },
  {
    id: 102,
    title: "Сет суши XL",
    price: "1200 ₽",
    location: "Санкт-Петербург",
    image: "/main/catalog/id2.jpg",
    isFavorite: false,
    company: "Sushi Place",
    category: "restaurant",
    rating: 4.9,
    reviews: 58,
    tags: ["Новинка"],
  },
  // Кофейни
  {
    id: 201,
    title: "Арабика Бразилия, 1 кг",
    price: "1400 ₽",
    location: "Москва",
    image: "/main/catalog/id3.jpg",
    isFavorite: false,
    company: "Coffee Beans",
    category: "cofee",
    rating: 4.8,
    reviews: 76,
    tags: ["В наличии", "Органик"],
  },
  {
    id: 202,
    title: "Капучино XL",
    price: "220 ₽",
    location: "Казань",
    image: "/main/catalog/id4.jpg",
    isFavorite: true,
    company: "Coffee Time",
    category: "cofee",
    rating: 4.6,
    reviews: 34,
    tags: ["Популярное"],
  },
];

// Главная страница каталога категории
export default function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  const [sortOrder, setSortOrder] = useState("cheap");
  const [addedToCart, setAddedToCart] = useState<number | null>(null);
  const [favoritePulse, setFavoritePulse] = useState<number | null>(null);

  // Фильтры
  const [selectedFilters, setSelectedFilters] = useState({
    location: "",
    price: [0, 0],
    priceFrom: "",
    priceTo: "",
    rating: null,
    productType: "",
    dealType: "",
    brand: "",
    material: "",
    deliveryDays: "",
    novelty: false,
    certification: "",
    country: "",
  });

  // Фильтры для текущей категории (всегда массив!)
  const filtersForCategory = filtersConfig[slug] || filtersConfig.default;

  // Фильтрация продуктов по текущей категории и выбранным фильтрам
  const filteredProducts = mockProducts
    .filter((p) => {
      // Показываем только товары для текущей категории (slug)
      if (p.category !== slug) return false;
      // Город
      if (selectedFilters.location && p.location !== selectedFilters.location)
        return false;
      // Цена
      const priceNum = parseInt(p.price.replace(/\D/g, ""));
      if (selectedFilters.price[1] && priceNum > selectedFilters.price[1])
        return false;
      if (selectedFilters.price[0] && priceNum < selectedFilters.price[0])
        return false;
      if (
        selectedFilters.priceFrom &&
        priceNum < Number(selectedFilters.priceFrom)
      )
        return false;
      if (selectedFilters.priceTo && priceNum > Number(selectedFilters.priceTo))
        return false;
      // Рейтинг
      if (
        selectedFilters.rating &&
        (!p.rating || p.rating < selectedFilters.rating)
      )
        return false;
      // Новинка
      if (selectedFilters.novelty && !(p.tags || []).includes("Новинка"))
        return false;
      return true;
    })
    .sort((a, b) => {
      if (sortOrder === "cheap")
        return (
          parseInt(a.price.replace(/\D/g, "")) -
          parseInt(b.price.replace(/\D/g, ""))
        );
      if (sortOrder === "expensive")
        return (
          parseInt(b.price.replace(/\D/g, "")) -
          parseInt(a.price.replace(/\D/g, ""))
        );
      if (sortOrder === "rate") return (b.rating ?? 0) - (a.rating ?? 0);
      return 0;
    });

  // Микровзаимодействие "В корзину"
  const handleAddToCart = (id: number) => {
    setAddedToCart(id);
    setTimeout(() => setAddedToCart(null), 850);
  };
  // Микровзаимодействие "Избранное"
  const handleToggleFavorite = (id: number) => {
    setFavoritePulse(id);
    setTimeout(() => setFavoritePulse(null), 700);
  };

  return (
    <div className="wrapper min-h-screen flex flex-col">
      <HeaderNav />
      <main className="flex-1 flex flex-row w-full gap-8 py-8 px-[70px] ">
        <DynamicFilters
          filtersConfig={filtersForCategory}
          selectedFilters={selectedFilters}
          setSelectedFilters={setSelectedFilters}
        />
        <section className="flex-1 min-w-0 ">
          {/* Панель фильтров, сортировки */}
          <div className="flex flex-col md:flex-row items-center gap-4 mb-8 animate-fade-in">
            {/* Сортировка слева */}
            <div className="flex items-center space-x-3">
              <div className="font-nekstmedium text-[#BFAAFF]">
                Сортировать по:
              </div>
              <SortDropdown sortOrder={sortOrder} setSortOrder={setSortOrder} />
            </div>
          </div>
          {/* Products Grid */}
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[10px] px-0"
            style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            }}
          >
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={() => handleAddToCart(product.id)}
                onToggleFavorite={() => handleToggleFavorite(product.id)}
                addedToCart={addedToCart === product.id}
                favoritePulse={favoritePulse === product.id}
              />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
