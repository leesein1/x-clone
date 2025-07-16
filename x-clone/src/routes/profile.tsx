import React, { useEffect, useState } from "react";
import { auth, db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
import Tweet from "../components/tweet/tweet";
import type { ITweet } from "../components/tweet/timeline";
import { useOutletContext, useParams } from "react-router-dom";
import useUserInfo from "../components/user-info";
import {
    AvatarImg,
    AvatarInput,
    AvatarUpload,
    EditProfile,
    Name,
    Tweets,
    Wrapper,
} from "../components/design/profile-design";
import {
    StickyBox2,
    Tab,
    TabBox,
    TabText,
} from "../components/design/home-design";

export default function Profile() {
    const user = auth.currentUser;
    const { selectUserId } = useParams();
    const sUserInfo = useUserInfo(selectUserId!);
    const targetId = sUserInfo?.id || selectUserId;
    const [activeTab, setActiveTab] = useState<"tweet" | "bookmark">("tweet");
    const [avatar, setAvatar] = useState<string | null>(null);
    const [tweets, setTweets] = useState<ITweet[]>([]);
    const [loading, setLoading] = useState(true);
    const [expectedImageCount, setExpectedImageCount] = useState(0);
    const [imageLoadCount, setImageLoadCount] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const { openModalProfileName } = useOutletContext<{
        openModalProfileName: (opts: { title: string; currentName: string }) => void;
    }>();

    const handleImageLoad = () => {
        setImageLoadCount((prev) => {
        const next = prev + 1;
        if (next === expectedImageCount) {
            setLoading(false);
        }
        return next;
        });
    };

    useEffect(() => {
        if (sUserInfo?.photoURL) {
        setAvatar(sUserInfo.photoURL);
        } else {
        setAvatar(null);
        }
    }, [sUserInfo?.photoURL]);

    const openModal = () => {
        openModalProfileName({
        title: "프로필 네임 변경",
        currentName: user?.displayName ?? "",
        });
    };

    useEffect(() => {
        if (!targetId) return;

        setLoading(true);
        setExpectedImageCount(0);
        setImageLoadCount(0);

        if (activeTab === "tweet") {
        const tweetQuery = query(
            collection(db, "tweets"),
            where("userId", "==", targetId),
            orderBy("createdAt", "desc"),
            limit(25)
        );

        const unsubscribe = onSnapshot(tweetQuery, (snapshot) => {
            const tweets = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...(doc.data() as Omit<ITweet, "id">),
            }));
            setTweets(tweets);

            const count = tweets.filter((t) => !!t.photo).length;
            setExpectedImageCount(count);
            if (count === 0) setLoading(false);

            setHasMore(tweets.length >= 25);
        });

        return () => unsubscribe();
        }

        if (activeTab === "bookmark" && user?.uid === targetId) {
        const bookmarkRef = collection(db, "users", user.uid, "bookmarks");

        const unsubscribe = onSnapshot(bookmarkRef, async (snapshot) => {
            const tweetIds = snapshot.docs.map((doc) => doc.id);
            const tweetPromises = tweetIds.map(async (id) => {
            const tweetDoc = await getDoc(doc(db, "tweets", id));
            if (tweetDoc.exists()) {
                return {
                id: tweetDoc.id,
                ...(tweetDoc.data() as Omit<ITweet, "id">),
                };
            }
            return null;
            });

            const resolved = await Promise.all(tweetPromises);
            const filtered = resolved.filter((t): t is ITweet => t !== null);
            setTweets(filtered);

            const count = filtered.filter((t) => !!t.photo).length;
            setExpectedImageCount(count);
            if (count === 0) setLoading(false);

            setHasMore(filtered.length >= 25);
        });

        return () => unsubscribe();
        }
    }, [targetId, activeTab]);

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

    if (!sUserInfo) return <div>Loading...</div>;

    return (
        <Wrapper>
        <StickyBox2>
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
            {sUserInfo.name ?? "Anonymous"}
            {sUserInfo.id === user?.uid && (
                <EditProfile onClick={openModal}>
                <svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="m5.433 13.917 1.262-3.155A4 4 0 0 1 7.58 9.42l6.92-6.918a2.121 2.121 0 0 1 3 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 0 1-.65-.65Z"></path>
                    <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0 0 10 3H4.75A2.75 2.75 0 0 0 2 5.75v9.5A2.75 2.75 0 0 0 4.75 18h9.5A2.75 2.75 0 0 0 17 15.25V10a.75.75 0 0 0-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5Z"></path>
                </svg>
                </EditProfile>
            )}
            </Name>
        </StickyBox2>

        {sUserInfo.id === user?.uid && (
            <TabBox>
            <Tab onClick={() => setActiveTab("tweet")}> 
                <TabText active={activeTab === "tweet"}>게시물</TabText>
            </Tab>
            <Tab onClick={() => setActiveTab("bookmark")}> 
                <TabText active={activeTab === "bookmark"}>북마크</TabText>
            </Tab>
            </TabBox>
        )}

        <Tweets>
            {tweets.map((tweet) => (
            <Tweet key={tweet.id} {...tweet} onImageLoad={handleImageLoad} />
            ))}
        </Tweets>

        {loading && (
            <div style={{ textAlign: "center", padding: "20px", color: "#999" }}>
            🔄 불러오는 중...
            </div>
        )}

        {!hasMore && !loading && (
            <div style={{ textAlign: "center", color: "#aaa", padding: "20px" }}>
            😥 더 이상 불러올 트윗이 없어요.
            </div>
        )}
        </Wrapper>
    );
}
