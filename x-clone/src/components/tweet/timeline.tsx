import {
    collection,
    limit,
    orderBy,
    query,
    Timestamp,
    where,
    getDocs,
    startAfter,
    QueryDocumentSnapshot,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { db, auth } from "../../firebase";
import Tweet from "./tweet";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko";
import { useInView } from "react-intersection-observer";

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
    height: 100vh;

    scrollbar-width: none;
    -ms-overflow-style: none;

    &::-webkit-scrollbar {
        display: none;
    }
`;

export default function Timeline({ mode }: TimelineProps) {
    const [tweets, setTweets] = useState<ITweet[]>([]);
    const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot | null>(null);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [expectedImageCount, setExpectedImageCount] = useState(0);
    const [imageLoadCount, setImageLoadCount] = useState(0);

    const { ref, inView } = useInView({
        root: null, // 브라우저 뷰포트 기준
        threshold: 0.2,
    });

    const fetchTweets = async () => {
        const user = auth.currentUser;
        if (!user || loading || !hasMore) return;

        setLoading(true);
        setExpectedImageCount(0);
        setImageLoadCount(0);

        try {
            let tweetsQuery;

            if (mode === "following") {
                const followingSnapshot = await getDocs(
                    collection(db, "following", user.uid, "userFollowing")
                );

                const followingUIDs = followingSnapshot.docs.map(doc => doc.id);
                if (followingUIDs.length === 0) {
                    setHasMore(false);
                    setLoading(false);
                    return;
                }

                tweetsQuery = query(
                    collection(db, "tweets"),
                    where("userId", "in", followingUIDs.slice(0, 10)),
                    orderBy("createdAt", "desc"),
                    ...(lastDoc ? [startAfter(lastDoc)] : []),
                    limit(6)
                );
            } else {
                tweetsQuery = query(
                    collection(db, "tweets"),
                    orderBy("createdAt", "desc"),
                    ...(lastDoc ? [startAfter(lastDoc)] : []),
                    limit(5)
                );
            }

            const snapshot = await getDocs(tweetsQuery);
            const docs = snapshot.docs;

            if (docs.length < 3) setHasMore(false);
            if (docs.length === 0) {
                setLoading(false);
                return;
            }

            const newTweets: ITweet[] = docs.map((doc) => {
                const raw = doc.data() as any;

                const createdAtMs =
                    raw.createdAt instanceof Timestamp
                        ? raw.createdAt.toMillis()
                        : typeof raw.createdAt === "number"
                        ? raw.createdAt
                        : Date.now();

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

            // 이미지가 있는 트윗 수 카운트
            const imageCount = newTweets.filter((tweet) => !!tweet.photo).length;
            setExpectedImageCount(imageCount);

            // 이미지 없으면 바로 loading 해제
            if (imageCount === 0) {
                setLoading(false);
            }

            setTweets(prev => [...prev, ...newTweets]);
            setLastDoc(docs[docs.length - 1]);
        } catch (error) {
            console.error("트윗 로딩 실패:", error);
            setLoading(false);
        }
    };

    const handleImageLoad = () => {
        setImageLoadCount(prev => {
            const next = prev + 1;
            if (next === expectedImageCount) {
                setLoading(false);
            }
            return next;
        });
    };

    // mode 바뀔 때 초기화
    useEffect(() => {
        setTweets([]);
        setLastDoc(null);
        setHasMore(true);
    }, [mode]);

    // 최초 fetch
    useEffect(() => {
        fetchTweets();
    }, [mode]);

    // 스크롤 끝 감지 시 추가 fetch
    useEffect(() => {
        if (inView && !loading && hasMore) {
            fetchTweets();
        }
    }, [inView]);

    return (
        <Wrapper>
            {tweets.map((tweet) => (
                <Tweet key={tweet.id} {...tweet} onImageLoad={handleImageLoad} />
            ))}
            {hasMore && <div ref={ref} style={{ height: "30px" }} />}
            {loading && (
                <div style={{ textAlign: "center", padding: "12px", color: "#666" }}>
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
