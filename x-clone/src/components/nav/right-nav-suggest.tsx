import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "../../firebase";
import {
    FollowButton,
    FollowUserItem,
    RightSuggestBox,
    SetSuggestUserBox,
    SuggestUserText,
} from "../design/layout-menu-design";
import { useFollowToggle } from "../use-follow-toggle"; //
import { useNavigate } from "react-router-dom";

interface User {
    id: string;
    name: string;
    handle: string;
    photoURL?: string;
    isFollowing?: boolean;
}

export default function RightSuggest() {
    const [users, setUsers] = useState<User[]>([]);
    const currentUser = auth.currentUser;
    const navigate = useNavigate();
    const goProfile = (uid: string) => {
        navigate(`/profile/${uid}`);
    };

    // followToggle 훅 사용
    const followToggle = useFollowToggle(currentUser?.uid ?? "", (targetId, newVal) => {
            setUsers((prev) =>
                prev.map((user) =>
                    user.id === targetId ? { ...user, isFollowing: newVal } : user
            )   
        );
    });

    // 팔로워 추천 기능 (페이지 로드시 1회)
    useEffect(() => {
        const fetchSuggestedUsers = async () => {
            if (!currentUser) return;

            try {
                const myUID = currentUser.uid;

                // 전체 사용자 가져오기
                const userSnapshot = await getDocs(collection(db, "users"));
                const allUsers = userSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as User[];

                // 내가 팔로우한 사용자 UID 가져오기
                const followingSnapshot = await getDocs(collection(db, "following", myUID, "userFollowing"));
                const followingUIDs = followingSnapshot.docs.map((doc) => doc.id);

                // 추천 사용자 필터링 및 팔로우 여부 포함
                const suggestedUsers = allUsers
                    .filter((user) => user.id !== myUID && !followingUIDs.includes(user.id))
                    .map((user) => ({
                        ...user,
                        isFollowing: false,
                }));

                // 무작위 셔플 후 최대 3명 선택
                const shuffled = suggestedUsers.sort(() => Math.random() - 0.5);
                const selected = shuffled.slice(0, 3);

                setUsers(selected);
            } catch (err) {
                console.error("추천 유저 불러오기 실패:", err);
            }
        };

        fetchSuggestedUsers();
    }, [currentUser]);

    return (
        <RightSuggestBox>
            <SetSuggestUserBox>
                <SuggestUserText>팔로우 추천</SuggestUserText>
                {users.map((user) => (
                    <FollowUserItem key={user.id} onClick={() => goProfile(user.id)}>
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

                        <FollowButton
                            onClick={followToggle(user.id, user.isFollowing ?? false)}
                            style={{
                                backgroundColor: user.isFollowing ? "#e5e5e5" : "#000",
                                color: user.isFollowing ? "#000" : "#fff",
                                border: "none",
                                cursor: "pointer",
                            }}
                        >{user.isFollowing ? "팔로잉" : "팔로우"}</FollowButton>
                    </FollowUserItem>
                ))}
            </SetSuggestUserBox>
        </RightSuggestBox>
    );
}
