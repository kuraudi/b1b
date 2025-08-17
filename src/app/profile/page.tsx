"use client";
import React, { useState, useMemo, useEffect, useRef } from "react";
import HeaderNav from "./profile/page";

// ChatSettingsPage - revised: aside pinned to left edge, responsive adjustments,
// auto-scroll for messages, active nav and fixed layout.

/** Цвета вынесены в одну константу */
const COLORS = {
  defaultAccent: "#FCA5A5",
  purple700: "#7C3AED",
  green500: "#10B981",

  // общие градиенты/панели
  panelGradient1:
    "linear-gradient(180deg, rgba(255,255,255,0.01), rgba(255,255,255,0.005))",
  panelGradient2:
    "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))",

  // белые/бордеры с прозрачностью
  border02: "rgba(255,255,255,0.02)",
  border03: "rgba(255,255,255,0.03)",
  border04: "rgba(255,255,255,0.04)",
  border06: "rgba(255,255,255,0.06)",
  white04: "rgba(255,255,255,0.04)",
  white02: "rgba(255,255,255,0.02)",
  white06: "rgba(255,255,255,0.06)",

  // черные тени/фоны
  black12: "rgba(0,0,0,0.12)",
  shadow35: "rgba(0,0,0,0.35)",
  black40: "rgba(0,0,0,0.4)",

  // основные цвета
  black: "#000000",
  white: "#ffffff",
  gray900: "#111827",
};

export default function ChatSettingsPage() {
  const ASIDE_WIDTH = 300; // px - keep in sync with CSS below for main margin

  const [textSize, setTextSize] = useState(14);
  const [selectedTheme, setSelectedTheme] = useState("Classic");
  const [selectedAccent, setSelectedAccent] = useState(COLORS.defaultAccent);
  const [settings, setSettings] = useState({
    fullScreenGallery: true,
    disableMisspell: true,
    sendByEnter: true,
    largeEmoji: true,
    replaceEmoji: true,
    messageCorners: true, // explicitly present now
  });

  const [composer, setComposer] = useState("");
  const [activeNav, setActiveNav] = useState("Chat Settings");

  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Привет! Это пример входящего сообщения.",
      me: false,
      ts: Date.now() - 1000 * 60 * 10,
    },
    {
      id: 2,
      text: "Вот как будут выглядеть ваши сообщения — акцентная заливка и иконки 💬",
      me: true,
      ts: Date.now() - 1000 * 60 * 6,
    },
    {
      id: 3,
      text: ":smile: Emojis и ссылки https://example.com",
      me: false,
      ts: Date.now() - 1000 * 60 * 2,
    },
  ]);

  const themes = [
    "Classic",
    "Day",
    "Dark",
    "Glacier Dream",
    "Grape Ocean",
    "Purple OLED",
  ];
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
      muted: "rgba(255,255,255,0.72)",
      incomingBg: "rgba(255,255,255,0.04)",
    },
    Day: {
      bgFrom: "#F4F6F9", // чуть голубовато-серый сверху
      bgVia: "#F9FAFB", // ближе к белому по центру
      bgTo: "#FFFFFF", // низ остаётся чисто-белый
      panel: "rgba(255,255,255,0.96)", // почти белые панели, ощущение карточек
      panel2: "rgba(255,255,255,0.88)",
      muted: "#374151", // глубокий серый для второстепенного текста
      incomingBg: "#F1F5F9", // светлый серо-голубой пузырь сообщений
    },

    Dark: {
      bgFrom: "#0F1115",
      bgVia: "#16181C",
      bgTo: "#0d0e11",
      panel: "rgba(255,255,255,0.02)",
      panel2: "rgba(255,255,255,0.008)",
      muted: "rgba(255,255,255,0.6)",
      incomingBg: "rgba(255,255,255,0.03)",
    },
    "Glacier Dream": {
      bgFrom: "#191826",
      bgVia: "#232535",
      bgTo: "#18161E",
      panel: "rgba(255,255,255,0.02)",
      panel2: "rgba(255,255,255,0.01)",
      muted: "rgba(255,255,255,0.66)",
      incomingBg: "rgba(255,255,255,0.03)",
    },
    "Grape Ocean": {
      bgFrom: "#1A1720",
      bgVia: "#2B2330",
      bgTo: "#151218",
      panel: "rgba(255,255,255,0.02)",
      panel2: "rgba(255,255,255,0.01)",
      muted: "rgba(255,255,255,0.68)",
      incomingBg: "rgba(255,255,255,0.03)",
    },
    "Purple OLED": {
      bgFrom: "#0D0B10",
      bgVia: "#17141A",
      bgTo: "#0B0910",
      panel: "rgba(255,255,255,0.01)",
      panel2: "rgba(255,255,255,0.005)",
      muted: "rgba(255,255,255,0.64)",
      incomingBg: "rgba(255,255,255,0.02)",
    },
  };

  const hexToRgb = (hex) => {
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
  };

  const palette = themePalettes[selectedTheme] || themePalettes.Classic;
  const accentRgb = useMemo(() => hexToRgb(selectedAccent), [selectedAccent]);

  const containerStyle = {
    fontFamily: "NekstRegular, system-ui, -apple-system",
    background: `linear-gradient(180deg, ${palette.bgFrom}, ${palette.bgVia}, ${palette.bgTo})`,
    "--panel": palette.panel,
    "--panel2": palette.panel2,
    "--muted": palette.muted,
    "--accent": selectedAccent,
    "--accent-rgb": accentRgb,
  };

  useEffect(() => {
    if (textSize < 12) setTextSize(12);
    if (textSize > 24) setTextSize(24);
  }, [textSize]);

  function formatEmoji(text) {
    if (!settings.replaceEmoji) return text;
    return text
      .replace(/:smile:/g, "😄")
      .replace(/:laugh:/g, "😂")
      .replace(/:heart:/g, "❤️")
      .replace(/:thumbsup:/g, "👍");
  }

  function sendMessage(raw = composer) {
    const trimmed = raw.trim();
    if (!trimmed) return;
    const text = formatEmoji(trimmed);
    setMessages((m) => [
      ...m,
      { id: Date.now(), text, me: true, ts: Date.now() },
    ]);
    setComposer("");
  }

  function handleKeyDown(e) {
    // If sendByEnter = true => Enter sends; Shift+Enter still adds newline
    // If sendByEnter = false => Ctrl/Cmd+Enter sends
    if (settings.sendByEnter) {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    } else {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        sendMessage();
      }
    }
  }

  function resetDefaults() {
    setTextSize(14);
    setSelectedTheme("Classic");
    setSelectedAccent(COLORS.defaultAccent);
    setSettings({
      fullScreenGallery: true,
      disableMisspell: true,
      sendByEnter: true,
      largeEmoji: true,
      replaceEmoji: true,
      messageCorners: true,
    });
    setMessages([
      {
        id: 1,
        text: "Привет! Это пример входящего сообщения.",
        me: false,
        ts: Date.now() - 1000 * 60 * 10,
      },
      {
        id: 2,
        text: "Вот как будут выглядеть ваши сообщения — акцентная заливка и иконки 💬",
        me: true,
        ts: Date.now() - 1000 * 60 * 6,
      },
      {
        id: 3,
        text: ":smile: Emojis и ссылки https://example.com",
        me: false,
        ts: Date.now() - 1000 * 60 * 2,
      },
    ]);
  }

  // auto-scroll
  const messagesEndRef = useRef(null);
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [messages]);

  return (
    <div className="min-h-screen text-slate-50" style={containerStyle}>
      <style jsx>{`
        .glass {
          background: ${COLORS.panelGradient1};
          backdrop-filter: blur(10px) saturate(120%);
          -webkit-backdrop-filter: blur(10px) saturate(120%);
          border: 1px solid ${COLORS.border04};
        }
        .muted {
          color: var(--muted);
        }
        .heading {
          font-family: "NekstMedium", NekstRegular, system-ui;
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
        input[type="checkbox"] {
          accent-color: var(--accent);
        }
        .accent-ring {
          box-shadow: 0 0 0 4px rgba(var(--accent-rgb), 0.12);
          border-color: var(--accent);
        }

        /* layout: pinned aside on desktop, stacked on mobile */
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
            left: 0;
            top: 0;
          }
          .main-area {
            margin-left: 0;
            padding: 16px;
          }
        }

        /* message bubble pointers */
        .bubble-me {
          box-shadow: 0 6px 18px ${COLORS.shadow35};
        }
        .bubble-other {
          border: 1px solid ${COLORS.border03};
        }

        /* small helper for disabled send */
        .disabled {
          opacity: 0.6;
          pointer-events: none;
        }
      `}</style>

      {/* LEFT ASIDE (pinned) */}
      <aside className="left-rail rounded-r-2xl glass shadow-lg flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-white font-semibold"
            style={{
              background: `linear-gradient(135deg, ${selectedAccent}, ${COLORS.purple700})`,
            }}
          >
            R
          </div>
          <div>
            <div className="text-lg heading">R4IN80W</div>
            <div className="text-sm muted">@TierOneNation</div>
          </div>
          <div className="ml-auto">
            <button className="w-9 h-9 rounded-full glass flex items-center justify-center">
              ✎
            </button>
          </div>
        </div>

        <div>
          <div className="relative">
            <input
              placeholder="Search"
              aria-label="Search"
              className="w-full bg-transparent border border-transparent rounded-full px-3 py-2 text-sm"
              style={{ color: "var(--muted)" }}
            />
          </div>

          <nav className="flex flex-col gap-2 mt-4">
            {[
              "Notifications",
              "Privacy and Security",
              "Chat Settings",
              "Stickers",
              "Folders",
              "Advanced Settings",
              "Language",
              "Telegram FAQ",
              "Ask a Question",
            ].map((item) => (
              <button
                key={item}
                onClick={() => setActiveNav(item)}
                className={`w-full text-left px-3 py-2 rounded-xl flex items-center gap-3 transition ${
                  activeNav === item
                    ? `bg-[${COLORS.border03}] accent-ring`
                    : "hover:bg-white/2"
                }`}
              >
                <div className="w-3 h-3 rounded-full bg-slate-500" />
                <span
                  className={`${
                    activeNav === item ? "heading" : "muted"
                  } text-sm`}
                >
                  {item}
                </span>
              </button>
            ))}
          </nav>
        </div>

        <div className="text-sm muted">Unigram • Settings</div>
      </aside>

      {/* MAIN (takes the rest) */}
      <main className="main-area">
        <div className="max-w-[1200px]">
          <header className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl heading">Chat Settings</h1>
              <p className="muted mt-1">
                Customize appearance & behaviour — changes apply live to the
                preview on the right.
              </p>
            </div>
            <div className="text-sm muted">Updated: now</div>
          </header>

          <div className="grid md:grid-cols-2 gap-6">
            {/* left column */}
            <div className="space-y-6">
              <div className="glass rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="text-sm muted">General</div>
                    <div className="text-lg heading">Message Text Size</div>
                  </div>
                  <div className="text-sm muted">{textSize}px</div>
                </div>

                <div
                  className="w-full rounded-xl p-3"
                  style={{
                    background: COLORS.panelGradient1,
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{
                        background: `rgba(${accentRgb}, 0.12)`,
                        fontFamily: "NekstMedium",
                      }}
                    >
                      Aa
                    </div>
                    <div className="flex-1">
                      <div className="text-sm muted">
                        Preview message — font follows your system embedding.
                      </div>
                      <div
                        className="mt-2 rounded-md p-3"
                        style={{
                          borderRadius: 10,
                          background: COLORS.black12,
                        }}
                      >{`Это пример текста чата ${textSize}px`}</div>
                    </div>
                    <div className="w-40">
                      <input
                        type="range"
                        min="12"
                        max="24"
                        value={textSize}
                        onChange={(e) => setTextSize(Number(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-3">
                    <button
                      onClick={() =>
                        setSettings((s) => ({
                          ...s,
                          messageCorners: !s.messageCorners,
                        }))
                      }
                      className="col-span-1 p-3 rounded-lg flex items-center gap-3"
                      style={{
                        background: "transparent",
                        border: `1px solid ${COLORS.border04}`,
                      }}
                    >
                      <span className="w-3 h-3 rounded-full bg-slate-500" />{" "}
                      Message Corners
                    </button>
                    <button
                      onClick={() =>
                        alert("Create New Theme — export/import flow goes here")
                      }
                      className="col-span-1 p-3 rounded-lg flex items-center gap-3"
                      style={{
                        background: "transparent",
                        border: `1px solid ${COLORS.border04}`,
                      }}
                    >
                      <span className="w-3 h-3 rounded-full bg-slate-500" />{" "}
                      Create New Theme
                    </button>
                    <button
                      onClick={() =>
                        alert("Change Chat Background — open picker")
                      }
                      className="col-span-1 p-3 rounded-lg flex items-center gap-3"
                      style={{
                        background: "transparent",
                        border: `1px solid ${COLORS.border04}`,
                      }}
                    >
                      <span className="w-3 h-3 rounded-full bg-slate-500" />{" "}
                      Change Chat Background
                    </button>
                  </div>
                </div>
              </div>

              <div
                style={{
                  background: COLORS.panelGradient2,
                }}
                className="rounded-xl p-4"
              >
                <div className="text-lg heading mb-3">Color theme</div>
                <div className="flex flex-col gap-3">
                  <div className="flex gap-4 items-center overflow-x-auto py-2">
                    {themes.map((t) => (
                      <div
                        key={t}
                        onClick={() => setSelectedTheme(t)}
                        className={`min-w-[140px] p-3 rounded-lg flex-shrink-0 cursor-pointer transition-transform ${
                          selectedTheme === t ? "scale-105" : ""
                        }`}
                        style={
                          selectedTheme === t
                            ? {
                                boxShadow: `0 8px 28px rgba(${accentRgb},0.09)`,
                                border: `1px solid ${selectedAccent}`,
                              }
                            : { border: `1px solid ${COLORS.border02}` }
                        }
                      >
                        <div className="flex gap-2 items-center">
                          <div
                            className="w-8 h-6 rounded-md"
                            style={{
                              background:
                                selectedTheme === t
                                  ? `linear-gradient(90deg, ${selectedAccent}33, ${COLORS.white02})`
                                  : `linear-gradient(90deg, ${COLORS.white02}, ${COLORS.panelGradient1})`,
                            }}
                          />
                          <div className="flex flex-col gap-1 flex-1">
                            <div
                              className="h-2 rounded-md"
                              style={{
                                background:
                                  selectedTheme === t
                                    ? `${selectedAccent}`
                                    : COLORS.white04,
                                opacity: 0.9,
                              }}
                            />
                            <div
                              className="h-2 rounded-md"
                              style={{
                                background:
                                  t === "Day"
                                    ? COLORS.green500
                                    : COLORS.white06,
                              }}
                            />
                          </div>
                        </div>
                        <div className="text-sm muted mt-2">{t}</div>
                      </div>
                    ))}

                    <div className="flex items-center gap-2 ml-4">
                      {accents.map((c) => (
                        <button
                          key={c}
                          onClick={() => setSelectedAccent(c)}
                          className={`w-8 h-8 rounded-full border ${
                            selectedAccent === c ? "accent-ring" : ""
                          }`}
                          style={{
                            background: c,
                            borderColor:
                              selectedAccent === c ? c : COLORS.border06,
                          }}
                        />
                      ))}
                      <div className="w-8 h-8 rounded-full border border-dashed border-white/20 flex items-center justify-center">
                        +
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg glass flex items-center justify-between">
                      <div>
                        <div className="text-sm muted">Auto-Night Mode</div>
                        <div className="text-sm">Disabled</div>
                      </div>
                      <div className="muted">›</div>
                    </div>
                    <div className="p-3 rounded-lg glass flex items-center justify-between">
                      <div>
                        <div className="text-sm muted">Emoji Set</div>
                        <div className="text-sm">System</div>
                      </div>
                      <div className="muted">›</div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                style={{
                  background: COLORS.panelGradient2,
                }}
                className="rounded-xl p-4"
              >
                <div className="text-lg heading mb-3">Settings</div>
                <div className="space-y-3">
                  {Object.entries(settings).map(([key, val]) => {
                    const label = key
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (s) => s.toUpperCase())
                      .replace("Full screen", "Full-screen");

                    return (
                      <label
                        key={key}
                        className="flex items-center justify-between bg-transparent p-3 rounded-lg"
                        style={{ border: `1px solid ${COLORS.border02}` }}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={val}
                            onChange={() =>
                              setSettings((s) => ({ ...s, [key]: !s[key] }))
                            }
                            className="w-4 h-4"
                          />
                          <div className="text-sm">{label}</div>
                        </div>
                        <div className="muted" />
                      </label>
                    );
                  })}
                </div>

                <div
                  className="mt-4 p-3 rounded-lg"
                  style={{ border: `1px solid ${COLORS.border02}` }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm muted">Distance Units</div>
                      <div className="text-sm">Automatic</div>
                    </div>
                    <div className="muted">›</div>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={resetDefaults}
                    className="px-3 py-2 rounded-lg"
                    style={{ border: `1px solid ${COLORS.border04}` }}
                  >
                    Reset
                  </button>
                  <button
                    onClick={() => alert("Saved (demo)")}
                    className="px-3 py-2 rounded-lg"
                    style={{ background: "var(--accent)", color: COLORS.black }}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>

            {/* right column: live preview */}
            <div className="flex flex-col h-[68vh]">
              <div className="flex items-center justify-between mb-3">
                <div className="text-lg heading">Live preview</div>
                <div className="text-sm muted">Theme: {selectedTheme}</div>
              </div>

              <div
                className="flex-1 rounded-2xl p-4 glass overflow-hidden flex flex-col"
                style={{ gap: 12 }}
              >
                {/* scrollable message area */}
                <div
                  className="overflow-auto flex-1 p-2"
                  style={{ display: "flex", flexDirection: "column", gap: 12 }}
                >
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      style={{
                        display: "flex",
                        justifyContent: m.me ? "flex-end" : "flex-start",
                      }}
                    >
                      <div
                        className={`${
                          m.me ? "bubble-me" : "bubble-other"
                        } p-3 max-w-[68%] rounded-xl`}
                        style={{
                          background: m.me
                            ? `linear-gradient(180deg, ${selectedAccent}, ${selectedAccent})`
                            : palette.incomingBg,
                          color: m.me
                            ? selectedTheme === "Day"
                              ? COLORS.black
                              : COLORS.white
                            : selectedTheme === "Day"
                            ? COLORS.gray900
                            : "var(--muted)",
                          fontSize: `${textSize}px`,
                          borderRadius: settings.messageCorners ? 18 : 14,
                          display: "inline-block",
                        }}
                      >
                        <div style={{ whiteSpace: "pre-wrap" }}>
                          {formatEmoji(m.text)}
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            opacity: 0.7,
                            marginTop: 6,
                            textAlign: "right",
                          }}
                          className={m.me ? "" : "muted"}
                        >
                          {new Date(m.ts || Date.now()).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Composer */}
                <div className="mt-3">
                  <div className="flex items-end gap-3">
                    <textarea
                      value={composer}
                      onChange={(e) => setComposer(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={
                        settings.sendByEnter
                          ? "Enter to send, Shift+Enter new line"
                          : "Ctrl/Cmd+Enter to send"
                      }
                      className="flex-1 p-3 rounded-lg"
                      style={{
                        minHeight: 56,
                        resize: "none",
                        background: COLORS.black12,
                        color: "inherit",
                      }}
                    />
                    <button
                      onClick={() => sendMessage()}
                      className={`px-4 py-2 rounded-lg ${
                        composer.trim() ? "" : "disabled"
                      }`}
                      style={{
                        background: "var(--accent)",
                        color: COLORS.black,
                      }}
                      disabled={!composer.trim()}
                    >
                      Send
                    </button>
                  </div>

                  <div className="text-xs muted mt-2">
                    Tip: toggle <b>Replace Emoji</b> to enable automatic :smile:
                    → 😄 conversion.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
