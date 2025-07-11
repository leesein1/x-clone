import { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { doc, getDoc, setDoc, deleteDoc, onSnapshot, collection } from "firebase/firestore";
import { ActionIcon, IconButton } from "../design/tweet-design";

interface TweetLikeProps {
    tweetId: string;
}

export default function TweetLike({ tweetId }: TweetLikeProps) {
    const user = auth.currentUser;
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);

    useEffect(() => {
        if (!user) return;

        const likeDoc = doc(db, "likes", tweetId, "userLikes", user.uid);
        getDoc(likeDoc).then((snap) => {
            setIsLiked(snap.exists());
        });

        const unsub = onSnapshot(collection(db, "likes", tweetId, "userLikes"), (snap) => {
            setLikeCount(snap.size);
        });

        return () => unsub();
    }, [tweetId, user]);

    const toggleLike = async () => {
        if (!user) return;

        const likeRef = doc(db, "likes", tweetId, "userLikes", user.uid);

        if (isLiked) {
            await deleteDoc(likeRef);
            setIsLiked(false);
        } else {
            await setDoc(likeRef, { likedAt: Date.now() });
            setIsLiked(true);
        }
    };

    return (
        <ActionIcon onClick={(e) => e.stopPropagation()}>
            <IconButton onClick={toggleLike}>
                {isLiked ? (
                <svg
                    fill="red"
                    stroke="none"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                >
                    <path d="m9.653 16.915-.005-.003-.019-.01a20.759 20.759 0 0 1-1.162-.682 22.045 22.045 0 0 1-2.582-1.9C4.045 12.733 2 10.352 2 7.5a4.5 4.5 0 0 1 8-2.828A4.5 4.5 0 0 1 18 7.5c0 2.852-2.044 5.233-3.885 6.82a22.049 22.049 0 0 1-3.744 2.582l-.019.01-.005.003h-.002a.739.739 0 0 1-.69.001l-.002-.001Z" />
                </svg>
                ) : (
                <svg
                    fill="#ffffff"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                >
                    <path d="m9.653 16.915-.005-.003-.019-.01a20.759 20.759 0 0 1-1.162-.682 22.045 22.045 0 0 1-2.582-1.9C4.045 12.733 2 10.352 2 7.5a4.5 4.5 0 0 1 8-2.828A4.5 4.5 0 0 1 18 7.5c0 2.852-2.044 5.233-3.885 6.82a22.049 22.049 0 0 1-3.744 2.582l-.019.01-.005.003h-.002a.739.739 0 0 1-.69.001l-.002-.001Z" />
                </svg>
                )}
            </IconButton>
            <span>{likeCount}</span>
        </ActionIcon>
    );
}
