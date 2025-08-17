// ToggleSwitch.jsx
"use client";

import React from "react";
import { Check } from "lucide-react";

/**
 * ToggleSwitch
 *
 * Props:
 * - id (string) optional
 * - checked (boolean) required
 * - onChange (fn) required: receives boolean
 * - ariaLabel (string) optional
 * - disabled (boolean) optional
 * - className (string) optional
 */
export default function ToggleSwitch({
  id,
  checked,
  onChange,
  ariaLabel,
  disabled = false,
  className = "",
}) {
  return (
    <label className={`ts-root ${className}`} htmlFor={id}>
      <input
        id={id}
        type="checkbox"
        className="ts-input"
        checked={!!checked}
        onChange={(e) => onChange && onChange(e.target.checked)}
        aria-checked={!!checked}
        aria-label={ariaLabel}
        disabled={disabled}
      />
      <span className="ts-track" aria-hidden>
        <span className="ts-thumb">{checked ? <Check size={12} style={{ stroke: "var(--text-primary)" }} /> : null}</span>
      </span>

      <style jsx>{`
        .ts-root {
          display: inline-flex;
          align-items: center;
          cursor: ${disabled ? "not-allowed" : "pointer"};
        }
        .ts-input {
          position: absolute;
          width: 0;
          height: 0;
          opacity: 0;
          pointer-events: none;
        }
        .ts-track {
          width: 40px;
          height: 22px;
          border-radius: 999px;
          padding: 3px;
          box-sizing: border-box;
          border: 1px solid var(--panel-border);
          background: var(--panel-border);
          display: inline-flex;
          align-items: center;
          transition: background 160ms ease, border-color 160ms ease;
          justify-content: ${checked ? "flex-end" : "flex-start"};
        }
        /* when the input is checked change colors via sibling selector */
        /* Note: because input is visually hidden we still rely on onChange to update checked prop */
        .ts-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: var(--panel2);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(2, 6, 23, 0.12);
          transition: transform 160ms cubic-bezier(0.2, 0.9, 0.3, 1);
        }

        /* Accessible focus */
        .ts-input:focus + .ts-track {
          outline: 3px solid rgba(59, 130, 246, 0.12);
          outline-offset: 2px;
        }

        /* When checked style (we can't use :checked + because input visually hidden
           but still in DOM — we use the checked prop to control justify-content above)
           Keep CSS for the case someone uses a different markup: */
        .ts-input:checked + .ts-track {
          background: var(--accent);
          border-color: var(--accent);
        }

        /* disabled */
        .ts-input:disabled + .ts-track {
          opacity: 0.6;
        }
      `}</style>
    </label>
  );
}
