import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  LinkIcon,
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
  Mic,
  File as FileIcon,
  Image as ImageIcon,
  Video as VideoIcon,
  Music,
  Smile,
  Users,
} from "lucide-react";

export default function ChatAside({
  sideSearchOpen,
  activeChat,
  setSideSearchOpen,
  sideSearchValue,
  setSideSearchValue,
  sideSearchResults,
  setSideSearchIdx,
  setHighlightedMsgId,
  highlightMatches,
  gotoPrevSideSearch,
  gotoNextSideSearch,
  searchTerm,
  setSearchTerm,
  filteredChats,
  openChatId,
  sideSearchIdx,
  messages,
  setOpenChatId,
}) {
  return (
    <aside className="w-[350px] min-w-[240px] max-w-[420px] bg-gradient-to-bl from-[#1b191c] via-[#2f2b2f76] to-[#1c1e20] border-r border-[#222b32] flex flex-col relative">
      {/* SEARCH PANEL (slide in) */}
      <AnimatePresence>
        {sideSearchOpen && (
          <motion.div
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-tr from-[#1e1e1e] to-[#261f2e]    z-20 border-r border-[#232b32] flex flex-col overflow-auto"
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
                              sideSearchIdx === i ? "ring-2 ring-[#2fd4c6]" : ""
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
          className="
    w-full h-10 px-4 py-2
    rounded-lg
    bg-gradient-to-br from-[#1e1e1e] to-[#2a2235]
    border border-[#362f3c]
    text-sm text-[#d0d5db]
    placeholder-[#7c8b99]
    shadow-inner

    hover:border-[#8e61ff]/40
    hover:bg-[#26202e]/60

    focus:outline-none
    focus:ring-2 focus:ring-[#8e61ff]/60
    focus:border-[#8e61ff]

    transition-all duration-200 ease-in-out
    font-medium
  "
          placeholder="Поиск"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {/* Фолдеры */}
      {/* <div className="flex gap-2 px-4 py-2">
            {chatFolders.map((folder) => (
              <button
                key={folder.key}
                className={`
                             px-5 py-2 rounded-2xl font-bold text-[15px] transition shadow-sm border-0 relative
                             ${
                               activeFolderKey === folder.key
                                 ? "bg-[#582688] text-[#232b32] shadow-lg scale-105"
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
          </div> */}
      <div className="flex-1 overflow-y-auto pt-2 pb-4">
        {!filteredChats.length && (
          <div className="text-[#7A85A5] text-center pt-8">Чаты не найдены</div>
        )}
        {filteredChats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => setOpenChatId(chat.id)}
            className={`
                             flex items-center px-3 py-3 cursor-pointer rounded-[3px] mx-2 mb-1 transition-colors
                             ${
                               chat.id === openChatId
                                 ? "bg-[#9556d4] text-[#232b32] shadow-lg scale-105"
                                 : "hover:bg-[#9556d4]/10 "
                             }
                           `}
            style={
              chat.id === openChatId
                ? { boxShadow: "0 3px 18px -4px #9556d4" }
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
  );
}
