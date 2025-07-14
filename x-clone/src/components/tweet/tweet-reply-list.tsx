import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { auth, db } from "../../firebase";
import {
    ProfileRow,
    ProfileImage,
    Username,
    Handle,
    DateText,
    TweetContent,
    Dot,
    MetaDataRow,
    SubBox,
    MyBox
} from "../design/tweet-select-design";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko";
import TweetLike from "./tweet-likes";
import TweetReplyEdit from "./tweet-reply-edit";
import { useOutletContext } from "react-router-dom";
import TweetReplyDelete from "./tweet-reply-delete";

dayjs.extend(relativeTime);
dayjs.locale("ko");

interface Reply {
    id: string;
    userId: string;
    userName: string;
    userHandle: string;
    userPhotoURL: string;
    text: string;
    createdAt: any;
}

export default function TweetReplyList({ tweetId }: { tweetId: string }) {

    const { openModal, openReplyModal } = useOutletContext<{
        openModal: (opts: { title: string; message: string; onConfirm?: () => void }) => void;
        openReplyModal : (opts:{ content: string; tweetId: string; replyId: string;}) => void;
    }>();


    const [replies, setReplies] = useState<Reply[]>([]);
    const user = auth.currentUser;
    const uid = user?.uid;

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
                            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", paddingTop:"12px", width:"100%"}}>
                                <MetaDataRow style={{ paddingLeft:"6px", display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                                    <Username style={{ fontSize: "16px", color: "black" }}>{reply.userName || "Anonymous"}</Username>
                                    <Handle style={{ fontSize: "16px" }}>@{reply.userHandle}</Handle>
                                    <Dot />
                                    <DateText style={{ fontSize: "16px" }}>{timeAgo}</DateText>
                                </MetaDataRow>
                                <TweetContent style={{ paddingLeft:"6px", fontSize: "15px", margin: "3px 0px" }}>{reply.text}</TweetContent>
                                <SubBox>
                                    <TweetLike tweetId={tweetId} replyId={reply.id} />
                                    {uid === reply.userId && (
                                        <MyBox>
                                            {/* 댓글 수정 */}
                                            <TweetReplyEdit onClick={() =>
                                                openReplyModal({
                                                    content: reply.text,
                                                    tweetId: tweetId,
                                                    replyId: reply.id
                                                })
                                            } />
                                            {/* 댓글 삭제 */}
                                            <TweetReplyDelete
                                                tweetId={tweetId}
                                                replyId={reply.id}
                                                openModal={openModal}
                                            />
                                        </MyBox>
                                    )}
                                </SubBox>
                            </div>
                        </ProfileRow>
                    </div>
                );
            })}
        </div>
    );
}
