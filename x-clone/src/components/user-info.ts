import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

interface UserInfo {
    handle: string | null;
    name: string | null;
    photoURL: string | null;
}

export default function useUserInfo(uid: string | null) {
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

    useEffect(() => {
        if (!uid) return;

        const ref = doc(db, "users", uid);

        const unsubscribe = onSnapshot(ref, (snap) => {
            if (snap.exists()) {
                const data = snap.data();
                    setUserInfo({
                    handle: data.handle || null,
                    name: data.name || null,
                    photoURL: data.photoURL || null,
                });
            }
        });

        return () => unsubscribe();
    }, [uid]);

    return userInfo;
}
