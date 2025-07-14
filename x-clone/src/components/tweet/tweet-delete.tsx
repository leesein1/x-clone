// TweetDelete.tsx
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { ref, deleteObject, listAll } from "firebase/storage";
import { auth, db, storage } from "../../firebase";
import { ActionIcon, IconButton } from "../design/tweet-design";
import { useLocation, useNavigate } from "react-router-dom";

interface TweetDeleteProps {
    tweetId: string;
    userId: string;
    photo?: string;
    openModal: (opts: {
        title: string;
        message: string;
        onConfirm?: () => void;
    }) => void;
}

export default function TweetDelete({ tweetId, userId, photo, openModal }: TweetDeleteProps) {
    const user = auth.currentUser;
    const location = useLocation();
    const navigate = useNavigate();

    const onDelete = () => {
        openModal({
            title: "트윗 삭제",
            message: "정말 이 트윗을 삭제하시겠습니까?",
            onConfirm: async () => {
                if (!user || user.uid !== userId) return;

                try {
                    // 1. 댓글 리스트 불러오기
                    const replySnap = await getDocs(collection(db, "tweets", tweetId, "replies"));
                    const replyDeletions = replySnap.docs.map(async (docSnap) => {
                        const replyId = docSnap.id;

                        // 댓글 좋아요 삭제
                        const likeId = `${tweetId}_reply_${replyId}`;
                        const userLikesSnap = await getDocs(collection(db, "likes", likeId, "userLikes"));
                        const likeDeletions = userLikesSnap.docs.map((likeDoc) =>
                            deleteDoc(doc(db, "likes", likeId, "userLikes", likeDoc.id))
                        );
                        await Promise.all(likeDeletions);
                        await deleteDoc(doc(db, "likes", likeId));

                        // 댓글 자체 삭제
                        await deleteDoc(doc(db, "tweets", tweetId, "replies", replyId));
                    });

                    await Promise.all(replyDeletions);

                    // 2. 트윗 좋아요 삭제
                    const tweetLikesSnap = await getDocs(collection(db, "likes", tweetId, "userLikes"));
                    const tweetLikeDeletions = tweetLikesSnap.docs.map((likeDoc) =>
                        deleteDoc(doc(db, "likes", tweetId, "userLikes", likeDoc.id))
                    );
                    await Promise.all(tweetLikeDeletions);
                    await deleteDoc(doc(db, "likes", tweetId));

                    // 3. 트윗 이미지 삭제 (있을 경우)
                    if (photo) {
                        const photoRef = ref(storage, `tweets/${user.uid}/${tweetId}`);
                        await deleteObject(photoRef).catch(() => {});
                    }

                    // 4. 트윗 삭제
                    await deleteDoc(doc(db, "tweets", tweetId));

                    // 5. 현재 페이지가 디테일 뷰라면 메인으로 이동
                    if (location.pathname.startsWith("/tweet/")) {
                        navigate("/");
                    }
                } catch (e) {
                    console.error("삭제 실패", e);
                }
            },
        });
    };

    return (
        <ActionIcon onClick={(e) => e.stopPropagation()}>
            <IconButton onClick={onDelete}>
                <svg stroke="currentColor" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </IconButton>
        </ActionIcon>
    );
}
