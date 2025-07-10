import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { FollowButton, FollowUserItem, RightSuggestBox, SetSuggestUserBox, SuggestUserText } from "../design/layout-menu-design";


interface User {
    id: string;
    name: string;
    handle: string;
    photoURL?: string;
}

export default function RightSuggest() {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        const fetchRandomUsers = async () => {
        try {
            const snapshot = await getDocs(collection(db, "users"));
            const allUsers = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            })) as User[];

            // ✅ 랜덤 셔플 후 3개 추출
            const shuffled = allUsers.sort(() => Math.random() - 0.5);
            const selected = shuffled.slice(0, 3);

            setUsers(selected);
        } catch (err) {
            console.error("추천 유저 불러오기 실패:", err);
        }
        };

        fetchRandomUsers();
    }, []);

    return (
        <RightSuggestBox>
            <SetSuggestUserBox>
                <SuggestUserText>팔로우 추천</SuggestUserText>
                {users.map((user) => (
                <FollowUserItem key={user.id}>
                    <img
                    src={user.photoURL || "/UserCircle.svg"}
                    alt="프로필"
                    onError={(e) => {
                        e.currentTarget.src = "/UserCircle.svg";
                    }}
                    />
                    <div className="info">
                    <strong>{user.name}</strong>
                    <span>@{user.handle}</span>
                    </div>
                    <FollowButton>팔로우</FollowButton>
                </FollowUserItem>
                ))}
            </SetSuggestUserBox>
        </RightSuggestBox>
    );
}
