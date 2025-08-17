// SettingsPage.jsx
"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import ChatSettingsPanel from "./pages/ChatSettings";
import {
  Bell,
  ShieldCheck,
  MessageSquare,
  Image,
  Folder,
  Settings,
  Globe,
  BookOpen,
  HelpCircle,
  Search,
  Edit,
} from "lucide-react";
import PrivacyAndSecurity from "./pages/Privacy";
import ChatPage from "../chatpage/page";

/* NAV config */
const NAV_CONFIG = [
  { label: "Notifications", Icon: Bell },
  { label: "Privacy and Security", Icon: ShieldCheck },
  { label: "Chat Settings", Icon: MessageSquare },
  { label: "Stickers", Icon: Image },
  { label: "Folders", Icon: Folder },
  { label: "Advanced Settings", Icon: Settings },
  { label: "Language", Icon: Globe },
  { label: "Telegram FAQ", Icon: BookOpen },
  { label: "Ask a Question", Icon: HelpCircle },
];

const ASIDE_WIDTH = 300;

/* Central color constants */
const COLORS = {
  defaultAccent: "#FCA5A5",
  purple700: "#7C3AED",
  green500: "#10B981",

  panelGradient1:
    "linear-gradient(180deg, rgba(255,255,255,0.01), rgba(255,255,255,0.005))",
  panelGradient2:
    "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))",

  border02: "rgba(255,255,255,0.02)",
  border03: "rgba(255,255,255,0.03)",
  border04: "rgba(255,255,255,0.04)",
  border06: "rgba(255,255,255,0.06)",

  black12: "rgba(0,0,0,0.12)",
  shadow35: "rgba(0,0,0,0.35)",
  black40: "rgba(0,0,0,0.4)",

  black: "#000000",
  white: "#ffffff",
  gray900: "#111827",
};

const accents = [
  COLORS.defaultAccent,
  "#10B981",
  "#60A5FA",
  "#EC4899",
  "#F97316",
  COLORS.purple700,
  "#EF4444",
];

const themePalettes = {
  Classic: {
    bgFrom: "#1B1720",
    bgVia: "#2A2230",
    bgTo: "#1A1016",
    panel: "rgba(255,255,255,0.02)",
    panel2: "rgba(255,255,255,0.01)",
    panelBorder: "rgba(255,255,255,0.04)",
    textPrimary: "rgba(255,255,255,0.94)",
    textSecondary: "rgba(255,255,255,0.80)",
    textTertiary: "rgba(255,255,255,0.64)",
    textMuted: "rgba(255,255,255,0.56)",
    iconMuted: "rgba(255,255,255,0.68)",
    incomingBg: "rgba(255,255,255,0.04)",
  },
  Day: {
    bgFrom: "#F4F6F9",
    bgVia: "#F9FAFB",
    bgTo: "#FFFFFF",
    // panels are slightly dark to contrast with white bg
    panel: "rgba(0,0,0,0.06)",
    panel2: "rgba(0,0,0,0.03)",
    panelBorder: "rgba(0,0,0,0.09)",
    // text variants (dark)
    textPrimary: "#0B1220",
    textSecondary: "#374151",
    textTertiary: "#6B7280",
    textMuted: "rgba(17,24,39,0.6)",
    // <- changed: icons in aside should be black for Day
    iconMuted: "#0B1220", // strong dark icon color
    incomingBg: "#F1F5F9",
  },
  Dark: { 
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
  },
  "Glacier Dream": {
    bgFrom: "#191826",
    bgVia: "#232535",
    bgTo: "#18161E",
    panel: "rgba(255,255,255,0.02)",
    panel2: "rgba(255,255,255,0.01)",
    panelBorder: "rgba(255,255,255,0.04)",
    textPrimary: "rgba(255,255,255,0.94)",
    textSecondary: "rgba(255,255,255,0.72)",
    textTertiary: "rgba(255,255,255,0.56)",
    textMuted: "rgba(255,255,255,0.66)",
    iconMuted: "rgba(255,255,255,0.64)",
    incomingBg: "rgba(255,255,255,0.03)",
  },
  "Grape Ocean": {
    bgFrom: "#1A1720",
    bgVia: "#2B2330",
    bgTo: "#151218",
    panel: "rgba(255,255,255,0.02)",
    panel2: "rgba(255,255,255,0.01)",
    panelBorder: "rgba(255,255,255,0.04)",
    textPrimary: "rgba(255,255,255,0.94)",
    textSecondary: "rgba(255,255,255,0.74)",
    textTertiary: "rgba(255,255,255,0.6)",
    textMuted: "rgba(255,255,255,0.68)",
    iconMuted: "rgba(255,255,255,0.66)",
    incomingBg: "rgba(255,255,255,0.03)",
  },
  "Purple OLED": {
    bgFrom: "#0D0B10",
    bgVia: "#17141A",
    bgTo: "#0B0910",
    panel: "rgba(255,255,255,0.01)",
    panel2: "rgba(255,255,255,0.005)",
    panelBorder: "rgba(255,255,255,0.03)",
    textPrimary: "rgba(255,255,255,0.94)",
    textSecondary: "rgba(255,255,255,0.7)",
    textTertiary: "rgba(255,255,255,0.56)",
    textMuted: "rgba(255,255,255,0.64)",
    iconMuted: "rgba(255,255,255,0.6)",
    incomingBg: "rgba(255,255,255,0.02)",
  },
};

function hexToRgb(hex) {
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

// small placeholder panels
function NotificationsPanel() {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold">Notifications</h2>
      <p className="mt-2 text-sm muted">Заглушка панели уведомлений</p>
    </div>
  );
}
function PrivacyAndSecurityPanel() {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold">Privacy and Security</h2>
      <p className="mt-2 text-sm muted">
        Настройки приватности и безопасности.
      </p>
    </div>
  );
}
function StickersPanel() {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold">Stickers</h2>
      <p className="mt-2 text-sm muted">Панель стикеров.</p>
    </div>
  );
}
function FoldersPanel() {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold">Folders</h2>
      <p className="mt-2 text-sm muted">Управление папками.</p>
    </div>
  );
}
function AdvancedSettingsPanel() {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold">Advanced Settings</h2>
      <p className="mt-2 text-sm muted">Продвинутые настройки.</p>
    </div>
  );
}
function LanguagePanel() {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold">Language</h2>
      <p className="mt-2 text-sm muted">Выбор языка.</p>
    </div>
  );
}
function TelegramFAQPanel() {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold">Telegram FAQ</h2>
      <p className="mt-2 text-sm muted">Частые вопросы и ответы.</p>
    </div>
  );
}
function AskAQuestionPanel() {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold">Ask a Question</h2>
      <p className="mt-2 text-sm muted">Форма обратной связи.</p>
    </div>
  );
}

/* ---------- SettingsPage component ---------- */
export default function SettingsPage() {
  const [activeIndex, setActiveIndex] = useState(2);
  const [textSize, setTextSize] = useState(14);
  const [selectedTheme, setSelectedTheme] = useState("Dark");
  const [selectedAccent, setSelectedAccent] = useState(COLORS.defaultAccent);
  const [settings, setSettings] = useState({
    fullScreenGallery: true,
    disableMisspell: true,
    sendByEnter: true,
    largeEmoji: true,
    replaceEmoji: true,
    messageCorners: true,
  });

  const palette = themePalettes[selectedTheme] || themePalettes.Classic;
  const accentRgb = useMemo(() => hexToRgb(selectedAccent), [selectedAccent]);

  const containerStyle = {
    fontFamily: "NekstRegular, system-ui, -apple-system",
    background: `linear-gradient(180deg, ${palette.bgFrom}, ${palette.bgVia}, ${palette.bgTo})`,
    "--panel": palette.panel,
    "--panel2": palette.panel2,
    "--panel-border": palette.panelBorder || COLORS.border04,
    "--text-primary": palette.textPrimary,
    "--text-secondary": palette.textSecondary,
    "--text-tertiary": palette.textTertiary,
    "--text-muted": palette.textMuted,
    "--icon-muted": palette.iconMuted,
    "--accent": selectedAccent,
    "--accent-rgb": accentRgb,
  };

  const messagesEndRef = useRef(null);
  useEffect(() => {
    if (messagesEndRef.current)
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
  }, []);

  return (
    <div className="min-h-screen" style={containerStyle}>
      <style jsx>{`
        .glass {
          background: var(--panel);
          backdrop-filter: blur(10px) saturate(120%);
          -webkit-backdrop-filter: blur(10px) saturate(120%);
          border: 1px solid var(--panel-border);
        }

        .text-primary {
          color: var(--text-primary);
        }
        .text-secondary {
          color: var(--text-secondary);
        }
        .text-tertiary {
          color: var(--text-tertiary);
        }
        .muted {
          color: var(--text-muted);
        }
        .icon-muted {
          color: var(--icon-muted);
        }

        .heading {
          font-family: "NekstMedium", NekstRegular, system-ui;
          color: var(--text-primary);
        }

        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 14px;
          height: 14px;
          border-radius: 9999px;
          background: var(--accent);
          box-shadow: 0 2px 6px ${COLORS.black40};
        }
        input[type="range"]::-moz-range-thumb {
          width: 14px;
          height: 14px;
          border-radius: 9999px;
          background: var(--accent);
        }

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

        .nav-btn:hover {
          background: ${
            /* lighter hover for Day vs other themes — we'll still override inline for selected state */
            "rgba(0,0,0,0.04)"
          };
        }

        .bubble-me {
          box-shadow: 0 6px 18px ${COLORS.shadow35};
        }
        .bubble-other {
          border: 1px solid ${COLORS.border03};
        }

        .disabled {
          opacity: 0.6;
          pointer-events: none;
        }
      `}</style>

      {/* LEFT ASIDE */}
      <aside
        className="left-rail rounded-r-2xl glass shadow-lg flex flex-col gap-6"
        style={{
          background: selectedTheme === "Day" ? palette.panel : undefined,
        }}
      >
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-white font-semibold"
            style={{
              background:
                selectedTheme === "Day"
                  ? "#000"
                  : `linear-gradient(135deg, ${selectedAccent}, ${COLORS.purple700})`,
            }}
            aria-hidden
          >
            R
          </div>

          <div>
            <div className="text-lg heading">R4IN80W</div>
            <div className="text-sm text-secondary">@TierOneNation</div>
          </div>

          <div className="ml-auto">
            <button
              aria-label="Edit profile"
              className="w-9 h-9 rounded-full glass flex items-center justify-center hover:scale-105 transition-transform"
              style={{ borderColor: "var(--panel-border)" }}
            >
              {/* Edit icon follows var(--icon-muted) — for Day this is dark */}
              <Edit size={16} style={{ color: "var(--icon-muted)" }} />
            </button>
          </div>
        </div>

        {/* search */}
        <div>
          <label className="relative block">
            <span className="sr-only">Search</span>
            <input
              placeholder="Search"
              aria-label="Search"
              className="w-full rounded-full px-3 py-2 text-sm pl-10 transition-colors focus:outline-none"
              style={{
                background:
                  selectedTheme === "Day"
                    ? "rgba(0,0,0,0.05)" // светлый серый фон
                    : "rgba(255,255,255,0.05)", // лёгкий прозрачный фон для тёмных
                color: "var(--text-primary)",
                border: "1px solid var(--border-color)",
              }}
              onFocus={(e) => {
                e.target.style.border = `1px solid var(--accent)`;
              }}
              onBlur={(e) => {
                e.target.style.border = "1px solid var(--border-color)";
              }}
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <Search
                size={16}
                style={{
                  stroke: "var(--icon-muted)",
                  transition: "stroke 0.2s ease",
                }}
              />
            </span>
          </label>

          {/* nav */}
          <nav
            className="flex flex-col gap-2 mt-4"
            aria-label="Settings navigation"
          >
            {NAV_CONFIG.map(({ label, Icon }, idx) => {
              const active = activeIndex === idx;
              const activeBg =
                selectedTheme === "Day"
                  ? "rgba(0,0,0,0.12)"
                  : "rgba(255,255,255,0.03)";

              return (
                <button
                  key={label}
                  onClick={() => setActiveIndex(idx)}
                  className="relative w-full text-left px-3 py-2 rounded-xl flex items-center gap-3 transition focus:outline-none nav-btn"
                  aria-current={active ? "page" : undefined}
                  style={{
                    background: active ? activeBg : undefined,
                  }}
                >
                  {/* left accent bar */}
                  <span
                    className="absolute left-0 top-1/2 -translate-y-1/2 rounded-r-full transition-all"
                    style={{
                      width: active ? 6 : 0,
                      height: active ? 36 : 0,
                      background: active ? "var(--accent)" : "transparent",
                    }}
                    aria-hidden
                  />

                  <span
                    className="flex items-center justify-center flex-shrink-0"
                    style={{ width: 28, height: 28 }}
                  >
                    <Icon
                      size={18}
                      style={{
                        stroke: active
                          ? "var(--accent)"
                          : selectedTheme === "Day"
                          ? "#0B1220"
                          : "var(--icon-muted)",
                      }}
                    />
                  </span>

                  <span
                    className={`${
                      active ? "heading" : "text-secondary"
                    } text-sm ml-1`}
                  >
                    {label}
                  </span>

                  <span
                    className="ml-auto text-xs"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    ›
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        <div
          className="mt-auto text-sm"
          style={{ color: "var(--text-tertiary)" }}
        >
          Unigram • Settings
        </div>
      </aside>

      {/* MAIN */}
      <main className="main-area">
        <div className="max-w-[1200px]">
          <header className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl heading">Settings</h1>
              <p className="text-secondary mt-1">
                Выбрана вкладка:{" "}
                <b style={{ color: "var(--text-primary)" }}>
                  {
                    [
                      "Notifications",
                      "Privacy and Security",
                      "Chat Settings",
                      "Stickers",
                      "Folders",
                      "Advanced Settings",
                      "Language",
                      "Telegram FAQ",
                      "Ask a Question",
                    ][activeIndex]
                  }
                </b>
              </p>
            </div>
            <div className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Updated: now
            </div>
          </header>

          <div
            className="p-6 rounded-lg"
            style={{
              border: `1px solid var(--panel-border)`,
              background: "var(--panel2)",
            }}
          >
            {activeIndex === 0 ? (
              <NotificationsPanel />
            ) : activeIndex === 1 ? (
              <PrivacyAndSecurity
                COLORS={COLORS}
                themePalettes={themePalettes}
                accents={accents}
                textSize={textSize}
                setTextSize={setTextSize}
                selectedTheme={selectedTheme}
                setSelectedTheme={setSelectedTheme}
                selectedAccent={selectedAccent}
                setSelectedAccent={setSelectedAccent}
                settings={settings}
                setSettings={setSettings}
              />
            ) : activeIndex === 2 ? (
              <ChatSettingsPanel
                COLORS={COLORS}
                themePalettes={themePalettes}
                accents={accents}
                textSize={textSize}
                setTextSize={setTextSize}
                selectedTheme={selectedTheme}
                setSelectedTheme={setSelectedTheme}
                selectedAccent={selectedAccent}
                setSelectedAccent={setSelectedAccent}
                settings={settings}
                setSettings={setSettings}
              />
            ) : activeIndex === 3 ? (
              <ChatPage
                COLORS={COLORS}
                themePalettes={themePalettes}
                accents={accents}
                textSize={textSize}
                setTextSize={setTextSize}
                selectedTheme={selectedTheme}
                setSelectedTheme={setSelectedTheme}
                selectedAccent={selectedAccent}
                setSelectedAccent={setSelectedAccent}
                settings={settings}
                setSettings={setSettings}
              />
            ) : activeIndex === 4 ? (
              <FoldersPanel />
            ) : activeIndex === 5 ? (
              <AdvancedSettingsPanel />
            ) : activeIndex === 6 ? (
              <LanguagePanel />
            ) : activeIndex === 7 ? (
              <TelegramFAQPanel />
            ) : activeIndex === 8 ? (
              <AskAQuestionPanel />
            ) : (
              <div className="p-6">Панель не найдена</div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>
      </main>
    </div>
  );
}
