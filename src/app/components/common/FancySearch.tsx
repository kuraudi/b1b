// FancySearch.jsx (или .tsx) — обновлённая версия
import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, Search, X } from "lucide-react";

export function FancySearch({ theme, accent }) {
  const [searchCategory, setSearchCategory] = useState("Все");
  const [searchDropdown, setSearchDropdown] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [showSearchModal, setShowSearchModal] = useState(false);
  const searchRef = useRef(null);

  // переменные стиля, которые будут обновляться при смене theme/accent
  const [vars, setVars] = useState({
    searchFrom: "#23222a",
    searchVia: "#29283b",
    searchTo: "#251f36",
    searchAltFrom: "#2d2c3e",
    searchAltVia: "#23222a",
    searchAltTo: "#2e244a",
    border: "#3a306b",
    placeholder: "#8d8dbd",
    inputText: "#f5f5fd",
    btnFrom: "#a677ee",
    btnTo: "#6c47d6",
    tagFrom: "#35355a",
    tagTo: "#3a3660",
    accent: accent || "#a677ee",
    accentRgb: hexToRgb(accent || "#a677ee"),
    searchIcon: "#8d8dbd",
  });

  // --> ключевой useEffect: перечитываем css-переменные при изменении theme или accent
  useEffect(() => {
    const root = getComputedStyle(document.documentElement);
    const read = (name, fallback) => {
      const v = root.getPropertyValue(name).trim();
      return v || fallback;
    };

    const newAccent = accent || read("--accent", vars.accent);
    const accentRgb =
      read("--accent-rgb", "") ||
      (newAccent.startsWith("#") ? hexToRgb(newAccent) : vars.accentRgb);

    setVars((prev) => ({
      ...prev,
      searchFrom: read("--color-search-from", prev.searchFrom),
      searchVia: read("--color-search-via", prev.searchVia),
      searchTo: read("--color-search-to", prev.searchTo),
      searchAltFrom: read("--color-search-alt-from", prev.searchAltFrom),
      searchAltVia: read("--color-search-alt-via", prev.searchAltVia),
      searchAltTo: read("--color-search-alt-to", prev.searchAltTo),
      border: read("--color-search-border", prev.border),
      placeholder: read("--color-placeholder", prev.placeholder),
      inputText: read("--color-input-text", prev.inputText),
      btnFrom: read("--color-btn-from", prev.btnFrom),
      btnTo: read("--color-btn-to", prev.btnTo),
      tagFrom: read("--color-tag-from", prev.tagFrom),
      tagTo: read("--color-tag-to", prev.tagTo),
      accent: newAccent,
      accentRgb,
      searchIcon: read("--color-search-icon", prev.searchIcon),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme, accent]); // <- пересчёт при смене theme или accent

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (searchValue) setSearchValue("");
        else if (showSearchModal) setShowSearchModal(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [searchValue, showSearchModal]);

  useEffect(() => {
    const onClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target))
        setShowSearchModal(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // ... остальная логика поиска (фильтрация подсказок/товаров) можно скопировать из вашего файла
  // для краткости добавлю минимальную заглушку подсказок:
  const SUGGESTED_TAGS = [
    "оптовые поставки",
    "упаковка и тара",
    "сырьё и материалы",
    "товары для офиса",
    "электроника для бизнеса",
  ];
  const SEARCH_SUGGESTIONS = [
    "пластиковая тара оптом",
    "упаковочные материалы",
    "бумага для принтера а4",
  ];
  const MOCK_PRODUCTS = [
    {
      id: 1,
      name: "Гофрокороб",
      category: "Упаковка",
      image: "/main/catalog/id1.jpg",
    },
    {
      id: 2,
      name: "Пластиковые гранулы",
      category: "Сырьё",
      image: "/main/catalog/id2.jpg",
    },
  ];

  const filteredTags = searchValue.length
    ? SUGGESTED_TAGS.filter((t) =>
        t.toLowerCase().includes(searchValue.toLowerCase())
      ).slice(0, 7)
    : SUGGESTED_TAGS.slice(0, 5);
  const filteredSuggestions = searchValue.length
    ? SEARCH_SUGGESTIONS.filter((s) =>
        s.toLowerCase().includes(searchValue.toLowerCase())
      ).slice(0, 5)
    : [];
  const filteredProducts = searchValue.length
    ? MOCK_PRODUCTS.filter(
        (p) =>
          (searchCategory === "Все" || p.category === searchCategory) &&
          p.name.toLowerCase().includes(searchValue.toLowerCase())
      ).slice(0, 4)
    : [];

  // inline styles использующие vars
  const inputGradient = {
    background: `linear-gradient(90deg, ${vars.searchFrom}, ${vars.searchVia}, ${vars.searchTo})`,
    color: vars.inputText,
  };
  const rootGradient = {
    background: `linear-gradient(90deg, ${vars.searchAltFrom}, ${vars.searchAltVia}, ${vars.searchAltTo})`,
    borderColor: vars.border,
  };

  return (
    <div className="relative w-full max-w-[760px]">
      <form
        onSubmit={(e) => e.preventDefault()}
        className="flex items-center rounded-[18px] border-[2.5px]"
        style={{ ...rootGradient, borderStyle: "solid", borderWidth: 2.5 }}
      >
        <button
          type="button"
          onClick={() => setSearchDropdown((v) => !v)}
          className="px-4 py-2"
        >
          {searchCategory} <ChevronDown />
        </button>
        <input
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onFocus={() => setShowSearchModal(true)}
          placeholder={`Искать в "${searchCategory}"…`}
          style={{ ...inputGradient, caretColor: vars.accent }}
          className="flex-1 p-3"
        />
        <button
          type="submit"
          style={{
            background: `linear-gradient(90deg, ${vars.btnFrom}, ${vars.btnTo})`,
            color: "#fff",
          }}
          className="px-4 py-2"
        >
          <Search />
        </button>
      </form>

      {(showSearchModal || searchValue) && (
        <div
          ref={searchRef}
          className="absolute left-0 right-0 mt-3 rounded-3xl p-4"
          style={{
            background: `linear-gradient(180deg, ${vars.searchFrom}, ${vars.searchVia})`,
            border: `1px solid ${vars.border}`,
            boxShadow: `0 12px 60px rgba(${vars.accentRgb},0.08)`,
          }}
        >
          {/* контент подсказок — упростил для примера */}
          {filteredSuggestions.map((s) => (
            <div key={s} className="py-2">
              {s}
            </div>
          ))}
          {filteredProducts.map((p) => (
            <div key={p.id} className="py-2 flex items-center gap-3">
              <img src={p.image} alt="" className="w-10 h-10 object-cover" />
              <div>{p.name}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// helper
function hexToRgb(hex) {
  if (!hex) return "166,119,238";
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
