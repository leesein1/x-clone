import { useOutletContext, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import type { ITweet } from "./timeline";
import {
    Wrapper, ProfileRow, ProfileImage, Username, Handle, DateText,
    TweetContent, TweetMedia, MetaDataRow, ActionRow, ActionIcon, ReplyBox,
    Headers,
    HeaderText,
    BackImg,
    ScrollBox
} from "../design/tweet-select-design";
import TweetLike from "./tweet-likes";
import { auth, db } from "../../firebase";
import TweetReply from "./tweet-reply";
import TweetEdit from "./tweet-edit";
import TweetDelete from "./tweet-delete";
import TweetBookmark from "./tweet-bookmark";

export default function TweetSelect() {
    const { openModal, openEditModal } = useOutletContext<{
        openModal: (opts: { title: string; message: string; onConfirm?: () => void }) => void;
        openEditModal : (opts:{ content: string; tweetId: string}) => void;
    }>();
    
    const { tweetId } = useParams();
    const [tweet, setTweet] = useState<ITweet | null>(null);

    const user = auth.currentUser;
    
    useEffect(() => {
        const fetchTweet = async () => {
            if (!tweetId) return;
            const ref = doc(db, "tweets", tweetId);
            const snap = await getDoc(ref);
            if (snap.exists()) {
                const data = snap.data() as Omit<ITweet, "id">;
                setTweet({ ...data, id: snap.id });
            }
        };
        fetchTweet();
    }, [tweet]);

    if (!tweet) return <div>로딩 중...</div>;

    return (
            <Wrapper>
                <Headers>
                    <BackImg onClick={() => {history.back()}}>
                        <svg data-slot="icon" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path clipRule="evenodd" fillRule="evenodd" d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z" />
                        </svg>
                    </BackImg>
                    <HeaderText>게시물</HeaderText>
                </Headers>
                <ScrollBox>
                    {/* 유저 정보 */}
                    <ProfileRow>
                        <ProfileImage src={tweet.userPhotoURL || "/UserCircle.svg"} />
                        <div>
                        <Username>{tweet.username}</Username>
                        <Handle>@{tweet.userHandle}</Handle>
                        </div>
                    </ProfileRow>

                    {/* 텍스트 */}
                    <TweetContent>{tweet.tweet}</TweetContent>

                    {/* 이미지 */}
                    {tweet.photo && <TweetMedia src={tweet.photo} />}

                    {/* 날짜*/}
                    <MetaDataRow>
                        <DateText>
                        {typeof tweet.createdAt === "object" && "toDate" in tweet.createdAt
                            ? new Date(tweet.createdAt.toDate()).toLocaleString()
                            : new Date(tweet.createdAt).toLocaleString()}
                        </DateText>
                    </MetaDataRow>

                    
                    <ActionRow>
                        {/* 댓글 */}
                        <TweetReply />
                        {/* 좋아요 */}
                        <TweetLike tweetId={tweetId!}/>
                        <TweetBookmark />
                        {user?.uid === tweet.userId && (
                            <>
                                {/* 수정 */}
                                <TweetEdit
                                tweetId={tweetId!}
                                tweet={tweet.tweet}
                                openEditModal={openEditModal}
                                />

                                {/* 삭제 */}
                                <TweetDelete
                                tweetId={tweetId!}
                                userId={tweet.userId}
                                photo={tweet.photo}
                                openModal={openModal}
                                />
                            </>
                        )}

                    </ActionRow>

                    {/* 댓글 입력 */}
                    <ReplyBox>
                        <input placeholder="답글 게시하기" />
                        <button>답글</button>
                    </ReplyBox>
                </ScrollBox>
            </Wrapper>
        );
    }
