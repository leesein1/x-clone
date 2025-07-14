import { useState, useRef, useEffect } from "react";
import { auth, db } from "../../firebase";
import {
    InputBox,
    ReplyBox,
    ReplyTextArea,
    ReplySubmitButton,
    ProfileImage,
    SelectItemBox,
} from "../design/tweet-select-design";
import useUserInfo from "../user-info";
import EmojiButton from "../emoji-picker";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export default function TweetReply({ tweetId }: { tweetId: string }) {
    const user = auth.currentUser;
    const uid = user?.uid || null;
    const userInfo = useUserInfo(uid);
    const textAreaRef = useRef<HTMLTextAreaElement>(null); // 이모지 첨부를 위해
    const [reply, setReply] = useState("");

    
    const insertEmoji = (emoji: string) => {
        const textarea = textAreaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;

        const newTweet =
            reply.slice(0, start) + emoji + reply.slice(end);

        setReply(newTweet);

        // 커서 위치 갱신
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + emoji.length, start + emoji.length);
        }, 0);
    };

  // 자동 높이 조절
    useEffect(() => {
        const textarea = textAreaRef.current;
        if (textarea) {
        textarea.style.height = "auto"; // 초기화
        textarea.style.height = `${textarea.scrollHeight}px`; // 실제 높이 설정
        }
    }, [reply]);

    const handleSubmit = async () => {
        if (!reply.trim() || !uid) return;

        try {
            await addDoc(collection(db, "tweets", tweetId, "replies"), {
                userId: uid,
                text: reply.trim(),
                userHandle:userInfo?.handle,
                userPhotoURL:userInfo?.photoURL,
                createdAt: serverTimestamp(),
            });

            setReply(""); // 초기화
        } catch (error) {
            console.error("댓글 등록 오류:", error);
        }
    };

    return (
        <ReplyBox>
            <ProfileImage
                src={userInfo?.photoURL || "/UserCircle.svg"}
                alt="프로필"
            />
            <InputBox>
                <ReplyTextArea
                ref={textAreaRef}
                placeholder="답글 게시하기"
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                rows={1}
                />
                <ReplySubmitButton onClick={handleSubmit} disabled={!reply.trim()}>
                    답글
                </ReplySubmitButton>
                {/* 이모지 및 사진 */}
                <SelectItemBox>
                    <EmojiButton onSelect={insertEmoji} />
                </SelectItemBox>
            </InputBox>
        </ReplyBox>
    );
}
