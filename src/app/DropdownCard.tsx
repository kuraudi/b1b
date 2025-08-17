import { useEffect, useRef } from "react";

function DropdownCard({ open, setOpen, button, zIndex = 1090, children }) {
  const menuRef = useRef();

  // Закрытие по клику вне
  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, setOpen]);

  // Закрытие по Esc
  useEffect(() => {
    if (!open) return;
    const handleEsc = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [open, setOpen]);

  return (
    <div className="relative" style={{ zIndex }}>
      {button}
      {open && (
        <div
          ref={menuRef}
          className="absolute right-0 top-full mt-2"
          tabIndex={-1}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export default DropdownCard;
