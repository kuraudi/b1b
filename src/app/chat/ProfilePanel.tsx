import {
  Phone,
  MoreVertical,
  QrCode,
  Bell,
  Image,
  Video,
  File,
  Music,
  Link,
  Mic,
  Smile,
  Edit2,
  Trash2,
  Lock,
  Share2,
  X as XIcon,
  ChevronLeft,
  Calendar,
  UserRound,
  Copy,
  Info,
  Users,
} from "lucide-react";
import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Категории для списка с количеством
const CATEGORY_META = [
  { type: "photos", icon: <Image size={20} />, text: "Фотографии" },
  { type: "videos", icon: <Video size={20} />, text: "Видео" },
  { type: "files", icon: <File size={20} />, text: "Файлы" },
  { type: "audio", icon: <Music size={20} />, text: "Аудиофайлы" },
  { type: "links", icon: <Link size={20} />, text: "Ссылки" },
  { type: "voice", icon: <Mic size={20} />, text: "Голосовые сообщения" },
  { type: "gifs", icon: <Smile size={20} />, text: "GIF" },
];

// Модальное окно для подробной информации о поле профиля
function FieldModal({ open, onClose, icon, label, value }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="field-modal"
          initial={{ opacity: 0, scale: 0.95, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 40 }}
          className="fixed top-0 left-0 w-full h-full bg-black/60 flex items-center justify-center z-[9999]"
          style={{ backdropFilter: "blur(3px)" }}
        >
          <div className="bg-[#191b1f] rounded-2xl shadow-2xl border border-[#23232b] min-w-[320px] max-w-[92vw] px-7 py-7 flex flex-col items-center relative">
            <button
              className="absolute top-4 right-6 text-[#7a8b95] hover:text-[#2fd4c6] rounded p-1"
              onClick={onClose}
            >
              <XIcon size={26} />
            </button>
            <div className="flex items-center gap-3 mb-2">
              <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#232d2c] text-[#2fd4c6] text-2xl">
                {icon}
              </span>
              <span className="text-xl font-bold text-[#e6eaf1]">{label}</span>
            </div>
            <div className="mt-3 w-full px-2">
              <div className="bg-[#23232b] rounded-xl px-5 py-4 text-base text-[#d5dbe5] font-medium break-words">
                {value && value !== "" ? (
                  value
                ) : (
                  <span className="text-[#666b7a]">Нет информации</span>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Эффект "Скопировано"
function CopyTooltip({ show }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          className="absolute right-0 top-1/2 -translate-y-1/2 px-3 py-1 bg-[#23232b] border border-[#2fd4c6]/40 rounded-xl shadow text-[#2fd4c6] text-sm font-semibold pointer-events-none z-40"
        >
          Скопировано!
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Компактная строка с интерактивом для каждого поля профиля
function InfoItem({
  icon,
  label,
  value,
  onShowModal,
  copyValue,
  highlight,
  children,
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(copyValue ?? "");
    setCopied(true);
    setTimeout(() => setCopied(false), 1300);
  };

  return (
    <div
      className="flex items-center gap-2 py-2 px-0 text-[15px] group cursor-pointer hover:bg-[#23232b] rounded-lg transition relative"
      onClick={onShowModal}
    >
      <span className="flex items-center justify-center w-6 h-6 rounded bg-[#232d2c] text-[#2fd4c6]">
        {icon}
      </span>
      <span className="text-xs text-[#7a8b95] w-[92px]">{label}</span>
      <span
        className={`truncate flex-1 ${
          highlight ? "text-[#2fd4c6] font-bold" : "text-gray-100"
        } text-[15px]`}
      >
        {children ?? value ?? <span className="text-[#444b57]">—</span>}
      </span>
      {copyValue !== undefined && (
        <>
          <button
            className="ml-2 text-[#7a8b95] hover:text-[#2fd4c6] p-1 opacity-0 group-hover:opacity-100 relative"
            onClick={handleCopy}
            title={`Скопировать ${label.toLowerCase()}`}
            tabIndex={-1}
          >
            <Copy size={16} />
            <CopyTooltip show={copied} />
          </button>
        </>
      )}
      <span className="ml-1 text-[#2fd4c6] opacity-0 group-hover:opacity-100">
        <Info size={15} />
      </span>
    </div>
  );
}

// Список категорий с количеством, как на скрине
function CategoryStatList({
  categories,
  onShowModal,
  chatMessages,
  sharedGroups = 0,
}) {
  const counts = useMemo(
    () => ({
      photos: categories.photos?.length ?? 0,
      videos: categories.videos?.length ?? 0,
      files: categories.files?.length ?? 0,
      audio: categories.audio?.length ?? 0,
      links: categories.links?.length ?? 0,
      voice: categories.voice?.length ?? 0,
      gifs: categories.gifs?.length ?? 0,
    }),
    [categories]
  );

  // Для аудио: считаем только type === "audio" (voice отдельно)
  const audioCount = categories.audio?.length ?? 0;
  const voiceCount = categories.voice?.length ?? 0;

  return (
    <div className="w-full flex flex-col gap-0.5">
      <button
        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#24282e] transition text-gray-100 w-full text-left"
        onClick={() => onShowModal("photos")}
      >
        <Image size={20} className="text-[#7a8b95]" />
        <span className="font-medium">{counts.photos}</span>
        <span className="text-[#7a8b95] ml-2">Фотографии</span>
      </button>
      <button
        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#24282e] transition text-gray-100 w-full text-left"
        onClick={() => onShowModal("videos")}
      >
        <Video size={20} className="text-[#7a8b95]" />
        <span className="font-medium">{counts.videos}</span>
        <span className="text-[#7a8b95] ml-2">Видео</span>
      </button>
      <button
        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#24282e] transition text-gray-100 w-full text-left"
        onClick={() => onShowModal("files")}
      >
        <File size={20} className="text-[#7a8b95]" />
        <span className="font-medium">{counts.files}</span>
        <span className="text-[#7a8b95] ml-2">Файлов</span>
      </button>
      <button
        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#24282e] transition text-gray-100 w-full text-left"
        onClick={() => onShowModal("audio")}
      >
        <Music size={20} className="text-[#7a8b95]" />
        <span className="font-medium">{audioCount}</span>
        <span className="text-[#7a8b95] ml-2">Аудиофайлов</span>
      </button>
      <button
        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#24282e] transition text-gray-100 w-full text-left"
        onClick={() => onShowModal("links")}
      >
        <Link size={20} className="text-[#7a8b95]" />
        <span className="font-medium">{counts.links}</span>
        <span className="text-[#7a8b95] ml-2">Ссылок</span>
      </button>
      <button
        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#24282e] transition text-gray-100 w-full text-left"
        onClick={() => onShowModal("voice")}
      >
        <Mic size={20} className="text-[#7a8b95]" />
        <span className="font-medium">{voiceCount}</span>
        <span className="text-[#7a8b95] ml-2">Голосовых сообщений</span>
      </button>
      <button
        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#24282e] transition text-gray-100 w-full text-left"
        onClick={() => onShowModal("gifs")}
      >
        <Smile size={20} className="text-[#7a8b95]" />
        <span className="font-medium">{counts.gifs}</span>
        <span className="text-[#7a8b95] ml-2">GIF</span>
      </button>
    </div>
  );
}

export default function ProfilePanel({ user, open, onClose, chatMessages }) {
  const [modal, setModal] = useState(null); // категория
  const [fieldModal, setFieldModal] = useState(null); // поле профиля
  const [notifications, setNotifications] = useState(!!user.notifications);

  let birthdate = null;
  let age = null;
  if (user.birthdate) {
    const date = new Date(user.birthdate);
    birthdate = date.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
    age = Math.floor(
      (Date.now() - date.getTime()) / (365.25 * 24 * 3600 * 1000)
    );
  }

  // Категории по типу
  const categoriesData = useMemo(() => {
    const result = {
      photos: [],
      videos: [],
      files: [],
      audio: [],
      links: [],
      voice: [],
      gifs: [],
    };
    if (Array.isArray(chatMessages)) {
      for (const msg of chatMessages) {
        if (msg.type === "photo") {
          result.photos.push(msg);
        }
        if (msg.type === "video") {
          result.videos.push(msg);
        }
        if (msg.type === "file") {
          result.files.push(msg);
        }
        if (msg.type === "audio") {
          result.audio.push(msg);
        }
        if (msg.type === "voice") {
          result.voice.push(msg);
        }
        if (msg.type === "link") {
          result.links.push(msg);
        }
        if (msg.type === "gif") {
          result.gifs.push(msg);
        }
      }
    }
    return result;
  }, [chatMessages]);

  const actions = [
    {
      icon: <Share2 size={16} />,
      label: "Поделиться контактом",
      onClick: () => alert("Ссылка на контакт скопирована!"),
    },
    {
      icon: <Edit2 size={16} />,
      label: "Изменить контакт",
      onClick: () => alert("Режим редактирования"),
    },
    {
      icon: <Trash2 size={16} />,
      label: "Удалить контакт",
      onClick: () => alert("Контакт удалён!"),
    },
    {
      icon: <Lock size={16} className="text-[#ff5555]" />,
      label: "Заблокировать",
      danger: true,
      onClick: () => alert("Пользователь заблокирован!"),
    },
  ];

  if (!open || !user) return null;

  return (
    <AnimatePresence>
      <motion.aside
        className="fixed top-0 right-0 h-[calc(100vh-79px)] w-[340px] max-w-[98vw] bg-[#191b1f] border-l border-[#23222a] shadow-2xl z-[90] overflow-y-auto flex flex-col mt-[79px] pt-4"
        initial={{ x: "100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: "100%", opacity: 0 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-2 mb-2">
          <span className="font-semibold text-gray-200 text-base tracking-wide">
            Профиль
          </span>
          <div className="flex items-center gap-2">
            <button className="text-[#7a8b95] hover:text-[#2fd4c6] rounded p-1">
              <Phone size={18} />
            </button>
            <button className="text-[#7a8b95] hover:text-[#2fd4c6] rounded p-1">
              <MoreVertical size={18} />
            </button>
            <button
              className="text-[#6a7b87] text-xl ml-1 hover:text-[#2fd4c6] rounded px-2 transition"
              onClick={onClose}
            >
              ×
            </button>
          </div>
        </div>
        {/* Аватар и имя */}
        <div className="flex flex-col items-center gap-1 px-5 pt-1 pb-2 border-b border-[#23242a]">
          <div className="relative">
            <img
              src={user.avatar || ""}
              alt={user.name || "—"}
              className="w-16 h-16 rounded-2xl border-2 border-[#2fd4c6]/30 shadow-sm mb-1 object-cover"
            />
            {user.online && (
              <span className="absolute bottom-1 right-1 block w-3.5 h-3.5 rounded-full bg-[#44d991] border-2 border-[#191b1f] shadow"></span>
            )}
          </div>
          <span className="text-base font-semibold text-[#e6eaf1]">
            {user.name || <span className="text-[#444b57]">—</span>}
          </span>
          <span className="flex items-center gap-2 mt-0 text-[#7a8b95] text-xs">
            был(а) {user.lastSeen || <span className="text-[#444b57]">—</span>}
          </span>
        </div>
        {/* Компактная инфа (по одному в ряд) */}
        <div className="px-3 pt-2 flex flex-col gap-0">
          {/* <InfoItem
            icon={<Phone size={15} />}
            label="Телефон"
            value={user.phone}
            copyValue={user.phone}
            onShowModal={() =>
              setFieldModal({
                label: "Телефон",
                value: user.phone,
                icon: <Phone size={26} />,
              })
            }
          /> */}
          <InfoItem
            icon={<UserRound size={15} />}
            label="О себе"
            value={user.about}
            copyValue={user.about}
            onShowModal={() =>
              setFieldModal({
                label: "О себе",
                value: user.about,
                icon: <UserRound size={26} />,
              })
            }
          />
          <InfoItem
            icon={<QrCode size={15} />}
            label="Username"
            copyValue={user.username ? "@" + user.username : ""}
            highlight={!!user.username}
            onShowModal={() =>
              setFieldModal({
                label: "Username",
                value: user.username ? "@" + user.username : "",
                icon: <QrCode size={26} />,
              })
            }
          >
            {user.username && (
              <span className="inline-flex items-center gap-1 text-[#2fd4c6] font-bold text-[15px]">
                @{user.username}
              </span>
            )}
          </InfoItem>
          <InfoItem
            icon={<Calendar size={15} />}
            label="Дата рождения"
            onShowModal={() =>
              setFieldModal({
                label: "Дата рождения",
                value: birthdate
                  ? `${birthdate}${age ? ` (${age} лет)` : ""}`
                  : "",
                icon: <Calendar size={26} />,
              })
            }
          >
            {birthdate ? (
              <>
                {birthdate}
                {age ? (
                  <span className="text-[#7a8b95] ml-2 text-xs">
                    ({age} лет)
                  </span>
                ) : null}
              </>
            ) : null}
          </InfoItem>
          <div className="flex items-center gap-2 py-2 px-0 text-[15px]">
            <span className="flex items-center justify-center w-6 h-6 rounded bg-[#232d2c] text-[#2fd4c6]">
              <Bell size={15} />
            </span>
            <span className="text-xs text-[#7a8b95] w-[92px]">Уведомления</span>
            <label className="relative inline-flex items-center cursor-pointer ml-2">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={notifications}
                readOnly
              />
              <div
                className="w-8 h-4 bg-[#23242a] rounded-full peer peer-checked:bg-[#2fd4c6] transition-all"
                onClick={() => setNotifications((v) => !v)}
                tabIndex={0}
              ></div>
              <div className="absolute left-1 top-1 w-2.5 h-2.5 bg-white rounded-full transition-all peer-checked:translate-x-4 pointer-events-none"></div>
            </label>
          </div>
        </div>
        {/* Категории в формате списка с количеством */}
        <div className="px-5 mt-2 mb-2">
          <CategoryStatList
            categories={categoriesData}
            onShowModal={setModal}
            chatMessages={chatMessages}
          />
        </div>
        {/* Actions */}
        <div className="px-5 flex flex-col gap-1 mb-8 mt-2">
          {actions.map((a, i) => (
            <button
              key={a.label}
              className={`flex items-center gap-3 py-2 px-2 rounded-xl text-[14px] transition
                ${
                  a.danger
                    ? "text-[#ff5555] hover:bg-[#ff5555]/10 font-semibold"
                    : "text-gray-200 hover:bg-[#2fd4c6]/10"
                }
              `}
              onClick={a.onClick}
            >
              {a.icon}
              <span>{a.label}</span>
            </button>
          ))}
        </div>
        {/* Модальные окна */}
        <CategoryModal
          open={!!modal}
          onClose={() => setModal(null)}
          type={modal}
          data={categoriesData[modal] || []}
        />
        <FieldModal
          open={!!fieldModal}
          onClose={() => setFieldModal(null)}
          icon={fieldModal?.icon}
          label={fieldModal?.label}
          value={fieldModal?.value}
        />
      </motion.aside>
    </AnimatePresence>
  );
}
function CategoryModal({ open, onClose, type, data }) {
  const [search, setSearch] = useState("");
  const filteredData = !search
    ? data
    : data.filter(
        (item) =>
          (item.title &&
            item.title.toLowerCase().includes(search.toLowerCase())) ||
          (item.name &&
            item.name.toLowerCase().includes(search.toLowerCase())) ||
          (item.date && item.date.toLowerCase().includes(search.toLowerCase()))
      );
  const isGrid = type === "photos";
  const grouped = isGrid
    ? filteredData.reduce((acc, item) => {
        const group = item.month || "Другое";
        if (!acc[group]) acc[group] = [];
        acc[group].push(item);
        return acc;
      }, {})
    : {};
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="cat-modal"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 60 }}
          className="fixed inset-0 z-[999] bg-black/40 flex justify-end pt-[79px]"
          style={{ backdropFilter: "blur(2px)" }}
        >
          <div className="relative w-full max-w-md bg-[#191b1f] flex flex-col shadow-2xl ">
            <div className="flex items-center px-4 py-4 border-b border-[#23242a] shrink-0 ">
              <button
                onClick={onClose}
                className="text-[#b0b6ba] hover:text-[#2fd4c6] p-1 mr-1"
              >
                <ChevronLeft size={22} />
              </button>
              <div className="font-bold text-gray-100 text-lg flex-1 truncate">
                {CATEGORY_META.find((m) => m.type === type)?.text}
              </div>
              <button
                onClick={onClose}
                className="text-[#b0b6ba] hover:text-[#2fd4c6] p-1"
              >
                <XIcon size={22} />
              </button>
            </div>
            {type !== "photos" && (
              <div className="px-4 pt-3 pb-2 border-b border-[#23242a]">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-lg bg-[#22232a] px-3 py-2 text-sm text-gray-100 placeholder:text-[#666b7a] outline-none"
                  placeholder="Поиск"
                />
              </div>
            )}
            <div className={`flex-1 overflow-y-auto px-0 py-2`}>
              {isGrid ? (
                <>
                  {Object.entries(grouped).map(([month, arr]) => (
                    <div key={month} className="mb-2">
                      <div className="px-4 pb-2 pt-1 font-bold text-[#d5dbe5] text-base sticky top-0 bg-[#191b1f] z-10">
                        {month}
                      </div>
                      <div className="grid grid-cols-3 gap-2 px-4">
                        {arr.map((ph, i) => (
                          <div
                            key={ph.url + i}
                            className="w-full aspect-square bg-[#23232b] rounded-xl overflow-hidden flex items-center justify-center"
                          >
                            <img
                              src={ph.url}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <ul className="flex flex-col gap-1 px-2">
                  {filteredData.map((f, i) => (
                    <li
                      key={f.url + i}
                      className="flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-[#212226]/70 cursor-pointer transition"
                    >
                      {f.icon && (
                        <span className="text-[#2fd4c6]">{f.icon}</span>
                      )}
                      {f.type === "pdf" && (
                        <span className="bg-[#2fd4c6] text-[#181a1f] rounded px-2 py-1 font-bold text-xs">
                          pdf
                        </span>
                      )}
                      {f.type === "docx" && (
                        <span className="bg-[#4fc3f7] text-[#181a1f] rounded px-2 py-1 font-bold text-xs">
                          docx
                        </span>
                      )}
                      {f.thumb && (
                        <img
                          src={f.thumb}
                          className="w-8 h-8 rounded-lg object-cover"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="text-gray-100 truncate text-[15px] font-semibold">
                          {f.title || f.name}
                        </div>
                        <div className="text-xs text-[#7a8b95]">{f.date}</div>
                      </div>
                      {f.size && (
                        <div className="text-xs text-[#7a8b95]">{f.size}</div>
                      )}
                    </li>
                  ))}
                  {!filteredData.length && (
                    <div className="text-[#7a8b95] text-center py-6">
                      Ничего не найдено
                    </div>
                  )}
                </ul>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
