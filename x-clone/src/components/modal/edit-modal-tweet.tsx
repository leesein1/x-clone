// EditModal.tsx
import React, { useRef, useState } from "react";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

import { auth, db, storage } from "../../firebase";


// 기존 tweet 폼에서 가져오는 디자인 요소
import { TextArea, BottomRow, LeftIcons, AttachFileButton, AttachFileInput } from "../design/post-tweet-form-design";
import EmojiButton from "../emoji-picker";
import { GlobalModalStyle } from "../design/modal-design";
import { styled } from "styled-components";

interface EditModalProps {
    content: string;
    tweetId: string;
    onClose: () => void;
}// post-tweet-form-design.ts

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
    margin-top:5px;
`;


export default function EditModal({
    content: initialContent,
    tweetId: initialTweetId,
    onClose,
}: EditModalProps) {
    const [content, setContent] = useState(initialContent);
    const [tweetId] = useState(initialTweetId);
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const textAreaRef = useRef<HTMLTextAreaElement>(null); // 이모지 첨부를 위해

    const insertEmoji = (emoji: string) => {
        const textarea = textAreaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;

        const newTweet =
            content.slice(0, start) + emoji + content.slice(end);

        setContent(newTweet);

        // 커서 위치 갱신
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + emoji.length, start + emoji.length);
        }, 0);
    };

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target;
        if (files && files.length === 1) {
            const selectedFile = files[0];
            const MAX_SIZE = 10 * 1024 * 1024;

            if (selectedFile.size > MAX_SIZE) {
                alert("이미지 크기는 최대 10MB까지 업로드할 수 있습니다.");
                setFile(null);
                e.target.value = "";
                return;
            }
            setFile(selectedFile);
        } else {
            setFile(null);
        }
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
            const tweetRef = doc(db, "tweets", tweetId);

            await updateDoc(tweetRef, {
                tweet: content,
                updatedAt: Date.now(),
                username: user.displayName || "Anonymous",
                userId: user.uid,
            });

            if (file) {
                const locationRef = ref(storage, `tweets/${user.uid}/${tweetId}`);
                const result = await uploadBytes(locationRef, file);
                const url = await getDownloadURL(result.ref);

                await updateDoc(tweetRef, {
                photo: url,
                });
            }

            setContent("");
            setFile(null);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
            onClose();
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
                        rows={12}
                    />

                    <BottomRowTweet>
                        <LeftIcons>
                            <AttachFileButton htmlFor="edit-file" title="이미지 첨부">
                            <svg
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden="true"
                            >
                                <path
                                clipRule="evenodd"
                                fillRule="evenodd"
                                d="M1 5.25A2.25 2.25 0 0 1 3.25 3h13.5A2.25 2.25 0 0 1 19 5.25v9.5A2.25 2.25 0 0 1 16.75 17H3.25A2.25 2.25 0 0 1 1 14.75v-9.5Zm1.5 5.81v3.69c0 .414.336.75.75.75h13.5a.75.75 0 0 0 .75-.75v-2.69l-2.22-2.219a.75.75 0 0 0-1.06 0l-1.91 1.909.47.47a.75.75 0 1 1-1.06 1.06L6.53 8.091a.75.75 0 0 0-1.06 0l-2.97 2.97ZM12 7a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"
                                />
                            </svg>
                            </AttachFileButton>
                            <AttachFileInput id="edit-file" type="file" accept="image/*" onChange={onFileChange} />

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
