"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AuthModal } from "@/app/AuthModal";
import {
  Heart,
  ShoppingCart,
  User2,
  ChevronDown,
  Search,
  LogOut,
  ShieldCheck,
  ShoppingBag,
  X,
} from "lucide-react";
import { FancySearch } from "./FancySearch";
import { CategoryModal } from "@/app/CategoryModal";

const userMenu = [
  {
    icon: <ShieldCheck className="w-5 h-5 text-[#a677ee]" />,
    label: "Безопасность",
    href: "/user?tab=security",
  },
];

const searchCategories = [
  "Везде",
  "Товары",
  "Услуги",
  "Оборудование",
  "Оптовые партии",
  "IT-решения",
  "B2B-услуги",
  "Сырье и материалы",
  "Мебель и интерьер",
  "Медицина",
  "Для агробизнеса",
];

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

export default function HeaderNav() {
  // --- THEME & ACCENT (добавлены) ---
  const [theme, setTheme] = useState("Classic");
  const [selectedAccent, setSelectedAccent] = useState("#FCA5A5");

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchCategory, setSearchCategory] = useState(searchCategories[0]);
  const [searchDropdown, setSearchDropdown] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const menuTimeout = useRef(null);
  const userMenuRef = useRef(null);
  const [authOpen, setAuthOpen] = useState(false);
  const pathname = usePathname();

  // когда пользователь меняет тему/акцент — выставляем CSS-переменные на :root
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
    root.setProperty("--color-search-from", palette.bgFrom);
    root.setProperty("--color-search-via", palette.bgVia);
    root.setProperty("--color-search-to", palette.bgTo);
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

  function handleMenuEnter() {
    if (menuTimeout.current) clearTimeout(menuTimeout.current);
    setMenuOpen(true);
  }
  function handleMenuLeave() {
    menuTimeout.current = setTimeout(() => setMenuOpen(false), 160);
  }

  useEffect(() => {
    function handleClick(e) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
      if (
        e.target?.closest(".search-category-dropdown") === null &&
        e.target?.closest(".search-category-btn") === null
      ) {
        setSearchDropdown(false);
      }
      if (
        e.target?.closest(".search-modal") === null &&
        e.target?.closest(".ozon-search-main") === null
      ) {
        setShowSearchModal(false);
      }
    }
    if (menuOpen || searchDropdown || showSearchModal)
      document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [menuOpen, searchDropdown, showSearchModal]);

  function handleCategoryBtnClick() {
    setShowCategoryModal((v) => !v);
  }

  return (
    <>
      <header
        className={`w-full flex flex-col ${
          ["/chat", "/user"].includes(pathname) ? "px-[0px]" : "px-[70px]"
        } z-[10100] relative`}
      >
        <div
          className={`bg-gradient-to-br from-[#121212] via-[#212121] to-[#363636] border-b border-[#29292a] shadow-lg ${
            ["/chat", "/user", "/admin"].includes(pathname)
              ? "rounded-b-[0px]"
              : "rounded-b-[50px]"
          } `}
        >
          <div className="flex items-center justify-between gap-4 px-8 pt-4 pb-3 flex-wrap ">
            {/* Лого и Каталог */}
            <div className="flex items-center gap-6 flex-shrink-0">
              <Link href="/" className="flex items-center gap-3 select-none">
                <span className="text-[34px] font-bold tracking-tight text-[#a677ee] font-nekstmedium drop-shadow-lg">
                  B2B
                </span>
              </Link>
              <button
                className={`category-btn flex items-center gap-2 px-6 py-2 rounded-2xl font-bold text-white shadow-xl hover:scale-105 transition relative bg-[#4e4e4e]`}
                aria-label="Каталог"
                onClick={handleCategoryBtnClick}
              >
                {showCategoryModal ? (
                  <X className="w-5 h-5 text-white transition" />
                ) : (
                  <ShoppingBag className="w-5 h-5 transition" />
                )}
                <span className="hidden md:inline font-nekstmedium">
                  Каталог
                </span>
              </button>
            </div>

            {/* Поиск */}
            <div className="flex items-center gap-4">
              {/* FancySearch теперь получает theme и accent */}
              <FancySearch theme={theme} accent={selectedAccent} />

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

              <input
                type="color"
                value={selectedAccent}
                onChange={(e) => setSelectedAccent(e.target.value)}
                className="w-10 h-9 p-0 rounded-md"
                style={{ border: "none" }}
              />
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                className="flex flex-col items-center px-2 text-[#b8b8d1] hover:text-[#a677ee] transition"
                onClick={() => setAuthOpen(true)}
              >
                <User2 className="w-6 h-6 mx-auto" />
                <span className="text-xs font-nekstregular">Войти</span>
              </button>
              <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
              <Link href={"/favourites"}>
                <button className="flex flex-col items-center px-2 text-[#b8b8d1] hover:text-[#a677ee] transition">
                  <Heart className="w-6 h-6 mx-auto" />
                  <span className="text-xs font-nekstregular">Избранное</span>
                </button>
              </Link>
              <Link href={"/basket"}>
                <button className="flex flex-col items-center px-2 text-[#b8b8d1] hover:text-[#a677ee] transition relative">
                  <ShoppingCart className="w-6 h-6 mx-auto" />
                  <span className="text-xs font-nekstregular">Корзина</span>
                  <span className="absolute -top-2 -right-2 text-xs bg-[#a677ee] text-[#19123b] rounded-full px-1.5 font-bold shadow">
                    2
                  </span>
                </button>
              </Link>

              <div
                className="relative"
                ref={userMenuRef}
                onMouseEnter={handleMenuEnter}
                onMouseLeave={handleMenuLeave}
              >
                <button
                  className="relative hover:bg-[#29283b] rounded-full p-2 transition flex items-center"
                  aria-label="Профиль"
                  onClick={() => setMenuOpen((v) => !v)}
                >
                  <User2 className="w-5 h-5 text-[#b8b8d1] hover:text-[#a677ee]" />
                  <ChevronDown className="w-4 h-4 ml-1 text-[#a677ee]" />
                </button>

                {menuOpen && (
                  <div className="absolute z-[1000] right-0 top-10 min-w-[220px] bg-[#232136] rounded-2xl shadow-2xl border border-[#232136] py-2 px-1 flex flex-col gap-1 animate-fade-in-menu font-nekstmedium">
                    {userMenu.map((item) => (
                      <Link href={item.href} key={item.label}>
                        <button
                          className={`w-full flex items-center gap-3 px-5 py-3 rounded-xl text-base transition-colors hover:bg-[#a677ee]/10 text-[#c1a3f7]`}
                        >
                          {item.icon}
                          {item.label}
                        </button>
                      </Link>
                    ))}
                    <Link href="/logout">
                      <button className="w-full flex items-center gap-3 px-5 py-3 rounded-xl text-base transition-colors bg-[#FF3A3A]/10 text-[#FF3A3A] hover:bg-[#FF3A3A]/20 font-nekstmedium">
                        <LogOut className="w-5 h-5" />
                        Выйти
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <CategoryModal
        open={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        activeIndex={activeCategoryIndex}
        setActiveIndex={setActiveCategoryIndex}
      />

      <style jsx>{`
        .glass {
          background: var(--panel);
          backdrop-filter: blur(10px) saturate(120%);
          -webkit-backdrop-filter: blur(10px) saturate(120%);
          border: 1px solid var(--panel-border);
        }
      `}</style>
    </>
  );
}

/* ----------------- HELPERS ----------------- */
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
