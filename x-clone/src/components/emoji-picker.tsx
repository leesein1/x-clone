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
        <svg data-slot="icon" fill="none" strokeWidth={1.5} stroke="#1d9bf0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" />
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
