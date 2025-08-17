"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  User2,
  Paperclip,
  Smile,
  Search,
  Check,
  MoreVertical,
  Phone,
  Video,
  Monitor,
} from "lucide-react";
// import HeaderNav from "../components/common/HeaderNav";
import Footer from "../components/common/Footer";
import MessengerMain from "../components/common/MessengerMain";

// DEMO: dialogs and messages, аватарка-заглушка для всех
const AVATAR = "/main/catalog/id4.jpg";
const demoDialogs = [
  {
    id: 1,
    name: "Александр Новиков",
    lastMessage: "Спасибо, все получил! Отличная отгрузка.",
    avatar: AVATAR,
    online: false,
    unread: 0,
  },
  {
    id: 2,
    name: "МеталлПром",
    lastMessage: "Документы прикрепили в письме, посмотрите.",
    avatar: AVATAR,
    online: true,
    unread: 1,
  },
  {
    id: 3,
    name: "Мария Павлова",
    lastMessage: "Согласна на условия. Когда запуск?",
    avatar: AVATAR,
    online: false,
    unread: 0,
  },
  {
    id: 4,
    name: "ООО ЛидерПак",
    lastMessage: "Фотографии оборудования выслал.",
    avatar: AVATAR,
    online: false,
    unread: 0,
  },
  {
    id: 5,
    name: "Иван Петров",
    lastMessage: "Жду счет на оплату.",
    avatar: AVATAR,
    unread: 2,
    online: false,
  },
  {
    id: 6,
    name: "Артемий Сидоров",
    lastMessage: "Можем обсудить завтра в 12:00?",
    avatar: AVATAR,
    unread: 0,
    online: false,
  },
  {
    id: 7,
    name: "ТехноЛогистика",
    lastMessage: "Транспорт выехал, ожидайте звонка.",
    avatar: AVATAR,
    unread: 0,
    online: false,
  },
  {
    id: 8,
    name: "Инженер Сервис",
    lastMessage: "Готовы к монтажу с 15 августа.",
    avatar: AVATAR,
    unread: 0,
    online: false,
  },
];

// Для "bubble-группировки" сообщений
function isFirstOfGroup(messages, idx) {
  if (idx === 0) return true;
  return messages[idx].fromMe !== messages[idx - 1].fromMe;
}
function isLastOfGroup(messages, idx) {
  if (idx === messages.length - 1) return true;
  return messages[idx].fromMe !== messages[idx + 1].fromMe;
}

const demoMessages = [
  {
    id: 1,
    fromMe: false,
    text: "Добрый вечер! Получили комплектующие, все в порядке.",
    time: "14:18",
    status: "read",
  },
  {
    id: 2,
    fromMe: true,
    text: "Добрый! Отлично, рад что всё оперативно доставили.",
    time: "14:19",
    status: "read",
  },
  {
    id: 3,
    fromMe: false,
    text: "Есть вопрос по инструкции, можно уточнить пару моментов?",
    time: "14:20",
    status: "read",
  },
  {
    id: 4,
    fromMe: true,
    text: "Конечно, пишите что непонятно – всё объясню.",
    time: "14:21",
    status: "read",
  },
  {
    id: 5,
    fromMe: false,
    text: "Во втором пункте не совсем ясно по подключению.",
    time: "14:21",
    status: "read",
  },
  {
    id: 6,
    fromMe: true,
    text: "Там нужно сначала подать питание, а потом подключить сеть.\nЕсли что, могу скинуть видеоинструкцию.",
    time: "14:22",
    status: "read",
  },
  {
    id: 7,
    fromMe: false,
    text: "Да, было бы здорово, спасибо!",
    time: "14:23",
    status: "read",
  },
  {
    id: 8,
    fromMe: true,
    text: "я что-то последние дни занят был",
    time: "20:20",
    status: "read",
  },
  {
    id: 9,
    fromMe: true,
    text: "сегодня хотел",
    time: "20:20",
    status: "read",
  },
  {
    id: 10,
    fromMe: true,
    text: "но отсыпался",
    time: "20:20",
    status: "read",
  },
];

function getTime() {
  const d = new Date();
  return d
    .toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })
    .replace(/^(\d):/, "0$1:");
}

export default function MessagesDesktopLikeTelegram() {
  const [dialogs] = useState(demoDialogs);
  const [activeDialogId, setActiveDialogId] = useState(1);
  const [messages, setMessages] = useState(demoMessages);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [animatedIds, setAnimatedIds] = useState<number[]>([]);
  const messagesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesRef.current?.scrollTo({
      top: messagesRef.current.scrollHeight + 100,
      behavior: "smooth",
    });
  }, [messages, sending, activeDialogId]);

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

  function handleSend(e?: React.FormEvent) {
    e?.preventDefault();
    if (!input.trim()) return;
    const msg = {
      id: Date.now(),
      fromMe: true,
      text: input,
      time: getTime(),
      status: "sending" as const,
    };
    setMessages((m) => [...m, msg]);
    setInput("");
    setSending(true);
    setTimeout(() => {
      setMessages((m) =>
        m.map((mm) => (mm.id === msg.id ? { ...mm, status: "read" } : mm))
      );
    }, 800);
  }

  // Switch dialog (demo: always uses same messages)
  function handleDialogClick(id: number) {
    setActiveDialogId(id);
    setMessages(demoMessages);
    setAnimatedIds([]);
  }

  return (
    <div className="bg-[#23272d] min-h-screen font-nekstregular flex flex-col">
      {/* <HeaderNav /> */}
      <div className="flex flex-1 min-h-0 h-[calc(100vh-60px)] max-h-[calc(100vh)]">
        {/* Sidebar */}
        <div className="w-[370px] min-w-[270px] max-w-[400px] bg-gradient-to-b from-[#262627] via-[#23272d] to-[#1e1d25] border-r border-[#232938] flex flex-col">
          {/* Search */}
          <div className="p-4 pb-1">
            <div className="flex items-center gap-2 px-3 py-2 bg-[#232b37]/70 rounded-2xl border border-[#262b38]">
              <Search className="w-5 h-5 text-[#8f8fbb]" />
              <input
                className="bg-transparent outline-none text-[#bcb7e5] font-nekstregular w-full text-base"
                placeholder="Поиск"
              />
            </div>
          </div>
          {/* Dialogs */}
          <div className="flex-1 overflow-y-auto pt-1 pb-3">
            {dialogs.map((d, i) => (
              <div
                key={d.id}
                className={`flex items-center px-5 py-3 gap-3 cursor-pointer transition-all select-none group
                  ${
                    d.id === activeDialogId
                      ? "bg-[#6228be] bg-gradient-to-r from-[#28b6be]/90 to-[#232b37]/70"
                      : "hover:bg-[#282f3d]/90"
                  }
                `}
                onClick={() => handleDialogClick(d.id)}
              >
                <div className="relative">
                  {d.avatar ? (
                    <img
                      src={d.avatar}
                      alt={d.name}
                      className="w-11 h-11 rounded-full object-cover border border-[#393959] shadow"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-[#3e2c54] flex items-center justify-center font-bold text-xl text-[#a677ee]">
                      {d.name[0]}
                    </div>
                  )}
                  {d.verified && (
                    <span className="absolute -bottom-1 -right-1 bg-[#232136] rounded-full p-1 border-2 border-[#232136]">
                      <Check className="w-3 h-3 text-[#00caff]" />
                    </span>
                  )}
                  {d.online && (
                    <span className="absolute -bottom-1 -left-1 w-3 h-3 rounded-full bg-[#36cb7f] border-2 border-[#232136]" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className={`font-nekstmedium truncate ${
                      d.id === activeDialogId
                        ? "text-white"
                        : "text-[#dbb8ff] group-hover:text-white"
                    }`}
                  >
                    {d.name}
                  </div>
                  <div className="text-xs truncate text-[#8f8fbb]">
                    {d.lastMessage}
                  </div>
                </div>
                {d.unread > 0 && (
                  <span className="ml-2 text-xs bg-[#a677ee] text-white rounded-full px-2 font-bold shadow">
                    {d.unread}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
        {/* Main chat */}
        <MessengerMain></MessengerMain>
      </div>
      {/* <Footer /> */}
      <style jsx global>{`
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
          animation: chatMsgIn 0.38s cubic-bezier(0.77, 0, 0.175, 1);
        }
        .font-nekstmedium {
          font-family: "Nekst Medium", sans-serif;
        }
        .font-nekstregular {
          font-family: "Nekst Regular", sans-serif;
        }
        html,
        body,
        #__next {
          height: 100%;
        }
      `}</style>
    </div>
  );
}
