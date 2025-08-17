import { useState, useRef, useEffect } from "react";
import { Play, Pause } from "lucide-react";

export default function VoiceMessage({ url, duration = 0, isOwn }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);

    audio.addEventListener("ended", onEnded);
    audio.addEventListener("timeupdate", onTimeUpdate);

    return () => {
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("timeupdate", onTimeUpdate);
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Ради волнистого индикатора сделаем 15 «полосок» разных высот
  const bumpsCount = 15;
  const heights = [30, 60, 40, 70, 20, 50, 70, 40, 60, 30, 50, 70, 40, 60, 30];

  // Прогресс воспроизведения в процентах
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      onClick={togglePlay}
      className={`
        cursor-pointer select-none flex items-center gap-3  rounded-2xl
        max-w-[280px]
        ${isOwn ? " text-[#121418]" : "bg-[#23232b] text-[#2fd4c6]"}
      `}
      title={isPlaying ? "Пауза" : "Воспроизвести"}
    >
      {/* Кнопка Play/Pause */}
      <button
        type="button"
        className={`
          flex items-center justify-center w-10 h-10 rounded-full
          ${isOwn ? "bg-[#1f3f3d]" : "bg-[#183d51]"}
          hover:bg-opacity-80 transition
        `}
      >
        {isPlaying ? <Pause size={20} /> : <Play size={20} />}
      </button>

      {/* Волны индикатора */}
      <div className="flex items-end overflow-hidden flex-1 h-8">
        {heights.map((h, i) => (
          <div
            key={i}
            style={{
              width: 4,
              height: `${h}%`,
              marginRight: i === bumpsCount - 1 ? 0 : 2,
              borderRadius: 2,
              backgroundColor: "#2fd4c6",
              opacity: progressPercent >= (i / bumpsCount) * 100 ? 1 : 0.3,
              transition: "opacity 0.2s linear",
            }}
          />
        ))}
      </div>

      {/* Таймер */}
      <span className="text-xs font-mono select-none min-w-[40px] text-right tabular-nums">
        {formatDuration(duration)}
      </span>

      {/* Сам аудио элемент */}
      <audio ref={audioRef} src={url} preload="metadata" />
    </div>
  );
}

// Форматирование времени из секунд в MM:SS
function formatDuration(seconds) {
  if (!seconds || isNaN(seconds)) return "--:--";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}
