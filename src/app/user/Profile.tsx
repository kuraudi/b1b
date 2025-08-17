"use client";
import React, { useState } from "react";
import {
  Edit2,
  UploadCloud,
  Eye,
  EyeOff,
  Mail,
  Phone,
  Building2,
  Briefcase,
  Star,
  Sparkle,
  MessageSquare,
  Star as StarIcon,
  User2,
  Users,
  MapPin,
  CheckCircle2,
  ThumbsUp,
  BadgeCheck,
  Link2,
  ClipboardList,
  Box,
  Handshake,
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

const initialProfile = {
  avatar: "/main/catalog/id2.jpg",
  name: "Алексей Иванов",
  username: "alexivanov",
  email: "alex.ivanov@mail.com",
  phone: "+7 (915) 888-88-88",
  company: "ООО Ресторан-Сервис",
  position: "Директор по развитию",
  industry: industries[0],
  description:
    "Профессионал рынка B2B, организую поставки сырья и оборудования для ресторанов. Открыт для новых партнерств.",
  companyINN: "7712345678",
  companyAddress: "г. Москва, ул. Ленина, 1",
  website: "https://rest-servis.ru",
  legalStatus: "Юридическое лицо",
  verified: true,
  rating: 4.8,
  b2bRole: "Поставщик",
  completedDeals: 43,
  responseTime: "В среднем 2ч",
  minOrder: "от 10 000 ₽",
  productRange: "Поставки продуктов, кухонное оборудование",
  certifications: ["ISO 9001", "Сертификат поставщика"],
  partners: 22,
};

const mockReviews = [
  {
    id: 1,
    author: "Мария Петрова",
    authorAvatar: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 5,
    text: "Отличный партнер для бизнеса! Все сделки проходят прозрачно и быстро.",
    date: "2025-07-01",
  },
  {
    id: 2,
    author: "Игорь Сидоров",
    authorAvatar: "https://randomuser.me/api/portraits/men/23.jpg",
    rating: 4,
    text: "Приятно работать, всегда на связи. Было одно недоразумение, но решили быстро.",
    date: "2025-06-15",
  },
  {
    id: 3,
    author: "b2bmarket",
    authorAvatar: "/main/catalog/id2.jpg",
    rating: 5,
    text: "Рекомендуем! Профессионал своего дела.",
    date: "2025-06-08",
  },
];

export default function ProfileSettingsTab() {
  const [profile, setProfile] = useState(initialProfile);
  const [editMode, setEditMode] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(profile.avatar);

  // Avatar upload handler
  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = function (ev) {
        setAvatarPreview(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  function startEdit() {
    setEditMode(true);
  }
  function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setProfile({ ...profile, avatar: avatarPreview });
    setEditMode(false);
  }
  function cancelEdit() {
    setAvatarPreview(profile.avatar);
    setEditMode(false);
  }

  // Сертификаты
  function handleCertChange(index: number, value: string) {
    const certs = [...profile.certifications];
    certs[index] = value;
    setProfile({ ...profile, certifications: certs });
  }
  function addCertification() {
    setProfile({ ...profile, certifications: [...profile.certifications, ""] });
  }
  function removeCertification(index: number) {
    const certs = [...profile.certifications];
    certs.splice(index, 1);
    setProfile({ ...profile, certifications: certs });
  }

  return (
    <div className="w-full min-h-[60vh] flex flex-col px-0 py-0 items-center justify-start animate-fade-in ">
      {/* Header */}
      <div className="w-full max-w-[1400px] px-6 md:px-10 mt-0 mb-8 flex flex-col md:flex-row gap-10 items-center">
        {/* Avatar block */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative group">
            <img
              src={avatarPreview}
              alt="Avatar"
              className="w-44 h-44 rounded-full border-4 border-[#8C7FF5] object-cover shadow-[0_8px_48px_0_rgba(140,127,245,0.15)] group-hover:scale-105 transition-all duration-200"
            />
            {profile.verified && (
              <span className="absolute bottom-4 left-4 flex items-center gap-1 bg-[#191823]/80 text-[#6DF5B3] rounded-xl px-3 py-1 text-xs font-nekstmedium shadow-lg z-10 border border-[#6DF5B3]/30 animate-pulse">
                <BadgeCheck className="w-4 h-4" /> Верифицирован
              </span>
            )}
            {editMode && (
              <label
                className="absolute bottom-4 right-4 bg-[#232136] p-3 rounded-full border-2 border-[#8C7FF5] hover:bg-[#8C7FF5]/30 transition cursor-pointer z-10"
                title="Загрузить новое фото"
              >
                <UploadCloud className="w-6 h-6 text-[#8C7FF5]" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </label>
            )}
            <span className="absolute top-3 left-3 bg-gradient-to-r from-[#8C7FF5]/80 to-[#BFAAFF]/60 text-[#232136] rounded-full px-3 py-1 text-xs font-nekstmedium shadow-lg flex items-center gap-1 border border-[#BFAAFF]/30">
              <Sparkle className="w-4 h-4" />
              PRO
            </span>
          </div>
          <div className="flex flex-col items-center mt-1">
            <span className="flex items-center gap-2 text-[#6DE7C8] text-lg font-nekstmedium">
              <StarIcon className="w-5 h-5" fill="#FFD700" />
              {profile.rating}
            </span>
            <span className="text-xs text-[#BFAAFF]">Рейтинг</span>
          </div>
          <div className="flex gap-2 mt-2">
            <span className="flex items-center gap-1 text-[#BFAAFF] text-xs bg-[#232136]/70 px-2 py-1 rounded-xl">
              <Users className="w-4 h-4" /> {profile.partners} партнёров
            </span>
            <span className="flex items-center gap-1 text-[#BFAAFF] text-xs bg-[#232136]/70 px-2 py-1 rounded-xl">
              <Handshake className="w-4 h-4" /> {profile.completedDeals} сделок
            </span>
          </div>
        </div>
        {/* Main info block */}
        <div className="flex-1 flex flex-col gap-3 justify-center w-full">
          {!editMode ? (
            <>
              <h2 className="text-3xl font-nekstmedium text-white flex items-center gap-2">
                {profile.name}
                <span className="text-base font-nekstregular text-[#BFAAFF] bg-[#232136]/70 px-2 py-1 rounded-xl">
                  @{profile.username}
                </span>
                <span className="ml-3 text-xs font-nekstmedium text-[#6DE7C8] bg-[#232136]/40 px-2 py-1 rounded-xl flex items-center gap-1">
                  <Box className="w-4 h-4" /> {profile.b2bRole}
                </span>
              </h2>
              <div className="flex flex-wrap gap-4 mt-2">
                <span className="flex items-center gap-2 text-lg text-[#BFAAFF]">
                  <Building2 className="w-5 h-5" />
                  {profile.company}
                </span>
                <span className="flex items-center gap-2 text-lg text-[#BFAAFF]">
                  <Briefcase className="w-5 h-5" />
                  {profile.position}
                </span>
                <span className="flex items-center gap-2 text-lg text-[#BFAAFF]">
                  <Star className="w-5 h-5" />
                  {profile.industry}
                </span>
                <span className="flex items-center gap-2 text-base text-[#8C7FF5] bg-[#232136]/50 px-3 py-1 rounded-lg">
                  <ClipboardList className="w-5 h-5" />
                  Ассортимент: {profile.productRange}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
                <span className="flex items-center gap-2 text-base text-[#BFAAFF]">
                  <MapPin className="w-5 h-5" />
                  {profile.companyAddress}
                </span>
                <span className="flex items-center gap-2 text-base text-[#BFAAFF]">
                  <CheckCircle2 className="w-5 h-5" />
                  {profile.legalStatus}
                </span>

                <span className="flex items-center gap-2 text-base text-[#BFAAFF]">
                  <ClipboardList className="w-5 h-5" />
                  ИНН: {profile.companyINN}
                </span>
                <span className="flex items-center gap-2 text-base text-[#BFAAFF]">
                  <ThumbsUp className="w-5 h-5" />
                  Мин. заказ: {profile.minOrder}
                </span>
                <span className="flex items-center gap-2 text-base text-[#BFAAFF]">
                  <Users className="w-5 h-5" />
                  Отрасль: {profile.industry}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mt-1">
                {profile.certifications.map((cert, idx) => (
                  <span
                    key={idx}
                    className="flex items-center gap-1 text-xs bg-gradient-to-r from-[#8C7FF5]/40 to-[#6DE7C8]/30 text-[#BFAAFF] rounded-xl px-3 py-1 mt-2 shadow"
                  >
                    <BadgeCheck className="w-4 h-4" /> {cert}
                  </span>
                ))}
              </div>
              <div className="mt-4 text-lg text-[#b8b8d1] font-nekstregular">
                {profile.description}
              </div>
              <div className="flex gap-2 mt-7">
                <button
                  className="px-7 py-4 rounded-2xl bg-gradient-to-tr from-[#8C7FF5] to-[#BFAAFF] text-[#232136] font-nekstmedium text-base shadow-lg hover:from-[#BFAAFF] hover:to-[#8C7FF5] transition"
                  onClick={startEdit}
                >
                  <Edit2 className="w-5 h-5 mr-2 inline-block" /> Редактировать
                </button>
              </div>
            </>
          ) : (
            <form className="flex flex-col gap-6" onSubmit={saveProfile}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-[#8C7FF5] mb-1 font-nekstmedium">
                    Имя
                  </label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) =>
                      setProfile({ ...profile, name: e.target.value })
                    }
                    placeholder="Имя"
                    className="px-5 py-4 rounded-xl border border-[#232136] bg-[#232136] text-white font-nekstmedium text-base w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#8C7FF5] mb-1 font-nekstmedium">
                    Username
                  </label>
                  <input
                    type="text"
                    value={profile.username}
                    onChange={(e) =>
                      setProfile({ ...profile, username: e.target.value })
                    }
                    placeholder="Username"
                    className="px-5 py-4 rounded-xl border border-[#232136] bg-[#232136] text-white font-nekstmedium text-base w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#8C7FF5] mb-1 font-nekstmedium">
                    Компания
                  </label>
                  <input
                    type="text"
                    value={profile.company}
                    onChange={(e) =>
                      setProfile({ ...profile, company: e.target.value })
                    }
                    placeholder="Компания"
                    className="px-5 py-4 rounded-xl border border-[#232136] bg-[#232136] text-white font-nekstmedium text-base w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#8C7FF5] mb-1 font-nekstmedium">
                    Должность
                  </label>
                  <input
                    type="text"
                    value={profile.position}
                    onChange={(e) =>
                      setProfile({ ...profile, position: e.target.value })
                    }
                    placeholder="Должность"
                    className="px-5 py-4 rounded-xl border border-[#232136] bg-[#232136] text-white font-nekstmedium text-base w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#8C7FF5] mb-1 font-nekstmedium">
                    Отрасль
                  </label>
                  <select
                    value={profile.industry}
                    onChange={(e) =>
                      setProfile({ ...profile, industry: e.target.value })
                    }
                    className="px-5 py-4 rounded-xl border border-[#232136] bg-[#232136] text-white font-nekstmedium text-base w-full"
                  >
                    {industries.map((ind) => (
                      <option value={ind} key={ind}>
                        {ind}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-[#8C7FF5] mb-1 font-nekstmedium">
                    ИНН
                  </label>
                  <input
                    type="text"
                    value={profile.companyINN}
                    onChange={(e) =>
                      setProfile({ ...profile, companyINN: e.target.value })
                    }
                    placeholder="ИНН"
                    className="px-5 py-4 rounded-xl border border-[#232136] bg-[#232136] text-white font-nekstmedium text-base w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#8C7FF5] mb-1 font-nekstmedium">
                    Юридический адрес
                  </label>
                  <input
                    type="text"
                    value={profile.companyAddress}
                    onChange={(e) =>
                      setProfile({ ...profile, companyAddress: e.target.value })
                    }
                    placeholder="Юридический адрес"
                    className="px-5 py-4 rounded-xl border border-[#232136] bg-[#232136] text-white font-nekstmedium text-base w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#8C7FF5] mb-1 font-nekstmedium">
                    Сайт
                  </label>
                  <input
                    type="text"
                    value={profile.website}
                    onChange={(e) =>
                      setProfile({ ...profile, website: e.target.value })
                    }
                    placeholder="Сайт"
                    className="px-5 py-4 rounded-xl border border-[#232136] bg-[#232136] text-white font-nekstmedium text-base w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#8C7FF5] mb-1 font-nekstmedium">
                    Юр. статус
                  </label>
                  <input
                    type="text"
                    value={profile.legalStatus}
                    onChange={(e) =>
                      setProfile({ ...profile, legalStatus: e.target.value })
                    }
                    placeholder="Юр. статус"
                    className="px-5 py-4 rounded-xl border border-[#232136] bg-[#232136] text-white font-nekstmedium text-base w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#8C7FF5] mb-1 font-nekstmedium">
                    Ассортимент
                  </label>
                  <input
                    type="text"
                    value={profile.productRange}
                    onChange={(e) =>
                      setProfile({ ...profile, productRange: e.target.value })
                    }
                    placeholder="Ассортимент"
                    className="px-5 py-4 rounded-xl border border-[#232136] bg-[#232136] text-white font-nekstmedium text-base w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#8C7FF5] mb-1 font-nekstmedium">
                    Мин. заказ
                  </label>
                  <input
                    type="text"
                    value={profile.minOrder}
                    onChange={(e) =>
                      setProfile({ ...profile, minOrder: e.target.value })
                    }
                    placeholder="Мин. заказ"
                    className="px-5 py-4 rounded-xl border border-[#232136] bg-[#232136] text-white font-nekstmedium text-base w-full"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-[#8C7FF5] mb-1 font-nekstmedium">
                  О себе
                </label>
                <textarea
                  value={profile.description}
                  onChange={(e) =>
                    setProfile({ ...profile, description: e.target.value })
                  }
                  placeholder="О себе"
                  className="px-5 py-4 rounded-xl border border-[#232136] bg-[#232136] text-white font-nekstmedium text-base w-full"
                  rows={3}
                />
              </div>
              {/* Сертификаты */}
              <div>
                <label className="block text-sm text-[#8C7FF5] mb-1 font-nekstmedium">
                  Сертификаты и награды
                </label>
                <div className="flex flex-col gap-2">
                  {profile.certifications.map((cert, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={cert}
                        onChange={(e) => handleCertChange(idx, e.target.value)}
                        className="flex-1 px-4 py-2 rounded-lg border border-[#232136] bg-[#232136] text-white font-nekstmedium text-base"
                        placeholder="Название сертификата"
                      />
                      <button
                        type="button"
                        className="px-2 py-1 rounded text-[#BFAAFF] hover:bg-[#8C7FF5]/30"
                        onClick={() => removeCertification(idx)}
                        title="Удалить"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  className="mt-2 px-3 py-1 rounded bg-[#8C7FF5]/20 text-[#8C7FF5] hover:bg-[#8C7FF5]/40 transition"
                  onClick={addCertification}
                >
                  + Добавить сертификат
                </button>
              </div>
              <div className="flex gap-4 mt-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-4 rounded-2xl bg-gradient-to-tr from-[#8C7FF5] to-[#BFAAFF] text-[#232136] font-nekstmedium text-base shadow-lg hover:from-[#BFAAFF] hover:to-[#8C7FF5] transition"
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
            </form>
          )}
        </div>
      </div>
      {/* ...Остальной код как в предыдущем примере... */}
      {/* ...Контакты, мета-панель, отзывы, анимация... */}
      {/* CONTACTS GRID */}

      {/* B2B META PANEL */}
      <div className="w-full max-w-[1600px] px-6 md:px-10 py-4 mb-2 grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="flex flex-col gap-4 rounded-2xl bg-gradient-to-tr from-[#232136] via-[#2c2943] to-[#191823] shadow-lg px-8 py-7">
          <div className="flex items-center gap-3 mb-2">
            <Handshake className="w-6 h-6 text-[#8C7FF5]" />
            <span className="text-lg font-nekstmedium text-[#BFAAFF]">
              B2B-роль: {profile.b2bRole}
            </span>
            <span className="ml-2 text-xs text-[#6DE7C8] bg-[#232136]/40 px-2 py-1 rounded-lg">
              {profile.verified ? "Верифицирован" : "Не верифицирован"}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <ClipboardList className="w-5 h-5 text-[#BFAAFF]" />
            <span className="text-base text-[#EDEBFF]">
              Завершено сделок: <b>{profile.completedDeals}</b>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-[#BFAAFF]" />
            <span className="text-base text-[#EDEBFF]">
              Партнёров: <b>{profile.partners}</b>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <ThumbsUp className="w-5 h-5 text-[#BFAAFF]" />
            <span className="text-base text-[#EDEBFF]">
              Среднее время отклика: <b>{profile.responseTime}</b>
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-4 rounded-2xl bg-gradient-to-tr from-[#232136] via-[#2c2943] to-[#191823] shadow-lg px-8 py-7">
          <div className="flex items-center gap-3">
            <Box className="w-5 h-5 text-[#BFAAFF]" />
            <span className="text-base text-[#EDEBFF]">
              Ассортимент: <b>{profile.productRange}</b>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <ClipboardList className="w-5 h-5 text-[#BFAAFF]" />
            <span className="text-base text-[#EDEBFF]">
              Мин. заказ: <b>{profile.minOrder}</b>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <BadgeCheck className="w-5 h-5 text-[#BFAAFF]" />
            <span className="text-base text-[#EDEBFF]">
              Сертификаты:{" "}
              <b>
                {profile.certifications && profile.certifications.length > 0
                  ? profile.certifications.join(", ")
                  : "нет"}
              </b>
            </span>
          </div>
        </div>
      </div>
      {/* REVIEWS SECTION */}
      <div className="w-full max-w-[1600px] px-6 md:px-10 py-6">
        <h3 className="text-2xl font-nekstmedium text-white mb-4 flex items-center gap-2">
          <MessageSquare className="w-7 h-7 text-[#8C7FF5]" />
          Отзывы о пользователе
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {mockReviews.map((review) => (
            <div
              key={review.id}
              className="bg-gradient-to-br from-[#232136] via-[#2c2943] to-[#191823] rounded-2xl shadow-2xl border border-[#232136] p-7 flex flex-col gap-4 hover:shadow-[0_8px_32px_0_rgba(140,127,245,0.30)] transition"
            >
              <div className="flex items-center gap-3">
                <img
                  src={review.authorAvatar}
                  alt={review.author}
                  className="w-12 h-12 rounded-full border-2 border-[#8C7FF5] object-cover"
                />
                <div>
                  <span className="text-lg font-nekstmedium text-[#BFAAFF]">
                    {review.author}
                  </span>
                  <div className="flex items-center gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarIcon
                        key={star}
                        className={`w-5 h-5 ${
                          star <= review.rating
                            ? "text-[#FFD700]"
                            : "text-[#404060]"
                        }`}
                        fill={star <= review.rating ? "#FFD700" : "none"}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="text-base text-[#b8b8d1] mt-2">{review.text}</div>
              <div className="flex items-center gap-2 mt-2 text-xs text-[#8C7FF5]">
                <User2 className="w-4 h-4" />
                {review.date}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
