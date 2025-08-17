import React, { useEffect } from "react";
import {
  Smartphone,
  Monitor,
  Home,
  Shirt,
  Apple,
  Dumbbell,
  Wrench,
  PawPrint,
  Pill,
} from "lucide-react";

// Цветовая палитра: тёмно-серые, плавные фиолетовые акценты, мягкие градиенты
const palette = {
  bg: "bg-gradient-to-tr from-[#23222a]/50 via-[#25243a]/ to-[#2e2542]/60",
  sidebar:
    "bg-gradient-to-b from-[#23222a] via-[#29283b]/70 to-[#23222a] shadow-[4px_0_32px_0_#1b153733]",
  sidebarActive:
    "bg-gradient-to-r from-[#a677ee]/80 to-[#6c47d6]/70 text-white shadow-lg",
  sidebarHover: "hover:bg-[#29283b] hover:text-[#a677ee]",
  border: "border-[#3a306b]",
  card: "bg-gradient-to-b from-[#29283b]/90 via-[#23222a]/95 to-[#2e2542]/90 shadow-[0_6px_32px_0_#201f3355]",
  cardTitle: "text-[#dbb8ff]",
  cardText: "text-[#bcb7e5]",
  cardHover:
    "hover:bg-gradient-to-tr hover:from-[#2b2542]/90 hover:to-[#341f4f]/90 hover:border-[#a677ee] hover:shadow-[0_6px_32px_0_#a677ee55] hover:scale-[1.03]",
};

const categories = [
  {
    label: "Электроника",
    icon: <Smartphone className="w-5 h-5" />,
    subcategories: [
      {
        title: "Телефоны и смарт-часы",
        items: [
          "Смартфоны",
          "Аксессуары для смартфонов и телефонов",
          "Смарт-часы",
          "Фитнес-браслеты",
        ],
      },
      {
        title: "Компьютеры и периферия",
        items: [
          "Мониторы",
          "Системные блоки",
          "Периферия",
          "Сетевое оборудование",
        ],
      },
      {
        title: "Умный дом",
        items: [
          "Аксессуары",
          "Датчики и регуляторы",
          "Комплекты умного дома",
          "Освещение",
          "Розетки",
        ],
      },
    ],
  },
  {
    label: "Одежда",
    icon: <Shirt className="w-5 h-5" />,
    subcategories: [
      {
        title: "Мужская одежда",
        items: ["Футболки", "Джинсы", "Куртки"],
      },
      {
        title: "Женская одежда",
        items: ["Платья", "Юбки", "Блузки"],
      },
    ],
  },
  {
    label: "Дом и сад",
    icon: <Home className="w-5 h-5" />,
    subcategories: [
      {
        title: "Мебель",
        items: ["Столы", "Стулья", "Диваны"],
      },
      {
        title: "Посуда и декор",
        items: ["Кружки", "Вазы", "Картины"],
      },
    ],
  },
  {
    label: "Продукты питания",
    icon: <Apple className="w-5 h-5" />,
    subcategories: [
      {
        title: "Фрукты",
        items: ["Яблоки", "Бананы", "Апельсины"],
      },
      {
        title: "Овощи",
        items: ["Огурцы", "Помидоры", "Морковь"],
      },
    ],
  },
  {
    label: "Бытовая техника",
    icon: <Monitor className="w-5 h-5" />,
    subcategories: [
      {
        title: "Крупная техника",
        items: ["Холодильники", "Стиральные машины"],
      },
      {
        title: "Мелкая техника",
        items: ["Пылесосы", "Миксеры"],
      },
    ],
  },
  {
    label: "Строительство и ремонт",
    icon: <Wrench className="w-5 h-5" />,
    subcategories: [
      {
        title: "Инструменты",
        items: ["Дрели", "Отвертки", "Перфораторы"],
      },
      {
        title: "Материалы",
        items: ["Краска", "Шпаклевка", "Гипсокартон"],
      },
    ],
  },
  {
    label: "Спорт и отдых",
    icon: <Dumbbell className="w-5 h-5" />,
    subcategories: [
      {
        title: "Тренажеры",
        items: ["Беговые дорожки", "Эллипсоиды"],
      },
      {
        title: "Спорттовары",
        items: ["Мячи", "Гантели", "Ракетки"],
      },
    ],
  },
  {
    label: "Товары для животных",
    icon: <PawPrint className="w-5 h-5" />,
    subcategories: [
      {
        title: "Для кошек",
        items: ["Корм", "Лежаки"],
      },
      {
        title: "Для собак",
        items: ["Ошейники", "Игрушки"],
      },
    ],
  },
  {
    label: "Медицина и аптека",
    icon: <Pill className="w-5 h-5" />,
    subcategories: [
      {
        title: "Медтехника",
        items: ["Термометры", "Тонометры"],
      },
      {
        title: "Аптека",
        items: ["Витамины", "Мази", "Сиропы"],
      },
    ],
  },
];

export function CategoryModal({
  open,
  onClose,
  activeIndex = 0,
  setActiveIndex,
}) {
  // Блокировка скролла body при открытии модалки
  useEffect(() => {
    if (open) {
      const originalStyle = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [open]);

  if (!open) return null;
  const activeCategory = categories[activeIndex];

  return (
    <div
      className="fixed inset-0 z-[1050] flex items-start pt-[0px] w-screen h-screen pointer-events-auto font-sans"
      tabIndex={-1}
      aria-modal="true"
      role="dialog"
    >
      {/* Затемнение с плавным fade-in */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#18171c]/80 via-[#23222a]/80 to-[#211837]/70 backdrop-blur-[2px] animate-fadeInTop z-0" />
      {/* Модалка с fade-in-top */}
      <div
        className={`w-full h-100vh flex rounded-none relative animate-fadeInTop`}
      >
        {/* Sidebar */}
        <aside
          className={`w-[310px] px-[10px]  pt-[100px] h-[100vh] border-r ${palette.border} ${palette.sidebar} py-6 flex flex-col gap-0 overflow-y-auto transition-all duration-200`}
        >
          <div className="flex items-center gap-2 px-8 pb-6">
            <span className="font-nekstmedium text-[24px] tracking-tight text-[#a677ee] drop-shadow">
              Каталог
            </span>
          </div>
          {categories.map((cat, i) => (
            <button
              key={cat.label}
              onClick={() => setActiveIndex(i)}
              className={`
                flex items-center gap-4 px-8 py-3 rounded-xl font-nekstmedium text-[17px] w-full text-left transition-all duration-150
                ${
                  i === activeIndex
                    ? `${palette.sidebarActive}`
                    : `${palette.sidebarHover} text-[#bcb7e5]`
                }
                mb-1
              `}
              style={{
                boxShadow:
                  i === activeIndex ? "0 2px 16px #a677ee22" : undefined,
              }}
              tabIndex={0}
            >
              <span
                className={`w-7 h-7 flex items-center justify-center transition ${
                  i === activeIndex
                    ? "text-[#fff] scale-110 drop-shadow"
                    : "text-[#a677ee]"
                }`}
              >
                {cat.icon}
              </span>
              {cat.label}
            </button>
          ))}
        </aside>
        {/* Main content */}
        <section
          className={`flex-1 flex flex-col overflow-y-auto ${palette.bg} transition-all duration-200 rounded-r-[0px] pt-[100px] h-[100vh]`}
        >
          <div className="flex-1 flex flex-wrap items-start px-16 py-12 gap-x-12 gap-y-10 overflow-y-auto">
            {activeCategory.subcategories.map((col, i) => (
              <div
                key={i}
                className={`min-w-[230px] max-w-[300px] ${palette.card} border ${palette.border} rounded-3xl p-7 transition-all duration-200 ${palette.cardHover}`}
                style={{
                  boxShadow: "0 2px 18px 0 #a677ee18, 0 8px 40px 0 #2e254211",
                }}
              >
                <div
                  className={`font-nekstmedium text-[21px] mb-3 ${palette.cardTitle} font-nekstmedium tracking-tight`}
                >
                  {col.title}
                </div>
                <ul className="flex flex-col gap-1">
                  {col.items.map((item, j) => (
                    <li
                      key={j}
                      className={`transition font-nekstregular text-[15px] ${palette.cardText} hover:text-[#a677ee] hover:underline cursor-pointer`}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </div>
      <style jsx global>{`
        @keyframes fadeInTop {
          from {
            opacity: 0;
            transform: translateY(-24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInTop {
          animation: fadeInTop 0.4s cubic-bezier(0.77, 0, 0.175, 1);
        }
      `}</style>
    </div>
  );
}
