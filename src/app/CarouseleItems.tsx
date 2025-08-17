"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";

const carouselItems = [
  {
    title: "Бесплатная консультация по автоматизации",
    desc: "Запишитесь на демо и получите цепочку полезных шаблонов.",
    image: "/main/carousel/1.jpg",
    link: "/promo/automation",
  },
  {
    title: "Выгода для новых клиентов",
    desc: "Скидка 15% на первые три заказа в вашей отрасли.",
    image: "/main/carousel/2.png",
    link: "/promo/welcome",
  },
  {
    title: "ТОП-5 трендов B2B 2025",
    desc: "Актуальные решения и кейсы — бесплатный гайд для скачивания.",
    image: "/main/carousel/3.jpg",
    link: "/articles/trends",
  },
];

export default function CatalogPromoCarousel() {
  const [idx, setIdx] = useState(0);
  const [prevIdx, setPrevIdx] = useState(0);
  const [animating, setAnimating] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      const nextIdx = (idx + 1) % carouselItems.length;

      setPrevIdx(idx);
      setAnimating(true);

      // Обновляем индекс с задержкой для триггера анимации
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIdx(nextIdx);
        });
      });
    }, 5000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [idx]);

  useEffect(() => {
    if (!animating) return;
    const id = setTimeout(() => setAnimating(false), 600); // длительность анимации
    return () => clearTimeout(id);
  }, [animating]);

  return (
    <div className="w-full mt-[25px] rounded-2xl shadow-2xl overflow-hidden relative h-[400px] flex items-stretch bg-[#191123]">
      <div className="relative w-full h-full" style={{ perspective: 1000 }}>
        {[prevIdx, idx].map((slideIdx, i) => {
          const isPrev = i === 0;

          let classes =
            "absolute inset-0 w-full h-full transition-transform duration-600 ease-in-out will-change-transform";

          if (animating) {
            classes += isPrev
              ? " translate-x-0 z-20 animate-slide-left" // старый слайд уезжает влево
              : " translate-x-full z-30 animate-slide-in"; // новый слайд въезжает справа налево
          } else {
            classes += isPrev ? " hidden" : " translate-x-0 z-30";
          }

          return (
            <div
              key={`${slideIdx}-${isPrev ? "prev" : "curr"}`}
              className={classes}
              aria-hidden={isPrev && !animating}
            >
              <Image
                src={carouselItems[slideIdx].image}
                alt={carouselItems[slideIdx].title}
                fill
                style={{ objectFit: "cover" }}
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={slideIdx === 0}
                draggable={false}
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to right,rgba(0,0,0,0.85) 0%,rgba(0,0,0,0.85) 50%,rgba(0,0,0,0) 100%)",
                  zIndex: 1,
                }}
              />
              <div className="relative z-10 w-full sm:w-1/2 flex flex-col justify-center px-8 py-10 sm:py-16 h-full">
                <div className="font-nekstmedium text-[1.6rem] sm:text-[2.2rem] mb-4 text-[#a677ee]">
                  {carouselItems[slideIdx].title}
                </div>
                <div className="text-[#e4e4ea] mb-7 text-base sm:text-lg font-nekstregular max-w-[450px]">
                  {carouselItems[slideIdx].desc}
                </div>
                <a
                  href={carouselItems[slideIdx].link}
                  className="flex items-center justify-center py-3 rounded-xl bg-[#8C7FF5] text-white font-nekstmedium shadow-lg hover:bg-[#a677ee] active:scale-95 transition"
                >
                  Подробнее
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Навигация */}
      <div className="absolute bottom-6 left-8 sm:left-1/2 sm:-translate-x-1/2 flex gap-2 z-20">
        {carouselItems.map((_, i) => (
          <button
            key={i}
            className={`w-3.5 h-3.5 rounded-full transition-all duration-200 border-2 ${
              i === idx
                ? "bg-[#a677ee] border-[#a677ee] scale-125 shadow-xl"
                : "bg-[#b0bbd6]/40 border-[#232136]"
            }`}
            onClick={() => {
              setPrevIdx(idx);
              setIdx(i);
              setAnimating(true);
            }}
            aria-label={`Перейти к промо-карточке ${i + 1}`}
          />
        ))}
      </div>

      <style jsx>{`
        .animate-slide-left {
          transform: translateX(-100%);
          transition: transform 0.6s ease-in-out;
        }
        .animate-slide-in {
          transform: translateX(0%);
          transition: transform 0.6s ease-in-out;
        }
      `}</style>
    </div>
  );
}
