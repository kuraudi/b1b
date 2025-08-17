import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, Search, X } from "lucide-react";

const SUGGESTED_TAGS = [
  "оптовые поставки",
  "упаковка и тара",
  "сырьё и материалы",
  "товары для офиса",
  "электроника для бизнеса",
  "оборудование",
  "логистика",
  "доставка",
  "товары для производства",
  "текстиль оптом",
];

const SEARCH_SUGGESTIONS = [
  "пластиковая тара оптом",
  "упаковочные материалы",
  "бумага для принтера а4",
  "станок для резки металла",
  "паллеты деревянные",
  "офисные кресла оптом",
  "моноблоки для офиса",
  "грузоперевозки по России",
  "ткань для спецодежды",
  "хозяйственные товары",
];
const COLORS = {
  searchBgFrom: "#0F1115",
  searchBgVia: "#16181C",
  searchBgTo: "#0d0e11",
  btnFrom: "#a677ee",
  btnTo: "#6c47d6",
};

const MOCK_PRODUCTS = [
  {
    id: 1,
    name: "Гофрокороб 600x400x400 мм",
    category: "Упаковка",
    image: "/main/catalog/id1.jpg",
  },
  {
    id: 2,
    name: "Пластиковые гранулы (ПВД)",
    category: "Сырьё",
    image: "/main/catalog/id2.jpg",
  },
  {
    id: 3,
    name: "Складской стеллаж 2000x1000 мм",
    category: "Оборудование",
    image: "/main/catalog/id3.jpg",
  },
  {
    id: 4,
    name: "Флаконы пластиковые 500 мл (партия 1000 шт.)",
    category: "Упаковка",
    image: "/main/catalog/id4.jpg",
  },
  {
    id: 5,
    name: "Офисные кресла эргономичные (оптом)",
    category: "Мебель",
    image: "/main/catalog/id5.jpg",
  },
  {
    id: 6,
    name: "Ткань смесовая для спецодежды",
    category: "Текстиль",
    image: "/main/catalog/id6.jpg",
  },
  {
    id: 7,
    name: "Принтеры для офиса (Canon MF3010)",
    category: "Электроника",
    image: "/main/catalog/id7.jpg",
  },
  {
    id: 8,
    name: "Бумага А4 80 г/м² (5 пачек)",
    category: "Канцтовары",
    image: "/main/catalog/id8.jpg",
  },
  {
    id: 9,
    name: "Логистические услуги по РФ",
    category: "Услуги",
    image: "/main/catalog/id9.jpg",
  },
  {
    id: 10,
    name: "Металлические паллеты (1200x800 мм)",
    category: "Оборудование",
    image: "/main/catalog/id4.jpg",
  },
];

const searchCategories = [
  "Все",
  "Упаковка",
  "Сырьё",
  "Оборудование",
  "Мебель",
  "Текстиль",
  "Электроника",
  "Канцтовары",
  "Услуги",
];

export function FancySearch() {
  const [searchCategory, setSearchCategory] = useState("Все");
  const [searchDropdown, setSearchDropdown] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [showSearchModal, setShowSearchModal] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (searchValue) {
          // сначала очищаем ввод
          setSearchValue("");
        } else if (showSearchModal) {
          // если ввода уже нет — просто закрываем
          setShowSearchModal(false);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [searchValue, showSearchModal]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchModal(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Теги по поиску
  const filteredTags =
    searchValue.length > 0
      ? SUGGESTED_TAGS.filter((t) =>
          t.toLowerCase().includes(searchValue.toLowerCase())
        ).slice(0, 7)
      : SUGGESTED_TAGS.slice(0, 5);

  // Буквенные подсказки
  const filteredSuggestions =
    searchValue.length > 0
      ? SEARCH_SUGGESTIONS.filter((s) =>
          s.toLowerCase().includes(searchValue.toLowerCase())
        ).slice(0, 5)
      : [];

  // Товарные подсказки
  const filteredProducts =
    searchValue.length > 0
      ? MOCK_PRODUCTS.filter(
          (p) =>
            (searchCategory === "Все" || p.category === searchCategory) &&
            p.name.toLowerCase().includes(searchValue.toLowerCase())
        ).slice(0, 4)
      : [];

  // ---- Blur Overlay для всей страницы ----
  // z-[49998] чтобы быть ниже поиска и модалки, но выше всего остального
  // pointer-events-auto чтобы можно было ловить клик вне поиска

  return (
    <>
      {(showSearchModal || searchValue) && (
        <div
          className="fixed inset-0 z-[49998] pointer-events-auto"
          style={{
            backdropFilter: "blur(6px)",
            background: "rgba(32, 31, 55, 0.33)",
            transition: "backdrop-filter 0.25s, background 0.25s",
          }}
        ></div>
      )}
      <div className="relative flex-1 flex justify-center items-center min-w-[180px] max-w-[760px] px-2 z-[50000]">
        <form
          className="w-full flex items-center relative rounded-[18px] border-[2.5px] border-[#3c3c3d] bg-gradient-to-r from-[#2d2c3e] via-[#23222a] to-[#2e244a] shadow-[0_8px_32px_0_rgba(60,40,120,0.16)] group transition-all duration-250 hover:border-[#555356] focus-within:border-[#a677ee] focus-within:shadow-[0_0_16px_4px_#a677ee44] "
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          {/* Категория */}
          <button
            type="button"
            className="flex items-center gap-2 px-5 py-2.5 rounded-l-[15px] bg-gradient-to-br from-[#494848] to-[#191919] text-[#bcb7e5] font-nekstmedium text-[17px] border-r border-[#222222] hover:bg-[#47464b] hover:text-[#dbb8ff] focus:outline-none focus:text-[#a677ee] active:scale-95 transition-all duration-150 shadow-[inset_2px_2px_6px_#2d2c3e55]"
            onClick={() => setSearchDropdown((v) => !v)}
            aria-label="Выбрать категорию поиска"
            style={{ boxShadow: "inset 0 2px 6px #2d2c3e33" }}
          >
            {searchCategory}
            <ChevronDown className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" />
          </button>

          {/* Dropdown категории */}
          {searchDropdown && (
            <div className="absolute left-0 top-14 min-w-[250px] bg-gradient-to-br from-[#373739] via-[#2d2c3e] to-[#363156] shadow-2xl rounded-2xl border border-[#3a306b] z-[50001] py-4 px-3 animate-[fadeIn_.18s_ease-out] backdrop-blur-lg">
              <div className="font-bold text-[#dbb8ff] px-2 pb-2 text-[18px]">
                Категории поиска
              </div>
              <ul className="flex flex-col gap-1">
                {searchCategories.map((cat) => (
                  <li key={cat}>
                    <button
                      type="button"
                      className={`w-full px-4 py-2 rounded-lg text-left transition font-nekstmedium text-[16px] ${
                        searchCategory === cat
                          ? "bg-gradient-to-r from-[#a677ee]/40 to-[#6c47d6]/30 text-[#dbb8ff] font-extrabold shadow-[0_2px_8px_0_#a677ee33]"
                          : "hover:bg-[#2f2b46] hover:text-[#a677ee] text-[#bcb7e5]"
                      }`}
                      onClick={() => {
                        setSearchCategory(cat);
                        setSearchDropdown(false);
                      }}
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
              <button
                className="absolute top-2 right-3 text-[#a677ee] hover:bg-[#29283b] p-2 rounded-full transition"
                onClick={() => setSearchDropdown(false)}
                aria-label="Закрыть"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Инпут поиска */}
          <input
            type="text"
            placeholder={`Искать в "${searchCategory}"…`}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onFocus={() => setShowSearchModal(true)}
            className="flex-1 py-2.5 px-5 font-nekstmedium text-[17px] bg-gradient-to-r from-[#232323] via-[#313132] to-[#1b1b1d] text-[#f5f5fd] placeholder:text-[#8d8dbd] outline-none focus:ring-0 rounded-none rounded-r-[22px] z-1 transition-all duration-200"
          />

          {/* Кнопка поиска */}
          <button
            type="submit"
            className="ml-[-15px] z-0 px-6 h-[46px] rounded-r-[16px] bg-gradient-to-br from-[#6c6a6e] via-[#3c3b3d] to-[#27262a] text-white flex items-center justify-center shadow-[0_2px_14px_0_#a677ee33] hover:scale-105 active:scale-98 transition-all duration-200"
            aria-label="Найти"
          >
            <Search className="w-5 h-5 drop-shadow-[0_1px_2px_#2d2c3e88]" />
          </button>
        </form>

        {/* Модалка поиска */}
        {(showSearchModal || searchValue) && (
          <div
            className="absolute left-1/2 -translate-x-1/2 z-[50000] top-[65px] min-w-[480px] max-w-[760px] w-full bg-gradient-to-br from-[#23222a] via-[#29283b] to-[#251f36] border-2 border-[#3a306b] rounded-3xl shadow-[0_12px_60px_0_#a677ee25,0_2px_8px_0_#00000044] p-0 animate-[fadeIn_.18s_ease-out] overflow-hidden backdrop-blur-xl"
            ref={searchRef}
          >
            {searchValue ? (
              <div className="p-6 ">
                {/* Теги */}
                {filteredTags.length > 0 && (
                  <div className="flex flex-wrap gap-3 mb-6">
                    {filteredTags.map((tag) => (
                      <button
                        key={tag}
                        className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#35355a] to-[#3a3660] text-[#a677ee] font-nekstmedium text-[15px] hover:from-[#4d388d] hover:to-[#3a3660] hover:scale-105 transition-all shadow-[0_1px_2px_#a677ee22]"
                        tabIndex={-1}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                )}

                {/* 5 буквенных подсказок */}
                {filteredSuggestions.length > 0 && (
                  <ul className="flex flex-col gap-2 mb-5">
                    {filteredSuggestions.slice(0, 5).map((s, i) => (
                      <li
                        key={s}
                        className="flex items-center gap-3 px-5 py-3 rounded-xl hover:bg-[#35355a] cursor-pointer group transition w-full"
                      >
                        <Search className="w-5 h-5 text-[#7e7e9a] group-hover:text-[#a677ee] transition" />
                        <span className="text-[#f5f5fd] font-nekstmedium text-[16px]">
                          {s
                            .split(new RegExp(`(${searchValue})`, "gi"))
                            .map((part, idx) =>
                              part.toLowerCase() ===
                              searchValue.toLowerCase() ? (
                                <span
                                  key={idx}
                                  className="font-bold text-[#a677ee]"
                                >
                                  {part}
                                </span>
                              ) : (
                                <span key={idx}>{part}</span>
                              )
                            )}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* 4 товара в одну колонку — по ширине поиска */}
                {filteredProducts.length > 0 && (
                  <ul className="flex flex-col gap-2 mt-2">
                    {filteredProducts.map((item) => (
                      <li
                        key={item.id}
                        className="flex items-center gap-4 px-5 py-3 rounded-xl bg-gradient-to-br from-[#312c51]/70 to-[#23222a]/85 hover:from-[#3a3360]/90 hover:to-[#453d78]/80 hover:shadow-[0_4px_28px_0_#a677ee44] transition cursor-pointer group border border-[#393959]/40 w-full"
                      >
                        <span className="w-12 h-12 rounded-xl bg-[#35355a] flex items-center justify-center overflow-hidden shadow-[0_1px_3px_#a677ee22]">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded-xl"
                          />
                        </span>
                        <div className="flex flex-col flex-1 min-w-0">
                          <span className="text-[#f5f5fd] font-nekstmedium text-[16px] truncate">
                            {item.name}
                          </span>
                          <span className="text-[#a677ee] text-xs truncate">
                            {item.category}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
                {/* Если ничего не найдено */}
                {filteredTags.length === 0 &&
                  filteredSuggestions.length === 0 &&
                  filteredProducts.length === 0 && (
                    <div className="text-center font-nekstmedium text-[#bcb7e5] py-7 text-lg">
                      Ничего не найдено
                    </div>
                  )}
              </div>
            ) : (
              // Контент при пустом поиске (можно вернуть историю и рекомендации)
              <div className="flex flex-row bg-gradient-to-r from-[#23222a]/85 to-[#29283b]/95">
                {/* История */}
                <div className="flex flex-col p-6 min-w-[230px] border-r border-[#393959]/80">
                  <div className="font-nekstmedium text-[#dbb8ff] text-lg mb-3 tracking-tight">
                    История
                  </div>
                  <ul className="flex flex-col gap-4">
                    <li className="flex items-center gap-3">
                      <span className="w-9 h-9 rounded-xl bg-[#35355a] flex items-center justify-center overflow-hidden shadow-[0_1px_3px_#a677ee22]">
                        <img
                          src="/main/catalog/id2.jpg"
                          alt=""
                          className="w-9 h-9 object-cover rounded-xl"
                        />
                      </span>
                      <div className="flex flex-col">
                        <span className="text-[#f5f5fd] font-nekstmedium text-[15px]">
                          Шорты мужские
                        </span>
                        <span className="text-[#bcb7e5] text-xs">Одежда</span>
                      </div>
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="w-9 h-9 rounded-xl bg-[#35355a] flex items-center justify-center overflow-hidden shadow-[0_1px_3px_#a677ee22]">
                        <img
                          src="/main/catalog/id3.jpg"
                          alt=""
                          className="w-9 h-9 object-cover rounded-xl"
                        />
                      </span>
                      <div className="flex flex-col">
                        <span className="text-[#f5f5fd] font-nekstmedium text-[15px]">
                          Смартфоны
                        </span>
                        <span className="text-[#bcb7e5] text-xs">
                          Электроника
                        </span>
                      </div>
                    </li>
                  </ul>
                </div>
                {/* Рекомендации */}
                <div className="flex-1 flex flex-col p-6 min-w-[340px]">
                  <div className="font-nekstmedium text-[#dbb8ff] text-lg mb-3 tracking-tight">
                    Рекомендуем для вас
                  </div>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-5">
                    {/* Твои рекомендации */}
                    <div className="flex flex-col items-center gap-2 rounded-2xl p-2 hover:bg-gradient-to-br hover:from-[#35355a]/90 hover:to-[#4d388d]/70 transition-all cursor-pointer shadow-[0_1px_4px_#a677ee11]">
                      <img
                        src="/main/catalog/id2.jpg"
                        alt=""
                        className="w-24 h-24 object-cover rounded-2xl shadow-[0_2px_8px_#a677ee22]"
                      />
                      <div className="flex items-end gap-2">
                        <span className="font-bold text-[#a677ee] text-xl">
                          1823₽
                        </span>
                        <span className="line-through text-xs text-[#7e7e9a]">
                          2399₽
                        </span>
                        <span className="ml-1 text-xs text-[#a677ee]">
                          -24%
                        </span>
                      </div>
                      <span className="text-[#a677ee] text-xs">
                        1шт осталось
                      </span>
                      <span className="text-[#f5f5fd] font-nekstmedium text-[15px]">
                        Пластиковые гранулы
                      </span>
                    </div>
                    {/* ...ещё рекомендации */}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
