"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Heart,
  Trash2,
  Package,
  Plus,
  Minus,
  ShoppingCart,
  Star,
  X,
  Sparkles,
} from "lucide-react";
import HeaderNav from "../components/common/HeaderNav";
import Footer from "../components/common/Footer";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// --- Modal component, стиль как в "Корзина" ---
type ModalProps = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
};
const Modal: React.FC<ModalProps> = ({ open, onClose, children, title }) => {
  if (!open) return null;
  return (
    <div className="fixed z-[9999] inset-0 bg-gradient-to-br from-[#1d1a24]/90 via-[#23222a]/85 to-[#211837]/80 backdrop-blur-[2.5px] flex items-center justify-center animate-fadeInCartModal">
      <div className="relative rounded-3xl p-8 bg-gradient-to-br from-[#29283b]/97 via-[#21202a]/97 to-[#231c31]/98 shadow-[0_10px_48px_0_#18171c77] border border-[#a677ee] w-[95vw] max-w-md transition-all duration-300 animate-fadeInCartModal">
        <button
          className="absolute top-5 right-6 text-white hover:text-[#FF3A3A] rounded-full p-1 transition"
          onClick={onClose}
          aria-label="Закрыть"
        >
          <X className="w-7 h-7" />
        </button>
        {title && (
          <div className="text-xl mb-3 font-nekstmedium text-[#bcb7e5] flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-[#a677ee] animate-spin-slow" />
            {title}
          </div>
        )}
        {children}
      </div>
      <style jsx global>{`
        @keyframes fadeInCartModal {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }
        .animate-fadeInCartModal {
          animation: fadeInCartModal 0.43s cubic-bezier(0.77, 0, 0.175, 1);
        }
        .animate-spin-slow {
          animation: spin 2.6s linear infinite;
        }
      `}</style>
    </div>
  );
};

// --- Skeleton Loader ---
const FavoritesSkeleton = () => (
  <div className="flex flex-col gap-7">
    {[...Array(2)].map((_, i) => (
      <div
        key={i}
        className="flex gap-5 items-center bg-gradient-to-br from-[#29283b]/90 via-[#23222a]/80 to-[#231c31]/90 rounded-2xl border border-[#a677ee] shadow-lg p-5 relative animate-pulse"
      >
        <div className="bg-[#29245b] w-28 h-28 rounded-2xl"></div>
        <div className="flex-1 flex flex-col gap-3">
          <div className="bg-[#29245b] h-6 w-2/3 rounded"></div>
          <div className="bg-[#29245b] h-4 w-1/4 rounded"></div>
          <div className="bg-[#29245b] h-4 w-1/2 rounded"></div>
          <div className="flex gap-4 mt-2">
            <div className="bg-[#29245b] h-8 w-24 rounded"></div>
            <div className="bg-[#29245b] h-8 w-20 rounded"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

// --- Mini Fav Summary for Mobile ---
const MobileFavSummary: React.FC<{ total: number; count: number }> = ({
  total,
  count,
}) => (
  <div className="fixed bottom-0 left-0 w-full z-40 block md:hidden bg-gradient-to-tr from-[#211837] to-[#a677ee] px-5 py-3 flex items-center justify-between shadow-2xl">
    <span className="flex gap-2 items-center text-[#fff] font-nekstmedium">
      <Heart className="w-6 h-6" />
      {count} поз. — {total.toLocaleString("ru-RU")} ₽
    </span>
    <a
      href="#fav-summary"
      className="bg-[#fff] text-[#231c31] rounded-xl px-4 py-2 shadow font-nekstmedium transition hover:bg-[#BFAAFF]"
    >
      Подробнее
    </a>
  </div>
);

// --- Favorite Item Card (стиль как в корзине, другой крестик) ---
type FavoriteItem = (typeof initialFavorites)[0];
type FavoriteItemCardProps = {
  item: FavoriteItem;
  onRemove: () => void;
  onChangeQty: (delta: number) => void;
  onToCart: () => void;
  onFavorite: () => void;
  disableDecrement: boolean;
};
const FavoriteItemCard: React.FC<FavoriteItemCardProps> = ({
  item,
  onRemove,
  onChangeQty,
  onToCart,
  onFavorite,
  disableDecrement,
}) => (
  <div className="flex flex-col sm:flex-row gap-5 items-center bg-gradient-to-br from-[#29283b]/90 via-[#23222a]/80 to-[#231c31]/90 rounded-2xl border border-[#a677ee] shadow-lg p-5 relative group transition hover:scale-[1.012]">
    <img
      src={item.image}
      alt={item.title}
      className="w-28 h-28 rounded-2xl object-cover border-2 border-[#a677ee] shadow-lg"
    />
    {/* info block */}
    <div className="flex flex-col flex-1 min-w-0 order-2 sm:order-none">
      <div className="flex gap-2 items-center">
        <span className="text-lg font-nekstmedium text-white line-clamp-1">
          {item.title}
        </span>
        {item.tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-0.5 rounded-full text-xs font-nekstmedium bg-gradient-to-tr from-[#232136] to-[#a677ee] text-[#dbb8ff] font-semibold shadow ml-1"
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="text-xs text-[#bcb7e5] font-nekstregular mt-1">
        {item.vendor}
      </div>
      <div className="flex gap-2 mt-2 mb-1">
        <span
          className={`text-xs font-nekstmedium ${
            item.inStock ? "text-[#36cb7f]" : "text-[#FF3A3A]"
          }`}
        >
          {item.inStock ? "В наличии" : "Нет в наличии"}
        </span>
        <span className="flex items-center gap-1 text-xs text-[#FFD700] font-nekstmedium ml-2">
          <Star className="w-4 h-4" />
          {item.rating}
        </span>
      </div>
      <div className="flex items-center gap-4 mt-1">
        <span className="text-xl font-nekstmedium text-[#a677ee]">
          {formatPrice(item.price)}
        </span>
        <button
          className="ml-1 p-2 rounded-full bg-[#232136] border border-[#a677ee] hover:bg-[#a677ee]/20 transition"
          title="Быстро добавить в корзину"
          onClick={onToCart}
        >
          <ShoppingCart className="w-5 h-5 text-[#a677ee]" />
        </button>
        <button
          className="ml-1 p-2 rounded-full bg-[#232136] border border-[#a677ee] hover:bg-[#a677ee]/20 transition"
          title="Оставить в избранном"
          onClick={onFavorite}
        >
          <Heart className="w-5 h-5 text-[#a677ee]" />
        </button>
      </div>
      <div className="flex items-center gap-1 mt-3">
        <button
          className="bg-[#232136] border border-[#a677ee] text-[#a677ee] px-2 py-1 rounded-lg hover:bg-[#a677ee]/10 transition font-nekstmedium"
          onClick={() => {
            if (item.quantity <= 1) {
              onRemove();
            } else {
              onChangeQty(-1);
            }
          }}
          title={
            item.quantity <= 1
              ? "Удалить из избранного"
              : "Уменьшить количество"
          }
          tabIndex={0}
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="px-3 py-1 rounded-lg bg-[#232136] text-white font-nekstmedium text-base border border-[#232136]">
          {item.quantity}
        </span>
        <button
          className="bg-[#232136] border border-[#a677ee] text-[#a677ee] px-2 py-1 rounded-lg hover:bg-[#a677ee]/10 transition font-nekstmedium"
          onClick={() => onChangeQty(1)}
          title="Увеличить количество"
          tabIndex={0}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
    {/* remove absolute top-right */}
    <button
      className="absolute top-4 right-4 bg-[#211837]/80 p-2 rounded-full border-2 border-[#a677ee] shadow hover:bg-[#FF3A3A]/25 hover:border-[#FF3A3A] transition"
      onClick={onRemove}
      title="Удалить из избранного"
    >
      <X className="w-5 h-5 text-[#FF3A3A] drop-shadow" />
    </button>
  </div>
);

// --- Recommend block ---
const recommendations = [
  {
    id: "r1",
    title: "Промышленный пылесос",
    price: 24000,
    image: "/main/catalog/id6.jpg",
    vendor: "CleanTech",
    rating: 4.5,
  },
  {
    id: "r2",
    title: "Фильтр для грануляторов",
    price: 8500,
    image: "/main/catalog/id7.jpg",
    vendor: "ФильтрПром",
    rating: 4.3,
  },
  {
    id: "r3",
    title: "Гидравлическое масло 20л",
    price: 5600,
    image: "/main/catalog/id8.jpg",
    vendor: "OilPro",
    rating: 4.7,
  },
];
const RecommendBlock = ({
  onAddToCart,
}: {
  onAddToCart: (item: (typeof recommendations)[0]) => void;
}) => (
  <div className="w-full max-w-7xl mx-auto mt-12">
    <div className="text-xl font-nekstmedium text-white mb-5 px-2">
      <span className="inline-flex items-center gap-2">
        <Package className="w-6 h-6 text-[#a677ee]" />
        Рекомендуем
      </span>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {recommendations.map((item) => (
        <div
          key={item.id}
          className="flex flex-col bg-gradient-to-br from-[#29283b]/90 via-[#23222a]/80 to-[#231c31]/90 rounded-2xl border border-[#a677ee] shadow-lg p-5"
        >
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-32 object-cover rounded-xl border-2 border-[#a677ee] mb-3"
          />
          <span className="text-base font-nekstmedium text-white line-clamp-1">
            {item.title}
          </span>
          <span className="text-xs text-[#dbb8ff] font-nekstregular mb-2">
            {item.vendor}
          </span>
          <span className="flex items-center gap-1 text-xs text-[#FFD700] font-nekstmedium mb-2">
            <Star className="w-4 h-4" />
            {item.rating}
          </span>
          <div className="flex justify-between items-center mt-auto">
            <span className="text-lg font-nekstmedium text-[#a677ee]">
              {formatPrice(item.price)}
            </span>
            <button
              className="flex gap-2 items-center bg-gradient-to-tr from-[#a677ee] to-[#BFAAFF] text-[#231c31] rounded-xl px-4 py-2 font-nekstmedium shadow hover:from-[#BFAAFF] hover:to-[#a677ee] transition"
              onClick={() => onAddToCart(item)}
            >
              <Plus className="w-4 h-4" />В корзину
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// --- Async fetch imitation for skeleton demo ---
const useFakeFavoritesFetch = (data: FavoriteItem[], delay = 600) => {
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setFavorites(data);
      setLoading(false);
    }, delay);
    return () => clearTimeout(timer);
  }, []);
  return { favorites, setFavorites, loading };
};

function formatPrice(price: number) {
  return price.toLocaleString("ru-RU") + " ₽";
}

export default function FavoritesPage() {
  const { favorites, setFavorites, loading } =
    useFakeFavoritesFetch(initialFavorites);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // --- Derived
  const totalPrice = favorites.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const totalCount = favorites.reduce((sum, item) => sum + item.quantity, 0);

  // --- Handlers
  function handleRemove(id: number) {
    setDeleteId(id);
  }
  function confirmRemove() {
    if (deleteId !== null) {
      setFavorites((c) => c.filter((item) => item.id !== deleteId));
      const item = favorites.find((i) => i.id === deleteId);
      toast.info(`Товар "${item?.title}" удален из избранного`);
      setDeleteId(null);
    }
  }
  function handleChangeQty(id: number, delta: number) {
    setFavorites((prev) =>
      prev.flatMap((item) =>
        item.id === id
          ? item.quantity + delta <= 0
            ? [] // remove from favorites if quantity becomes <= 0
            : [{ ...item, quantity: item.quantity + delta }]
          : [item]
      )
    );
    const item = favorites.find((i) => i.id === id);
    if (delta > 0) toast.success(`+1 к "${item?.title}"`);
    if (item && item.quantity + delta <= 0)
      toast.info(`Товар "${item?.title}" удален из избранного`);
  }
  function handleToCart(id: number) {
    const item = favorites.find((i) => i.id === id);
    toast.success(`"${item?.title}" добавлен в корзину`);
  }
  function handleFavorite(id: number) {
    toast.info("Товар остался в избранном");
  }

  function handleAddFromRecommend(item: (typeof recommendations)[0]) {
    setFavorites((prev) => {
      const found = prev.find((prod) => prod.title === item.title);
      if (found) {
        return prev.map((prod) =>
          prod.title === item.title
            ? { ...prod, quantity: prod.quantity + 1 }
            : prod
        );
      }
      return [
        ...prev,
        {
          ...item,
          id: Date.now(),
          quantity: 1,
          inStock: true,
          tags: [],
          rating: 4.5,
          vendor: item.vendor || "",
        },
      ];
    });
    toast.success(`"${item.title}" добавлен в избранное`);
  }

  return (
    <div className="bg-gradient-to-tl from-[#29283b] via-[#23222a] to-[#231c31] min-h-screen flex flex-col items-center animate-fade-in">
      <HeaderNav />
      <div className="w-full max-w-7xl mx-auto flex flex-col gap-6 pt-8 px-2 sm:px-6">
        {/* Header (редизайн - иконка справа, кнопка очистить слева) */}
        <div className="flex items-center gap-3 mb-8 flex-wrap justify-between">
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#23222a]/80 text-[#a677ee] hover:bg-[#a677ee]/10 font-nekstmedium border border-[#a677ee] transition disabled:opacity-40"
            onClick={() => setFavorites([])}
            disabled={favorites.length === 0}
            title="Очистить избранное"
          >
            <Trash2 className="w-5 h-5" />
            Очистить
          </button>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-nekstmedium text-white">
              Избранные товары
            </h1>
            <span className="ml-2 text-[#BFAAFF] font-nekstmedium text-base sm:text-lg">
              {totalCount} поз. / {formatPrice(totalPrice)}
            </span>
            <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-[#a677ee] ml-3" />
          </div>
        </div>
        {/* Favorites Items & Summary */}
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <FavoritesSkeleton />
            <div className="h-[320px] bg-gradient-to-br from-[#29283b]/90 via-[#23222a]/80 to-[#231c31]/90 rounded-3xl border border-[#a677ee] shadow-2xl animate-pulse" />
          </div>
        ) : favorites.length === 0 ? (
          <div className="w-full flex flex-col items-center gap-4 bg-gradient-to-br from-[#29283b]/90 via-[#23222a]/80 to-[#231c31]/90 rounded-3xl border border-[#a677ee] py-16 my-8 shadow-xl">
            <Heart className="w-16 h-16 text-[#a677ee]" />
            <div className="text-xl text-[#BFAAFF] font-nekstmedium mb-2">
              Нет товаров в избранном
            </div>
            <Link href="/">
              <button className="mt-2 px-8 py-4 rounded-2xl bg-gradient-to-tr from-[#a677ee] to-[#BFAAFF] text-[#231c31] font-nekstmedium text-lg shadow-lg hover:from-[#BFAAFF] hover:to-[#a677ee] transition">
                Перейти в каталог
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Items */}
            <div className="flex flex-col gap-7 w-full max-w-full">
              {favorites.map((item) => (
                <FavoriteItemCard
                  key={item.id}
                  item={item}
                  onRemove={() => handleRemove(item.id)}
                  onChangeQty={(d) => handleChangeQty(item.id, d)}
                  onToCart={() => handleToCart(item.id)}
                  onFavorite={() => handleFavorite(item.id)}
                  disableDecrement={item.quantity <= 1}
                />
              ))}
            </div>
            {/* Summary (поменяли порядок блоков, теперь summary справа на десктопе) */}
            <div
              id="fav-summary"
              className="sticky top-10 flex flex-col gap-6 bg-gradient-to-br from-[#29283b]/90 via-[#23222a]/80 to-[#231c31]/90 rounded-3xl border border-[#a677ee] shadow-2xl p-8 h-fit"
            >
              <div className="flex items-center gap-2 mb-4">
                <Heart className="w-7 h-7 text-[#a677ee]" />
                <span className="text-2xl font-nekstmedium text-white">
                  Ваше избранное
                </span>
              </div>
              <div className="flex flex-col gap-4 text-lg font-nekstmedium text-[#bcb7e5]">
                <div className="flex items-center justify-between">
                  <span>Товаров:</span>
                  <span>{totalCount} шт.</span>
                </div>
                <div className="flex items-center justify-between font-bold text-xl text-[#a677ee]">
                  <span>Сумма:</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
              </div>
              <div className="flex flex-col gap-2 mt-4 text-sm text-[#b8b8d1]">
                <span>Добавьте товары в корзину для оформления заказа.</span>
                <span>Избранное автоматически сохраняется.</span>
              </div>
            </div>
          </div>
        )}
        {/* Recommend */}
        <RecommendBlock onAddToCart={handleAddFromRecommend} />
      </div>
      {/* Mobile summary */}
      {favorites.length > 0 && (
        <MobileFavSummary total={totalPrice} count={totalCount} />
      )}
      {/* Modals */}
      {/* Remove confirm */}
      <Modal
        open={deleteId !== null}
        onClose={() => setDeleteId(null)}
        title="Удалить товар?"
      >
        <div className="mb-4 text-[#bcb7e5]">
          Подтвердите удаление товара из избранного.
        </div>
        <div className="flex gap-4 mt-2">
          <button
            className="flex-1 py-2 rounded-xl bg-[#FF3A3A] text-white font-nekstmedium hover:bg-[#ff6a6a] transition"
            onClick={confirmRemove}
          >
            Удалить
          </button>
          <button
            className="flex-1 py-2 rounded-xl bg-gradient-to-tr from-[#29283b] via-[#23222a] to-[#231c31] border border-[#a677ee] text-[#a677ee] font-nekstmedium hover:bg-[#2b2259] transition"
            onClick={() => setDeleteId(null)}
          >
            Отмена
          </button>
        </div>
      </Modal>
      {/* Toasts */}
      <ToastContainer
        position="bottom-right"
        autoClose={2100}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        theme="dark"
      />
      <Footer />
      <style>
        {`
          .animate-fade-in {
            animation: fade-in 0.35s cubic-bezier(.77,0,.175,1);
          }
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(30px);}
            to { opacity: 1; transform: translateY(0);}
          }
        `}
      </style>
    </div>
  );
}

// MOCK FAVORITES DATA
const initialFavorites = [
  {
    id: 1,
    title: "Станок лазерной резки PRO",
    price: 1500000,
    image: "/main/catalog/id1.jpg",
    vendor: "ООО ПрофСтан",
    quantity: 1,
    inStock: true,
    tags: ["Новинка"],
    rating: 4.8,
  },
  {
    id: 2,
    title: "Пластиковые гранулы Premium",
    price: 70000,
    image: "/main/catalog/id2.jpg",
    vendor: "Завод Гранула",
    quantity: 2,
    inStock: true,
    tags: ["Популярное"],
    rating: 4.4,
  },
  {
    id: 3,
    title: "Гранулятор GPX-300",
    price: 1200000,
    image: "/main/catalog/id3.jpg",
    vendor: "ТехноМаш",
    quantity: 1,
    inStock: false,
    tags: ["В наличии"],
    rating: 4.5,
  },
];
