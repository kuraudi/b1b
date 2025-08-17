import React from "react";
import { motion, AnimatePresence } from "framer-motion";

// SVG-галочки в стиле Telegram (фиолетовые)
function TelegramCheck({ color = "#bbaae9", style = {}, ...props }) {
  // Нарисована как в Telegram: скошенная, плавные концы
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      style={style}
      {...props}
      fill="none"
    >
      <motion.path
        d="M4 9.5L7.5 13L14 6"
        stroke={color}
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Анимация плавного появления второй галочки
export function TelegramCheckmarks({ read }) {
  return (
    <span className="inline-flex items-center ml-1 select-none" style={{ minWidth: 22, minHeight: 18 }}>
      <TelegramCheck color="#bbaae9" style={{ position: "absolute" }} />
      <AnimatePresence>
        {read && (
          <motion.span
            key="second"
            initial={{ x: -7, opacity: 0, scale: 0.7 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            exit={{ x: -7, opacity: 0, scale: 0.7 }}
            transition={{ type: "spring", stiffness: 400, damping: 24, duration: 0.22 }}
            style={{ position: "absolute", left: 7 }}
          >
            <TelegramCheck color="#bbaae9" />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}