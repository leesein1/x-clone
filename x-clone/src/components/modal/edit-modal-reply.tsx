// components/tweet/EditReplyModal.tsx
import React, { useRef, useState } from "react";
import Modal from "react-modal";
import { doc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

import { auth, db } from "../../firebase";
import { TextArea, BottomRow, LeftIcons } from "../design/post-tweet-form-design";
import { GlobalModalStyle } from "../design/modal-design";
import EmojiButton from "../emoji-picker";
import { styled } from "styled-components";

interface EditReplyModalProps {
    content: string;
    replyId: string;
    tweetId: string;
    onClose: () => void;
}

const SubmitBtn = styled.button`
    background-color: #1d9bf0;
    color: white;
    border: none;
    border-radius: 9999px;
    padding: 8px 16px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
        background-color: #1a8cd8;
    }

    &:disabled {
        opacity: 0.5;
        cursor: default;
    }
`;

const BottomRowTweet = styled(BottomRow)`
  margin-top: 5px;
`;

export default function EditReplyModal({
    content: initialContent,
    replyId,
    tweetId,
    onClose,
    }: EditReplyModalProps) {
        const [content, setContent] = useState(initialContent);
        const [isLoading, setIsLoading] = useState(false);
        const navigate = useNavigate();
        const textAreaRef = useRef<HTMLTextAreaElement>(null);

        const insertEmoji = (emoji: string) => {
        const textarea = textAreaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;

        const newContent = content.slice(0, start) + emoji + content.slice(end);
        setContent(newContent);

        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + emoji.length, start + emoji.length);
        }, 0);
    };

    const onUpdate = async () => {
        if (isLoading || content.trim() === "" || content.length > 180) return;

        const user = auth.currentUser;
        if (!user) {
            alert("로그인이 필요합니다.");
            navigate("/login");
            return;
        }

        try {
            setIsLoading(true);
            const replyRef = doc(db, "tweets", tweetId, "replies", replyId);

            await updateDoc(replyRef, {
                text: content.trim(),
                updatedAt: Date.now(),
            });

            onClose();
        } catch (e) {
            console.error("댓글 수정 오류:", e);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
        <GlobalModalStyle />

        <Modal
            isOpen
            onRequestClose={onClose}
            ariaHideApp={false}
            overlayClassName="modal-overlay"
            className="modal-content"
        >
            <TextArea
            ref={textAreaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="내용을 수정하세요"
            rows={10}
            />

            <BottomRowTweet>
            <LeftIcons>
                <EmojiButton onSelect={insertEmoji} />
            </LeftIcons>

            <SubmitBtn type="button" onClick={onUpdate} disabled={isLoading}>
                {isLoading ? "수정 중..." : "수정하기"}
            </SubmitBtn>
            </BottomRowTweet>
        </Modal>
        </>
    );
}
