import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../../firebase";
import {
    ProfileRow,
    ProfileImage,
    Username,
    Handle,
    DateText,
    TweetContent,
    Dot,
    MetaDataRow,
    SubBox
} from "../design/tweet-select-design";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko";
import TweetLike from "./tweet-likes";

dayjs.extend(relativeTime);
dayjs.locale("ko");

interface Reply {
    id: string;
    userId: string;
    username: string;
    userHandle: string;
    userPhotoURL: string;
    text: string;
    createdAt: any;
}

export default function TweetReplyList({ tweetId }: { tweetId: string }) {
    const [replies, setReplies] = useState<Reply[]>([]);

    useEffect(() => {
        const q = query(
            collection(db, "tweets", tweetId, "replies"),
            orderBy("createdAt", "asc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const newReplies = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...(doc.data() as Omit<Reply, "id">),
            }));
            setReplies(newReplies);
        });

        return () => unsubscribe();
    }, [tweetId]);

    return (
        <div style={{ marginTop: "20px" }}>
            {replies.map((reply) => {
                const createdDate = reply.createdAt?.toDate?.();
                const timeAgo = createdDate ? dayjs(createdDate).fromNow() : "";

                return (
                    <div key={reply.id} style={{ padding: "16px 0", borderBottom: "1px solid #eee" }}>
                        <ProfileRow>
                            <ProfileImage src={reply.userPhotoURL || "/UserCircle.svg"} />
                            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", paddingTop:"12px"}}>
                                <MetaDataRow style={{ paddingLeft:"6px", display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                                    <Username style={{ fontSize: "16px", color: "black" }}>{reply.username || "Anonymous"}</Username>
                                    <Handle style={{ fontSize: "16px" }}>@{reply.userHandle}</Handle>
                                    <Dot />
                                    <DateText style={{ fontSize: "16px" }}>{timeAgo}</DateText>
                                </MetaDataRow>
                                <TweetContent style={{ paddingLeft:"6px", fontSize: "15px", margin: "3px 0px" }}>{reply.text}</TweetContent>
                                <SubBox>
                                    <TweetLike tweetId={tweetId} replyId={reply.id} />
                                </SubBox>
                                
                            </div>
                        </ProfileRow>
                    </div>
                );
            })}
        </div>
    );
}
