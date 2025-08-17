import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic } from "lucide-react";

// --- Неоновая волна при записи ---
function VoiceWaveAnimation() {
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      animate={{
        scale: [1, 1.18, 1],
        opacity: [0.7, 1, 0.7],
      }}
      transition={{
        repeat: Infinity,
        duration: 1.1,
        ease: "easeInOut",
      }}
    >
      <div className="rounded-full border-4 border-[#ff5555] opacity-50 w-14 h-14" />
      <motion.div
        className="absolute"
        animate={{
          scale: [1, 1.07, 1],
          opacity: [0.4, 0.8, 0.4],
        }}
        transition={{
          repeat: Infinity,
          duration: 1.1,
          ease: "easeInOut",
        }}
      >
        <div className="rounded-full border-2 border-[#ff8c6f] w-10 h-10 opacity-60" />
      </motion.div>
    </motion.div>
  );
}

export default function VoiceRecorderButton({
  isRecording,
  recordingTime,
  onStart,
  onStop,
  mediaRecorder,
}) {
  // Формат времени 00:00
  function formatTime(s) {
    return (
      String(Math.floor(s / 60)).padStart(2, "0") +
      ":" +
      String(s % 60).padStart(2, "0")
    );
  }

  return (
    <div
      className="flex items-center gap-4 w-full justify-center py-2"
      style={{ minHeight: 72 }}
    >
      {/* Кнопка записи */}
      <motion.button
        whileTap={{ scale: 0.93 }}
        whileHover={{ scale: isRecording ? 1 : 1.04 }}
        className={`relative rounded-full transition-all duration-200 flex items-center justify-center shadow-lg ${
          isRecording
            ? "bg-gradient-to-tr from-[#ff5555] to-[#ff8c6f] text-white shadow-[0_0_0_6px_#ff555550]"
            : "bg-[#232b32] text-[#2fd4c6] hover:bg-gradient-to-tr hover:from-[#2fd4c6] hover:to-[#191b1f] hover:text-white"
        }`}
        title={isRecording ? "Стоп запись" : "Голосовое"}
        onClick={isRecording ? onStop : onStart}
        style={{
          minWidth: 54,
          minHeight: 54,
          boxShadow: isRecording ? "0 0 12px #ff5555" : "0 2px 12px #191b1f30",
          outline: isRecording ? "3px solid #ff5555" : "none",
        }}
        disabled={isRecording && !mediaRecorder}
      >
        <Mic size={30} />
        {isRecording && <VoiceWaveAnimation />}
      </motion.button>

      {/* Таймер и кнопка Стоп — плавное появление справа от кнопки */}
      <AnimatePresence>
        {isRecording && (
          <motion.div
            key="timer"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ type: "spring", stiffness: 240, damping: 24 }}
            className="flex items-center gap-3"
          >
            <span
              style={{
                fontWeight: 700,
                fontSize: 22,
                color: "#ff5555",
                textShadow: "0 0 8px #ff5555a0",
                letterSpacing: "0.03em",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {formatTime(recordingTime)}
            </span>
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 200, damping: 16 }}
              style={{
                background:
                  "linear-gradient(135deg, #ff5555 60%, #ff8c6f 100%)",
                color: "#fff",
                border: "none",
                borderRadius: "9999px",
                padding: "0.6em 1.3em",
                fontWeight: 700,
                fontSize: 17,
                boxShadow: "0 2px 14px #ff8c6f33",
                cursor: "pointer",
                outline: "none",
                userSelect: "none",
              }}
              onClick={onStop}
              aria-label="Остановить запись"
            >
              Стоп
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
