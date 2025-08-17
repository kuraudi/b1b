import React, { useState, useRef, useEffect } from "react";
import {
  Filter,
  ChevronDown,
  RefreshCw,
  Building2,
  Utensils,
  ShoppingBag,
  HeartPulse,
  Briefcase,
  Leaf,
  FlaskConical,
  Truck,
  MonitorSmartphone,
  Wrench,
  BookOpen,
  Users,
  CreditCard,
  Sparkle,
} from "lucide-react";

// B2B индустрии
const industries = [
  { name: "Ресторанное дело", icon: <Utensils className="w-5 h-5 mr-2" /> },
  { name: "Ритейл", icon: <ShoppingBag className="w-5 h-5 mr-2" /> },
  { name: "Здравоохранение", icon: <HeartPulse className="w-5 h-5 mr-2" /> },
  { name: "Строительство", icon: <Building2 className="w-5 h-5 mr-2" /> },
  { name: "Промышленность", icon: <Wrench className="w-5 h-5 mr-2" /> },
  { name: "Транспорт и логистика", icon: <Truck className="w-5 h-5 mr-2" /> },
  { name: "IT и связь", icon: <MonitorSmartphone className="w-5 h-5 mr-2" /> },
  { name: "Образование", icon: <BookOpen className="w-5 h-5 mr-2" /> },
  { name: "Биотехнологии", icon: <FlaskConical className="w-5 h-5 mr-2" /> },
  { name: "Агробизнес", icon: <Leaf className="w-5 h-5 mr-2" /> },
  { name: "Финансы", icon: <CreditCard className="w-5 h-5 mr-2" /> },
  { name: "Услуги", icon: <Briefcase className="w-5 h-5 mr-2" /> },
  { name: "HR и кадры", icon: <Users className="w-5 h-5 mr-2" /> },
];

const tags = ["Новинка", "Скидка", "Популярное", "В наличии"];

export default function FiltersDropdown() {
  const [open, setOpen] = useState(false);
  const [industryOpen, setIndustryOpen] = useState(false);
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);

  // Для адаптивности выпадающего меню
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && dropdownRef.current) {
      const dropdown = dropdownRef.current;
      const rect = dropdown.getBoundingClientRect();
      const maxHeight =
        window.innerHeight - rect.top - 24 > 500
          ? 500
          : window.innerHeight - rect.top - 24;
      dropdown.style.maxHeight = `${maxHeight}px`;
      dropdown.style.overflowY = "auto";
    }
  }, [open]);

  return (
    <div className="relative z-50">
      {/* Кнопка фильтров */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="
          flex items-center gap-3 px-7 py-2.5
          rounded-2xl
         bg-gradient-to-l from-[#242324]  to-[#6f4783]
          text-[#8C7FF5]
          font-nekstmedium
          border-2 border-[#232136]
          shadow-[0_4px_20px_1px_rgba(140,127,245,0.08)]
          hover:shadow-[0_2px_24px_3px_rgba(140,127,245,0.18)]
          hover:bg-[#2b2759]
          transition-all
          relative
          after:absolute after:inset-0 after:rounded-2xl after:pointer-events-none 
        "
        type="button"
      >
        <Filter className="w-5 h-5 mr-1 text-[#8C7FF5]" />
        Фильтры
        <ChevronDown className="w-4 h-4 ml-2" />
      </button>
      {/* Выпадающее меню фильтров */}
      {open && (
        <div
          ref={dropdownRef}
          className="
            absolute right-0 mt-4
            bg-[#232136]
            rounded-3xl
            shadow-[0_8px_32px_0_rgba(140,127,245,0.15)]
            border border-[#232136]
            px-0 py-0
            min-w-[340px] max-w-[420px] w-[90vw]
            transition-all
            font-nekstregular
            flex flex-col
            overflow-hidden
            animate-fade-in
            
          "
        >
          {/* Верхняя панель */}

          {/* Контент фильтров */}
          <div className="flex-1 px-7 py-7 flex flex-col gap-7 overflow-auto">
            {/* Отрасль бизнеса */}
            <div>
              <label className="text-xs text-[#8C7FF5] font-nekstmedium mb-3 block tracking-wide">
                Отрасль бизнеса
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIndustryOpen((v) => !v)}
                  className={`
                    flex items-center justify-between w-full px-4 py-2 rounded-xl border border-[#232136] bg-[#191823] text-white font-nekstregular focus:ring-2 focus:ring-[#8C7FF5] transition shadow hover:bg-[#232136]/80
                    ${selectedIndustry ? "font-nekstmedium" : ""}
                  `}
                >
                  <span className="flex items-center">
                    {selectedIndustry ? (
                      industries.find((i) => i.name === selectedIndustry)?.icon
                    ) : (
                      <Briefcase className="w-5 h-5 mr-2" />
                    )}
                    {selectedIndustry || "Выберите отрасль"}
                  </span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                {/* Выпадающий список отраслей */}
                {industryOpen && (
                  <div className="absolute top-full left-0 w-full mt-2 rounded-2xl shadow-xl border border-[#232136] z-60 bg-[#26224d] py-1 max-h-60 overflow-y-auto grid grid-cols-1">
                    {industries.map((ind) => (
                      <button
                        key={ind.name}
                        type="button"
                        className={`
                          flex items-center w-full px-4 py-3 text-left rounded-xl font-nekstregular gap-2
                          transition
                          ${
                            selectedIndustry === ind.name
                              ? "bg-[#8C7FF5]/30 text-[#8C7FF5] font-nekstmedium"
                              : "text-white hover:bg-[#8C7FF5]/10"
                          }
                        `}
                        onClick={() => {
                          setSelectedIndustry(ind.name);
                          setIndustryOpen(false);
                        }}
                      >
                        <span>{ind.icon}</span>
                        <span>{ind.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {/* Grid фильтров, плитки */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
              {/* Цена */}
              <div>
                <label className="text-xs text-[#8C7FF5] font-nekstmedium mb-3 block tracking-wide">
                  Цена, ₽
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min={0}
                    placeholder="от"
                    className="w-24 rounded-xl px-3 py-2 bg-[#191823] border border-[#232136] text-white font-nekstregular outline-none focus:ring-2 focus:ring-[#8C7FF5] shadow"
                  />
                  <input
                    type="number"
                    min={0}
                    placeholder="до"
                    className="w-24 rounded-xl px-3 py-2 bg-[#191823] border border-[#232136] text-white font-nekstregular outline-none focus:ring-2 focus:ring-[#8C7FF5] shadow"
                  />
                </div>
              </div>
              {/* Город */}
              <div className="md:ml-[15px]">
                <label className="text-xs text-[#8C7FF5] font-nekstmedium mb-3 block tracking-wide">
                  Город
                </label>
                <input
                  type="text"
                  placeholder="Введите город"
                  className="w-full rounded-xl px-3 py-2 bg-[#191823] border border-[#232136] text-white font-nekstregular outline-none focus:ring-2 focus:ring-[#8C7FF5] shadow"
                />
              </div>
              {/* Компания */}
              <div>
                <label className="text-xs text-[#8C7FF5] font-nekstmedium mb-3 block tracking-wide">
                  Компания
                </label>
                <input
                  type="text"
                  placeholder="Название компании"
                  className="w-full rounded-xl px-3 py-2 bg-[#191823] border border-[#232136] text-white font-nekstregular outline-none focus:ring-2 focus:ring-[#8C7FF5] shadow"
                />
              </div>
              {/* Только избранное */}
              <div className="flex items-center gap-3 mt-6 md:mt-0 h-full">
                <input
                  type="checkbox"
                  className="accent-[#8C7FF5] w-5 h-5"
                  id="onlyFavorites"
                />
                <label
                  htmlFor="onlyFavorites"
                  className="text-sm text-white font-nekstmedium"
                >
                  Только избранное
                </label>
              </div>
            </div>
            {/* Теги */}
            <div>
              <label className="text-xs text-[#8C7FF5] font-nekstmedium mb-3 block tracking-wide">
                Теги
              </label>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    className="px-4 py-1 rounded-full text-xs font-nekstmedium border-2 border-[#8C7FF5] bg-[#232136] text-[#8C7FF5] cursor-pointer hover:bg-[#8C7FF5]/10 transition-all"
                    tabIndex={0}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
          {/* Actions */}
          <div className="flex px-7 py-3 border-t border-[#232136] gap-3 bg-[#26224d]">
            <button
              className="flex items-center gap-2 px-5 py-2 rounded-xl font-nekstmedium text-[#8C7FF5] bg-[#232136] border border-[#8C7FF5] hover:bg-[#8C7FF5] hover:text-white shadow-lg transition-all"
              type="button"
            >
              <RefreshCw className="w-4 h-4" /> Сбросить фильтры
            </button>
            <button
              className="flex items-center gap-2 px-5 py-2 rounded-xl font-nekstmedium bg-[#8C7FF5] text-[#232136] hover:bg-[#BFAAFF] hover:text-[#191823] shadow-xl transition-all"
              type="button"
              onClick={() => setOpen(false)}
            >
              Применить
            </button>
          </div>
        </div>
      )}
      {/* Анимация */}
      <style>
        {`
        .animate-fade-in {
          animation: fade-in-appear 0.18s cubic-bezier(.77,0,.175,1);
        }
        @keyframes fade-in-appear {
          from { opacity: 0; transform: translateY(15px);}
          to { opacity: 1; transform: translateY(0);}
        }
        `}
      </style>
    </div>
  );
}
