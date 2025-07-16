import type { ITweet } from "./timeline";
import { auth } from "../../firebase";
import { useNavigate, useOutletContext } from "react-router-dom";
import { ActionGroup, Actions, ButtonRow, ContentColumn, DateText, Dot, Handle, Header, Payload, ProfileColumn, ProfileImage, TweetImage, Username, Wrapper } from "../design/tweet-design";
import TweetLike from "./tweet-likes"
import TweetReply from "./tweet-reply-btn";
import TweetDelete from "./tweet-delete";
import TweetEdit from "./tweet-edit";
import TweetBookmark from "./tweet-bookmark";

interface TweetProps extends ITweet {
  onImageLoad?: () => void; // 👈 이미지 로딩 후 호출할 함수
}

export default function Tweet({ username, photo, tweet, userId, id, userPhotoURL, createdAtString, userHandle, onImageLoad}: TweetProps) {
    const { openModal, openEditModal } = useOutletContext<{
        openModal: (opts: { title: string; message: string; onConfirm?: () => void }) => void;
        openEditModal : (opts:{ content: string; tweetId: string}) => void;
    }>();

    const user = auth.currentUser;  // 지금 로그인 한 user
    const navigate = useNavigate();

    const goTweet = () => {
        navigate(`/tweet/${id}`);
    };

    return (
        <Wrapper onClick={goTweet}>
            <ProfileColumn>
                <ProfileImage
                    src={userPhotoURL || "/UserCircle.svg"}
                    alt="프로필"
                />
            </ProfileColumn>

            <ContentColumn>
                <Header>
                    <Username>{username}</Username>
                    <Handle>@{userHandle}</Handle>
                    <Dot>-</Dot>
                    <DateText>{createdAtString}</DateText>
                </Header>

                <Payload>{tweet}</Payload>

                {photo && (
                    <TweetImage
                        src={photo}
                        alt="트윗 이미지"
                        onLoad={onImageLoad}
                        onError={onImageLoad}
                    />
                )}

                <Actions>
                    <ActionGroup>
                        {/* 댓글 */}
                        <TweetReply tweetId={id}/>

                        {/* 좋아요 */}
                        <TweetLike tweetId={id}/>

                        {/* 북마크 */}
                        <TweetBookmark
                        tweetId={id}
                        tweetData={{
                            username,
                            tweet,
                            userId,
                            userHandle,
                            createdAtString,
                            photo: photo ?? null,
                            userPhotoURL: userPhotoURL ?? null,
                        }}
                        />
                    </ActionGroup>

                    
                    {user?.uid === userId && (
                    <ActionGroup>
                        {/* 수정 */}
                        <TweetEdit tweetId={id} tweet={tweet} openEditModal={openEditModal} />

                        {/* 삭제 */}
                        <TweetDelete
                            tweetId={id}
                            userId={userId}
                            photo={photo}
                            openModal={openModal}
                        />
                    </ActionGroup>
                    )}
                </Actions>

                {user?.uid === userId && (
                    <ButtonRow>
                    </ButtonRow>
                )}
            </ContentColumn>
        </Wrapper>
    );
}