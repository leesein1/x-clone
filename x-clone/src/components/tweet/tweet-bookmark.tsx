import { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { ActionIcon, IconButton } from "../design/tweet-design";
import {
    doc,
    getDoc,
    setDoc,
    deleteDoc,
    serverTimestamp,
} from "firebase/firestore";

interface TweetBookMarkProps {
    tweetId: string;
    tweetData: {
        username: string;
        tweet: string;
        userId: string;
        userHandle: string;
        createdAtString: string;
        photo?: string | null;
        userPhotoURL?: string | null;
    };
}

export default function TweetBookmark({ tweetId, tweetData }: TweetBookMarkProps) {
    const user = auth.currentUser;
    const uid = user?.uid;
    const [isBookmarked, setIsBookmarked] = useState(false);

    useEffect(() => {
        if (!uid) return;
        const checkBookmark = async () => {
        const docRef = doc(db, "users", uid, "bookmarks", tweetId);
        const snap = await getDoc(docRef);
        setIsBookmarked(snap.exists());
        };
        checkBookmark();
    }, [uid, tweetId]);

    const toggleBookmark = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!uid) return;

        const userBookmarkRef = doc(db, "users", uid, "bookmarks", tweetId);
        const tweetBookmarkRef = doc(db, "tweets", tweetId, "bookmarkedBy", uid);

        if (isBookmarked) {
        // 북마크 제거
        await deleteDoc(userBookmarkRef);
        await deleteDoc(tweetBookmarkRef);
        setIsBookmarked(false);
        } else {
        // 북마크 추가
        await setDoc(userBookmarkRef, {
            ...tweetData,
            tweetId,
            createdAt: serverTimestamp(),
        });
        await setDoc(tweetBookmarkRef, {
            createdAt: serverTimestamp(),
        });
        setIsBookmarked(true);
        }
    };

    return (
        <ActionIcon onClick={toggleBookmark}>
            <IconButton>
                {isBookmarked ? (
                // 북마크됨 아이콘 (예: 꽉 찬 북마크)
                <svg data-slot="icon" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path clipRule="evenodd" fillRule="evenodd" d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z" />
                </svg>
                ) : (
                // 북마크 안됨 아이콘 (테두리만 있는 북마크)
                <svg data-slot="icon" fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
                </svg>
                )}
            </IconButton>
        </ActionIcon>
    );
}
