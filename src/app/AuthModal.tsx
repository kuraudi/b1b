import React, { useState, useRef, useEffect } from "react";
import { X, Sparkles, Smartphone, Mail, BadgePercent } from "lucide-react";

// Валидация
const validatePhone = (v: string) =>
  /^(\+7|8)\d{10}$/.test(v.replace(/\D/g, ""));
const validateEmail = (v: string) =>
  /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(v.trim());
const validateINN = (v: string) =>
  /^\d{10}$|^\d{12}$/.test(v.replace(/\D/g, ""));

type Props = {
  open: boolean;
  onClose: () => void;
  onLogin?: (fields: { phone: string; email: string; inn: string }) => void;
};

export const AuthModal: React.FC<Props> = ({ open, onClose, onLogin }) => {
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [inn, setInn] = useState("");
  const [touched, setTouched] = useState<{ [k: string]: boolean }>({});
  const [loading, setLoading] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Фокус на телефон при открытии
  useEffect(() => {
    if (open && modalRef.current) {
      setTimeout(() => {
        modalRef.current?.querySelector("input[name='phone']")?.focus();
      }, 250);
    }
    if (!open) {
      setPhone("");
      setEmail("");
      setInn("");
      setTouched({});
    }
  }, [open]);

  // Закрытие по Esc и клику вне
  useEffect(() => {
    if (!open) return;
    const handler = (e: any) => {
      if (e.key === "Escape") onClose();
      if (
        modalRef.current &&
        e.type === "mousedown" &&
        !modalRef.current.contains(e.target)
      )
        onClose();
    };
    document.addEventListener("keydown", handler);
    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("keydown", handler);
      document.removeEventListener("mousedown", handler);
    };
  }, [open, onClose]);

  // Проверки
  const phoneValid = validatePhone(phone);
  const emailValid = validateEmail(email);
  const innValid = validateINN(inn);
  const allValid = phoneValid && emailValid && innValid;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ phone: true, email: true, inn: true });
    if (!allValid) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin?.({ phone, email, inn });
      onClose();
    }, 1100);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1100000] flex items-center justify-center bg-gradient-to-br from-[#1d1a24]/85 via-[#23222a]/80 to-[#443b51]/70 backdrop-blur-[4px] animate-fadeInAuth">
      <div
        ref={modalRef}
        className={`
          relative rounded-3xl p-8 sm:p-10
          bg-gradient-to-b from-[#221f2e]/95 via-[#29283b]/95 to-[#3e2c54]/90
          shadow-[0_10px_48px_0_#18171c77]
          border-2 border-[#a677ee]
          w-[95vw] max-w-[420px]
          animate-popInAuth
          transition-all duration-300
        `}
      >
        <button
          className="absolute top-5 right-6 text-white hover:text-[#FF3A3A] rounded-full p-1 transition"
          onClick={onClose}
          aria-label="Закрыть"
        >
          <X className="w-7 h-7" />
        </button>

        <div className="flex flex-col items-center gap-2 mb-6 animate-fadeIn">
          <div className="flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-[#a677ee] animate-spin-slow" />
            <span className="text-2xl font-bold text-[#dbb8ff] font-nekstmedium tracking-tight drop-shadow">
              Вход в маркетплейс
            </span>
          </div>
          <div className="text-[#bcb7e5] text-sm font-nekstregular text-center mb-2">
            Для входа укажите свой телефон, e-mail и ИНН
            <br /> (юр. или физ. лицо)
          </div>
        </div>

        <form
          className="flex flex-col gap-5"
          onSubmit={handleSubmit}
          autoComplete="off"
        >
          {/* Телефон */}
          <div className="flex flex-col gap-1 animate-fadeIn delay-75">
            <label
              htmlFor="phone"
              className="text-[#a677ee] font-nekstmedium flex items-center gap-2 text-base"
            >
              <Smartphone className="w-5 h-5" /> Телефон
            </label>
            <input
              name="phone"
              type="tel"
              maxLength={16}
              autoComplete="tel"
              className={`
                transition-all px-4 py-3 rounded-xl bg-[#231c31]/90 border-2 outline-none text-[#dbb8ff] placeholder-[#bcb7e5]/80 font-nekstmedium text-lg
                focus:border-[#a677ee] focus:shadow-[0_0_0_2px_#a677ee40]
                ${
                  touched.phone && !phoneValid
                    ? "border-[#FF3A3A] shake"
                    : "border-[#3a306b]"
                }
              `}
              placeholder="+7 900 000-00-00"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
            />
            {touched.phone && !phoneValid && (
              <span className="text-[#FF3A3A] font-nekstregular  text-xs mt-0.5 animate-fadeIn">
                Введите корректный телефон
              </span>
            )}
          </div>
          {/* Email */}
          <div className="flex flex-col gap-1 animate-fadeIn delay-100">
            <label
              htmlFor="email"
              className="text-[#a677ee] font-nekstmedium flex items-center gap-2 text-base"
            >
              <Mail className="w-5 h-5" /> E-mail
            </label>
            <input
              name="email"
              type="email"
              autoComplete="email"
              className={`
                transition-all px-4 py-3 rounded-xl bg-[#231c31]/90 border-2 outline-none text-[#dbb8ff] placeholder-[#bcb7e5]/80 font-nekstmedium text-lg
                focus:border-[#a677ee] focus:shadow-[0_0_0_2px_#a677ee40]
                ${
                  touched.email && !emailValid
                    ? "border-[#FF3A3A] shake"
                    : "border-[#3a306b]"
                }
              `}
              placeholder="your@email.ru"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, email: true }))}
            />
            {touched.email && !emailValid && (
              <span className="text-[#FF3A3A] font-nekstmedium text-xs mt-0.5 animate-fadeIn">
                Введите корректный e-mail
              </span>
            )}
          </div>
          {/* ИНН */}
          <div className="flex flex-col gap-1 animate-fadeIn delay-150">
            <label
              htmlFor="inn"
              className="text-[#a677ee] font-nekstmedium flex items-center gap-2 text-base"
            >
              <BadgePercent className="w-5 h-5" /> ИНН
            </label>
            <input
              name="inn"
              type="text"
              inputMode="numeric"
              maxLength={12}
              className={`
                transition-all px-4 py-3 rounded-xl bg-[#231c31]/90 border-2 outline-none text-[#dbb8ff] placeholder-[#bcb7e5]/80 font-nekstmedium text-lg
                focus:border-[#a677ee] focus:shadow-[0_0_0_2px_#a677ee40]
                ${
                  touched.inn && !innValid
                    ? "border-[#FF3A3A] shake"
                    : "border-[#3a306b]"
                }
              `}
              placeholder="ИНН (10 или 12 цифр)"
              value={inn}
              onChange={(e) => setInn(e.target.value.replace(/\D/g, ""))}
              onBlur={() => setTouched((t) => ({ ...t, inn: true }))}
            />
            {touched.inn && !innValid && (
              <span className="text-[#FF3A3A] font-nekstmedium text-xs mt-0.5 animate-fadeIn">
                Укажите корректный ИНН
              </span>
            )}
          </div>
          <button
            type="submit"
            disabled={loading || !allValid}
            className={`
              w-full py-3 mt-2 rounded-2xl bg-gradient-to-tr from-[#a677ee] to-[#BFAAFF] text-[#231c31] font-nekstmedium text-lg shadow-lg
              hover:from-[#BFAAFF] hover:to-[#a677ee] transition flex items-center justify-center gap-3
              focus:outline-none focus:ring-2 focus:ring-[#a677ee]/60
              ${
                !allValid
                  ? "opacity-60 cursor-not-allowed"
                  : "hover:scale-[1.03]"
              }
            `}
          >
            {loading ? (
              <>
                <span className="loader mr-2"></span>
                Входим...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Войти
              </>
            )}
          </button>
        </form>
      </div>
      <style jsx global>{`
        @keyframes fadeInAuth {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fadeInAuth {
          animation: fadeInAuth 0.3s cubic-bezier(0.77, 0, 0.175, 1);
        }
        @keyframes popInAuth {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(28px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-popInAuth {
          animation: popInAuth 0.42s cubic-bezier(0.77, 0, 0.175, 1);
        }
        .animate-fadeIn {
          animation: fadeIn 0.36s cubic-bezier(0.77, 0, 0.175, 1);
        }
        .animate-spin-slow {
          animation: spin 2.6s linear infinite;
        }
        .shake {
          animation: shake 0.23s cubic-bezier(0.36, 0.07, 0.19, 0.97) 1;
        }
        @keyframes shake {
          10%,
          90% {
            transform: translateX(-2px);
          }
          20%,
          80% {
            transform: translateX(2px);
          }
          30%,
          50%,
          70% {
            transform: translateX(-4px);
          }
          40%,
          60% {
            transform: translateX(4px);
          }
        }
        .loader {
          border: 3px solid #bcb7e5;
          border-top: 3px solid #a677ee;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          animation: spin 1s linear infinite;
          display: inline-block;
        }
      `}</style>
    </div>
  );
};
