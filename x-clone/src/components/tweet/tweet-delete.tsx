import { doc, deleteDoc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
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
                if (user?.uid !== userId) return;

                try {
                    await deleteDoc(doc(db, "tweets", tweetId));
                    if (photo) {
                        const photoRef = ref(storage, `tweets/${user.uid}/${tweetId}`);
                        await deleteObject(photoRef);
                    }
                    if (location.pathname.startsWith("/tweet/")) navigate("/");
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
