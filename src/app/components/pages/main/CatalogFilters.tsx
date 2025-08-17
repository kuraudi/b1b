import React from "react";
import { Minus, Plus, Filter, MapPin } from "lucide-react";

const COLORS = {
  background: "bg-[#232323]",
  sidebar: "bg-[#181622]/80",
  card: "bg-[#191823]",
  accent: "text-[#8C7FF5]",
  accentBg: "bg-[#1b1a26]",
  border: "border-[#232136]",
  input: "bg-[#343434]",
  inputFocus: "focus:ring-[#8C7FF5]",
  hover: "hover:bg-[#232136]/70",
  button: "bg-[#8C7FF5] text-[#19123b] hover:bg-[#7867e6]",
  tag: "bg-[#232136] text-[#BFAAFF] hover:bg-[#232136]/80",
};

export default function CatalogFilters({
  showFilters,
  setShowFilters,
  filters,
  setFilters,
  filtersInitial,
  categories,
  tags,
  handleTagToggle,
}: {
  showFilters: boolean;
  setShowFilters: (val: boolean) => void;
  filters: any;
  setFilters: any;
  filtersInitial: any;
  categories: { name: string; icon: React.ReactNode }[];
  tags: string[];
  handleTagToggle: (tag: string) => void;
}) {
  return (
    <aside
      className={`
        bg-[#1d1b1b] rounded-2xl shadow-xl px-8 py-10 flex flex-col
        border ${COLORS.border}
        relative
        min-h-0 h-full
        
      `}
      style={{ minHeight: 0 }}
    >
      {/* Мобильная кнопка скрытия фильтров */}
      <button
        className="md:hidden absolute top-4 right-6 z-10 p-2 bg-[#232136] rounded-lg"
        onClick={() => setShowFilters(!showFilters)}
        aria-label="Скрыть/Показать фильтры"
      >
        {showFilters ? (
          <Minus className="w-5 h-5" />
        ) : (
          <Plus className="w-5 h-5" />
        )}
      </button>
      <div
        className={`${
          showFilters ? "block" : "hidden md:block"
        } overflow-y-auto scrollbar-thin scrollbar-thumb-[#232136]/60 scrollbar-track-transparent pb-2`}
      >
        {/* Заголовок фильтра */}
        <div className="mb-5">
          <h2 className="text-lg font-nekstmedium text-[#8C7FF5] tracking-wide flex items-center gap-2">
            <Filter className="w-5 h-5" /> Подбор параметров
          </h2>
          <div className="h-px w-full bg-[#232136] my-4 opacity-30" />
        </div>
        {/* Категории */}
        <div className="mb-6">
          <label className="block text-xs uppercase font-nekstmedium tracking-widest text-[#BFAAFF] mb-3">
            Категория
          </label>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.name}
                className={`
                  flex items-center px-3 py-1.5 rounded-full transition text-sm font-nekstregular border ${
                    COLORS.border
                  }
                  ${
                    filters.category === cat.name
                      ? "bg-[#8C7FF5]/80 text-[#232136] border-[#8C7FF5] font-nekstmedium shadow-md"
                      : "bg-transparent text-[#BFAAFF] hover:bg-[#232136]/50 hover:text-[#8C7FF5]"
                  }
                `}
                onClick={() =>
                  setFilters((f: any) => ({ ...f, category: cat.name }))
                }
                type="button"
              >
                {cat.icon}
                {cat.name}
              </button>
            ))}
          </div>
        </div>
        {/* Цена */}
        <div className="mb-6">
          <label className="block text-xs uppercase font-nekstmedium tracking-widest text-[#BFAAFF] mb-3">
            Цена, ₽
          </label>
          <div className="flex gap-3">
            <input
              type="number"
              placeholder="от"
              className={`w-1/2 ${COLORS.input} rounded-lg px-3 py-2 text-sm outline-none ${COLORS.inputFocus} transition font-nekstregular`}
              value={filters.priceFrom}
              onChange={(e) =>
                setFilters((f: any) => ({ ...f, priceFrom: e.target.value }))
              }
            />
            <input
              type="number"
              placeholder="до"
              className={`w-1/2 ${COLORS.input} rounded-lg px-3 py-2 text-sm outline-none ${COLORS.inputFocus} transition font-nekstregular`}
              value={filters.priceTo}
              onChange={(e) =>
                setFilters((f: any) => ({ ...f, priceTo: e.target.value }))
              }
            />
          </div>
        </div>
        {/* Город */}
        <div className="mb-6">
          <label className="block text-xs uppercase font-nekstmedium tracking-widest text-[#BFAAFF] mb-3">
            Город
          </label>
          <div className="relative">
            <MapPin className="absolute left-2 top-2.5 w-4 h-4 text-[#8C7FF5]" />
            <input
              type="text"
              placeholder="Введите город"
              className={`pl-8 w-full ${COLORS.input} rounded-lg px-2 py-2 text-sm outline-none ${COLORS.inputFocus} transition font-nekstregular`}
              value={filters.location}
              onChange={(e) =>
                setFilters((f: any) => ({ ...f, location: e.target.value }))
              }
            />
          </div>
        </div>
        {/* Компания */}
        <div className="mb-6">
          <label className="block text-xs uppercase font-nekstmedium tracking-widest text-[#BFAAFF] mb-3">
            Компания
          </label>
          <input
            type="text"
            placeholder="Название компании"
            className={`w-full ${COLORS.input} rounded-lg px-3 py-2 text-sm outline-none ${COLORS.inputFocus} transition font-nekstregular`}
            value={filters.company}
            onChange={(e) =>
              setFilters((f: any) => ({ ...f, company: e.target.value }))
            }
          />
        </div>
        {/* Теги */}
        <div className="mb-6">
          <label className="block text-xs uppercase font-nekstmedium tracking-widest text-[#BFAAFF] mb-3">
            Теги
          </label>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag}
                className={`
                  px-3 py-1.5 rounded-full text-xs font-nekstregular border ${
                    COLORS.border
                  } transition
                  ${
                    filters.tags.includes(tag)
                      ? "bg-[#8C7FF5]/80 text-[#232136] border-[#8C7FF5] font-nekstmedium shadow"
                      : "bg-transparent text-[#BFAAFF] hover:bg-[#232136]/50 hover:text-[#8C7FF5]"
                  }
                `}
                onClick={() => handleTagToggle(tag)}
                type="button"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
        {/* Только избранное */}
        <div className="flex items-center gap-2 mb-6">
          <input
            id="fav"
            type="checkbox"
            checked={filters.onlyFavorites}
            onChange={(e) =>
              setFilters((f: any) => ({
                ...f,
                onlyFavorites: e.target.checked,
              }))
            }
            className="accent-[#8C7FF5]"
          />
          <label
            htmlFor="fav"
            className="text-sm select-none font-nekstregular text-[#BFAAFF]"
          >
            Только избранное
          </label>
        </div>
        <button
          className={`${COLORS.button} font-nekstmedium w-full py-2 rounded-xl mt-auto transition`}
          onClick={() => setFilters(filtersInitial)}
          type="button"
        >
          Сбросить фильтры
        </button>
      </div>
    </aside>
  );
}
