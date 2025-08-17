"use client";
import React, { useState } from "react";
import HeaderNav from "../components/common/HeaderNav";
import Footer from "../components/common/Footer";
import ProfileSettingsTab from "./Profile";
import AccountSettingsTab from "./Account";
import {
  User2,
  Mail,
  Phone,
  Edit2,
  UploadCloud,
  Eye,
  EyeOff,
  ShieldCheck,
  Lock,
  Key,
  ChevronRight,
  Bell,
  GitBranch,
  Trash2,
  CheckCircle,
  XCircle,
  FileText,
  Settings,
  Users,
  Link2,
  Globe,
  CreditCard,
  Plus,
  ExternalLink,
  AlertCircle,
  Info,
} from "lucide-react";
import SecuritySettingsTab from "./Secutity";
import LogoutPage from "./Logout";
import PaymentsPage from "./Payments";

// MOCK DATA
const avatar = "/main/catalog/id2.jpg";
const name = "Алексей Иванов";
const username = "alexivanov";
const email = "alex.ivanov@mail.com";
const phone = "+7 (915) 888-88-88";
const company = "ООО Ресторан-Сервис";
const position = "Директор по развитию";
const description =
  "Профессионал рынка B2B, организую поставки сырья и оборудования для ресторанов. Открыт для новых партнерств.";
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

const integrations = [
  {
    id: 1,
    name: "Telegram-бот",
    status: "Активен",
    settings: "Настроить чат-уведомления",
  },
  { id: 2, name: "CRM Amo", status: "Отключен", settings: "Подключить AmoCRM" },
  {
    id: 3,
    name: "Google Sheets",
    status: "Активен",
    settings: "Синхронизация новых заказов",
  },
];
const paymentMethods = [
  { id: 1, type: "Visa", number: "**** 1234", main: true },
  { id: 2, type: "MasterCard", number: "**** 8765", main: false },
];
const invoices = [
  {
    id: 1,
    date: "2025-07-01",
    amount: "3 200 ₽",
    plan: "PRO",
    status: "Оплачено",
  },
  {
    id: 2,
    date: "2025-06-01",
    amount: "3 200 ₽",
    plan: "PRO",
    status: "Оплачено",
  },
  {
    id: 3,
    date: "2025-05-01",
    amount: "3 200 ₽",
    plan: "PRO",
    status: "Оплачено",
  },
];

export default function UserSettingsPage() {
  // Profile state
  const [showEmail, setShowEmail] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [editProfile, setEditProfile] = useState(false);
  const [profile, setProfile] = useState({
    avatar,
    name,
    username,
    email,
    phone,
    company,
    position,
    industry: industries[0],
    description,
  });

  // Account
  const [language, setLanguage] = useState("Русский");
  const [timezone, setTimezone] = useState("Europe/Moscow");

  // Security
  const [twoFa, setTwoFa] = useState(true);
  const [changePassword, setChangePassword] = useState(false);
  const [sshKeys, setSshKeys] = useState([
    {
      id: 1,
      name: "Work Laptop",
      fingerprint: "SHA256:abcd...",
      added: "2025-01-10",
    },
    {
      id: 2,
      name: "Home PC",
      fingerprint: "SHA256:1234...",
      added: "2025-02-22",
    },
  ]);
  const [newSshKey, setNewSshKey] = useState({ name: "", key: "" });

  // Notifications
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifySms, setNotifySms] = useState(false);
  const [notifyPush, setNotifyPush] = useState(true);
  const [notifyDigest, setNotifyDigest] = useState(true);

  // Integrations
  const [showIntegrationModal, setShowIntegrationModal] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState(null);

  // Billing
  const [plan, setPlan] = useState("PRO");

  // Danger zone
  const [deleteModal, setDeleteModal] = useState(false);

  // Tabs
  const tabs = [
    { key: "profile", name: "Профиль", icon: <User2 className="w-5 h-5" /> },
    // { key: "account", name: "Аккаунт", icon: <Settings className="w-5 h-5" /> },
    {
      key: "security",
      name: "Безопасность",
      icon: <ShieldCheck className="w-5 h-5" />,
    },
    {
      key: "notifications",
      name: "Уведомления",
      icon: <Bell className="w-5 h-5" />,
    },
    {
      key: "integrations",
      name: "Интеграции",
      icon: <Link2 className="w-5 h-5" />,
    },
    // { key: "billing", name: "Платежи", icon: <FileText className="w-5 h-5" /> },
  ];
  const [tab, setTab] = useState("profile");

  // Profile edit handlers
  function handleProfileSave(e: React.FormEvent) {
    e.preventDefault();
    setProfile(profile);
    setEditProfile(false);
  }

  function handleAddSshKey(e: React.FormEvent) {
    e.preventDefault();
    if (newSshKey.name && newSshKey.key) {
      setSshKeys([
        ...sshKeys,
        {
          ...newSshKey,
          id: Date.now(),
          added: new Date().toISOString().slice(0, 10),
        },
      ]);
      setNewSshKey({ name: "", key: "" });
    }
  }

  function handleRemoveSshKey(id: number) {
    setSshKeys(sshKeys.filter((k) => k.id !== id));
  }

  // Integration modal
  function openIntegrationModal(integration: any) {
    setSelectedIntegration(integration);
    setShowIntegrationModal(true);
  }

  function closeIntegrationModal() {
    setShowIntegrationModal(false);
    setSelectedIntegration(null);
  }

  return (
    <div className="wrapper w-full bg-gradient-to-br from-[#232136] via-[#232323] to-[#191823] flex flex-col font-nekstregular m-auto">
      <HeaderNav />
      <main className="flex-1 w-full  mx-auto px-0 py-0 flex flex-col">
        <h1 className="text-3xl font-nekstmedium text-white mb-0 mt-5 px-10 bg-r">
          <Settings className="w-7 h-7 text-[#8C7FF5] inline-block mr-2" />
          Настройки аккаунта
        </h1>
        <div className="flex w-full mt-8 gap-0">
          {/* Sidebar tabs */}
          <aside
            className="flex flex-row md:flex-col md:w-64 w-full border-r border-[#2d2347] bg-[#232136]/90 shrink-0 z-10 backdrop-blur-sm"
            style={{
              boxShadow: "0 4px 24px 0 #1a1337aa, 0 1.5px 0 #2d2347",
            }}
          >
            {tabs.map((t) => (
              <button
                key={t.key}
                className={`
        group relative flex items-center gap-3 px-6 py-4 w-full
        font-nekstmedium text-base md:text-lg transition-all duration-200
        border-b border-[#2d2347] md:border-b-0 md:border-r-0
        ${
          tab === t.key
            ? "text-[#BFAAFF] font-semibold"
            : "text-[#8c7ff5] font-medium hover:text-[#BFAAFF]"
        }
        overflow-hidden
      `}
                style={{
                  borderLeft:
                    tab === t.key
                      ? "4px solid #8C7FF5"
                      : "4px solid transparent",
                  boxShadow:
                    tab === t.key
                      ? "0 2px 20px 0 #8c7ff5cc, 0 0 0 1.5px #8C7FF5"
                      : "",
                  zIndex: tab === t.key ? 1 : 0,
                  background:
                    tab === t.key
                      ? "linear-gradient(90deg, rgba(140,127,245,0.18) 0%, rgba(191,170,255,0.09) 100%)"
                      : "transparent",
                }}
                onClick={() => setTab(t.key)}
              >
                {/* Animated glowing background for active tab */}
                {tab === t.key && (
                  <span
                    className="absolute left-0 top-0 h-full w-full pointer-events-none"
                    style={{
                      background:
                        "radial-gradient(circle at left, #8c7ff5 0%, transparent 70%)",
                      opacity: 0.13,
                      filter: "blur(6px)",
                      zIndex: 0,
                    }}
                  />
                )}
                <span
                  className={`transition-transform duration-200 ${
                    tab === t.key
                      ? "scale-110 drop-shadow-[0_0_8px_#8c7ff5]"
                      : "scale-100"
                  }`}
                  style={{
                    zIndex: 1,
                  }}
                >
                  {t.icon}
                </span>
                <span className="z-10">{t.name}</span>
                {/* Neon animated bar */}
                {tab === t.key && (
                  <span
                    className="absolute left-0 top-0 h-full w-1 rounded-r-xl bg-gradient-to-b from-[#8c7ff5] to-[#bfaaff] animate-pulse"
                    style={{
                      boxShadow: "0 0 16px 2px #8c7ff5aa",
                      opacity: 0.9,
                    }}
                  />
                )}
              </button>
            ))}
          </aside>

          {/* Main content area */}
          <section className="flex-1 px-0 py-0 w-full min-h-[700px] ">
            <div className="w-full h-full px-10">
              {/* PROFILE */}
              {tab === "profile" && <ProfileSettingsTab></ProfileSettingsTab>}

              {/* ACCOUNT */}
              {/* {tab === "account" && <AccountSettingsTab />} */}

              {/* SECURITY */}
              {tab === "security" && <SecuritySettingsTab />}

              {/* NOTIFICATIONS */}
              {tab === "notifications" && (
                <div className="max-w-3xl flex flex-col gap-10">
                  <div>
                    <span className="text-lg font-nekstmedium text-[#BFAAFF] mb-2 flex items-center gap-2">
                      <Bell className="w-5 h-5" /> Центр уведомлений
                    </span>
                    <div className="flex flex-col gap-4 mt-4 max-w-xl">
                      <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-[#232136]/80">
                        <span className="flex items-center gap-2 text-[#BFAAFF]">
                          <Mail className="w-4 h-4" /> Email-уведомления
                        </span>
                        <input
                          type="checkbox"
                          checked={notifyEmail}
                          onChange={(e) => setNotifyEmail(e.target.checked)}
                          className="accent-[#8C7FF5] w-5 h-5"
                        />
                      </div>
                      <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-[#232136]/80">
                        <span className="flex items-center gap-2 text-[#BFAAFF]">
                          <Phone className="w-4 h-4" /> SMS-уведомления
                        </span>
                        <input
                          type="checkbox"
                          checked={notifySms}
                          onChange={(e) => setNotifySms(e.target.checked)}
                          className="accent-[#8C7FF5] w-5 h-5"
                        />
                      </div>
                      <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-[#232136]/80">
                        <span className="flex items-center gap-2 text-[#BFAAFF]">
                          <Bell className="w-4 h-4" /> Push-уведомления
                        </span>
                        <input
                          type="checkbox"
                          checked={notifyPush}
                          onChange={(e) => setNotifyPush(e.target.checked)}
                          className="accent-[#8C7FF5] w-5 h-5"
                        />
                      </div>
                      <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-[#232136]/80">
                        <span className="flex items-center gap-2 text-[#BFAAFF]">
                          <Globe className="w-4 h-4" /> Еженедельная сводка
                        </span>
                        <input
                          type="checkbox"
                          checked={notifyDigest}
                          onChange={(e) => setNotifyDigest(e.target.checked)}
                          className="accent-[#8C7FF5] w-5 h-5"
                        />
                      </div>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#232136]/80 hover:bg-[#8C7FF5]/10 transition text-[#BFAAFF] font-nekstregular mt-6 w-fit">
                      <Settings className="w-4 h-4" /> Настроить уведомления{" "}
                      <ChevronRight className="w-4 h-4 ml-auto" />
                    </button>
                  </div>
                </div>
              )}

              {/* INTEGRATIONS */}
              {tab === "integrations" && (
                <div className="max-w-3xl flex flex-col gap-10">
                  <div>
                    <span className="text-lg font-nekstmedium text-[#BFAAFF] mb-2 flex items-center gap-2">
                      <Link2 className="w-5 h-5" /> Интеграции
                    </span>
                    <ul className="flex flex-col gap-3 mt-4 max-w-xl">
                      {integrations.map((i) => (
                        <li
                          key={i.id}
                          className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#232136]/80 hover:bg-[#8C7FF5]/10 transition text-white font-nekstregular"
                        >
                          <GitBranch className="w-4 h-4 text-[#8C7FF5]" />
                          <span className="font-nekstmedium">{i.name}</span>
                          <span
                            className={`ml-auto px-3 py-1 rounded font-nekstmedium text-xs ${
                              i.status === "Активен"
                                ? "bg-[#36cb7f]/30 text-[#36cb7f]"
                                : "bg-[#FFD700]/20 text-[#FFD700]"
                            }`}
                          >
                            {i.status}
                          </span>
                          <button
                            className="ml-2 px-2 py-1 rounded-lg bg-[#232136] text-[#BFAAFF] hover:bg-[#8C7FF5]/20 font-nekstmedium transition text-xs"
                            onClick={() => openIntegrationModal(i)}
                          >
                            Управлять
                          </button>
                        </li>
                      ))}
                      <li className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#232136]/80 text-white font-nekstregular">
                        <Plus className="w-4 h-4 text-[#8C7FF5]" />
                        <span className="font-nekstmedium">
                          Добавить интеграцию
                        </span>
                        <button
                          className="ml-auto px-2 py-1 rounded-lg bg-[#8C7FF5] text-[#232136] font-nekstmedium transition text-xs hover:bg-[#BFAAFF]"
                          onClick={() =>
                            openIntegrationModal({ name: "Новая интеграция" })
                          }
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </li>
                    </ul>
                  </div>
                  {/* Integration modal */}
                  {showIntegrationModal && (
                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                      <div className="bg-[#232136] rounded-2xl p-8 shadow-2xl max-w-sm w-full flex flex-col gap-5">
                        <span className="text-lg font-nekstmedium text-white mb-3 flex items-center gap-2">
                          <Link2 className="w-6 h-6" />{" "}
                          {selectedIntegration?.name}
                        </span>
                        <span className="text-base text-[#BFAAFF]">
                          {selectedIntegration?.settings ||
                            "Настроить интеграцию"}
                        </span>
                        <div className="flex gap-3 mt-2">
                          <button className="px-4 py-2 rounded-xl bg-gradient-to-tr from-[#8C7FF5] to-[#BFAAFF] text-[#232136] font-nekstmedium shadow hover:from-[#BFAAFF] hover:to-[#8C7FF5]">
                            Сохранить
                          </button>
                          <button
                            className="px-4 py-2 rounded-xl bg-[#232136] text-[#BFAAFF] font-nekstmedium border border-[#8C7FF5] hover:bg-[#404040]"
                            onClick={closeIntegrationModal}
                          >
                            Отмена
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* BILLING */}
              {tab === "billing" && <PaymentsPage></PaymentsPage>}

              {/* DANGER ZONE */}
              {/* {tab === "danger" && <LogoutPage></LogoutPage>} */}
            </div>
          </section>
        </div>
      </main>
      <Footer />
      <style>
        {`
          .animate-fade-in {
            animation: fade-in 0.25s cubic-bezier(.77,0,.175,1);
          }
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(18px);}
            to { opacity: 1; transform: translateY(0);}
          }
        `}
      </style>
    </div>
  );
}
