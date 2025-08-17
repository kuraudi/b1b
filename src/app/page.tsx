"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import HeaderNav from "./components/common/HeaderNav";
import Footer from "./components/common/Footer";
import ProductCard from "./ProductCard";
import {
  Search,
  Grid,
  X,
  Info,
  Star,
  Sparkles,
  Coffee,
  Utensils,
  Hotel,
  Building2,
  ShoppingCart,
  Dumbbell,
  PartyPopper,
  Bus,
  Stethoscope,
  GraduationCap,
  Construction,
} from "lucide-react";
import SortDropdown from "./SortDropdown";
import CatalogPromoCarousel from "./CarouseleItems";
import Image from "next/image";
import { AuthModal } from "./AuthModal";

/* -------------------------------------------------------------------------- */
/*                                  ДАННЫЕ                                     */
/* -------------------------------------------------------------------------- */

const themePalettes = {
  Classic: {
    bgFrom: "#1B1720",
    bgVia: "#2A2230",
    bgTo: "#1A1016",
    panel: "rgba(255,255,255,0.02)",
    panel2: "rgba(255,255,255,0.01)",
    panelBorder: "rgba(255,255,255,0.04)",
    textPrimary: "rgba(255,255,255,0.94)",
    textSecondary: "rgba(255,255,255,0.80)",
    textTertiary: "rgba(255,255,255,0.64)",
    textMuted: "rgba(255,255,255,0.56)",
    iconMuted: "rgba(255,255,255,0.68)",
    incomingBg: "rgba(255,255,255,0.04)",
  },
  Day: {
    bgFrom: "#F4F6F9",
    bgVia: "#F9FAFB",
    bgTo: "#FFFFFF",
    panel: "rgba(0,0,0,0.06)",
    panel2: "rgba(0,0,0,0.03)",
    panelBorder: "rgba(0,0,0,0.09)",
    textPrimary: "#0B1220",
    textSecondary: "#374151",
    textTertiary: "#6B7280",
    textMuted: "rgba(17,24,39,0.6)",
    iconMuted: "#0B1220",
    incomingBg: "#F1F5F9",
  },
  Dark: {
    bgFrom: "#0F1115",
    bgVia: "#16181C",
    bgTo: "#0d0e11",
    panel: "rgba(255,255,255,0.02)",
    panel2: "rgba(255,255,255,0.008)",
    panelBorder: "rgba(255,255,255,0.04)",
    textPrimary: "rgba(255,255,255,0.96)",
    textSecondary: "rgba(255,255,255,0.78)",
    textTertiary: "rgba(255,255,255,0.6)",
    textMuted: "rgba(255,255,255,0.6)",
    iconMuted: "rgba(255,255,255,0.65)",
    incomingBg: "rgba(255,255,255,0.03)",
  },
  "Glacier Dream": {
    bgFrom: "#191826",
    bgVia: "#232535",
    bgTo: "#18161E",
    panel: "rgba(255,255,255,0.02)",
    panel2: "rgba(255,255,255,0.01)",
    panelBorder: "rgba(255,255,255,0.04)",
    textPrimary: "rgba(255,255,255,0.94)",
    textSecondary: "rgba(255,255,255,0.72)",
    textTertiary: "rgba(255,255,255,0.56)",
    textMuted: "rgba(255,255,255,0.66)",
    iconMuted: "rgba(255,255,255,0.64)",
    incomingBg: "rgba(255,255,255,0.03)",
  },
  "Grape Ocean": {
    bgFrom: "#1A1720",
    bgVia: "#2B2330",
    bgTo: "#151218",
    panel: "rgba(255,255,255,0.02)",
    panel2: "rgba(255,255,255,0.01)",
    panelBorder: "rgba(255,255,255,0.04)",
    textPrimary: "rgba(255,255,255,0.94)",
    textSecondary: "rgba(255,255,255,0.74)",
    textTertiary: "rgba(255,255,255,0.6)",
    textMuted: "rgba(255,255,255,0.68)",
    iconMuted: "rgba(255,255,255,0.66)",
    incomingBg: "rgba(255,255,255,0.03)",
  },
  "Purple OLED": {
    bgFrom: "#0D0B10",
    bgVia: "#17141A",
    bgTo: "#0B0910",
    panel: "rgba(255,255,255,0.01)",
    panel2: "rgba(255,255,255,0.005)",
    panelBorder: "rgba(255,255,255,0.03)",
    textPrimary: "rgba(255,255,255,0.94)",
    textSecondary: "rgba(255,255,255,0.7)",
    textTertiary: "rgba(255,255,255,0.56)",
    textMuted: "rgba(255,255,255,0.64)",
    iconMuted: "rgba(255,255,255,0.6)",
    incomingBg: "rgba(255,255,255,0.02)",
  },
  "Aurora Dawn": {
    bgFrom: "#0F1724",
    bgVia: "#142634",
    bgTo: "#0B1A2A",
    panel: "rgba(255,255,255,0.03)",
    panel2: "rgba(255,255,255,0.01)",
    panelBorder: "rgba(255,255,255,0.05)",
    textPrimary: "rgba(255,255,255,0.96)",
    textSecondary: "rgba(255,255,255,0.78)",
    textTertiary: "rgba(255,255,255,0.66)",
    textMuted: "rgba(255,255,255,0.6)",
    iconMuted: "rgba(255,255,255,0.7)",
    incomingBg: "rgba(255,255,255,0.025)",
  },
};

const COLORS = {
  bgFrom: "#0F1115",
  bgVia: "#16181C",
  bgTo: "#0d0e11",
  btnFrom: "#a677ee",
  btnTo: "#6c47d6",
};

const categories = [
  { name: "Все", icon: <Grid className="w-6 h-6" />, endpoint: "/all" },
  {
    name: "Ресторан",
    icon: <Utensils className="w-6 h-6" />,
    endpoint: "/restaurant",
  },
  { name: "Кофейня", icon: <Coffee className="w-6 h-6" />, endpoint: "/cofee" },
  { name: "Отель", icon: <Hotel className="w-6 h-6" />, endpoint: "/hotel" },
  { name: "Бар", icon: <Coffee className="w-6 h-6" />, endpoint: "/bar" },
  {
    name: "Офис",
    icon: <Building2 className="w-6 h-6" />,
    endpoint: "/office",
  },
  {
    name: "Магазин",
    icon: <ShoppingCart className="w-6 h-6" />,
    endpoint: "/store",
  },
  {
    name: "Фитнес-клуб",
    icon: <Dumbbell className="w-6 h-6" />,
    endpoint: "/fitness",
  },
  {
    name: "Ивент-агентство",
    icon: <PartyPopper className="w-6 h-6" />,
    endpoint: "/event",
  },
  {
    name: "Транспорт",
    icon: <Bus className="w-6 h-6" />,
    endpoint: "/transport",
  },
  {
    name: "Медицина",
    icon: <Stethoscope className="w-6 h-6" />,
    endpoint: "/medical",
  },
  {
    name: "Образование",
    icon: <GraduationCap className="w-6 h-6" />,
    endpoint: "/education",
  },
  {
    name: "Строительство",
    icon: <Construction className="w-6 h-6" />,
    endpoint: "/construction",
  },
];

const CATEGORY_DESCRIPTIONS = {
  Все: "Вся продукция маркетплейса B2B — от оборудования до услуг для любого бизнеса.",
  Ресторан:
    "Решения для ресторанов: профессиональное оборудование, посуда, поставки продуктов и многое другое.",
  Кофейня:
    "Всё для запуска и развития кофейни: кофемашины, обжарка, интерьер и расходники.",
  Салон_красоты:
    "Оборудование, косметика и расходные материалы для салонов красоты и парикмахерских.",
  Производство:
    "Станки, комплектующие, упаковка и сырьё для малого и среднего производства.",
  HoReCa: "Готовые решения для гостиниц, кафе, ресторанов и кейтеринга.",
  Магазин: "Торговое оборудование, системы учёта, кассы и витрины для ритейла.",
  Пекарня: "Печи, миксеры, формы, мука и ингредиенты для пекарного бизнеса.",
  Услуги: "B2B-услуги: логистика, реклама, маркетинг, IT и бизнес-консалтинг.",
  Образование:
    "Курсы, тренинги и методические материалы для бизнеса и персонала.",
  Финансы:
    "Финансовые услуги, страхование, бухгалтерия и юридическая поддержка.",
  Оборудование:
    "Промышленное и торговое оборудование под нужды различных сфер бизнеса.",
  Упаковка:
    "Разнообразные решения для упаковки: пищевой, промышленной и брендированной.",
};

const tips = [
  "Добавьте товар в избранное, чтобы не потерять его при следующем посещении.",
  "Используйте фильтры для быстрого поиска нужной категории или услуги.",
  "Отсортируйте товары по рейтингу, чтобы увидеть самые популярные предложения.",
  "Свяжитесь с продавцом напрямую через карточку товара для уточнения деталей.",
  "Проверяйте наличие отзывов – это поможет сделать правильный выбор.",
  "Не забывайте про раздел 'Каталог' – здесь много полезных B2B-решений.",
  "Сравнивайте предложения по цене и условиям доставки.",
  "В разделе 'Партнёры' можно найти эксклюзивные бизнес-предложения.",
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
  {
    id: 9,
    title: "Профессиональные холодильные установки",
    price: "2 200 000 ₽",
    location: "Москва",
    image: "/main/catalog/id8.jpg",
    isFavorite: false,
    company: "ХолодСервис",
    category: "Оборудование",
    rating: 4.6,
    reviews: 7,
    tags: ["Новинка"],
  },
  {
    id: 10,
    title: "Корпоративные кейтеринг-пакеты",
    price: "от 25 000 ₽",
    location: "Санкт-Петербург",
    image: "/main/catalog/id10.jpg",
    isFavorite: false,
    company: "EventKitchen",
    category: "Услуги",
    rating: 4.3,
    reviews: 5,
    tags: ["Популярное"],
  },
];

/* -------------------------------------------------------------------------- */
/*                                Компоненты                                  */
/* -------------------------------------------------------------------------- */

export function IndustriesModal({
  open,
  setOpen,
  categories,
  selectedCategory,
  onSelect,
}) {
  const [search, setSearch] = useState("");
  const [showNotFound, setShowNotFound] = useState(false);

  const filtered = categories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(search.trim().toLowerCase()) ||
      (cat.altNames?.some((alt) =>
        alt.toLowerCase().includes(search.trim().toLowerCase())
      ) ??
        false)
  );

  useEffect(() => {
    if (search.trim() && filtered.length === 0) {
      setShowNotFound(true);
    } else {
      setShowNotFound(false);
    }
  }, [search, filtered.length]);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, setOpen]);

  const modalRef = useRef(null);
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, setOpen]);

  useEffect(() => {
    if (open) {
      const originalStyle = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[1050] items-center flex justify-center bg-gradient-to-br from-[var(--color-modal-from)] via-[var(--color-modal-via)] to-[var(--color-modal-to)] backdrop-blur-[2px] animate-fadeInTop">
      <div
        ref={modalRef}
        className={`
          relative rounded-3xl p-10
          bg-gradient-to-br from-[var(--color-modal-bg-from)] via-[var(--color-modal-bg-via)] to-[var(--color-modal-bg-to)]
          shadow-[0_8px_40px_0_var(--color-shadow-color)]
          border border-[var(--color-border-moderate)]
          min-w-[340px] max-w-[92vw] w-full max-h-[67vh]
          overflow-auto transition-all duration-300 animate-fadeInTop
        `}
      >
        <button
          className="absolute top-5 right-7 text-white hover:text-[var(--color-close-hover)] rounded-full p-1 transition"
          onClick={() => setOpen(false)}
          aria-label="Закрыть окно"
        >
          <X className="w-7 h-7" />
        </button>

        <div className="mb-8 text-2xl font-bold text-[var(--color-title-text)] text-center flex items-center justify-center gap-3 font-nekstmedium drop-shadow">
          <Sparkles className="w-8 h-8 text-[var(--color-title-icon)] animate-spin-slow" />
          Выберите отрасль B2B
        </div>

        <div className="flex items-center mb-8 bg-[var(--color-search-bg)] rounded-xl px-4 py-2 border border-[var(--color-search-border)] focus-within:border-[var(--color-search-icon)] transition shadow-sm">
          <Search className="w-5 h-5 text-[var(--color-search-icon)] opacity-80 mr-2" />
          <input
            className="bg-transparent outline-none text-[var(--color-input-text)] placeholder-[var(--color-placeholder)] w-full text-base font-nekstregular"
            placeholder="Найти отрасль..."
            autoFocus
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="relative min-h-[140px]">
          {!showNotFound ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5 animate-fadeInSlow">
              {(search.trim() ? filtered : categories).map((cat, i) => (
                <Link href={`category/${cat.endpoint}`} key={cat.name}>
                  <button
                    type="button"
                    className={`flex items-center gap-4 px-5 py-4 rounded-2xl w-full transition-all duration-150 border ${
                      selectedCategory === cat.name
                        ? "bg-gradient-to-tr from-[var(--color-selected-from)] to-[var(--color-selected-to)] text-white border-[var(--color-selected-border)] scale-105 shadow-lg font-bold"
                        : "bg-[var(--color-alt-bg)] text-[var(--color-alt-text)] border-transparent hover:bg-gradient-to-tr hover:from-[var(--color-hover-bg-from)] hover:to-[var(--color-hover-bg-to)] hover:text-[var(--color-hover-text)] hover:border-[var(--color-hover-border)] font-nekstregular"
                    }`}
                    tabIndex={0}
                  >
                    <span className="w-7 h-7 flex items-center justify-center">
                      {cat.icon}
                    </span>
                    <span className="text-base">{cat.name}</span>
                  </button>
                </Link>
              ))}
            </div>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center animate-fadeInNotFound pointer-events-none select-none z-[2]">
              <Sparkles className="w-8 h-8 text-[var(--color-sparkle)] mb-2 animate-fadeInNotFound" />
              <div className="text-[var(--color-sparkle)] text-lg font-nekstmedium opacity-80 animate-fadeInNotFound">
                Ничего не найдено
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeInTop {
          from {
            opacity: 0;
            transform: translateY(-24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInTop {
          animation: fadeInTop 0.42s cubic-bezier(0.77, 0, 0.175, 1);
        }
        @keyframes fadeInNotFound {
          from {
            opacity: 0;
            transform: scale(0.97) translateY(16px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-fadeInNotFound {
          animation: fadeInNotFound 0.33s cubic-bezier(0.77, 0, 0.175, 1);
        }
        @keyframes fadeInSlow {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fadeInSlow {
          animation: fadeInSlow 0.26s cubic-bezier(0.77, 0, 0.175, 1);
        }
        .animate-spin-slow {
          animation: spin 2.6s linear infinite;
        }
      `}</style>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                INFO SECTION                                 */
/* -------------------------------------------------------------------------- */

function CatalogInfoSection({ selectedCategory }) {
  const tip = tips[Math.floor(Math.random() * tips.length)];
  const description =
    CATEGORY_DESCRIPTIONS[selectedCategory] ||
    "Описания нет – выберите подходящую категорию для уточнения.";

  return (
    <section className="w-full vopros mb-6 bg-gradient-to-br from-[#2c2c2c]/50 via-[#313131] to-[#212020]/0 rounded-2xl shadow-lg px-7 py-6 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8 transition animate-fade-in">
      <div className="flex items-center gap-3 mb-2 md:mb-0">
        <Info className="w-7 h-7 text-[var(--color-info-icon)] flex-shrink-0 animate-bounce" />
        {selectedCategory !== "Все" && (
          <div className="text-lg md:text-xl font-nekstmedium text-[var(--color-info-label)]">
            <span className="mr-1">Категория:</span>
            <span className="font-bold text-[var(--color-info-border)]">
              {selectedCategory}
            </span>
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[var(--color-description-text)] font-nekstregular text-sm md:text-base mb-2">
          {description}
        </div>
        <div className="flex items-center gap-2 text-[var(--color-tip-text)] font-nekstmedium text-sm md:text-base mt-1">
          <Star className="w-5 h-5 text-[var(--color-star-text)] animate-spin" />
          <span className="">{tip}</span>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                                MAIN PAGE                                    */
/* -------------------------------------------------------------------------- */

export default function MainCatalogPage() {
  const [theme, setTheme] = useState("Classic");
  const [sortOrder, setSortOrder] = useState("cheap");
  const [selectedCategory, setSelectedCategory] = useState("Все");
  const [search, setSearch] = useState("");
  const [industriesOpen, setIndustriesOpen] = useState(false);
  const [addedToCart, setAddedToCart] = useState(null);
  const [favoritePulse, setFavoritePulse] = useState(null);
  const [selectedAccent, setSelectedAccent] = useState("#FCA5A5");

  useEffect(() => {
    const palette = themePalettes[theme] || themePalettes.Classic;
    const root = document.documentElement.style;

    // modal/bg
    root.setProperty("--color-modal-from", palette.bgFrom);
    root.setProperty("--color-modal-via", palette.bgVia);
    root.setProperty("--color-modal-to", palette.bgTo);

    // panels
    root.setProperty("--color-modal-bg-from", palette.panel);
    root.setProperty("--color-modal-bg-via", palette.panel2);
    root.setProperty("--color-modal-bg-to", palette.panel2);

    root.setProperty("--color-shadow-color", "rgba(0,0,0,0.45)");
    root.setProperty("--color-border-moderate", palette.panelBorder);

    // texts/icons
    root.setProperty("--color-close-hover", palette.textTertiary);
    root.setProperty("--color-title-text", palette.textPrimary);
    root.setProperty("--color-title-icon", palette.iconMuted);

    // search
    root.setProperty("--color-search-bg", palette.incomingBg || palette.panel);
    root.setProperty("--color-search-border", palette.panelBorder);
    root.setProperty("--color-search-icon", palette.iconMuted);
    root.setProperty("--color-input-text", palette.textPrimary);
    root.setProperty("--color-placeholder", palette.textMuted);

    // categories selection
    root.setProperty("--color-selected-from", palette.bgVia);
    root.setProperty("--color-selected-to", palette.bgFrom);
    root.setProperty("--color-selected-border", palette.panelBorder);

    // alt buttons
    root.setProperty("--color-alt-bg", palette.panel);
    root.setProperty("--color-alt-text", palette.textPrimary);
    root.setProperty("--color-hover-bg-from", palette.bgVia);
    root.setProperty("--color-hover-bg-to", palette.bgFrom);
    root.setProperty("--color-hover-text", palette.textPrimary);
    root.setProperty("--color-hover-border", palette.panelBorder);

    // info
    root.setProperty("--color-info-from", palette.bgFrom);
    root.setProperty("--color-info-via", palette.bgVia);
    root.setProperty("--color-info-to", palette.bgTo);
    root.setProperty("--color-info-border", palette.panelBorder);
    root.setProperty("--color-info-label", palette.textPrimary);
    root.setProperty("--color-info-icon", palette.iconMuted);
    root.setProperty("--color-description-text", palette.textSecondary);
    root.setProperty("--color-tip-text", palette.textTertiary);
    root.setProperty("--color-star-text", palette.iconMuted);

    // categories / banner
    root.setProperty("--color-categories-from", palette.bgVia);
    root.setProperty("--color-categories-to", palette.bgFrom);
    root.setProperty("--color-categories-text", palette.textPrimary);
    root.setProperty("--color-categories-hover-from", palette.bgTo);
    root.setProperty("--color-categories-hover-to", palette.bgVia);
    root.setProperty("--color-categories-focus-ring", palette.panelBorder);
    root.setProperty("--color-categories-hover-border", palette.panelBorder);

    root.setProperty("--color-banner-from", palette.bgFrom);
    root.setProperty("--color-banner-via", palette.bgVia);
    root.setProperty("--color-banner-to", palette.bgTo);
    root.setProperty("--color-banner-gold", palette.textPrimary);
    root.setProperty("--color-banner-text", palette.textSecondary);
    root.setProperty("--color-banner-btn-text-hover", palette.textPrimary);

    root.setProperty("--color-sparkle", palette.iconMuted);

    // accent
    root.setProperty("--accent", selectedAccent);
    root.setProperty("--accent-rgb", hexToRgb(selectedAccent));
  }, [theme, selectedAccent]);

  const filteredProducts = mockProducts
    .filter((p) => {
      if (selectedCategory !== "Все" && p.category !== selectedCategory)
        return false;
      if (
        search &&
        !p.title.toLowerCase().includes(search.toLowerCase()) &&
        !p.company.toLowerCase().includes(search.toLowerCase())
      )
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

  const handleAddToCart = (id) => {
    setAddedToCart(id);
    setTimeout(() => setAddedToCart(null), 850);
  };
  const handleToggleFavorite = (id) => {
    setFavoritePulse(id);
    setTimeout(() => setFavoritePulse(null), 700);
  };

  return (
    <div
      className=" min-h-screen flex flex-col bg-gradient-to-br "
      style={{
        background: `linear-gradient(to bottom right, ${COLORS.bgFrom}, ${COLORS.bgVia}, ${COLORS.bgTo})`,
      }}
    >
      <HeaderNav />

      <main className="flex-1 flex flex-row w-full gap-8 py-8 px-[70px] ">
        <section className="flex-1 min-w-0 ">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl heading">Каталог B2B</h1>
              <p className="muted mt-1">
                Раздел для поиска товаров и услуг для бизнеса.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="px-3 py-2 rounded-lg bg-[var(--panel)] border"
                style={{ borderColor: "var(--color-border-moderate)" }}
              >
                {Object.keys(themePalettes).map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <div className="text-sm muted">Акцент</div>
              <input
                type="color"
                value={selectedAccent}
                onChange={(e) => setSelectedAccent(e.target.value)}
                className="w-10 h-9 p-0 rounded-md"
                style={{ border: "none" }}
              />
            </div>
          </div>

          <CatalogInfoSection selectedCategory={selectedCategory} />

          <IndustriesModal
            open={industriesOpen}
            setOpen={setIndustriesOpen}
            categories={categories}
            selectedCategory={selectedCategory}
            onSelect={setSelectedCategory}
          />

          <div className="flex flex-col md:flex-row items-center gap-4 mb-8 animate-fade-in">
            <div className="flex items-center space-x-3">
              <div className="font-nekstmedium text-[var(--color-info-label)]">
                Сортировать по:
              </div>
              <SortDropdown sortOrder={sortOrder} setSortOrder={setSortOrder} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-nekstregular text-[var(--color-info-label)]">
                Выбрать отрасль:
              </span>
              <button
                type="button"
                className="px-5 py-2 rounded-xl font-nekstmedium shadow-lg transition-all bg-gradient-to-tr from-[var(--color-categories-from)] to-[var(--color-categories-to)] text-[var(--color-categories-text)] hover:from-[var(--color-categories-hover-from)] hover:to-[var(--color-categories-hover-to)] focus:outline-none focus:ring-2 focus:ring-[var(--color-categories-focus-ring)] border-2 border-transparent hover:border-[var(--color-categories-hover-border)] animate-fade-in"
                onClick={() => setIndustriesOpen(true)}
              >
                <Grid className="w-5 h-5 inline-block mr-2 animate-bounce" />
                Категории B2B
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-[10px] px-0">
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

          <div className="my-12">
            <CatalogPromoCarousel />
          </div>

          <div className="relative hidden flex items-center bg-gradient-to-tr from-[var(--color-banner-from)] via-[var(--color-banner-via)] to-[var(--color-banner-to)] rounded-2xl overflow-hidden shadow-xl min-h-[140px] px-8 py-6 mb-10">
            <Star className="w-12 h-12 text-white drop-shadow-lg animate-pulse" />
            <div className="ml-7 flex-1">
              <div className="text-2xl font-bold text-white drop-shadow">
                Горящие предложения{" "}
                <span className="text-[var(--color-banner-gold)]">июля</span>
              </div>
              <div className="mt-2 text-[var(--color-banner-text)] text-lg font-nekstregular">
                Лучшие товары и услуги — <b>выгода до -25%</b>!
              </div>
            </div>
            <a
              href="#"
              className="ml-8 bg-white text-[var(--color-info-border)] font-bold px-6 py-3 rounded-xl shadow-lg text-lg hover:bg-[var(--color-info-label)] hover:text-[var(--color-banner-btn-text-hover)] transition"
            >
              Смотреть акции
            </a>
          </div>

          <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 gap-4 py-8 px-1">
            {categories.slice(1, 4).map((cat, i) => {
              const images = [
                "/main/categories/1.jpg",
                "/main/categories/2.jpg",
                "/main/categories/3.jpg",
              ];
              return (
                <button
                  key={cat.name}
                  className="group relative flex flex-col items-center justify-center rounded-2xl overflow-hidden shadow-lg min-h-[120px] transition-transform will-change-transform hover:scale-105 focus:scale-105 active:scale-[.98] outline-none focus:ring-2 focus:ring-[var(--color-categories-focus-ring)]"
                  tabIndex={0}
                  aria-label={`Открыть каталог: ${cat.name}`}
                >
                  <div className="absolute inset-0 -z-10">
                    <Image
                      src={images[i]}
                      alt={cat.name}
                      fill
                      style={{ objectFit: "cover", objectPosition: "center" }}
                      sizes="(max-width: 768px) 100vw, 33vw"
                      priority={i === 0}
                      draggable={false}
                    />
                  </div>
                  <div className="absolute inset-0 bg-black/50 z-0"></div>
                  <div className="relative z-10 mt-2 mb-3">{cat.icon}</div>
                  <div className="relative z-10 text-base font-nekstmedium text-white mb-1 drop-shadow">
                    {cat.name}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-0">
            {mockProducts.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                HELPERS                                      */
/* -------------------------------------------------------------------------- */
function hexToRgb(hex) {
  const h = hex.replace("#", "");
  const full =
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h;
  const num = parseInt(full, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `${r}, ${g}, ${b}`;
}
