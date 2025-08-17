// ChatPage.jsx
"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Search,
  Send,
  Paperclip,
  Smile,
  User,
  MoreVertical,
  ChevronLeft,
  MapPin,
  CornerUpLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * ChatPage — demo chat with:
 * - darker context menu
 * - file uploads (images preview + documents)
 * - drag & drop
 * - message search (click -> open convo + jump to message)
 * - fixed scrolling behavior
 */
export default function ChatPage({
  selectedAccent = "#60A5FA",
  selectedTheme = "Dark",
  conversations: propConversations,
  initialConversationId = null,
  onSendMessage,
}) {
  const accent = selectedAccent || "#60A5FA";
  const isDark = selectedTheme === "Dark";
  const currentUser = "You";

  // Demo convos
  const demoConvos = useMemo(
    () => [
      {
        id: "c1",
        title: "Аня, Дизайн",
        subtitle: "Последнее: Ты отправил макет",
        avatarColor: "#F87171",
        unread: 2,
        messages: [
          {
            id: "m1",
            fromMe: false,
            author: "Anya",
            text: "Привет! Как продвигается макет?",
            ts: "9:02",
            reactions: {},
          },
          {
            id: "m2",
            fromMe: true,
            author: "You",
            text: "Почти готов, сейчас покажу варианты ✨",
            ts: "9:10",
            reactions: { "✨": ["You"] },
          },
          {
            id: "m3",
            fromMe: false,
            author: "Anya",
            text: "Отлично, с нетерпением жду!",
            ts: "9:12",
            reactions: {},
          },
        ],
      },
      {
        id: "c2",
        title: "Михаил",
        subtitle: "Последнее: Окей",
        avatarColor: "#34D399",
        unread: 0,
        messages: [
          {
            id: "m1",
            fromMe: true,
            author: "You",
            text: "Статус?",
            ts: "вчера",
            reactions: {},
          },
          {
            id: "m2",
            fromMe: false,
            author: "Misha",
            text: "Готово, залил на сервер.",
            ts: "вчера",
            reactions: {},
          },
        ],
      },
    ],
    []
  );

  const conversationsInit =
    propConversations && propConversations.length
      ? propConversations
      : demoConvos;

  const [conversations, setConversations] = useState(conversationsInit);
  const [activeId, setActiveId] = useState(
    initialConversationId || conversationsInit[0].id
  );

  // messagesMap stores messages for each convo; messages can have .file (name,type,size,previewUrl)
  const [messagesMap, setMessagesMap] = useState(() => {
    const map = {};
    conversationsInit.forEach((c) => {
      map[c.id] = (c.messages || []).map((m) => ({ ...m }));
    });
    return map;
  });

  // UI / composer
  const [queryConvos, setQueryConvos] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);
  const [pickerCategory, setPickerCategory] = useState("smileys");
  const [emojiSearch, setEmojiSearch] = useState("");
  const [recentEmojis, setRecentEmojis] = useState(() => {
    try {
      const raw = localStorage.getItem("chat_recent_emojis");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // search mode: 'convos' or 'messages'
  const [searchMode, setSearchMode] = useState("convos"); // default search chats
  const [messageSearchQuery, setMessageSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]); // array of { convoId, convoTitle, message }

  // interactions
  const [contextMenu, setContextMenu] = useState(null); // { open, x, y, convoId, messageId }
  const [pinnedMessage, setPinnedMessage] = useState(null);
  const [replyTo, setReplyTo] = useState(null);
  const [hoveredMessage, setHoveredMessage] = useState(null);

  // scrolling & refs
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const ctxRef = useRef(null);
  const fileInputRef = useRef(null);
  const convoSearchRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const messageRefs = useRef({}); // store DOM nodes by messageId
  const createdObjectUrls = useRef([]); // track created object URLs to revoke later

  // emoji data
  const EMOJI_CATEGORIES = useMemo(
    () => ({
      recent: { label: "Недавние", key: "recent" },
      smileys: { label: "Смайлы", key: "smileys" },
      people: { label: "Жесты", key: "people" },
      symbols: { label: "Символы", key: "symbols" },
    }),
    []
  );
  const EMOJIS = useMemo(
    () => ({
      smileys: ["😀", "😊", "😍", "😂", "😅", "😭", "😴", "🤩", "😇", "😉"],
      people: ["👍", "👎", "👏", "🙏", "🤝", "✌️", "🤟", "🤘", "👌", "💪"],
      symbols: ["❤️", "✨", "🔥", "⭐", "✅", "❌", "🎯", "🔔", "💯", "🎉"],
    }),
    []
  );

  const filteredEmojis = useMemo(() => {
    if (!emojiSearch) return EMOJIS[pickerCategory] || [];
    return (EMOJIS[pickerCategory] || []).filter((e) => true);
  }, [pickerCategory, emojiSearch, EMOJIS]);

  // visible convos (for side list)
  const visibleConvos = conversations.filter((c) =>
    (c.title + " " + (c.subtitle || ""))
      .toLowerCase()
      .includes(queryConvos.toLowerCase())
  );

  // scroll to bottom and mark unread=0 when active changes or messages length changes
  useEffect(() => {
    // give time for rendering
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }, 40);

    setConversations((prev) =>
      prev.map((p) => (p.id === activeId ? { ...p, unread: 0 } : p))
    );
  }, [activeId, (messagesMap[activeId] || []).length]);

  // persist recent emojis
  useEffect(() => {
    try {
      localStorage.setItem(
        "chat_recent_emojis",
        JSON.stringify(recentEmojis.slice(0, 24))
      );
    } catch {}
  }, [recentEmojis]);

  // close context menu on outside click
  useEffect(() => {
    function onDoc(e) {
      if (ctxRef.current && !ctxRef.current.contains(e.target))
        setContextMenu(null);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  // cleanup created object URLs on unmount
  useEffect(() => {
    return () => {
      createdObjectUrls.current.forEach((u) => {
        try {
          URL.revokeObjectURL(u);
        } catch {}
      });
      createdObjectUrls.current = [];
    };
  }, []);

  // ======= helpers =======
  const safeNowTime = useCallback(
    () =>
      new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    []
  );
  const autoResize = useCallback((el) => {
    if (!el) return;
    el.style.height = "0px";
    const scroll = el.scrollHeight;
    const max = 160;
    el.style.height = Math.min(scroll, max) + "px";
  }, []);

  // toggle reaction
  const toggleReaction = useCallback((convoId, messageId, emoji) => {
    setMessagesMap((prev) => {
      const msgs = (prev[convoId] || []).map((m) => ({
        ...m,
        reactions: { ...(m.reactions || {}) },
      }));
      const idx = msgs.findIndex((x) => x.id === messageId);
      if (idx === -1) return prev;
      const msg = { ...msgs[idx] };
      const users = new Set(msg.reactions[emoji] || []);
      if (users.has(currentUser)) users.delete(currentUser);
      else users.add(currentUser);
      msg.reactions = { ...msg.reactions, [emoji]: Array.from(users) };
      if (msg.reactions[emoji].length === 0) delete msg.reactions[emoji];
      msgs[idx] = msg;
      return { ...prev, [convoId]: msgs };
    });
  }, []);

  // insert emoji
  const handleInsertEmoji = useCallback(
    (emoji) => {
      const el = inputRef.current;
      if (el) {
        const start = el.selectionStart || 0;
        const end = el.selectionEnd || 0;
        const newVal =
          inputValue.slice(0, start) + emoji + inputValue.slice(end);
        setInputValue(newVal);
        requestAnimationFrame(() => {
          try {
            el.focus();
            el.setSelectionRange(start + emoji.length, start + emoji.length);
          } catch {}
        });
      } else {
        setInputValue((v) => v + emoji);
      }
      setRecentEmojis((r) =>
        [emoji, ...r.filter((x) => x !== emoji)].slice(0, 24)
      );
    },
    [inputValue]
  );

  // send text message
  const handleSend = useCallback(() => {
    const text = inputValue.trim();
    if (!text) return;
    const msg = {
      id: `m_${Date.now()}`,
      fromMe: true,
      author: currentUser,
      text,
      ts: safeNowTime(),
      reactions: {},
      repliedTo: replyTo ? replyTo.messageId : undefined,
    };
    setMessagesMap((m) => ({
      ...m,
      [activeId]: [...(m[activeId] || []), msg],
    }));
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeId ? { ...c, subtitle: `Последнее: ${text}` } : c
      )
    );
    setInputValue("");
    setReplyTo(null);
    setTimeout(
      () =>
        messagesEndRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "end",
        }),
      20
    );
    if (typeof onSendMessage === "function") onSendMessage(msg, activeId);
  }, [inputValue, activeId, replyTo, onSendMessage, safeNowTime]);

  // attach file (single file). Creates preview for images and objectURL for download
  const handleAttachFile = useCallback(
    (file) => {
      if (!file) return;
      const isImage = file.type.startsWith("image/");
      const previewUrl = URL.createObjectURL(file);
      createdObjectUrls.current.push(previewUrl);
      const text = isImage ? `Фото: ${file.name}` : `Файл: ${file.name}`;
      const msg = {
        id: `m_file_${Date.now()}`,
        fromMe: true,
        author: currentUser,
        text,
        ts: safeNowTime(),
        reactions: {},
        file: {
          name: file.name,
          size: file.size,
          type: file.type,
          previewUrl,
          isImage,
        },
      };
      setMessagesMap((m) => ({
        ...m,
        [activeId]: [...(m[activeId] || []), msg],
      }));
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeId ? { ...c, subtitle: `Последнее: ${file.name}` } : c
        )
      );
      setTimeout(
        () =>
          messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "end",
          }),
        20
      );
    },
    [activeId, safeNowTime]
  );

  const onFileInputChange = useCallback(
    (e) => {
      const f = e.target.files && e.target.files[0];
      if (f) handleAttachFile(f);
      e.target.value = "";
    },
    [handleAttachFile]
  );

  // drag & drop handlers for messages container
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  }, []);
  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      const f = e.dataTransfer.files && e.dataTransfer.files[0];
      if (f) handleAttachFile(f);
    },
    [handleAttachFile]
  );

  // context menu open
  function onMessageContext(e, convoId, messageId) {
    e.preventDefault();
    setContextMenu({
      open: true,
      x: e.clientX + 6,
      y: e.clientY + 6,
      convoId,
      messageId,
    });
  }

  function handleContextReact(emoji) {
    if (!contextMenu) return;
    toggleReaction(contextMenu.convoId, contextMenu.messageId, emoji);
    setRecentEmojis((r) =>
      [emoji, ...r.filter((x) => x !== emoji)].slice(0, 24)
    );
    setContextMenu(null);
  }

  function handleContextReply() {
    if (!contextMenu) return;
    const { convoId, messageId } = contextMenu;
    const msg = (messagesMap[convoId] || []).find((m) => m.id === messageId);
    if (!msg) {
      setContextMenu(null);
      return;
    }
    setActiveId(convoId);
    setReplyTo({ convoId, messageId, author: msg.author, text: msg.text });
    setContextMenu(null);
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  function handleContextPinToggle() {
    if (!contextMenu) return;
    const { convoId, messageId } = contextMenu;
    setPinnedMessage((prev) => {
      if (prev && prev.convoId === convoId && prev.messageId === messageId)
        return null;
      return { convoId, messageId };
    });
    setContextMenu(null);
  }

  // message refs assignment helper (called in render)
  function setMessageRef(id, el) {
    if (el) messageRefs.current[id] = el;
    else delete messageRefs.current[id];
  }

  // jumpToMessage flow: when user clicks a search result, set active convo and request jump
  const [jumpToRequest, setJumpToRequest] = useState(null); // { convoId, messageId }

  // when jumpToRequest changes, ensure activeId set, then scroll to element when exists
  useEffect(() => {
    if (!jumpToRequest) return;
    // first ensure chat opened
    if (activeId !== jumpToRequest.convoId) {
      setActiveId(jumpToRequest.convoId);
      // leave jumpToRequest as is; next effect run after re-render will attempt scroll
      return;
    }
    // try to scroll to element
    const { messageId } = jumpToRequest;
    const el = messageRefs.current[messageId];
    if (el && messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      // scroll so message is centered roughly
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      // highlight temporarily
      el.classList.add("ring-2", "ring-[var(--accent)]");
      setTimeout(
        () => el.classList.remove("ring-2", "ring-[var(--accent)]"),
        2200
      );
      setJumpToRequest(null);
    } else {
      // element not yet mounted — try again shortly
      const t = setTimeout(() => {
        const el2 = messageRefs.current[messageId];
        if (el2 && messagesContainerRef.current) {
          el2.scrollIntoView({ behavior: "smooth", block: "center" });
          el2.classList.add("ring-2", "ring-[var(--accent)]");
          setTimeout(
            () => el2.classList.remove("ring-2", "ring-[var(--accent)]"),
            2200
          );
        }
        setJumpToRequest(null);
      }, 120);
      return () => clearTimeout(t);
    }
  }, [jumpToRequest, activeId, messagesMap]);

  // Search across messages when messageSearchQuery changes and searchMode === 'messages'
  useEffect(() => {
    if (searchMode !== "messages" || !messageSearchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const q = messageSearchQuery.trim().toLowerCase();
    const results = [];
    Object.entries(messagesMap).forEach(([convoId, msgs]) => {
      const convo = conversations.find((c) => c.id === convoId);
      msgs.forEach((m) => {
        if ((m.text || "").toLowerCase().includes(q)) {
          results.push({
            convoId,
            convoTitle: convo?.title || "Чат",
            message: m,
          });
        }
      });
    });
    // sort by presumed recency (by id timestamp if created with Date.now), newest first
    results.sort((a, b) => {
      const at = parseInt(a.message.id.split("_").pop() || "0", 10);
      const bt = parseInt(b.message.id.split("_").pop() || "0", 10);
      return bt - at;
    });
    setSearchResults(results.slice(0, 50)); // limit
  }, [messageSearchQuery, searchMode, messagesMap, conversations]);

  // Reaction pills component (keeps simple)
  const ReactionPills = React.memo(function ReactionPills({
    convoId,
    message,
  }) {
    const reactions = message.reactions || {};
    const entries = Object.entries(reactions);
    if (!entries.length) return null;
    return (
      <div className="mt-2 flex flex-wrap gap-2">
        {entries.map(([emoji, users]) => {
          const count = users.length;
          const meReacted = users.includes(currentUser);
          return (
            <button
              key={emoji}
              onClick={() => toggleReaction(convoId, message.id, emoji)}
              className={`${
                meReacted
                  ? "bg-[var(--accent)] text-white border-transparent"
                  : "bg-[color:var(--panel2)] text-[color:var(--text-primary)] border-[color:var(--panel-border)]"
              } inline-flex items-center gap-1 text-sm px-2 py-1 rounded-full border`}
              title={users.join(", ")}
            >
              <span className="text-lg leading-none">{emoji}</span>
              <span className="text-xs">{count}</span>
            </button>
          );
        })}
      </div>
    );
  });

  // small motion variants
  const messageItemVariants = {
    hidden: { opacity: 0, y: 8 },
    enter: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 700, damping: 30 },
    },
    exit: { opacity: 0, y: -6, transition: { duration: 0.18 } },
  };

  // Helper: format file size
  function prettySize(n) {
    if (!n && n !== 0) return "";
    if (n < 1024) return n + " B";
    if (n < 1024 * 1024) return `${Math.round((n / 1024) * 10) / 10} KB`;
    return `${Math.round((n / (1024 * 1024)) * 10) / 10} MB`;
  }

  // Context menu background colors per theme (non-transparent)
  const contextBg = isDark ? "rgba(17,24,39,0.98)" : "rgba(255,255,255,0.98)";
  const contextBorder = isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.06)";

  // Render
  return (
    <div
      className="h-full min-h-[640px] flex text-[color:var(--text-primary,#111827)]"
      style={{ ["--accent"]: accent }}
    >
      {/* ASIDE */}
      <aside className="w-80 border-r border-[color:var(--panel-border)] bg-[color:var(--panel)] flex flex-col">
        <div className="px-4 py-3 flex items-center gap-3 border-b border-[color:var(--panel-border)]">
          <div className="flex-1">
            <div className="text-lg font-semibold">Чаты</div>
            <div className="text-xs text-[color:var(--text-tertiary)]">
              Онлайн • {conversations.length}
            </div>
          </div>
          <div className="relative">
            <button
              className="p-2 rounded-md hover:bg-[color:var(--panel2)]"
              aria-label="Меню"
            >
              <MoreVertical size={18} stroke="var(--icon-muted)" />
            </button>
          </div>
        </div>

        <div className="p-3">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--icon-muted)]"
            />
            <input
              ref={convoSearchRef}
              placeholder={
                searchMode === "convos"
                  ? "Поиск чат/контактов"
                  : "Поиск по сообщениям"
              }
              value={searchMode === "convos" ? queryConvos : messageSearchQuery}
              onChange={(e) =>
                searchMode === "convos"
                  ? setQueryConvos(e.target.value)
                  : setMessageSearchQuery(e.target.value)
              }
              onKeyDown={(e) => {
                // Enter triggers search results focus (if messages), else nothing
                if (e.key === "Enter" && searchMode === "messages") {
                  // nothing special, results update automatically
                }
              }}
              className="w-full pl-9 pr-3 py-2 rounded-md border border-[color:var(--panel-border)] bg-transparent text-sm placeholder:text-[color:var(--text-tertiary)]"
            />
          </div>

          <div className="mt-2 flex items-center gap-2 text-xs">
            <div
              className={`px-2 py-1 rounded cursor-pointer ${
                searchMode === "convos"
                  ? "bg-[var(--accent)] text-white"
                  : "text-[color:var(--text-secondary)]"
              }`}
              onClick={() => setSearchMode("convos")}
            >
              По чатам
            </div>
            <div
              className={`px-2 py-1 rounded cursor-pointer ${
                searchMode === "messages"
                  ? "bg-[var(--accent)] text-white"
                  : "text-[color:var(--text-secondary)]"
              }`}
              onClick={() => setSearchMode("messages")}
            >
              По сообщениям
            </div>
          </div>

          {/* message search results (when in messages mode) */}
          {searchMode === "messages" && messageSearchQuery.trim() ? (
            <div className="mt-3 max-h-56 overflow-auto pr-2 space-y-2">
              {searchResults.length === 0 ? (
                <div className="text-sm text-[color:var(--text-tertiary)] px-2">
                  Ничего не найдено
                </div>
              ) : (
                searchResults.map((r) => (
                  <button
                    key={`${r.convoId}-${r.message.id}`}
                    onClick={() => {
                      // open convo and jump
                      setJumpToRequest({
                        convoId: r.convoId,
                        messageId: r.message.id,
                      });
                      setActiveId(r.convoId);
                    }}
                    className="w-full text-left p-2 rounded hover:bg-[color:var(--panel2)] flex flex-col"
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-semibold truncate">
                        {r.convoTitle}
                      </div>
                      <div className="text-xs text-[color:var(--text-tertiary)]">
                        {r.message.ts}
                      </div>
                    </div>
                    <div className="text-xs text-[color:var(--text-secondary)] truncate">
                      <span className="font-medium">{r.message.author}: </span>
                      {r.message.text}
                    </div>
                  </button>
                ))
              )}
            </div>
          ) : null}

          {/* convo list when in convos mode */}
          {searchMode === "convos" && (
            <div className="mt-3 space-y-2 max-h-[calc(100vh-260px)] overflow-auto pr-2">
              {visibleConvos.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveId(c.id)}
                  className={`w-full text-left flex items-center gap-3 p-2 rounded-lg hover:bg-[color:var(--panel2)] ${
                    c.id === activeId
                      ? "bg-[color:var(--panel2)] ring-1 ring-[color:var(--accent)]"
                      : ""
                  }`}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium flex-shrink-0"
                    style={{ backgroundColor: c.avatarColor || "#9CA3AF" }}
                  >
                    {c.title
                      .split(" ")
                      .map((s) => s[0])
                      .slice(0, 2)
                      .join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold truncate">{c.title}</div>
                      <div className="text-xs text-[color:var(--text-tertiary)]">
                        {messagesMap[c.id] && messagesMap[c.id].length
                          ? messagesMap[c.id][messagesMap[c.id].length - 1].ts
                          : ""}
                      </div>
                    </div>
                    <div className="text-sm text-[color:var(--text-secondary)] truncate">
                      {c.subtitle}
                    </div>
                  </div>
                  {c.unread ? (
                    <div className="ml-2 min-w-[28px] h-6 flex items-center justify-center bg-[color:var(--accent)] text-white rounded-full text-xs px-2">
                      {c.unread}
                    </div>
                  ) : null}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mt-auto p-3 border-t border-[color:var(--panel-border)] flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-slate-600 flex items-center justify-center text-white">
              <User size={16} />
            </div>
            <div>
              <div className="text-sm font-semibold">Вы</div>
              <div className="text-xs text-[color:var(--text-tertiary)]">
                online
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 flex flex-col">
        <header className="flex items-center justify-between px-4 py-3 border-b border-[color:var(--panel-border)] bg-[color:var(--panel)]">
          <div className="flex items-center gap-3 min-w-0">
            <button className="md:hidden p-2 rounded-md hover:bg-[color:var(--panel2)]">
              <ChevronLeft size={18} stroke="var(--icon-muted)" />
            </button>
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center font-medium text-white flex-shrink-0"
              style={{
                backgroundColor:
                  (conversations.find((c) => c.id === activeId) || {})
                    .avatarColor || "#6B7280",
              }}
            >
              {(conversations.find((c) => c.id === activeId) || {}).title
                ?.split(" ")
                .map((s) => s[0])
                .slice(0, 2)
                .join("")}
            </div>
            <div className="min-w-0">
              <div className="font-semibold truncate">
                {(conversations.find((c) => c.id === activeId) || {}).title}
              </div>
              <div className="text-xs text-[color:var(--text-tertiary)] truncate">
                {(conversations.find((c) => c.id === activeId) || {}).subtitle}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {pinnedMessage && pinnedMessage.convoId === activeId ? (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 px-3 py-1 rounded bg-[color:var(--panel2)] border border-[color:var(--panel-border)] text-sm"
              >
                <MapPin size={14} />{" "}
                <span className="truncate max-w-[220px]">
                  {(() => {
                    const msg = (messagesMap[activeId] || []).find(
                      (m) => m.id === pinnedMessage.messageId
                    );
                    return msg
                      ? msg.text.length > 40
                        ? msg.text.slice(0, 40) + "…"
                        : msg.text
                      : "Закреплено";
                  })()}
                </span>
                <button
                  className="ml-2 text-xs text-[color:var(--text-tertiary)]"
                  onClick={() => setPinnedMessage(null)}
                >
                  ✕
                </button>
              </motion.div>
            ) : null}

            <button
              onClick={() => convoSearchRef.current?.focus()}
              className="p-2 rounded-md hover:bg-[color:var(--panel2)]"
              aria-label="Поиск в чате"
            >
              <Search size={16} stroke="var(--icon-muted)" />
            </button>

            <button
              className="p-2 rounded-md hover:bg-[color:var(--panel2)]"
              aria-label="Ещё"
            >
              <MoreVertical size={16} stroke="var(--icon-muted)" />
            </button>
          </div>
        </header>

        {/* messages container: supports drag & drop */}
        <section
          ref={messagesContainerRef}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="flex-1 overflow-auto p-4"
          style={{
            background:
              "linear-gradient(180deg, transparent, rgba(0,0,0,0.02))",
          }}
        >
          <div className="max-w-3xl mx-auto flex flex-col gap-3">
            <AnimatePresence initial={false}>
              {(messagesMap[activeId] || []).map((m) => {
                const isPinned =
                  pinnedMessage &&
                  pinnedMessage.convoId === activeId &&
                  pinnedMessage.messageId === m.id;
                return (
                  <motion.div
                    layout
                    key={m.id}
                    initial="hidden"
                    animate="enter"
                    exit="exit"
                    variants={messageItemVariants}
                    onContextMenu={(e) => onMessageContext(e, activeId, m.id)}
                    onMouseEnter={() => setHoveredMessage(m.id)}
                    onMouseLeave={() =>
                      setHoveredMessage((s) => (s === m.id ? null : s))
                    }
                    className={`flex ${
                      m.fromMe ? "justify-end" : "justify-start"
                    }`}
                    ref={(el) => setMessageRef(m.id, el)}
                  >
                    <div className="relative group max-w-[78%]">
                      {/* reply preview */}
                      {m.repliedTo
                        ? (() => {
                            const replied = (messagesMap[activeId] || []).find(
                              (x) => x.id === m.repliedTo
                            );
                            return replied ? (
                              <motion.div
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="mb-1 px-3 py-2 rounded-l-md rounded-r-md text-xs bg-[color:var(--panel)] border border-[color:var(--panel-border)] w-full"
                              >
                                <div className="text-[10px] text-[color:var(--text-tertiary)]">
                                  Ответ на {replied.author}
                                </div>
                                <div className="text-[12px] text-[color:var(--text-secondary)] truncate">
                                  {replied.text}
                                </div>
                              </motion.div>
                            ) : null;
                          })()
                        : null}

                      <motion.div
                        whileHover={{ scale: 1.01 }}
                        transition={{
                          type: "spring",
                          stiffness: 600,
                          damping: 28,
                        }}
                        className={`${
                          m.fromMe
                            ? "bg-[var(--accent)] text-white bubble-me"
                            : "bg-[color:var(--panel2)] text-[color:var(--text-primary)] bubble-other"
                        } px-4 py-2 rounded-2xl whitespace-pre-wrap`}
                      >
                        <div className="flex items-center gap-2">
                          <div className="text-sm leading-relaxed break-words">
                            {m.text}
                          </div>
                          {isPinned ? (
                            <MapPin
                              size={14}
                              className="ml-2 text-[color:var(--text-tertiary)]"
                            />
                          ) : null}
                        </div>

                        {/* file preview inside bubble */}
                        {m.file ? (
                          <div className="mt-2">
                            {m.file.isImage ? (
                              <img
                                src={m.file.previewUrl}
                                alt={m.file.name}
                                className="max-w-full rounded-md border border-[color:var(--panel-border)] cursor-pointer"
                                onClick={() =>
                                  window.open(m.file.previewUrl, "_blank")
                                }
                              />
                            ) : (
                              <div className="flex items-center gap-3 p-2 rounded border border-[color:var(--panel-border)]">
                                <div className="w-10 h-10 flex items-center justify-center rounded bg-[color:var(--panel)] text-[color:var(--text-secondary)]">
                                  📄
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium truncate">
                                    {m.file.name}
                                  </div>
                                  <div className="text-xs text-[color:var(--text-tertiary)]">
                                    {prettySize(m.file.size)}
                                  </div>
                                </div>
                                <a
                                  href={m.file.previewUrl}
                                  download={m.file.name}
                                  className="text-xs px-2 py-1 rounded bg-[color:var(--panel)] hover:bg-[color:var(--panel2)]"
                                >
                                  Скачать
                                </a>
                              </div>
                            )}
                          </div>
                        ) : null}

                        <div
                          className={`text-[10px] mt-1 ${
                            m.fromMe
                              ? "text-[rgba(255,255,255,0.85)]"
                              : "text-[color:var(--text-tertiary)]"
                          } text-right`}
                        >
                          {m.ts}
                        </div>
                      </motion.div>

                      {/* Reaction pills */}
                      <ReactionPills convoId={activeId} message={m} />

                      {/* quick react bar */}
                      <AnimatePresence>
                        {hoveredMessage === m.id && (
                          <motion.div
                            initial={{ opacity: 0, y: 4, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 6 }}
                            transition={{
                              type: "spring",
                              stiffness: 700,
                              damping: 30,
                            }}
                            className="absolute -top-8 right-0 flex gap-1 items-center"
                          >
                            {["👍", "❤️", "😂", "🔥", "👏"].map((em) => (
                              <button
                                key={em}
                                onClick={() =>
                                  toggleReaction(activeId, m.id, em)
                                }
                                className="p-1 rounded-md hover:bg-[color:var(--panel)] text-lg"
                                title="Добавить реакцию"
                              >
                                {em}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            <div ref={messagesEndRef} />
          </div>
        </section>

        {/* composer + reply preview */}
        <div className="border-t border-[color:var(--panel-border)] px-4 py-3 bg-[color:var(--panel)]">
          <div className="max-w-3xl mx-auto flex flex-col gap-2">
            <AnimatePresence>
              {replyTo && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-start justify-between bg-[color:var(--panel2)] border border-[color:var(--panel-border)] rounded px-3 py-2"
                >
                  <div>
                    <div className="text-xs text-[color:var(--text-tertiary)]">
                      Ответ {replyTo.author}
                    </div>
                    <div className="text-sm truncate max-w-[680px]">
                      {replyTo.text}
                    </div>
                  </div>
                  <div>
                    <button
                      className="text-[color:var(--text-tertiary)] ml-3"
                      onClick={() => setReplyTo(null)}
                    >
                      ✕
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-end gap-3">
              <div className="relative flex items-center gap-2 flex-1">
                <button
                  onClick={() => {
                    setIsEmojiOpen((s) => !s);
                    setPickerCategory("recent");
                  }}
                  className="p-2 rounded-md hover:bg-[color:var(--panel2)]"
                  aria-label="Emoji"
                >
                  <Smile size={20} stroke="var(--icon-muted)" />
                </button>

                <div className="flex-1">
                  <textarea
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => {
                      setInputValue(e.target.value);
                      autoResize(e.target);
                    }}
                    onInput={(e) => autoResize(e.target)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                      if (e.key === "Escape") setIsEmojiOpen(false);
                    }}
                    rows={1}
                    placeholder="Напишите сообщение..."
                    className="w-full resize-none px-3 py-2 rounded-full border border-[color:var(--panel-border)] bg-[color:var(--panel2)] text-sm focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                    style={{ minHeight: 40, maxHeight: 160 }}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <label
                    className="p-2 rounded-md hover:bg-[color:var(--panel2)] cursor-pointer"
                    title="Прикрепить файл"
                  >
                    <Paperclip size={18} stroke="var(--icon-muted)" />
                    <input
                      ref={fileInputRef}
                      onChange={onFileInputChange}
                      type="file"
                      className="hidden"
                    />
                  </label>

                  <button
                    onClick={handleSend}
                    disabled={!inputValue.trim()}
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      inputValue.trim()
                        ? "bg-gradient-to-br from-[var(--accent)] to-[color:var(--accent)] text-white hover:brightness-90 shadow"
                        : "bg-[color:var(--panel2)] text-[color:var(--text-tertiary)] cursor-not-allowed"
                    }`}
                  >
                    <Send size={16} />
                  </button>
                </div>

                {/* emoji picker */}
                <AnimatePresence>
                  {isEmojiOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      transition={{
                        type: "spring",
                        stiffness: 700,
                        damping: 30,
                      }}
                      className="absolute left-0 bottom-full mb-3 w-[360px] rounded-lg shadow-xl bg-[color:var(--panel2)] border border-[color:var(--panel-border)] p-3 z-30"
                      style={{ transformOrigin: "bottom left" }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {Object.values(EMOJI_CATEGORIES).map((cat) => (
                          <button
                            key={cat.key}
                            onClick={() => setPickerCategory(cat.key)}
                            className={`px-2 py-1 rounded-md text-sm ${
                              pickerCategory === cat.key
                                ? "bg-[var(--accent)] text-white"
                                : "text-[color:var(--text-secondary)]"
                            }`}
                          >
                            {cat.label}
                          </button>
                        ))}
                        <div className="ml-auto">
                          <input
                            value={emojiSearch}
                            onChange={(e) => setEmojiSearch(e.target.value)}
                            placeholder="Поиск"
                            className="px-2 py-1 rounded-md border border-[color:var(--panel-border)] bg-transparent text-sm"
                          />
                        </div>
                      </div>

                      <div className="max-h-40 overflow-auto py-1">
                        <div className="grid grid-cols-8 gap-2">
                          {(pickerCategory === "recent"
                            ? recentEmojis
                            : filteredEmojis
                          ).map((em, i) => (
                            <button
                              key={`${em}-${i}`}
                              onClick={() => handleInsertEmoji(em)}
                              className="p-2 rounded hover:bg-[color:var(--panel)] text-xl"
                            >
                              {em}
                            </button>
                          ))}
                          {pickerCategory === "recent" &&
                            recentEmojis.length === 0 && (
                              <div className="col-span-8 text-sm text-[color:var(--text-tertiary)] px-2">
                                Нет недавних эмодзи
                              </div>
                            )}
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <div className="text-xs text-[color:var(--text-tertiary)]">
                          Нажмите, чтобы вставить. Enter — отправить.
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            className="px-2 py-1 rounded-md text-sm border border-[color:var(--panel-border)]"
                            onClick={() => setRecentEmojis([])}
                          >
                            Очистить
                          </button>
                          <button
                            className="px-2 py-1 rounded-md text-sm bg-[var(--accent)] text-white"
                            onClick={() => setIsEmojiOpen(false)}
                          >
                            Готово
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* context menu — non-transparent, darker than bg */}
        <AnimatePresence>
          {contextMenu && contextMenu.open && (
            <motion.div
              ref={ctxRef}
              initial={{ opacity: 0, scale: 0.96, y: -6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -6 }}
              transition={{ type: "spring", stiffness: 700, damping: 30 }}
              className="fixed z-50 rounded-md border shadow-lg p-2"
              style={{
                left: Math.min(contextMenu.x, window.innerWidth - 340) + "px",
                top: Math.min(contextMenu.y, window.innerHeight - 220) + "px",
                width: 300,
                background: contextBg,
                borderColor: contextBorder,
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                {["👍", "❤️", "😂", "🔥", "👏", "✨", "😢"].map((em) => (
                  <button
                    key={em}
                    onClick={() => handleContextReact(em)}
                    className="p-1.5 rounded-md hover:bg-[color:var(--panel)] text-lg"
                  >
                    {em}
                  </button>
                ))}
              </div>

              <div className="border-t border-[color:var(--panel-border)] -mx-2 px-2 pt-2 flex items-center gap-2">
                <button
                  onClick={handleContextReply}
                  className="flex-1 px-2 py-1 rounded-md hover:bg-[color:var(--panel)] text-sm flex items-center gap-2"
                >
                  <CornerUpLeft size={16} /> Ответить
                </button>
                <button
                  onClick={handleContextPinToggle}
                  className="flex-1 px-2 py-1 rounded-md hover:bg-[color:var(--panel)] text-sm flex items-center gap-2"
                >
                  <MapPin size={16} />{" "}
                  {pinnedMessage &&
                  pinnedMessage.convoId === contextMenu.convoId &&
                  pinnedMessage.messageId === contextMenu.messageId
                    ? "Открепить"
                    : "Закрепить"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
