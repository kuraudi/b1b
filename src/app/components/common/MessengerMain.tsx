"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  Paperclip,
  Smile,
  Send,
  MoreVertical,
  Phone,
  Video,
  Monitor,
  User2,
  Check,
  X,
  Image as ImageIcon,
  FileText,
  Star,
  Trash2,
} from "lucide-react";

const GRADIENT_BG =
  "bg-gradient-to-br from-[#24232f] via-[#221f27] to-[#34264a]";
const BUBBLE_MY =
  "bg-gradient-to-tr from-[#a677ee]/90 via-[#6c47d6]/90 to-[#34264a]/96 text-white";
const BUBBLE_THEIR =
  "bg-gradient-to-tr from-[#232136]/90 via-[#2a2843]/95 to-[#34264a]/94 text-[#d7d2f7]";

const AVATAR = "/main/catalog/id2.jpg";
const initialMessages = [
  {
    id: 1,
    fromMe: false,
    text: "Добрый день! Получили ваш договор, все отлично.",
    time: "14:18",
    status: "read",
    favourite: false,
    attachments: [],
  },
  {
    id: 2,
    fromMe: true,
    text: "Рады слышать! Если нужны будут доп. документы, пишите.",
    time: "14:19",
    status: "read",
    favourite: false,
    attachments: [],
  },
  {
    id: 3,
    fromMe: false,
    text: "Есть вопрос по спецификации. Посмотрите, пожалуйста, пункт 3.2.",
    time: "14:21",
    status: "read",
    favourite: true,
    attachments: [],
  },
  {
    id: 4,
    fromMe: true,
    text: "Сейчас посмотрю. Кстати, вот фото образца:",
    time: "14:22",
    status: "read",
    favourite: false,
    attachments: [
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=360&q=80",
        name: "Фото образца",
      },
    ],
  },
  {
    id: 5,
    fromMe: true,
    text: "",
    time: "14:22",
    status: "read",
    attachments: [
      {
        type: "file",
        url: "#",
        name: "specification.pdf",
      },
    ],
    favourite: false,
  },
  {
    id: 6,
    fromMe: false,
    text: "Благодарю. Всё понятно!",
    time: "14:23",
    status: "read",
    favourite: false,
    attachments: [],
  },
  {
    id: 7,
    fromMe: true,
    text: "Если что, звоните или пишите сюда — всегда на связи.",
    time: "14:24",
    status: "read",
    favourite: false,
    attachments: [],
  },
];

// Группировка для скруглений
function isFirstOfGroup(messages, idx) {
  if (idx === 0) return true;
  return messages[idx].fromMe !== messages[idx - 1].fromMe;
}
function isLastOfGroup(messages, idx) {
  if (idx === messages.length - 1) return true;
  return messages[idx].fromMe !== messages[idx + 1].fromMe;
}

function getTime() {
  const d = new Date();
  return d
    .toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })
    .replace(/^(\d):/, "0$1:");
}

export default function MessengerMain({
  companion = {
    name: "ООО Протех",
    avatar: AVATAR,
    online: true,
    lastSeen: "был(а) недавно",
  },
  myName = "Вы",
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [animatedIds, setAnimatedIds] = useState<number[]>([]);
  const [attachments, setAttachments] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [showAttach, setShowAttach] = useState(false);
  const messagesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesRef.current?.scrollTo({
      top: messagesRef.current.scrollHeight + 100,
      behavior: "smooth",
    });
  }, [messages, sending]);

  // Animate appearance for new messages
  useEffect(() => {
    if (messages.length > 0 && sending) {
      const lastId = messages[messages.length - 1].id;
      setTimeout(() => setAnimatedIds((ids) => [...ids, lastId]), 60);
      setSending(false);
    }
  }, [messages, sending]);

  // Autofocus input after send
  useEffect(() => {
    if (!sending && inputRef.current) {
      inputRef.current.focus();
    }
  }, [sending]);

  function handleAttachFile(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const mapped = files.map((f) => {
      if (f.type.startsWith("image/")) {
        return {
          type: "image",
          url: URL.createObjectURL(f),
          file: f,
          name: f.name,
        };
      }
      return {
        type: "file",
        url: "#",
        file: f,
        name: f.name,
      };
    });
    setAttachments((prev) => [...prev, ...mapped]);
    e.target.value = "";
    setShowAttach(false);
  }

  function handleRemoveAttach(i: number) {
    setAttachments((prev) => prev.filter((_, idx) => idx !== i));
  }

  function handleSend(e?: React.FormEvent) {
    e?.preventDefault();
    if (!input.trim() && attachments.length === 0) return;
    const msg = {
      id: Date.now(),
      fromMe: true,
      text: input,
      time: getTime(),
      status: "sending" as const,
      attachments,
      favourite: false,
    };
    setMessages((m) => [...m, msg]);
    setInput("");
    setAttachments([]);
    setSending(true);
    setShowAttach(false);
    setTimeout(() => {
      setMessages((m) =>
        m.map((mm) => (mm.id === msg.id ? { ...mm, status: "read" } : mm))
      );
    }, 800);
  }

  function toggleFavourite(id: number) {
    setMessages((m) =>
      m.map((msg) =>
        msg.id === id ? { ...msg, favourite: !msg.favourite } : msg
      )
    );
  }

  function deleteSelected() {
    setMessages((m) => m.filter((msg) => !selectedIds.includes(msg.id)));
    setSelectedIds([]);
  }

  function toggleSelect(id: number) {
    setSelectedIds((ids) =>
      ids.includes(id) ? ids.filter((v) => v !== id) : [...ids, id]
    );
  }

  function selectAll() {
    setSelectedIds(messages.map((m) => m.id));
  }

  function clearSelection() {
    setSelectedIds([]);
  }

  function copySelected() {
    const text = messages
      .filter((msg) => selectedIds.includes(msg.id))
      .map((msg) => msg.text)
      .join("\n");
    navigator.clipboard.writeText(text);
  }

  return (
    <section
      className={`flex flex-col h-[100vh] min-h-0 w-full ${GRADIENT_BG} font-nekstregular`}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-7 py-5 border-b border-[#393959] bg-gradient-to-r from-[#232136]/90 via-[#221f27]/90 to-[#34264a]/90">
        <img
          src={companion.avatar}
          alt={companion.name}
          className="w-11 h-11 rounded-full object-cover border border-[#a677ee] shadow"
        />
        <div className="flex-1 min-w-0">
          <div className="text-lg font-nekstmedium text-[#dbb8ff]">
            {companion.name}
          </div>
          <div className="text-xs text-[#a677ee] font-nekstregular">
            {companion.online ? "онлайн" : companion.lastSeen}
          </div>
        </div>
        {selectedIds.length > 0 ? (
          <div className="flex items-center gap-2">
            <button
              className="p-2 rounded-xl hover:bg-[#a677ee]/15 transition"
              title="Снять выделение"
              onClick={clearSelection}
            >
              <X className="w-5 h-5 text-[#a677ee]" />
            </button>
            <button
              className="p-2 rounded-xl hover:bg-[#a677ee]/15 transition"
              title="Копировать"
              onClick={copySelected}
            >
              <FileText className="w-5 h-5 text-[#a677ee]" />
            </button>
            <button
              className="p-2 rounded-xl hover:bg-[#a677ee]/15 transition"
              title="Удалить"
              onClick={deleteSelected}
            >
              <Trash2 className="w-5 h-5 text-[#a677ee]" />
            </button>
            <button
              className="p-2 rounded-xl hover:bg-[#a677ee]/15 transition"
              title="Выделить все"
              onClick={selectAll}
            >
              <Check className="w-5 h-5 text-[#a677ee]" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-[#a677ee]">
            <Phone className="w-5 h-5 hover:text-[#c4a2fa] cursor-pointer" />
            <Video className="w-5 h-5 hover:text-[#c4a2fa] cursor-pointer" />
            <Monitor className="w-5 h-5 hover:text-[#c4a2fa] cursor-pointer" />
            <MoreVertical className="w-5 h-5 hover:text-[#c4a2fa] cursor-pointer" />
          </div>
        )}
      </div>
      {/* Messages */}
      <div
        ref={messagesRef}
        className="flex-1 overflow-y-auto px-0 py-5 flex flex-col min-h-0 bg-gradient-to-b from-[#232136]/95 via-[#221f27]/95 to-[#34264a]/90 "
        style={{ height: "0px", minHeight: 0 }}
      >
        <div className="flex flex-col gap-1 px-8 pb-2">
          {messages.map((msg, i) => {
            const isMine = msg.fromMe;
            const first = isFirstOfGroup(messages, i);
            const last = isLastOfGroup(messages, i);
            const borderRadius = isMine
              ? [
                  first && last
                    ? "rounded-3xl rounded-br-xl"
                    : first
                    ? "rounded-3xl rounded-br-xl rounded-tr-3xl"
                    : last
                    ? "rounded-3xl rounded-tr-3xl rounded-br-xl"
                    : "rounded-3xl rounded-tr-3xl rounded-br-xl",
                ]
              : [
                  first && last
                    ? "rounded-3xl rounded-bl-xl"
                    : first
                    ? "rounded-3xl rounded-bl-xl rounded-tl-3xl"
                    : last
                    ? "rounded-3xl rounded-tl-3xl rounded-bl-xl"
                    : "rounded-3xl rounded-tl-3xl rounded-bl-xl",
                ];
            return (
              <div
                key={msg.id}
                className={`flex group w-full ${
                  isMine ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`
                    relative px-4 py-2.5 font-nekstregular text-base
                    max-w-[70vw] md:max-w-[430px] break-words shadow-lg
                    border border-[#a677ee]/25
                    ${isMine ? BUBBLE_MY : BUBBLE_THEIR}
                    ${borderRadius}
                    ${
                      animatedIds.includes(msg.id)
                        ? "animate-chatMsgIn"
                        : i === messages.length - 1 && sending
                        ? "opacity-0"
                        : ""
                    }
                    transition-all select-none
                    ${
                      selectedIds.includes(msg.id)
                        ? "ring-2 ring-[#a677ee]/60"
                        : ""
                    }
                  `}
                  tabIndex={0}
                  onClick={() => toggleSelect(msg.id)}
                  onDoubleClick={() => toggleFavourite(msg.id)}
                  title={
                    selectedIds.length
                      ? "Нажмите для (де)выделения, двойной клик — избранное"
                      : "Двойной клик — добавить/убрать в избранное"
                  }
                >
                  {msg.attachments && msg.attachments.length > 0 && (
                    <div className="flex flex-col gap-2 mb-1">
                      {msg.attachments.map((att, idx) => (
                        <div key={idx}>
                          {att.type === "image" ? (
                            <img
                              src={att.url}
                              alt={att.name}
                              className="rounded-xl max-h-44 mb-1 border border-[#a677ee]/40"
                              style={{ maxWidth: 220 }}
                            />
                          ) : (
                            <a
                              href={att.url}
                              download={att.name}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#392e68]/30 border border-[#a677ee]/30 text-[#BFAAFF] text-sm hover:bg-[#a677ee]/10 transition"
                            >
                              <FileText className="w-4 h-4" />
                              {att.name}
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  {msg.text && (
                    <div className="whitespace-pre-line">{msg.text}</div>
                  )}
                  <div className="flex items-center gap-1 mt-1 justify-end font-nekstregular">
                    <span className="text-xs text-[#c4b8e7] opacity-70">
                      {msg.time}
                    </span>
                    {msg.fromMe && (
                      <span>
                        <Check
                          className={`w-4 h-4 ml-1 ${
                            msg.status === "read"
                              ? "text-[#a677ee]"
                              : "text-[#7d74c0]"
                          }`}
                        />
                      </span>
                    )}
                    <button
                      type="button"
                      className={`ml-1 p-1 rounded-full ${
                        msg.favourite
                          ? "bg-[#a677ee]/10 text-[#a677ee]"
                          : "hover:bg-[#a677ee]/10 text-[#c4b8e7]"
                      } transition`}
                      title="В избранное"
                      tabIndex={-1}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavourite(msg.id);
                      }}
                    >
                      <Star
                        className={`w-4 h-4 ${
                          msg.favourite ? "fill-[#a677ee]" : ""
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* Input */}
      <form
        className="w-full px-8 py-4 flex gap-3 items-end border-t border-[#393959] bg-gradient-to-r from-[#232136]/95 via-[#221f27]/95 to-[#34264a]/95 sticky bottom-0 left-0"
        style={{
          minHeight: 0,
          maxHeight: 140,
        }}
        onSubmit={handleSend}
      >
        <div className="relative">
          <button
            type="button"
            className={`p-2 rounded-xl hover:bg-[#a677ee]/10 transition ${
              showAttach ? "bg-[#a677ee]/10" : ""
            }`}
            title="Прикрепить"
            onClick={() => setShowAttach((v) => !v)}
          >
            <Paperclip className="w-6 h-6 text-[#a677ee]" />
          </button>
          {showAttach && (
            <div className="absolute bottom-12 left-0 bg-gradient-to-br from-[#34264a]/95 via-[#221f27]/96 to-[#232136]/99 border border-[#a677ee]/70 rounded-xl shadow-2xl py-3 px-4 z-10 flex flex-col gap-2 animate-chatAttachIn">
              <label className="flex gap-2 items-center cursor-pointer hover:text-[#a677ee] font-nekstmedium">
                <ImageIcon className="w-5 h-5" />
                Фото
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleAttachFile}
                />
              </label>
              <label className="flex gap-2 items-center cursor-pointer hover:text-[#a677ee] font-nekstmedium">
                <FileText className="w-5 h-5" />
                Файл
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleAttachFile}
                />
              </label>
            </div>
          )}
        </div>
        {attachments.length > 0 && (
          <div className="flex gap-2 items-end">
            {attachments.map((att, idx) =>
              att.type === "image" ? (
                <div
                  key={idx}
                  className="relative group bg-[#392e68]/30 rounded-xl border border-[#a677ee]/30"
                >
                  <img
                    src={att.url}
                    alt={att.name}
                    className="w-12 h-12 object-cover rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveAttach(idx)}
                    className="absolute -top-2 -right-2 bg-[#232136] border border-[#a677ee] text-[#FF3A3A] rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-[#FF3A3A]/30 transition"
                    title="Удалить"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div
                  key={idx}
                  className="relative flex items-center bg-[#392e68]/30 rounded-xl border border-[#a677ee]/30 px-2 py-1"
                >
                  <FileText className="w-4 h-4 mr-1" />
                  <span className="text-xs text-[#bcb7e5]">{att.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveAttach(idx)}
                    className="ml-1 text-[#FF3A3A] hover:text-[#a677ee] transition"
                    title="Удалить"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )
            )}
          </div>
        )}
        <div className="flex flex-1 flex-col">
          <div className="relative">
            <textarea
              ref={inputRef}
              className={`
                w-full resize-none min-h-[44px] max-h-[120px] px-4 py-3 rounded-2xl
                bg-gradient-to-tr from-[#232136] via-[#34264a]/80 to-[#221f27]/40
                border-2 border-[#3a306b] focus:border-[#a677ee]
                text-[#dbb8ff] placeholder-[#bcb7e5]/80 font-nekstregular text-base shadow
                transition-all duration-150
                focus:shadow-[0_0_0_2px_#a677ee60]
                outline-none
              `}
              rows={1}
              maxLength={2048}
              placeholder="Сообщение..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  handleSend(e);
                }
              }}
              disabled={sending}
              autoFocus
            />
            <button
              type="button"
              tabIndex={-1}
              className="absolute right-2 bottom-2 p-1.5 rounded-lg hover:bg-[#a677ee]/10 transition"
              title="Смайлы"
            >
              <Smile className="w-5 h-5 text-[#a677ee]" />
            </button>
          </div>
        </div>
        <button
          type="submit"
          className={`
            flex items-center gap-1 px-5 py-3 rounded-2xl
            bg-gradient-to-tr from-[#a677ee] to-[#6c47d6]
            text-[#231c31] font-nekstmedium text-lg shadow-lg
            transition hover:from-[#6c47d6] hover:to-[#a677ee] hover:scale-[1.06]
            focus:outline-none focus:ring-2 focus:ring-[#a677ee]/70
            disabled:opacity-50
          `}
          disabled={(!input.trim() && attachments.length === 0) || sending}
        >
          <Send className="w-6 h-6" />
        </button>
      </form>
      <style jsx>{`
        @keyframes chatMsgIn {
          from {
            transform: translateY(28px) scale(0.98);
            opacity: 0;
          }
          to {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }
        .animate-chatMsgIn {
          animation: chatMsgIn 0.34s cubic-bezier(0.77, 0, 0.175, 1);
        }
        @keyframes chatAttachIn {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }
        .animate-chatAttachIn {
          animation: chatAttachIn 0.25s cubic-bezier(0.77, 0, 0.175, 1);
        }
      `}</style>
    </section>
  );
}
