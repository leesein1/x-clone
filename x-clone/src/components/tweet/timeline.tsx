import {
    collection,
    limit,
    onSnapshot,
    orderBy,
    query,
    Timestamp,
    where,
    getDocs,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { db, auth } from "../../firebase";
import Tweet from "./tweet";
import type { Unsubscribe } from "firebase/auth";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko";

dayjs.extend(relativeTime);
dayjs.locale("ko");

export interface ITweet {
    id: string;
    photo: string;
    tweet: string;
    userId: string;
    username: string;
    createdAt: number | { toDate: () => Date };
    userPhotoURL: string;
    createdAtString: string;
    userHandle: string;
}

type TimelineMode = "suggest" | "following";

interface TimelineProps {
    mode: TimelineMode;
}

const Wrapper = styled.div`
    display: flex;
    gap: 10px;
    flex-direction: column;
    overflow-y: scroll;

    scrollbar-width: none;
    -ms-overflow-style: none;

    &::-webkit-scrollbar {
        display: none;
    }
`;

export default function Timeline({ mode }: TimelineProps) {
    const [tweets, setTweets] = useState<ITweet[]>([]);

    useEffect(() => {
        const user = auth.currentUser;
        if (!user) return;

        let unsubscribe: Unsubscribe | null = null;

        const fetchTweets = async () => {
            try {
                let tweetsQuery;

                if (mode === "following") { 
                    const followingSnapshot = await getDocs(
                        collection(db, "following", user.uid, "userFollowing")
                    );

                    const followingUIDs = followingSnapshot.docs.map(doc => doc.id);

                    if (followingUIDs.length === 0) {
                        setTweets([]);
                        return;
                    }
                    tweetsQuery = query(
                        collection(db, "tweets"),
                        where("userId", "in", followingUIDs.slice(0, 10)),
                        orderBy("createdAt", "desc"),
                        limit(25)
                    );
                } else {
                    tweetsQuery = query(
                        collection(db, "tweets"),
                        orderBy("createdAt", "desc"),
                        limit(25)
                    );
                }

                unsubscribe = onSnapshot(tweetsQuery, (snapshot) => {
                    const tweetsArr: ITweet[] = snapshot.docs.map((doc) => {
                        const raw = doc.data() as any;

                        let createdAtMs: number;
                        if (typeof raw.createdAt === "number") {
                            createdAtMs = raw.createdAt;
                        } else if (raw.createdAt instanceof Timestamp) {
                            createdAtMs = raw.createdAt.toMillis();
                        } else {
                            createdAtMs = Date.now();
                        }

                        const createdAtDay = dayjs(createdAtMs);
                        const diffInDays = dayjs().diff(createdAtDay, "day");
                        const createdAtString =
                            diffInDays >= 7
                                ? createdAtDay.format("MM.DD")
                                : createdAtDay.fromNow();

                        return {
                            id: doc.id,
                            tweet: raw.tweet || "",
                            photo: raw.photo || "",
                            userId: raw.userId || "",
                            username: raw.username || "Unknown",
                            userPhotoURL: raw.userPhotoURL || "",
                            createdAt: createdAtMs,
                            createdAtString,
                            userHandle: raw.userHandle || "",
                        };
                    });

                    setTweets(tweetsArr);
                });
            } catch (error) {
                console.error("트윗 로딩 실패:", error);
                setTweets([]);
            }
        };

        fetchTweets();

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [mode]);

    return (
        <Wrapper>
            {tweets.map((tweet) => (
                <Tweet key={tweet.id} {...tweet} />
            ))}
        </Wrapper>
    );
}
