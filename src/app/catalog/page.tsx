"use client";
import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Search,
  MapPin,
  Star,
  DollarSign,
  Loader2,
  Grid,
  List,
  Filter,
  Plus,
  Eye,
  RefreshCw,
} from "lucide-react";

// Тема "Dark" — заглушка для демо (CSS-переменные).
export const THEME_DARK = {
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
  // Акцент для кнопок/выделений — можно заменить на переключаемый вариант
  accent: "#6EE7B7",
};

// Утилита — записать переменные темы в :root (используется как заглушка).
function applyThemeVars(theme = THEME_DARK) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.style.setProperty("--bg-from", theme.bgFrom);
  root.style.setProperty("--bg-via", theme.bgVia);
  root.style.setProperty("--bg-to", theme.bgTo);
  root.style.setProperty("--panel", theme.panel);
  root.style.setProperty("--panel2", theme.panel2);
  root.style.setProperty("--panel-border", theme.panelBorder);
  root.style.setProperty("--text-primary", theme.textPrimary);
  root.style.setProperty("--text-secondary", theme.textSecondary);
  root.style.setProperty("--text-tertiary", theme.textTertiary);
  root.style.setProperty("--text-muted", theme.textMuted);
  root.style.setProperty("--icon-muted", theme.iconMuted);
  root.style.setProperty("--incoming-bg", theme.incomingBg);
  root.style.setProperty("--accent", theme.accent);
}

// --------------------- Sample JSON data (3 items) ---------------------
export const SAMPLE_CARDS = [
  {
    id: "s1",
    image:
      "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&q=60",
    title: 'АО "МеталлПоставщик" — Поставки стали и профилей',
    description:
      "Опытная логистика по РФ и ЕАЭС; сертифицировано; быстрая обработка заявок.",
    tags: ["Металл", "Логистика", "Сертификаты"],
    region: "Москва",
    category: "Металлы",
    responseTimeHours: 6,
    rating: 4.7,
    price: 1250,
    currency: "RUB",
    moq: 500,
  },
  {
    id: "s2",
    image:
      "https://images.unsplash.com/photo-1542223616-9b86f3f7b1b8?w=800&q=60",
    title: 'ООО "ЭлектроСбыт" — Кабели и комплектующие',
    description:
      "Широкий ассортимент, гибкие условия поставки, отсрочки возможны.",
    tags: ["Электрика", "Кабели", "OEM"],
    region: "Санкт-Петербург",
    category: "Электро",
    responseTimeHours: 24,
    rating: 4.3,
    price: 2.4,
    currency: "USD",
    moq: 1000,
  },
  {
    id: "s3",
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=60",
    title: 'LLC "Pack&Ship" — Упаковочные решения',
    description:
      "Экологичные материалы, быстрое прототипирование, скидки на объем.",
    tags: ["Упаковка", "Экология", "Проекты"],
    region: "Новосибирск",
    category: "Упаковка",
    responseTimeHours: 48,
    rating: 4.9,
    price: 0.85,
    currency: "EUR",
    moq: 200,
  },
];

export default function B2BServicesCatalog({ initialData = SAMPLE_CARDS }) {
  // layout constants (pinned aside style)
  const ASIDE_WIDTH = 300;

  // apply demo theme on mount
  useEffect(() => {
    applyThemeVars(THEME_DARK);
  }, []);

  // UI state (kept similar to previous)
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [category, setCategory] = useState("");
  const [region, setRegion] = useState("");
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(1000000);
  const [ratingMin, setRatingMin] = useState(0);
  const [dealType, setDealType] = useState("");

  const [sortBy, setSortBy] = useState("relevance");
  const [viewMode, setViewMode] = useState("grid");

  const [items] = useState(initialData || []);
  const [visibleItems, setVisibleItems] = useState([]);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 6;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [savedFilters, setSavedFilters] = useState([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const filterLiveRef = useRef(null);

  useEffect(() => {
    const pool = (items || []).flatMap((it) => [it.title, ...(it.tags || [])]);
    if (!query) return setSuggestions([]);
    const q = query.toLowerCase();
    const uniq = Array.from(new Set(pool))
      .filter((s) => s && s.toLowerCase().includes(q))
      .slice(0, 6);
    setSuggestions(uniq);
  }, [query, items]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const t = setTimeout(() => {
      try {
        let filtered = (initialData || []).filter((it) => {
          const matchesQuery = !query
            ? true
            : (
                it.title +
                " " +
                it.description +
                " " +
                (it.tags || []).join(" ")
              )
                .toLowerCase()
                .includes(query.toLowerCase());

          const matchesCategory = category ? it.category === category : true;
          const matchesRegion = region ? it.region === region : true;
          const matchesPrice =
            (it.price || 0) >= priceMin && (it.price || 0) <= priceMax;
          const matchesRating = (it.rating || 0) >= ratingMin;
          const matchesDeal = dealType ? it.dealType === dealType : true;

          return (
            matchesQuery &&
            matchesCategory &&
            matchesRegion &&
            matchesPrice &&
            matchesRating &&
            matchesDeal
          );
        });

        if (sortBy === "rating") filtered.sort((a, b) => b.rating - a.rating);
        else if (sortBy === "price_asc")
          filtered.sort((a, b) => a.price - b.price);
        else if (sortBy === "price_desc")
          filtered.sort((a, b) => b.price - a.price);
        else if (sortBy === "response")
          filtered.sort((a, b) => a.responseTimeHours - b.responseTimeHours);

        const start = 0;
        const end = PAGE_SIZE * page;
        setVisibleItems(filtered.slice(start, end));
        setLoading(false);
      } catch (err) {
        setError("Ошибка при загрузке");
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(t);
  }, [
    query,
    category,
    region,
    priceMin,
    priceMax,
    ratingMin,
    dealType,
    sortBy,
    page,
    initialData,
  ]);

  const uniqueCategories = Array.from(
    new Set((initialData || []).map((d) => d.category))
  ).filter(Boolean);
  const uniqueRegions = Array.from(
    new Set((initialData || []).map((d) => d.region))
  ).filter(Boolean);

  function handleSuggestionSelect(s) {
    setQuery(s);
    setShowSuggestions(false);
  }

  function clearFilters() {
    setCategory("");
    setRegion("");
    setPriceMin(0);
    setPriceMax(1000000);
    setRatingMin(0);
    setDealType("");
    setSortBy("relevance");
    setPage(1);
    if (filterLiveRef.current)
      filterLiveRef.current.textContent = "Фильтры сброшены";
  }

  function saveCurrentFilter(name) {
    const cfg = {
      name,
      category,
      region,
      priceMin,
      priceMax,
      ratingMin,
      dealType,
    };
    setSavedFilters((s) => [...s, cfg]);
    if (filterLiveRef.current)
      filterLiveRef.current.textContent = `Фильтр «${name}» сохранён`;
  }

  function applySavedFilter(cfg) {
    setCategory(cfg.category || "");
    setRegion(cfg.region || "");
    setPriceMin(cfg.priceMin ?? 0);
    setPriceMax(cfg.priceMax ?? 1000000);
    setRatingMin(cfg.ratingMin ?? 0);
    setDealType(cfg.dealType || "");
    if (filterLiveRef.current)
      filterLiveRef.current.textContent = `Применён фильтр «${cfg.name}»`;
  }

  function loadMore() {
    setPage((p) => p + 1);
  }

  const liveRegionId = "catalog-filter-live";

  return (
    <div
      className="min-h-screen text-slate-50"
      style={{
        fontFamily: "NekstRegular, system-ui, -apple-system",
        background:
          "linear-gradient(180deg, var(--bg-from), var(--bg-via), var(--bg-to))",
        color: "var(--text-primary)",
      }}
    >
      <style jsx>{`
        .glass {
          background: linear-gradient(180deg, var(--panel), var(--panel2));
          backdrop-filter: blur(10px) saturate(120%);
          -webkit-backdrop-filter: blur(10px) saturate(120%);
          border: 1px solid var(--panel-border);
        }
        .muted {
          color: var(--text-tertiary);
        }
        .heading {
          font-family: NekstMedium, NekstRegular, system-ui;
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 14px;
          height: 14px;
          border-radius: 9999px;
          background: var(--accent);
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
        }
        input[type="range"]::-moz-range-thumb {
          width: 14px;
          height: 14px;
          border-radius: 9999px;
          background: var(--accent);
        }
        input[type="checkbox"] {
          accent-color: var(--accent);
        }

        /* pinned aside */
        .left-rail {
          position: fixed;
          left: 0;
          top: 0;
          height: 100vh;
          width: ${ASIDE_WIDTH}px;
          padding: 24px;
          box-sizing: border-box;
          z-index: 40;
        }
        .main-area {
          margin-left: ${ASIDE_WIDTH}px;
          padding: 24px;
          min-height: 100vh;
          box-sizing: border-box;
        }

        @media (max-width: 880px) {
          .left-rail {
            position: relative;
            width: 100%;
            height: auto;
          }
          .main-area {
            margin-left: 0;
            padding: 16px;
          }
        }

        .accent-ring {
          box-shadow: 0 0 0 4px rgba(0, 0, 0, 0.12);
          border-color: var(--accent);
        }
        .sr-only {
          position: absolute !important;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
      `}</style>

      {/* ASIDE (pinned) */}
      <aside className="left-rail rounded-r-2xl glass shadow-lg flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-white font-semibold"
            style={{
              background: `linear-gradient(135deg, var(--accent), #7C3AED)`,
            }}
          >
            R
          </div>
          <div>
            <div className="text-lg heading">Каталог B2B</div>
            <div className="text-sm muted">Панель фильтров</div>
          </div>
        </div>

        <div>
          <div className="relative">
            <label htmlFor="aside-search" className="sr-only">
              Поиск в панели
            </label>
            <input
              id="aside-search"
              placeholder="Поиск"
              aria-label="Поиск в панели"
              className="w-full bg-transparent border border-transparent rounded-full px-3 py-2 text-sm"
              style={{ color: "var(--text-secondary)" }}
            />
          </div>

          <nav
            className="flex flex-col gap-2 mt-4"
            aria-label="Быстрая навигация"
          >
            <button
              onClick={() => {
                setCategory("");
                setRegion("");
              }}
              className="w-full text-left px-3 py-2 rounded-xl flex items-center gap-3 transition hover:bg-[var(--panel)]"
            >
              <div className="w-3 h-3 rounded-full bg-slate-500" />
              <span className="text-sm">Все поставщики</span>
            </button>

            <div className="mt-3 text-sm muted">Сохранённые фильтры</div>
            {savedFilters.length === 0 ? (
              <div
                className="text-sm"
                style={{ color: "var(--text-secondary)" }}
              >
                Нет
              </div>
            ) : (
              savedFilters.map((f, i) => (
                <button
                  key={i}
                  onClick={() => applySavedFilter(f)}
                  className="text-left p-2 rounded-lg"
                  style={{ border: "1px solid var(--panel-border)" }}
                >
                  {f.name}
                </button>
              ))
            )}
          </nav>
        </div>

        <div className="mt-auto text-sm muted">© Ваш портал • B2B</div>
      </aside>

      {/* MAIN */}
      <main className="main-area">
        <div className="max-w-[1200px]">
          <header className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl heading">Каталог поставщиков</h1>
              <p className="muted mt-1">
                Поиск и подбор B2B услуг — режим предпросмотра в тёмной теме.
              </p>
            </div>
            <div className="text-sm muted">Тема: Dark</div>
          </header>

          {/* TOP CONTROLS */}
          <div
            className="glass rounded-xl p-4 mb-4"
            style={{
              background:
                "linear-gradient(180deg, var(--panel), var(--panel2))",
            }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex-1 relative">
                <label htmlFor="catalog-search" className="sr-only">
                  Поиск
                </label>
                <div
                  className="flex items-center gap-2 border rounded-lg p-2"
                  style={{
                    background: "var(--panel2)",
                    borderColor: "var(--panel-border)",
                  }}
                >
                  <Search size={18} aria-hidden />
                  <input
                    id="catalog-search"
                    className="flex-1 bg-transparent outline-none text-sm"
                    placeholder="Поиск: компания, услуга, тег..."
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    aria-label="Поиск по каталогу"
                  />
                  <button
                    className="px-3 py-1 rounded-md"
                    onClick={() => {
                      setQuery("");
                      setShowSuggestions(false);
                    }}
                    aria-label="Очистить поиск"
                  >
                    <RefreshCw size={16} />
                  </button>
                </div>

                {showSuggestions && suggestions && suggestions.length > 0 && (
                  <ul
                    className="absolute z-20 left-0 right-0 mt-2 bg-[var(--panel2)] border rounded-lg shadow-lg p-2 max-h-44 overflow-auto"
                    role="listbox"
                    aria-label="Подсказки поиска"
                  >
                    {suggestions.map((s, i) => (
                      <li
                        key={s + i}
                        className="p-2 rounded hover:bg-[var(--panel)] cursor-pointer"
                        onMouseDown={() => handleSuggestionSelect(s)}
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSuggestionSelect(s);
                        }}
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-lg"
                  style={{
                    border: "1px solid var(--panel-border)",
                    background: "transparent",
                  }}
                  onClick={() => setMobileFiltersOpen(true)}
                  aria-haspopup="dialog"
                >
                  <Filter size={16} /> Фильтры
                </button>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setPage(1);
                  }}
                  className="rounded-lg p-2 text-sm"
                  style={{
                    background: "var(--panel2)",
                    borderColor: "var(--panel-border)",
                  }}
                  aria-label="Сортировка"
                >
                  <option value="relevance">По релевантности</option>
                  <option value="rating">По рейтингу</option>
                  <option value="price_asc">По цене: по возрастанию</option>
                  <option value="price_desc">По цене: по убыванию</option>
                  <option value="response">По времени отклика</option>
                </select>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode("grid")}
                    aria-pressed={viewMode === "grid"}
                    className="p-2 rounded-md"
                    aria-label="Сетка"
                  >
                    <Grid size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    aria-pressed={viewMode === "list"}
                    className="p-2 rounded-md"
                    aria-label="Список"
                  >
                    <List size={16} />
                  </button>
                </div>
              </div>
            </div>

            <div
              className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3"
              role="region"
              aria-label="Панель фильтров"
            >
              <div>
                <label
                  className="text-xs block mb-1"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  Категория
                </label>
                <select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setPage(1);
                  }}
                  className="w-full rounded p-2 text-sm"
                  style={{
                    background: "var(--panel2)",
                    borderColor: "var(--panel-border)",
                  }}
                  aria-label="Фильтр: категория"
                >
                  <option value="">Все категории</option>
                  {uniqueCategories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  className="text-xs block mb-1"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  Регион
                </label>
                <select
                  value={region}
                  onChange={(e) => {
                    setRegion(e.target.value);
                    setPage(1);
                  }}
                  className="w-full rounded p-2 text-sm"
                  style={{
                    background: "var(--panel2)",
                    borderColor: "var(--panel-border)",
                  }}
                  aria-label="Фильтр: регион"
                >
                  <option value="">Все регионы</option>
                  {uniqueRegions.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  className="text-xs block mb-1"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  Цена (мин — макс)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={priceMin}
                    onChange={(e) => setPriceMin(Number(e.target.value || 0))}
                    className="rounded p-2 text-sm w-1/2"
                    placeholder="от"
                    aria-label="Минимальная цена"
                    style={{
                      background: "var(--panel2)",
                      borderColor: "var(--panel-border)",
                    }}
                  />
                  <input
                    type="number"
                    value={priceMax}
                    onChange={(e) =>
                      setPriceMax(Number(e.target.value || 1000000))
                    }
                    className="rounded p-2 text-sm w-1/2"
                    placeholder="до"
                    aria-label="Максимальная цена"
                    style={{
                      background: "var(--panel2)",
                      borderColor: "var(--panel-border)",
                    }}
                  />
                </div>
              </div>

              <div>
                <label
                  className="text-xs block mb-1"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  Рейтинг и тип сделки
                </label>
                <div className="flex gap-2">
                  <select
                    value={ratingMin}
                    onChange={(e) => setRatingMin(Number(e.target.value))}
                    className="rounded p-2 text-sm w-1/2"
                    aria-label="Минимальный рейтинг"
                    style={{
                      background: "var(--panel2)",
                      borderColor: "var(--panel-border)",
                    }}
                  >
                    <option value={0}>Любой</option>
                    <option value={3}>3+</option>
                    <option value={4}>4+</option>
                    <option value={4.5}>4.5+</option>
                  </select>
                  <select
                    value={dealType}
                    onChange={(e) => setDealType(e.target.value)}
                    className="rounded p-2 text-sm w-1/2"
                    aria-label="Тип сделки"
                    style={{
                      background: "var(--panel2)",
                      borderColor: "var(--panel-border)",
                    }}
                  >
                    <option value="">Все</option>
                    <option value="spot">Спот</option>
                    <option value="contract">Долгосрочный</option>
                    <option value="tender">Тендер</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    saveCurrentFilter(
                      "Мой фильтр " + (savedFilters.length + 1)
                    );
                  }}
                  className="px-3 py-2 rounded-lg"
                  style={{
                    border: "1px solid var(--panel-border)",
                    background: "transparent",
                  }}
                  aria-label="Сохранить фильтр"
                >
                  <Plus size={14} /> Сохранить
                </button>
                <button
                  onClick={clearFilters}
                  className="px-3 py-2 rounded-lg"
                  style={{
                    border: "1px solid var(--panel-border)",
                    background: "transparent",
                  }}
                  aria-label="Сбросить фильтры"
                >
                  Сброс
                </button>
              </div>

              <div
                className="text-sm"
                style={{ color: "var(--text-tertiary)" }}
              >
                {visibleItems.length} из {items.length} результатов
              </div>
            </div>

            <div
              id={liveRegionId}
              ref={filterLiveRef}
              role="status"
              aria-live="polite"
              className="sr-only"
            />
          </div>

          {/* RESULTS */}
          <section
            className="min-h-[300px]"
            aria-label="Результаты поиска"
            role="region"
          >
            {loading ? (
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {new Array(6).fill(0).map((_, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl glass animate-pulse"
                    style={{ background: "var(--panel)" }}
                  >
                    <div className="h-40 rounded-md bg-[var(--panel-border)] mb-3" />
                    <div className="h-4 bg-[var(--panel-border)] rounded mb-2 w-3/4" />
                    <div className="h-3 bg-[var(--panel-border)] rounded mb-2 w-1/2" />
                    <div className="flex gap-2 mt-3">
                      <div className="h-8 w-24 bg-[var(--panel-border)] rounded" />
                      <div className="h-8 w-24 bg-[var(--panel-border)] rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div
                className="p-6 rounded-xl glass text-center"
                role="alert"
                aria-live="assertive"
                style={{ background: "var(--panel)" }}
              >
                <div className="flex items-center justify-center gap-3">
                  <Loader2 className="animate-spin" />
                  <div>
                    <div
                      className="text-lg"
                      style={{ color: "var(--text-primary)" }}
                    >
                      Ошибка
                    </div>
                    <div
                      className="text-sm"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {error}
                    </div>
                    <div className="mt-3">
                      <button
                        onClick={() => {
                          setError(null);
                          setPage(1);
                        }}
                        className="px-3 py-2 rounded"
                        style={{ border: "1px solid var(--panel-border)" }}
                      >
                        Повторить
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : visibleItems.length === 0 ? (
              <div
                className="p-6 rounded-xl glass text-center"
                role="status"
                aria-live="polite"
                style={{ background: "var(--panel)" }}
              >
                <div
                  className="text-lg mb-2"
                  style={{ color: "var(--text-primary)" }}
                >
                  Ничего не найдено
                </div>
                <div
                  className="text-sm"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Попробуйте изменить критерии поиска или сбросить фильтры.
                </div>
              </div>
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                    : "flex flex-col gap-3"
                }
              >
                {visibleItems.map((card) => (
                  <article
                    key={card.id}
                    className="rounded-xl p-4 glass flex flex-col"
                    style={{ background: "var(--panel)" }}
                    role="article"
                    aria-labelledby={`title-${card.id}`}
                    tabIndex={0}
                  >
                    <div className="relative">
                      <img
                        src={card.image}
                        alt={card.title}
                        className="w-full h-40 object-cover rounded-md mb-3"
                      />
                      <div
                        className="absolute top-3 left-3 bg-[rgba(0,0,0,0.5)] px-2 py-1 rounded text-xs"
                        style={{ color: "white" }}
                      >
                        {card.region}
                      </div>
                    </div>
                    <h3
                      id={`title-${card.id}`}
                      className="text-lg heading mb-1"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {card.title}
                    </h3>
                    <p
                      className="text-sm mb-2"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {card.description}
                    </p>
                    <div className="flex gap-2 flex-wrap mb-3">
                      {(card.tags || []).slice(0, 4).map((t) => (
                        <span
                          key={t}
                          className="text-xs px-2 py-1 rounded-full"
                          style={{
                            background: "var(--panel2)",
                            border: "1px solid var(--panel-border)",
                            color: "var(--text-secondary)",
                          }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    <div className="mt-auto flex items-center justify-between gap-2">
                      <div
                        className="flex flex-col text-sm"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        <div className="flex items-center gap-2">
                          <MapPin size={14} /> <span>{card.region}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Star size={14} /> <span>{card.rating} / 5</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign size={14} />{" "}
                          <span>
                            {card.price} {card.currency}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Eye size={14} /> <span>MOQ {card.moq}</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <button
                          className="px-3 py-2 rounded-lg"
                          style={{
                            background: "transparent",
                            border: "1px solid var(--panel-border)",
                          }}
                          aria-label={`Подробнее о ${card.title}`}
                        >
                          Подробнее
                        </button>
                        <button
                          className="px-3 py-2 rounded-lg"
                          style={{
                            background: "var(--accent)",
                            color: "var(--text-primary)",
                          }}
                          aria-label={`Запросить КП у ${card.title}`}
                        >
                          Запросить КП
                        </button>
                        <button
                          className="px-3 py-2 rounded-lg"
                          style={{
                            background: "transparent",
                            border: "1px dashed var(--panel-border)",
                          }}
                          aria-label={`Добавить ${card.title} в подбор`}
                        >
                          Добавить в подбор
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {!loading &&
              !error &&
              visibleItems.length > 0 &&
              visibleItems.length < items.length && (
                <div className="mt-4 flex justify-center">
                  <button
                    onClick={loadMore}
                    className="px-4 py-2 rounded-lg"
                    style={{ border: "1px solid var(--panel-border)" }}
                    aria-label="Загрузить ещё"
                  >
                    Загрузить ещё
                  </button>
                </div>
              )}
          </section>
        </div>
      </main>

      {/* mobile modal */}
      {mobileFiltersOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-label="Фильтры"
        >
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div
            className="w-full sm:max-w-md bg-[var(--panel2)] rounded-t-xl sm:rounded-xl p-4 glass z-50"
            style={{ border: "1px solid var(--panel-border)" }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="text-lg" style={{ color: "var(--text-primary)" }}>
                Фильтры
              </div>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="px-2 py-1"
                aria-label="Закрыть"
              >
                Закрыть
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs block mb-1">Категория</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded p-2 text-sm"
                  style={{
                    background: "var(--panel2)",
                    borderColor: "var(--panel-border)",
                  }}
                >
                  <option value="">Все</option>
                  {uniqueCategories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs block mb-1">Регион</label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full rounded p-2 text-sm"
                  style={{
                    background: "var(--panel2)",
                    borderColor: "var(--panel-border)",
                  }}
                >
                  <option value="">Все</option>
                  {uniqueRegions.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={priceMin}
                  onChange={(e) => setPriceMin(Number(e.target.value || 0))}
                  className="rounded p-2 text-sm w-1/2"
                  placeholder="от"
                />
                <input
                  type="number"
                  value={priceMax}
                  onChange={(e) =>
                    setPriceMax(Number(e.target.value || 1000000))
                  }
                  className="rounded p-2 text-sm w-1/2"
                  placeholder="до"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setMobileFiltersOpen(false);
                    setPage(1);
                  }}
                  className="px-3 py-2 rounded-lg"
                  style={{ border: "1px solid var(--panel-border)" }}
                >
                  Применить
                </button>
                <button
                  onClick={() => {
                    clearFilters();
                    setMobileFiltersOpen(false);
                  }}
                  className="px-3 py-2 rounded-lg"
                  style={{ border: "1px solid var(--panel-border)" }}
                >
                  Сброс
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
