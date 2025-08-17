"use client";
import React, { useState } from "react";
import { useParams } from "next/navigation";
import {
  Star,
  Heart,
  ShoppingCart,
  MapPin,
  Building2,
  CheckCircle,
  Info,
  Tag,
  ArrowLeft,
  Share2,
  Eye,
  User,
  MessageSquare,
  ShieldCheck,
  Layers,
  Clock,
  Download,
  ChevronRight,
  Map as MapIcon,
  ChevronLeft,
} from "lucide-react";
import HeaderNav from "../components/common/HeaderNav";
import Footer from "../components/common/Footer";
import { motion, AnimatePresence } from "framer-motion";

// Цвета и тени для нового глянцевого, глубокого, футуристичного эффекта
const COLORS = {
  background: "bg-gradient-to-br from-[#181823] via-[#232136] to-[#231d38]",
  card: "bg-gradient-to-br from-[#232136]/60 via-[#1a1923]/70 to-[#15141c]/70 shadow-2xl border border-[#373263]/60",
  accent: "text-[#BFAAFF]",
  accentBg: "bg-gradient-to-tr from-[#8C7FF5] to-[#BFAAFF]",
  accentRing: "ring-2 ring-[#8C7FF5]/50",
  tag: "bg-gradient-to-tr from-[#232136] to-[#282069] text-[#BFAAFF]",
  button:
    "bg-gradient-to-tr from-[#8C7FF5] via-[#BFAAFF] to-[#8C7FF5] text-[#19123b] hover:brightness-110 transition-shadow shadow-md hover:shadow-xl",
  buttonSecondary:
    "bg-[#232136] text-[#8C7FF5] border border-[#8C7FF5] hover:bg-[#322c54] transition-shadow shadow",
  input:
    "bg-[#232136] border border-[#38325e] focus:ring-2 focus:ring-[#8C7FF5]/60 transition",
  glass: "backdrop-blur-md bg-[#232136]/70",
};

const shimmer =
  "animate-[shimmer_2.5s_linear_infinite] bg-[linear-gradient(90deg,#232136_25%,#8C7FF5_50%,#232136_75%)] bg-[length:300%_100%]";

// DEMO DATA (оставь как есть, только изменяй стили и эффекты)
const productDemo = {
  id: 1,
  title: "Станок лазерной резки PRO 2025",
  price: "1 500 000 ₽",
  image: "/main/catalog/id1.jpg",
  gallery: [
    "/main/catalog/id1.jpg",
    "/main/catalog/id2.jpg",
    "/main/catalog/id3.jpg",
  ],
  isFavorite: false,
  location: "Москва",
  mapCoords: [55.7558, 37.6173],
  company: {
    name: "ООО ПрофСтан",
    logo: "/main/catalog/id4.jpg",
    isVerified: true,
    rating: 4.9,
    reviews: 38,
    adsCount: 52,
    memberSince: "2021",
    phone: "+7 (495) 123-45-67",
    email: "info@profstan.ru",
  },
  category: "Оборудование",
  rating: 4.8,
  reviews: 12,
  views: 217,
  posted: "2025-07-10",
  tags: ["Новинка", "В наличии", "Топ продаж"],
  shortDescription:
    "Надёжный станок для быстрой и точной лазерной резки металлов. Современные технологии, высокая производительность, гарантия 3 года.",
  characteristics: [
    { name: "Мощность", value: "3.5 кВт" },
    { name: "Рабочая зона", value: "1500×3000 мм" },
    { name: "Макс. толщина реза", value: "16 мм" },
    { name: "Питание", value: "380 В" },
    { name: "Гарантия", value: "36 месяцев" },
    { name: "Год выпуска", value: "2025" },
  ],
  delivery: "Доставка по всей России, самовывоз, экспресс-доставка — 1-3 дня.",
  payment: "Безналичный расчёт, оплата по счёту, рассрочка.",
  documents: [
    { name: "Технический паспорт", url: "#" },
    { name: "Сертификат соответствия", url: "#" },
    { name: "Инструкция", url: "#" },
  ],
  fullDescription: `
    <p>Этот станок — новое поколение в мире лазерной обработки металлов. Уникальный лазерный источник обеспечивает высокую скорость резки и стабильное качество кромки даже при длительной эксплуатации.</p>
    <ul>
      <li>Полностью автоматизированная система подачи листа</li>
      <li>Интуитивный интерфейс на русском языке</li>
      <li>Система удалённого мониторинга</li>
      <li>Сервисная поддержка по всей РФ</li>
    </ul>
    <p class="mt-4">Идеально подходит для производств, где важны скорость и точность. Позволяет быстро перейти на современные стандарты промышленности 4.0.</p>
  `,
  techTable: [
    { label: "Габариты", value: "2200 × 4200 × 1800 мм" },
    { label: "Вес", value: "2 350 кг" },
    { label: "Скорость резки", value: "до 40 м/мин" },
    { label: "Программное обеспечение", value: "SmartCut 3.0" },
    { label: "Охлаждение", value: "водяное" },
    { label: "Производитель", value: "ProfStan" },
  ],
  similar: [
    {
      id: 2,
      title: "Станок лазерной резки Lite",
      price: "1 200 000 ₽",
      image: "/main/catalog/id2.jpg",
    },
    {
      id: 3,
      title: "Компактный лазер SmartCut",
      price: "950 000 ₽",
      image: "/main/catalog/id2.jpg",
    },
  ],
  comments: [
    {
      author: "Иван Петров",
      rating: 5,
      date: "2025-07-12",
      text: "Отличный станок, быстрая доставка и очень подробная инструкция. Рекомендую всем для производства!",
    },
    {
      author: "ТехноПлюс",
      rating: 4,
      date: "2025-07-13",
      text: "Понравился сервис компании. Станок полностью оправдал ожидания, но доставили с задержкой в 1 день.",
    },
  ],
};

export default function ProductPage() {
  const params = useParams();
  const product = productDemo;

  // Галерея: плавный fade+scale переход, glowy border при фокусе
  const [galleryIdx, setGalleryIdx] = useState(0);

  // Анимация кнопки "В избранное"
  const [favorite, setFavorite] = useState(product.isFavorite);

  // Цветные кнопки анимации нажатия
  const [addedToCart, setAddedToCart] = useState(false);

  return (
    <div className={`wrapper min-h-screen flex flex-col`}>
      <HeaderNav />
      {/* Page wrapper */}
      <div className="max-w-7xl w-full mx-auto px-4 flex-1 pb-20">
        <div className="py-8">
          {/* Назад, просмотры, дата */}
          <div className="mb-8 flex items-center gap-3 font-nekstregular text-[14px]">
            <a
              href="/catalog"
              className="flex items-center gap-1 text-[#BFAAFF] text-[18px] hover:underline font-nekstmedium"
            >
              <ArrowLeft className="w-4 h-4" /> К каталогу
            </a>
            <span className="ml-4 flex flex-1 items-center gap-4 justify-end text-[#7C7C92]">
              <span className="flex items-center gap-2">
                <Eye className="w-4 h-4" /> {product.views} просмотров
              </span>
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" /> Размещено: {product.posted}
              </span>
              <span>
                ID:{" "}
                <span className="font-bold text-[#8C7FF5]">{product.id}</span>
              </span>
            </span>
          </div>
          {/* Main flex block */}
          <div className="flex flex-col md:flex-row gap-12">
            {/* Галерея и продавец */}
            <div className="flex flex-col gap-6 md:w-5/12 w-full">
              {/* --- Gallery --- */}
              <motion.div
                className={`rounded-3xl overflow-hidden border-2 border-[#8C7FF5]/30 bg-[#16151f] aspect-[4/3] flex items-center justify-center shadow-[0_8px_64px_0_#8C7FF5]/10 relative group`}
                initial={{ opacity: 0, y: 30, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.4, type: "spring" }}
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={galleryIdx}
                    src={product.gallery[galleryIdx]}
                    alt={product.title}
                    className="object-contain w-full h-full transition-all duration-500"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.04 }}
                    transition={{ duration: 0.38 }}
                  />
                </AnimatePresence>
                {/* Prev/Next */}
                {product.gallery.length > 1 && (
                  <>
                    <button
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-[#232136]/80 hover:bg-[#8C7FF5] rounded-full shadow-lg border-2 border-[#8C7FF5]/40 transition group"
                      onClick={() =>
                        setGalleryIdx(
                          (i) =>
                            (i - 1 + product.gallery.length) %
                            product.gallery.length
                        )
                      }
                      aria-label="Предыдущее фото"
                    >
                      <ChevronLeft className="w-6 h-6 text-[#BFAAFF] group-hover:text-white" />
                    </button>
                    <button
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-[#232136]/80 hover:bg-[#8C7FF5] rounded-full shadow-lg border-2 border-[#8C7FF5]/40 transition group"
                      onClick={() =>
                        setGalleryIdx((i) => (i + 1) % product.gallery.length)
                      }
                      aria-label="Следующее фото"
                    >
                      <ChevronRight className="w-6 h-6 text-[#BFAAFF] group-hover:text-white" />
                    </button>
                  </>
                )}
                {/* Gallery dots */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                  {product.gallery.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setGalleryIdx(i)}
                      className={`w-3 h-3 rounded-full border border-[#8C7FF5] shadow-md transition-all duration-200 ${
                        galleryIdx === i
                          ? "bg-[#8C7FF5] scale-125"
                          : "bg-[#232136] hover:bg-[#8C7FF5]/40"
                      }`}
                      aria-label={`Показать фото ${i + 1}`}
                    />
                  ))}
                </div>
              </motion.div>
              <motion.div
                className="flex gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                {product.gallery.map((img, i) => (
                  <button
                    key={i}
                    className={`p-1 rounded-xl border-2 transition ${
                      galleryIdx === i
                        ? "border-[#8C7FF5] shadow-lg scale-105"
                        : "border-[#232136] bg-[#232136] hover:border-[#8C7FF5]/60"
                    }`}
                    onClick={() => setGalleryIdx(i)}
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-20 h-16 object-contain"
                    />
                  </button>
                ))}
              </motion.div>
              {/* Карта (заглушка) */}
              <motion.div
                className={`mt-2 flex items-center gap-2 rounded-xl px-4 py-3 font-nekstmedium text-[16px] shadow ${COLORS.glass} border border-[#373263]/50`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
              >
                <MapIcon className="w-5 h-5 text-[#8C7FF5]" />
                <span className="text-[#BFAAFF]">{product.location}</span>
                <a
                  href="#"
                  className="ml-auto text-[#8C7FF5] text-xs hover:underline flex items-center gap-1 font-nekstmedium text-[14px] "
                >
                  Открыть на карте <ChevronRight className="w-3 h-3" />
                </a>
              </motion.div>
              {/* Продавец */}
              <motion.div
                className={`${COLORS.card} bg-gradient-to-tl from-[#1d1d1d]/70 to-[#211e36]/60 rounded-2xl p-5 flex flex-col gap-4`}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.45 }}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={product.company.logo}
                    alt=""
                    className="w-14 h-14 object-cover rounded-xl border-2 border-[#8C7FF5] shadow-xl"
                  />
                  <div>
                    <div className="flex items-center gap-2 font-nekstmedium text-white text-lg">
                      {product.company.name}
                      {product.company.isVerified && (
                        <ShieldCheck
                          className="w-4 h-4 text-[#8C7FF5]"
                          title="Проверенный продавец"
                        />
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[#BFAAFF] text-sm font-nekstregular">
                      <Star className="w-4 h-4 text-[#FFD700]" />{" "}
                      {product.company.rating} ({product.company.reviews}{" "}
                      отзывов)
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#BFAAFF] font-nekstregular">
                  <Layers className="w-4 h-4" /> {product.company.adsCount}{" "}
                  объявлений
                  <span className="ml-4 flex items-center gap-1">
                    <Clock className="w-4 h-4" /> На сайте с{" "}
                    {product.company.memberSince} г.
                  </span>
                </div>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  whileHover={{
                    scale: 1.03,
                    boxShadow: "0px 8px 40px #8C7FF5",
                  }}
                  className={`${COLORS.button} font-nekstmedium py-2 rounded-lg mt-3 shadow-lg`}
                >
                  Написать продавцу
                </motion.button>
              </motion.div>
            </div>
            {/* Правая колонка: инфо и действия */}
            <motion.div
              className="flex-1 flex flex-col gap-8"
              initial={{ opacity: 0, x: 36 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, type: "spring" }}
            >
              {/* Теги и заголовок */}
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center gap-2">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`${COLORS.tag} px-4 py-1 rounded-full text-xs font-nekstmedium shadow-md`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h1 className="text-4xl font-nekstmedium text-white drop-shadow-xl">
                  {product.title}
                </h1>
                <div className="flex items-center gap-5 mt-2 flex-wrap">
                  <span className="text-[2rem] font-nekstmedium text-[#BFAAFF] drop-shadow-glow block bg-gradient-to-br from-[#4f4978] to-[#211b2e] rounded-[10px] px-[5px] ">
                    {product.price}
                  </span>
                  <span className="flex items-center gap-1 text-[#BFAAFF] font-nekstregular text-lg">
                    <MapPin className="w-5 h-5" /> {product.location}
                  </span>
                  <span className="flex items-center gap-1 text-[#BFAAFF] font-nekstregular text-lg">
                    <Building2 className="w-5 h-5" /> {product.company.name}
                  </span>
                  <span className="flex items-center gap-1 text-[#FFD700] font-nekstmedium text-lg">
                    <Star className="w-6 h-6" /> {product.rating}
                    <span className="ml-1 text-xs text-[#BFAAFF]">
                      ({product.reviews} отзывов)
                    </span>
                  </span>
                </div>
              </div>
              {/* Краткое описание */}
              <motion.div
                className="bg-gradient-to-br from-[#232136]/80 via-[#2B2259]/60 to-[#1f1f27]/60 rounded-xl p-6 font-nekstregular text-lg text-[#e7e6f1] shadow-xl border border-[#232136] leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {product.shortDescription}
              </motion.div>
              {/* Кнопки действий */}
              <div className="flex gap-5 mt-2 flex-wrap">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  whileHover={{
                    scale: 1.04,
                    boxShadow: "0px 8px 36px #8C7FF5",
                  }}
                  className={`${COLORS.button} font-nekstmedium px-8 py-3 rounded-xl text-lg shadow transition flex items-center gap-3 relative overflow-hidden`}
                  onClick={() => {
                    setAddedToCart(true);
                    setTimeout(() => setAddedToCart(false), 1100);
                  }}
                >
                  <ShoppingCart className="w-6 h-6" />
                  {addedToCart ? (
                    <motion.span
                      key="added"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      Добавлено!
                    </motion.span>
                  ) : (
                    "В корзину"
                  )}
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.05, borderColor: "#BFAAFF" }}
                  className={`${
                    COLORS.buttonSecondary
                  } font-nekstmedium px-7 py-3 rounded-xl text-lg flex items-center gap-2 transition border-2 ${
                    favorite ? "bg-[#8C7FF5]/10" : ""
                  }`}
                  aria-pressed={favorite}
                  onClick={() => setFavorite((f) => !f)}
                >
                  <Heart
                    className={`w-6 h-6 transition ${
                      favorite
                        ? "fill-[#8C7FF5] text-[#8C7FF5]"
                        : "text-[#BFAAFF]"
                    }`}
                  />
                  {favorite ? "В избранном" : "В избранное"}
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  whileHover={{ scale: 1.04, borderColor: "#BFAAFF" }}
                  className={`${COLORS.buttonSecondary} font-nekstmedium px-7 py-3 rounded-xl text-lg flex items-center gap-2 transition border-2`}
                >
                  <Share2 className="w-6 h-6" /> Поделиться
                </motion.button>
              </div>
              {/* Характеристики */}
              <div>
                <h2 className="font-nekstmedium text-2xl text-white mb-3 flex items-center gap-2 mt-6">
                  <Info className="w-6 h-6" /> Характеристики
                </h2>
                <div className="overflow-x-auto font-nekstmedium">
                  <div className="space-y-2">
                    {product.characteristics.map((row) => (
                      <motion.div
                        key={row.name}
                        className="bg-gradient-to-r from-[#232323]/70 to-[#302c4c]/80 rounded-[8px] flex justify-between w-full min-h-[38px] items-center px-[20px] text-lg transition shadow-sm"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.32 }}
                      >
                        <div className="text-[#BFAAFF] font-nekstmedium whitespace-nowrap">
                          {row.name}
                        </div>
                        <div className="text-[#e6e7f1]">{row.value}</div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
              {/* Описание полное */}
              <div>
                <h2 className="font-nekstmedium text-2xl rounded-lg text-white mb-3 flex items-center gap-2 mt-7">
                  <Tag className="w-6 h-6" /> Описание
                </h2>
                <div
                  className="prose prose-invert max-w-none font-nekstregular text-lg leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: product.fullDescription }}
                />
              </div>
            </motion.div>
          </div>
          {/* Ниже: tech, доставка, документы, похожие, отзывы */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Тех. параметры */}
            <motion.div
              className={`${COLORS.card} rounded-xl p-8 flex flex-col gap-1`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
            >
              <div className="font-nekstmedium text-xl mb-3 flex items-center gap-2">
                <Info className="w-5 h-5" /> Технические параметры
                <a
                  href="#"
                  className="ml-auto flex items-center gap-1 text-xs text-[#8C7FF5] hover:underline"
                >
                  <Download className="w-4 h-4" /> Скачать PDF
                </a>
              </div>
              <table className="w-full text-base font-nekstregular border-separate border-spacing-y-1">
                <tbody>
                  {product.techTable.map((row) => (
                    <tr key={row.label}>
                      <td className="py-1 pr-6 text-[#BFAAFF] whitespace-nowrap">
                        {row.label}
                      </td>
                      <td className="py-1 text-[#e6e7f1]">{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
            {/* Доставка и оплата */}
            <motion.div
              className={`${COLORS.card} rounded-xl p-8 flex flex-col gap-4`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <div className="font-nekstmedium text-xl flex items-center gap-2">
                <CheckCircle className="w-5 h-5" /> Доставка и оплата
              </div>
              <div>
                <span className="text-[#8C7FF5] font-nekstmedium">
                  Доставка:
                </span>
                <span className="ml-2 font-nekstregular text-[#e6e7f1]">
                  {product.delivery}
                </span>
              </div>
              <div>
                <span className="text-[#8C7FF5] font-nekstmedium">Оплата:</span>
                <span className="ml-2 font-nekstregular text-[#e6e7f1]">
                  {product.payment}
                </span>
              </div>
            </motion.div>
            {/* Документы */}
            <motion.div
              className={`${COLORS.card} rounded-xl p-8 flex flex-col gap-4`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15, duration: 0.5 }}
            >
              <div className="font-nekstmedium text-xl flex items-center gap-2 mb-2">
                <Info className="w-5 h-5" /> Документы
              </div>
              <ul className="flex flex-col gap-3 font-nekstregular">
                {product.documents.map((doc) => (
                  <li key={doc.name}>
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-[#8C7FF5] hover:underline"
                    >
                      <FileIcon doc={doc.name} /> {doc.name}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
            {/* Похожие товары */}
            <motion.div
              className={`${COLORS.card} rounded-xl p-8 flex flex-col gap-4`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.18, duration: 0.5 }}
            >
              <div className="font-nekstmedium text-xl flex items-center gap-2 mb-2">
                <Tag className="w-5 h-5" /> Похожие товары
              </div>
              <div className="grid grid-cols-1 gap-3">
                {product.similar.map((sim) => (
                  <a
                    href={`/product/${sim.id}`}
                    key={sim.id}
                    className="flex items-center gap-3 bg-gradient-to-r from-[#59595b]/30 to-[#272438]/80 rounded-lg p-3 hover:scale-[1.025] hover:bg-[#1f1b2d]/60 transition shadow"
                  >
                    <img
                      src={sim.image}
                      alt={sim.title}
                      className="w-16 h-14 object-contain rounded-md border border-[#232136]"
                    />
                    <div className="flex flex-col">
                      <span className="font-nekstmedium text-[#e6e7f1]">
                        {sim.title}
                      </span>
                      <span className="font-nekstregular text-[#8C7FF5]">
                        {sim.price}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </motion.div>
          </div>
          {/* Отзывы */}
          <motion.div
            className="mt-16 bg-gradient-to-br from-[#1f1f24]/50 via-[#262337]/60 to-[#15151d]/60 rounded-xl p-9 border-[1px] border-solid border-[#272727] shadow-2xl"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="font-nekstmedium text-2xl flex items-center gap-2 mb-8">
              <MessageSquare className="w-6 h-6" />
              Отзывы покупателей
              <span className="ml-2 text-[#8C7FF5] text-lg font-nekstregular">
                ({product.comments.length})
              </span>
            </div>
            {product.comments.length === 0 ? (
              <div className="text-[#BFAAFF] font-nekstregular">
                Нет отзывов. Будьте первым, кто оставит отзыв!
              </div>
            ) : (
              <ul className="flex flex-col gap-7">
                {product.comments.map((c, idx) => (
                  <li
                    key={idx}
                    className="flex flex-col gap-1 bg-gradient-to-tr from-[#1b1a26]/80 to-[#232136]/60 rounded-lg p-5 border border-[#232136]/40 shadow"
                  >
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      <span className="font-nekstmedium text-white">
                        {c.author}
                      </span>
                      <span className="ml-2 flex items-center gap-1 text-[#FFD700] font-nekstmedium">
                        <Star className="w-5 h-5" /> {c.rating}
                      </span>
                      <span className="ml-2 text-xs text-[#7C7C92]">
                        {c.date}
                      </span>
                    </div>
                    <div className="font-nekstregular text-[#e6e7f1] text-lg">
                      {c.text}
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {/* Форма отзыва */}
            <form className="mt-10 flex flex-col gap-5">
              <div className="font-nekstmedium text-xl text-white">
                Оставить отзыв
              </div>
              <textarea
                className={`${COLORS.input} rounded-lg p-4 text-base font-nekstregular text-white border border-[#505050] focus:ring-2 border-solid outline-none resize-none`}
                rows={4}
                placeholder="Ваш отзыв..."
              />
              <motion.button
                whileTap={{ scale: 0.97 }}
                whileHover={{ scale: 1.03, boxShadow: "0px 6px 30px #8C7FF5" }}
                className={`${COLORS.button} font-nekstmedium px-7 py-3 rounded-lg text-lg w-fit shadow`}
              >
                Отправить
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function FileIcon({ doc }: { doc: string }) {
  if (doc.toLowerCase().includes("паспорт"))
    return <Info className="w-5 h-5" />;
  if (doc.toLowerCase().includes("сертификат"))
    return <CheckCircle className="w-5 h-5" />;
  if (doc.toLowerCase().includes("инструкция"))
    return <Tag className="w-5 h-5" />;
  return <Info className="w-5 h-5" />;
}
