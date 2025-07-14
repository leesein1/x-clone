import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { ActionIcon, IconButton } from "../design/tweet-design";

interface TweetReplyDeleteProps {
    tweetId: string;
    replyId: string;
    openModal: (opts: {
        title: string;
        message: string;
        onConfirm?: () => void;
    }) => void;
}

export default function TweetReplyDelete({ tweetId, replyId, openModal }: TweetReplyDeleteProps) {
    const likeDocId = `${tweetId}_reply_${replyId}`;

    const handleDelete = async () => {
        try {
            // 1. userLikes 하위 문서들 삭제
            const userLikesRef = collection(db, "likes", likeDocId, "userLikes");
            const userLikesSnap = await getDocs(userLikesRef);
            const deletions = userLikesSnap.docs.map((docSnap) =>
                deleteDoc(doc(db, "likes", likeDocId, "userLikes", docSnap.id))
            );
            await Promise.all(deletions);

            // 2. 상위 좋아요 문서 삭제
            await deleteDoc(doc(db, "likes", likeDocId));

            // 3. 댓글 삭제
            await deleteDoc(doc(db, "tweets", tweetId, "replies", replyId));
        } catch (err) {
            console.error("댓글 삭제 중 오류 발생:", err);
            alert("댓글 삭제 중 오류가 발생했습니다.");
        }
    };

    const onClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        openModal({
            title: "댓글 삭제",
            message: "정말로 이 댓글을 삭제하시겠습니까?",
            onConfirm: handleDelete,
        });
    };

    return (
        <ActionIcon onClick={(e) => e.stopPropagation()}>
            <IconButton onClick={onClick}>
                <svg stroke="currentColor" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </IconButton>
        </ActionIcon>
    );
}
