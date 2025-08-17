import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { File as FileIcon, Edit2, ChevronDown, Reply, Pin } from "lucide-react";
import BubbleContextMenu from "./BubbleContextMenu";

// --- SVG Telegram checkmark component
function TelegramCheck({ color = "#bbaae9", style = {}, ...props }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      style={style}
      {...props}
      fill="none"
    >
      <motion.path
        d="M4 9.5L7.5 13L14 6"
        stroke={color}
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function TelegramCheckmarks({ read }) {
  return (
    <span
      className="inline-flex items-center ml-1 select-none relative"
      style={{ minWidth: 22, minHeight: 18 }}
    >
      <TelegramCheck color="#bbaae9" style={{ position: "absolute" }} />
      <AnimatePresence>
        {read && (
          <motion.span
            key="second"
            initial={{ x: -6, opacity: 0, scale: 0.7 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            exit={{ x: -6, opacity: 0, scale: 0.7 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 24,
              duration: 0.22,
            }}
            style={{ position: "absolute", left: 7 }}
          >
            <TelegramCheck color="#bbaae9" />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

// --- Reaction Bar
function ReactionBar({ reactions, currentUserId, onReact, onShowUsers }) {
  if (!reactions || Object.keys(reactions).length === 0) return null;
  return (
    <div className="flex gap-2 mt-2 flex-wrap">
      {Object.entries(reactions).map(([emoji, userIds]) => (
        <motion.button
          key={emoji}
          className={`flex items-center px-2 py-1 rounded-xl bg-[#22232a] text-lg hover:bg-[#2fd4c6]/20 transition
            ${
              userIds.includes(currentUserId)
                ? "ring-2 ring-[#2fd4c6] font-bold shadow-[0_0_8px_#2fd4c6aa]"
                : ""
            }
            relative group`}
          whileHover={{ scale: 1.12, y: -2 }}
          whileTap={{ scale: 0.96 }}
          onMouseDown={(e) => e.preventDefault()}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onReact(emoji);
          }}
          title={
            userIds.length === 1
              ? "1 пользователь"
              : `${userIds.length} пользователей`
          }
          onMouseEnter={(e) => onShowUsers && onShowUsers(emoji, userIds, e)}
          onMouseLeave={(e) => onShowUsers && onShowUsers(null, [], e)}
        >
          <span className="mr-1">{emoji}</span>
          <span className="text-xs text-[#7a8b95] font-medium">
            {userIds.length}
          </span>
        </motion.button>
      ))}
    </div>
  );
}

// --- Forward Modal
function ForwardModal({ open, dialogs, onSelect, onClose }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[200] bg-black/30 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-[#23232b] border border-[#23232a] rounded-xl shadow-2xl min-w-[300px] max-w-[90vw] p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-lg font-bold mb-4">
          Выберите диалог для пересылки
        </div>
        <div className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto">
          {Array.isArray(dialogs) && dialogs.length > 0 ? (
            dialogs.map((dialog) => (
              <button
                key={dialog.id}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#22232a] hover:bg-[#2fd4c6]/10 text-left"
                onClick={() => onSelect(dialog)}
              >
                <img
                  src={dialog.avatar}
                  alt={dialog.name}
                  className="w-8 h-8 rounded-full"
                />
                <span>{dialog.name}</span>
              </button>
            ))
          ) : (
            <div className="text-[#888] py-8">
              Нет доступных диалогов для пересылки
            </div>
          )}
        </div>
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-100 text-xl"
          onClick={onClose}
        >
          ×
        </button>
      </div>
    </div>
  );
}

export default function MainChatSection({
  grouped,
  USERS,
  dialogs,
  highlightedMsgId,
  msgRefs,
  openUserProfile,
  renderTextWithLinks,
  ReplyBubble,
  VoiceMessage,
  pinnedMsg,
  setPinnedMsg,
  setMessages,
  currentUserId = 1, // id пользователя = 1
  msgEndRef,
  openChatId,
  handlePinMessage,
  handleUnpinMessage,
  setEditMsgId,
  editMsgId,
  setInput,
  input,
  setReplyTo,
  replyTo,
}) {
  const [bubbleMenuMsgId, setBubbleMenuMsgId] = useState(null);
  const [bubbleMenuAnchor, setBubbleMenuAnchor] = useState(null);

  // Forward modal
  const [forwardOpen, setForwardOpen] = useState(false);
  const [forwardMsg, setForwardMsg] = useState(null);

  // Emoji users popover (hover)
  const [emojiPopover, setEmojiPopover] = useState({
    emoji: null,
    users: [],
    anchor: null,
  });

  // Bubble menu (ПКМ)
  function handleBubbleContext(e, msg) {
    e.preventDefault();
    e.stopPropagation();
    setBubbleMenuMsgId(msg.id);
    setBubbleMenuAnchor({
      x: e.clientX,
      y: e.clientY,
    });
  }
  function closeBubbleMenu() {
    setBubbleMenuMsgId(null);
    setBubbleMenuAnchor(null);
  }

  // Emoji reaction logic
  function handleReact(msg, emoji) {
    setMessages((msgs) =>
      msgs.map((m) => {
        if (m.id !== msg.id) return m;
        const reactions = { ...m.reactions };
        const users = reactions[emoji] || [];
        if (users.includes(currentUserId)) {
          reactions[emoji] = users.filter((id) => id !== currentUserId);
          if (reactions[emoji].length === 0) {
            delete reactions[emoji];
          }
        } else {
          reactions[emoji] = [...users, currentUserId];
        }
        return { ...m, reactions };
      })
    );
  }

  // Menu action handler
  function handleBubbleMenuAction(key, msg) {
    switch (key) {
      case "reply":
        setReplyTo({
          author: msg.author,
          text: msg.text,
        });
        break;
      case "pin":
        handlePinMessage(msg);
        break;
      case "copy":
        if (msg.text) navigator.clipboard.writeText(msg.text);
        break;
      case "forward":
        setForwardMsg(msg);
        setForwardOpen(true);
        break;
      case "edit":
        setEditMsgId(msg.id);
        setInput(msg.text || "");
        setReplyTo(null);
        break;
      case "delete":
        setMessages((msgs) => msgs.filter((m) => m.id !== msg.id));
        if (pinnedMsg?.id === msg.id) setPinnedMsg(null);
        break;
      case "select":
        setMessages((msgs) =>
          msgs.map((m) =>
            m.id === msg.id ? { ...m, selected: !m.selected } : m
          )
        );
        break;
      default:
        break;
    }
    closeBubbleMenu();
  }

  // Forward to dialog
  function handleForwardSelect(dialog) {
    alert(
      `Сообщение "${forwardMsg.text || "[media]"}" переслано в "${dialog.name}"`
    );
    setForwardOpen(false);
    setForwardMsg(null);
  }

  // ReactionBar user hover
  function handleShowUsers(emoji, userIds, e) {
    if (!emoji) {
      setEmojiPopover({ emoji: null, users: [], anchor: null });
      return;
    }
    const rect = e.target.getBoundingClientRect();
    setEmojiPopover({
      emoji,
      users: userIds,
      anchor: { x: rect.left, y: rect.top },
    });
  }

  // --- Pinned message block
  function PinnedBlock() {
    if (!pinnedMsg) return null;
    return (
      <div
        className="sticky top-0 z-30 mb-4"
        style={{
          backgroundColor: "#23232b",
          border: "1px solid #ffd700",
          boxShadow: "0 0 15px #ffd700",
          padding: "8px 16px",
          borderRadius: "12px",
        }}
      >
        <div className="flex items-center gap-2 text-[#ffd700] text-[15px]">
          <Pin size={18} />
          <span className="font-bold">Закреплённое сообщение:</span>
          <span className="text-gray-100 ml-2 break-words">
            <span className="font-bold text-[#ffd700]">
              {pinnedMsg.author || "?"}
            </span>
            {": "}
            {pinnedMsg.text || "[media]"}
          </span>
          <button
            className="ml-auto text-xs text-[#ffd700] hover:text-white px-2 py-1 border border-[#ffd700] rounded-lg"
            onClick={() => handleUnpinMessage()}
          >
            Открепить
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="flex-1 overflow-y-auto px-2 py-4 bg-gradient-to-bl from-[#191b1f] via-[#171418] to-[#191b1f]">
      <ForwardModal
        open={forwardOpen}
        dialogs={dialogs}
        onSelect={handleForwardSelect}
        onClose={() => setForwardOpen(false)}
      />
      <PinnedBlock />
      <div className="flex flex-col gap-2">
        <AnimatePresence initial={false}>
          {grouped.map((group, i) => {
            const isOwn = group.authorId === currentUserId;
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
                <div
                  className={`flex flex-col gap-1 max-w-[72%] ${
                    isOwn ? "items-end" : ""
                  }`}
                >
                  {group.messages.map((msg) => {
                    const isOwnMsg = msg.authorId === currentUserId;
                    const isHighlighted = highlightedMsgId === msg.id;
                    let mediaBlock = null;
                    if (msg.type === "photo" || msg.type === "gif") {
                      mediaBlock = (
                        <img
                          src={msg.url}
                          alt="photo"
                          className="max-w-xs max-h-64 rounded-lg border border-[#23242d] object-cover mb-1"
                        />
                      );
                    } else if (msg.type === "video") {
                      mediaBlock = (
                        <video
                          controls
                          className="max-w-xs rounded-lg border border-[#23242d] mb-1"
                        >
                          <source src={msg.url} />
                        </video>
                      );
                    } else if (msg.type === "audio" || msg.type === "voice") {
                      mediaBlock = (
                        <VoiceMessage
                          url={msg.url}
                          duration={msg.duration || 0}
                          isOwn={isOwnMsg}
                        />
                      );
                    } else if (msg.type === "file") {
                      mediaBlock = (
                        <a
                          href={msg.url}
                          download
                          className="mb-1 flex items-center gap-2 px-3 py-2 rounded-lg border border-[#23242d] bg-[#22232a] hover:bg-[#232d2c] text-sm"
                        >
                          <FileIcon size={18} /> {msg.title}{" "}
                          <span className="text-xs text-[#7a8b95]">
                            {msg.size}
                          </span>
                        </a>
                      );
                    } else if (msg.type === "link") {
                      mediaBlock = (
                        <a
                          href={msg.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline text-[#2fd4c6] break-words"
                        >
                          {msg.url}
                        </a>
                      );
                    }

                    // Для галочек: считаем прочитано если readBy содержит кого-то кроме тебя (id=1)
                    const isRead =
                      isOwnMsg &&
                      msg.readBy &&
                      Array.isArray(msg.readBy) &&
                      msg.readBy.some((id) => id !== currentUserId);

                    return (
                      <motion.div
                        layout
                        key={msg.id}
                        ref={(el) => (msgRefs.current[msg.id] = el)}
                        initial={{ opacity: 0, scale: 0.97, y: 8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 8 }}
                        className={`
    relative flex flex-col
    min-w-[44px] max-w-full
    px-3 py-[6px]
    ${isOwnMsg ? "rounded-2xl rounded-br-sm" : "rounded-2xl rounded-bl-sm"}
    border ${isOwnMsg ? "border-[#20242c]" : "border-[#23242d]"}
    bg-[#23232b] bg-opacity-85
    text-gray-100 text-[15px]
    ${isOwnMsg ? "self-end" : ""}
    transition-all
    ${
      isHighlighted ? "ring-4 ring-[#9cf5ff] bg-[#232d2c] border-[#2fd4c6]" : ""
    }
    ${msg.selected ? "border-[#2fd4c6] ring-2" : ""}
    overflow-visible
  `}
                        onContextMenu={(e) => handleBubbleContext(e, msg)}
                      >
                        {msg.replyTo && (
                          <ReplyBubble
                            replyTo={msg.replyTo}
                            onProfile={() =>
                              openUserProfile(
                                USERS.find((u) => u.name === msg.replyTo.author)
                              )
                            }
                          />
                        )}

                        {mediaBlock}

                        {/* Текст + время/галки в одну строку */}
                        <div className="flex items-end flex-wrap w-full">
                          {msg.type !== "link" && msg.text && (
                            <span className="break-words whitespace-pre-line flex-1 min-w-0">
                              {renderTextWithLinks(msg.text)}
                              {msg.edited && (
                                <span className="ml-1 text-xs text-[#2fd4c6]">
                                  ред.
                                </span>
                              )}
                            </span>
                          )}

                          {/* Время и галочки — сразу после текста */}
                          <span
                            className={`flex items-center text-s leading-none ml-2 select-none
        ${isOwnMsg ? "!text-[#bbaae9]" : "!text-[#7a8b95]"}
      `}
                          >
                            {msg.time}
                            {isOwnMsg && <TelegramCheckmarks read={isRead} />}
                          </span>
                        </div>

                        {/* ReactionBar снизу, не влияет на высоту без реакций */}
                        <ReactionBar
                          reactions={msg.reactions}
                          currentUserId={currentUserId}
                          onReact={(emoji) => handleReact(msg, emoji)}
                          onShowUsers={(emoji, userIds, e) =>
                            handleShowUsers(emoji, userIds, e)
                          }
                        />

                        <BubbleContextMenu
                          open={bubbleMenuMsgId === msg.id}
                          anchor={bubbleMenuAnchor}
                          msg={msg}
                          onAction={handleBubbleMenuAction}
                          onEmoji={(emoji) => handleReact(msg, emoji)}
                          onClose={closeBubbleMenu}
                        />
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
          <div ref={msgEndRef} />
        </AnimatePresence>
      </div>
    </main>
  );
}
