import React, { useRef, useLayoutEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Reply, Pin, Clipboard } from "lucide-react";

const EMOJI_LIST = ["🦋", "💖", "🔥", "😂", "😴", "❤️", "💔", "👍", "👏", "🎉"];

const menuOptions = [
  { key: "reply", label: "Ответить", icon: <Reply size={20} /> },
  { key: "pin", label: "Закрепить", icon: <Pin size={20} /> },
  { key: "copy", label: "Копировать текст", icon: <Clipboard size={20} /> },
];

export default function BubbleContextMenu({
  open,
  anchor,
  msg,
  onAction,
  onEmoji,
  onClose,
}) {
  const menuRef = useRef(null);
  const [pos, setPos] = useState({ left: anchor?.x || 0, top: anchor?.y || 0 });

  // Обновить позицию, чтобы меню не выходило за края окна
  useLayoutEffect(() => {
    if (!open || !anchor) return;
    // Сначала показываем меню вне экрана, чтобы получить реальные размеры
    setPos({ left: -9999, top: -9999 });
    // Затем после рендера корректируем позицию
    requestAnimationFrame(() => {
      const menu = menuRef.current;
      if (menu) {
        const rect = menu.getBoundingClientRect();
        const vw = window.innerWidth,
          vh = window.innerHeight;
        let left = anchor.x,
          top = anchor.y;

        // Сдвиг вправо/вниз, если не влазит
        if (left + rect.width > vw - 8) {
          left = Math.max(vw - rect.width - 8, 8);
        }
        if (top + rect.height > vh - 8) {
          top = Math.max(vh - rect.height - 8, 8);
        }
        // Если слишком близко к левому/верхнему краю
        if (left < 8) left = 8;
        if (top < 8) top = 8;

        setPos({ left, top });
      }
    });
    // eslint-disable-next-line
  }, [open, anchor?.x, anchor?.y]);

  if (!open || !anchor || !msg) return null;

  // Анимация появления смайлов (каскад/подпрыгивают как в Telegram)
  const emojiVariants = {
    hidden: (i) => ({
      opacity: 0,
      y: 32,
      scale: 0.7,
      filter: "blur(2px)",
      transition: { delay: i * 0.018 },
    }),
    visible: (i) => ({
      opacity: 1,
      y: 0,
      scale: 1.15,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        stiffness: 700,
        damping: 22,
        mass: 0.5,
        delay: i * 0.018,
      },
    }),
    hover: {
      scale: 1.33,
      rotate: [0, 12, -8, 0],
      transition: { repeat: Infinity, duration: 0.55 },
    },
    tap: {
      scale: 0.94,
      rotate: 0,
    },
  };

  return (
    <div
      ref={menuRef}
      className="fixed z-[101]"
      style={{ left: pos.left, top: pos.top, pointerEvents: "auto" }}
      onMouseLeave={onClose}
      onContextMenu={(e) => e.preventDefault()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 10 }}
        className="flex flex-col gap-2"
      >
        {/* Живой emoji-бар */}
        <div className="flex gap-2 px-2 py-1 bg-[#252631] border border-[#23232a] rounded-2xl shadow-xl mb-1 justify-center min-w-[210px]">
          <AnimatePresence initial={false}>
            {EMOJI_LIST.map((emoji, i) => (
              <motion.button
                key={emoji}
                className="w-[28px] h-[28px] text-[22px] flex items-center justify-center rounded-xl bg-transparent outline-none transition-all select-none cursor-pointer"
                custom={i}
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={emojiVariants}
                whileHover="hover"
                whileTap="tap"
                style={{ marginLeft: i === 0 ? 0 : "-4px" }}
                tabIndex={-1}
                onMouseDown={(e) => e.preventDefault()}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onEmoji(emoji);
                  onClose();
                }}
                title={emoji}
              >
                {emoji}
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
        {/* Меню действий */}
        <div className="flex flex-col gap-0.5 py-3 px-0 bg-[#23232b] border border-[#23232a] rounded-2xl shadow-xl min-w-[170px]">
          {menuOptions.map((item) => (
            <button
              key={item.key}
              className="flex items-center gap-3 px-4 py-2 w-full text-left text-gray-200 hover:bg-[#23262f] transition rounded-xl"
              onMouseDown={(e) => e.preventDefault()}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onAction(item.key, msg);
                onClose();
              }}
              type="button"
            >
              <span className="opacity-90">{item.icon}</span>
              <span className="font-medium text-base">{item.label}</span>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
