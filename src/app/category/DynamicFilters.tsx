"use client";
import React, { useState } from "react";
import { ChevronDown, ChevronUp, Star, Check } from "lucide-react";
import PrettyRange from "./[slug]/PrettyRange";

// Современный Dropdown
function Dropdown({ value, options, onChange, placeholder, icon }) {
  const [open, setOpen] = useState(false);
  if (!Array.isArray(options) || options.length === 0) return null;
  const selectedOption = options.find((o) =>
    typeof o === "object" ? o.value === value : o === value
  );
  return (
    <div className="relative">
      <button
        type="button"
        className="w-full flex justify-between items-center px-3 py-2 rounded-xl bg-[#24213a] text-[#e4e4ea] border border-[#8C7FF5]/30 font-nekstregular text-sm shadow focus:ring-2 focus:ring-[#8C7FF5] outline-none transition"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="flex items-center">
          {icon && <span className="mr-2">{icon}</span>}
          {selectedOption
            ? selectedOption.label || selectedOption
            : placeholder}
        </span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-[#8C7FF5]" />
        ) : (
          <ChevronDown className="w-4 h-4 text-[#8C7FF5]" />
        )}
      </button>
      {open && (
        <div className="absolute left-0 right-0 z-20 mt-1 bg-[#232036] border border-[#8C7FF5]/30 rounded-xl shadow-2xl max-h-52 overflow-y-auto animate-fade-in">
          <ul tabIndex={-1} className="py-1">
            {options.map((o) => (
              <li
                key={o.value || o}
                className={`px-4 py-2 cursor-pointer flex items-center gap-2 hover:bg-[#8C7FF5]/15 text-[#e4e4ea] text-sm rounded transition ${
                  (o.value || o) === value ? "bg-[#8C7FF5]/40" : ""
                }`}
                onClick={() => {
                  onChange(o.value || o);
                  setOpen(false);
                }}
                role="option"
                aria-selected={(o.value || o) === value}
              >
                {o.icon && (
                  <span className="inline-block mr-2 align-middle">
                    {o.icon}
                  </span>
                )}
                {o.label || o}
                {(o.value || o) === value && (
                  <Check className="w-4 h-4 text-[#8C7FF5] ml-auto" />
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function FilterSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="mb-4">
      <button
        className="flex items-center justify-between w-full px-0 py-2 font-nekstmedium text-[#bfaaff] text-base hover:text-[#8C7FF5] transition group"
        onClick={() => setOpen((v) => !v)}
        type="button"
        aria-expanded={open}
      >
        <span>{title}</span>
        {open ? (
          <ChevronUp className="ml-2 w-5 h-5 group-hover:text-[#8C7FF5]" />
        ) : (
          <ChevronDown className="ml-2 w-5 h-5 group-hover:text-[#8C7FF5]" />
        )}
      </button>
      {open && <div className="mt-2 space-y-2">{children}</div>}
    </div>
  );
}

// Эффектный чекбокс
function PrettyCheckbox({ checked, onChange, label }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group select-none">
      <span
        className={`
          w-[22px] h-[22px] flex items-center justify-center rounded-lg border-2
          shadow-md
          transition-all duration-200
          ${
            checked
              ? "border-[#8C7FF5] bg-gradient-to-br from-[#8C7FF5]/30 to-[#332c54] scale-105"
              : "border-[#3f3962] bg-[#232036] group-hover:border-[#8C7FF5]"
          }
        `}
      >
        {checked && (
          <Check className="w-4 h-4 text-[#8C7FF5] transition-opacity drop-shadow" />
        )}
      </span>
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={onChange}
      />
      <span className="text-[15px] text-[#e4e4ea] font-nekstmedium">
        {label}
      </span>
    </label>
  );
}

export default function DynamicFilters({
  filtersConfig = [],
  selectedFilters = {},
  setSelectedFilters,
}) {
  const filtersArray = Array.isArray(filtersConfig) ? filtersConfig : [];
  function updateFilter(key, value) {
    setSelectedFilters({ ...selectedFilters, [key]: value });
  }
  function resetFilters() {
    const cleared = {};
    filtersArray.forEach((f) => {
      if (f.type === "checkbox") cleared[f.key] = false;
      else cleared[f.key] = "";
    });
    setSelectedFilters(cleared);
  }

  return (
    <aside
      className="w-full max-w-[250px] min-w-[220px] sticky top-[88px] self-start bg-gradient-to-br from-[#221d30] via-[#232036] to-[#27223d] border border-[#8C7FF5]/30 rounded-2xl px-7 py-7 shadow-[0_2px_18px_rgba(140,127,245,0.13)] flex flex-col gap-3 animate-fade-in transition"
      aria-label="Фильтры каталога"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-nekstmedium text-[#e4e4ea] tracking-wide">
          Фильтры
        </h2>
        <button
          className="text-[#8C7FF5] text-xs font-nekstmedium hover:underline transition"
          type="button"
          onClick={resetFilters}
          aria-label="Сбросить фильтры"
        >
          Сбросить
        </button>
      </div>

      {filtersArray.map((filter) => {
        if (filter.type === "dropdown") {
          return (
            <FilterSection title={filter.label} key={filter.key}>
              <Dropdown
                value={selectedFilters[filter.key]}
                options={filter.options}
                onChange={(v) => updateFilter(filter.key, v)}
                placeholder={filter.placeholder || filter.label}
                icon={filter.icon}
              />
            </FilterSection>
          );
        }
        if (filter.type === "checkbox") {
          return (
            <FilterSection title={filter.label} key={filter.key}>
              <PrettyCheckbox
                checked={!!selectedFilters[filter.key]}
                onChange={(e) => updateFilter(filter.key, e.target.checked)}
                label={filter.labelText || filter.label}
              />
            </FilterSection>
          );
        }
        if (filter.type === "range") {
          return (
            <FilterSection title={filter.label} key={filter.key}>
              <PrettyRange
                value={selectedFilters.price}
                min={500}
                max={5000}
                step={50}
                unit="₽"
                onChange={(e) => updateFilter("price", e.target.value)}
              />
            </FilterSection>
          );
        }

        if (filter.type === "price") {
          // Красивая пара input для цены
          return (
            <FilterSection title={filter.label} key={filter.key}>
              <div className="flex gap-2 items-center">
                <div className="relative w-1/2">
                  <input
                    type="number"
                    placeholder="от"
                    min={filter.min}
                    max={filter.max}
                    value={selectedFilters[filter.key + "From"] || ""}
                    onChange={(e) =>
                      updateFilter(filter.key + "From", e.target.value)
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[#232036] border border-[#8C7FF5]/30 text-[#e4e4ea] font-nekstregular text-sm focus:ring-2 focus:ring-[#8C7FF5] outline-none transition"
                    aria-label="Мин. цена"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[#8C7FF5] text-xs">
                    {filter.unit}
                  </span>
                </div>
                <div className="relative w-1/2">
                  <input
                    type="number"
                    placeholder="до"
                    min={filter.min}
                    max={filter.max}
                    value={selectedFilters[filter.key + "To"] || ""}
                    onChange={(e) =>
                      updateFilter(filter.key + "To", e.target.value)
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[#232036] border border-[#8C7FF5]/30 text-[#e4e4ea] font-nekstregular text-sm focus:ring-2 focus:ring-[#8C7FF5] outline-none transition"
                    aria-label="Макс. цена"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[#8C7FF5] text-xs">
                    {filter.unit}
                  </span>
                </div>
              </div>
            </FilterSection>
          );
        }
        if (filter.type === "rating") {
          return (
            <FilterSection title={filter.label} key={filter.key}>
              <div className="flex gap-1.5 flex-wrap">
                {(filter.options || [5, 4.5, 4, 3.5]).map((r) => (
                  <button
                    key={r}
                    className={`
                      flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm
                      ${
                        selectedFilters[filter.key] == r
                          ? "bg-[#FFD700]/90 text-[#19123b] font-nekstmedium shadow"
                          : "text-[#bfaaff] hover:bg-[#2c2540]/70 hover:text-[#FFD700] transition"
                      }
                      font-nekstregular`}
                    onClick={() => updateFilter(filter.key, r)}
                    aria-pressed={selectedFilters[filter.key] == r}
                    type="button"
                  >
                    <Star className="w-4 h-4" />
                    {typeof r === "string"
                      ? r
                      : r.toString().replace(".5", ".5+")}
                  </button>
                ))}
              </div>
            </FilterSection>
          );
        }
        if (filter.type === "custom" && typeof filter.render === "function") {
          return (
            <FilterSection title={filter.label} key={filter.key}>
              {filter.render({
                value: selectedFilters[filter.key],
                onChange: (v) => updateFilter(filter.key, v),
              })}
            </FilterSection>
          );
        }
        return null;
      })}
    </aside>
  );
}
