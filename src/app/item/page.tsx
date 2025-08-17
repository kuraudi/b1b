"use client";
import React, { useState } from "react";
import Image from "next/image";
import {
  ShoppingCart,
  Heart,
  Star,
  Truck,
  RefreshCcw,
  Percent,
  Flame,
  ChevronLeft,
  ChevronRight,
  Check,
  MessageSquare,
  Store,
  Tag,
  ChevronRight as ChevronRightIcon,
  BadgeCheck,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

// --- Mock Data ---
const product = {
  id: 12345,
  name: "Станок лазерной резки PRO-5000",
  category: "Оборудование",
  breadcrumbs: [
    { title: "Главная", href: "/" },
    { title: "Оборудование", href: "/catalog/equipment" },
    { title: "Станок лазерной резки PRO-5000", href: "/product/12345" },
  ],
  images: [
    "/mock/product-1.jpg",
    "/mock/product-2.jpg",
    "/mock/product-3.jpg",
    "/mock/product-4.jpg",
  ],
  price: 1320000,
  oldPrice: 1580000,
  discount: 17,
  hit: true,
  tags: ["ХИТ", "СКИДКА"],
  rating: 4.8,
  reviewsCount: 27,
  questionsCount: 4,
  description:
    "Промышленный станок лазерной резки PRO-5000 – высокоточное современное оборудование для обработки металла и пластика. Подходит для производств любого масштаба. Гарантия 3 года. Бесплатная доставка по РФ.",
  specs: {
    "Мощность лазера": "5000 Вт",
    "Рабочая область": "1500x3000 мм",
    "Толщина реза (металл)": "до 22 мм",
    Питание: "380 В",
    Габариты: "4300x2300x1800 мм",
    Вес: "3300 кг",
    "Скорость реза": "до 60 м/мин",
    Производство: "Россия",
    Гарантия: "36 месяцев",
  },
  delivery: {
    text: "Бесплатная доставка по РФ до двери или ТК. Срок: 3-7 дней.",
    icon: <Truck className="w-5 h-5 text-[#8C7FF5]" aria-hidden />,
  },
  return: {
    text: "Возврат — 14 дней. Гарантия завода.",
    icon: <RefreshCcw className="w-5 h-5 text-[#8C7FF5]" aria-hidden />,
  },
  stock: 8,
  seller: {
    name: "ООО ПрофСтан",
    logo: "/mock/seller-logo.png",
    rating: 4.9,
    reviews: 120,
    link: "/seller/profstan",
    verified: true,
    location: "Москва",
  },
  similar: [
    {
      id: 222,
      name: "Гидравлический пресс HYDRO 2000",
      image: "/mock/similar-1.jpg",
      price: 950000,
      rating: 4.6,
      reviews: 19,
      discount: 12,
      hit: true,
    },
    {
      id: 223,
      name: "Фрезерный станок CNC-Master 400",
      image: "/mock/similar-2.jpg",
      price: 1780000,
      rating: 4.7,
      reviews: 8,
      discount: 0,
      hit: false,
    },
    {
      id: 224,
      name: "Комплектующая для лазерных станков ProCut",
      image: "/mock/similar-3.jpg",
      price: 45000,
      rating: 4.5,
      reviews: 32,
      discount: 0,
      hit: false,
    },
    {
      id: 225,
      name: "Лазерная головка RayTools BT240",
      image: "/mock/similar-4.jpg",
      price: 210000,
      rating: 4.8,
      reviews: 12,
      discount: 5,
      hit: false,
    },
  ],
};

const reviews = [
  {
    id: 1,
    user: { name: "Андрей И.", avatar: "/mock/u1.jpg" },
    date: "2025-07-10",
    rating: 5,
    text: "Отличный станок, соответствует описанию. Качественная сборка, быстро доставили. Уже внедрили в цеху, работает без нареканий.",
    advantages: "Скорость реза, качество, цена-качество.",
    disadvantages: "Тяжёлый, нужна погрузка краном.",
    sellerReply: "Спасибо за отзыв! Всегда рады помочь.",
  },
  {
    id: 2,
    user: { name: "ООО Альфа", avatar: "/mock/u2.jpg" },
    date: "2025-06-28",
    rating: 4,
    text: "Станок хороший, но доставка чуть задержалась из-за ТК. В остальном всё устраивает.",
    advantages: "Гарантия, поддержка продавца.",
    disadvantages: "Задержка доставки.",
    sellerReply: null,
  },
];

// --- Хелперы ---
const formatPrice = (p: number) =>
  p.toLocaleString("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  });

function getRatingColor(r: number) {
  if (r >= 4.7) return "text-green-500";
  if (r >= 4.2) return "text-amber-500";
  if (r >= 3.5) return "text-orange-400";
  return "text-red-400";
}

// --- Breadcrumbs ---
function Breadcrumbs({ items }: { items: { title: string; href: string }[] }) {
  return (
    <nav
      aria-label="Хлебные крошки"
      className="text-xs md:text-sm flex items-center gap-1 mb-4 text-[#9D8DF3]"
    >
      {items.map((item, i) => (
        <React.Fragment key={item.href}>
          <a
            href={item.href}
            className="hover:underline transition underline-offset-2"
            aria-current={i === items.length - 1 ? "page" : undefined}
          >
            {item.title}
          </a>
          {i !== items.length - 1 && (
            <ChevronRightIcon className="w-4 h-4 text-[#8C7FF5]" />
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}

// --- Галерея с анимацией ---
function ProductGallery({
  images,
  badge,
}: {
  images: string[];
  badge?: React.ReactNode;
}) {
  const [idx, setIdx] = useState(0);
  const prev = () => setIdx((i) => (i - 1 + images.length) % images.length);
  const next = () => setIdx((i) => (i + 1) % images.length);

  return (
    <div className="relative w-full aspect-[5/4] md:aspect-square rounded-3xl overflow-hidden bg-[#232136]">
      {badge && <div className="absolute left-4 top-4 z-10">{badge}</div>}
      <button
        onClick={prev}
        aria-label="Предыдущее фото"
        className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-[#8C7FF5]/90 rounded-full p-2 shadow-lg transition group"
        tabIndex={0}
      >
        <ChevronLeft className="w-6 h-6 text-[#8C7FF5] group-hover:text-white transition" />
      </button>
      <button
        onClick={next}
        aria-label="Следующее фото"
        className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-[#8C7FF5]/90 rounded-full p-2 shadow-lg transition group"
        tabIndex={0}
      >
        <ChevronRight className="w-6 h-6 text-[#8C7FF5] group-hover:text-white transition" />
      </button>
      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="w-full h-full absolute inset-0"
        >
          <Image
            src={images[idx]}
            alt={`Фото ${idx + 1}`}
            fill
            sizes="(max-width: 768px) 100vw, 550px"
            style={{ objectFit: "cover" }}
            draggable={false}
            priority={idx === 0}
            className="rounded-3xl select-none"
          />
        </motion.div>
      </AnimatePresence>
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {images.map((img, i) => (
          <button
            key={img}
            className={`w-14 h-12 border-2 rounded-lg overflow-hidden transition-all
              ${
                i === idx
                  ? "border-[#8C7FF5] scale-105"
                  : "border-transparent opacity-80 hover:border-[#8C7FF5]/60"
              }
            `}
            onClick={() => setIdx(i)}
            aria-label={`Показать фото ${i + 1}`}
            tabIndex={0}
          >
            <Image
              src={img}
              alt={`Миниатюра ${i + 1}`}
              width={56}
              height={48}
              className="object-cover w-full h-full"
              draggable={false}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

// --- Sticky block ---
function StickyPurchaseBlock({
  product,
  seller,
  isFavorite,
  toggleFavorite,
  buyHandler,
  addToCartHandler,
  isInCart,
}: {
  product: typeof product;
  seller: typeof product.seller;
  isFavorite: boolean;
  toggleFavorite: () => void;
  buyHandler: () => void;
  addToCartHandler: () => void;
  isInCart: boolean;
}) {
  return (
    <div className="w-full md:max-w-xs flex-shrink-0 md:sticky md:top-8 z-20">
      <div className="rounded-2xl bg-gradient-to-br from-[#232136] via-[#28253c] to-[#231d38] border-[#8C7FF5]/40 border-2 shadow-xl px-6 py-7 flex flex-col gap-5">
        <div className="flex items-center gap-2">
          <span className="text-3xl font-bold text-[#8C7FF5]">
            {formatPrice(product.price)}
          </span>
          {product.oldPrice && product.oldPrice > product.price && (
            <span className="text-base text-[#D8CFFD] line-through ml-2">
              {formatPrice(product.oldPrice)}
            </span>
          )}
          {product.discount ? (
            <span className="bg-[#F368A6]/90 text-white ml-2 px-2 py-1 rounded-lg font-bold flex items-center text-xs">
              <Percent className="w-4 h-4 inline-block mr-1" />-
              {product.discount}%
            </span>
          ) : null}
        </div>
        {product.stock > 0 ? (
          <span className="text-green-500 font-medium text-sm flex items-center gap-1">
            <Check className="w-4 h-4" />В наличии — {product.stock} шт.
          </span>
        ) : (
          <span className="text-red-600 font-medium text-sm flex items-center gap-1">
            Нет в наличии
          </span>
        )}
        <button
          className="w-full bg-gradient-to-tr from-[#8C7FF5] via-[#BFAAFF] to-[#8C7FF5] hover:from-[#BFAAFF] hover:to-[#8C7FF5] text-[#19123b] py-3 rounded-xl font-bold text-lg transition focus:ring-2 focus:ring-[#8C7FF5] flex items-center justify-center gap-2 mt-1"
          aria-label="Купить сейчас"
          onClick={buyHandler}
          disabled={product.stock === 0}
        >
          <Zap className="w-5 h-5" />
          Купить сейчас
        </button>
        <div className="flex gap-2">
          <button
            className={`flex-1 py-2 rounded-lg border-2 border-[#8C7FF5] text-[#8C7FF5] font-semibold hover:bg-[#8C7FF5]/10 focus:ring-2 focus:ring-[#8C7FF5] transition flex items-center justify-center gap-2 ${
              isInCart ? "bg-[#8C7FF5]/20 cursor-not-allowed" : ""
            }`}
            aria-pressed={isInCart}
            onClick={addToCartHandler}
            disabled={isInCart || product.stock === 0}
          >
            <ShoppingCart className="w-5 h-5" />
            {isInCart ? "В корзине" : "В корзину"}
          </button>
          <button
            className={`py-2 rounded-lg border-2 flex items-center justify-center gap-2 transition ${
              isFavorite
                ? "bg-[#8C7FF5]/10 text-[#8C7FF5] border-[#8C7FF5]"
                : "border-transparent text-[#BFAAFF]"
            } hover:bg-[#8C7FF5]/10 focus:ring-2 focus:ring-[#8C7FF5]`}
            aria-pressed={isFavorite}
            onClick={toggleFavorite}
          >
            <Heart
              className={`w-5 h-5 ${
                isFavorite ? "fill-[#8C7FF5] text-[#8C7FF5]" : "text-[#BFAAFF]"
              }`}
            />
            {isFavorite ? "В избранном" : "В избранное"}
          </button>
        </div>
        <div className="flex flex-col gap-2 mt-3">
          <div className="flex items-center gap-2 text-[#BFAAFF] text-sm">
            {product.delivery.icon}
            {product.delivery.text}
          </div>
          <div className="flex items-center gap-2 text-[#BFAAFF] text-sm">
            {product.return.icon}
            {product.return.text}
          </div>
        </div>
        <div className="my-4 h-px bg-[#8C7FF5]/30" />
        {/* Продавец */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-[#8C7FF5]/60 flex-shrink-0">
            <Image
              src={seller.logo}
              alt={seller.name}
              width={48}
              height={48}
              className="object-cover"
            />
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <a
              href={seller.link}
              className="text-[#8C7FF5] font-bold hover:underline truncate"
              aria-label={`Магазин продавца: ${seller.name}`}
            >
              {seller.name}
              {seller.verified && (
                <BadgeCheck
                  className="w-4 h-4 inline ml-1 text-green-500"
                  aria-label="Проверенный продавец"
                />
              )}
            </a>
            <span className="flex items-center gap-1 text-[#BFAAFF] text-xs">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className={getRatingColor(seller.rating)}>
                {seller.rating}
              </span>
              <span>({seller.reviews} отзывов)</span>
              <Store className="w-4 h-4 ml-2" aria-label="Локация" />
              {seller.location}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Tabs ---
function ProductTabs() {
  const [tab, setTab] = useState("description");
  return (
    <div className="mt-8 w-full max-w-4xl">
      <div className="flex gap-2 bg-[#232136]/70 p-1 rounded-xl border border-[#8C7FF5]/40">
        <button
          onClick={() => setTab("description")}
          className={`text-[#BFAAFF] font-medium px-4 py-2 rounded-lg transition flex items-center gap-1 ${
            tab === "description"
              ? "bg-[#8C7FF5] text-[#19123b]"
              : "hover:bg-[#8C7FF5]/10"
          }`}
        >
          <ShieldCheck className="w-4 h-4" /> Описание
        </button>
        <button
          onClick={() => setTab("specs")}
          className={`text-[#BFAAFF] font-medium px-4 py-2 rounded-lg transition flex items-center gap-1 ${
            tab === "specs"
              ? "bg-[#8C7FF5] text-[#19123b]"
              : "hover:bg-[#8C7FF5]/10"
          }`}
        >
          <ShieldCheck className="w-4 h-4" /> Характеристики
        </button>
        <button
          onClick={() => setTab("reviews")}
          className={`text-[#BFAAFF] font-medium px-4 py-2 rounded-lg transition flex items-center gap-1 ${
            tab === "reviews"
              ? "bg-[#8C7FF5] text-[#19123b]"
              : "hover:bg-[#8C7FF5]/10"
          }`}
        >
          <Star className="w-4 h-4" /> Отзывы
        </button>
        <button
          onClick={() => setTab("qna")}
          className={`text-[#BFAAFF] font-medium px-4 py-2 rounded-lg transition flex items-center gap-1 ${
            tab === "qna"
              ? "bg-[#8C7FF5] text-[#19123b]"
              : "hover:bg-[#8C7FF5]/10"
          }`}
        >
          <MessageSquare className="w-4 h-4" /> Вопросы и ответы
        </button>
      </div>
      <div className="py-6">
        {tab === "description" && (
          <div className="prose prose-invert max-w-none text-[#e6e5f7] text-lg">
            {product.description}
          </div>
        )}
        {tab === "specs" && <SpecsTable specs={product.specs} />}
        {tab === "reviews" && <ReviewsBlock />}
        {tab === "qna" && <QnABlock />}
      </div>
    </div>
  );
}

// --- Таб Характеристики ---
function SpecsTable({ specs }: { specs: Record<string, string> }) {
  return (
    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
      {Object.entries(specs).map(([key, value]) => (
        <div key={key} className="flex flex-col gap-0.5">
          <dt className="text-[#BFAAFF] text-sm">{key}</dt>
          <dd className="text-[#e6e5f7] text-base font-medium">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

// --- Отзывы ---
function ReviewsBlock() {
  return (
    <div className="flex flex-col gap-6">
      {reviews.length === 0 && (
        <div className="text-[#BFAAFF]/60 text-center">
          Отзывов пока нет — станьте первым, кто поделится впечатлением!
        </div>
      )}
      {reviews.map((r) => (
        <div
          key={r.id}
          className="rounded-xl border border-[#8C7FF5]/20 bg-gradient-to-br from-[#232136] to-[#28253b] px-5 py-4"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-full overflow-hidden">
              <Image
                src={r.user.avatar}
                alt={r.user.name}
                width={36}
                height={36}
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[#BFAAFF] font-medium truncate">
                {r.user.name}
              </div>
              <div className="text-xs text-[#8C7FF5]">
                {new Date(r.date).toLocaleDateString("ru-RU")}
              </div>
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    r.rating >= i ? "text-yellow-400" : "text-[#8C7FF5]/30"
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="text-[#e6e5f7] mb-2">{r.text}</div>
          <div className="flex flex-wrap gap-2 text-xs">
            {r.advantages && (
              <span className="bg-green-900/20 text-green-400 px-2 py-0.5 rounded-lg">
                + {r.advantages}
              </span>
            )}
            {r.disadvantages && (
              <span className="bg-red-900/20 text-red-400 px-2 py-0.5 rounded-lg">
                – {r.disadvantages}
              </span>
            )}
          </div>
          {r.sellerReply && (
            <div className="mt-3 bg-[#8C7FF5]/10 px-3 py-2 rounded-lg text-[#8C7FF5] text-sm flex items-start gap-2">
              <Store className="w-4 h-4 mt-0.5" />
              <div>
                <span className="font-medium">Ответ продавца:</span>{" "}
                {r.sellerReply}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// --- Таб Вопросы и ответы ---
function QnABlock() {
  return (
    <div className="flex flex-col gap-6">
      <div className="text-[#BFAAFF]/70">
        На данный момент вопросов по товару нет. Вы можете быть первым, кто
        задаст вопрос продавцу.
      </div>
      <button className="max-w-xs flex items-center gap-2 px-4 py-2 rounded-lg bg-[#8C7FF5]/10 text-[#8C7FF5] hover:bg-[#8C7FF5]/20 transition font-semibold">
        <MessageSquare className="w-4 h-4" />
        Задать вопрос продавцу
      </button>
    </div>
  );
}

// --- Блок похожих товаров ---
function SimilarProducts({ products }: { products: typeof product.similar }) {
  return (
    <section aria-label="Похожие товары" className="mt-16 mb-10">
      <h2 className="text-xl font-bold text-[#BFAAFF] mb-4 flex items-center gap-2">
        <Tag className="w-5 h-5 text-[#8C7FF5]" />
        Похожие товары
      </h2>
      <div className="w-full overflow-x-auto whitespace-nowrap">
        <div className="flex gap-7 min-w-[900px] md:min-w-0">
          {products.map((p) => (
            <div
              key={p.id}
              className="w-64 min-w-[220px] rounded-xl overflow-hidden border border-[#8C7FF5]/20 bg-gradient-to-br from-[#232136] to-[#28253b] hover:shadow-lg transition flex-shrink-0"
            >
              <div className="relative w-full aspect-[4/3]">
                <Image
                  src={p.image}
                  alt={p.name}
                  fill
                  className="object-cover"
                  sizes="220px"
                />
                {p.hit && (
                  <span className="absolute left-3 top-3 bg-[#8C7FF5] text-white font-bold px-2 py-1 text-xs rounded-xl shadow flex items-center gap-1">
                    <Flame className="w-3 h-3" /> ХИТ
                  </span>
                )}
                {p.discount ? (
                  <span className="absolute right-3 top-3 bg-[#F368A6] text-white px-2 py-1 text-xs rounded-xl shadow flex items-center gap-1">
                    <Percent className="w-3 h-3" />-{p.discount}%
                  </span>
                ) : null}
              </div>
              <div className="p-3 flex flex-col gap-1">
                <div className="text-base font-medium text-[#e6e5f7] line-clamp-2">
                  {p.name}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-lg text-[#8C7FF5] font-bold">
                    {formatPrice(p.price)}
                  </span>
                </div>
                <span className="flex items-center gap-1 text-xs text-[#BFAAFF]">
                  <Star className="w-4 h-4 text-yellow-400" />
                  {p.rating}
                  <span className="text-[#8C7FF5]">({p.reviews})</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// --- Главная страница карточки товара ---
export default function ProductPage() {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isInCart, setIsInCart] = useState(false);

  const handleBuy = () => setIsInCart(true);
  const handleAddToCart = () => setIsInCart(true);
  const handleToggleFavorite = () => setIsFavorite((v) => !v);

  const mainBadge = (
    <div className="flex flex-col gap-2">
      {product.hit && (
        <span className="bg-[#8C7FF5] text-white font-bold px-3 py-1 text-xs rounded-xl shadow animate-bounce flex items-center gap-1">
          <Flame className="w-4 h-4" />
          ХИТ
        </span>
      )}
      {product.discount ? (
        <span className="bg-[#F368A6] text-white px-3 py-1 text-xs rounded-xl shadow flex items-center gap-1">
          <Percent className="w-4 h-4" />-{product.discount}%
        </span>
      ) : null}
    </div>
  );

  return (
    <div className="bg-[#19123b] min-h-screen text-white pb-16">
      <div className="max-w-7xl mx-auto px-3 md:px-6 py-6">
        <Breadcrumbs items={product.breadcrumbs} />
        <div className="flex flex-col lg:flex-row gap-10">
          <div className="flex-1 min-w-0">
            <ProductGallery images={product.images} badge={mainBadge} />
          </div>
          <StickyPurchaseBlock
            product={product}
            seller={product.seller}
            isFavorite={isFavorite}
            toggleFavorite={handleToggleFavorite}
            buyHandler={handleBuy}
            addToCartHandler={handleAddToCart}
            isInCart={isInCart}
          />
        </div>
        <section className="mt-8 max-w-4xl">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-bold text-[#BFAAFF] flex items-center gap-2">
              {product.name}
              {product.tags.includes("СКИДКА") && (
                <span className="bg-[#F368A6]/90 text-white px-2 py-1 rounded-lg font-bold flex items-center gap-1 text-xs ml-2">
                  <Percent className="w-4 h-4" />
                  СКИДКА
                </span>
              )}
            </h1>
            <span className="flex items-center gap-2 text-[#8C7FF5] font-medium text-sm">
              <Star className="w-5 h-5 text-yellow-400" />
              <span className={getRatingColor(product.rating)}>
                {product.rating}
              </span>
              <a
                href="#reviews"
                className="text-[#8C7FF5] underline underline-offset-2 hover:text-[#BFAAFF] ml-2"
              >
                {product.reviewsCount} отзывов
              </a>
              <span className="mx-2">|</span>
              <a
                href="#qna"
                className="text-[#8C7FF5] underline underline-offset-2 hover:text-[#BFAAFF]"
              >
                {product.questionsCount} вопроса
              </a>
            </span>
          </div>
        </section>
        <ProductTabs />
        <SimilarProducts products={product.similar} />
      </div>
    </div>
  );
}
