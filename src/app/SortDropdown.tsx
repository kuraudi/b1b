"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import DropdownCard from "./DropdownCard";

const sortOptions = [
  { label: "По возрастанию цены", value: "price-asc" },
  { label: "По убыванию цены", value: "price-desc" },
  { label: "По популярности", value: "popularity" },
  { label: "По рейтингу", value: "rating" },
];

function SortDropdown({ sortOrder, setSortOrder }) {
  const [open, setOpen] = useState(false);

  return (
    <DropdownCard
      open={open}
      setOpen={setOpen}
      zIndex={100}
      button={
        <button
          type="button"
          className={`
            flex items-center gap-2
            bg-gradient-to-tr from-[#232324] via-[#33273b] to-[#202044] px-5 py-2
            rounded-2xl font-nekstmedium text-[#e8e5f8] shadow-xl drop-shadow
            border-2 border-transparent
            hover:border-[#8C7FF5] hover:shadow-[0_0_16px_#8C7FF5]
            focus:border-[#8C7FF5] focus:shadow-[0_0_16px_#8C7FF5]
            active:scale-[0.98] transition-all duration-200
            outline-none
          `}
          onClick={() => setOpen((v) => !v)}
          style={{ minWidth: 180 }}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-label="Выбрать сортировку"
        >
          <span className="truncate">
            {sortOptions.find((opt) => opt.value === sortOrder)?.label ||
              "Сортировка"}
          </span>
          <ChevronDown
            className={`
              w-[30px] h-5 ml-1 transition-transform duration-200
              ${open ? "rotate-180 text-[#8C7FF5]" : "text-[#bfaaff]"}
            `}
            aria-hidden="true"
          />
        </button>
      }
    >
      <div
        className="
          flex flex-col gap-1 py-2 px-1 min-w-[180px]
          bg-[#1d1d23] border border-[#2f2d41] rounded-xl
          shadow-lg
          max-h-60 overflow-auto
          scrollbar-thin scrollbar-thumb-[#8C7FF5]/40 scrollbar-track-transparent
          focus:outline-none
        "
        role="listbox"
        tabIndex={-1}
      >
        {sortOptions.map((opt) => (
          <button
            key={opt.value}
            type="button"
            role="option"
            aria-selected={sortOrder === opt.value}
            className={`
              w-[300px] text-left px-4 py-2 rounded-lg text-[16px] font-nekstmedium transition
              ${
                sortOrder === opt.value
                  ? "bg-[#8C7FF5]/20 text-[#8C7FF5] font-semibold"
                  : "text-[#e4e4ea] hover:bg-[#25244d]/70"
              }
              focus:outline-none focus:ring-1 focus:ring-[#8C7FF5]
            `}
            onClick={() => {
              setSortOrder(opt.value);
              setOpen(false);
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </DropdownCard>
  );
}

export default SortDropdown;
