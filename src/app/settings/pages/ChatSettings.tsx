// ChatSettingsPanel.jsx
"use client";

import React, { useMemo, useState, useEffect, useRef } from "react";
import {
  Sliders,
  Check,
  Plus,
  Palette,
  Image,
  RefreshCw,
  Save,
  ChevronRight,
} from "lucide-react";

/** темы */
const themes = [
  "Classic",
  "Day",
  "Dark",
  "Glacier Dream",
  "Grape Ocean",
  "Purple OLED",
];

function hexToRgb(hex) {
  const h = (hex || "#000000").replace("#", "");
  const full =
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h;
  const num = parseInt(full, 16);
  return `${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}`;
}
function hexToRgbArr(hex) {
  const h = (hex || "#000000").replace("#", "");
  const full =
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h;
  const num = parseInt(full, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}
function contrastTextColor(hex) {
  const [r, g, b] = hexToRgbArr(hex);
  const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return lum > 0.6 ? "#000000" : "#ffffff";
}

export default function ChatSettingsPanel({
  textSize,
  setTextSize,
  accents = [],
  selectedTheme,
  setSelectedTheme,
  selectedAccent,
  setSelectedAccent,
  themePalettes = {},
  settings,
  setSettings,
  COLORS,
}) {
  const accentRgb = useMemo(
    () =>
      hexToRgb(selectedAccent || (COLORS && COLORS.defaultAccent) || "#FCA5A5"),
    [selectedAccent, COLORS]
  );
  const accent =
    selectedAccent || (COLORS && COLORS.defaultAccent) || "#FCA5A5";

  const GRAY = "#9CA3AF";
  const btnTextColor =
    selectedTheme === "Day" ? "var(--text-primary)" : "var(--text-secondary)";
  const iconDefaultStroke =
    selectedTheme === "Day" ? "#0B1220" : "var(--icon-muted)";

  // локальный радиус (контролируемый input)
  const [cornerRadius, setCornerRadius] = useState(
    settings?.messageCornerRadius ?? 10
  );
  const lastPropRadius = useRef(settings?.messageCornerRadius ?? 10);

  useEffect(() => {
    if (
      typeof settings?.messageCornerRadius === "number" &&
      settings.messageCornerRadius !== lastPropRadius.current
    ) {
      lastPropRadius.current = settings.messageCornerRadius;
      setCornerRadius(settings.messageCornerRadius);
    }
  }, [settings?.messageCornerRadius]);

  // какая панель открыта (каждая панель отвечает за свои инпуты)
  // 'messages' | 'create' | 'background' | null
  const [openPanel, setOpenPanel] = useState(null);

  // create theme
  const [newThemeName, setNewThemeName] = useState("");
  const [newAccentColor, setNewAccentColor] = useState(accent);

  // background
  const [bgMode, setBgMode] = useState("panel"); // panel/color/image
  const [bgColor, setBgColor] = useState("#ffffff");
  const [bgImageUrl, setBgImageUrl] = useState(null);

  useEffect(() => {
    setNewAccentColor(selectedAccent || accent);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAccent]);

  const previewBackground =
    bgMode === "image"
      ? bgImageUrl
        ? `url(${bgImageUrl}) center/cover no-repeat`
        : "var(--panel2)"
      : bgMode === "color"
      ? bgColor
      : "var(--panel2)";

  function sanitizeHex(hex) {
    if (!hex) return "#ffffff";
    const h = String(hex).trim();
    if (/^#([0-9a-fA-F]{8})$/.test(h)) return "#" + h.slice(1, 7);
    if (/^#([0-9a-fA-F]{3})$/.test(h))
      return (
        "#" +
        h
          .slice(1)
          .split("")
          .map((c) => c + c)
          .join("")
      );
    if (/^#([0-9a-fA-F]{6})$/.test(h)) return h;
    try {
      const n = parseInt(h.replace("#", ""), 16);
      return "#" + ("000000" + n.toString(16)).slice(-6);
    } catch {
      return "#ffffff";
    }
  }

  function handleBgFile(e) {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setBgImageUrl(url);
    setBgMode("image");
    if (typeof setSettings === "function")
      setSettings((s) => ({
        ...(s || {}),
        chatBackground: { type: "image", url },
      }));
  }

  // Замените этим тело функции saveNewTheme в компоненте
  function saveNewTheme() {
    // имя темы
    const name = newThemeName.trim() || "Custom Theme";
    if (typeof setSelectedTheme === "function") {
      setSelectedTheme(name);
    }

    // выбранный акцент — берем newAccentColor (по умолчанию GRAY)
    const chosenAccent = newAccentColor || GRAY;
    if (typeof setSelectedAccent === "function") {
      setSelectedAccent(chosenAccent);
    }

    // Записываем только тему/акцент в settings (НЕ трогаем chatBackground)
    if (typeof setSettings === "function") {
      setSettings((s) => ({
        ...(s || {}),
        // сохраняем отдельно, чтобы не путать с chatBackground
        themeName: name,
        themeAccent: chosenAccent,
      }));
    }

    // закрываем панель создания темы
    setOpenPanel(null);
  }

  function applyBgColor(hex) {
    const safe = sanitizeHex(hex);
    setBgColor(safe);
    setBgMode("color");
    if (typeof setSettings === "function")
      setSettings((s) => ({
        ...(s || {}),
        chatBackground: { type: "color", color: safe },
      }));
  }

  function persistCornerRadius(value) {
    const v = Number(value);
    if (typeof setSettings === "function") {
      const prev = settings?.messageCornerRadius;
      if (prev !== v) {
        setSettings((s) => ({ ...(s || {}), messageCornerRadius: v }));
        lastPropRadius.current = v;
      }
    }
  }

  useEffect(() => {
    return () => {
      if (bgImageUrl) {
        try {
          URL.revokeObjectURL(bgImageUrl);
        } catch {}
      }
    };
  }, [bgImageUrl]);

  const messageCornersEnabled = !!settings?.messageCorners;
  const outgoingTextColor = contrastTextColor(selectedAccent || GRAY);

  return (
    <div className="space-y-6 ">
      {/* ОБЩИЕ */}
      <div className="rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <Sliders size={18} style={{ stroke: iconDefaultStroke }} />
            <div>
              <div
                className="text-sm"
                style={{ color: "var(--text-tertiary)" }}
              >
                Общие
              </div>
              <div
                className="text-lg heading"
                style={{ color: "var(--text-primary)" }}
              >
                Размер текста сообщений
              </div>
            </div>
          </div>

          <div className="text-sm" style={{ color: "var(--text-secondary)" }}>
            {textSize}px
          </div>
        </div>

        <div
          className="w-full rounded-xl p-3"
          style={{ background: "var(--panel)" }}
        >
          <div
            className="flex items-center gap-4"
            style={{ ["--accent"]: accent }}
          >
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center preview-pill"
              style={{
                background: `rgba(${accentRgb}, 0.12)`,
                fontFamily:
                  "NekstMedium, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
                transform: `scale(${12 / Math.max(12, textSize)})`,
                color: "var(--text-primary)",
              }}
              aria-hidden
            >
              Aa
            </div>

            <div className="flex-1">
              <div
                className="text-sm"
                style={{ color: "var(--text-tertiary)" }}
              >
                Превью переписки — изменения применяются в реальном времени.
              </div>

              {/* превью переписки */}
              <div
                className="mt-2 rounded-md p-3"
                style={{
                  borderRadius: 12,
                  background: previewBackground,
                  padding: 12,
                  transition: "box-shadow 160ms ease, background 160ms ease",
                }}
                role="region"
                aria-live="polite"
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                    minHeight: 120,
                    maxHeight: 240,
                    overflow: "auto",
                    padding: "6px 2px",
                  }}
                >
                  <div
                    style={{
                      alignSelf: "flex-start",
                      maxWidth: "78%",
                      background:
                        themePalettes?.[selectedTheme]?.incomingBg ||
                        "rgba(0,0,0,0.04)",
                      color: "var(--text-primary)",
                      padding: "10px 12px",
                      borderRadius: `${cornerRadius}px`,
                      borderTopLeftRadius: `${Math.max(4, cornerRadius - 2)}px`,
                      fontSize: `${Math.max(12, textSize)}px`,
                      lineHeight: 1.4,
                    }}
                  >
                    Привет! Это входящее сообщение — здесь видно фон и углы
                    пузырька.
                  </div>

                  <div style={{ height: 6 }} />

                  <div
                    style={{
                      alignSelf: "flex-end",
                      maxWidth: "78%",
                      padding: "10px 12px",
                      borderRadius: `${cornerRadius}px`,
                      background: `linear-gradient(90deg, ${accent}, rgba(${accentRgb},0.9))`,
                      color: outgoingTextColor,
                      boxShadow: `0 6px 18px rgba(${accentRgb},0.12)`,
                      fontSize: `${Math.max(12, textSize)}px`,
                      lineHeight: 1.4,
                    }}
                  >
                    Мое сообщение — проверяем читаемость и акцент.
                  </div>
                </div>
              </div>

              {/* Здесь показываются ДВА ползунка в строке ТОЛЬКО когда открыта панель 'messages' */}
              <div className="mt-3">
                {openPanel === "messages" ? (
                  <div
                    style={{
                      display: "flex",
                      gap: 12,
                      alignItems: "flex-start",
                    }}
                  >
                    {/* Левый: текст (без подписи по задаче) */}
                    <div style={{ flex: 1 }}>
                      <input
                        aria-label="Размер текста сообщения"
                        type="range"
                        min="12"
                        max="24"
                        value={textSize}
                        onChange={(e) => setTextSize(Number(e.target.value))}
                        className="w-full range"
                        style={{ ["--accent"]: accent }}
                      />
                      <div
                        className="text-xs mt-1"
                        style={{ color: "var(--text-tertiary)" }}
                      >
                        Размер сообщения: {textSize}px
                      </div>
                    </div>

                    {/* Правый: радиус углов */}
                    <div style={{ width: 160 }}>
                      <input
                        aria-label="Радиус углов сообщений"
                        type="range"
                        min="0"
                        max="24"
                        value={cornerRadius}
                        onChange={(e) =>
                          setCornerRadius(Number(e.target.value))
                        }
                        onMouseUp={(e) =>
                          persistCornerRadius(e.currentTarget.value)
                        }
                        onTouchEnd={(e) =>
                          persistCornerRadius(e.currentTarget.value)
                        }
                        onBlur={(e) =>
                          persistCornerRadius(e.currentTarget.value)
                        }
                        className="w-full range"
                        style={{ ["--accent"]: accent }}
                      />
                      <div
                        className="text-xs mt-1"
                        style={{ color: "var(--text-tertiary)" }}
                      >
                        Радиус: {cornerRadius}px
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{ color: "var(--text-tertiary)", fontSize: 12 }}>
                    Нажмите «Сообщения», чтобы настроить размер и углы.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* кнопки */}
          <div className="mt-4 grid grid-cols-3 gap-3">
            {/* Сообщения (ранее Углы сообщений) */}
            <div className="col-span-1">
              <button
                onClick={() =>
                  setOpenPanel((p) => (p === "messages" ? null : "messages"))
                }
                className="w-full p-3 rounded-lg flex items-center gap-3 transition"
                style={{
                  background: "transparent",
                  border: `1px solid var(--panel-border)`,
                  color: btnTextColor,
                }}
                aria-pressed={openPanel === "messages"}
              >
                <Sliders size={16} style={{ stroke: iconDefaultStroke }} />
                <span style={{ color: btnTextColor }}>Сообщения</span>
              </button>
            </div>

            {/* Создать тему */}
            <div className="col-span-1 ">
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <button
                  onClick={() =>
                    setOpenPanel((p) => (p === "create" ? null : "create"))
                  }
                  className="w-full p-3 rounded-lg flex items-center gap-3 transition"
                  style={{
                    background: "transparent",
                    border: `1px solid var(--panel-border)`,
                    color: btnTextColor,
                  }}
                  aria-expanded={openPanel === "create"}
                >
                  <Plus size={16} style={{ stroke: iconDefaultStroke }} />
                  <span style={{ color: btnTextColor }}>Создать тему</span>
                </button>

                {openPanel === "create" ? (
                  <div
                    id="create-theme-panel"
                    className="p-3 rounded-md"
                    style={{
                      border: `1px solid var(--panel-border)`,
                      background: "var(--panel2)",
                    }}
                  >
                    <label
                      className="block text-sm mb-2"
                      style={{ color: "var(--text-tertiary)" }}
                    >
                      Название темы
                    </label>
                    <input
                      value={newThemeName}
                      onChange={(e) => setNewThemeName(e.target.value)}
                      placeholder="Имя темы"
                      className="w-full mb-2 px-3 py-2 rounded"
                      style={{
                        background: "transparent",
                        border: `1px solid var(--panel-border)`,
                        color: "var(--text-primary)",
                      }}
                    />

                    <label
                      className="block text-sm mb-2"
                      style={{ color: "var(--text-tertiary)" }}
                    >
                      Акцент (цвет)
                    </label>
                    <div className="flex items-center gap-2 mb-3">
                      <input
                        aria-label="Выбрать цвет акцента"
                        type="color"
                        value={newAccentColor}
                        onChange={(e) => setNewAccentColor(e.target.value)}
                        style={{
                          width: 40,
                          height: 32,
                          border: `1px solid var(--panel-border)`,
                          background: "transparent",
                        }}
                      />
                      <div style={{ color: "var(--text-secondary)" }}>
                        {newAccentColor}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setOpenPanel(null)}
                        className="px-3 py-2 rounded-lg"
                        style={{
                          border: `1px solid var(--panel-border)`,
                          background: "transparent",
                          color: "var(--text-secondary)",
                        }}
                      >
                        Отмена
                      </button>
                      <button
                        onClick={() => saveNewTheme()}
                        className="px-3 py-2 rounded-lg"
                        style={{
                          border: `1px solid var(--panel-border)`,
                          background: "var(--accent)",
                          color: "var(--text-primary)",
                        }}
                      >
                        Применить
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            {/* Фон чата */}
            <div className="col-span-1">
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <button
                  onClick={() =>
                    setOpenPanel((p) =>
                      p === "background" ? null : "background"
                    )
                  }
                  className="w-full p-3 rounded-lg flex items-center gap-3 transition"
                  style={{
                    background: "transparent",
                    border: `1px solid var(--panel-border)`,
                    color: btnTextColor,
                  }}
                  aria-expanded={openPanel === "background"}
                >
                  <Image size={16} style={{ stroke: iconDefaultStroke }} />
                  <span style={{ color: btnTextColor }}>Изменить фон чата</span>
                </button>

                {openPanel === "background" ? (
                  <div
                    className="p-3 rounded-md"
                    style={{
                      border: `1px solid var(--panel-border)`,
                      background: "var(--panel2)",
                    }}
                  >
                    <div className="mb-2">
                      <label
                        className="text-sm block mb-1"
                        style={{ color: "var(--text-tertiary)" }}
                      >
                        Цвет фона
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          aria-label="Выбрать цвет фона"
                          type="color"
                          value={bgColor}
                          onChange={(e) =>
                            setBgColor(sanitizeHex(e.target.value))
                          }
                          style={{
                            width: 40,
                            height: 32,
                            border: `1px solid var(--panel-border)`,
                          }}
                        />
                        <button
                          onClick={() => applyBgColor(bgColor || "#F1F5F9")}
                          className="px-2 py-1 rounded"
                          style={{
                            border: `1px solid var(--panel-border)`,
                            background: "transparent",
                            color: "var(--text-secondary)",
                          }}
                        >
                          Применить цвет
                        </button>
                      </div>
                    </div>

                    <div>
                      <label
                        className="text-sm block mb-1"
                        style={{ color: "var(--text-tertiary)" }}
                      >
                        Или загрузить изображение
                      </label>
                      <input
                        aria-label="Загрузить фон"
                        type="file"
                        accept="image/*"
                        onChange={handleBgFile}
                      />
                      {bgMode === "image" && bgImageUrl ? (
                        <div
                          className="mt-2 text-sm"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          Предпросмотр изображения отображается в превью.
                        </div>
                      ) : null}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* остальной код (цвета темы, настройки и т.д.) оставил без изменений */}
      <div style={{ background: "var(--panel2)" }} className="rounded-xl p-4">
        <div className="flex items-center gap-3 mb-3">
          <Palette size={18} style={{ stroke: iconDefaultStroke }} />
          <div
            className="text-lg heading"
            style={{ color: "var(--text-primary)" }}
          >
            Цветовая тема
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex gap-4 items-center overflow-x-auto py-2">
            {themes.map((t) => (
              <button
                key={t}
                onClick={() => {
                  setSelectedTheme(t);
                  if (t === "Day") setSelectedAccent(GRAY);
                }}
                className={`min-w-[140px] p-3 rounded-lg flex-shrink-0 cursor-pointer transition-transform focus:outline-none ${
                  selectedTheme === t ? "scale-105" : ""
                }`}
                style={
                  selectedTheme === t
                    ? {
                        boxShadow: `0 8px 28px rgba(${accentRgb},0.09)`,
                        border: `1px solid var(--accent)`,
                        color: "var(--text-primary)",
                      }
                    : {
                        border: `1px solid var(--panel-border)`,
                        color: "var(--text-secondary)",
                      }
                }
                aria-pressed={selectedTheme === t}
                aria-label={`Выбрать тему ${t}`}
              >
                <div className="flex gap-2 items-center">
                  <div
                    className="w-8 h-6 rounded-md"
                    style={{
                      background:
                        selectedTheme === t
                          ? `linear-gradient(90deg, var(--accent)33, var(--panel))`
                          : `linear-gradient(90deg, var(--panel), rgba(0,0,0,0.03))`,
                    }}
                  />
                  <div className="flex flex-col gap-1 flex-1">
                    <div
                      className="h-2 rounded-md"
                      style={{
                        background:
                          selectedTheme === t
                            ? "var(--accent)"
                            : "var(--panel-border)",
                        opacity: 0.9,
                      }}
                    />
                    <div
                      className="h-2 rounded-md"
                      style={{
                        background: `linear-gradient(90deg, ${themePalettes[t].bgFrom} 0%, ${themePalettes[t].bgVia} 50%, ${themePalettes[t].bgTo} 100%)`,
                      }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between mt-2">
                  <div
                    className="text-sm"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {t}
                  </div>
                  {selectedTheme === t && (
                    <Check
                      size={14}
                      style={{ stroke: "var(--text-primary)" }}
                    />
                  )}
                </div>
              </button>
            ))}

            <div className="flex items-center gap-2 ml-4">
              {accents.map((c, i) => {
                const isLast = i === accents.length - 1;
                const displayColor = isLast ? GRAY : c;
                const isSelected = selectedAccent === displayColor;
                return (
                  <button
                    key={`${displayColor}-${i}`}
                    onClick={() => setSelectedAccent(displayColor)}
                    className={`w-8 h-8 rounded-full border flex items-center justify-center transition-transform focus:outline-none`}
                    style={{
                      background: displayColor,
                      borderColor: isSelected
                        ? displayColor
                        : "var(--panel-border)",
                      boxShadow: isSelected
                        ? `0 6px 16px rgba(${hexToRgb(displayColor)},0.12)`
                        : undefined,
                      transform: isSelected ? "scale(1.06)" : undefined,
                    }}
                    aria-pressed={isSelected}
                    aria-label={`Выбрать акцент ${displayColor}`}
                    title={
                      isLast
                        ? "Серый (рекомендуется для Day)"
                        : `Акцент ${displayColor}`
                    }
                  >
                    {isSelected ? (
                      <div
                        style={{
                          width: 18,
                          height: 18,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Check
                          size={12}
                          style={{ stroke: "var(--text-primary)" }}
                        />
                      </div>
                    ) : null}
                  </button>
                );
              })}

              <div
                className="w-8 h-8 rounded-full border border-dashed"
                style={{ borderColor: "var(--panel-border)" }}
                title="Добавить акцент"
                aria-label="Добавить акцент"
              >
                <Plus size={14} style={{ stroke: iconDefaultStroke }} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg glass flex items-center justify-between">
              <div>
                <div
                  className="text-sm"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  Авто-ночной режим
                </div>
                <div
                  className="text-sm"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Отключено
                </div>
              </div>
              <div>
                <ChevronRight size={16} style={{ stroke: iconDefaultStroke }} />
              </div>
            </div>
            <div className="p-3 rounded-lg glass flex items-center justify-between">
              <div>
                <div
                  className="text-sm"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  Набор эмодзи
                </div>
                <div
                  className="text-sm"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Системный
                </div>
              </div>
              <div>
                <ChevronRight size={16} style={{ stroke: iconDefaultStroke }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* НИЖНИЕ НАСТРОЙКИ */}
      <div style={{ background: "var(--panel2)" }} className="rounded-xl p-4">
        <div
          className="text-lg heading mb-3"
          style={{ color: "var(--text-primary)" }}
        >
          Настройки
        </div>

        <div className="space-y-3">
          {Object.entries(settings || {}).map(([key, val]) => {
            const label = key
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, (s) => s.toUpperCase())
              .replace("Full screen", "Полноэкранный");
            return (
              <label
                key={key}
                className="flex items-center justify-between bg-transparent p-3 rounded-lg"
                style={{
                  border: `1px solid var(--panel-border)`,
                  color: "var(--text-secondary)",
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    role="switch"
                    aria-checked={!!val}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ")
                        setSettings((s) => ({ ...(s || {}), [key]: !s[key] }));
                    }}
                    onClick={() =>
                      setSettings((s) => ({ ...(s || {}), [key]: !s[key] }))
                    }
                    className="flex items-center gap-3 cursor-pointer select-none"
                    style={{ color: "var(--text-secondary)" }}
                    aria-label={label}
                  >
                    <div
                      style={{
                        width: 40,
                        height: 22,
                        borderRadius: 12,
                        padding: 3,
                        background: val
                          ? "var(--accent)"
                          : "var(--panel-border)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: val ? "flex-end" : "flex-start",
                        transition: "all 150ms ease",
                      }}
                      aria-hidden
                    >
                      <div
                        style={{
                          width: 16,
                          height: 16,
                          borderRadius: 8,
                          background: "var(--panel2)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {val ? (
                          <Check
                            size={12}
                            style={{ stroke: "var(--text-primary)" }}
                          />
                        ) : null}
                      </div>
                    </div>

                    <div
                      className="text-sm"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {label}
                    </div>
                  </div>
                </div>

                <div style={{ color: "var(--text-tertiary)" }} />
              </label>
            );
          })}
        </div>

        <div
          className="mt-4 p-3 rounded-lg"
          style={{ border: `px solid var(--panel-border)` }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div
                className="text-sm"
                style={{ color: "var(--text-tertiary)" }}
              >
                Единицы расстояния
              </div>
              <div
                className="text-sm"
                style={{ color: "var(--text-secondary)" }}
              >
                Автоматически
              </div>
            </div>
            <div>
              <ChevronRight size={16} style={{ stroke: iconDefaultStroke }} />
            </div>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={() => alert("Сброс — демонстрация")}
            className="px-3 py-2 rounded-lg flex items-center gap-2"
            style={{
              border: `1px solid var(--panel-border)`,
              background: "transparent",
              color: "var(--text-secondary)",
            }}
          >
            <RefreshCw size={16} style={{ stroke: iconDefaultStroke }} /> Сброс
          </button>
          <button
            onClick={() => alert("Сохранено (демо)")}
            className="px-3 py-2 rounded-lg flex items-center gap-2"
            style={{
              background: "var(--accent)",
              color: "var(--text-primary)",
            }}
          >
            <Save size={16} style={{ stroke: "var(--text-primary)" }} />{" "}
            Сохранить
          </button>
        </div>
      </div>

      <style jsx>{`
        .range {
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
        .range::-webkit-slider-runnable-track {
          height: 8px;
          border-radius: 999px;
        }
        .range::-webkit-slider-thumb {
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
        .preview-pill {
          transition: transform 160ms ease, background 160ms ease;
          color: var(--text-primary);
        }
        @media (prefers-reduced-motion: reduce) {
          .preview-pill,
          .range {
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
}
