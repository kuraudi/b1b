"use client";
import React, { useState } from "react";
import {
  ShieldCheck,
  Lock,
  Key,
  CheckCircle,
  XCircle,
  Edit2,
  Info,
} from "lucide-react";

export default function SecuritySettingsTab() {
  // 2FA state
  const [twoFa, setTwoFa] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  // 2FA modal state
  const [show2faModal, setShow2faModal] = useState(false);
  const [code, setCode] = useState("");
  const [step, setStep] = useState(0); // 0: intro, 1: QR, 2: code input

  function handleEnable2fa() {
    setShow2faModal(true);
    setStep(1);
  }

  function handleConfirm2fa(e: React.FormEvent) {
    e.preventDefault();
    if (code.length === 6) {
      setTwoFa(true);
      setShow2faModal(false);
      setCode("");
      setStep(0);
    }
  }

  function handleDisable2fa() {
    setShow2faModal(true);
    setStep(2);
  }

  function handleTurnOff2fa(e: React.FormEvent) {
    e.preventDefault();
    // тут должна быть проверка кода/пароля
    setTwoFa(false);
    setShow2faModal(false);
    setCode("");
    setStep(0);
  }

  return (
    <div className="w-full min-h-[60vh] flex flex-col px-0 py-0 items-center justify-start animate-fade-in">
      <div className="w-full px-10 mt-8 mb-6">
        <h2 className="text-3xl font-nekstmedium text-white flex items-center gap-2">
          <ShieldCheck className="w-8 h-8 text-[#8C7FF5]" />
          Безопасность
        </h2>
      </div>
      <div className="w-full max-w-[1400px] grid grid-cols-1 md:grid-cols-2 gap-14 px-10 py-4">
        {/* Password */}
        <div className="rounded-3xl bg-gradient-to-br from-[#232136] via-[#2c2943] to-[#191823] shadow-xl border border-[#232136] px-10 py-10 flex flex-col gap-8">
          <div className="flex items-center gap-3 mb-4">
            <Lock className="w-7 h-7 text-[#8C7FF5]" />
            <span className="text-xl text-[#BFAAFF] font-nekstmedium">
              Смена пароля
            </span>
          </div>
          <span className="text-base text-[#b8b8d1]">
            Рекомендуем использовать уникальный и сложный пароль для вашей
            учетной записи.
          </span>
          <button
            className="mt-2 px-8 py-4 rounded-2xl bg-gradient-to-tr from-[#8C7FF5] to-[#BFAAFF] text-[#232136] font-nekstmedium text-lg shadow-lg hover:from-[#BFAAFF] hover:to-[#8C7FF5] transition w-fit"
            onClick={() => setShowChangePassword(true)}
          >
            <Edit2 className="w-5 h-5 mr-2 inline-block" /> Сменить пароль
          </button>
        </div>
        {/* 2FA */}
        <div className="rounded-3xl bg-gradient-to-br from-[#232136] via-[#2c2943] to-[#191823] shadow-xl border border-[#232136] px-10 py-10 flex flex-col gap-8">
          <div className="flex items-center gap-3 mb-4">
            <Key className="w-7 h-7 text-[#8C7FF5]" />
            <span className="text-xl text-[#BFAAFF] font-nekstmedium">
              Двухфакторная аутентификация (2FA)
            </span>
          </div>
          <span className="text-base text-[#b8b8d1]">
            Усиленная защита аккаунта с помощью кода-подтверждения из приложения
            Google Authenticator, 1Password или другого.
          </span>
          <div className="flex items-center gap-4 mt-2">
            {twoFa ? (
              <button
                className="px-6 py-3 rounded-xl bg-[#36cb7f] text-white font-nekstmedium text-lg flex items-center gap-2 shadow hover:bg-[#259c5c] transition"
                onClick={handleDisable2fa}
              >
                <CheckCircle className="w-5 h-5" /> 2FA включено
              </button>
            ) : (
              <button
                className="px-6 py-3 rounded-xl bg-gradient-to-tr from-[#8C7FF5] to-[#BFAAFF] text-[#232136] font-nekstmedium text-lg flex items-center gap-2 shadow hover:from-[#BFAAFF] hover:to-[#8C7FF5] transition"
                onClick={handleEnable2fa}
              >
                <XCircle className="w-5 h-5" /> Включить 2FA
              </button>
            )}
          </div>
          <div className="flex flex-col gap-2 mt-4 text-xs text-[#8C7FF5]">
            {twoFa ? (
              <>
                <span>Двухфакторная аутентификация активна.</span>
                <span>
                  Для отключения потребуется подтверждение (код или пароль).
                </span>
              </>
            ) : (
              <span>
                Рекомендуем включить для максимальной безопасности вашего
                аккаунта.
              </span>
            )}
          </div>
        </div>
      </div>
      {/* Security Recommendations */}
      <div className="w-full max-w-[1400px] px-10 py-8">
        <div className="rounded-3xl bg-gradient-to-br from-[#232136] via-[#2c2943] to-[#191823] shadow-xl border border-[#232136] px-10 py-8 flex flex-col gap-6">
          <div className="flex items-center gap-3 mb-3">
            <ShieldCheck className="w-6 h-6 text-[#8C7FF5]" />
            <span className="text-lg text-[#BFAAFF] font-nekstmedium">
              Рекомендации по безопасности
            </span>
          </div>
          <ul className="list-disc pl-8 text-base text-[#b8b8d1] flex flex-col gap-2">
            <li>Используйте уникальные пароли для разных сервисов.</li>
            <li>Включите двухфакторную аутентификацию.</li>
            <li>Не передавайте свои пароли третьим лицам.</li>
            <li>Проверяйте адрес сайта перед вводом пароля.</li>
            <li>Следите за активностью входа в аккаунт.</li>
          </ul>
        </div>
      </div>
      {/* Change password modal */}
      {showChangePassword && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-[#232136] rounded-2xl p-8 shadow-2xl max-w-sm w-full flex flex-col gap-5">
            <span className="text-lg font-nekstmedium text-white mb-3 flex items-center gap-2">
              <Lock className="w-6 h-6" /> Смена пароля
            </span>
            <form className="flex flex-col gap-4">
              <input
                type="password"
                placeholder="Текущий пароль"
                className="px-3 py-2 rounded-lg border border-[#232136] bg-[#191823] text-white font-nekstmedium"
                autoComplete="current-password"
              />
              <input
                type="password"
                placeholder="Новый пароль"
                className="px-3 py-2 rounded-lg border border-[#232136] bg-[#191823] text-white font-nekstmedium"
                autoComplete="new-password"
              />
              <input
                type="password"
                placeholder="Повторите новый пароль"
                className="px-3 py-2 rounded-lg border border-[#232136] bg-[#191823] text-white font-nekstmedium"
                autoComplete="new-password"
              />
              <div className="flex gap-3 mt-2">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-tr from-[#8C7FF5] to-[#BFAAFF] text-[#232136] font-nekstmedium shadow hover:from-[#BFAAFF] hover:to-[#8C7FF5] transition"
                  onClick={() => setShowChangePassword(false)}
                >
                  Сохранить
                </button>
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl bg-[#232136] text-[#BFAAFF] font-nekstmedium border border-[#8C7FF5] hover:bg-[#404040] transition shadow"
                  onClick={() => setShowChangePassword(false)}
                >
                  Отмена
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* 2FA Modal */}
      {show2faModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-[#232136] rounded-2xl p-8 shadow-2xl max-w-sm w-full flex flex-col gap-6">
            <span className="text-lg font-nekstmedium text-white mb-3 flex items-center gap-2">
              <Key className="w-6 h-6" />
              {twoFa ? "Отключить 2FA" : "Включить 2FA"}
            </span>
            {step === 1 && (
              <>
                <span className="text-base text-[#b8b8d1]">
                  Отсканируйте QR-код из вашего приложения аутентификации или
                  введите секрет вручную:
                </span>
                {/* Место под QR и секрет */}
                <div className="flex flex-col items-center gap-3 my-2">
                  <div className="bg-[#191823] rounded-xl flex items-center justify-center h-28 w-28">
                    <span className="text-[#8C7FF5] text-xl">QR</span>
                  </div>
                  <span className="text-xs text-[#BFAAFF]">
                    Секрет: <b>JBSWY3DPEHPK3PXP</b>
                  </span>
                </div>
                <span className="text-base text-[#b8b8d1] mt-2">
                  После подключения введите код из приложения:
                </span>
                <form
                  className="flex flex-col gap-3 mt-2"
                  onSubmit={handleConfirm2fa}
                >
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="6-значный код"
                    className="px-3 py-2 rounded-lg border border-[#232136] bg-[#191823] text-white font-nekstmedium text-center text-xl tracking-widest"
                    maxLength={6}
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-gradient-to-tr from-[#8C7FF5] to-[#BFAAFF] text-[#232136] font-nekstmedium shadow hover:from-[#BFAAFF] hover:to-[#8C7FF5] transition"
                  >
                    Подтвердить и включить 2FA
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 rounded-xl bg-[#232136] text-[#BFAAFF] font-nekstmedium border border-[#8C7FF5] hover:bg-[#404040] transition shadow"
                    onClick={() => {
                      setShow2faModal(false);
                      setCode("");
                      setStep(0);
                    }}
                  >
                    Отмена
                  </button>
                </form>
              </>
            )}
            {step === 2 && (
              <>
                <span className="text-base text-[#b8b8d1]">
                  Для отключения 2FA введите код из приложения или пароль:
                </span>
                <form
                  className="flex flex-col gap-3 mt-2"
                  onSubmit={handleTurnOff2fa}
                >
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Код или пароль"
                    className="px-3 py-2 rounded-lg border border-[#232136] bg-[#191823] text-white font-nekstmedium text-center text-xl tracking-widest"
                    maxLength={32}
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-gradient-to-tr from-[#8C7FF5] to-[#BFAAFF] text-[#232136] font-nekstmedium shadow hover:from-[#BFAAFF] hover:to-[#8C7FF5] transition"
                  >
                    Отключить 2FA
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 rounded-xl bg-[#232136] text-[#BFAAFF] font-nekstmedium border border-[#8C7FF5] hover:bg-[#404040] transition shadow"
                    onClick={() => {
                      setShow2faModal(false);
                      setCode("");
                      setStep(0);
                    }}
                  >
                    Отмена
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
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
