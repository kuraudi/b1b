"use client";
import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import VoiceRecorderButton from "./VoiceRecorderButton";
import {
  Mic,
  Paperclip,
  X,
  File as FileIcon,
  Image as ImageIcon,
  Video as VideoIcon,
  Music,
  Smile,
  LinkIcon,
  Send,
} from "lucide-react";

// Категории вложений
const ATTACH_CATEGORIES = [
  {
    key: "photo",
    icon: <ImageIcon size={20} />,
    accept: "image/*",
    label: "Фото",
  },
  {
    key: "video",
    icon: <VideoIcon size={20} />,
    accept: "video/*",
    label: "Видео",
  },
  {
    key: "file",
    icon: <FileIcon size={20} />,
    accept:
      ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar,.7z,.tar,.gz,.csv,.json,.xml,application/*",
    label: "Файл",
  },
  {
    key: "audio",
    icon: <Music size={20} />,
    accept: "audio/*",
    label: "Аудио",
  },
  { key: "gif", icon: <Smile size={20} />, accept: "image/gif", label: "GIF" },
  { key: "link", icon: <LinkIcon size={20} />, accept: "", label: "Ссылка" },
];

export default function ChatFooter({
  activeChat,
  openChatId,
  setReplyTo,
  setActiveChat,
  setMessages,
  setEditMsgId,
  editMsgId,
  setMenuMsgId,
  filteredChats,
  input,
  setInput,
  drafts,
  setDrafts,
  USERS,
  getTimeString,
  getTodayString,
  setFilteredChats,
  replyTo,
  showAttach,
  setShowAttach,
  handleAttachInput,
  authorId,
}) {
  const inputRef = useRef(null);
  const fileInputRef = useRef({});
  const [inputRows, setInputRows] = useState(1);

  // --- Voice recorder state ---
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recorderStream, setRecorderStream] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const recorderTimerRef = useRef(null);

  // --- Автоувеличение высоты textarea ---
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = inputRef.current.scrollHeight + "px";
      const lines = input.split("\n").length;
      setInputRows(Math.max(1, lines));
    }
  }, [input]);

  // --- Сохранять draft для текущего чата ---
  useEffect(() => {
    if (activeChat)
      setDrafts((drafts) => ({ ...drafts, [activeChat.id]: input }));
  }, [input, activeChat, setDrafts]);

  // --- Сброс высоты textarea ---
  function resetTextareaHeight() {
    if (inputRef.current) {
      inputRef.current.style.height = "44px";
      setInputRows(1);
    }
  }

  // --- Voice recorder logic ---
  function stopAndCleanupRecorder() {
    // Остановить все медиа и таймер
    if (mediaRecorder) {
      try {
        mediaRecorder.stream.getTracks().forEach((track) => track.stop());
      } catch {}
      setMediaRecorder(null);
    }
    if (recorderStream) {
      try {
        recorderStream.getTracks().forEach((track) => track.stop());
      } catch {}
      setRecorderStream(null);
    }
    if (recorderTimerRef.current) {
      clearInterval(recorderTimerRef.current);
      recorderTimerRef.current = null;
    }
    setIsRecording(false);
    setRecordingTime(0);
  }

  async function handleStartRecording() {
    if (isRecording) return;
    // Перед стартом записи обязательно сброc предыдущего таймера
    if (recorderTimerRef.current) {
      clearInterval(recorderTimerRef.current);
      recorderTimerRef.current = null;
    }
    setRecordingTime(0);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new window.MediaRecorder(stream, {
        mimeType: "audio/webm; codecs=opus",
      });
      let chunks = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      const getAudioDuration = (blob) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const audioContext = new AudioContext();
            audioContext.decodeAudioData(
              reader.result,
              (buffer) => resolve(buffer.duration),
              () => reject(new Error("decodeAudioData failed"))
            );
          };
          reader.onerror = () => reject(new Error("FileReader error"));
          reader.readAsArrayBuffer(blob);
        });

      recorder.onstop = async () => {
        const blob = new Blob(chunks, { type: "audio/webm; codecs=opus" });
        const url = URL.createObjectURL(blob);
        let duration = 0;
        try {
          duration = await getAudioDuration(blob);
          if (isNaN(duration) || duration === Infinity) duration = 0;
        } catch {
          duration = 0;
        }
        setFilteredChats((chats) =>
          chats.map((chat) =>
            chat.id === openChatId
              ? {
                  ...chat,
                  messages: [
                    ...chat.messages,
                    {
                      id: Date.now(),
                      author: "Вы",
                      authorId: authorId,
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
                  ],
                }
              : chat
          )
        );
        stopAndCleanupRecorder();
      };

      setMediaRecorder(recorder);
      setRecorderStream(stream);
      setIsRecording(true);
      recorder.start();

      recorderTimerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      alert("Не удалось получить доступ к микрофону");
      stopAndCleanupRecorder();
    }
  }

  function handleStopRecording() {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop();
      // Сброс таймера произойдет в onstop
    }
  }

  // --- Отправка текста с сохранением переносов строк ---
  function handleSend() {
    if (editMsgId) {
      setFilteredChats((chats) =>
        chats.map((chat) => {
          if (chat.id === openChatId) {
            return {
              ...chat,
              messages: chat.messages.map((m) =>
                m.id === editMsgId ? { ...m, text: input, edited: true } : m
              ),
            };
          }
          return chat;
        })
      );
      setEditMsgId(null);
      setInput("");
      setReplyTo(null);
      setDrafts((prevDrafts) => {
        const copy = { ...prevDrafts };
        if (activeChat?.id) delete copy[activeChat.id];
        return copy;
      });
      resetTextareaHeight();
      return;
    }

    if (input.trim()) {
      const newMsg = {
        id: Date.now(),
        author: "Вы",
        authorId: authorId,
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
        readBy: [1],
      };

      setFilteredChats((chats) =>
        chats.map((chat) =>
          chat.id === openChatId
            ? { ...chat, messages: [...chat.messages, newMsg] }
            : chat
        )
      );

      setInput("");
      setReplyTo(null);
      setDrafts((prevDrafts) => {
        const copy = { ...prevDrafts };
        if (activeChat?.id) delete copy[activeChat.id];
        return copy;
      });
      resetTextareaHeight();
    }
  }

  function handleInputKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  //   function VoiceRecorderButton() {
  //     return (
  //       <motion.button
  //         whileTap={{ scale: 0.93 }}
  //         className={`relative rounded-full transition-all duration-200 flex items-center justify-center shadow-lg ${
  //           isRecording
  //             ? "bg-gradient-to-tr from-[#ff5555] to-[#ff8c6f] text-white shadow-[0_0_0_6px_#ff555550]"
  //             : "bg-[#232b32] text-[#2fd4c6] hover:bg-gradient-to-tr hover:from-[#2fd4c6] hover:to-[#191b1f] hover:text-white"
  //         }`}
  //         title={isRecording ? "Стоп запись" : "Голосовое"}
  //         onMouseDown={isRecording ? handleStopRecording : handleStartRecording}
  //         onTouchStart={isRecording ? handleStopRecording : handleStartRecording}
  //         style={{
  //           minWidth: 54,
  //           minHeight: 54,
  //           boxShadow: isRecording ? "0 0 12px #ff5555" : "0 2px 12px #191b1f30",
  //           outline: isRecording ? "3px solid #ff5555" : "none",
  //         }}
  //         disabled={isRecording && !mediaRecorder}
  //       >
  //         <Mic size={30} />
  //         {isRecording && <VoiceWaveAnimation />}
  //       </motion.button>
  //     );
  //   }

  function VoiceWaveAnimation() {
    return (
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        animate={{
          scale: [1, 1.18, 1],
          opacity: [0.7, 1, 0.7],
        }}
        transition={{
          repeat: Infinity,
          duration: 1.1,
          ease: "easeInOut",
        }}
      >
        <div className="rounded-full border-4 border-[#ff5555] opacity-50 w-14 h-14" />
        <motion.div
          className="absolute"
          animate={{
            scale: [1, 1.07, 1],
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{
            repeat: Infinity,
            duration: 1.1,
            ease: "easeInOut",
          }}
        >
          <div className="rounded-full border-2 border-[#ff8c6f] w-10 h-10 opacity-60" />
        </motion.div>
      </motion.div>
    );
  }

  function SendButton() {
    return (
      <motion.button
        whileHover={{
          scale: 1.045,
          boxShadow: "0 0 0 5px #2fd4c61a",
        }}
        whileTap={{ scale: 0.97 }}
        className={`
        flex items-center justify-center gap-2
        bg-gradient-to-r from-[#44434b] via-[#3f3854] to-[#3a283e]
        text-[#2fd4c6] font-medium rounded-xl px-5 py-1.5
        border border-[#232228]
        shadow-[0_2px_12px_#2fd4c622]
        disabled:opacity-50
        focus:outline-none
        focus:ring-2 focus:ring-[#2fd4c6]
        relative overflow-hidden select-none
      `}
        onClick={handleSend}
        disabled={!input.trim() || isRecording}
        type="button"
        style={{
          fontSize: "1.08rem",
          letterSpacing: "0.02em",
          minHeight: 36,
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Акцентная линия снизу при фокусе */}
        <motion.span
          layout
          className="absolute left-0 bottom-0 w-full h-[3px] pointer-events-none"
          initial={{ opacity: 0 }}
          animate={
            document?.activeElement?.type === "button"
              ? { opacity: 1 }
              : { opacity: 0 }
          }
          style={{
            background: "linear-gradient(90deg, #2fd4c6 0%, #6e60a9 100%)",
            boxShadow: "0 0 8px 1px #2fd4c633",
            borderRadius: "0 0 14px 14px",
            zIndex: 0,
            transition: "opacity 0.24s",
          }}
        />

        {/* SVG-иконка c аккуратным градиентом */}
        <span className="relative z-10 flex items-center">
          <Send size={24} strokeWidth={2} />{" "}
          <span className="ml-2">Отправить</span>
        </span>
      </motion.button>
    );
  }

  return (
    <footer className="relative flex items-center gap-3 px-4 py-1 bg-gradient-to-r from-[#23232b] via-[#1c1f24] to-[#23232b] border-t border-[#191b1f] shadow-2xl">
      <div className="relative flex items-center gap-2">
        {/* Микрофон */}
        <VoiceRecorderButton
          isRecording={isRecording}
          recordingTime={recordingTime}
          onStart={handleStartRecording}
          onStop={handleStopRecording}
          mediaRecorder={mediaRecorder}
        />
        {/* Всплывающий таймер и стоп */}
        {/* Кнопка вложений */}
        <motion.button
          whileHover={{ scale: 1.09 }}
          className="text-[#2fd4c6] hover:bg-[#242f36] rounded-full p-2 focus:outline-none transition"
          onClick={() => setShowAttach((v) => !v)}
          title="Прикрепить файл"
          type="button"
        >
          <PaperclipIcon />
        </motion.button>
        <AnimatePresence>
          {showAttach && (
            <motion.div
              initial={{ opacity: 0, y: 25, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              className="absolute z-50 left-0 bottom-full mb-2 bg-[#23232b] border border-[#2fd4c6]/20 rounded-2xl shadow-2xl py-2 px-1 flex flex-col gap-1 min-w-[180px]"
            >
              {ATTACH_CATEGORIES.filter((a) => a.key !== "voice").map((cat) => (
                <label
                  key={cat.key}
                  className="flex items-center gap-2 px-4 py-2 text-[#e6eaf1] hover:bg-[#2fd4c6]/10 rounded-xl cursor-pointer"
                >
                  <input
                    type="file"
                    accept={cat.accept}
                    multiple={false}
                    className="hidden"
                    ref={(el) => {
                      if (!fileInputRef.current) fileInputRef.current = {};
                      fileInputRef.current[cat.key] = el;
                    }}
                    onChange={(e) => {
                      handleAttachInput(cat.key, e);
                      setShowAttach(false);
                      e.target.value = "";
                    }}
                  />
                  <span>{cat.icon}</span>
                  <span className="text-[15px]">{cat.label}</span>
                </label>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <motion.div
        className="flex-1 flex items-center bg-gradient-to-r from-[rgb(35,35,43)] via-[#20272b] to-[#242424] rounded-2xl shadow-[0_3px_10px_-8px_#aa37aa] border border-[#2d2d2d] px-3 py-1"
        style={{ minHeight: "36px" }}
      >
        <textarea
          ref={inputRef}
          className="
      w-full
      bg-transparent
      text-[#e2eafc]
      rounded-xl
      px-2 py-1
      focus:outline-none
      placeholder:text-[#b3b3b3bb]
      transition
      resize-none
      font-nekstregular
      shadow-none
    "
          placeholder="Введите сообщение…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleInputKeyDown}
          rows={inputRows}
          disabled={isRecording}
          style={{
            minHeight: "28px",
            maxHeight: "120px",
            overflow: "hidden",
            lineHeight: "1.5",
            fontSize: "1.02rem",
            letterSpacing: "0.01em",
            background: "transparent",
          }}
        />
      </motion.div>
      <SendButton />
    </footer>
  );
}

function PaperclipIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={22}
      height={22}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      {...props}
    >
      <path d="M21.44 11.05l-8.49 8.49a5.5 5.5 0 0 1-7.78-7.78l8.49-8.49a3.5 3.5 0 0 1 4.95 4.95l-8.49 8.49a1.5 1.5 0 1 1-2.12-2.12l8.49-8.49" />
    </svg>
  );
}
