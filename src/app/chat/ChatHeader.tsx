import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  Phone,
  Video,
  LayoutGrid,
  MoreVertical,
  ShieldOff,
  Bell,
  BellOff,
  Star,
  StarOff,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ChatHeader({
  activeChat,
  USERS,
  setSideSearchOpen,
  openUserProfile,
  onBlockUser, // функция для блокировки пользователя (см ниже)
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [notifEnabled, setNotifEnabled] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  const moreBtnRef = useRef(null);

  // Закрыть меню по клику вне
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        menuOpen &&
        moreBtnRef.current &&
        !moreBtnRef.current.contains(e.target)
      ) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  // Блокировка пользователя
  function handleBlock() {
    setIsBlocked(true);
    setMenuOpen(false);
    if (onBlockUser) onBlockUser(activeChat.id);
  }

  // Включить/выключить уведомления
  function handleToggleNotif() {
    setNotifEnabled((v) => !v);
    setMenuOpen(false);
  }

  // В избранное
  function handleToggleFavorite() {
    setIsFavorite((v) => !v);
    setMenuOpen(false);
  }

  // Инфо о чате
  function handleInfo() {
    setInfoOpen(true);
  }

  // Закрыть инфо
  function closeInfo() {
    setInfoOpen(false);
  }

  return (
    <header className="h-16 px-8 flex items-center border-b border-[#1f2227] bg-gradient-to-br from-[#1a191d] via-[#1b1a21] to-[#181818] flex-shrink-0">
      <div className="flex items-center flex-1">
        <img
          src={activeChat.avatar}
          className="w-9 h-9 rounded-full border-2 border-[#2fd4c6]/40 cursor-pointer"
          alt={activeChat.name}
          onClick={() => openUserProfile(USERS[0])}
        />
        <div className="ml-3">
          <span
            className="text-[#f2f6f6] font-bold text-[17px] cursor-pointer hover:underline"
            onClick={() => openUserProfile(USERS[0])}
          >
            {activeChat.name}
          </span>
          <div className="text-xs text-[#99c2c2] font-semibold mt-0.5">
            {isBlocked ? (
              <span className="text-[#ee7e87] font-bold">Заблокирован</span>
            ) : (
              <>был(а) {USERS[0].lastSeen}</>
            )}
          </div>
        </div>
        {isFavorite && (
          <Star size={18} className="text-[#f8d14e] ml-3" title="В избранном" />
        )}
      </div>
      {/* header actions */}
      <div className="flex items-center gap-5">
        <button
          className="text-[#7a8b95] hover:text-[#2fd4c6] transition"
          onClick={() => setSideSearchOpen(true)}
          title="Поиск по сообщениям"
          disabled={isBlocked}
        >
          <Search size={22} />
        </button>
        <button
          className="text-[#7a8b95] hover:text-[#2fd4c6] transition"
          onClick={() => alert("Звонок...")}
          title="Звонок"
          disabled={isBlocked}
        >
          <Phone size={22} />
        </button>
        <button
          className="text-[#7a8b95] hover:text-[#2fd4c6] transition"
          onClick={() => alert("Видеозвонок...")}
          title="Видеозвонок"
          disabled={isBlocked}
        >
          <Video size={22} />
        </button>
        <button
          className="text-[#7a8b95] hover:text-[#2fd4c6] transition"
          onClick={handleInfo}
          title="Информация о чате"
        >
          <LayoutGrid size={22} />
        </button>
        {/* More menu */}
        <div className="relative" ref={moreBtnRef}>
          <button
            className="text-[#7a8b95] hover:text-[#2fd4c6] transition"
            onClick={() => setMenuOpen((v) => !v)}
            title="Еще"
          >
            <MoreVertical size={22} />
          </button>
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 18, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.98 }}
                className="absolute right-0 top-full mt-2 z-30 bg-[#23232b] border border-[#23242d] rounded-2xl shadow-xl py-2 px-0 min-w-[200px]"
              >
                <button
                  className="flex items-center gap-3 px-5 py-2 w-full text-left text-[#ee7e87] hover:bg-[#23262f] transition rounded-xl"
                  onClick={handleBlock}
                  disabled={isBlocked}
                >
                  <ShieldOff size={18} className="opacity-90" />
                  <span className="font-medium text-base">
                    {isBlocked ? "Пользователь заблокирован" : "Заблокировать"}
                  </span>
                </button>
                <button
                  className="flex items-center gap-3 px-5 py-2 w-full text-left text-gray-200 hover:bg-[#23262f] transition rounded-xl"
                  onClick={handleToggleNotif}
                >
                  {notifEnabled ? (
                    <Bell size={18} className="opacity-90" />
                  ) : (
                    <BellOff size={18} className="opacity-90" />
                  )}
                  <span className="font-medium text-base">
                    {notifEnabled
                      ? "Отключить уведомления"
                      : "Включить уведомления"}
                  </span>
                </button>
                <button
                  className="flex items-center gap-3 px-5 py-2 w-full text-left text-gray-200 hover:bg-[#23262f] transition rounded-xl"
                  onClick={handleToggleFavorite}
                >
                  {isFavorite ? (
                    <StarOff size={18} className="opacity-90" />
                  ) : (
                    <Star size={18} className="opacity-90" />
                  )}
                  <span className="font-medium text-base">
                    {isFavorite ? "Убрать из избранного" : "В избранное"}
                  </span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      {/* Info modal/popover */}
      <AnimatePresence>
        {infoOpen && (
          <motion.div
            initial={{ opacity: 0, y: -14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -14, scale: 0.98 }}
            className="fixed left-1/2 top-28 z-50 bg-[#23232b] rounded-2xl border border-[#23242d] shadow-2xl p-6 min-w-[320px] max-w-xs"
            style={{ transform: "translateX(-50%)" }}
          >
            <div className="flex items-center gap-3 mb-3">
              <img
                src={activeChat.avatar}
                className="w-12 h-12 rounded-full border-2 border-[#2fd4c6]/40"
                alt={activeChat.name}
              />
              <div>
                <div className="font-bold text-[18px] text-[#f2f6f6]">
                  {activeChat.name}
                </div>
                <div className="text-xs text-[#99c2c2] font-semibold mt-1">
                  {activeChat.about || "Описание чата"}
                </div>
              </div>
            </div>
            <div className="text-[#d0d5db] text-sm mb-2">
              <b>Участники:</b>{" "}
              {activeChat.participants
                ? activeChat.participants
                    .map((u) => u.name)
                    .filter(Boolean)
                    .join(", ")
                : "нет данных"}
            </div>
            <button
              className="mt-3 w-full bg-[#9556d4] hover:bg-[#2fd4c6] transition text-white font-bold py-2 rounded-xl"
              onClick={closeInfo}
            >
              Закрыть
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
