import React, { useEffect, useState } from "react";
import { auth, db, storage } from "../firebase";
import styled from "styled-components";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import { collection, limit, onSnapshot, orderBy, query, where } from "firebase/firestore";
import Tweet from "../components/tweet/tweet";
import type { ITweet } from "../components/tweet/timeline";
import { useOutletContext } from "react-router-dom";

const Wrapper = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
    gap: 20px;
    position: relative;
`;
const AvatarUpload = styled.label`
    width: 80px;
    overflow: hidden;
    height: 80px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    svg {
        width: 50px;
    }
`;
const AvatarImg = styled.img`
    width: 100%;
`;
const AvatarInput = styled.input`
    display: none;
`;
const Name = styled.span`
    display:flex;
    align-items: center;
    font-size: 22px;
    
`;
const Tweets = styled.div`
    display: flex;
    width: 100%;
    flex-direction: column;
    gap: 10px;
`;

const EditProfile = styled.span`
    font-size: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    svg {
        width: 22px;
        height: 22px;
    }
    cursor: pointer;
`;

export default function Profile() {
    const user = auth.currentUser;
    const [avatar, setAvatar] = useState(user?.photoURL);
    const [tweets, setTweets] = useState<ITweet[]>([]);

    // 프로필 수정 outlet
    const {openModalProfileName} = useOutletContext<{
        openModalProfileName: (opts:{ title: string; currentName: string}) => void;
    }>();

    const openModal = () =>{
        openModalProfileName({
            title : "프로필 네임 변경",
            currentName: user?.displayName ?? ""
        })
    }

    // 실시간 트윗 불러오기 (onSnapshot)/
    // useEffect 사용 이유는 훗날 구독 취소를 위해
    useEffect(() => {
        if (!user) return;
        const tweetQuery = query(
            collection(db, "tweets"),
            where("userId", "==", user.uid),
            orderBy("createdAt", "desc"),
            limit(25)
        );
        // 이것때문에 에딧 되면 리랜더링
        const unsubscribe = onSnapshot(tweetQuery, (snapshot) => {
            const tweets = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...(doc.data() as Omit<ITweet, "id">),
            }));
            setTweets(tweets);
        });

        return () => unsubscribe();
    }, [user]);

    // 아바타 업로드
    const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target;
        if (!user || !files || files.length !== 1) return;

        const file = files[0];
        const locationRef = ref(storage, `avatar/${user.uid}`);
        const result = await uploadBytes(locationRef, file);
        const avatarUrl = await getDownloadURL(result.ref);
        setAvatar(avatarUrl);
        await updateProfile(user, {
            photoURL: avatarUrl,
        });
    };

    return (
        <Wrapper>
            <AvatarUpload htmlFor="avatar">
                {avatar ? (
                    <AvatarImg src={avatar} />
                ) : (
                    <svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493a1.23 1.23 0 0 0 .41 1.412A9.957 9.957 0 0 0 10 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 0 0-13.074.003Z" />
                    </svg>
                )}
            </AvatarUpload>
            <AvatarInput onChange={onAvatarChange} id="avatar" type="file" accept="image/*" />
            <Name>
                {user?.displayName ?? "Anonymous"}
                <EditProfile onClick={openModal}>
                    <svg data-slot="icon" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path d="m5.433 13.917 1.262-3.155A4 4 0 0 1 7.58 9.42l6.92-6.918a2.121 2.121 0 0 1 3 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 0 1-.65-.65Z"></path>
                        <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0 0 10 3H4.75A2.75 2.75 0 0 0 2 5.75v9.5A2.75 2.75 0 0 0 4.75 18h9.5A2.75 2.75 0 0 0 17 15.25V10a.75.75 0 0 0-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5Z"></path>
                    </svg>
                </EditProfile>
            </Name>

            <Tweets>
                {tweets.map((tweet) => (
                    <Tweet key={tweet.id} {...tweet} />
                ))}
            </Tweets>
        </Wrapper>
    );
}
