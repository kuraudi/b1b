import React from "react";
import { Info, Lightbulb, Star } from "lucide-react";

// Словарь описаний категорий
const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  Все: "Вся продукция каталога B2B – оборудование, сырьё, услуги и многое другое для бизнеса.",
  Оборудование:
    "Промышленные станки, техника и комплектующие – всё для эффективного производства.",
  Сырьё:
    "Сырьевые материалы для различных отраслей: металлы, пластики, текстиль, химия.",
  Услуги:
    "B2B-услуги: логистика, IT, консалтинг, сервисное обслуживание и другие решения.",
  Электроника:
    "Современная электроника и компоненты для бизнеса: оборудование, расходники, IT-решения.",
  Логистика: "Транспортировка, складские и логистические решения для бизнеса.",
  Товары:
    "Оптовые товары для бизнеса: продукция, FMCG, HoReCa, готовые изделия.",
  Упаковка:
    "Упаковочные материалы и решения для хранения, логистики и производства.",
  Инструменты:
    "Ручной, электро- и промышленный инструмент для специалистов и производств.",
  Комплектующие:
    "Запасные части и компоненты для техники, оборудования и промышленности.",
  Безопасность:
    "Оборудование и средства для обеспечения безопасности бизнеса и сотрудников.",
  Образование:
    "Образовательные услуги и материалы для развития персонала и бизнеса.",
  Финансы: "Финансовые услуги, кредитование, страхование и поддержка бизнеса.",
  Партнеры:
    "Партнёрские предложения, франшизы, дистрибуция и деловые контакты.",
};

// Массив советов и фактов
const TIPS: string[] = [
  "Добавьте товар в избранное, чтобы не потерять его при следующем посещении.",
  "Используйте фильтры для быстрого поиска нужной категории или услуги.",
  "Отсортируйте товары по рейтингу, чтобы увидеть самые популярные предложения.",
  "Свяжитесь с продавцом напрямую через карточку товара для уточнения деталей.",
  "Проверяйте наличие отзывов – это поможет сделать правильный выбор.",
  "Не забывайте про раздел 'Услуги' – здесь много полезных B2B-решений.",
  "Сравнивайте предложения по цене и условиям доставки.",
  "В разделе 'Партнеры' можно найти эксклюзивные бизнес-предложения.",
  "Оформите подписку на обновления каталога, чтобы не пропустить новинки.",
  "Воспользуйтесь поиском по названию компании для быстрого доступа к поставщику.",
];

type CatalogInfoSectionProps = {
  total: number;
  selectedCategory: string;
};

export default function CatalogInfoSection({
  total,
  selectedCategory,
}: CatalogInfoSectionProps) {
  // Описание категории
  const categoryDescription =
    CATEGORY_DESCRIPTIONS[selectedCategory] ||
    "Описания нет – выберите подходящую категорию для уточнения.";

  // Рандомный совет
  const tip = React.useMemo(
    () => TIPS[Math.floor(Math.random() * TIPS.length)],
    [selectedCategory, total]
  );

  // Иконка для блока (по желанию можно менять)
  const Icon = Lightbulb;

  return (
    <section
      className="
        w-full mb-8
        bg-gradient-to-br from-[#232136] via-[#221f35] to-[#2b244a]
        border-2 border-[#8C7FF5]
        rounded-2xl
        shadow-lg
        px-7 py-6
        flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8
        transition
      "
    >
      <div className="flex items-center gap-3 mb-2 md:mb-0">
        <Icon className="w-8 h-8 text-[#BFAAFF] flex-shrink-0" />
        <div>
          <div className="text-lg md:text-xl font-nekstmedium text-[#BFAAFF]">
            Всего товаров:{" "}
            <span className="font-bold text-[#8C7FF5]">{total}</span>
          </div>
          {selectedCategory !== "Все" && (
            <div className="mt-1 text-base font-nekstmedium text-[#BFAAFF]">
              Категория:{" "}
              <span className="font-bold text-[#8C7FF5]">
                {selectedCategory}
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[#e4e4ea] font-nekstregular text-sm md:text-base mb-2">
          {categoryDescription}
        </div>
        <div className="flex items-center gap-2 text-[#8C7FF5] font-nekstmedium text-sm md:text-base mt-1">
          <Star className="w-5 h-5 text-[#BFAAFF]" />
          <span>{tip}</span>
        </div>
      </div>
    </section>
  );
}
