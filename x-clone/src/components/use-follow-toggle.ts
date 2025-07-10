import { useCallback } from "react";
import { doc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";

/**
 * 내 UID와 콜백(onToggle)을 받아
 * (상대 UID, 현재 팔로우 상태) => 클릭 핸들러 반환
 */

export function useFollowToggle(myUid: string, onToggle?: (targetUid: string, newValue: boolean) => void) {
    const getToggleHandler = useCallback(
        (targetUid: string, isFollowing: boolean) => {
            return async () => {
                try {
                if (isFollowing) {
                    await deleteDoc(doc(db, "following", myUid, "userFollowing", targetUid));
                    await deleteDoc(doc(db, "followers", targetUid, "userFollowers", myUid));
                } else {
                    await setDoc(doc(db, "following", myUid, "userFollowing", targetUid), {
                    followedAt: Date.now(),
                    });
                    await setDoc(doc(db, "followers", targetUid, "userFollowers", myUid), {
                    followedAt: Date.now(),
                    });
                }

                if (onToggle) {
                    onToggle(targetUid, !isFollowing);
                }
                } catch (err) {
                    console.error("팔로우 토글 실패:", err);
                }
            };
        },[myUid, onToggle]
    );

    return getToggleHandler;
}
