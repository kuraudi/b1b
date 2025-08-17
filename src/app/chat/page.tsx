// ... (импорт и остальные константы и функции без изменений)
"use client";
import React, { useRef, useEffect, useState, Fragment, act } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProfilePanel from "./ProfilePanel";
import {
  Search,
  LinkIcon,
  Phone,
  Video,
  LayoutGrid,
  MoreVertical,
  Edit2,
  X,
  ChevronDown,
  Reply,
  Pin,
  Clipboard,
  Share2,
  Trash2,
  CheckCircle,
  Mic,
  File as FileIcon,
  Image as ImageIcon,
  Video as VideoIcon,
  Music,
  Smile,
  Users,
} from "lucide-react";
import VoiceMessage from "./VoiceMessage";
import { div } from "framer-motion/client";
import HeaderNav from "../components/common/HeaderNav";
import ChatHeader from "./ChatHeader";
import MessageGroupListWithReactions from "./ChatMessageList";
import MainChatSection from "./ChatMessageList";
import ChatAside from "./ChatAside";
import ChatFooter from "./ChatFooter";

const USERS = [
  {
    id: 1,
    name: "Sawvvka",
    avatar:
      "https://i.pinimg.com/736x/97/af/e7/97afe79fc426e31d844b626a70d3f378.jpg",
    online: true,
    lastSeen: "8 минут назад",
    phone: "+7 999 123-45-67",
    about: "Люблю React и логистику",
    username: "sawvvka",
    birthdate: "1999-04-28",
    notifications: true, // для переключателя
  },
  {
    id: 2,
    name: "Asker",
    avatar:
      "https://i.pinimg.com/736x/97/af/e7/97afe79fc426e31d844b626a70d3f378.jpg",
    online: false,
    phone: "+7 999 098-76-54",
    about: "Поставщик кофе",
    username: "asker",
    birthdate: "1988-09-10",
    notifications: false,
  },
  {
    id: 99,
    name: "Вы",
    avatar:
      "https://i.pinimg.com/736x/97/af/e7/97afe79fc426e31d844b626a70d3f378.jpg",
    online: true,
    phone: "+7 912 555-66-77",
    about: "Менеджер",
    username: "yo",
    birthdate: "2000-01-01",
    notifications: true,
  },
];
const authorId = 1;

// Пример заполнения chatFolders с поддержкой закрепленного сообщения (pinned)

const menuOptions = [
  { key: "reply", label: "Ответить", icon: <Reply size={20} /> },
  { key: "pin", label: "Закрепить", icon: <Pin size={20} /> },
  { key: "copy", label: "Копировать текст", icon: <Clipboard size={20} /> },
  { key: "forward", label: "Переслать", icon: <Share2 size={20} /> },
  { key: "delete", label: "Удалить", icon: <Trash2 size={20} /> },
  { key: "select", label: "Выделить", icon: <CheckCircle size={20} /> },
];

function renderTextWithLinks(text) {
  if (!text) return null;

  // Регулярка для ссылок (http(s), www или минимальный домен)
  const urlRegex =
    /((https?:\/\/[^\s]+)|(www\.[^\s]+)|([a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/\S*)?))/gi;

  const elements = [];
  let lastIndex = 0;

  // Проходим по всем найденным ссылкам в тексте
  for (const match of text.matchAll(urlRegex)) {
    const { index } = match;
    if (index > lastIndex) {
      // Добавляем текст между последней ссылкой и текущей
      elements.push(text.substring(lastIndex, index));
    }

    const part = match[0];
    // Формируем href с протоколом (если его нет)
    const hasProtocol = /^https?:\/\//i.test(part);
    const url = hasProtocol ? part : `https://${part}`;

    elements.push(
      <a
        key={index}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="underline text-[#2fd4c6] break-all"
      >
        {part}
      </a>
    );

    lastIndex = index + part.length;
  }

  // Добавляем оставшийся текст после последней ссылки
  if (lastIndex < text.length) {
    elements.push(text.substring(lastIndex));
  }

  return elements.length === 0 ? text : elements;
}

function getTodayString() {
  return new Date().toISOString().slice(0, 10);
}
function dateKey(date) {
  return date.slice(0, 10);
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

// --- Reply bubble (минимализм) ---
function ReplyBubble({ replyTo, onProfile }) {
  return (
    <div
      className="flex mb-2 rounded-xl overflow-hidden bg-[#362a45]"
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

export default function ChatPageWithReactionMenu2() {
  const prevMsgsRef = useRef([]);
  const [chatFolders, setChatFolders] = useState([
    {
      title: "Основные",
      key: "main",
      chats: [
        {
          id: 1,
          name: "Optima Logistics",
          lastMessage: "Отгрузку подтвердим до конца дня",
          time: "10:12",
          unread: true,
          avatar: USERS[0].avatar,
          online: false,
          about: "Логистика и доставка по Европе",
          participants: [USERS[1], USERS[2]],
          messages: [
            {
              id: 1,
              author: "Optima Logistics",
              authorId: 2,
              avatar: USERS[0].avatar,
              time: "10:12",
              text: "Отгрузку подтвердим до конца дня",
              own: false,
              date: getTodayString(),
              reactions: { "🔥": [2], "🦋": [1] },
              readBy: [0, 1],
            },
            {
              id: 2,
              author: "Вы",
              authorId: 1,
              avatar: USERS[0].avatar,
              time: "09:55",
              text: "Добрый день! Ждём подтверждение по партии из Варшавы",
              own: true,
              date: getTodayString(),
              reactions: { "💖": [1] },
              readBy: [0, 1],
            },
          ],
          // Пример закрепленного сообщения: pinned = message-object или null
          pinned: {
            id: 1,
            author: "Optima Logistics",
            authorId: 3,
            avatar: USERS[0].avatar,
            time: "10:12",
            text: "Отгрузку подтвердим до конца дня",
            own: false,
            date: getTodayString(),
            reactions: { "🔥": [99, 3], "🦋": [99] },
            readBy: [3, 99],
          },
        },
        {
          id: 3,
          name: "Снабжение Кофе+",
          lastMessage: "Счёт отправили на почту",
          time: "09:03",
          unread: false,
          avatar: USERS[0].avatar,
          online: true,
          about: "Поставщик кофейного оборудования и зерна",
          participants: [USERS[4], USERS[2]],
          messages: [
            {
              id: 1,
              author: "Снабжение Кофе+",
              authorId: 4,
              avatar: USERS[0].avatar,
              time: "09:03",
              text: "Счёт отправили на почту. Готовы отгружать со вторника.",
              own: false,
              date: getTodayString(),
              reactions: {},
              readBy: [4, 99],
            },
            {
              id: 2,
              author: "Вы",
              authorId: 99,
              avatar: USERS[0].avatar,
              time: "08:58",
              text: "Нужна новая партия зерна Brazil Santos, 100 кг",
              own: true,
              date: getTodayString(),
              reactions: {},
              readBy: [4, 99],
            },
          ],
          pinned: null, // Нет закрепленного сообщения
        },
        {
          id: 4,
          name: "АртФлекс Упаковка",
          lastMessage: "Мокап утвердили, запускаем",
          time: "11:40",
          unread: false,
          avatar: USERS[0].avatar,
          online: false,
          about: "Флексопечать и упаковка для B2B",
          participants: [USERS[5], USERS[2]],
          messages: [
            {
              id: 1,
              author: "Вы",
              authorId: 99,
              avatar: USERS[0].avatar,
              time: "11:35",
              text: "Проверьте, пожалуйста, макет для новой упаковки. Вложил в сообщение.",
              own: true,
              date: getTodayString(),
              reactions: {},
              readBy: [5, 99],
            },
            {
              id: 2,
              author: "АртФлекс Упаковка",
              authorId: 5,
              avatar: USERS[0].avatar,
              time: "11:40",
              text: "Мокап утвердили, запускаем в печать.",
              own: false,
              date: getTodayString(),
              reactions: { "😂": [99] },
              readBy: [5, 99],
            },
          ],
          pinned: null,
        },
      ],
    },
  ]);

  function handleAttachInput(type, e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    // Пример вставки файла как сообщения, доработайте, если нужна другая логика
    const url = URL.createObjectURL(file);
    setMessages((msgs) => [
      ...msgs,
      {
        id: msgs.length ? Math.max(...msgs.map((m) => m.id)) + 1 : 1,
        author: "Вы",
        authorId,
        avatar: USERS[2].avatar,
        time: getTimeString(),
        own: true,
        date: getTodayString(),
        type,
        url,
        title: file.name,
        size: (file.size / 1024).toFixed(1) + " KB",
        reactions: {},
        readBy: [99],
      },
    ]);
    // После загрузки fileInput сбрасываем значение (важно для повторного выбора одного и того же файла)
    e.target.value = "";
  }

  // --- UI State ---
  const [activeFolderKey, setActiveFolderKey] = useState(chatFolders[0].key);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredChats, setFilteredChats] = useState(
    chatFolders[0].chats || []
  );
  const [openChatId, setOpenChatId] = useState(null);
  const [activeChat, setActiveChat] = useState(null);
  const [pinnedMsg, setPinnedMsg] = useState(null);
  useEffect(() => {
    setPinnedMsg(null);
  }, [openChatId]);

  // messages, draft, search in chat
  const [messages, setMessages] = useState(activeChat?.messages || []);
  const [input, setInput] = useState("");

  // const [input, setInput] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [drafts, setDrafts] = useState({});
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
  const [showAttach, setShowAttach] = useState(false);

  // Highlighted msg id for jump-to
  const [highlightedMsgId, setHighlightedMsgId] = useState(null);

  // --- Профиль пользователя сбоку ---
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileUser, setProfileUser] = useState(null);

  // --- Focus, refs ---

  const msgEndRef = useRef(null);
  const msgRefs = useRef({});

  useEffect(() => {
    const folder =
      chatFolders.find((f) => f.key === activeFolderKey) || chatFolders[0];
    const filtered = folder.chats.filter((chat) =>
      chat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredChats(filtered);
    // *не меняем* openChatId тут
  }, [activeFolderKey, searchTerm]);

  useEffect(() => {
    const chat = filteredChats.find((c) => c.id === openChatId) || null;
    setActiveChat(chat);
    setMessages(chat?.messages ? [...chat.messages] : []);
    setInput(drafts[chat?.id] || ""); // Вот тут обновляется поле ввода
    setReplyTo(null);
    setEditMsgId(null);
    setMenuMsgId(null);
  }, [openChatId, filteredChats]);

  useEffect(() => {
    const prevMsgs = prevMsgsRef.current;
    // Текущий массив сообщений
    const currentMsgs = messages;

    // Если новый id в конце массива - scroll (т.е. было добавлено новое сообщение)
    const prevLastId = prevMsgs.length
      ? prevMsgs[prevMsgs.length - 1].id
      : null;
    const currLastId = currentMsgs.length
      ? currentMsgs[currentMsgs.length - 1].id
      : null;

    const isNewMsg =
      currentMsgs.length > prevMsgs.length && prevLastId !== currLastId;

    if (isNewMsg) {
      msgEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    // Обновление prevMsgs на след. рендер
    prevMsgsRef.current = [...currentMsgs];
  }, [messages, activeChat]);

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

  // --- Voice Recorder (MediaRecorder) ---
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recorderStream, setRecorderStream] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recorderTimer, setRecorderTimer] = useState(null);

  // Сброс рекордера
  function stopAndCleanupRecorder() {
    if (mediaRecorder) {
      mediaRecorder.stream.getTracks().forEach((track) => track.stop());
      setMediaRecorder(null);
    }
    if (recorderTimer) clearInterval(recorderTimer);
    setIsRecording(false);
    setRecordingTime(0);
    setRecorderStream(null);
  }

  async function handleStartRecording() {
    try {
      // Запрос доступа к микрофону
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Явно указываем mimeType для лучшей совместимости
      const recorder = new MediaRecorder(stream, {
        mimeType: "audio/webm; codecs=opus",
      });

      let chunks: BlobPart[] = [];

      // Сбор данных аудиоданных
      recorder.ondataavailable = (e) => {
        console.log("dataavailable size:", e.data.size);
        if (e.data.size > 0) chunks.push(e.data);
      };

      // Вспомогательная функция для вычисления длительности через Web Audio API
      const getAudioDuration = (blob: Blob): Promise<number> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const audioContext = new AudioContext();
            audioContext.decodeAudioData(
              reader.result as ArrayBuffer,
              (buffer) => {
                resolve(buffer.duration);
              },
              () => {
                reject(new Error("decodeAudioData failed"));
              }
            );
          };
          reader.onerror = () => reject(new Error("FileReader error"));
          reader.readAsArrayBuffer(blob);
        });
      };

      recorder.onstop = async () => {
        const blob = new Blob(chunks, { type: "audio/webm; codecs=opus" });
        const url = URL.createObjectURL(blob);

        try {
          let duration = await getAudioDuration(blob);
          if (isNaN(duration) || duration === Infinity) duration = 0;
          console.log("✅ Длительность аудио (Web Audio API):", duration);

          setMessages((msgs) => [
            ...msgs,
            {
              id: msgs.length ? Math.max(...msgs.map((m) => m.id)) + 1 : 1,
              author: "Вы",
              authorId: 99,
              avatar: USERS[2].avatar,
              time: getTimeString(),
              own: true,
              date: getTodayString(),
              type: "voice",
              url,
              duration,
              title: "Голосовое сообщение",
              size: (blob.size / 1024).toFixed(1) + " KB",
              reactions: {},
              readBy: [99],
            },
          ]);
        } catch (error) {
          console.warn("❌ Ошибка вычисления длительности, fallback = 0");
          setMessages((msgs) => [
            ...msgs,
            {
              id: msgs.length ? Math.max(...msgs.map((m) => m.id)) + 1 : 1,
              author: "Вы",
              authorId: 99,
              avatar: USERS[2].avatar,
              time: getTimeString(),
              own: true,
              date: getTodayString(),
              type: "voice",
              url,
              duration: 0,
              title: "Голосовое сообщение",
              size: (blob.size / 1024).toFixed(1) + " KB",
              reactions: {},
              readBy: [99],
            },
          ]);
        } finally {
          stopAndCleanupRecorder();
        }
      };

      setMediaRecorder(recorder);
      setRecorderStream(stream);
      setIsRecording(true);
      recorder.start();

      // Таймер записи
      let t = 0;
      setRecordingTime(0);
      const timer = setInterval(() => {
        t += 1;
        setRecordingTime(t);
      }, 1000);
      setRecorderTimer(timer);
    } catch (err) {
      console.error("Ошибка доступа к микрофону:", err);
      alert("Не удалось получить доступ к микрофону");
      stopAndCleanupRecorder();
    }
  }

  function handleStopRecording() {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop();
      // НЕ вызывайте stopAndCleanupRecorder() здесь!
      // Очистка и обновление состояния произойдет в onstop
    }
  }

  const isActiveChat = chatFolders
    .flatMap((folder) => folder.chats)
    .find((chat) => chat.id === openChatId);

  const ispinnedMsg = activeChat?.pinned || null;

  function handlePinMessage(msg) {
    setChatFolders((folders) =>
      folders.map((folder) => ({
        ...folder,
        chats: folder.chats.map((chat) =>
          chat.id === openChatId ? { ...chat, pinned: msg } : chat
        ),
      }))
    );
  }
  function handleUnpinMessage() {
    setChatFolders((folders) =>
      folders.map((folder) => ({
        ...folder,
        chats: folder.chats.map((chat) =>
          chat.id === openChatId ? { ...chat, pinned: null } : chat
        ),
      }))
    );
  }

  return (
    <div className="wrapper">
      <HeaderNav></HeaderNav>
      <div className="flex h-[calc(100vh-80px)] bg-[#121418] font-nekstregular">
        {/* Sidebar ... (оставьте как есть) */}
        <ChatAside
          sideSearchOpen={sideSearchOpen}
          activeChat={activeChat}
          setSideSearchOpen={setSideSearchOpen}
          sideSearchValue={sideSearchValue}
          setSideSearchValue={setSideSearchValue}
          sideSearchResults={sideSearchResults}
          setSideSearchIdx={setSideSearchIdx}
          setHighlightedMsgId={setHighlightedMsgId}
          highlightMatches={highlightMatches}
          gotoPrevSideSearch={gotoPrevSideSearch}
          gotoNextSideSearch={gotoNextSideSearch}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filteredChats={filteredChats}
          openChatId={openChatId}
          setOpenChatId={setOpenChatId}
          messages={messages}
        />
        <section className="flex-1 flex flex-col bg-[#1C1F24]">
          {activeChat ? (
            <>
              {/* Header */}
              <ChatHeader
                activeChat={activeChat}
                USERS={USERS}
                setSideSearchOpen={setSideSearchOpen}
                openUserProfile={openUserProfile}
              />

              {/* Messages */}
              <MainChatSection
                activeChat={isActiveChat}
                grouped={grouped}
                USERS={USERS}
                highlightedMsgId={highlightedMsgId}
                msgRefs={msgRefs}
                openUserProfile={openUserProfile}
                renderTextWithLinks={renderTextWithLinks}
                ReplyBubble={ReplyBubble}
                pinnedMsg={isActiveChat?.pinned}
                setPinnedMsg={setPinnedMsg}
                handlePinMessage={handlePinMessage}
                handleUnpinMessage={handleUnpinMessage}
                VoiceMessage={VoiceMessage}
                handleMenuAction={handleMenuAction} // твоя функция для обработки действий меню
                setMessages={setMessages} // твой сеттер для сообщений
                authorId={authorId} // id текущего пользователя
                msgEndRef={msgEndRef} // ref для скролла вниз
                editMsgId={editMsgId}
                setEditMsgId={setEditMsgId}
                input={input}
                setInput={setInput}
                replyTo={replyTo}
                setReplyTo={setReplyTo}
              />

              {/* Footer with input */}
              {replyTo && (
                <div className="flex items-center gap-2 px-4 py-3 mb-2 rounded-xl bg-[#232d2c] border-l-4 border-[#2fd4c6] shadow-lg">
                  <Reply size={22} className="text-[#2fd4c6]" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-[#2fd4c6] font-semibold truncate">
                      {replyTo.author}
                    </div>
                    <div className="text-xs text-[#cfcbe6] truncate">
                      {replyTo.text}
                    </div>
                  </div>
                  <button
                    className="ml-2 text-[#7a8b95] hover:text-[#2fd4c6] rounded p-0.5"
                    onClick={() => setReplyTo(null)}
                    type="button"
                    title="Отменить ответ"
                  >
                    <X size={18} />
                  </button>
                </div>
              )}

              {editMsgId && (
                <div className="flex items-center gap-2 px-4 py-3 mb-2 rounded-xl bg-[#232d2c] border-l-4 border-[#2fd4c6] shadow-lg">
                  <Edit2 size={22} className="text-[#2fd4c6]" />
                  <span className="font-bold text-[#2fd4c6] text-[15px]">
                    Редактирование
                  </span>
                  <span className="text-[#cfcbe6] ml-2 truncate flex-1">
                    {(messages.find((m) => m.id === editMsgId) || {}).text}
                  </span>
                  <button
                    className="ml-2 text-[#7a8b95] hover:text-[#2fd4c6] rounded p-0.5"
                    onClick={() => {
                      setEditMsgId(null);
                      setInput("");
                    }}
                    type="button"
                    title="Отменить редактирование"
                  >
                    ×
                  </button>
                </div>
              )}

              <ChatFooter
                isRecording={isRecording}
                handleStopRecording={handleStopRecording}
                handleStartRecording={handleStartRecording}
                mediaRecorder={mediaRecorder}
                recordingTime={recordingTime}
                setShowAttach={setShowAttach}
                showAttach={showAttach}
                handleAttachInput={handleAttachInput}
                activeChat={activeChat}
                openChatId={openChatId}
                setReplyTo={setReplyTo}
                setActiveChat={setActiveChat}
                setMessages={setMessages}
                setEditMsgId={setEditMsgId}
                setMenuMsgId={setMenuMsgId}
                filteredChats={filteredChats}
                input={input}
                setInput={setInput}
                drafts={drafts}
                setDrafts={setDrafts}
                editMsgId={editMsgId}
                USERS={USERS}
                getTimeString={getTimeString}
                getTodayString={getTodayString}
                setFilteredChats={setFilteredChats}
                replyTo={replyTo}
                authorId={authorId}
              />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-[#7a8b95] text-lg select-none px-6 text-center  bg-gradient-to-bl from-[#191b1f] via-[#171418] to-[#191b1f]">
              Выберите кому хотели бы написать
            </div>
          )}
        </section>

        {/* Profile Panel, с передачей messages (для синхронизации категорий) */}
        <AnimatePresence>
          {profileOpen && (
            <ProfilePanel
              user={profileUser}
              open={profileOpen}
              onClose={() => setProfileOpen(false)}
              chatMessages={messages}
            />
          )}
        </AnimatePresence>
        <style>{`
        ::selection { background: #2fd4c6; color: #121418 }
      `}</style>
      </div>
    </div>
  );
}

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
