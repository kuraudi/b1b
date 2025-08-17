// RangeSlider.jsx
"use client";

import React, { useCallback, useRef } from "react";

/**
 * RangeSlider
 *
 * Props:
 * - id (string) optional
 * - value (number) required
 * - onChange (fn) required -> receives number while sliding
 * - onCommit (fn) optional -> receives number on mouseup/touchend/blur (final value)
 * - min (number) optional (default 0)
 * - max (number) optional (default 100)
 * - step (number) optional (default 1)
 * - ariaLabel (string) optional
 * - accent (string) optional -> CSS color or hex; applied to --accent style
 * - className (string) optional
 */
export default function RangeSlider({
  id,
  value,
  onChange,
  onCommit,
  min = 0,
  max = 100,
  step = 1,
  ariaLabel,
  accent,
  className = "",
}) {
  const elRef = useRef(null);

  const handleChange = useCallback(
    (e) => {
      const v = Number(e.target.value);
      onChange && onChange(v);
    },
    [onChange]
  );

  const commit = useCallback(
    (e) => {
      if (typeof onCommit === "function") {
        const v = Number(elRef.current ? elRef.current.value : value);
        onCommit(v);
      }
    },
    [onCommit, value]
  );

  return (
    <div
      className={`rs-root ${className}`}
      style={accent ? { ["--accent"]: accent } : {}}
    >
      <input
        ref={elRef}
        id={id}
        aria-label={ariaLabel}
        type="range"
        className="rs-range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        onMouseUp={commit}
        onTouchEnd={commit}
        onBlur={commit}
      />

      <style jsx>{`
        .rs-root {
          width: 100%;
          --accent: var(--accent, #fca5a5);
        }

        .rs-range {
          -webkit-appearance: none;
          width: 100%;
          height: 8px;
          border-radius: 999px;
          background: linear-gradient(
            90deg,
            var(--accent) 0%,
            rgba(0, 0, 0, 0.08) 100%
          );
          outline: none;
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.03);
        }

        .rs-range::-webkit-slider-runnable-track {
          height: 8px;
          border-radius: 999px;
        }

        .rs-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          margin-top: -5px;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: var(--accent);
          border: 3px solid var(--panel2);
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.15);
          cursor: pointer;
        }

        /* firefox */
        .rs-range::-moz-range-track {
          height: 8px;
          border-radius: 999px;
          background: linear-gradient(
            90deg,
            var(--accent) 0%,
            rgba(0, 0, 0, 0.08) 100%
          );
        }
        .rs-range::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: none;
          background: var(--accent);
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.15);
        }

        @media (prefers-reduced-motion: reduce) {
          .rs-range,
          .rs-range::-webkit-slider-thumb {
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
}
