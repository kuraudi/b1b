import React from "react";

// Красивый кастомный range input со stylish thumb и цветным прогрессом.
// Для Tailwind и Next.js. Можно использовать как <PrettyRange ... />

export default function PrettyRange({
  value,
  min,
  max,
  step,
  unit,
  onChange,
  disabled,
}) {
  const percent = ((Number(value ?? min) - min) / (max - min)) * 100 || 0;
  return (
    <div className="relative w-full flex items-center gap-3">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value ?? min}
        onChange={onChange}
        disabled={disabled}
        className={`
          w-full h-3 rounded-full outline-none appearance-none
          bg-gradient-to-r from-[#8C7FF5] to-[#302c54]
          focus:ring-2 focus:ring-[#8C7FF5]/60
          transition
          stylish-range
          ${disabled ? "opacity-60 cursor-not-allowed" : ""}
        `}
        style={{
          background: `linear-gradient(90deg, #8C7FF5 ${percent}%, #2d2341 ${percent}%)`,
        }}
      />
      <span
        className={`
        min-w-[55px] text-right text-[#FFD700] text-base font-nekstmedium
        drop-shadow
        ${disabled ? "opacity-60" : ""}
      `}
      >
        {value ?? min}
        {unit && <span className="ml-1 text-[#bfaaff]">{unit}</span>}
      </span>
      <style jsx>{`
        input[type="range"].stylish-range::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          margin-top: -8.5px; /* <- ЭТО ВАЖНО: выравнивает по центру трека */
          border-radius: 50%;
          background: linear-gradient(135deg, #f8e7ff 0%, #8c7ff5 90%);
          border: 3px solid #232036;
          box-shadow: 0 4px 18px rgba(140, 127, 245, 0.25);
          transition: background 0.2s, box-shadow 0.2s, border 0.2s;
          cursor: pointer;
        }

        input[type="range"].stylish-range:active::-webkit-slider-thumb,
        input[type="range"].stylish-range:focus::-webkit-slider-thumb {
          background: linear-gradient(135deg, #ffd700 0%, #8c7ff5 100%);
          border: 3px solid #ffd700;
          box-shadow: 0 4px 24px 0 #ffd70044;
        }
        input[type="range"].stylish-range::-moz-range-thumb {
          height: 26px;
          width: 26px;
          border-radius: 50%;
          background: linear-gradient(135deg, #f8e7ff 0%, #8c7ff5 90%);
          border: 3px solid #232036;
          box-shadow: 0 4px 18px rgba(140, 127, 245, 0.25);
          transition: background 0.2s, box-shadow 0.2s, border 0.2s;
          cursor: pointer;
        }
        input[type="range"].stylish-range:active::-moz-range-thumb,
        input[type="range"].stylish-range:focus::-moz-range-thumb {
          background: linear-gradient(135deg, #ffd700 0%, #8c7ff5 100%);
          border: 3px solid #ffd700;
          box-shadow: 0 4px 24px 0 #ffd70044;
        }
        input[type="range"].stylish-range::-ms-thumb {
          height: 26px;
          width: 26px;
          border-radius: 50%;
          background: linear-gradient(135deg, #f8e7ff 0%, #8c7ff5 90%);
          border: 3px solid #232036;
          box-shadow: 0 4px 18px rgba(140, 127, 245, 0.25);
          transition: background 0.2s, box-shadow 0.2s, border 0.2s;
          cursor: pointer;
        }
        input[type="range"].stylish-range:active::-ms-thumb,
        input[type="range"].stylish-range:focus::-ms-thumb {
          background: linear-gradient(135deg, #ffd700 0%, #8c7ff5 100%);
          border: 3px solid #ffd700;
          box-shadow: 0 4px 24px 0 #ffd70044;
        }
        input[type="range"].stylish-range::-webkit-slider-thumb {
          box-shadow: 0 4px 18px rgba(140, 127, 245, 0.25);
        }
        input[type="range"].stylish-range::-webkit-slider-runnable-track {
          height: 3px;
          border-radius: 6px;
        }
        input[type="range"].stylish-range::-moz-range-track {
          height: 3px;
          border-radius: 6px;
        }
        input[type="range"].stylish-range::-ms-fill-lower,
        input[type="range"].stylish-range::-ms-fill-upper {
          height: 3px;
          border-radius: 6px;
        }
      `}</style>
    </div>
  );
}
