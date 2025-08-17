import { Heart, Flame, Star, MessageSquare } from "lucide-react";

// product = {
//   image, title, subtitle, price, oldPrice, discount, stock,
//   features: [{icon,label}], materialImage, labels, rating, reviews, isFavorite
// }

export default function ProductCard({ product, onToggleFavorite }) {
  return (
    <div
      className={`
        relative flex flex-col rounded-2xl overflow-hidden shadow-[0_4px_32px_rgba(140,127,245,0.10)]
        bg-gradient-to-b from-[#232036] to-[#292932] border border-[#2D224A]/15
        min-w-[220px] h-[450]
        transition duration-200 hover:scale-[1.02] hover:shadow-[0_6px_38px_rgba(140,127,245,0.18)]
        cursor-pointer
      `}
    >
      {/* Top: Image and Overlay (70-80%) */}
      <div className="relative w-full" style={{ height: "72%" }}>
        {/* Main Image */}
        <img
          src={product.image}
          alt={product.title}
          className="object-cover w-full h-full select-none pointer-events-none"
          draggable={false}
        />
        {/* Heart */}
        <button
          className={`
            absolute top-3 right-3 bg-[#19123b]/70 p-2 rounded-full
            shadow-sm hover:bg-[#8C7FF5]/60 transition
            focus:outline-none focus:ring-2 focus:ring-[#8C7FF5] z-10
          `}
          tabIndex={-1}
          aria-label={
            product.isFavorite ? "Убрать из избранного" : "Добавить в избранное"
          }
          type="button"
          onClick={(e) => {
            e.preventDefault();
            onToggleFavorite?.();
          }}
        >
          <Heart
            className={`w-6 h-6 ${
              product.isFavorite
                ? "fill-[#8C7FF5] text-[#8C7FF5]"
                : "text-[#bfbddb]"
            }`}
          />
        </button>
        {/* Лейбл "Распродажа" */}
        {product.labels?.includes("Распродажа") && (
          <span className="absolute left-1/2 -translate-x-1/2 top-4 flex items-center gap-1 px-3 py-1 rounded-full font-nekstmedium text-xs bg-[#FF2E80] text-[#f6e6f7] shadow drop-shadow z-10">
            <Flame className="w-4 h-4" /> Распродажа
          </span>
        )}
        {/* overlay text (features and material) */}
        <div className="absolute left-5 top-[36px] z-10 flex flex-col gap-2">
          <div className="text-xs font-nekstregular text-[#bfaaff] mb-1">
            {product.subtitle}
          </div>
          {product.features?.map((f, i) => (
            <div
              key={i}
              className="flex items-center gap-2 text-[#e6e5f7] font-nekstregular text-xs"
            >
              <span className="w-4 h-4 flex items-center justify-center">
                {f.icon}
              </span>
              {f.label}
            </div>
          ))}
        </div>
        {/* Материал — bottom left */}
        {product.materialImage && (
          <div className="absolute left-5 bottom-6 w-14 h-14 rounded-xl border-2 border-[#bfaaff]/30 overflow-hidden bg-[#201d2a]">
            <img
              src={product.materialImage}
              alt="Материал"
              className="object-cover w-full h-full"
              draggable={false}
            />
          </div>
        )}
      </div>
      {/* Bottom: Price, name, stock, rating (20-30%) */}
      <div className="px-4 pt-3 pb-4 bg-transparent select-none flex flex-col flex-1">
        {/* Цена, старая цена, скидка */}
        <div className="flex items-baseline gap-2 mb-0.5">
          <span
            className="text-[22px] font-nekstmedium !text-[#6bbfec]  leading-none"
            style={{ color: "#e632c2" }}
          >
            {product.price}
          </span>
          {1 && (
            <span className="text-[14px] font-nekstregular text-[#9ba3b2] line-through opacity-60">
              {300}₽
            </span>
          )}
          {1 && (
            <span
              className="text-[16px] font-nekstmedium !text-[#6bbfec]"
              style={{ color: "#e632c2" }}
            >
              -87%
            </span>
          )}
        </div>

        {/* Остаток */}
        {1 && (
          <div className="mt-1 mb-1 text-[15px] font-nekstmedium !text-[#6bbfec]">
            2 шт осталось
          </div>
        )}
        <div
          className="text-[14px] font-nekstregular truncate text-[#c4c4c4] leading-5"
          style={{ color: "#c4c4c4" }}
        >
          {product.title}
        </div>

        {/* Название/подзаголовок */}
        <div className="text-[17px] font-nekstregular text-[#586F84] mb-2 leading-snug">
          {/* {product.subtitle} */}
        </div>

        {/* Рейтинг и отзывы */}
        <div className="flex items-center gap-[3px]">
          <Star className="w-4 h-4 text-[#FFB400]" />
          <span className="text-[15px] font-nekstmedium text-[#3F3F3F] mr-[10px]">
            {product.rating}
          </span>
          <MessageSquare className="w-4 h-4 text-[#757575]"></MessageSquare>
          <span className="text-[14px] font-nekstregular text-[#79889D]">
            {product.reviews} отзыв
            {product.reviews % 10 === 1 && product.reviews % 100 !== 11
              ? ""
              : product.reviews % 10 >= 2 &&
                product.reviews % 10 <= 4 &&
                (product.reviews % 100 < 10 || product.reviews % 100 >= 20)
              ? "а"
              : "ов"}
          </span>
        </div>
      </div>
    </div>
  );
}
