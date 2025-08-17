import React, { useState, useRef } from "react";
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

// const COLORS = {
//   bgFrom: "#24232f",
//   bgVia: "#221f27",
//   bgTo: "#34264a",
//   btnFrom: "#a677ee",
//   btnTo: "#6c47d6",
// };

const COLORS = {
  bgFrom: "#111827",
  bgVia: "#16181C",
  bgTo: "#0d0e11",
  btnFrom: "#a677ee",
  btnTo: "#6c47d6",
};

export default function HeaderNav() {
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

  function handleMenuEnter() {
    if (menuTimeout.current) clearTimeout(menuTimeout.current);
    setMenuOpen(true);
  }
  function handleMenuLeave() {
    menuTimeout.current = setTimeout(() => setMenuOpen(false), 160);
  }

  React.useEffect(() => {
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
            <FancySearch />

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
