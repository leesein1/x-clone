import { useEffect, useRef, useState } from "react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data/sets/14/twitter.json";

export default function EmojiButton({ onSelect }: { onSelect: (emoji: string) => void }) {
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
    if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowPicker(false);
      }
    }

    if (showPicker) {
      document.addEventListener("mousedown", handleClickOutside, true); // 캡처링 단계
    } else {
      document.removeEventListener("mousedown", handleClickOutside, true);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside, true);
    };
  }, [showPicker]);

  return (
    <div style={{ position: "relative"}} ref={pickerRef}>
      {/* 이모지 아이콘 버튼 */}
    <button
        type="button"
        ref={buttonRef}
        onClick={() => setShowPicker((prev) => !prev)}
        style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "24px",
            display:"flex"
        }}
        aria-label="이모지 선택"
    >
        <svg data-slot="icon" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path clipRule="evenodd" fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.536-4.464a.75.75 0 1 0-1.061-1.061 3.5 3.5 0 0 1-4.95 0 .75.75 0 0 0-1.06 1.06 5 5 0 0 0 7.07 0ZM9 8.5c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S7.448 7 8 7s1 .672 1 1.5Zm3 1.5c.552 0 1-.672 1-1.5S12.552 7 12 7s-1 .672-1 1.5.448 1.5 1 1.5Z" />
        </svg>
      </button>

      {/* Emoji Picker */}
      {showPicker && (
        <div style={{ position: "absolute", top: "100%", zIndex: 100 }}>
          <Picker
            data={data}
            onEmojiSelect={(emoji: any) => {
              onSelect(emoji.native);
              setShowPicker(false);
            }}
            theme="light"
            previewPosition="none"
          />
        </div>
      )}
    </div>
  );
}
