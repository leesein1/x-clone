import { collection, getDocs, limit, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { db } from "../firebase";
import Tweet from "./tweet";
import type { Unsubscribe } from "firebase/auth";


export interface ITweet {
    id: string;
    photo: string;
    tweet: string;
    userId: string;
    username: string;
    createdAt: number;
}

const Wrapper = styled.div`
    display: flex;
    gap: 10px;
    flex-direction: column;
    overflow-y: scroll;

    /* 스크롤바 숨기기 */
    scrollbar-width: none;          /* Firefox */
    -ms-overflow-style: none;       /* IE, Edge */
    
    &::-webkit-scrollbar {
    display: none;                /* Chrome, Safari */
`;

export default function Timeline() {
    const [tweets, setTweets] = useState<ITweet[]>([]);

    useEffect(() => {
        let unsubscribe : Unsubscribe | null = null;

        const fetchTweets = async () => {
            const tweetsQuery = query(
                collection(db, "tweets"),
                orderBy("createdAt", "desc"),
                limit(25)
            );

                // DB변동사항 감지 하는 query
            unsubscribe =  onSnapshot(tweetsQuery, (snapshot) =>{
                const tweetsArr: ITweet[] = snapshot.docs.map(doc => ({
                    id: doc.id, // 꼭 넣어야 함!
                    ...(doc.data() as Omit<ITweet, 'id'>),
                }));

                setTweets(tweetsArr);
            }); 
        };
        fetchTweets();
        // 컴포넌트 해제시 타임라인 이벤트 리스너 해제
        return () => {
            unsubscribe && unsubscribe();
        }
    }, []);

    return (
        <Wrapper>
            {tweets.map(tweet => <Tweet key={tweet.id}{...tweet}></Tweet>)}
        </Wrapper>
    );
}
