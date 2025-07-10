import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { db } from "../firebase";
import Tweet from "./tweet";
import type { Unsubscribe } from "firebase/auth";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko";

// dayjs 설정: 한글 + 상대 시간 지원
dayjs.extend(relativeTime);
dayjs.locale("ko");

export interface ITweet {
    id: string;
    photo: string;
    tweet: string;
    userId: string;
    username: string;
    createdAt: number;
    userPhotoURL: string;
    createdAtString: string; // "5분 전" 또는 "07.10"
    userHandle: string;
}

const Wrapper = styled.div`
    display: flex;
    gap: 10px;
    flex-direction: column;
    overflow-y: scroll;

    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE, Edge */

    &::-webkit-scrollbar {
        display: none; /* Chrome, Safari */
    }
`;

export default function Timeline() {
    const [tweets, setTweets] = useState<ITweet[]>([]);

    useEffect(() => {
        let unsubscribe: Unsubscribe | null = null;

        const fetchTweets = async () => {
        const tweetsQuery = query(
            collection(db, "tweets"),
            orderBy("createdAt", "desc"),
            limit(25)
        );

        unsubscribe = onSnapshot(tweetsQuery, (snapshot) => {
            const tweetsArr: ITweet[] = snapshot.docs.map((doc) => {
            const raw = doc.data() as any;

            // createdAt 처리
            let createdAtMs: number;
            if (typeof raw.createdAt === "number") {
                createdAtMs = raw.createdAt;
            } else if (raw.createdAt instanceof Timestamp) {
                createdAtMs = raw.createdAt.toMillis();
            } else {
                createdAtMs = Date.now();
            }

            // 1주일 넘으면 MM.DD, 아니면 ~전
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
                    userHandle: raw.userHandle
                };
            });

            setTweets(tweetsArr);
        });
    };

    fetchTweets();

    return () => {
            if (unsubscribe) unsubscribe();
        };
    }, []);

    return (
        <Wrapper>
            {tweets.map((tweet) => (
                <Tweet key={tweet.id} {...tweet} />
            ))}
        </Wrapper>
    );
}
