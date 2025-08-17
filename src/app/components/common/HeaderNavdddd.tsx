import React, { useState, useRef } from "react";
import Link from "next/link";
import {
  Heart,
  ShoppingCart,
  User2,
  Menu,
  Bell,
  Settings,
  HelpCircle,
  LogIn,
  ChevronRight,
  ChevronDown,
  Search,
  LogOut,
  ShieldCheck,
  ShoppingBag,
  Home,
  Shirt,
  HomeIcon,
  Baby,
  HeartPulse,
  Cpu,
  Dumbbell,
  Wrench,
  Apple,
  Pill,
  PawPrint,
  X,
  Package,
} from "lucide-react";

// Цветовая гамма и стили
const COLORS = {
  background: "bg-[#272727]",
  sidebar: "bg-[#272727]",
  sidebarActive: "bg-[#34365a]",
  card: "bg-[#29293a]",
  accent: "text-[#8C7FF5]",
  accentBg: "bg-[#8C7FF5]",
  border: "border-[#3f415a]",
  input: "bg-[#23223a]",
  inputFocus: "focus:ring-[#8C7FF5]",
  hover: "hover:bg-[#35355a]",
  text: "text-[#e4e4ea]",
  textSecondary: "text-[#7e7e9a]",
  sectionTitle: "text-[#b8b8d1]",
  menuBg: "bg-[#272727]",
};

const userMenu = [
  {
    icon: <Settings className="w-5 h-5 text-[#8C7FF5]" />,
    label: "Настройки",
    href: "/user?tab=settings",
  },
  {
    icon: <ShieldCheck className="w-5 h-5 text-[#8C7FF5]" />,
    label: "Безопасность",
    href: "/user?tab=security",
  },
  {
    icon: <Bell className="w-5 h-5 text-[#8C7FF5]" />,
    label: "Уведомления",
    href: "/user?tab=notifications",
  },
  {
    icon: <HelpCircle className="w-5 h-5 text-[#8C7FF5]" />,
    label: "Справка",
    href: "/help",
  },
];

// Категории каталога (B2B)
const catalogSidebar = [
  {
    icon: <Home className="w-5 h-5" />,
    label: "Всё для бизнеса",
    content: [
      {
        title: "Популярные категории",
        items: [
          "Промышленное оборудование",
          "Сырье и материалы",
          "Оптовые поставки",
          "Транспортировка и склад",
          "B2B-услуги",
          "IT-решения",
          "Готовая продукция",
        ],
      },
      {
        title: "Сервисы для компаний",
        items: [
          "Бухгалтерские услуги",
          "Логистика и доставка",
          "IT-аутсорсинг",
          "Маркетинговые услуги",
          "Обслуживание оборудования",
          "Консалтинг",
        ],
      },
      {
        title: "Партнерские программы",
        items: [
          "Франчайзинг",
          "Дистрибуция",
          "OEM/ODM",
          "Аутсорсинг производства",
          "Оптовые закупки",
        ],
      },
    ],
  },
  {
    icon: <Cpu className="w-5 h-5" />,
    label: "Оборудование и техника",
    content: [
      {
        title: "Промышленное оборудование",
        items: [
          "Станки и линии",
          "Оборудование для переработки",
          "Пищевое оборудование",
          "Оборудование для упаковки",
          "Сварочное оборудование",
          "Автоматизация процессов",
          "Промышленные роботы",
        ],
      },
      {
        title: "Электротехника и электроника",
        items: [
          "Электродвигатели",
          "Контроллеры и датчики",
          "Кабели и проводка",
          "Источники питания",
          "Освещение",
          "Щиты и шкафы",
          "Системы видеонаблюдения",
        ],
      },
      {
        title: "Транспорт и склад",
        items: [
          "Погрузчики",
          "Конвейерные системы",
          "Стеллажи и полки",
          "Складские контейнеры",
          "Транспортные средства",
          "Подъемная техника",
          "Весовое оборудование",
        ],
      },
      {
        title: "IT-оборудование",
        items: [
          "Серверы и хранилища",
          "Компьютеры и мониторы",
          "Сетевое оборудование",
          "POS-системы",
          "Промышленные планшеты",
          "Принтеры и сканеры",
        ],
      },
      {
        title: "Инструменты и комплектующие",
        items: [
          "Ручной инструмент",
          "Электроинструмент",
          "Запасные части",
          "Крепеж и метизы",
          "Измерительный инструмент",
        ],
      },
    ],
  },
  {
    icon: <Package className="w-5 h-5" />,
    label: "Сырье и материалы",
    content: [
      {
        title: "Сырье",
        items: [
          "Металлы и сплавы",
          "Пластики и полимеры",
          "Древесина и пиломатериалы",
          "Строительные смеси",
          "Ткани и текстиль",
          "Химия и реагенты",
          "Камень и инертные материалы",
        ],
      },
      {
        title: "Материалы для производства",
        items: [
          "Кабельно-проводниковая продукция",
          "Комплектующие для мебели",
          "Упаковочные материалы",
          "Изоляционные материалы",
          "Расходные материалы",
          "Промышленные смазки",
        ],
      },
      {
        title: "Готовые полуфабрикаты",
        items: [
          "Погонажные изделия",
          "Плиты и профили",
          "Фурнитура",
          "Фасонные изделия",
          "Промышленные ленты",
        ],
      },
    ],
  },
  {
    icon: <Apple className="w-5 h-5" />,
    label: "Оптовые продукты и FMCG",
    content: [
      {
        title: "Продукты питания (опт)",
        items: [
          "Бакалея",
          "Молочная продукция",
          "Мясо и рыба",
          "Кондитерские изделия",
          "Напитки",
          "Полуфабрикаты",
          "Фрукты и овощи",
          "Замороженные продукты",
        ],
      },
      {
        title: "FMCG и непродовольственные товары",
        items: [
          "Бытовая химия",
          "Канцтовары и расходники",
          "Косметика и гигиена",
          "Упаковка и тара",
          "Текстиль",
          "Хозтовары",
        ],
      },
      {
        title: "HoReCa, рестораны и кейтеринг",
        items: [
          "Продукты для ресторанов",
          "Посуды и инвентарь",
          "Одноразовая упаковка",
          "Поставки для кафе и столовых",
        ],
      },
    ],
  },
  {
    icon: <Wrench className="w-5 h-5" />,
    label: "Строительство и ремонт",
    content: [
      {
        title: "Строительные материалы",
        items: [
          "Сухие смеси и цемент",
          "Кирпич и блоки",
          "Гипсокартон и панели",
          "Кровельные материалы",
          "Гидроизоляция и утеплители",
          "Металлопрокат",
          "Фасадные материалы",
        ],
      },
      {
        title: "Отделка и интерьер",
        items: [
          "Краски и лаки",
          "Обои и покрытия",
          "Плитка и керамогранит",
          "Ламинат и паркет",
          "Плинтуса и молдинги",
        ],
      },
      {
        title: "Окна, двери, фурнитура",
        items: [
          "Оконные конструкции",
          "Дверные системы",
          "Замки и петли",
          "Ручки и фурнитура",
        ],
      },
      {
        title: "Инженерные системы",
        items: [
          "Сантехника и водоснабжение",
          "Электромонтаж",
          "Вентиляция и кондиционирование",
          "Отопление",
        ],
      },
      {
        title: "Инструменты и техника",
        items: [
          "Ручной инструмент",
          "Электроинструмент",
          "Строительная техника",
          "Леса и строительные вышки",
        ],
      },
    ],
  },
  {
    icon: <Shirt className="w-5 h-5" />,
    label: "Одежда и спецодежда",
    content: [
      {
        title: "Рабочая одежда",
        items: [
          "Костюмы и комплекты",
          "Куртки, брюки, халаты",
          "Сигнальная одежда",
          "Одежда для пищевой промышленности",
          "Одежда для медицины",
          "Термобелье",
          "Огнеупорная одежда",
        ],
      },
      {
        title: "Спецобувь и аксессуары",
        items: [
          "Рабочая обувь",
          "Ботинки и сапоги",
          "Обувь для пищевой и химической промышленности",
          "Антистатическая обувь",
          "Сандалии и сабо",
          "Бахилы",
          "Перчатки",
          "Головные уборы",
          "Каски и щитки",
        ],
      },
      {
        title: "Средства индивидуальной защиты",
        items: [
          "Респираторы и маски",
          "Очки и экраны",
          "Наушники и беруши",
          "Защитные щитки",
        ],
      },
    ],
  },
  {
    icon: <Dumbbell className="w-5 h-5" />,
    label: "Офис, мебель и HoReCa",
    content: [
      {
        title: "Офисная мебель",
        items: [
          "Столы и кресла",
          "Шкафы и стеллажи",
          "Офисные перегородки",
          "Мебель для переговорных",
          "Мобильные рабочие места",
        ],
      },
      {
        title: "Мебель для HoReCa",
        items: [
          "Столы и стулья для кафе",
          "Барные стойки",
          "Мебель для залов",
          "Уличная и летняя мебель",
        ],
      },
      {
        title: "Техника и аксессуары",
        items: [
          "Кофемашины и аппараты",
          "Посудомоечные машины",
          "Климатическая техника",
          "Бытовая техника для бизнеса",
        ],
      },
    ],
  },
  {
    icon: <Pill className="w-5 h-5" />,
    label: "Медицина и лаборатории",
    content: [
      {
        title: "Оборудование",
        items: [
          "Медицинские аппараты",
          "Лабораторное оборудование",
          "Холодильники и морозильники",
          "Стерилизация",
          "Дозаторы и расходники",
        ],
      },
      {
        title: "Расходные материалы",
        items: [
          "Шприцы и иглы",
          "Перчатки",
          "Маски и бахилы",
          "Пакеты и контейнеры",
          "Дезинфекция и антисептики",
        ],
      },
      {
        title: "Мебель и оснащение",
        items: [
          "Операционные столы",
          "Кушетки и кровати",
          "Шкафы и тележки",
          "Лабораторная мебель",
        ],
      },
    ],
  },
  {
    icon: <HeartPulse className="w-5 h-5" />,
    label: "B2B-услуги",
    content: [
      {
        title: "Финансовые услуги",
        items: [
          "Бухгалтерское обслуживание",
          "Аудит и консалтинг",
          "Кредитование бизнеса",
          "Страхование",
          "Лизинг",
        ],
      },
      {
        title: "Логистика и доставка",
        items: [
          "Экспедирование грузов",
          "Складские услуги",
          "Перевозки по России",
          "Международные перевозки",
          "Аутсорсинг логистики",
        ],
      },
      {
        title: "IT и digital",
        items: [
          "Разработка ПО",
          "Аренда облака",
          "CRM-системы",
          "Маркетинг для B2B",
          "Системная интеграция",
        ],
      },
      {
        title: "Обслуживание и сервис",
        items: [
          "Сервис оборудования",
          "Уборка и клининг",
          "Аутсорсинг персонала",
          "Инженерное обслуживание",
        ],
      },
    ],
  },
  {
    icon: <Baby className="w-5 h-5" />,
    label: "Товары для бизнеса",
    content: [
      {
        title: "Для детских учреждений",
        items: [
          "Мебель для детских садов",
          "Игровые комплексы",
          "Развивающие игрушки",
          "Безопасность и оснащение",
        ],
      },
      {
        title: "Для производства",
        items: [
          "Тара и упаковка",
          "Контейнеры и баки",
          "Промышленные расходники",
          "Средства уборки",
        ],
      },
      {
        title: "Для офисов",
        items: [
          "Канцелярия",
          "Офисная бумага",
          "Диспенсеры и расходники",
          "Системы хранения",
        ],
      },
    ],
  },
  {
    icon: <PawPrint className="w-5 h-5" />,
    label: "Товары для агробизнеса",
    content: [
      {
        title: "Животноводство",
        items: [
          "Корма и добавки",
          "Оборудование для ферм",
          "Ветпрепараты",
          "Средства ухода",
        ],
      },
      {
        title: "Растениеводство",
        items: [
          "Семена и посадочный материал",
          "Средства защиты растений",
          "Оборудование для теплиц",
          "Системы полива",
        ],
      },
      {
        title: "Агроинвентарь",
        items: [
          "Тракторы и техника",
          "Инструменты для сада и поля",
          "Ограждения и сетки",
        ],
      },
    ],
  },
];

export default function HeaderNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const menuTimeout = useRef<NodeJS.Timeout | null>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const catalogRef = useRef<HTMLDivElement>(null);

  // Обработка наведения для юзер-меню
  function handleMenuEnter() {
    if (menuTimeout.current) clearTimeout(menuTimeout.current);
    setMenuOpen(true);
  }
  function handleMenuLeave() {
    menuTimeout.current = setTimeout(() => setMenuOpen(false), 160);
  }

  // Клик вне меню — закрытие
  React.useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setMenuOpen(false);
      }
      if (
        catalogRef.current &&
        !catalogRef.current.contains(e.target as Node)
      ) {
        setCatalogOpen(false);
      }
    }
    if (menuOpen || catalogOpen)
      document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [menuOpen, catalogOpen]);

  return (
    <div className="w-full shadow-md z-30 font-nekstmedium relative">
      {/* Верхняя панель */}
      <div
        className={`
          relative flex items-center justify-between
          px-4 md:px-10 py-4 
          bg-gradient-to-r from-[#29292d] via-[#201f23] to-[#2c2943]/30 
          border-b ${COLORS.border} backdrop-blur
        `}
        style={{ zIndex: 1020 }}
      >
        {/* Лого и Каталог */}
        <a href="/" className="flex items-center gap-4">
          <button className="md:hidden p-2 rounded-lg hover:bg-[#404040]">
            <Menu className="w-6 h-6 text-[#8C7FF5]" />
          </button>
          <span className="text-2xl font-bold tracking-tight select-none text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#8C7FF5] inline-block"></span>
            b2bMarket
          </span>
        </a>

        {/* Поиск и навигация, адаптив */}
        <nav className="flex items-center w-full max-w-[950px] flex-1 mx-4 gap-2">
          {/* Каталог */}
          <div ref={catalogRef} className="relative">
            <button
              className={`
                flex items-center gap-2 px-4 py-1.5 rounded-lg transition-all font-nekstmedium text-white shadow-lg
                ${
                  catalogOpen
                    ? "bg-[#8C7FF5] text-white"
                    : "bg-gradient-to-r from-[#2f2f2f]  to-[#6f4783] hover:bg-[#8C7FF5]/80"
                }
              `}
              style={{ minWidth: 110 }}
              onClick={() => setCatalogOpen((v) => !v)}
              aria-label="Каталог"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="hidden xs:inline">Каталог</span>
              <ChevronDown
                className={`w-4 h-4 ml-1 transition-transform duration-150 ${
                  catalogOpen ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>
          {/* Поиск */}
          <div className="flex-1 flex items-center relative min-w-0 max-w-[600px]">
            <input
              type="text"
              placeholder="Поиск по каталогу, товарам, услугам"
              className={`
                w-full py-2 pl-11 pr-4 rounded-xl bg-[#23223a] border border-[#363650] text-[#e4e4ea]
                font-nekstregular focus:outline-none focus:ring-2 focus:ring-[#8C7FF5] transition
                placeholder:text-[#7e7e9a] text-[15px]
                sm:text-[15px] xs:text-sm
              `}
              style={{
                minWidth: 0,
              }}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8C7FF5]" />
          </div>
          {/* Адаптивные ссылки */}
          <div className="hidden md:flex gap-0.5 ml-2">
            <a
              href="#"
              className="px-3 py-1 rounded-lg transition-colors hover:bg-[#35355a] text-[#b8b8d1] font-nekstregular"
            >
              О компании
            </a>
            <a
              href="#"
              className="px-3 py-1 rounded-lg transition-colors hover:bg-[#35355a] text-[#b8b8d1] font-nekstregular"
            >
              Контакты
            </a>
            <a
              href="#"
              className="px-3 py-1 rounded-lg transition-colors hover:bg-[#35355a] text-[#b8b8d1] font-nekstregular"
            >
              Партнёрам
            </a>
            <a
              href="#"
              className="px-3 py-1 rounded-lg transition-colors hover:bg-[#35355a] text-[#b8b8d1] font-nekstregular"
            >
              Тарифы
            </a>
            <a
              href="#"
              className="px-3 py-1 rounded-lg transition-colors hover:bg-[#35355a] flex items-center gap-1 text-[#b8b8d1] font-nekstregular"
            >
              Новости <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </nav>

        {/* Actions справа */}
        <div className="flex gap-2 md:gap-3 items-center ml-2">
          <button
            className="relative hover:bg-[#35355a] rounded-full p-2 transition"
            aria-label="Избранное"
          >
            <Heart className="w-5 h-5 text-[#b8b8d1] hover:text-[#8C7FF5]" />
          </button>
          <Link href={"/basket"}>
            <button
              className="relative hover:bg-[#35355a] rounded-full p-2 transition"
              aria-label="Корзина"
            >
              <ShoppingCart className="w-5 h-5 text-[#b8b8d1] hover:text-[#8C7FF5]" />
              <span className="absolute -top-1 -right-1 text-xs bg-[#8C7FF5] text-[#19123b] rounded-full px-1.5 font-bold shadow">
                2
              </span>
            </button>
          </Link>
          <button
            className="relative hover:bg-[#35355a] rounded-full p-2 transition"
            aria-label="Уведомления"
          >
            <Bell className="w-5 h-5 text-[#b8b8d1] hover:text-[#8C7FF5]" />
          </button>
          <div
            className="relative"
            ref={userMenuRef}
            onMouseEnter={handleMenuEnter}
            onMouseLeave={handleMenuLeave}
          >
            <button
              className="relative hover:bg-[#35355a] rounded-full p-2 transition flex items-center"
              aria-label="Профиль"
              onClick={() => setMenuOpen((v) => !v)}
            >
              <User2 className="w-5 h-5 text-[#b8b8d1] hover:text-[#8C7FF5]" />
              <ChevronDown className="w-4 h-4 ml-1 text-[#8C7FF5]" />
            </button>
            {/* Dropdown menu */}
            {menuOpen && (
              <div className="absolute z-[1000] right-0 top-10 min-w-[220px] bg-[#232136] rounded-2xl shadow-2xl border border-[#232136] py-2 px-1 flex flex-col gap-1 animate-fade-in-menu font-nekstmedium">
                {userMenu.map((item) => (
                  <Link href={item.href} key={item.label}>
                    <button
                      className={`w-full flex items-center gap-3 px-5 py-3 rounded-xl text-base transition-colors hover:bg-[#8C7FF5]/10 text-[#BFAAFF]`}
                    >
                      {item.icon}
                      {item.label}
                    </button>
                  </Link>
                ))}
                <Link href="/logout">
                  <button className="w-full flex items-center gap-3 px-5 py-3 rounded-xl text-base transition-colors bg-[#FF3A3A]/10 text-[#FF3A3A] hover:bg-[#FF3A3A]/20 font-nekstmedium">
                    <LogOut className="w-5 h-5" />
                    Выйти
                  </button>
                </Link>
              </div>
            )}
          </div>
          <button className="hidden md:flex items-center gap-1 bg-gradient-to-r from-[#2a292a]  to-[#6f4783] text-[#fff] px-4 py-1 rounded-lg font-nekstmedium text-sm hover:bg-[#7867e6] transition ml-1  ">
            <LogIn className="w-4 h-4" />
            Войти
          </button>
        </div>
      </div>

      {/* Каталог-меню (оверлей) */}
      {catalogOpen && (
        <div
          className={`
            fixed left-0 top-0 w-screen h-screen z-[1050] flex items-start
            bg-[#272727]
          `}
          style={{ minHeight: "100vh", minWidth: "100vw" }}
        >
          <div
            className={`
              w-full h-full flex rounded-none shadow-2xl border-none
              animate-fade-in-menu relative
            `}
            ref={catalogRef}
          >
            {/* Sidebar */}
            <aside
              className={`
                w-[310px] h-full border-r border-[#3c2675] bg-gradient-to-r from-[#2c2935] to-[#24222f] py-4 px-2 flex flex-col gap-1 bg-[#272727]
                font-nekstregular overflow-y-auto scrollbar-thin scrollbar-thumb-[#3f415a] scrollbar-track-[#23232a]
              `}
            >
              {catalogSidebar.map((cat, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => setActiveCategoryIndex(i)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg transition font-medium text-base w-full text-left
                    ${
                      i === activeCategoryIndex
                        ? "bg-[#8C7FF5]/20 text-[#8C7FF5] font-bold shadow-[0_2px_10px_0_rgba(140,127,245,0.10)]"
                        : "hover:bg-[#35355a] text-[#b8b8d1]"
                    }
                    font-nekstmedium
                  `}
                  style={{
                    marginBottom: "2px",
                    borderLeft:
                      i === activeCategoryIndex
                        ? "4px solid #8C7FF5"
                        : "4px solid transparent",
                  }}
                  tabIndex={0}
                >
                  {cat.icon}
                  <span className="truncate">{cat.label}</span>
                </button>
              ))}
            </aside>
            {/* Content */}
            <section
              className={`
                flex-1 h-full p-10 overflow-x-auto overflow-y-auto
                font-nekstregular bg-gradient-to-br from-[rgb(28,25,37)] to-[#212022]
                scrollbar-thin scrollbar-thumb-[#3f415a] scrollbar-track-[#23232a]
                transition
              `}
            >
              <div className="flex flex-wrap gap-x-12 gap-y-10">
                {catalogSidebar[activeCategoryIndex].content.map((col, i) => (
                  <div
                    key={i}
                    style={{
                      minWidth: 250,
                      maxWidth: 280,
                      background: "#28293d",
                      borderRadius: 16,
                      boxShadow: "0 2px 16px 0 #23233a10",
                      border: "1px solid #313356",
                    }}
                    className="p-6 mb-3"
                  >
                    <div className="font-bold text-lg mb-3 text-[#fff] font-nekstmedium tracking-tight">
                      {col.title}
                    </div>
                    <ul className="flex flex-col gap-2">
                      {col.items.map((item, j) =>
                        item === "Еще" ? (
                          <li
                            key={j}
                            className="text-[#8C7FF5] font-medium flex items-center gap-1 cursor-pointer hover:underline"
                          >
                            {item} <ChevronDown className="inline w-4 h-4" />
                          </li>
                        ) : (
                          <li
                            key={j}
                            className="text-[#b8b8d1] hover:text-[#8C7FF5] cursor-pointer transition font-nekstregular"
                          >
                            {item}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
            {/* Close button */}
            <button
              className="absolute top-6 right-10 p-2 rounded-full hover:bg-[#8C7FF5]/20 text-[#8C7FF5] transition z-[1100]"
              onClick={() => setCatalogOpen(false)}
              aria-label="Закрыть"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      {/* Mobile nav */}
      <nav className="lg:hidden px-4 pb-2 pt-1 flex gap-2 items-center text-sm font-nekstmedium overflow-x-auto scrollbar-thin scrollbar-thumb-[#232136] scrollbar-track-transparent">
        <a
          href="#"
          className="px-2 py-1 rounded-lg transition-colors hover:bg-[#404040] font-bold bg-[#8C7FF5] text-white flex items-center gap-1 font-nekstmedium"
        >
          <ShoppingBag className="w-4 h-4" />
          Каталог
        </a>
        <a
          href="#"
          className="px-2 py-1 rounded-lg transition-colors hover:bg-[#404040]"
        >
          О компании
        </a>
        <a
          href="#"
          className="px-2 py-1 rounded-lg transition-colors hover:bg-[#404040]"
        >
          Контакты
        </a>
        <a
          href="#"
          className="px-2 py-1 rounded-lg transition-colors hover:bg-[#404040]"
        >
          Партнёрам
        </a>
        <a
          href="#"
          className="px-2 py-1 rounded-lg transition-colors hover:bg-[#404040]"
        >
          Тарифы
        </a>
        <a
          href="#"
          className="px-2 py-1 rounded-lg transition-colors hover:bg-[#404040] flex items-center gap-1"
        >
          Новости <ChevronRight className="w-4 h-4" />
        </a>
        <a
          href="#"
          className="px-2 py-1 rounded-lg transition-colors hover:bg-[#404040] flex items-center gap-1"
        >
          Настройки <Settings className="w-4 h-4" />
        </a>
      </nav>
      <style>
        {`
          @media (max-width: 700px) {
            nav .flex-1 input {
              font-size: 14px !important;
              padding-left: 2.5rem !important;
              padding-right: 0.5rem !important;
            }
            nav .flex-1 {
              min-width: 120px !important;
              max-width: 220px !important;
            }
          }
          @media (max-width: 480px) {
            nav .flex-1 input {
              font-size: 13px !important;
              padding-left: 2rem !important;
            }
            nav .flex-1 {
              min-width: 60px !important;
              max-width: 140px !important;
            }
            .md\\:flex {
              display: none !important;
            }
          }
          .animate-fade-in-menu {
            animation: fade-in-menu 0.22s cubic-bezier(.77,0,.175,1);
          }
          @keyframes fade-in-menu {
            from { opacity: 0; transform: translateY(12px);}
            to { opacity: 1; transform: translateY(0);}
          }
          .scrollbar-thin {
            scrollbar-width: thin;
          }
          .scrollbar-thumb-[#3f415a]::-webkit-scrollbar-thumb {
            background-color: #3f415a;
          }
          .scrollbar-track-[#23232a]::-webkit-scrollbar-track {
            background-color: #23232a;
          }
        `}
      </style>
    </div>
  );
}
