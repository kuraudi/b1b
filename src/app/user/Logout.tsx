"use client";
import React from "react";
import { LogOut, ShieldCheck } from "lucide-react";

export default function LogoutPage() {
  // Здесь должна быть ваша функция выхода
  function handleLogout() {
    // Например, очистка токена, редирект, вызов API:
    // localStorage.removeItem("token");
    // window.location.href = "/login";
    alert("Вы вышли из аккаунта!");
  }

  return (
    <div className="w-full h-full bg-gradient-to-br from-[#232136] via-[#232323] to-[#191823] flex flex-col items-center justify-center animate-fade-in">
      <div className="max-w-lg w-full bg-gradient-to-br from-[#232136] via-[#2c2943] to-[#191823] rounded-3xl shadow-2xl border border-[#232136] px-10 py-16 flex flex-col items-center gap-8">
        <LogOut className="w-20 h-20 text-[#8C7FF5] mb-2 animate-bounce" />
        <h1 className="text-3xl font-nekstmedium text-white mb-2 flex items-center gap-2">
          Выход из аккаунта
        </h1>
        <div className="text-lg text-[#BFAAFF] text-center mb-6">
          Вы действительно хотите выйти?
          <br />
          После выхода ваши данные останутся в безопасности.
        </div>
        <button
          className="px-8 py-4 rounded-2xl bg-gradient-to-tr from-[#8C7FF5] to-[#BFAAFF] text-[#232136] font-nekstmedium text-xl shadow-lg hover:from-[#BFAAFF] hover:to-[#8C7FF5] transition mb-4 flex items-center gap-3"
          onClick={handleLogout}
        >
          <LogOut className="w-6 h-6" /> Выйти
        </button>
        <button
          className="px-8 py-4 rounded-2xl bg-[#232136] text-[#BFAAFF] font-nekstmedium border border-[#8C7FF5] hover:bg-[#404040] transition shadow flex items-center gap-3"
          onClick={() => window.history.back()}
        >
          <ShieldCheck className="w-6 h-6" /> Отмена
        </button>
        <style>
          {`
            .animate-fade-in {
              animation: fade-in 0.35s cubic-bezier(.77,0,.175,1);
            }
            @keyframes fade-in {
              from { opacity: 0; transform: translateY(30px);}
              to { opacity: 1; transform: translateY(0);}
            }
            .animate-bounce {
              animation: bounce 1.5s infinite cubic-bezier(.77,0,.175,1);
            }
            @keyframes bounce {
              0% { transform: translateY(0);}
              45% { transform: translateY(-18px);}
              100% { transform: translateY(0);}
            }
          `}
        </style>
      </div>
    </div>
  );
}
