import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

interface UserInfo {
    handle: string | null;
    name: string | null;
    photoURL: string | null;
    id : string | "";
}

export default function useUserInfo(uid: string | null) {
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

    useEffect(() => {
        if (!uid) return;
        const ref = doc(db, "users", uid);
        const unsubscribe = onSnapshot(ref, (snap) => {
            if (!snap.exists()) return;

            const data = snap.data();
            const next = {
            handle: data.handle || null,
            name: data.name || null,
            photoURL: data.photoURL || null,
            id: data.uid || null,
            };
            
            setUserInfo((prev) => {
            const isSame = JSON.stringify(prev) === JSON.stringify(next);
            return isSame ? prev : next;
            });
        });

        return () => unsubscribe();
    }, [uid]);



    return userInfo;
}
