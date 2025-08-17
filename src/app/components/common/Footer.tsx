import React from "react";
import {
  Send,
  Instagram,
  Facebook,
  Linkedin,
  BookOpen,
  Users,
  DollarSign,
  MapPin,
  FileText,
  HelpCircle,
  Mail,
  Phone,
} from "lucide-react";

const COLORS = {
  background: "bg-[#111015]",
  sidebar: "bg-[#181622]/80",
  card: "bg-[#191823]",
  accent: "text-[#8C7FF5]",
  accentBg: "bg-[#272347]",
  border: "border-[#232136]",
  input: "bg-[#232136]",
  inputFocus: "focus:ring-[#8C7FF5]",
  hover: "hover:bg-[#25213b]/80",
};

export default function Footer() {
  return (
    <footer
      className={`w-full  bg-gradient-to-br from-[#161617] via-[#1b1925] to-[#211f28] mt-12 py-0 font-nekstmedium ${COLORS.card}`}
    >
      <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col md:flex-row gap-12 justify-between items-start md:items-center">
        {/* Логотип и описание */}
        <div className="flex flex-col gap-4 items-center md:items-start min-w-[180px]">
          <span className="font-extrabold text-2xl text-white flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#8C7FF5] inline-block"></span>
            b2bMarket
          </span>
          <span className="text-sm text-[#B3B3C7] max-w-[240px] font-nekstregular leading-relaxed">
            Современная B2B-платформа для поиска, покупки и продажи товаров и
            услуг для вашего бизнеса.
          </span>
          <div className="flex gap-3 mt-2">
            <a
              href="#"
              aria-label="Telegram"
              className="hover:text-[#8C7FF5] transition"
            >
              <Send className="w-5 h-5" />
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="hover:text-[#8C7FF5] transition"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="#"
              aria-label="Facebook"
              className="hover:text-[#8C7FF5] transition"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a
              href="#"
              aria-label="LinkedIn"
              className="hover:text-[#8C7FF5] transition"
            >
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
          <span className="text-xs text-[#7C7C92] mt-4 font-nekstregular">
            © {new Date().getFullYear()} b2bMarket. Все права защищены.
          </span>
        </div>
        {/* Быстрые ссылки */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 w-full max-w-2xl">
          <div>
            <div className="text-[#8C7FF5] font-semibold mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4" /> Навигация
            </div>
            <ul className="space-y-2 font-nekstregular">
              <li>
                <a
                  href="#"
                  className="flex items-center gap-2 hover:text-[#8C7FF5] transition"
                >
                  <BookOpen className="w-4 h-4" /> Каталог
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center gap-2 hover:text-[#8C7FF5] transition"
                >
                  <Users className="w-4 h-4" /> Партнерам
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center gap-2 hover:text-[#8C7FF5] transition"
                >
                  <DollarSign className="w-4 h-4" /> Тарифы
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center gap-2 hover:text-[#8C7FF5] transition"
                >
                  <MapPin className="w-4 h-4" /> Контакты
                </a>
              </li>
            </ul>
          </div>
          <div>
            <div className="text-[#8C7FF5] font-semibold mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4" /> Документы
            </div>
            <ul className="space-y-2 font-nekstregular">
              <li>
                <a
                  href="#"
                  className="flex items-center gap-2 hover:text-[#8C7FF5] transition"
                >
                  <FileText className="w-4 h-4" /> Пользовательское соглашение
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center gap-2 hover:text-[#8C7FF5] transition"
                >
                  <FileText className="w-4 h-4" /> Политика конфиденциальности
                </a>
              </li>
            </ul>
          </div>
          <div>
            <div className="text-[#8C7FF5] font-semibold mb-3 flex items-center gap-2">
              <HelpCircle className="w-4 h-4" /> Помощь
            </div>
            <ul className="space-y-2 font-nekstregular">
              <li>
                <a
                  href="#"
                  className="flex items-center gap-2 hover:text-[#8C7FF5] transition"
                >
                  <HelpCircle className="w-4 h-4" /> Центр поддержки
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center gap-2 hover:text-[#8C7FF5] transition"
                >
                  <HelpCircle className="w-4 h-4" /> FAQ
                </a>
              </li>
            </ul>
          </div>
        </div>
        {/* Контакты/Связь */}
        <div className="flex flex-col items-center md:items-end gap-5 min-w-[180px]">
          <div className="flex flex-col gap-2 text-sm font-nekstregular">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-[#8C7FF5]" />
              <a
                href="mailto:info@b2bmarket.ru"
                className="hover:text-[#8C7FF5] transition"
              >
                info@b2bmarket.ru
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-[#8C7FF5]" />
              <a
                href="tel:+78000000000"
                className="hover:text-[#8C7FF5] transition"
              >
                +7 (800) 000-00-00
              </a>
            </div>
          </div>
          <div className="flex gap-3 mt-2">
            <a
              href="#"
              aria-label="Telegram"
              className="hover:text-[#8C7FF5] transition"
            >
              <Send className="w-5 h-5" />
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="hover:text-[#8C7FF5] transition"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="#"
              aria-label="Facebook"
              className="hover:text-[#8C7FF5] transition"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a
              href="#"
              aria-label="LinkedIn"
              className="hover:text-[#8C7FF5] transition"
            >
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
