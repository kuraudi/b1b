"use client";
import React, { useRef, useEffect, useState, Fragment } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProfilePanel from "./ProfilePanel";
import {
  Search,
  Phone,
  Video,
  LayoutGrid,
  MoreVertical,
  X,
  ChevronDown,
  Reply,
  Pin,
  Clipboard,
  Share2,
  Trash2,
  CheckCircle,
} from "lucide-react";

// --- DEMO USERS ---
const USERS = [
  {
    id: 1,
    name: "Sawvvka",
    avatar:
      "https://i.pinimg.com/736x/97/af/e7/97afe79fc426e31d844b626a70d3f378.jpg",
    online: true,
    lastSeen: "8 минут назад",
  },
  {
    id: 2,
    name: "Asker",
    avatar:
      "https://ui-avatars.com/api/?name=Asker&background=8d6ad7&color=fff",
    online: false,
  },
  {
    id: 99,
    name: "Вы",
    avatar: "https://ui-avatars.com/api/?name=YO&background=2a2c33&color=fff",
    online: true,
  },
];

const chatFolders = [
  {
    title: "Основные",
    key: "main",
    chats: [
      {
        id: 1,
        name: "Sawvvka",
        lastMessage: "33 Pedics",
        time: "16:35",
        unread: false,
        avatar: USERS[0].avatar,
        online: true,
        about: "Sawvvka",
        participants: [USERS[0], USERS[1], USERS[2]],
        messages: [
          {
            id: 1,
            author: "Sawvvka",
            authorId: 1,
            avatar: USERS[0].avatar,
            time: "16:33",
            text: "33 Pedics",
            own: false,
            date: getTodayString(),
            reactions: {},
            readBy: [1, 2, 99],
          },
          {
            id: 2,
            author: "Asker",
            authorId: 2,
            avatar: USERS[1].avatar,
            time: "13:48",
            text: "Разбери пока\nДобро",
            own: false,
            replyTo: {
              author: "Sawvvka",
              text: "Разбери пока",
              color: "#c8a7f1",
              stripe: "#b07ee7",
              bgUrl: "https://cdn.upload.systems/uploads/6XJwB4yF.png",
            },
            date: getTodayString(),
            reactions: {},
            readBy: [1, 2, 99],
          },
        ],
      },
    ],
  },
];

const menuOptions = [
  { key: "reply", label: "Ответить", icon: <Reply size={20} /> },
  { key: "pin", label: "Закрепить", icon: <Pin size={20} /> },
  { key: "copy", label: "Копировать текст", icon: <Clipboard size={20} /> },
  { key: "forward", label: "Переслать", icon: <Share2 size={20} /> },
  { key: "delete", label: "Удалить", icon: <Trash2 size={20} /> },
  { key: "select", label: "Выделить", icon: <CheckCircle size={20} /> },
];

function getTodayString() {
  return new Date().toISOString().slice(0, 10);
}
function dateKey(date) {
  return date.slice(0, 10);
}
function groupMessagesByDate(messages) {
  if (!messages.length) return [];
  const now = new Date();
  const todayKey = dateKey(now.toISOString());
  const yesterdayKey = dateKey(new Date(Date.now() - 86400000).toISOString());

  const grouped = {};
  messages.forEach((m) => {
    grouped[m.date] = grouped[m.date] || [];
    grouped[m.date].push(m);
  });

  return Object.entries(grouped)
    .sort(([d1], [d2]) => (d1 > d2 ? 1 : -1))
    .map(([d, msgs]) => {
      let title;
      if (d === todayKey) title = "Сегодня";
      else if (d === yesterdayKey) title = "Вчера";
      else
        title = new Intl.DateTimeFormat("ru-RU", {
          month: "long",
          year: "numeric",
        }).format(new Date(d));
      return { date: title, items: msgs };
    });
}

function getTimeString() {
  const d = new Date();
  return d.toLocaleTimeString().slice(0, 5);
}

function highlightMatches(text, search) {
  if (!search) return text;
  const regex = new RegExp(`(${escapeRegExp(search)})`, "gi");
  return text.split(regex).map((part, i) =>
    part.toLowerCase() === search.toLowerCase() ? (
      <mark key={i} className="bg-[#2fd4c6] text-black rounded px-1">
        {part}
      </mark>
    ) : (
      part
    )
  );
}
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// --- Контекстное меню с иконками (минимализм) ---
function ContextMenu({ open, anchor, msg, onAction, onClose }) {
  if (!open || !anchor || !msg) return null;
  const { x, y } = anchor;
  return (
    <AnimatePresence>
      <motion.div
        key="context-menu"
        className="fixed z-[99]"
        style={{ left: x, top: y }}
        initial={{ opacity: 0, scale: 0.92, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        onContextMenu={(e) => e.preventDefault()}
        onMouseLeave={onClose}
      >
        <div className="bg-[#191b1f] border border-[#23232b] rounded-2xl shadow-xl py-2 px-0 min-w-[220px]">
          {menuOptions.map((item) => (
            <button
              key={item.key}
              className="flex items-center gap-3 px-5 py-2 w-full text-left text-gray-200 hover:bg-[#23262f] transition rounded-xl"
              onClick={() => {
                onAction(item.key, msg);
                onClose();
              }}
            >
              <span className="opacity-90">{item.icon}</span>
              <span className="font-medium text-base">{item.label}</span>
            </button>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// --- Reply bubble (минимализм) ---
function ReplyBubble({ replyTo, onProfile }) {
  return (
    <div
      className="flex mb-2 rounded-xl overflow-hidden bg-[#23232b]"
      style={{
        minHeight: 36,
      }}
    >
      <div
        className="w-1.5"
        style={{
          background:
            replyTo.stripe ||
            "linear-gradient(180deg,#b07ee7 0 50%,#c8a7f1 50% 100%)",
        }}
      />
      <div className="flex-1 px-3 py-2">
        <span
          className="block font-semibold text-[#bbaae9] leading-none cursor-pointer text-sm"
          onClick={onProfile}
        >
          {replyTo.author}
        </span>
        <span className="block text-[#cfcbe6] text-sm leading-tight whitespace-pre-line">
          {replyTo.text}
        </span>
      </div>
    </div>
  );
}

// --- Группировка подряд идущих сообщений одного пользователя ---
function groupSequential(messages) {
  if (!messages.length) return [];
  const result = [];
  let group = null;
  messages.forEach((msg, idx) => {
    if (
      !group ||
      group.authorId !== msg.authorId ||
      messages[idx - 1]?.date !== msg.date
    ) {
      group && result.push(group);
      group = {
        authorId: msg.authorId,
        avatar: USERS.find((u) => u.id === msg.authorId)?.avatar,
        name: USERS.find((u) => u.id === msg.authorId)?.name,
        messages: [],
      };
    }
    group.messages.push(msg);
  });
  group && result.push(group);
  return result;
}

export default function ChatPageWithReactionMenu2() {
  // --- UI State ---
  const [activeFolderKey, setActiveFolderKey] = useState(chatFolders[0].key);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredChats, setFilteredChats] = useState(
    chatFolders[0].chats || []
  );
  const [openChatId, setOpenChatId] = useState(filteredChats[0]?.id || null);
  const [activeChat, setActiveChat] = useState(filteredChats[0] || null);

  // messages, draft, search in chat
  const [messages, setMessages] = useState(activeChat?.messages || []);
  const [drafts, setDrafts] = useState({});
  const [input, setInput] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [editMsgId, setEditMsgId] = useState(null);

  // Контекстное меню и закреп
  const [menuMsgId, setMenuMsgId] = useState(null);
  const [menuAnchorMsg, setMenuAnchorMsg] = useState(null);

  // Софт-удаление/восстановление
  const [deletedMsgs, setDeletedMsgs] = useState({});

  // Поиск по сообщениям (side search)
  const [sideSearchOpen, setSideSearchOpen] = useState(false);
  const [sideSearchValue, setSideSearchValue] = useState("");
  const [sideSearchResults, setSideSearchResults] = useState([]);
  const [sideSearchIdx, setSideSearchIdx] = useState(0);

  // Highlighted msg id for jump-to
  const [highlightedMsgId, setHighlightedMsgId] = useState(null);

  // --- Профиль пользователя сбоку ---
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileUser, setProfileUser] = useState(null);

  // --- Focus, refs ---
  const inputRef = useRef(null);
  const fileInputRef = useRef({});

  const msgEndRef = useRef(null);
  const msgRefs = useRef({});

  // --- sync filtered chats/messages ---
  useEffect(() => {
    const folder =
      chatFolders.find((f) => f.key === activeFolderKey) || chatFolders[0];
    const filtered = folder.chats.filter((chat) =>
      chat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredChats(filtered);
    setOpenChatId(filtered[0]?.id || null);
  }, [activeFolderKey, searchTerm]);

  useEffect(() => {
    const chat = filteredChats.find((c) => c.id === openChatId) || null;
    setActiveChat(chat);
    setMessages(chat?.messages ? [...chat.messages] : []);
    setInput(drafts[chat?.id] || "");
    setReplyTo(null);
    setEditMsgId(null);
    setMenuMsgId(null);
  }, [openChatId, filteredChats]);

  useEffect(() => {
    if (activeChat) {
      activeChat.messages = [...messages];
    }
    msgEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeChat]);

  useEffect(() => {
    if (!activeChat) return;
    setDrafts((drafts) => ({ ...drafts, [activeChat.id]: input }));
  }, [input, activeChat]);

  // --- SEARCH IN CHAT (side panel) ---
  useEffect(() => {
    if (!sideSearchValue) {
      setSideSearchResults([]);
      setSideSearchIdx(0);
      return;
    }
    const found = [];
    messages.forEach((msg, idx) => {
      if (
        msg.text &&
        msg.text.toLowerCase().includes(sideSearchValue.toLowerCase())
      )
        found.push(idx);
    });
    setSideSearchResults(found);
    setSideSearchIdx(found.length ? 0 : -1);
  }, [sideSearchValue, messages]);

  // --- Перемотка к сообщению при клике в поиске ---
  useEffect(() => {
    if (
      sideSearchResults.length > 0 &&
      typeof sideSearchIdx === "number" &&
      sideSearchIdx >= 0 &&
      sideSearchIdx < sideSearchResults.length
    ) {
      const msgIdx = sideSearchResults[sideSearchIdx];
      const msg = messages[msgIdx];
      if (msg && msgRefs.current[msg.id]) {
        msgRefs.current[msg.id].scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        setHighlightedMsgId(msg.id);
        setTimeout(() => setHighlightedMsgId(null), 1000);
      }
    }
  }, [sideSearchIdx, sideSearchResults, messages]);

  // --- Контекстное меню ---
  function handleBubbleContextMenu(e, msg) {
    e.preventDefault();
    e.stopPropagation();
    setMenuMsgId(msg.id);
    setMenuAnchorMsg({ x: e.clientX, y: e.clientY });
  }

  // --- Отправка ---
  function handleSend() {
    if (editMsgId) {
      setMessages((msgs) =>
        msgs.map((m) =>
          m.id === editMsgId ? { ...m, text: input, edited: true } : m
        )
      );
      setEditMsgId(null);
      setInput("");
      setReplyTo(null);
      return;
    }
    if (input.trim()) {
      const newMsg = {
        id: messages.length ? Math.max(...messages.map((m) => m.id)) + 1 : 1,
        author: "Вы",
        authorId: 99,
        avatar: USERS[2].avatar,
        time: getTimeString(),
        text: input,
        own: true,
        date: getTodayString(),
        replyTo: replyTo
          ? {
              author: replyTo.author,
              text: replyTo.text,
              color: "#c8a7f1",
              stripe: "#b07ee7",
              bgUrl: "https://cdn.upload.systems/uploads/6XJwB4yF.png",
            }
          : undefined,
        reactions: {},
        readBy: [99],
      };
      setMessages((msgs) => [...msgs, newMsg]);
      setInput("");
      setReplyTo(null);
    }
  }
  function handleInputKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  // --- Действия меню ---
  function handleMenuAction(key, msg) {
    if (key === "reply") setReplyTo(msg);
    if (key === "pin") {
      // todo: pin logic
    }
    if (key === "copy") {
      navigator.clipboard.writeText(msg.text);
    }
    if (key === "forward") {
      alert("Переслать: " + msg.text);
    }
    if (key === "delete") {
      setMessages((msgs) => msgs.filter((m) => m.id !== msg.id));
    }
    if (key === "select") {
      // todo: select logic
    }
    setMenuMsgId(null);
  }
  function openUserProfile(user) {
    setProfileUser(user);
    setProfileOpen(true);
  }

  // --- Side search: переход к след/пред ---
  function gotoNextSideSearch() {
    if (!sideSearchResults.length) return;
    setSideSearchIdx((idx) => (idx + 1) % sideSearchResults.length);
  }
  function gotoPrevSideSearch() {
    if (!sideSearchResults.length) return;
    setSideSearchIdx(
      (idx) => (idx - 1 + sideSearchResults.length) % sideSearchResults.length
    );
  }

  

  // --- render messages, grouped and minimalist ---
  const grouped = groupSequential(messages);

  return (
    <div className="flex h-screen bg-[#121418] font-nekstregular">
      {/* Sidebar ... (оставьте как есть) */}
      <aside className="w-[350px] min-w-[240px] max-w-[420px] bg-[#191b1f] border-r border-[#222b32] flex flex-col relative">
        {/* SEARCH PANEL (slide in) */}
        <AnimatePresence>
          {sideSearchOpen && (
            <motion.div
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              className="absolute inset-0 bg-[#2a3237] z-20 border-r border-[#232b32] flex flex-col overflow-auto"
            >
              <div className="flex flex-col gap-2 px-4 pt-5 pb-2">
                <div className="text-[#7a8b95] text-[15px] font-bold mb-1">
                  Поиск в чате:
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <img
                    src={activeChat?.avatar}
                    className="w-7 h-7 rounded-full border border-[#232b32]"
                  />
                  <span className="text-[#f3f7fa] font-bold text-[15px]">
                    Этот чат
                  </span>
                  <ChevronDown size={17} className="text-[#7a8b95]" />
                  <button
                    className="ml-auto text-[#7a8b95] hover:text-[#2fd4c6] text-xl"
                    onClick={() => setSideSearchOpen(false)}
                  >
                    <X size={21} />
                  </button>
                </div>
                <input
                  autoFocus
                  value={sideSearchValue}
                  onChange={(e) => setSideSearchValue(e.target.value)}
                  placeholder="Поиск по сообщениям"
                  className="w-full rounded-md bg-[#232b32] px-4 py-2 text-[#d8e2e6] placeholder-[#6a7b87] border-none focus:outline-none focus:ring-2 focus:ring-[#2fd4c6]/40 shadow"
                />
              </div>
              {/* Results */}
              <div className="flex-1 flex flex-col items-center justify-center text-[#7a8b95] select-none">
                {sideSearchValue ? (
                  sideSearchResults.length > 0 ? (
                    <div className="w-full h-full flex flex-col items-center pt-8">
                      <div className="max-w-full w-[92%]">
                        {sideSearchResults.map((msgIdx, i) => {
                          const msg = messages[msgIdx];
                          return (
                            <div
                              key={msg.id}
                              className={`rounded-lg px-4 py-3 mb-2 bg-[#252e35] text-[#e3e6f3] cursor-pointer hover:bg-[#2fd4c6]/10 ${
                                sideSearchIdx === i
                                  ? "ring-2 ring-[#2fd4c6]"
                                  : ""
                              }`}
                              onClick={() => {
                                setSideSearchIdx(i);
                                setSideSearchOpen(false);
                                // jump к сообщению, highlight
                                setTimeout(() => {
                                  setHighlightedMsgId(msg.id);
                                  setTimeout(
                                    () => setHighlightedMsgId(null),
                                    1000
                                  );
                                }, 180);
                              }}
                            >
                              <span className="block font-semibold mb-1">
                                {msg.author}
                              </span>
                              <span>
                                {highlightMatches(msg.text, sideSearchValue)}
                              </span>
                              <span className="block text-xs mt-1 text-[#7a8b95]">
                                {msg.time}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={gotoPrevSideSearch}
                          className="px-2 py-1 text-[#2fd4c6]"
                        >
                          ⟨
                        </button>
                        <span className="text-[#2fd4c6]">
                          {sideSearchIdx + 1}
                        </span>
                        <button
                          onClick={gotoNextSideSearch}
                          className="px-2 py-1 text-[#2fd4c6]"
                        >
                          ⟩
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center pt-16">
                      <img
                        src="https://cdn-icons-png.flaticon.com/512/751/751463.png"
                        className="w-16 h-16 opacity-70 mb-3"
                      />
                      <div>Нет результатов</div>
                    </div>
                  )
                ) : (
                  <div className="flex flex-col items-center pt-16">
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/751/751463.png"
                      className="w-16 h-16 opacity-70 mb-3"
                    />
                    <div>Поиск по сообщениям</div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Top search/chatlist */}
        <div className="flex items-center gap-2 px-4 py-3">
          <input
            className="flex-1 h-10 rounded-lg bg-[#252e35] border-none text-[#b0b6ba] placeholder-[#6a7b87] px-4 py-2 focus:outline-none transition font-medium"
            placeholder="Поиск"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {/* Фолдеры */}
        <div className="flex gap-2 px-4 py-2">
          {chatFolders.map((folder) => (
            <button
              key={folder.key}
              className={`
                        px-5 py-2 rounded-2xl font-bold text-[15px] transition shadow-sm border-0 relative
                        ${
                          activeFolderKey === folder.key
                            ? "bg-[#2fd4c6] text-[#232b32] shadow-lg scale-105"
                            : "bg-[#222b32] text-[#7a8b95] hover:bg-[#2fd4c6]/10 hover:text-[#2fd4c6]"
                        }
                      `}
              style={
                activeFolderKey === folder.key
                  ? { boxShadow: "0 3px 18px -4px #2fd4c6c0" }
                  : {}
              }
              onClick={() => setActiveFolderKey(folder.key)}
            >
              {folder.title}
            </button>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto pt-2 pb-4">
          {!filteredChats.length && (
            <div className="text-[#7A85A5] text-center pt-8">
              Чаты не найдены
            </div>
          )}
          {filteredChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setOpenChatId(chat.id)}
              className={`
                        flex items-center px-3 py-3 cursor-pointer rounded-[3px] mx-2 mb-1 transition-colors
                        ${
                          chat.id === openChatId
                            ? "bg-[#2fd4c6] text-[#232b32] shadow-lg scale-105"
                            : "hover:bg-[#2fd4c6]/10 hover:text-[#2fd4c6]"
                        }
                      `}
              style={
                chat.id === openChatId
                  ? { boxShadow: "0 3px 18px -4px #2fd4c6c0" }
                  : {}
              }
            >
              <img
                src={chat.avatar}
                alt={chat.name}
                className="rounded-full w-10 h-10 border-2 border-[#2fd4c6]/40 shadow mr-3"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-[#232b32] font-bold truncate">
                    {chat.name}
                  </span>
                  <span className="text-xs text-[#2fd4c6] font-semibold">
                    {chat.time}
                  </span>
                </div>
                <div className="text-[#232b32] text-sm truncate">
                  {chat.lastMessage}
                </div>
              </div>
              {chat.unread && (
                <span className="ml-2 bg-[#3ccfcf] text-[#232b32] rounded-full text-xs w-6 h-6 flex items-center justify-center font-bold shadow-lg">
                  1
                </span>
              )}
            </div>
          ))}
        </div>
      </aside>
      {/* Chat area */}
      <section className="flex-1 flex flex-col bg-[#1C1F24]">
        {/* Header ... (оставьте как есть) */}
        {activeChat && (
          <header className="h-16 px-8 flex items-center border-b border-[#1f2227] bg-[#232b32] flex-shrink-0">
            <div className="flex items-center flex-1">
              <img
                src={activeChat.avatar}
                className="w-9 h-9 rounded-full border-2 border-[#2fd4c6]/40 cursor-pointer"
                alt={activeChat.name}
                onClick={() => openUserProfile(USERS[0])}
              />
              <div className="ml-3">
                <span
                  className="text-[#f2f6f6] font-bold text-[17px] cursor-pointer hover:underline"
                  onClick={() => openUserProfile(USERS[0])}
                >
                  {activeChat.name}
                </span>
                <div className="text-xs text-[#99c2c2] font-semibold mt-0.5">
                  был(а) {USERS[0].lastSeen}
                </div>
              </div>
            </div>
            {/* header actions */}
            <div className="flex items-center gap-5">
              <button
                className="text-[#7a8b95] hover:text-[#2fd4c6] transition"
                onClick={() => setSideSearchOpen(true)}
              >
                <Search size={22} />
              </button>
              <button className="text-[#7a8b95] hover:text-[#2fd4c6] transition">
                <Phone size={22} />
              </button>
              <button className="text-[#7a8b95] hover:text-[#2fd4c6] transition">
                <Video size={22} />
              </button>
              <button className="text-[#7a8b95] hover:text-[#2fd4c6] transition">
                <LayoutGrid size={22} />
              </button>
              <button className="text-[#7a8b95] hover:text-[#2fd4c6] transition">
                <MoreVertical size={22} />
              </button>
            </div>
          </header>
        )}
        <main className="flex-1 overflow-y-auto px-2 py-4">
          <div className="flex flex-col gap-2">
            <AnimatePresence initial={false}>
              {grouped.map((group, i) => {
                const isOwn = group.authorId === 99;
                return (
                  <motion.div
                    key={i}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 12 }}
                    className={`flex ${
                      isOwn ? "justify-end" : "justify-start"
                    } gap-2 items-end`}
                  >
                    {!isOwn && (
                      <img
                        src={group.avatar}
                        alt={group.name}
                        className="w-8 h-8 rounded-xl border border-[#22232a] mb-1"
                        onClick={() =>
                          openUserProfile(
                            USERS.find((u) => u.name === group.name)
                          )
                        }
                      />
                    )}
                    <div
                      className={`flex flex-col gap-1 max-w-[72%] ${
                        isOwn ? "items-end" : ""
                      }`}
                    >
                      {group.messages.map((msg, idx) => {
                        const isHighlighted = highlightedMsgId === msg.id;
                        return (
                          <motion.div
                            layout
                            key={msg.id}
                            ref={(el) => (msgRefs.current[msg.id] = el)}
                            initial={{ opacity: 0, scale: 0.97, y: 8 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 8 }}
                            className={`
                              relative px-3 py-2
                              rounded-xl
                              border ${
                                isOwn ? "border-[#20242c]" : "border-[#23242d]"
                              }
                              bg-[#23232b] bg-opacity-85
                              text-gray-100
                              text-[15px]
                              ${isOwn ? "self-end" : ""}
                              transition-all
                              ${
                                isHighlighted
                                  ? "ring-4 ring-[#9cf5ff] bg-[#232d2c] border-[#2fd4c6]"
                                  : ""
                              }
                            `}
                            onContextMenu={(e) =>
                              handleBubbleContextMenu(e, msg)
                            }
                          >
                            {msg.replyTo && (
                              <ReplyBubble
                                replyTo={msg.replyTo}
                                onProfile={() =>
                                  openUserProfile(
                                    USERS.find(
                                      (u) => u.name === msg.replyTo.author
                                    )
                                  )
                                }
                              />
                            )}
                            <span className="block">{msg.text}</span>
                            <span className="block text-xs text-gray-500 mt-1 leading-none">
                              {msg.time}
                            </span>
                          </motion.div>
                        );
                      })}
                    </div>
                    {isOwn && (
                      <img
                        src={group.avatar}
                        alt={group.name}
                        className="w-8 h-8 rounded-xl border border-[#22232a] mb-1"
                      />
                    )}
                    <ContextMenu
                      open={
                        menuMsgId ===
                        group.messages[group.messages.length - 1]?.id
                      }
                      anchor={menuAnchorMsg}
                      msg={group.messages[group.messages.length - 1]}
                      onAction={handleMenuAction}
                      onClose={() => setMenuMsgId(null)}
                    />
                  </motion.div>
                );
              })}
              <div ref={msgEndRef}></div>
            </AnimatePresence>
          </div>
        </main>
        <footer className="flex items-center gap-2 px-4 py-3 bg-[#191b1f] border-t border-[#191b1f]">
          <input
            ref={inputRef}
            className="flex-1 bg-[#181a1f] text-gray-100 rounded-xl px-4 py-2 focus:outline-none placeholder:text-gray-500 transition"
            placeholder="Введите сообщение..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleInputKeyDown}
          />
          <button
            className="bg-[#232b32] hover:bg-[#2fd4c6] hover:text-[#181a1f] text-[#2fd4c6] font-bold rounded-xl px-5 py-2 transition disabled:opacity-60"
            onClick={handleSend}
            disabled={!input.trim()}
          >
            Отправить
          </button>
        </footer>
      </section>
      <AnimatePresence>
        {profileOpen && (
          <ProfilePanel
            user={profileUser}
            open={profileOpen}
            onClose={() => setProfileOpen(false)}
          />
        )}
      </AnimatePresence>
      <style>{`
        ::selection { background: #2fd4c6; color: #121418 }
      `}</style>
    </div>
  );
}
