// PrivacyAndSecurity.jsx
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Lock,
  ShieldCheck,
  Key,
  LogOut,
  UserMinus,
  Users,
  DownloadCloud,
  Trash2,
  EyeOff,
  Eye,
  BellOff,
} from "lucide-react";

// Импорт готовых переиспользуемых компонентов
import ToggleSwitch from "../toggleSwitch";
import RangeSlider from "../RangeSlider";
/**
 * PrivacyAndSecurity
 *
 * Props:
 * - settings (object)
 * - setSettings (fn)
 * - selectedTheme (string)
 * - selectedAccent (string)
 * - setSelectedAccent (fn) - optional
 * - COLORS (object) - optional { defaultAccent: "#..." }
 * - onSignOutAll (fn) - optional
 */
export default function PrivacyAndSecurity({
  settings = {},
  setSettings,
  selectedTheme,
  selectedAccent,
  setSelectedAccent,
  COLORS,
  onSignOutAll,
}) {
  // helpers
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

  const accent =
    selectedAccent || (COLORS && COLORS.defaultAccent) || "#FCA5A5";
  const accentRgb = hexToRgbArr(accent).join(",");
  const iconStroke = selectedTheme === "Day" ? "#0B1220" : "var(--icon-muted)";

  // LOCAL STATES
  const [profilePublic, setProfilePublic] = useState(!!settings.profilePublic);
  const [showLastSeen, setShowLastSeen] = useState(
    settings.showLastSeen === undefined ? true : !!settings.showLastSeen
  );
  const [readReceipts, setReadReceipts] = useState(
    settings.readReceipts === undefined ? true : !!settings.readReceipts
  );
  const [twoFactor, setTwoFactor] = useState(!!settings.twoFactor);
  const [blocked, setBlocked] = useState(
    Array.isArray(settings.blockedUsers) ? settings.blockedUsers : []
  );
  const [sessions, setSessions] = useState(
    Array.isArray(settings.sessions)
      ? settings.sessions
      : [
          {
            id: "s1",
            device: "Chrome • Windows",
            ip: "92.168.0.11",
            lastActive: "2 ч. назад",
          },
          {
            id: "s2",
            device: "iPhone 14",
            ip: "88.77.66.55",
            lastActive: "вчера",
          },
        ]
  );

  // inline panels / confirmations
  const [expandPassword, setExpandPassword] = useState(false);
  const [expand2FA, setExpand2FA] = useState(false);
  const [revokeTarget, setRevokeTarget] = useState(null); // session id
  const [revokeAllConfirm, setRevokeAllConfirm] = useState(false);
  const [showBlockInput, setShowBlockInput] = useState(false);
  const [blockName, setBlockName] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showImportPanel, setShowImportPanel] = useState(false);
  const [showNotificationsPanel, setShowNotificationsPanel] = useState(false);

  // password fields
  const [pwdCurrent, setPwdCurrent] = useState("");
  const [pwdNew, setPwdNew] = useState("");
  const [pwdConfirm, setPwdConfirm] = useState("");
  const [pwdErrors, setPwdErrors] = useState(null);
  const [pwdSubmitting, setPwdSubmitting] = useState(false);

  // notification preview state
  const [notifVolume, setNotifVolume] = useState(70);
  const [notifSoundEnabled, setNotifSoundEnabled] = useState(true);
  const [notifPreviewPulse, setNotifPreviewPulse] = useState(0); // used to trigger preview

  // sync incoming settings -> local
  useEffect(() => {
    if (typeof settings.profilePublic === "boolean")
      setProfilePublic(!!settings.profilePublic);
    if (typeof settings.showLastSeen === "boolean")
      setShowLastSeen(!!settings.showLastSeen);
    if (typeof settings.readReceipts === "boolean")
      setReadReceipts(!!settings.readReceipts);
    if (typeof settings.twoFactor === "boolean")
      setTwoFactor(!!settings.twoFactor);
    if (Array.isArray(settings.blockedUsers)) setBlocked(settings.blockedUsers);
    if (Array.isArray(settings.sessions)) setSessions(settings.sessions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings]);

  // persist helper
  function persist(key, value) {
    if (typeof setSettings === "function") {
      setSettings((s) => ({ ...(s || {}), [key]: value }));
    }
  }

  // Toggle handlers using ToggleSwitch and persist (silent — no toasts)
  function handleToggleProfilePublic(next) {
    setProfilePublic(next);
    persist("profilePublic", next);
  }
  function handleToggleShowLastSeen(next) {
    setShowLastSeen(next);
    persist("showLastSeen", next);
  }
  function handleToggleReadReceipts(next) {
    setReadReceipts(next);
    persist("readReceipts", next);
  }
  function handleToggleTwoFactor(next) {
    setTwoFactor(next);
    persist("twoFactor", next);
  }

  // sessions / blocked actions (inline confirms)
  function confirmRevokeSession(sessionId) {
    setRevokeTarget(sessionId);
  }
  function doRevokeSession(sessionId) {
    const next = sessions.filter((s) => s.id !== sessionId);
    setSessions(next);
    persist("sessions", next);
    setRevokeTarget(null);
  }
  function confirmRevokeAll() {
    setRevokeAllConfirm(true);
  }
  function doRevokeAll() {
    setSessions([]);
    persist("sessions", []);
    setRevokeAllConfirm(false);
    if (typeof onSignOutAll === "function") onSignOutAll();
  }

  function toggleBlockInput() {
    setShowBlockInput((s) => !s);
    setBlockName("");
  }
  function doBlockUser() {
    if (!blockName || !blockName.trim()) {
      // silent fail - just return
      return;
    }
    const name = blockName.trim();
    const next = [...blocked, name];
    setBlocked(next);
    persist("blockedUsers", next);
    setShowBlockInput(false);
  }
  function doUnblock(idx) {
    const next = [...blocked];
    const removed = next.splice(idx, 1);
    setBlocked(next);
    persist("blockedUsers", next);
  }

  // export
  function doExportData() {
    const data = {
      exportedAt: new Date().toISOString(),
      settings,
      sessions,
      blocked,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "account-data-export.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    // silent: file downloaded
  }

  // delete account inline confirm
  function confirmDeleteAccount() {
    setShowDeleteConfirm(true);
  }
  function doDeleteAccount() {
    persist("accountDeleted", true);
    setSessions([]);
    setBlocked([]);
    setShowDeleteConfirm(false);
  }

  // change password (inline)
  async function submitChangePasswordInline() {
    setPwdErrors(null);
    if (!pwdCurrent || !pwdNew || !pwdConfirm) {
      setPwdErrors("Заполните все поля");
      return;
    }
    if (pwdNew.length < 8) {
      setPwdErrors("Новый пароль должен быть не менее 8 символов");
      return;
    }
    if (pwdNew !== pwdConfirm) {
      setPwdErrors("Пароли не совпадают");
      return;
    }
    setPwdSubmitting(true);
    try {
      persist("passwordChangedAt", new Date().toISOString());
      setExpandPassword(false);
      setPwdCurrent("");
      setPwdNew("");
      setPwdConfirm("");
    } catch {
      setPwdErrors("Не удалось изменить пароль — попробуйте ещё раз");
    } finally {
      setPwdSubmitting(false);
    }
  }

  // notifications preview trigger
  function triggerNotifPreview() {
    setNotifPreviewPulse((p) => p + 1);
  }

  // UI
  return (
    <div className="ps-root space-y-6">
      {/* Header */}
      <div className="glass rounded-xl p-4">
        <div className="flex items-center gap-3 mb-3">
          <ShieldCheck size={18} style={{ stroke: iconStroke }} />
          <div>
            <div className="text-sm" style={{ color: "var(--text-tertiary)" }}>
              Приватность и безопасность
            </div>
            <div
              className="text-lg heading"
              style={{ color: "var(--text-primary)" }}
            >
              Управление конфиденциальностью аккаунта
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <div className="ps-row">
            <div className="ps-left">
              <Users size={16} style={{ stroke: iconStroke }} />
              <div>
                <div className="ps-title">Видимость профиля</div>
                <div className="ps-sub">
                  Разрешить другим видеть ваш профиль
                </div>
              </div>
            </div>

            <div className="ps-right">
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <ToggleSwitch
                  id="ps-profile-public"
                  checked={profilePublic}
                  onChange={handleToggleProfilePublic}
                  ariaLabel="Видимость профиля"
                />
                <div
                  className="text-sm"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {profilePublic ? "Публичный" : "Приватный"}
                </div>
              </div>
            </div>
          </div>

          <div className="ps-row">
            <div className="ps-left">
              <Eye size={16} style={{ stroke: iconStroke }} />
              <div>
                <div className="ps-title">Показывать «последнее в сети»</div>
                <div className="ps-sub">
                  Другие увидят, когда вы были в сети
                </div>
              </div>
            </div>
            <div className="ps-right">
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <ToggleSwitch
                  id="ps-lastseen"
                  checked={showLastSeen}
                  onChange={handleToggleShowLastSeen}
                  ariaLabel="Показывать последнее в сети"
                />
                <div
                  className="text-sm"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {showLastSeen ? "Вкл" : "Выкл"}
                </div>
              </div>
            </div>
          </div>

          <div className="ps-row">
            <div className="ps-left">
              <EyeOff size={16} style={{ stroke: iconStroke }} />
              <div>
                <div className="ps-title">Квитанции о прочтении</div>
                <div className="ps-sub">
                  Разрешает отправителю видеть, что вы прочитали сообщение
                </div>
              </div>
            </div>
            <div className="ps-right">
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <ToggleSwitch
                  id="ps-readreceipts"
                  checked={readReceipts}
                  onChange={handleToggleReadReceipts}
                  ariaLabel="Квитанции о прочтении"
                />
                <div
                  className="text-sm"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {readReceipts ? "Вкл" : "Выкл"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Security: 2FA (expandable) and Change password (expandable) */}
      <div style={{ background: "var(--panel2)" }} className="rounded-xl p-4">
        <div className="flex items-center gap-3 mb-3">
          <Lock size={18} style={{ stroke: iconStroke }} />
          <div>
            <div
              className="text-lg heading"
              style={{ color: "var(--text-primary)" }}
            >
              Безопасность
            </div>
            <div className="text-sm" style={{ color: "var(--text-tertiary)" }}>
              Настройки входа и защита аккаунта
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {/* 2FA card: main row with switch and expand chevron */}
          <div className={`ps-card ps-expandable ${expand2FA ? "open" : ""}`}>
            <div
              className="ps-left"
              onClick={() => setExpand2FA((s) => !s)}
              style={{ cursor: "pointer" }}
            >
              <Key size={16} style={{ stroke: iconStroke }} />
              <div>
                <div className="ps-title">Двухфакторная аутентификация</div>
                <div className="ps-sub">
                  Рекомендуется включить для безопасности
                </div>
              </div>
            </div>

            <div className="ps-right">
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <ToggleSwitch
                  id="ps-2fa"
                  checked={twoFactor}
                  onChange={handleToggleTwoFactor}
                  ariaLabel="Двухфакторная аутентификация"
                />
                <div
                  className="text-sm"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {expand2FA ? "Свернуть" : "Подробнее"}
                </div>
              </div>
            </div>

            {/* expanded area for 2FA */}
            <div className="ps-expander">
              <div className="ps-expander-inner">
                <div
                  className="text-sm"
                  style={{ color: "var(--text-tertiary)", marginBottom: 8 }}
                >
                  Настройте методы двухфакторной аутентификации:
                  приложение-аутентификатор, SMS (если доступно) или аппаратный
                  ключ.
                </div>

                <div className="flex gap-2 flex-wrap">
                  <button
                    className="ps-btn-ghost"
                    onClick={() => {
                      // silent demo action
                    }}
                  >
                    Сгенерировать код восстановления
                  </button>
                  <button
                    className="ps-btn-primary"
                    onClick={() => {
                      // silent demo action
                    }}
                  >
                    Показать QR для приложения
                  </button>
                  <button
                    className="ps-btn-ghost"
                    onClick={() => {
                      // silent demo action
                    }}
                  >
                    Добавить аппаратный ключ
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Change password card (expandable) */}
          <div
            className={`ps-card ps-expandable ${expandPassword ? "open" : ""}`}
          >
            <div
              className="ps-left"
              style={{ cursor: "pointer" }}
              onClick={() => setExpandPassword((s) => !s)}
            >
              <ShieldCheck size={16} style={{ stroke: iconStroke }} />
              <div>
                <div className="ps-title">Сменить пароль</div>
                <div className="ps-sub">
                  Рекомендуем менять пароль регулярно
                </div>
              </div>
            </div>

            <div className="ps-right">
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  className="ps-btn-secondary"
                  onClick={() => setExpandPassword((s) => !s)}
                >
                  {expandPassword ? "Свернуть" : "Изменить"}
                </button>
              </div>
            </div>

            <div className="ps-expander">
              <div className="ps-expander-inner">
                <div
                  className="text-sm"
                  style={{ color: "var(--text-tertiary)", marginBottom: 8 }}
                >
                  Для безопасности введите текущий пароль и новый пароль.
                </div>

                <label className="ps-field">
                  <div className="ps-field-label">Текущий пароль</div>
                  <input
                    type="password"
                    value={pwdCurrent}
                    onChange={(e) => setPwdCurrent(e.target.value)}
                    className="ps-input"
                    placeholder="Текущий пароль"
                  />
                </label>

                <div style={{ display: "flex", gap: 10 }}>
                  <label style={{ flex: 1 }}>
                    <div className="ps-field-label">Новый пароль</div>
                    <input
                      type="password"
                      value={pwdNew}
                      onChange={(e) => setPwdNew(e.target.value)}
                      className="ps-input"
                      placeholder="Новый пароль (мин. 8 символов)"
                    />
                  </label>
                  <label style={{ flex: 1 }}>
                    <div className="ps-field-label">Подтвердите пароль</div>
                    <input
                      type="password"
                      value={pwdConfirm}
                      onChange={(e) => setPwdConfirm(e.target.value)}
                      className="ps-input"
                      placeholder="Повторите новый пароль"
                    />
                  </label>
                </div>

                {pwdErrors ? <div className="ps-error">{pwdErrors}</div> : null}

                <div className="flex gap-2 mt-2">
                  <button
                    className="ps-btn-ghost"
                    onClick={() => {
                      setExpandPassword(false);
                      setPwdCurrent("");
                      setPwdNew("");
                      setPwdConfirm("");
                      setPwdErrors(null);
                    }}
                  >
                    Отмена
                  </button>
                  <button
                    className="ps-btn-primary"
                    onClick={submitChangePasswordInline}
                    disabled={pwdSubmitting}
                  >
                    {pwdSubmitting ? "Сохраняем..." : "Сохранить"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sessions */}
      <div className="glass rounded-xl p-4">
        <div className="flex items-center gap-3 mb-3">
          <LogOut size={18} style={{ stroke: iconStroke }} />
          <div>
            <div
              className="text-lg heading"
              style={{ color: "var(--text-primary)" }}
            >
              Активные сессии
            </div>
            <div className="text-sm" style={{ color: "var(--text-tertiary)" }}>
              Управляйте устройствами, где вы вошли
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {sessions.length === 0 ? (
            <div style={{ color: "var(--text-secondary)" }}>
              Нет активных сессий
            </div>
          ) : (
            sessions.map((s) => (
              <div className="ps-session" key={s.id}>
                <div>
                  <div
                    style={{ color: "var(--text-primary)", fontWeight: 600 }}
                  >
                    {s.device}
                  </div>
                  <div className="ps-sub">
                    {s.ip} • {s.lastActive}
                  </div>
                </div>
                <div className="ps-session-actions">
                  <button
                    onClick={() => confirmRevokeSession(s.id)}
                    className="ps-btn-ghost"
                  >
                    Отозвать
                  </button>
                </div>
              </div>
            ))
          )}

          {/* inline revoke confirmation for single session */}
          {revokeTarget ? (
            <div className="inline-confirm">
              <div style={{ color: "var(--text-secondary)" }}>
                Подтвердите: отозвать сессию?
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <button
                  className="ps-btn-ghost"
                  onClick={() => setRevokeTarget(null)}
                >
                  Отмена
                </button>
                <button
                  className="ps-btn-primary"
                  onClick={() => doRevokeSession(revokeTarget)}
                >
                  Отозвать
                </button>
              </div>
            </div>
          ) : null}

          {/* revoke all confirm */}
          {revokeAllConfirm ? (
            <div className="inline-confirm">
              <div style={{ color: "var(--text-secondary)" }}>
                Подтвердите: отозвать ВСЕ сессии (кроме текущей)?
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <button
                  className="ps-btn-ghost"
                  onClick={() => setRevokeAllConfirm(false)}
                >
                  Отмена
                </button>
                <button className="ps-btn-primary" onClick={doRevokeAll}>
                  Отозвать все
                </button>
              </div>
            </div>
          ) : null}

          <div className="flex gap-2 mt-2">
            <button className="ps-btn-ghost" onClick={confirmRevokeAll}>
              Отозвать все
            </button>
            <button
              className="ps-btn-primary"
              onClick={() => setRevokeAllConfirm((s) => !s)}
            >
              Подробнее
            </button>
          </div>
        </div>
      </div>

      {/* Block & Export & Notifications */}
      <div style={{ background: "var(--panel2)" }} className="rounded-xl p-4">
        <div className="flex items-center gap-3 mb-3">
          <UserMinus size={18} style={{ stroke: iconStroke }} />
          <div>
            <div
              className="text-lg heading"
              style={{ color: "var(--text-primary)" }}
            >
              Блокировки, экспорт и уведомления
            </div>
            <div className="text-sm" style={{ color: "var(--text-tertiary)" }}>
              Управление блокировками, экспортом данных и уведомлениями
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {/* blocked users */}
          <div className="ps-card-col">
            <div>
              <div style={{ color: "var(--text-primary)", fontWeight: 600 }}>
                Заблокированные пользователи
              </div>
              <div className="ps-sub">Управляйте списком блокировок</div>
            </div>
            <div>
              <button className="ps-btn-primary" onClick={toggleBlockInput}>
                Заблокировать
              </button>
            </div>
          </div>

          {showBlockInput ? (
            <div className="ps-block-input">
              <input
                className="ps-input"
                placeholder="Имя пользователя"
                value={blockName}
                onChange={(e) => setBlockName(e.target.value)}
              />
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <button className="ps-btn-ghost" onClick={toggleBlockInput}>
                  Отмена
                </button>
                <button className="ps-btn-primary" onClick={doBlockUser}>
                  Заблокировать
                </button>
              </div>
            </div>
          ) : null}

          <div className="mt-1 space-y-2">
            {blocked.length === 0 ? (
              <div style={{ color: "var(--text-secondary)" }}>
                Нет блокировок
              </div>
            ) : (
              blocked.map((u, i) => (
                <div key={`${u}-${i}`} className="ps-blocked">
                  <div style={{ color: "var(--text-primary)" }}>{u}</div>
                  <div>
                    <button
                      className="ps-btn-ghost"
                      onClick={() => doUnblock(i)}
                    >
                      Разблокировать
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Export */}
          <div className="ps-card-col" style={{ marginTop: 6 }}>
            <div>
              <div style={{ color: "var(--text-primary)", fontWeight: 600 }}>
                Экспорт данных
              </div>
              <div className="ps-sub">Скачайте копию своих данных (JSON)</div>
            </div>
            <div className="flex items-center gap-2">
              <button className="ps-btn-ghost" onClick={doExportData}>
                <DownloadCloud size={14} style={{ stroke: iconStroke }} />{" "}
                Экспорт
              </button>
              <button
                className="ps-btn-primary"
                onClick={() => setShowImportPanel((s) => !s)}
              >
                {showImportPanel ? "Свернуть" : "Импорт"}
              </button>
            </div>
          </div>

          {showImportPanel ? (
            <div className="ps-import-panel">
              <div className="ps-sub">
                Импорт реализуется через бэкенд. В демо — заглушка.
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <input type="file" accept=".json" className="ps-input" />
                <button
                  className="ps-btn-primary"
                  onClick={() => {
                    /* silent demo */
                  }}
                >
                  Загрузить
                </button>
              </div>
            </div>
          ) : null}

          {/* Notifications block (enhanced) */}
          <div className="ps-card-col">
            <div>
              <div style={{ color: "var(--text-primary)", fontWeight: 600 }}>
                Уведомления
              </div>
              <div className="ps-sub">
                Настройте поведение push и звуков уведомлений
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                alignItems: "flex-end",
              }}
            >
              <button
                className="ps-btn-secondary"
                onClick={() => setShowNotificationsPanel((s) => !s)}
              >
                {showNotificationsPanel ? "Свернуть" : "Открыть"}
              </button>
            </div>
          </div>

          {showNotificationsPanel ? (
            <div className="ps-notifications-panel">
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{ display: "flex", gap: 12, alignItems: "center" }}
                  className="w-full "
                >
                  {/* sample notification preview with accent stripe */}
                  <div className="notif-preview ">
                    <div className="notif-accent " />
                    <div className="notif-content ">
                      <div className="notif-title">Новое сообщение</div>
                      <div className="notif-body">
                        Аня: Посмотри, пожалуйста, новый макет — он готов.
                      </div>
                    </div>
                    <div
                      className={`notif-pulse ${
                        notifPreviewPulse > 0 ? "play" : ""
                      }`}
                      onAnimationEnd={() => {}}
                    />
                  </div>

                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 6 }}
                    className="w-full"
                  >
                    <div className="ps-sub">Звук уведомлений</div>
                    <div
                      style={{ display: "flex", gap: 8, alignItems: "center" }}
                    >
                      <div style={{ color: "var(--text-secondary)" }}>Выкл</div>

                      <RangeSlider
                        id="notif-volume"
                        value={notifVolume}
                        onChange={(v) => setNotifVolume(v)}
                        onCommit={() => {}}
                        min={0}
                        max={100}
                        step={1}
                        accent={accent}
                      />

                      <div style={{ color: "var(--text-secondary)" }}>Макс</div>
                    </div>
                  </div>
                  <div className="flex  w-full justify-end">
                    <button
                      className="ps-btn-ghost"
                      onClick={() => {
                        setNotifSoundEnabled((s) => !s);
                      }}
                    >
                      {notifSoundEnabled ? "Звук: Вкл" : "Звук: Выкл"}
                    </button>
                  </div>
                </div>

                <div
                  style={{
                    minWidth: 160,
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                  }}
                ></div>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <style jsx>{`
        .ps-root {
          position: relative;
        }

        .ps-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 12px;
          border: 1px solid var(--panel-border);
          border-radius: 10px;
          background: transparent;
        }
        .ps-left {
          display: flex;
          gap: 12px;
          align-items: center;
        }
        .ps-right {
          display: flex;
          align-items: center;
        }
        .ps-title {
          color: var(--text-primary);
          font-weight: 600;
        }
        .ps-sub {
          color: var(--text-tertiary);
          font-size: 13px;
        }

        .ps-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px;
          border: 1px solid var(--panel-border);
          border-radius: 10px;
          background: transparent;
          position: relative;
          overflow: visible;
        }
        .ps-card.ps-expandable {
          flex-direction: column;
          align-items: stretch;
          padding-bottom: 0;
        }
        .ps-card.ps-expandable .ps-left {
          padding: 12px;
        }
        .ps-right {
          padding: 12px;
        }

        .ps-expander {
          overflow: hidden;
          max-height: 0;
          transition: max-height 280ms cubic-bezier(0.2, 0.9, 0.3, 1),
            opacity 220ms ease;
          opacity: 0;
          padding: 0 12px;
        }
        .ps-card.ps-expandable.open .ps-expander {
          max-height: 420px;
          opacity: 1;
          padding: 12px;
        }
        .ps-expander-inner {
          border-top: 1px dashed var(--panel-border);
          padding-top: 12px;
        }

        .ps-card-col {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px;
          border: 1px solid var(--panel-border);
          border-radius: 10px;
          background: transparent;
        }

        .ps-session {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px;
          border: 1px solid var(--panel-border);
          border-radius: 10px;
          background: transparent;
        }
        .ps-session-actions {
          display: flex;
          gap: 8px;
        }

        .ps-blocked {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px;
          border-radius: 8px;
          border: 1px solid var(--panel-border);
        }
        .ps-block-input {
          margin-top: 8px;
          padding: 10px;
          border: 1px solid var(--panel-border);
          border-radius: 8px;
        }

        .ps-btn-primary {
          background: var(--accent);
          color: var(--text-primary);
          border: 1px solid var(--panel-border);
          padding: 8px 12px;
          border-radius: 8px;
          cursor: pointer;
        }
        .ps-btn-ghost {
          background: transparent;
          color: var(--text-secondary);
          border: 1px solid var(--panel-border);
          padding: 8px 10px;
          border-radius: 8px;
          cursor: pointer;
        }
        .ps-btn-secondary {
          background: transparent;
          color: var(--text-secondary);
          border: 1px solid var(--panel-border);
          padding: 6px 10px;
          border-radius: 8px;
          cursor: pointer;
        }
        .ps-btn-danger {
          background: transparent;
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.12);
          padding: 8px 10px;
          border-radius: 8px;
          cursor: pointer;
        }

        .ps-input {
          width: 100%;
          padding: 10px 12px;
          border-radius: 8px;
          border: 1px solid var(--panel-border);
          background: transparent;
          color: var(--text-primary);
        }
        .ps-field {
          display: block;
        }
        .ps-field-label {
          color: var(--text-tertiary);
          margin-bottom: 6px;
          font-size: 13px;
        }
        .ps-note {
          color: var(--text-tertiary);
          margin-top: 6px;
        }
        .ps-error {
          color: #ef4444;
          font-size: 13px;
          margin-top: 6px;
        }

        .inline-confirm {
          margin-top: 8px;
          padding: 10px;
          border: 1px dashed var(--panel-border);
          border-radius: 8px;
          background: transparent;
        }

        /* notifications preview */
        .notif-preview {
          display: flex;
          align-items: center;
          gap: 12px;
          border-radius: 10px;
          overflow: hidden;
          background: linear-gradient(
            90deg,
            rgba(${accentRgb}, 0.04),
            rgba(0, 0, 0, 0.02)
          );
          border: 1px solid var(--panel-border);
          padding: 8px;
          min-width: 320px;
          position: relative;
        }
        .notif-accent {
          width: 6px;
          height: 56px;
          background: linear-gradient(
            180deg,
            var(--accent),
            rgba(${accentRgb}, 0.6)
          );
          border-radius: 4px;
        }
        .notif-content {
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding-right: 8px;
        }
        .notif-title {
          font-weight: 600;
          color: var(--text-primary);
        }
        .notif-body {
          font-size: 13px;
          color: var(--text-secondary);
          max-width: 220px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .notif-pulse {
          position: absolute;
          right: 8px;
          top: 8px;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: rgba(${accentRgb}, 0.9);
          opacity: 0;
        }
        .notif-pulse.play {
          animation: notif-pulse 900ms ease;
        }
        @keyframes notif-pulse {
          0% {
            transform: scale(0.6);
            opacity: 1;
          }
          100% {
            transform: scale(2.4);
            opacity: 0;
          }
        }

        @media (max-width: 640px) {
          .ps-card,
          .ps-row,
          .ps-session,
          .ps-card-col {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }
          .ps-right {
            align-self: stretch;
            display: flex;
            justify-content: flex-end;
            width: 100%;
          }
          .notif-preview {
            min-width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
