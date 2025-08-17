"use client";
import React, { useState } from "react";
import {
  Settings,
  Globe,
  Mail,
  Building2,
  Briefcase,
  Star,
  User2,
} from "lucide-react";

// MOCK DATA
const industries = [
  "Ресторанное дело",
  "Ритейл",
  "Здравоохранение",
  "Строительство",
  "Промышленность",
  "Транспорт и логистика",
  "IT и связь",
  "Образование",
  "Биотехнологии",
  "Агробизнес",
  "Финансы",
  "Услуги",
  "HR и кадры",
];

const timezones = [
  "Europe/Moscow",
  "Europe/Kaliningrad",
  "Asia/Yekaterinburg",
  "Asia/Novosibirsk",
  "Asia/Vladivostok",
];

const languages = ["Русский", "English"];

const initialAccount = {
  username: "alexivanov",
  email: "alex.ivanov@mail.com",
  company: "ООО Ресторан-Сервис",
  position: "Директор по развитию",
  industry: industries[0],
  language: languages[0],
  timezone: timezones[0],
};

export default function AccountSettingsTab() {
  const [account, setAccount] = useState(initialAccount);
  const [editMode, setEditMode] = useState(false);

  function startEdit() {
    setEditMode(true);
  }

  function saveAccount(e: React.FormEvent) {
    e.preventDefault();
    setEditMode(false);
  }

  function cancelEdit() {
    setEditMode(false);
  }

  return (
    <div className="w-full min-h-[60vh] flex flex-col px-0 py-0 items-center justify-start animate-fade-in">
      {/* Header */}
      <div className="w-full px-10 mt-8 mb-6">
        <h2 className="text-3xl font-nekstmedium text-white flex items-center gap-2">
          <Settings className="w-8 h-8 text-[#8C7FF5]" />
          Аккаунт
        </h2>
      </div>
      {/* Grid, stretched to viewport */}
      <div className="w-full max-w-[1600px] grid grid-cols-1 lg:grid-cols-2 gap-14 px-10 py-4">
        {/* Left side: Info summary (non-edit mode) */}
        {!editMode && (
          <>
            <div className="flex flex-col gap-8">
              <div className="rounded-3xl bg-gradient-to-br from-[#232136] via-[#2c2943] to-[#191823] shadow-xl border border-[#232136] px-8 py-8 flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <span className="text-xl text-[#BFAAFF] font-nekstmedium flex items-center gap-2">
                    <User2 className="w-5 h-5" />
                    {account.username}
                  </span>
                  <span className="text-base text-[#BFAAFF] flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    {account.email}
                  </span>
                </div>
                <div className="flex flex-col gap-2 mt-2">
                  <span className="flex items-center gap-2 text-base text-[#BFAAFF]">
                    <Building2 className="w-5 h-5" />
                    {account.company}
                  </span>
                  <span className="flex items-center gap-2 text-base text-[#BFAAFF]">
                    <Briefcase className="w-5 h-5" />
                    {account.position}
                  </span>
                  <span className="flex items-center gap-2 text-base text-[#BFAAFF]">
                    <Star className="w-5 h-5" />
                    {account.industry}
                  </span>
                </div>
              </div>
            </div>
            {/* Right side: Settings summary */}
            <div className="flex flex-col gap-8">
              <div className="rounded-3xl bg-gradient-to-br from-[#232136] via-[#2c2943] to-[#191823] shadow-xl border border-[#232136] px-8 py-8 flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <span className="flex items-center gap-2 text-base text-[#BFAAFF]">
                    <Globe className="w-5 h-5" />
                    Язык интерфейса: <b>{account.language}</b>
                  </span>
                  <span className="flex items-center gap-2 text-base text-[#BFAAFF]">
                    <Globe className="w-5 h-5" />
                    Временная зона: <b>{account.timezone}</b>
                  </span>
                </div>
                <button
                  className="mt-8 px-8 py-4 rounded-2xl bg-gradient-to-tr from-[#8C7FF5] to-[#BFAAFF] text-[#232136] font-nekstmedium text-lg shadow-lg hover:from-[#BFAAFF] hover:to-[#8C7FF5] transition w-full"
                  onClick={startEdit}
                >
                  Редактировать
                </button>
              </div>
            </div>
          </>
        )}

        {/* EDIT MODE: Stretched form, 2 columns */}
        {editMode && (
          <form
            className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-14"
            onSubmit={saveAccount}
          >
            <div className="rounded-3xl bg-gradient-to-br from-[#232136] via-[#2c2943] to-[#191823] shadow-xl border border-[#232136] px-8 py-8 flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                <label className="text-xs text-[#BFAAFF] font-nekstmedium">
                  Username
                </label>
                <input
                  type="text"
                  value={account.username}
                  onChange={(e) =>
                    setAccount({ ...account, username: e.target.value })
                  }
                  className="px-5 py-3 rounded-xl border border-[#232136] bg-[#232136] text-white font-nekstmedium text-lg"
                  required
                />
                <label className="text-xs text-[#BFAAFF] font-nekstmedium mt-4">
                  Email
                </label>
                <input
                  type="email"
                  value={account.email}
                  onChange={(e) =>
                    setAccount({ ...account, email: e.target.value })
                  }
                  className="px-5 py-3 rounded-xl border border-[#232136] bg-[#232136] text-white font-nekstmedium text-lg"
                  required
                />
                <label className="text-xs text-[#BFAAFF] font-nekstmedium mt-4">
                  Компания
                </label>
                <input
                  type="text"
                  value={account.company}
                  onChange={(e) =>
                    setAccount({ ...account, company: e.target.value })
                  }
                  className="px-5 py-3 rounded-xl border border-[#232136] bg-[#232136] text-white font-nekstmedium text-lg"
                />
                <label className="text-xs text-[#BFAAFF] font-nekstmedium mt-4">
                  Должность
                </label>
                <input
                  type="text"
                  value={account.position}
                  onChange={(e) =>
                    setAccount({ ...account, position: e.target.value })
                  }
                  className="px-5 py-3 rounded-xl border border-[#232136] bg-[#232136] text-white font-nekstmedium text-lg"
                />
                <label className="text-xs text-[#BFAAFF] font-nekstmedium mt-4">
                  Отрасль
                </label>
                <select
                  value={account.industry}
                  onChange={(e) =>
                    setAccount({ ...account, industry: e.target.value })
                  }
                  className="px-5 py-3 rounded-xl border border-[#232136] bg-[#232136] text-white font-nekstmedium text-lg"
                >
                  {industries.map((ind) => (
                    <option value={ind} key={ind}>
                      {ind}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="rounded-3xl bg-gradient-to-br from-[#232136] via-[#2c2943] to-[#191823] shadow-xl border border-[#232136] px-8 py-8 flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                <label className="text-xs text-[#BFAAFF] font-nekstmedium">
                  Язык интерфейса
                </label>
                <select
                  value={account.language}
                  onChange={(e) =>
                    setAccount({ ...account, language: e.target.value })
                  }
                  className="px-5 py-3 rounded-xl border border-[#232136] bg-[#232136] text-white font-nekstmedium text-lg"
                >
                  {languages.map((lang) => (
                    <option value={lang} key={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
                <label className="text-xs text-[#BFAAFF] font-nekstmedium mt-4">
                  Временная зона
                </label>
                <select
                  value={account.timezone}
                  onChange={(e) =>
                    setAccount({ ...account, timezone: e.target.value })
                  }
                  className="px-5 py-3 rounded-xl border border-[#232136] bg-[#232136] text-white font-nekstmedium text-lg"
                >
                  {timezones.map((tz) => (
                    <option value={tz} key={tz}>
                      {tz}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-4 mt-12">
                <button
                  type="submit"
                  className="flex-1 px-6 py-4 rounded-2xl bg-gradient-to-tr from-[#8C7FF5] to-[#BFAAFF] text-[#232136] font-nekstmedium text-lg shadow-lg hover:from-[#BFAAFF] hover:to-[#8C7FF5] transition"
                >
                  Сохранить
                </button>
                <button
                  type="button"
                  className="flex-1 px-6 py-4 rounded-2xl bg-[#232136] text-[#BFAAFF] font-nekstmedium border border-[#8C7FF5] hover:bg-[#404040] transition shadow"
                  onClick={cancelEdit}
                >
                  Отмена
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
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
