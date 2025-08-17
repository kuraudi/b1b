"use client";
import React, { useState } from "react";
import Link from "next/link";
import HeaderNav from "../components/common/HeaderNav";
import Footer from "../components/common/Footer";
import CatalogFilters from "./DynamicFilters";
import {
  Search,
  Grid,
  Heart,
  ChevronDown,
  X,
  MapPin,
  CircleDollarSign,
  Building2,
  Star,
  MonitorSmartphone,
  Truck,
  ShoppingCart,
  Package,
  Wrench,
  Cpu,
  Shield,
  BookOpen,
  CreditCard,
  Users,
  Check,
  Info,
  Star as StarIcon,
  MessageSquare,
  Share2,
  Sparkles,
  Coffee,
  Utensils,
  Scissors,
} from "lucide-react";
import SortDropdown from "../SortDropdown";

const tips = [
  "Добавьте товар в избранное, чтобы не потерять его при следующем посещении.",
  "Используйте фильтры для быстрого поиска нужной категории или услуги.",
  "Отсортируйте товары по рейтингу, чтобы увидеть самые популярные предложения.",
  "Свяжитесь с продавцом напрямую через карточку товара для уточнения деталей.",
  "Проверяйте наличие отзывов – это поможет сделать правильный выбор.",
  "Не забывайте про раздел 'Услуги' – здесь много полезных B2B-решений.",
  "Сравнивайте предложения по цене и условиям доставки.",
  "В разделе 'Партнеры' можно найти эксклюзивные бизнес-предложения.",
  "Оформите подписку на обновления каталога, чтобы не пропустить новинки.",
  "Воспользуйтесь поиском по названию компании для быстрого доступа к поставщику.",
];

const mockProducts = [
  {
    id: 1,
    title: "Станок лазерной резки PRO",
    price: "1 500 000 ₽",
    location: "Москва",
    image: "/main/catalog/id7.jpg",
    isFavorite: false,
    company: "ООО ПрофСтан",
    category: "Оборудование",
    rating: 4.8,
    reviews: 12,
    tags: ["Новинка", "В наличии"],
  },
  {
    id: 2,
    title: "Пластиковые гранулы Premium",
    price: "70 000 ₽/т",
    location: "Санкт-Петербург",
    image: "/main/catalog/id2.jpg",
    isFavorite: true,
    company: "Завод Гранула",
    category: "Сырьё",
    rating: 4.4,
    reviews: 6,
    tags: ["Популярное"],
  },
  {
    id: 3,
    title: "Комплексная переработка сырья",
    price: "от 300 000 ₽",
    location: "Екатеринбург",
    image: "/main/catalog/id3.jpg",
    isFavorite: false,
    company: "EcoПроцесс",
    category: "Услуги",
    rating: 4.9,
    reviews: 23,
    tags: ["Скидка", "В наличии"],
  },
  {
    id: 4,
    title: "Мельница для пластика LT-500",
    price: "830 000 ₽",
    location: "Казань",
    image: "/main/catalog/id6.jpg",
    isFavorite: false,
    company: "Механика+",
    category: "Оборудование",
    rating: 4.7,
    reviews: 9,
    tags: ["Популярное"],
  },
  {
    id: 5,
    title: "Гранулятор GPX-300",
    price: "1 200 000 ₽",
    location: "Новосибирск",
    image: "/main/catalog/id5.jpg",
    isFavorite: false,
    company: "ТехноМаш",
    category: "Оборудование",
    rating: 4.5,
    reviews: 15,
    tags: ["В наличии"],
  },
  {
    id: 6,
    title: "Логистические услуги для B2B",
    price: "от 15 000 ₽",
    location: "Москва",
    image: "/main/catalog/id4.jpg",
    isFavorite: true,
    company: "Логистик-Проф",
    category: "Услуги",
    rating: 4.6,
    reviews: 11,
    tags: ["Скидка"],
  },
  {
    id: 7,
    title: "Промышленные стеллажи под заказ",
    price: "от 32 000 ₽",
    location: "Санкт-Петербург",
    image: "/main/catalog/id9.jpg",
    isFavorite: false,
    company: "СтеллаКом",
    category: "Оборудование",
    rating: 4.8,
    reviews: 24,
    tags: ["Хит продаж", "На складе"],
  },
  {
    id: 8,
    title: "B2B-доставка по всей России",
    price: "от 9 900 ₽",
    location: "Новосибирск",
    image: "/main/catalog/id1.jpg",
    isFavorite: true,
    company: "ТрансСеть",
    category: "Услуги",
    rating: 4.4,
    reviews: 18,
    tags: ["Скоро подорожание"],
  },
];

// --- Информационный блок ---
function CatalogInfoSection({
  selectedCategory,
}: {
  selectedCategory: string;
}) {
  const tip = tips[Math.floor(Math.random() * tips.length)];
  const description =
    "Описания нет – выберите подходящую категорию для уточнения.";

  return (
    <section className="w-full mb-8 bg-gradient-to-br from-[#232136] via-[#221f35] to-[#2b244a] border-2 border-[#8C7FF5] rounded-2xl shadow-lg px-7 py-6 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8 transition animate-fade-in">
      <div className="flex items-center gap-3 mb-2 md:mb-0">
        <Info className="w-7 h-7 text-[#8C7FF5] flex-shrink-0 animate-bounce" />
        {selectedCategory !== "Все" && (
          <div className="text-lg md:text-xl font-nekstmedium text-[#BFAAFF]">
            <span className="mr-1">Категория:</span>
            <span className="font-bold text-[#8C7FF5]">{selectedCategory}</span>
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[#e4e4ea] font-nekstregular text-sm md:text-base mb-2">
          {description}
        </div>
        <div className="flex items-center gap-2 text-[#8C7FF5] font-nekstmedium text-sm md:text-base mt-1">
          <Star className="w-5 h-5 text-[#BFAAFF] animate-spin" />
          <span className="">{tip}</span>
        </div>
      </div>
    </section>
  );
}

// Карточка товара
function ProductCard({
  product,
  onAddToCart,
  onToggleFavorite,
  addedToCart,
  favoritePulse,
}) {
  return (
    <Link
      href={`/product`}
      className={`
        bg-gradient-to-b from-[#252525]  to-[#292932]
        border border-[#3e365e]/60 rounded-2xl
        shadow-[0_4px_24px_rgba(140,127,245,0.15)] flex flex-col group relative overflow-hidden
        transition duration-300 hover:-translate-y-2 hover:scale-[1.03] hover:shadow-[0_6px_32px_rgba(140,127,245,0.25)]
        focus-within:ring-2 focus-within:ring-[#8C7FF5] animate-fade-in
        cursor-pointer
      `}
      tabIndex={0}
      aria-label={`Карточка продукта: ${product.title}`}
      scroll={false}
      prefetch={false}
      style={{ cursor: "pointer" }}
    >
      <div className="relative">
        <img
          src={product.image}
          alt={product.title}
          className="object-cover w-full h-52 rounded-t-2xl transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          draggable={false}
        />
        <button
          className={`
            absolute top-3 right-3 bg-white/10 backdrop-blur p-2 rounded-full
            shadow-sm transition-all hover:bg-[#8C7FF5]/60
            focus:outline-none focus:ring-2 focus:ring-[#8C7FF5]
            ${favoritePulse ? "animate-pulse" : ""}
            z-10
          `}
          onClick={(e) => {
            e.preventDefault();
            onToggleFavorite();
          }}
          aria-pressed={product.isFavorite}
          aria-label={
            product.isFavorite ? "Убрать из избранного" : "Добавить в избранное"
          }
          tabIndex={-1}
          type="button"
        >
          <Heart
            className={`w-5 h-5 transition-all duration-200 ${
              product.isFavorite
                ? "fill-[#8C7FF5] text-[#8C7FF5] scale-110"
                : "text-[#bfbddb]"
            }`}
          />
        </button>
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 max-w-[65%]">
          {product.tags?.map((tag) => (
            <span
              key={tag}
              className={`
                px-2 py-0.5 rounded-full text-xs font-nekstmedium shadow select-none
                ${
                  tag === "Популярное"
                    ? "bg-[#8C7FF5]/80 text-white animate-pulse font-bold"
                    : "bg-[#2a273a]/80 text-[#c9c8ff]"
                }
              `}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <span className="text-xs text-[#8C7FF5] font-nekstmedium mb-1 tracking-wide select-none uppercase">
          {product.category}
        </span>
        <h3
          className="text-lg font-nekstmedium mb-1 line-clamp-2 text-[#e6e5f7]"
          title={product.title}
        >
          {product.title}
        </h3>
        <div className="flex items-center gap-4 text-xs text-[#BFAAFF] mb-3 font-nekstregular select-text whitespace-nowrap">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            {product.location}
          </div>
          <div className="flex items-center gap-1">
            <Building2 className="w-4 h-4" />
            {product.company}
          </div>
        </div>
        <div className="flex items-center gap-2 mb-3">
          <StarIcon className="w-4 h-4 text-[#FFD700]" />
          <span className="text-base font-nekstmedium text-white">
            {product.rating}
          </span>
          <span className="text-xs text-[#BFAAFF] font-nekstregular">
            ({product.reviews} отзывов)
          </span>
        </div>
        <div className="flex items-center justify-between gap-2 mt-auto">
          <span className="text-xl font-nekstmedium text-[#8C7FF5]">
            {product.price}
          </span>
          <button
            className={`
              bg-gradient-to-tr from-[#332c3f] to-[#875de0]
              text-white font-nekstmedium px-5 py-2 rounded-lg
              shadow transition hover:from-[#6a5fa2] hover:to-[#b09bfd]
              active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-[#8C7FF5]
              border-2 border-transparent hover:border-[#8C7FF5] flex items-center gap-2
              ${addedToCart ? "bg-[#8C7FF5] text-[#19123b]" : ""}
            `}
            aria-label={`Добавить ${product.title} в корзину`}
            onClick={(e) => {
              e.preventDefault();
              onAddToCart();
            }}
            disabled={addedToCart}
            type="button"
          >
            {addedToCart ? (
              <Check className="w-5 h-5 animate-fade-in" />
            ) : (
              <ShoppingCart className="w-5 h-5" />
            )}
            {addedToCart ? "Добавлено!" : "В корзину"}
          </button>
        </div>
        <div className="flex gap-4 mt-4">
          <button
            className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs text-[#BFAAFF]
              hover:text-[#8C7FF5] transition font-nekstregular
              focus:outline-none focus:ring-2 focus:ring-[#8C7FF5]
              border border-transparent hover:border-[#8C7FF5] duration-200"
            title="Отзывы"
            aria-label={`Отзывы о ${product.title}`}
            type="button"
            tabIndex={-1}
            onClick={(e) => e.preventDefault()}
          >
            <MessageSquare className="w-4 h-4" /> Отзывы
          </button>
          <button
            className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs text-[#BFAAFF]
              hover:text-[#8C7FF5] transition font-nekstregular
              focus:outline-none focus:ring-2 focus:ring-[#8C7FF5]
              border border-transparent hover:border-[#8C7FF5] duration-200"
            title="Поделиться"
            aria-label={`Поделиться информацией о ${product.title}`}
            type="button"
            tabIndex={-1}
            onClick={(e) => e.preventDefault()}
          >
            <Share2 className="w-4 h-4" /> Поделиться
          </button>
        </div>
      </div>
    </Link>
  );
}

export default function MainCatalogPage() {
  const [sortOrder, setSortOrder] = useState("cheap");
  const [selectedCategory, setSelectedCategory] = useState("Все");
  const [search, setSearch] = useState("");
  const [addedToCart, setAddedToCart] = useState<number | null>(null);
  const [favoritePulse, setFavoritePulse] = useState<number | null>(null);

  // Фильтры
  const [selectedFilters, setSelectedFilters] = useState({
    industry: "all",
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

  // Фильтрация продуктов по выбранным фильтрам
  const filteredProducts = mockProducts
    .filter((p) => {
      // Категория/отрасль
      if (
        selectedFilters.industry !== "all" &&
        p.category !== selectedFilters.industry
      )
        return false;
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
      // Поиск
      if (
        search &&
        !p.title.toLowerCase().includes(search.toLowerCase()) &&
        !p.company.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      // Остальные фильтры подготавливаются для будущей интеграции с реальными данными
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
        <CatalogFilters
          selectedFilters={selectedFilters}
          setSelectedFilters={setSelectedFilters}
        />
        <section className="flex-1 min-w-0 ">
          {/* Информационный блок над карточками */}
          <CatalogInfoSection
            selectedCategory={selectedFilters.industry || "Все"}
          />

          {/* Панель фильтров, сортировки, поиска */}
          <div className="flex flex-col md:flex-row items-center gap-4 mb-8 animate-fade-in">
            {/* Сортировка слева */}
            <div className="flex items-center space-x-3">
              <div className="font-nekstmedium text-[#BFAAFF]">
                Сортировать по:
              </div>
              <SortDropdown sortOrder={sortOrder} setSortOrder={setSortOrder} />
            </div>
            {/* Поиск */}
            <div className="flex-1 md:ml-8 flex items-center">
              <div className="relative w-full">
                <input
                  type="text"
                  className="w-full bg-[#1e1c2b] border border-[#8C7FF5]/30 rounded-lg py-2 pl-10 pr-4 text-[#e4e4ea] placeholder:text-[#bfaaff]/60 font-nekstregular shadow-sm focus:ring-2 focus:ring-[#8C7FF5] outline-none"
                  placeholder="Поиск по товарам или компаниям"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8C7FF5]" />
                {search && (
                  <button
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#BFAAFF] hover:text-[#8C7FF5] transition"
                    tabIndex={-1}
                    type="button"
                    onClick={() => setSearch("")}
                    aria-label="Очистить поиск"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-0">
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
